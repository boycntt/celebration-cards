import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MailOpen } from 'lucide-react';
import type { VvntxOccasionConfig } from '../config';

interface EnvelopeIntroProps {
  occasion: VvntxOccasionConfig;
  recipientDisplay: string;
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  occasion,
  recipientDisplay,
  onOpen,
}) => {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // Ceremonial Vovinam gold, blue & crimson confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.58 },
      colors: ['#D4AF37', '#F0D57A', '#1D63DC', '#9B1C1C', '#FFFFFF'],
    });

    window.setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-76px)] flex-col items-center justify-center px-4 py-8">
      <div
        className={`w-full max-w-lg transition-all duration-700 ease-out ${
          opening ? 'scale-[1.03] opacity-0 -translate-y-5' : 'scale-100 opacity-100'
        }`}
      >
        {/* Top Ceremonial Heading */}
        <div className="mb-6 text-center">
          <p className="font-serif-classic text-[11px] font-semibold tracking-[0.14em] text-[#E5C158] uppercase text-balance sm:text-[13px] sm:tracking-[0.22em]">
            {occasion.dateLabel}
          </p>
          <h1 className="font-serif-classic mt-2.5 text-3xl font-bold tracking-wide text-[#F0D57A] text-balance sm:text-4xl">
            {occasion.envelopeTitle}
          </h1>
          <div className="mt-1.5 space-y-0.5 text-center">
            <p className="font-serif-classic text-xs font-semibold tracking-[0.14em] text-[#CFE0F5] uppercase whitespace-nowrap sm:text-sm">
              {occasion.organization}
            </p>
            {occasion.organizationSubline && (
              <p className="text-[11px] tracking-[0.14em] text-[#CFE0F5]/80 uppercase">
                {occasion.organizationSubline}
              </p>
            )}
          </div>
        </div>

        {/* Interactive Formal Silk Envelope Container */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
          className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-[#D4AF37]/60 bg-[#081F4A] p-2 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.75)] transition-colors duration-300 hover:border-[#F0D57A] focus:outline-none focus:ring-2 focus:ring-[#E5C158]/70"
        >
          <div className="relative overflow-hidden rounded-lg border border-[#D4AF37]/35 px-6 py-8 sm:px-9 sm:py-10">
            {/* Straight Ceremonial Corner Marks */}
            <span className="pointer-events-none absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-[#D4AF37]/60" />
            <span className="pointer-events-none absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-[#D4AF37]/60" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-[#D4AF37]/60" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[#D4AF37]/60" />

            {/* Uncropped Square Framed Club Photo */}
            {occasion.heroImage && (
              <div className="relative mx-auto mb-6 h-36 w-36 overflow-hidden rounded-xl border border-[#D4AF37]/70 bg-[#061533] p-1 shadow-md sm:h-44 sm:w-44">
                <img
                  src={occasion.heroImage}
                  alt={occasion.organization}
                  className="h-full w-full rounded-lg object-contain"
                />
              </div>
            )}

            {/* Recipient Address */}
            <div className="relative text-center">
              <p className="font-serif-classic text-xs font-semibold tracking-[0.22em] text-[#E5C158] uppercase">
                Trân trọng kính gửi
              </p>
              <p className="font-serif-classic mt-2 text-xl leading-snug font-bold text-white text-balance sm:text-[28px]">
                {recipientDisplay.split('\n').map((line, idx) => (
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
              <div className="my-4 flex items-center justify-center gap-3" aria-hidden="true">
                <span className="h-px w-12 bg-[#D4AF37]/50" />
                <span className="h-1.5 w-1.5 bg-[#E5C158]" />
                <span className="h-px w-12 bg-[#D4AF37]/50" />
              </div>
              <p className="font-serif-classic text-sm leading-relaxed italic text-[#CFE0F5] text-balance sm:text-[15px]">
                “{occasion.motto}”
              </p>
              {occasion.mottoSubline && (
                <p className="font-serif-classic mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-[#E5C158]/90 uppercase whitespace-nowrap sm:text-xs">
                  <span aria-hidden="true" className="text-[#D4AF37]/75">•</span>
                  <span>{occasion.mottoSubline}</span>
                  <span aria-hidden="true" className="text-[#D4AF37]/75">•</span>
                </p>
              )}
            </div>

            {/* Dignified Upright Seal Button */}
            <div className="mt-7 flex flex-col items-center">
              <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-[#E5C158] bg-[#8E1919] text-[#FDE68A] shadow-lg ring-4 ring-[#8E1919]/40 transition-transform duration-300 group-hover:scale-105">
                <MailOpen className="h-5 w-5 text-[#F0D57A]" />
                <span className="font-serif-classic mt-1 text-[10px] font-bold tracking-[0.12em] text-[#FDE68A] uppercase">
                  {occasion.sealText}
                </span>
              </div>
              <span className="font-serif-classic mt-4 text-xs font-semibold tracking-[0.18em] text-[#E5C158] uppercase transition-colors group-hover:text-[#F0D57A]">
                Chạm để mở thiệp tri ân
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
