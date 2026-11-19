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
    className="inline-flex h-[68px] w-[68px] shrink-0 items-center justify-center border-2 border-[#9B1C1C] bg-[#9B1C1C]/[0.04] p-[3px] select-none"
    title="Tôn Sư Trọng Đạo"
  >
    <div className="flex h-full w-full flex-col items-center justify-center border border-[#9B1C1C]/65 px-1 text-center text-[#9B1C1C]">
      <span className="font-serif-classic w-full border-b border-[#9B1C1C]/45 pb-0.5 text-[10px] leading-tight font-bold tracking-[0.08em] uppercase">
        Tôn Sư
      </span>
      <span className="font-serif-classic pt-0.5 text-[9.5px] leading-tight font-bold tracking-[0.06em] uppercase">
        Trọng Đạo
      </span>
    </div>
  </div>
);

export const GoldDivider: React.FC = () => (
  <div className="my-5 flex items-center justify-center gap-3" aria-hidden="true">
    <span className="h-px w-16 bg-[#B8860B]/55 sm:w-24" />
    <span className="h-1.5 w-1.5 bg-[#B8860B]" />
    <span className="h-px w-16 bg-[#B8860B]/55 sm:w-24" />
  </div>
);
