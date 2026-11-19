import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

const PORT = Number(process.env.PORT) || 3001;
const COLLECTION_NAME = 'celebration_wishes';
const SLUG_PATTERN = /^[a-z0-9-]+$/i;
const DEFAULT_ROLE = 'Thành viên CLB Vovinam Thanh Xuân';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_POSTS = 10;
const postTimestampsByIp = new Map();

let mongoClient = null;
let wishesCollection = null;
let dbConnected = false;
let connectPromise = null;

function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim());
}

async function ensureDbCollection() {
  if (wishesCollection && dbConnected) {
    return wishesCollection;
  }

  if (!isDbConfigured()) {
    dbConnected = false;
    return null;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = (async () => {
    try {
      const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      await client.connect();
      const db = client.db();
      await db.command({ ping: 1 });
      const collection = db.collection(COLLECTION_NAME);
      await collection
        .createIndex({ occasionSlug: 1, createdAtIso: -1 })
        .catch(() => {});

      mongoClient = client;
      wishesCollection = collection;
      dbConnected = true;
      console.log('[server] Connected to MongoDB.');
      return wishesCollection;
    } catch {
      dbConnected = false;
      wishesCollection = null;
      console.error('[server] Unable to connect to MongoDB. Check MONGODB_URI configuration.');
      return null;
    } finally {
      connectPromise = null;
    }
  })();

  return connectPromise;
}

function formatVietnamDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip || 'unknown';
  const existing = postTimestampsByIp.get(key) || [];
  const recent = existing.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_POSTS) {
    postTimestampsByIp.set(key, recent);
    return false;
  }

  recent.push(now);
  postTimestampsByIp.set(key, recent);

  if (postTimestampsByIp.size > 1000) {
    for (const [k, timestamps] of postTimestampsByIp.entries()) {
      const valid = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
      if (valid.length === 0) {
        postTimestampsByIp.delete(k);
      } else {
        postTimestampsByIp.set(k, valid);
      }
    }
  }

  return true;
}

function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 100 && SLUG_PATTERN.test(slug);
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '16kb' }));

// Handle malformed JSON payloads safely
app.use((err, _req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Dữ liệu JSON không hợp lệ.' });
    return;
  }
  if (err && err.type === 'entity.too.large') {
    res.status(413).json({ error: 'Nội dung gửi lên quá lớn.' });
    return;
  }
  next(err);
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    dbConfigured: isDbConfigured(),
    dbConnected,
  });
});

app.get('/api/wishes/:slug', async (req, res) => {
  const { slug } = req.params;
  if (!isValidSlug(slug)) {
    res.status(400).json({ error: 'Định danh dịp lễ không hợp lệ.' });
    return;
  }

  const collection = await ensureDbCollection();
  if (!collection) {
    res.status(503).json({
      error: 'Dịch vụ lưu bút trực tuyến hiện chưa sẵn sàng.',
    });
    return;
  }

  try {
    const normalizedSlug = slug.toLowerCase();
    const docs = await collection
      .find({ occasionSlug: normalizedSlug })
      .sort({ createdAtIso: -1 })
      .limit(100)
      .toArray();

    const wishes = docs.map((doc) => ({
      id: String(doc._id),
      author: doc.author,
      role: doc.role,
      message: doc.message,
      createdAt: doc.createdAt,
    }));

    res.json({ wishes });
  } catch {
    dbConnected = false;
    res.status(503).json({ error: 'Không thể tải danh sách lời chúc lúc này.' });
  }
});

app.post('/api/wishes/:slug', async (req, res) => {
  const { slug } = req.params;
  if (!isValidSlug(slug)) {
    res.status(400).json({ error: 'Định danh dịp lễ không hợp lệ.' });
    return;
  }

  if (!checkRateLimit(req.ip)) {
    res.status(429).json({
      error: 'Bạn gửi lời chúc quá nhanh. Vui lòng thử lại sau 1 phút.',
    });
    return;
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const author = typeof body.author === 'string' ? body.author.trim() : '';
  const roleInput = typeof body.role === 'string' ? body.role.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (author.length < 1 || author.length > 80) {
    res.status(400).json({ error: 'Họ tên phải từ 1 đến 80 ký tự.' });
    return;
  }

  if (roleInput.length > 100) {
    res.status(400).json({ error: 'Vai trò / Khóa không được vượt quá 100 ký tự.' });
    return;
  }

  if (message.length < 1 || message.length > 600) {
    res.status(400).json({ error: 'Lời chúc phải từ 1 đến 600 ký tự.' });
    return;
  }

  const collection = await ensureDbCollection();
  if (!collection) {
    res.status(503).json({
      error: 'Dịch vụ lưu bút trực tuyến hiện chưa sẵn sàng.',
    });
    return;
  }

  try {
    const now = new Date();
    const doc = {
      occasionSlug: slug.toLowerCase(),
      author,
      role: roleInput || DEFAULT_ROLE,
      message,
      createdAt: formatVietnamDate(now),
      createdAtIso: now.toISOString(),
    };

    const result = await collection.insertOne(doc);
    res.status(201).json({
      wish: {
        id: String(result.insertedId),
        author: doc.author,
        role: doc.role,
        message: doc.message,
        createdAt: doc.createdAt,
      },
    });
  } catch {
    dbConnected = false;
    res.status(503).json({ error: 'Không thể lưu lời chúc lúc này. Vui lòng thử lại sau.' });
  }
});

// Unknown API routes return 404 JSON
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Không tìm thấy API endpoint.' });
});

// Static assets with appropriate caching
app.use(
  '/assets',
  express.static(path.join(distDir, 'assets'), {
    maxAge: '365d',
    immutable: true,
  })
);
app.use(
  '/images',
  express.static(path.join(distDir, 'images'), {
    maxAge: '7d',
  })
);
app.use(express.static(distDir, { index: false }));

// SPA fallback for all non-API GET routes
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    next();
    return;
  }
  if (!fs.existsSync(indexHtmlPath)) {
    res.status(503).send('Ứng dụng chưa được build (thiếu thư mục dist).');
    return;
  }
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(indexHtmlPath);
});

// Safe fallback error handler
app.use((_err, _req, res, _next) => {
  res.status(500).json({ error: 'Đã xảy ra lỗi hệ thống.' });
});

// Attempt initial DB connection on startup without blocking or crashing
if (isDbConfigured()) {
  ensureDbCollection().catch(() => {});
} else {
  console.warn('[server] MONGODB_URI is not set. Running in degraded mode (wishes API returns 503).');
}

const server = app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    if (mongoClient) {
      await mongoClient.close().catch(() => {});
    }
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
