import fs from 'node:fs';
import path from 'node:path';
import { escapeHtml } from '../lib/validate.mjs';

const SSR_META_PLACEHOLDER = '<!--SSR_META-->';

function extractSlugFromPath(pathname) {
  if (typeof pathname !== 'string') {
    return null;
  }
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    try {
      return decodeURIComponent(segments[0]);
    } catch {
      return null;
    }
  }
  if (segments.length === 2 && segments[0].toLowerCase() === 'card') {
    try {
      return decodeURIComponent(segments[1]);
    } catch {
      return null;
    }
  }
  return null;
}

function resolveOrigin(req) {
  const configured = typeof process.env.PUBLIC_BASE_URL === 'string' ? process.env.PUBLIC_BASE_URL.trim() : '';
  if (configured) {
    return configured.replace(/\/+$/, '');
  }
  const host = req.get('host') || 'localhost';
  return `${req.protocol}://${host}`.replace(/\/+$/, '');
}

function buildAbsoluteUrl(origin, rawPath) {
  if (!rawPath || typeof rawPath !== 'string') {
    return '';
  }
  const trimmed = rawPath.trim();
  if (!trimmed) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `${origin}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

function buildActiveCardMeta(card, origin) {
  const meta = card.meta || {};
  const title = escapeHtml(meta.title || 'Thiệp Chúc Mừng');
  const description = escapeHtml(meta.description || '');
  const themeColor = escapeHtml(meta.themeColor || '#ffffff');
  const ogUrl = escapeHtml(`${origin}/${encodeURIComponent(card.accessSlug)}`);
  const ogImage = escapeHtml(buildAbsoluteUrl(origin, meta.ogImage));

  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="theme-color" content="${themeColor}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="vi_VN" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${ogUrl}" />`,
  ];

  if (ogImage) {
    tags.push(`<meta property="og:image" content="${ogImage}" />`);
  }

  tags.push(
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`
  );

  if (ogImage) {
    tags.push(`<meta name="twitter:image" content="${ogImage}" />`);
  }

  return tags.join('\n    ');
}

function buildNotFoundMeta() {
  return [
    '<title>Không tìm thấy thiệp</title>',
    '<meta name="robots" content="noindex, nofollow" />',
  ].join('\n    ');
}

function injectMeta(template, metaBlock) {
  if (template.includes(SSR_META_PLACEHOLDER)) {
    const cleaned = template.replace(/<title>\s*Thiệp Chúc Mừng\s*<\/title>\s*/i, '');
    return cleaned.replace(SSR_META_PLACEHOLDER, metaBlock);
  }
  return template.replace('</head>', `    ${metaBlock}\n  </head>`);
}

export function createOgMetaHandler({ distDir, manifest }) {
  const indexHtmlPath = path.join(distDir, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production';
  let cachedTemplate = null;

  function loadTemplate() {
    if (isProduction && cachedTemplate !== null) {
      return cachedTemplate;
    }
    if (!fs.existsSync(indexHtmlPath)) {
      return null;
    }
    const html = fs.readFileSync(indexHtmlPath, 'utf8');
    if (isProduction) {
      cachedTemplate = html;
    }
    return html;
  }

  return function ogMetaHandler(req, res, next) {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      next();
      return;
    }

    const template = loadTemplate();
    if (!template) {
      res.status(503).send('Ứng dụng chưa được build (thiếu thư mục dist).');
      return;
    }

    const slug = extractSlugFromPath(req.path);
    const activeCard = slug ? manifest.resolveActiveCard(slug) : null;

    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    if (activeCard) {
      const origin = resolveOrigin(req);
      const html = injectMeta(template, buildActiveCardMeta(activeCard, origin));
      res.status(200).send(html);
      return;
    }

    const html = injectMeta(template, buildNotFoundMeta());
    res.status(404).send(html);
  };
}
