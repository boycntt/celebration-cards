import type { CardManifestEntry, CardRouteEntry } from '../types';

export function isRouteWithinValidWindow(
  entry: Pick<CardManifestEntry, 'validFrom' | 'validTo'>,
  now: Date = new Date()
): boolean {
  const fromMs = Date.parse(entry.validFrom);
  const toMs = Date.parse(entry.validTo);
  const nowMs = now.getTime();

  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) {
    return false;
  }

  return nowMs >= fromMs && nowMs <= toMs;
}

export function resolveValidCardRoute(
  routes: CardRouteEntry[],
  slug: string | null,
  now: Date = new Date()
): CardRouteEntry | null {
  if (!slug) {
    return null;
  }

  const normalized = slug.trim().toLowerCase();
  const matched = routes.find(
    (item) =>
      item.status === 'active' &&
      Boolean(item.Component) &&
      item.accessSlug.toLowerCase() === normalized &&
      isRouteWithinValidWindow(item, now)
  );

  return matched ?? null;
}
