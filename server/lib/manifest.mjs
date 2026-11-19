import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const manifestPath = path.resolve(__dirname, '..', '..', 'shared', 'cards-manifest.json');

const rawManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const cards = Array.isArray(rawManifest?.cards) ? rawManifest.cards : [];

const cardsBySlug = new Map();
for (const card of cards) {
  if (card && typeof card.accessSlug === 'string' && card.accessSlug.trim()) {
    cardsBySlug.set(card.accessSlug.trim().toLowerCase(), card);
  }
}

export function resolveCardBySlug(slug) {
  if (typeof slug !== 'string') {
    return null;
  }
  const normalized = slug.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  return cardsBySlug.get(normalized) ?? null;
}

export function isWithinWindow(card, now = new Date()) {
  if (!card || typeof card.validFrom !== 'string' || typeof card.validTo !== 'string') {
    return false;
  }
  const fromMs = Date.parse(card.validFrom);
  const toMs = Date.parse(card.validTo);
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(String(now));

  if (Number.isNaN(fromMs) || Number.isNaN(toMs) || Number.isNaN(nowMs)) {
    return false;
  }
  return nowMs >= fromMs && nowMs <= toMs;
}

export function resolveActiveCard(slug, now = new Date()) {
  const card = resolveCardBySlug(slug);
  if (!card || card.status !== 'active') {
    return null;
  }
  if (!isWithinWindow(card, now)) {
    return null;
  }
  return card;
}

export function getCardBackendOption(slug, optionKey) {
  if (typeof optionKey !== 'string' || !optionKey) {
    return null;
  }
  const card = resolveCardBySlug(slug);
  if (!card || !card.backendOptions || typeof card.backendOptions !== 'object') {
    return null;
  }
  return card.backendOptions[optionKey] ?? null;
}
