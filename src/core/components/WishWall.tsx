import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, MessageSquareHeart, Send, Trash2, AlertCircle } from 'lucide-react';
import { WishItem } from '../types/occasion';

interface WishWallProps {
  occasionSlug: string;
  defaultWishes: WishItem[];
}

interface FeedbackState {
  type: 'success' | 'info' | 'error';
  text: string;
}

export const WishWall: React.FC<WishWallProps> = ({ occasionSlug, defaultWishes }) => {
  const storageKey = `celebration_cards_wishes_${occasionSlug}`;
  const [remoteWishes, setRemoteWishes] = useState<WishItem[]>([]);
  const [localWishes, setLocalWishes] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Môn sinh CLB Vovinam Thanh Xuân');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as WishItem[];
        if (Array.isArray(parsed)) setLocalWishes(parsed);
      } else {
        setLocalWishes([]);
      }
    } catch {
      setLocalWishes([]);
    }
  }, [storageKey]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/wishes/${encodeURIComponent(occasionSlug)}`)
      .then(async (res) => {
        if (!res.ok) return null;
        const data = (await res.json()) as { wishes?: WishItem[] };
        return Array.isArray(data.wishes) ? data.wishes : null;
      })
      .then((wishes) => {
        if (!cancelled && wishes) {
          setRemoteWishes(wishes);
        }
      })
      .catch(() => {
        // Offline / pure static fallback: keep default & local wishes
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [occasionSlug]);

  const saveLocalFallback = (authorVal: string, roleVal: string, messageVal: string) => {
    const newWish: WishItem = {
      id: `local-${Date.now()}`,
      author: authorVal,
      role: roleVal || 'Thành viên CLB Vovinam Thanh Xuân',
      message: messageVal,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    const next = [newWish, ...localWishes];
    setLocalWishes(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAuthor = author.trim();
    const trimmedRole = role.trim();
    const trimmedMessage = message.trim();
    if (!trimmedAuthor || !trimmedMessage || submitting) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/wishes/${encodeURIComponent(occasionSlug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: trimmedAuthor,
          role: trimmedRole,
          message: trimmedMessage,
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as { wish?: WishItem };
        if (data.wish) {
          setRemoteWishes((prev) => [data.wish as WishItem, ...prev]);
        }
        setAuthor('');
        setMessage('');
        setFeedback({
          type: 'success',
          text: 'Đã lưu lời chúc vào Sổ Lưu Bút chung của CLB.',
        });
        return;
      }

      if (response.status === 400 || response.status === 429) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string };
        setFeedback({
          type: 'error',
          text: errData.error || 'Không thể gửi lời chúc. Vui lòng kiểm tra lại thông tin.',
        });
        return;
      }

      // 503 / server unavailable -> fallback to localStorage
      saveLocalFallback(trimmedAuthor, trimmedRole, trimmedMessage);
      setAuthor('');
      setMessage('');
      setFeedback({
        type: 'info',
        text: 'Đã lưu lời chúc tạm thời trên trình duyệt này (chế độ ngoại tuyến).',
      });
    } catch {
      // Network unreachable / pure static mode -> fallback to localStorage
      saveLocalFallback(trimmedAuthor, trimmedRole, trimmedMessage);
      setAuthor('');
      setMessage('');
      setFeedback({
        type: 'info',
        text: 'Đã lưu lời chúc trên trình duyệt này (chế độ ngoại tuyến).',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLocal = (id: string) => {
    const next = localWishes.filter((w) => w.id !== id);
    setLocalWishes(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const allWishes = [...localWishes, ...remoteWishes, ...defaultWishes];

  return (
    <section className="mx-auto mt-10 w-full max-w-2xl px-2">
      <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#081d45]/85 p-5 shadow-xl backdrop-blur-md sm:p-7">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <MessageSquareHeart className="h-5 w-5 text-[#E5C158]" />
            <h2 className="font-serif-classic text-2xl font-bold text-[#F0D57A]">
              Sổ Lưu Bút Tri Ân
            </h2>
          </div>
          {loading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-200/70">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E5C158]" />
              Đang tải...
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-blue-200/80">
          Gửi lời chúc tri ân 20/11 đến Võ sư Lữ Thanh Xuân và các anh em giáo chức CLB Vovinam Thanh Xuân.
        </p>

        {/* Add Wish Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              maxLength={80}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Họ tên của bạn..."
              className="rounded-xl border border-blue-400/25 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#E5C158] focus:outline-none"
            />
            <input
              type="text"
              maxLength={100}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Khóa / Vai trò (VD: Lam đai, Cựu môn sinh...)"
              className="rounded-xl border border-blue-400/25 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#E5C158] focus:outline-none"
            />
          </div>
          <textarea
            rows={2}
            required
            maxLength={600}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Viết lời chúc tri ân 20/11..."
            className="w-full rounded-xl border border-blue-400/25 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#E5C158] focus:outline-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-h-[20px] flex-1">
              {feedback && (
                <p
                  className={`inline-flex items-center gap-1.5 text-xs ${
                    feedback.type === 'success'
                      ? 'text-emerald-300'
                      : feedback.type === 'error'
                      ? 'text-rose-300'
                      : 'text-amber-200'
                  }`}
                >
                  {feedback.type === 'error' ? (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{feedback.text}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E5C158] px-4 py-2 text-sm font-semibold text-[#061533] transition hover:bg-[#F0D57A] disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {submitting ? 'Đang gửi...' : 'Gửi lời chúc'}
            </button>
          </div>
        </form>

        {/* Wishes List */}
        <div className="mt-6 space-y-3">
          {allWishes.map((wish) => {
            const isLocal = wish.id.startsWith('local-');
            return (
              <div
                key={wish.id}
                className="rounded-xl border border-blue-400/15 bg-slate-950/35 p-4 transition hover:border-[#D4AF37]/40"
              >
                <p className="font-serif-classic text-[15.5px] leading-relaxed text-slate-100">
                  “{wish.message}”
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-blue-200/75">
                  <div>
                    <span className="font-semibold text-[#F0D57A]">{wish.author}</span>
                    <span className="mx-1.5 opacity-50">•</span>
                    <span>{wish.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{wish.createdAt}</span>
                    {isLocal && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLocal(wish.id)}
                        className="text-slate-400 hover:text-red-400"
                        title="Xóa lời chúc này"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
