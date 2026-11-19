import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MailOpen } from 'lucide-react';
import { OccasionConfig } from '../types/occasion';

interface EnvelopeIntroProps {
  occasion: OccasionConfig;
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

    // Ceremonial Vovinam gold, blue & red confetti burst
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.58 },
      colors: ['#D4AF37', '#FDE68A', '#1D63DC', '#DC2626', '#FFFFFF'],
    });

    window.setTimeout(() => {
      onOpen();
    }, 650);
  };

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div
        className={`w-full max-w-lg transition-all duration-700 ease-out ${
          opening ? 'scale-105 opacity-0 -translate-y-6' : 'scale-100 opacity-100'
        }`}
      >
        {/* Top Ceremonial Badge */}
        <div className="mb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-200 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            {occasion.dateLabel}
          </span>
          <h1 className="mt-4 font-serif-display text-3xl font-bold tracking-wide text-gold-foil sm:text-4xl">
            {occasion.envelopeTitle}
          </h1>
          <p className="mt-1.5 text-sm text-blue-200/80">{occasion.organization}</p>
        </div>

        {/* Interactive Envelope Container */}
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
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-300/35 bg-gradient-to-br from-[#0b2a66] via-[#09204d] to-[#061534] p-1 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.75)] transition-transform duration-300 hover:scale-[1.015] focus:outline-none focus:ring-2 focus:ring-amber-300/60"
        >
          <div className="relative overflow-hidden rounded-xl border border-amber-300/20 px-6 py-9 sm:px-9 sm:py-11">
            {/* Decorative Envelope Flap V-lines */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 130"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-0 h-28 w-full opacity-40 transition-transform duration-500 group-hover:translate-y-0.5"
            >
              <path
                d="M0 0 L200 115 L400 0"
                fill="rgba(29, 99, 220, 0.25)"
                stroke="#D4AF37"
                strokeWidth="1.2"
              />
            </svg>

            {/* Corner Gold Accents */}
            <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t-2 border-l-2 border-amber-400/50" />
            <span className="pointer-events-none absolute top-3 right-3 h-5 w-5 border-t-2 border-r-2 border-amber-400/50" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 border-b-2 border-l-2 border-amber-400/50" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-amber-400/50" />

            {/* Club Photo Mini Preview inside Envelope */}
            {occasion.heroImage && (
              <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-full border-2 border-amber-300/70 shadow-lg ring-4 ring-blue-500/20">
                <img
                  src={occasion.heroImage}
                  alt={occasion.organization}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Recipient Address */}
            <div className="relative text-center">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-amber-300/80">
                Trân trọng kính gửi
              </p>
              <p className="mt-2 font-serif-display text-2xl font-bold text-white sm:text-3xl">
                {recipientDisplay}
              </p>
              <p className="mt-2 text-xs italic text-blue-200/80 sm:text-sm">
                “{occasion.motto}”
              </p>
            </div>

            {/* Wax Seal Button */}
            <div className="mt-8 flex flex-col items-center">
              <div className="animate-seal-pulse flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-amber-300/80 bg-gradient-to-br from-red-700 via-red-800 to-red-950 text-amber-100 shadow-xl transition-transform duration-300 group-hover:scale-110">
                <MailOpen className="h-5 w-5 text-amber-200" />
                <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  {occasion.sealText}
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-amber-200/90 transition-colors group-hover:text-amber-100">
                Chạm để mở thiệp tri ân
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
