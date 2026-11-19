import React from 'react';

export const BambooAccent: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 220"
    fill="none"
    className={className}
  >
    {/* Stalk */}
    <path
      d="M28 215 C32 165, 36 110, 44 20"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path d="M31 162 L41 160" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M35 112 L45 110" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M39 62 L49 60" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    {/* Leaves */}
    <path
      d="M42 62 C64 46, 86 42, 104 46 C86 58, 64 64, 42 62 Z"
      fill="currentColor"
      opacity="0.8"
    />
    <path
      d="M43 60 C58 34, 72 18, 86 10 C76 30, 62 48, 43 60 Z"
      fill="currentColor"
      opacity="0.65"
    />
    <path
      d="M38 112 C62 102, 84 102, 102 112 C82 118, 60 118, 38 112 Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M35 112 C18 96, 8 82, 4 68 C16 82, 26 96, 35 112 Z"
      fill="currentColor"
      opacity="0.55"
    />
  </svg>
);

export const TonSuStamp: React.FC = () => (
  <div
    className="inline-flex h-16 w-16 rotate-[-8deg] flex-col items-center justify-center rounded-lg border-2 border-red-700/80 bg-red-700/5 px-1 text-center text-red-800 shadow-inner select-none"
    title="Tôn Sư Trọng Đạo"
  >
    <span className="border-b border-red-700/40 pb-0.5 text-[9px] font-bold uppercase tracking-widest">
      Tôn Sư
    </span>
    <span className="pt-0.5 text-[9px] font-bold uppercase tracking-widest">
      Trọng Đạo
    </span>
  </div>
);

export const GoldDivider: React.FC = () => (
  <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
    <span className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/70 sm:w-24" />
    <span className="h-2 w-2 rotate-45 border border-amber-500 bg-amber-300/60" />
    <span className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/70 sm:w-24" />
  </div>
);
