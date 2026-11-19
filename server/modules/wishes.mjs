import { Router } from 'express';
import { isValidSlug, normalizeString } from '../lib/validate.mjs';

const COLLECTION_NAME = 'celebration_wishes';
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const DEFAULT_MAX_MESSAGE_LENGTH = 600;

function formatVietnamDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function parseLimit(rawLimit) {
  if (rawLimit === undefined || rawLimit === null || rawLimit === '') {
    return DEFAULT_LIMIT;
  }
  const parsed = Number.parseInt(String(rawLimit), 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return DEFAULT_LIMIT;
  }
  return Math.min(parsed, MAX_LIMIT);
}

export function createWishesRouter({ getDb, manifest, createRateLimiter, markDbDisconnected }) {
  const router = Router();
  const indexedDbs = new WeakSet();

  const postRateLimiter = createRateLimiter({
    windowMs: 60_000,
    maxRequests: 10,
    message: 'Bạn gửi lời chúc quá nhanh. Vui lòng thử lại sau 1 phút.',
  });

  async function getWishesCollection() {
    const db = await getDb();
    if (!db) {
      return null;
    }
    const collection = db.collection(COLLECTION_NAME);
    if (!indexedDbs.has(db)) {
      indexedDbs.add(db);
      collection.createIndex({ occasionSlug: 1, createdAtIso: -1 }).catch(() => {});
    }
    return collection;
  }

  router.get('/:slug', async (req, res) => {
    const { slug } = req.params;
    if (!isValidSlug(slug)) {
      res.status(400).json({ error: 'Định danh dịp lễ không hợp lệ.' });
      return;
    }

    const card = manifest.resolveCardBySlug(slug);
    const wishesOpt = manifest.getCardBackendOption(slug, 'wishes');
    if (!card || !wishesOpt || wishesOpt.enabled !== true) {
      res.status(404).json({ error: 'Không tìm thấy sổ lưu bút cho thiệp này.' });
      return;
    }

    const collection = await getWishesCollection();
    if (!collection) {
      res.status(503).json({
        error: 'Dịch vụ lưu bút trực tuyến hiện chưa sẵn sàng.',
      });
      return;
    }

    try {
      const occasionSlug = String(wishesOpt.collectionKey || card.accessSlug).toLowerCase();
      const limit = parseLimit(req.query.limit);
      const beforeParam = typeof req.query.before === 'string' ? req.query.before.trim() : '';

      const baseFilter = {
        occasionSlug,
        approved: { $ne: false },
      };

      const queryFilter =
        beforeParam && !Number.isNaN(Date.parse(beforeParam))
          ? { ...baseFilter, createdAtIso: { $lt: beforeParam } }
          : baseFilter;

      const [total, docs] = await Promise.all([
        collection.countDocuments(baseFilter),
        collection
          .find(queryFilter)
          .sort({ createdAtIso: -1 })
          .limit(limit + 1)
          .toArray(),
      ]);

      const hasMore = docs.length > limit;
      const pageDocs = hasMore ? docs.slice(0, limit) : docs;

      const wishes = pageDocs.map((doc) => ({
        id: String(doc._id),
        author: doc.author,
        role: doc.role,
        message: doc.message,
        createdAt: doc.createdAt,
        createdAtIso: doc.createdAtIso,
      }));

      res.json({ wishes, total, hasMore });
    } catch {
      if (typeof markDbDisconnected === 'function') {
        markDbDisconnected();
      }
      res.status(503).json({ error: 'Không thể tải danh sách lời chúc lúc này.' });
    }
  });

  router.post('/:slug', postRateLimiter, async (req, res) => {
    const { slug } = req.params;
    if (!isValidSlug(slug)) {
      res.status(400).json({ error: 'Định danh dịp lễ không hợp lệ.' });
      return;
    }

    const card = manifest.resolveCardBySlug(slug);
    const wishesOpt = manifest.getCardBackendOption(slug, 'wishes');
    if (!card || !wishesOpt || wishesOpt.enabled !== true) {
      res.status(404).json({ error: 'Không tìm thấy sổ lưu bút cho thiệp này.' });
      return;
    }

    if (card.status !== 'active' || !manifest.isWithinWindow(card)) {
      res.status(403).json({ error: 'Thiệp hiện không nằm trong thời gian nhận lời chúc.' });
      return;
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const author = normalizeString(body.author);
    const roleInput = normalizeString(body.role);
    const message = normalizeString(body.message);
    const maxMessageLength =
      Number.isInteger(wishesOpt.maxMessageLength) && wishesOpt.maxMessageLength > 0
        ? wishesOpt.maxMessageLength
        : DEFAULT_MAX_MESSAGE_LENGTH;

    if (author.length < 1 || author.length > 80) {
      res.status(400).json({ error: 'Họ tên phải từ 1 đến 80 ký tự.' });
      return;
    }

    if (roleInput.length > 100) {
      res.status(400).json({ error: 'Vai trò / Khóa không được vượt quá 100 ký tự.' });
      return;
    }

    if (message.length < 1 || message.length > maxMessageLength) {
      res.status(400).json({
        error: `Lời chúc phải từ 1 đến ${maxMessageLength} ký tự.`,
      });
      return;
    }

    const collection = await getWishesCollection();
    if (!collection) {
      res.status(503).json({
        error: 'Dịch vụ lưu bút trực tuyến hiện chưa sẵn sàng.',
      });
      return;
    }

    try {
      const now = new Date();
      const occasionSlug = String(wishesOpt.collectionKey || card.accessSlug).toLowerCase();
      const defaultRole = typeof wishesOpt.defaultRole === 'string' ? wishesOpt.defaultRole : '';

      const doc = {
        occasionSlug,
        author,
        role: roleInput || defaultRole,
        message,
        approved: true,
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
          createdAtIso: doc.createdAtIso,
        },
      });
    } catch {
      if (typeof markDbDisconnected === 'function') {
        markDbDisconnected();
      }
      res.status(503).json({ error: 'Không thể lưu lời chúc lúc này. Vui lòng thử lại sau.' });
    }
  });

  return router;
}
