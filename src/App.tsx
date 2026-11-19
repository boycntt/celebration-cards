import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mail, Users } from 'lucide-react';
import { ParticleCanvas } from './core/components/ParticleCanvas';
import { EnvelopeIntro } from './core/components/EnvelopeIntro';
import { ExportShareBar } from './core/components/ExportShareBar';
import { WishWall } from './core/components/WishWall';
import { NotFoundPage } from './core/components/NotFoundPage';
import { CardPersonalization } from './core/types/occasion';
import {
  buildShareUrl,
  extractAccessSlugFromPath,
  readPersonalizationFromUrl,
} from './core/utils/urlParams';
import { resolveValidOccasion } from './occasions';
import { TeachersDayCard } from './occasions/teachers-day-20-11/TeachersDayCard';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const occasion = useMemo(() => {
    const accessSlug = extractAccessSlugFromPath(pathname);
    return resolveValidOccasion(accessSlug);
  }, [pathname]);

  const defaultPresetId = occasion?.presets[0]?.id ?? 'all';
  const [personalization, setPersonalization] = useState<CardPersonalization>(() =>
    readPersonalizationFromUrl(defaultPresetId)
  );
  const [isOpened, setIsOpened] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!occasion) {
    return <NotFoundPage />;
  }

  const activePreset =
    occasion.presets.find((p) => p.id === personalization.presetId) ||
    occasion.presets[0];

  const recipientDisplay =
    personalization.customTo.trim() || activePreset?.recipientTitle || occasion.title;

  const handleSelectPreset = (presetId: string) => {
    const next: CardPersonalization = {
      ...personalization,
      presetId,
    };
    setPersonalization(next);
    const nextUrl = buildShareUrl(occasion.accessSlug, next, defaultPresetId);
    window.history.replaceState({}, '', nextUrl);
  };

  return (
    <div className="bg-vovinam-night relative min-h-screen text-slate-100">
      {/* Ambient Bamboo & Gold Particle Canvas */}
      <ParticleCanvas theme={occasion.particleTheme} />

      {/* Top Navigation Header */}
      <header className="relative z-20 mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="font-serif-classic inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/60 bg-[#0B2A5B]/80 text-sm font-bold text-[#F0D57A] shadow">
            VN
          </span>
          <div>
            <p className="font-serif-classic text-xs font-bold tracking-[0.14em] text-[#F0D57A] uppercase">
              Vovinam Thanh Xuân
            </p>
            <p className="text-[11px] text-blue-200/80">Thiệp Tri Ân • Việt Võ Đạo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpened && (
            <button
              type="button"
              onClick={() => setIsOpened(false)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/35 bg-[#081F4A]/85 px-3 py-1.5 text-xs font-medium text-[#F5E6B8] transition hover:border-[#E5C158] hover:text-[#F0D57A]"
            >
              <Mail className="h-3.5 w-3.5" />
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
            onChangePersonalization={setPersonalization}
            cardRef={cardRef}
          />

          {/* Wish Wall (Sổ Lưu Bút) */}
          <WishWall
            occasionSlug={occasion.slug}
            defaultWishes={occasion.defaultWishes}
          />

          <footer className="mt-12 text-center text-xs text-blue-200/60">
            <p className="font-serif-classic">
              CLB Vovinam Thanh Xuân • Tôn Sư Trọng Đạo • Cương Nhu Phối Triển
            </p>
          </footer>
        </main>
      )}
    </div>
  );
};

export default App;
