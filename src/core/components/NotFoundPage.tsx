import React from 'react';
import { FileX2 } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="bg-vovinam-night flex min-h-screen flex-col items-center justify-center px-4 py-12 text-slate-100">
      <div className="w-full max-w-lg border border-[#D4AF37]/50 bg-[#071A3E]/95 p-2 shadow-2xl">
        <div className="relative border border-[#D4AF37]/30 px-6 py-10 text-center sm:px-10 sm:py-12">
          {/* Classic Straight Corner Marks */}
          <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#D4AF37]/60" />
          <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#D4AF37]/60" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#D4AF37]/60" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#D4AF37]/60" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#0B2A5B]/80 text-[#E5C158]">
            <FileX2 className="h-6 w-6" />
          </div>

          <p className="font-serif-classic mt-5 text-sm font-bold tracking-[0.28em] text-[#E5C158] uppercase">
            Thông Báo • 404
          </p>

          <h1 className="font-serif-classic mt-2 text-2xl font-bold text-white sm:text-3xl">
            Không tìm thấy thiệp
          </h1>

          <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span className="h-px w-14 bg-[#D4AF37]/55" />
            <span className="h-1.5 w-1.5 bg-[#E5C158]" />
            <span className="h-px w-14 bg-[#D4AF37]/55" />
          </div>

          <p className="font-serif-classic text-[16px] leading-relaxed text-slate-200">
            Không tìm thấy thiệp hoặc thiệp đã hết thời gian hiển thị.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-blue-200/75">
            Vui lòng kiểm tra lại đường dẫn thiệp được gửi từ Ban Tổ Chức hoặc người chia sẻ.
          </p>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs tracking-wide text-blue-200/60">
        <p className="font-serif-classic">
          CLB Vovinam Thanh Xuân • Tôn Sư Trọng Đạo • Cương Nhu Phối Triển
        </p>
      </footer>
    </div>
  );
};
