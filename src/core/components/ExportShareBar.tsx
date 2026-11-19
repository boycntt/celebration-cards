import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Download,
  Share2,
  QrCode,
  Sparkles,
  Check,
  X,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { CardPersonalization, OccasionConfig } from '../types/occasion';
import { buildShareUrl } from '../utils/urlParams';
import { exportElementToPng } from '../utils/exportImage';

interface ExportShareBarProps {
  occasion: OccasionConfig;
  personalization: CardPersonalization;
  onChangePersonalization: (next: CardPersonalization) => void;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const ExportShareBar: React.FC<ExportShareBarProps> = ({
  occasion,
  personalization,
  onChangePersonalization,
  cardRef,
}) => {
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [draftTo, setDraftTo] = useState(personalization.customTo);
  const [draftFrom, setDraftFrom] = useState(personalization.customFrom);
  const [draftMsg, setDraftMsg] = useState(personalization.customMessage);

  const defaultPresetId = occasion.presets[0]?.id ?? 'all';
  const shareUrl = buildShareUrl(occasion.slug, personalization, defaultPresetId);

  useEffect(() => {
    setDraftTo(personalization.customTo);
    setDraftFrom(personalization.customFrom);
    setDraftMsg(personalization.customMessage);
  }, [personalization]);

  useEffect(() => {
    if (!showQr) return;
    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#071A3C', light: '#FFFFFF' },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [showQr, shareUrl]);

  const handleDownloadPng = async () => {
    if (!cardRef.current || exporting) return;
    try {
      setExporting(true);
      await exportElementToPng(cardRef.current, `thiep-${occasion.slug}`);
    } catch (err) {
      console.error('Export PNG failed:', err);
      alert('Không thể xuất ảnh tự động trên trình duyệt này. Bạn có thể chụp màn hình trực tiếp nhé!');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.prompt('Sao chép đường dẫn thiệp để gửi Zalo/Facebook:', shareUrl);
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
    onChangePersonalization(next);
    const nextUrl = buildShareUrl(occasion.slug, next, defaultPresetId);
    window.history.replaceState({}, '', nextUrl);
    setShowCustomize(false);
  };

  const handleResetCustomize = () => {
    const next: CardPersonalization = {
      presetId: defaultPresetId,
      customTo: '',
      customFrom: '',
      customMessage: '',
    };
    onChangePersonalization(next);
    const nextUrl = buildShareUrl(occasion.slug, next, defaultPresetId);
    window.history.replaceState({}, '', nextUrl);
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
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
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
          className="inline-flex items-center gap-2 rounded-xl border border-amber-300/35 bg-blue-950/75 px-4 py-2.5 text-sm font-medium text-amber-100 backdrop-blur-md transition hover:border-amber-300/70 hover:bg-blue-900/80"
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          Cá nhân hóa thiệp
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-950/75 px-4 py-2.5 text-sm font-medium text-blue-100 backdrop-blur-md transition hover:border-blue-300/60 hover:bg-blue-900/80"
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
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/30 bg-blue-950/75 px-3.5 py-2.5 text-sm font-medium text-blue-100 backdrop-blur-md transition hover:border-blue-300/60 hover:bg-blue-900/80"
          title="Hiển thị mã QR"
        >
          <QrCode className="h-4 w-4 text-amber-300" />
          Mã QR
        </button>
      </div>

      {/* Customize Modal */}
      {showCustomize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-300/30 bg-[#081c42] p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display text-2xl font-bold text-amber-200">
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
                <label className="block text-xs font-medium uppercase tracking-wider text-amber-200/90">
                  Kính gửi (để trống sẽ dùng mặc định)
                </label>
                <input
                  type="text"
                  value={draftTo}
                  onChange={(e) => setDraftTo(e.target.value)}
                  placeholder="VD: Võ sư Lữ Thanh Xuân"
                  className="mt-1.5 w-full rounded-xl border border-blue-400/30 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-amber-200/90">
                  Lời chúc riêng (tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={draftMsg}
                  onChange={(e) => setDraftMsg(e.target.value)}
                  placeholder="Viết thêm lời chúc riêng của bạn gửi Thầy và các anh em giáo chức..."
                  className="mt-1.5 w-full rounded-xl border border-blue-400/30 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-amber-200/90">
                  Người gửi / Chữ ký
                </label>
                <input
                  type="text"
                  value={draftFrom}
                  onChange={(e) => setDraftFrom(e.target.value)}
                  placeholder="VD: Nguyễn Tuấn — Môn sinh CLB Vovinam Thanh Xuân"
                  className="mt-1.5 w-full rounded-xl border border-blue-400/30 bg-slate-950/50 px-3.5 py-2.5 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:outline-none"
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
                  className="rounded-xl bg-amber-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
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
          <div className="w-full max-w-sm rounded-2xl border border-amber-300/30 bg-[#081c42] p-6 text-center text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display text-xl font-bold text-amber-200">
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
                  download={`qr-${occasion.slug}.png`}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300"
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
