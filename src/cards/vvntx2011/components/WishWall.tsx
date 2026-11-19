import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquareHeart,
  Send,
  Trash2,
} from 'lucide-react';
import { useWishes } from '../../../platform/hooks/useWishes';
import type { WishItem } from '../../../platform/types';

interface WishWallProps {
  accessSlug: string;
  defaultWishes: WishItem[];
  defaultRole: string;
}

export const WishWall: React.FC<WishWallProps> = ({
  accessSlug,
  defaultWishes,
  defaultRole,
}) => {
  const { wishes, loading, submitting, feedback, submitWish, deleteLocalWish } = useWishes({
    accessSlug,
    defaultWishes,
    defaultRole,
  });

  const [author, setAuthor] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await submitWish({ author, role, message });
    if (ok) {
      setAuthor('');
      setMessage('');
    }
  };

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
          {wishes.map((wish) => {
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
                        onClick={() => deleteLocalWish(wish.id)}
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
