import { useCallback, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { buildCardUrl, readQueryParams } from '../router/urlParams';
import type { CardPersonalization } from '../types';

export interface UseShareLinkOptions {
  accessSlug: string;
  defaultPresetId: string;
}

export interface UseShareLinkResult {
  personalization: CardPersonalization;
  setPersonalization: (next: CardPersonalization) => void;
  shareUrl: string;
  copied: boolean;
  syncUrl: (next: CardPersonalization) => void;
  resetPersonalization: () => void;
  copyShareUrl: () => Promise<void>;
  generateQrDataUrl: (darkColor?: string, lightColor?: string) => Promise<string>;
}

function buildPersonalizationUrl(
  accessSlug: string,
  personalization: CardPersonalization,
  defaultPresetId: string
): string {
  return buildCardUrl(accessSlug, {
    preset:
      personalization.presetId && personalization.presetId !== defaultPresetId
        ? personalization.presetId
        : undefined,
    to: personalization.customTo,
    from: personalization.customFrom,
    msg: personalization.customMessage,
  });
}

export function useShareLink({
  accessSlug,
  defaultPresetId,
}: UseShareLinkOptions): UseShareLinkResult {
  const [personalization, setPersonalization] = useState<CardPersonalization>(() => {
    const params = readQueryParams();
    return {
      presetId: params.get('preset') || defaultPresetId,
      customTo: params.get('to') || '',
      customFrom: params.get('from') || '',
      customMessage: params.get('msg') || '',
    };
  });

  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(
    () => buildPersonalizationUrl(accessSlug, personalization, defaultPresetId),
    [accessSlug, personalization, defaultPresetId]
  );

  const syncUrl = useCallback(
    (next: CardPersonalization) => {
      setPersonalization(next);
      const nextUrl = buildPersonalizationUrl(accessSlug, next, defaultPresetId);
      window.history.replaceState({}, '', nextUrl);
    },
    [accessSlug, defaultPresetId]
  );

  const resetPersonalization = useCallback(() => {
    syncUrl({
      presetId: defaultPresetId,
      customTo: '',
      customFrom: '',
      customMessage: '',
    });
  }, [defaultPresetId, syncUrl]);

  const copyShareUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt('Sao chép đường dẫn thiệp để chia sẻ:', shareUrl);
    }
  }, [shareUrl]);

  const generateQrDataUrl = useCallback(
    async (darkColor: string = '#0f172a', lightColor: string = '#ffffff'): Promise<string> => {
      return QRCode.toDataURL(shareUrl, {
        width: 320,
        margin: 2,
        color: { dark: darkColor, light: lightColor },
      });
    },
    [shareUrl]
  );

  return {
    personalization,
    setPersonalization,
    shareUrl,
    copied,
    syncUrl,
    resetPersonalization,
    copyShareUrl,
    generateQrDataUrl,
  };
}
