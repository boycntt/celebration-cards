const SLUG_PATTERN = /^[a-z0-9-]+$/i;

export function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 100 && SLUG_PATTERN.test(slug);
}

export function normalizeString(val) {
  return typeof val === 'string' ? val.trim() : '';
}

export function escapeHtml(str) {
  if (str === null || str === undefined) {
    return '';
  }
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
