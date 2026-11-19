import { CardPersonalization } from '../types/occasion';

export function readPersonalizationFromUrl(defaultPresetId: string): CardPersonalization {
  const params = new URLSearchParams(window.location.search);
  return {
    presetId: params.get('preset') || defaultPresetId,
    customTo: params.get('to') || '',
    customFrom: params.get('from') || '',
    customMessage: params.get('msg') || '',
  };
}

export function buildShareUrl(
  accessSlug: string,
  personalization: CardPersonalization,
  defaultPresetId: string
): string {
  const url = new URL(window.location.href);
  url.pathname = `/${accessSlug}`;
  url.search = '';

  if (personalization.presetId && personalization.presetId !== defaultPresetId) {
    url.searchParams.set('preset', personalization.presetId);
  }
  if (personalization.customTo.trim()) {
    url.searchParams.set('to', personalization.customTo.trim());
  }
  if (personalization.customFrom.trim()) {
    url.searchParams.set('from', personalization.customFrom.trim());
  }
  if (personalization.customMessage.trim()) {
    url.searchParams.set('msg', personalization.customMessage.trim());
  }

  return url.toString();
}

export function extractAccessSlugFromPath(
  pathname: string = window.location.pathname
): string | null {
  const cleaned = pathname.replace(/\/+$/, '');
  if (!cleaned) {
    return null;
  }

  const cardPrefixed = cleaned.match(/^\/card\/([a-z0-9-]+)$/i);
  if (cardPrefixed && cardPrefixed[1]) {
    return cardPrefixed[1].toLowerCase();
  }

  const directSlug = cleaned.match(/^\/([a-z0-9-]+)$/i);
  if (directSlug && directSlug[1]) {
    return directSlug[1].toLowerCase();
  }

  return null;
}
