import React from 'react';
import { Calendar, CheckCircle2, Clock, X } from 'lucide-react';
import { OccasionConfig } from '../types/occasion';

interface OccasionHubModalProps {
  open: boolean;
  occasions: OccasionConfig[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  onClose: () => void;
}

export const OccasionHubModal: React.FC<OccasionHubModalProps> = ({
  open,
  occasions,
  activeSlug,
  onSelect,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-amber-300/30 bg-[#081c42] p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-display text-2xl font-bold text-amber-200">
              Bộ Sưu Tập Thiệp Các Dịp Lễ
            </h2>
            <p className="mt-0.5 text-xs text-blue-200/80">
              Nền tảng thiệp điện tử đa dịp lễ — CLB Vovinam Thanh Xuân
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {occasions.map((item) => {
            const isActive = item.slug === activeSlug;
            const isReady = item.status === 'active';

            return (
              <button
                key={item.slug}
                type="button"
                disabled={!isReady}
                onClick={() => {
                  if (isReady) {
                    onSelect(item.slug);
                    onClose();
                  }
                }}
                className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                  isActive
                    ? 'border-amber-400 bg-amber-400/15'
                    : isReady
                    ? 'border-blue-400/30 bg-slate-950/40 hover:border-amber-300/60'
                    : 'cursor-not-allowed border-slate-700/50 bg-slate-950/25 opacity-65'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-900/70 px-2.5 py-0.5 text-[11px] font-semibold text-amber-200">
                      <Calendar className="h-3 w-3" />
                      {item.dateBadge}
                    </span>
                    {isReady ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Đang mở
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <Clock className="h-3.5 w-3.5" />
                        Sắp ra mắt
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-serif-display text-xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-blue-200/75">{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
