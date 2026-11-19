import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WishFeedback, WishItem } from '../types';

export interface UseWishesOptions {
  accessSlug: string;
  defaultWishes?: WishItem[];
  defaultRole?: string;
}

export interface SubmitWishInput {
  author: string;
  role?: string;
  message: string;
}

export type WishDataSource = 'loading' | 'remote' | 'offline';

export interface UseWishesResult {
  wishes: WishItem[];
  remoteWishes: WishItem[];
  localWishes: WishItem[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  feedback: WishFeedback | null;
  source: WishDataSource;
  submitWish: (input: SubmitWishInput) => Promise<boolean>;
  deleteLocalWish: (id: string) => void;
  clearFeedback: () => void;
}

export function useWishes({
  accessSlug,
  defaultWishes = [],
  defaultRole = 'Khách mời',
}: UseWishesOptions): UseWishesResult {
  const storageKey = `celebration_cards_wishes_${accessSlug}`;

  const [remoteWishes, setRemoteWishes] = useState<WishItem[]>([]);
  const [localWishes, setLocalWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<WishFeedback | null>(null);
  const [source, setSource] = useState<WishDataSource>('loading');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as WishItem[];
        if (Array.isArray(parsed)) {
          setLocalWishes(parsed);
          return;
        }
      }
      setLocalWishes([]);
    } catch {
      setLocalWishes([]);
    }
  }, [storageKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSource('loading');

    fetch(`/api/wishes/${encodeURIComponent(accessSlug)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { wishes?: WishItem[] };
        return Array.isArray(data.wishes) ? data.wishes : null;
      })
      .then((fetched) => {
        if (cancelled) return;
        if (fetched) {
          setRemoteWishes(fetched);
          setSource('remote');
        } else {
          setSource('offline');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSource('offline');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessSlug]);

  const saveLocalFallback = useCallback(
    (authorVal: string, roleVal: string, messageVal: string) => {
      const newWish: WishItem = {
        id: `local-${Date.now()}`,
        author: authorVal,
        role: roleVal || defaultRole,
        message: messageVal,
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };

      setLocalWishes((prev) => {
        const next = [newWish, ...prev];
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
        return next;
      });
    },
    [defaultRole, storageKey]
  );

  const submitWish = useCallback(
    async ({ author, role = '', message }: SubmitWishInput): Promise<boolean> => {
      const trimmedAuthor = author.trim();
      const trimmedRole = role.trim();
      const trimmedMessage = message.trim();

      if (!trimmedAuthor || !trimmedMessage || submitting) {
        return false;
      }

      setSubmitting(true);
      setError(null);
      setFeedback(null);

      try {
        const response = await fetch(`/api/wishes/${encodeURIComponent(accessSlug)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: trimmedAuthor,
            role: trimmedRole || defaultRole,
            message: trimmedMessage,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as { wish?: WishItem };
          if (data.wish) {
            setRemoteWishes((prev) => [data.wish as WishItem, ...prev]);
          }
          setSource('remote');
          setFeedback({
            type: 'success',
            text: 'Đã lưu lời chúc vào sổ lưu bút chung.',
          });
          return true;
        }

        if (response.status === 400 || response.status === 429) {
          const errData = (await response.json().catch(() => ({}))) as { error?: string };
          const msg = errData.error || 'Không thể gửi lời chúc. Vui lòng kiểm tra lại thông tin.';
          setError(msg);
          setFeedback({ type: 'error', text: msg });
          return false;
        }

        saveLocalFallback(trimmedAuthor, trimmedRole, trimmedMessage);
        setSource('offline');
        setFeedback({
          type: 'info',
          text: 'Đã lưu lời chúc tạm thời trên trình duyệt này (chế độ ngoại tuyến).',
        });
        return true;
      } catch {
        saveLocalFallback(trimmedAuthor, trimmedRole, trimmedMessage);
        setSource('offline');
        setFeedback({
          type: 'info',
          text: 'Đã lưu lời chúc trên trình duyệt này (chế độ ngoại tuyến).',
        });
        return true;
      } finally {
        setSubmitting(false);
      }
    },
    [accessSlug, defaultRole, saveLocalFallback, submitting]
  );

  const deleteLocalWish = useCallback(
    (id: string) => {
      setLocalWishes((prev) => {
        const next = prev.filter((w) => w.id !== id);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // Ignore storage errors
        }
        return next;
      });
    },
    [storageKey]
  );

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    setError(null);
  }, []);

  const wishes = useMemo(
    () => [...localWishes, ...remoteWishes, ...defaultWishes],
    [localWishes, remoteWishes, defaultWishes]
  );

  return {
    wishes,
    remoteWishes,
    localWishes,
    loading,
    submitting,
    error,
    feedback,
    source,
    submitWish,
    deleteLocalWish,
    clearFeedback,
  };
}
