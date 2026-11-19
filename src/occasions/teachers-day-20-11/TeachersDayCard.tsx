import React from 'react';
import { Award } from 'lucide-react';
import { CardPersonalization, OccasionConfig, RecipientPreset } from '../../core/types/occasion';
import { BambooAccent, GoldDivider, TonSuStamp } from './VovinamDecorations';

interface TeachersDayCardProps {
  occasion: OccasionConfig;
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
      {/* Exportable Poster Card Frame */}
      <div
        ref={cardRef}
        className="animate-card-reveal relative overflow-hidden rounded-3xl border-2 border-amber-400/55 bg-gradient-to-b from-[#082252] via-[#071a3e] to-[#061430] p-2.5 shadow-[0_28px_70px_-15px_rgba(0,0,0,0.8)] sm:p-4"
      >
        {/* Subtle Bamboo Silhouettes on outer deep-blue frame */}
        <BambooAccent className="pointer-events-none absolute -top-2 -left-2 h-48 w-28 text-amber-300/12" />
        <BambooAccent className="pointer-events-none absolute -top-2 -right-2 h-48 w-28 -scale-x-100 text-amber-300/12" />

        {/* Top Header Banner */}
        <div className="relative px-4 pt-5 pb-4 text-center sm:px-6 sm:pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
            <Award className="h-3.5 w-3.5 text-amber-300" />
            <span>{occasion.dateLabel}</span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400/70" />
            <span className="font-script text-4xl font-bold text-gold-foil sm:text-5xl">
              20 • 11
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400/70" />
          </div>

          <h1 className="mt-2 font-serif-display text-2xl font-bold tracking-wide text-white sm:text-3xl">
            {preset.headline}
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-200/85">
            {occasion.organization}
          </p>
        </div>

        {/* Hero Club Photo Frame */}
        {occasion.heroImage && (
          <div className="relative mx-auto mb-4 max-w-xl px-2 sm:px-4">
            <div className="shimmer-overlay relative overflow-hidden rounded-2xl border-2 border-amber-300/60 bg-slate-950 shadow-xl">
              <img
                src={occasion.heroImage}
                alt={occasion.heroImageCaption || occasion.organization}
                className="aspect-[16/11] w-full object-cover object-center"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
            </div>
          </div>
        )}

        {/* Inner Warm Parchment Greeting Letter */}
        <div className="bg-parchment relative overflow-hidden rounded-2xl border border-amber-500/40 px-5 py-7 text-slate-800 shadow-inner sm:px-9 sm:py-9">
          {/* Decorative Inner Corner Lines */}
          <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-amber-600/45" />
          <span className="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-amber-600/45" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-amber-600/45" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-amber-600/45" />

          {/* Salutation */}
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-900/75">
              {preset.salutation}
            </p>
            <h2 className="mt-1.5 font-serif-display text-2xl font-bold text-[#082454] sm:text-3xl">
              {recipientTitle}
            </h2>
            <p className="mt-2 font-serif-display text-base italic font-semibold text-amber-800 sm:text-lg">
              {preset.quote}
            </p>
          </div>

          <GoldDivider />

          {/* Letter Body */}
          <div className="space-y-3.5 text-justify text-[14.5px] leading-relaxed text-slate-700 sm:text-[15.5px]">
            {preset.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            {customMessage && (
              <div className="mt-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/90 px-4 py-3 text-left text-sm italic text-slate-800">
                “{customMessage}”
              </div>
            )}
          </div>

          {/* Footer Signature & Vermilion Seal */}
          <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-amber-500/25 pt-5 sm:flex-row">
            <div className="flex items-center gap-3">
              <TonSuStamp />
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-900/70">
                  Tinh thần Việt Võ Đạo
                </p>
                <p className="text-xs italic text-slate-600">
                  Cương Nhu Phối Triển
                </p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-xs italic text-slate-500">{preset.closing}</p>
              <p className="mt-1 font-script text-2xl font-bold text-[#0b3578]">
                {signature}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Martial Ribbon */}
        <div className="mt-3 flex items-center justify-center gap-2 pb-1 text-center text-[11px] tracking-wider text-amber-200/75">
          <span>★</span>
          <span>CLB VOVINAM THANH XUÂN • 20/11/2026</span>
          <span>★</span>
        </div>
      </div>
    </div>
  );
};
