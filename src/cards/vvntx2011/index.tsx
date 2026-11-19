import React, { useRef, useState } from 'react';
import { Mail, Users } from 'lucide-react';
import { useDocumentHead } from '../../platform/hooks/useDocumentHead';
import { useShareLink } from '../../platform/hooks/useShareLink';
import { BambooParticleCanvas } from './components/BambooParticleCanvas';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { ExportShareBar } from './components/ExportShareBar';
import { TeachersDayCard } from './components/TeachersDayCard';
import { WishWall } from './components/WishWall';
import { VVNTX_GOOGLE_FONTS_URL, vvntx2011Config } from './config';
import './theme.css';

export const Vvntx2011Page: React.FC = () => {
  const occasion = vvntx2011Config;
  const defaultPresetId = occasion.presets[0]?.id ?? 'all';

  useDocumentHead({
    title: occasion.pageTitle,
    description: occasion.description,
    themeColor: occasion.themeColor,
    fontUrls: [VVNTX_GOOGLE_FONTS_URL],
  });

  const {
    personalization,
    copied,
    syncUrl,
    resetPersonalization,
    copyShareUrl,
    generateQrDataUrl,
  } = useShareLink({
    accessSlug: occasion.accessSlug,
    defaultPresetId,
  });

  const [isOpened, setIsOpened] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const activePreset =
    occasion.presets.find((p) => p.id === personalization.presetId) || occasion.presets[0];

  const recipientDisplay =
    personalization.customTo.trim() || activePreset?.recipientTitle || occasion.title;

  const handleSelectPreset = (presetId: string) => {
    syncUrl({
      ...personalization,
      presetId,
    });
  };

  return (
    <div className="vvntx2011-root bg-vovinam-night relative min-h-screen text-slate-100 selection:bg-amber-400/30 selection:text-amber-100">
      {/* Ambient Bamboo & Gold Particle Canvas */}
      <BambooParticleCanvas />

      {/* Top Navigation Header */}
      <header className="relative z-20 mx-auto flex max-w-4xl items-center justify-between gap-2 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="font-serif-classic inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/60 bg-[#0B2A5B]/80 text-sm font-bold text-[#F0D57A] shadow">
            VN
          </span>
          <div className="min-w-0">
            <p className="font-serif-classic text-xs font-bold tracking-[0.14em] text-[#F0D57A] uppercase whitespace-nowrap">
              CLB Vovinam Thanh Xuân
            </p>
            <p className="text-[11px] text-blue-200/80 whitespace-nowrap">
              Thiệp Tri Ân • Việt Võ Đạo
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isOpened && (
            <button
              type="button"
              onClick={() => setIsOpened(false)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#D4AF37]/35 bg-[#081F4A]/85 px-3 py-1.5 text-xs font-medium text-[#F5E6B8] whitespace-nowrap transition hover:border-[#E5C158] hover:text-[#F0D57A]"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>Xem phong bì</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Stage */}
      {!isOpened ? (
        <EnvelopeIntro
          occasion={occasion}
          recipientDisplay={recipientDisplay}
          onOpen={() => setIsOpened(true)}
        />
      ) : (
        <main className="relative z-10 pb-16 pt-2">
          {/* Recipient Switcher Pills */}
          {occasion.presets.length > 1 && (
            <div className="mx-auto mb-5 flex max-w-2xl flex-wrap items-center justify-center gap-2 px-3">
              <span className="mr-1 inline-flex items-center gap-1 text-xs text-blue-200/80">
                <Users className="h-3.5 w-3.5 text-[#E5C158]" />
                Đối tượng:
              </span>
              {occasion.presets.map((preset) => {
                const selected = preset.id === activePreset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                      selected
                        ? 'bg-[#E5C158] text-[#061533] shadow-md'
                        : 'border border-blue-400/35 bg-[#081F4A]/80 text-blue-100 hover:border-[#E5C158]/60'
                    }`}
                  >
                    {preset.shortLabel}
                  </button>
                );
              })}
            </div>
          )}

          {/* Active Occasion Card */}
          <TeachersDayCard
            occasion={occasion}
            preset={activePreset}
            personalization={personalization}
            cardRef={cardRef}
          />

          {/* Export PNG / Customize / Copy Link / QR */}
          <ExportShareBar
            occasion={occasion}
            personalization={personalization}
            copied={copied}
            onSyncPersonalization={syncUrl}
            onResetPersonalization={resetPersonalization}
            onCopyShareUrl={copyShareUrl}
            onGenerateQrDataUrl={generateQrDataUrl}
            cardRef={cardRef}
          />

          {/* Wish Wall (Sổ Lưu Bút) */}
          <WishWall
            accessSlug={occasion.accessSlug}
            defaultWishes={occasion.defaultWishes}
            defaultRole={occasion.defaultWishRole}
          />

          <footer className="mt-12 space-y-1 text-center text-xs text-blue-200/60">
            <p className="font-serif-classic font-semibold text-blue-200/75 whitespace-nowrap">
              CLB Vovinam Thanh Xuân
            </p>
            <p className="font-serif-classic flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
              <span className="whitespace-nowrap">Tôn Sư Trọng Đạo</span>
              <span aria-hidden="true">•</span>
              <span className="whitespace-nowrap">Cương Nhu Phối Triển</span>
            </p>
          </footer>
        </main>
      )}
    </div>
  );
};

export default Vvntx2011Page;
