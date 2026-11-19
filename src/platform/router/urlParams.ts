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

export function readQueryParams(search: string = window.location.search): URLSearchParams {
  return new URLSearchParams(search);
}

export function buildCardUrl(
  accessSlug: string,
  queryParams?: Record<string, string | null | undefined>
): string {
  const url = new URL(window.location.href);
  url.pathname = `/${accessSlug}`;
  url.search = '';

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      const trimmed = value?.trim();
      if (trimmed) {
        url.searchParams.set(key, trimmed);
      }
    }
  }

  return url.toString();
}
