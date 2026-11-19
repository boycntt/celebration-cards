import { useEffect } from 'react';

export interface DocumentHeadOptions {
  title: string;
  description?: string;
  themeColor?: string;
  fontUrls?: string[];
}

function upsertMetaTag(name: string, content: string): HTMLMetaElement {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
  return tag;
}

export function useDocumentHead({
  title,
  description,
  themeColor,
  fontUrls = [],
}: DocumentHeadOptions): void {
  const fontUrlsKey = fontUrls.join('|');

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (description) {
      upsertMetaTag('description', description);
    }
  }, [description]);

  useEffect(() => {
    if (themeColor) {
      upsertMetaTag('theme-color', themeColor);
    }
  }, [themeColor]);

  useEffect(() => {
    const urls = fontUrlsKey ? fontUrlsKey.split('|').filter(Boolean) : [];
    if (urls.length === 0) return;

    const injectedLinks: HTMLLinkElement[] = [];

    const hasGoogleFonts = urls.some((u) => u.includes('fonts.googleapis.com'));
    if (hasGoogleFonts) {
      const preconnectApis = document.createElement('link');
      preconnectApis.rel = 'preconnect';
      preconnectApis.href = 'https://fonts.googleapis.com';
      preconnectApis.dataset.cardFont = 'true';
      document.head.appendChild(preconnectApis);
      injectedLinks.push(preconnectApis);

      const preconnectGstatic = document.createElement('link');
      preconnectGstatic.rel = 'preconnect';
      preconnectGstatic.href = 'https://fonts.gstatic.com';
      preconnectGstatic.crossOrigin = 'anonymous';
      preconnectGstatic.dataset.cardFont = 'true';
      document.head.appendChild(preconnectGstatic);
      injectedLinks.push(preconnectGstatic);
    }

    for (const url of urls) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.dataset.cardFont = 'true';
      document.head.appendChild(link);
      injectedLinks.push(link);
    }

    return () => {
      for (const link of injectedLinks) {
        link.remove();
      }
    };
  }, [fontUrlsKey]);
}
