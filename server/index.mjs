import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { closeDb, getDb, getDbStatus, markDbDisconnected } from './lib/db.mjs';
import * as manifest from './lib/manifest.mjs';
import { createRateLimiter } from './lib/rateLimit.mjs';
import { createHealthRouter } from './modules/health.mjs';
import { createOgMetaHandler } from './modules/ogMeta.mjs';
import { createWishesRouter } from './modules/wishes.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 3001;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '16kb' }));

// Handle malformed or oversized JSON payloads safely
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

// Modular API routers
app.use('/api/health', createHealthRouter({ getDbStatus }));
app.use(
  '/api/wishes',
  createWishesRouter({ getDb, manifest, createRateLimiter, markDbDisconnected })
);

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

// Per-URL OG meta injection & SPA fallback
app.use(createOgMetaHandler({ distDir, manifest }));

// Safe global fallback error handler
app.use((_err, _req, res, _next) => {
  res.status(500).json({ error: 'Đã xảy ra lỗi hệ thống.' });
});

// Attempt initial DB connection on startup without blocking or crashing
if (getDbStatus().dbConfigured) {
  getDb().catch(() => {});
} else {
  console.warn('[server] MONGODB_URI is not set. Running in degraded mode (wishes API returns 503).');
}

const server = app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});

let shuttingDown = false;
async function shutdown() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  server.close(async () => {
    await closeDb();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
