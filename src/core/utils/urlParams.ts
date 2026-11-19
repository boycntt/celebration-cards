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
  occasionSlug: string,
  personalization: CardPersonalization,
  defaultPresetId: string
): string {
  const url = new URL(window.location.href);
  url.pathname = `/card/${occasionSlug}`;
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

export function getInitialOccasionSlug(fallbackSlug: string): string {
  const path = window.location.pathname;
  const match = path.match(/^\/card\/([a-z0-9-]+)/i);
  if (match && match[1]) {
    return match[1];
  }
  return fallbackSlug;
}
