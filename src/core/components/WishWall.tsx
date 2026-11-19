import React, { useState, useEffect } from 'react';
import { MessageSquareHeart, Send, Trash2 } from 'lucide-react';
import { WishItem } from '../types/occasion';

interface WishWallProps {
  occasionSlug: string;
  defaultWishes: WishItem[];
}

export const WishWall: React.FC<WishWallProps> = ({ occasionSlug, defaultWishes }) => {
  const storageKey = `celebration_cards_wishes_${occasionSlug}`;
  const [localWishes, setLocalWishes] = useState<WishItem[]>([]);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('Môn sinh CLB Vovinam Thanh Xuân');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as WishItem[];
        if (Array.isArray(parsed)) setLocalWishes(parsed);
      }
    } catch {
      setLocalWishes([]);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newWish: WishItem = {
      id: `local-${Date.now()}`,
      author: author.trim(),
      role: role.trim() || 'Thành viên CLB Vovinam Thanh Xuân',
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    const next = [newWish, ...localWishes];
    setLocalWishes(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }

    setAuthor('');
    setMessage('');
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

  const allWishes = [...localWishes, ...defaultWishes];

  return (
    <section className="mx-auto mt-10 w-full max-w-2xl px-2">
      <div className="rounded-2xl border border-amber-300/25 bg-[#081d45]/80 p-5 shadow-xl backdrop-blur-md sm:p-7">
        <div className="flex items-center gap-2.5">
          <MessageSquareHeart className="h-5 w-5 text-amber-300" />
          <h2 className="font-serif-display text-2xl font-bold text-amber-200">
            Sổ Lưu Bút Tri Ân
          </h2>
        </div>
        <p className="mt-1 text-xs text-blue-200/75">
          Gửi lời chúc tri ân 20/11 đến Võ sư Lữ Thanh Xuân và các anh em giáo chức CLB Vovinam Thanh Xuân.
        </p>

        {/* Add Wish Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Họ tên của bạn..."
              className="rounded-xl border border-blue-400/25 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:outline-none"
            />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Khóa / Vai trò (VD: Lam đai, Cựu môn sinh...)"
              className="rounded-xl border border-blue-400/25 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:outline-none"
            />
          </div>
          <textarea
            rows={2}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Viết lời chúc tri ân 20/11..."
            className="w-full rounded-xl border border-blue-400/25 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:outline-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
            >
              <Send className="h-4 w-4" />
              Gửi lời chúc
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
                className="rounded-xl border border-blue-400/15 bg-slate-950/35 p-4 transition hover:border-amber-300/30"
              >
                <p className="text-sm leading-relaxed text-slate-100">“{wish.message}”</p>
                <div className="mt-2.5 flex items-center justify-between text-xs text-blue-200/70">
                  <div>
                    <span className="font-semibold text-amber-200">{wish.author}</span>
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
