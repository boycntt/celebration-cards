import React from 'react';
import { FileX2 } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600">
          <FileX2 className="h-5 w-5" />
        </div>

        <p className="mt-5 text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
          Thông Báo • 404
        </p>

        <h1 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
          Không tìm thấy thiệp
        </h1>

        <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
          <span className="h-px w-12 bg-slate-300" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          <span className="h-px w-12 bg-slate-300" />
        </div>

        <p className="text-[15px] leading-relaxed text-slate-700">
          Không tìm thấy thiệp hoặc thiệp đã hết thời gian hiển thị.
        </p>
        <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
          Vui lòng kiểm tra lại đường dẫn thiệp được gửi từ người chia sẻ hoặc Ban Tổ Chức.
        </p>
      </div>
    </div>
  );
};
