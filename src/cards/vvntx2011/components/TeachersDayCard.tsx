import React from 'react';
import type { CardPersonalization } from '../../../platform/types';
import type { RecipientPreset, VvntxOccasionConfig } from '../config';
import { BambooAccent, GoldDivider, TonSuStamp } from './VovinamDecorations';

interface TeachersDayCardProps {
  occasion: VvntxOccasionConfig;
  preset: RecipientPreset;
  personalization: CardPersonalization;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export const TeachersDayCard: React.FC<TeachersDayCardProps> = ({
  occasion,
  preset,
  personalization,
  cardRef,
}) => {
  const recipientTitle = personalization.customTo.trim() || preset.recipientTitle;
  const signature = personalization.customFrom.trim() || preset.signature;
  const customMessage = personalization.customMessage.trim();

  return (
    <div className="mx-auto w-full max-w-2xl px-2">
      {/* Exportable Ceremonial Card Frame */}
      <div
        ref={cardRef}
        className="animate-card-reveal relative overflow-hidden rounded-2xl border-2 border-[#D4AF37]/65 bg-[#071A3E] p-2.5 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] sm:p-4"
      >
        {/* Subtle Bamboo Silhouettes on outer deep-navy frame */}
        <BambooAccent className="pointer-events-none absolute -top-2 -left-2 h-44 w-24 text-[#E5C158]/10" />
        <BambooAccent className="pointer-events-none absolute -top-2 -right-2 h-44 w-24 -scale-x-100 text-[#E5C158]/10" />

        {/* Top Header Banner */}
        <div className="relative px-4 pt-5 pb-5 text-center sm:px-6 sm:pt-6">
          <p className="font-serif-classic text-[11px] font-semibold tracking-[0.14em] text-[#E5C158] uppercase text-balance sm:text-[13px] sm:tracking-[0.2em]">
            {occasion.dateLabel}
          </p>

          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#D4AF37]/65 sm:w-16" />
            <span className="font-serif-classic text-3xl font-bold tracking-[0.16em] text-[#F0D57A] whitespace-nowrap sm:text-4xl">
              20 • 11
            </span>
            <span className="h-px w-12 bg-[#D4AF37]/65 sm:w-16" />
          </div>

          <h1 className="font-serif-classic mt-3 text-xl leading-snug font-bold tracking-wide text-white text-balance sm:text-[28px]">
            {preset.headline}
          </h1>
          <div className="mt-2 space-y-0.5 text-center">
            <p className="font-serif-classic text-xs font-semibold tracking-[0.16em] text-[#CFE0F5] uppercase whitespace-nowrap sm:text-[13px]">
              {occasion.organization}
            </p>
            {occasion.organizationSubline && (
              <p className="text-[11px] font-medium tracking-[0.16em] text-[#CFE0F5]/80 uppercase">
                {occasion.organizationSubline}
              </p>
            )}
          </div>
        </div>

        {/* Hero Club Photo Frame — Uncropped 1:1 Responsive Fit */}
        {occasion.heroImage && (
          <div className="relative mx-auto mb-5 w-full max-w-[480px] px-2 sm:px-4">
            <div className="overflow-hidden rounded-xl border border-[#D4AF37]/70 bg-[#061533] p-1.5 shadow-lg">
              <img
                src={occasion.heroImage}
                alt={occasion.heroImageCaption || occasion.organization}
                className="mx-auto block h-auto max-h-[65vh] w-full rounded-lg object-contain"
              />
            </div>
          </div>
        )}

        {/* Inner Warm Ivory Ceremonial Letter */}
        <div className="bg-parchment relative overflow-hidden rounded-xl border border-[#B8860B]/45 px-5 py-7 text-slate-800 sm:px-9 sm:py-9">
          {/* Straight Inner Corner Marks */}
          <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#B8860B]/55" />
          <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#B8860B]/55" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#B8860B]/55" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#B8860B]/55" />

          {/* Salutation */}
          <div className="text-center">
            <p className="font-serif-classic text-xs font-semibold tracking-[0.2em] text-[#0B2A5B]/80 uppercase sm:text-[13px]">
              {preset.salutation}
            </p>
            <h2 className="font-serif-classic mt-2 text-xl leading-snug font-bold text-[#0B2A5B] text-balance sm:text-[28px]">
              {recipientTitle.split('\n').map((line, idx) => (
                <span
                  key={idx}
                  className={
                    line.includes('CLB Vovinam Thanh Xuân')
                      ? 'block whitespace-nowrap'
                      : 'block'
                  }
                >
                  {line}
                </span>
              ))}
            </h2>
            <p className="font-serif-classic mt-2.5 text-base leading-relaxed font-semibold italic text-[#8A6218] sm:text-[17px]">
              {preset.quote.split('\n').map((line, idx) => (
                <span key={idx} className="block text-balance">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <GoldDivider />

          {/* Letter Body */}
          <div className="font-serif-classic space-y-4 text-justify text-[15.5px] leading-[1.85] text-[#1E293B] sm:text-[16.5px]">
            {preset.paragraphs.map((paragraph, idx) => (
              <p key={idx} className="indent-7 sm:indent-8">
                {paragraph}
              </p>
            ))}

            {customMessage && (
              <div className="mt-4 border-l-2 border-[#B8860B] bg-[#FBF4E2] px-4 py-3 text-left text-[15.5px] leading-[1.75] italic text-[#1E293B]">
                “{customMessage}”
              </div>
            )}
          </div>

          {/* Footer Signature & Straight Vermilion Seal */}
          <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-[#B8860B]/30 pt-6 sm:flex-row sm:items-end">
            <div className="flex shrink-0 items-center gap-3.5">
              <TonSuStamp />
              <div className="text-left">
                <p className="font-serif-classic text-[11.5px] font-bold tracking-[0.1em] text-[#0B2A5B] uppercase whitespace-nowrap sm:text-xs">
                  Tinh thần Việt Võ Đạo
                </p>
                <p className="font-serif-classic mt-0.5 text-sm italic text-[#475569] whitespace-nowrap">
                  Cương Nhu Phối Triển
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="font-serif-classic text-sm italic text-[#475569] whitespace-nowrap">
                Hà Nội, 20 tháng 11 năm 2026
              </p>
              <p className="font-serif-classic mt-1 text-sm font-semibold italic text-[#334155]">
                {preset.closing}
              </p>
              <p className="font-serif-classic mt-2 text-base leading-snug font-bold text-[#0B2A5B] sm:text-[19px]">
                {signature.split('\n').map((line, idx) => (
                  <span
                    key={idx}
                    className={
                      line.includes('CLB Vovinam Thanh Xuân')
                        ? 'block whitespace-nowrap'
                        : 'block'
                    }
                  >
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Martial Ribbon */}
        <div className="mt-3.5 flex flex-col items-center justify-center gap-1 pb-1 text-center text-[11px] tracking-[0.16em] text-[#E5C158]/90 uppercase">
          <div className="flex items-center justify-center gap-2.5">
            <span className="h-px w-6 bg-[#D4AF37]/50" />
            <span className="font-serif-classic font-semibold whitespace-nowrap">
              {occasion.organization}
            </span>
            <span className="h-px w-6 bg-[#D4AF37]/50" />
          </div>
          <span className="font-serif-classic text-[10.5px] font-medium tracking-[0.2em] text-[#E5C158]/75 whitespace-nowrap">
            20/11/2026
          </span>
        </div>
      </div>
    </div>
  );
};
