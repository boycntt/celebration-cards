import React, { useEffect, useState } from 'react';
import {
  Check,
  Download,
  Loader2,
  PenLine,
  QrCode,
  RotateCcw,
  Share2,
  X,
} from 'lucide-react';
import type { CardPersonalization } from '../../../platform/types';
import { exportElementToPng } from '../../../platform/utils/exportImage';
import type { VvntxOccasionConfig } from '../config';

interface ExportShareBarProps {
  occasion: VvntxOccasionConfig;
  personalization: CardPersonalization;
  copied: boolean;
  onSyncPersonalization: (next: CardPersonalization) => void;
  onResetPersonalization: () => void;
  onCopyShareUrl: () => Promise<void>;
  onGenerateQrDataUrl: (darkColor?: string, lightColor?: string) => Promise<string>;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportShareBar: React.FC<ExportShareBarProps> = ({
  occasion,
  personalization,
  copied,
  onSyncPersonalization,
  onResetPersonalization,
  onCopyShareUrl,
  onGenerateQrDataUrl,
  cardRef,
}) => {
  const [exporting, setExporting] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [draftTo, setDraftTo] = useState(personalization.customTo);
  const [draftFrom, setDraftFrom] = useState(personalization.customFrom);
  const [draftMsg, setDraftMsg] = useState(personalization.customMessage);

  useEffect(() => {
    setDraftTo(personalization.customTo);
    setDraftFrom(personalization.customFrom);
    setDraftMsg(personalization.customMessage);
  }, [personalization]);

  useEffect(() => {
    if (!showQr) return;
    let cancelled = false;
    onGenerateQrDataUrl('#071A3C', '#FFFFFF')
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [showQr, onGenerateQrDataUrl]);

  const handleDownloadPng = async () => {
    if (!cardRef.current || exporting) return;
    try {
      setExporting(true);
      await exportElementToPng(cardRef.current, `thiep-${occasion.accessSlug}`, {
        backgroundColor: '#071A3C',
        pixelRatio: 2,
      });
    } catch (err) {
      console.error('Export PNG failed:', err);
      alert('Không thể xuất ảnh tự động trên trình duyệt này. Bạn có thể chụp màn hình trực tiếp nhé!');
    } finally {
      setExporting(false);
    }
  };

  const handleSaveCustomize = (e: React.FormEvent) => {
    e.preventDefault();
    const next: CardPersonalization = {
      ...personalization,
      customTo: draftTo.trim(),
      customFrom: draftFrom.trim(),
      customMessage: draftMsg.trim(),
    };
    onSyncPersonalization(next);
    setShowCustomize(false);
  };

  const handleResetCustomize = () => {
    onResetPersonalization();
    setShowCustomize(false);
  };

  return (
    <>
      {/* Action Bar */}
      <div className="mx-auto mt-6 flex w-full max-w-2xl flex-wrap items-center justify-center gap-2.5 px-2">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E5C158] px-4 py-2.5 text-sm font-semibold text-[#061533] shadow-md transition hover:bg-[#F0D57A] active:scale-[0.98] disabled:opacity-60"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {exporting ? 'Đang xuất ảnh...' : 'Tải ảnh thiệp (PNG)'}
        </button>

        <button
          type="button"
          onClick={() => setShowCustomize(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/45 bg-[#081F4A]/90 px-4 py-2.5 text-sm font-medium text-[#F5E6B8] transition hover:border-[#E5C158] hover:bg-[#0B2A5B]"
        >
          <PenLine className="h-4 w-4 text-[#E5C158]" />
          Cá nhân hóa thiệp
        </button>

        <button
          type="button"
          onClick={onCopyShareUrl}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/35 bg-[#081F4A]/90 px-4 py-2.5 text-sm font-medium text-blue-100 transition hover:border-blue-300/70 hover:bg-[#0B2A5B]"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-400" />
              Đã sao chép link!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-sky-300" />
              Sao chép link gửi Zalo
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowQr(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/35 bg-[#081F4A]/90 px-3.5 py-2.5 text-sm font-medium text-blue-100 transition hover:border-blue-300/70 hover:bg-[#0B2A5B]"
          title="Hiển thị mã QR"
        >
          <QrCode className="h-4 w-4 text-[#E5C158]" />
          Mã QR
        </button>
      </div>

      {/* Customize Modal */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/45 bg-[#081c42] p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-classic text-2xl font-bold text-[#F0D57A]">
                Cá nhân hóa thiệp 20/11
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-blue-200/80">
              Tạo link thiệp mang tên người nhận &amp; người gửi riêng để chia sẻ vào nhóm Zalo hoặc gửi riêng cho Thầy.
            </p>

            <form onSubmit={handleSaveCustomize} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium tracking-wider text-[#E5C158] uppercase">
                  Kính gửi (để trống sẽ dùng mặc định)
                </label>
                <input
                  type="text"
                  value={draftTo}
                  onChange={(e) => setDraftTo(e.target.value)}
                  placeholder="VD: Võ sư Lữ Thanh Xuân"
                  className="mt-1.5 w-full rounded-xl border border-blue-400/30 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#E5C158] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wider text-[#E5C158] uppercase">
                  Lời chúc riêng (tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={draftMsg}
                  onChange={(e) => setDraftMsg(e.target.value)}
                  placeholder="Viết thêm lời chúc riêng của bạn gửi Thầy và các anh em giáo chức..."
                  className="mt-1.5 w-full rounded-xl border border-blue-400/30 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#E5C158] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium tracking-wider text-[#E5C158] uppercase">
                  Người gửi / Chữ ký
                </label>
                <input
                  type="text"
                  value={draftFrom}
                  onChange={(e) => setDraftFrom(e.target.value)}
                  placeholder="VD: Nguyễn Tuấn — Môn sinh CLB Vovinam Thanh Xuân"
                  className="mt-1.5 w-full rounded-xl border border-blue-400/30 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-[#E5C158] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetCustomize}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-600/60 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Mặc định
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#E5C158] px-5 py-2 text-sm font-semibold text-[#061533] hover:bg-[#F0D57A]"
                >
                  Áp dụng &amp; Cập nhật link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/45 bg-[#081c42] p-6 text-center text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-classic text-xl font-bold text-[#F0D57A]">
                Mã QR Thiệp Tri Ân
              </h3>
              <button
                type="button"
                onClick={() => setShowQr(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-1 text-xs text-blue-200/80">
              Quét mã bằng Zalo hoặc Camera điện thoại để mở trực tiếp tấm thiệp này.
            </p>
            <div className="mx-auto mt-4 inline-block rounded-2xl bg-white p-3 shadow-lg">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code Thiệp 20/11" className="h-56 w-56" />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center text-slate-500">
                  Đang tạo QR...
                </div>
              )}
            </div>
            {qrDataUrl && (
              <div className="mt-4">
                <a
                  href={qrDataUrl}
                  download={`qr-${occasion.accessSlug}.png`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E5C158] px-4 py-2 text-sm font-semibold text-[#061533] hover:bg-[#F0D57A]"
                >
                  <Download className="h-4 w-4" />
                  Tải mã QR (PNG)
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
