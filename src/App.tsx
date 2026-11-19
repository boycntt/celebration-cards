import React, { useMemo, useRef, useState } from 'react';
import { LayoutGrid, Mail, Users } from 'lucide-react';
import { ParticleCanvas } from './core/components/ParticleCanvas';
import { EnvelopeIntro } from './core/components/EnvelopeIntro';
import { ExportShareBar } from './core/components/ExportShareBar';
import { WishWall } from './core/components/WishWall';
import { OccasionHubModal } from './core/components/OccasionHubModal';
import { CardPersonalization } from './core/types/occasion';
import {
  buildShareUrl,
  getInitialOccasionSlug,
  readPersonalizationFromUrl,
} from './core/utils/urlParams';
import {
  DEFAULT_OCCASION_SLUG,
  OCCASIONS_REGISTRY,
  getOccasionBySlug,
} from './occasions';
import { TeachersDayCard } from './occasions/teachers-day-20-11/TeachersDayCard';

export const App: React.FC = () => {
  const [activeSlug, setActiveSlug] = useState<string>(() =>
    getInitialOccasionSlug(DEFAULT_OCCASION_SLUG)
  );
  const occasion = useMemo(() => getOccasionBySlug(activeSlug), [activeSlug]);

  const defaultPresetId = occasion.presets[0]?.id ?? 'all';
  const [personalization, setPersonalization] = useState<CardPersonalization>(() =>
    readPersonalizationFromUrl(defaultPresetId)
  );
  const [isOpened, setIsOpened] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const activePreset = useMemo(() => {
    return (
      occasion.presets.find((p) => p.id === personalization.presetId) ||
      occasion.presets[0]
    );
  }, [occasion, personalization.presetId]);

  const recipientDisplay =
    personalization.customTo.trim() || activePreset?.recipientTitle || occasion.title;

  const handleSelectPreset = (presetId: string) => {
    const next: CardPersonalization = {
      ...personalization,
      presetId,
    };
    setPersonalization(next);
    const nextUrl = buildShareUrl(occasion.slug, next, defaultPresetId);
    window.history.replaceState({}, '', nextUrl);
  };

  const handleSelectOccasion = (slug: string) => {
    setActiveSlug(slug);
    setIsOpened(false);
    window.history.replaceState({}, '', `/card/${slug}`);
  };

  return (
    <div className="bg-vovinam-night relative min-h-screen text-slate-100">
      {/* Ambient Bamboo & Gold Particle Canvas */}
      <ParticleCanvas theme={occasion.particleTheme} />

      {/* Top Navigation Header */}
      <header className="relative z-20 mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-amber-300/40 bg-blue-900/60 font-serif-display text-sm font-bold text-amber-300 shadow">
            VN
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wider text-amber-200 uppercase">
              Vovinam Thanh Xuân
            </p>
            <p className="text-[11px] text-blue-200/70">Celebration Cards</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOpened && (
            <button
              type="button"
              onClick={() => setIsOpened(false)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-400/25 bg-blue-950/60 px-3 py-1.5 text-xs font-medium text-blue-100 backdrop-blur-md transition hover:border-amber-300/50 hover:text-amber-200"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Xem phong bì</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowHub(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/35 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-200 backdrop-blur-md transition hover:bg-amber-400/20"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Các dịp lễ</span>
          </button>
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
              <span className="mr-1 inline-flex items-center gap-1 text-xs text-blue-200/70">
                <Users className="h-3.5 w-3.5 text-amber-300" />
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
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25'
                        : 'border border-blue-400/30 bg-blue-950/60 text-blue-100 hover:border-amber-300/50'
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

          <footer className="mt-12 text-center text-xs text-blue-200/55">
            <p>CLB Vovinam Thanh Xuân • Tôn Sư Trọng Đạo • Cương Nhu Phối Triển</p>
          </footer>
        </main>
      )}

      {/* Multi-Occasion Gallery Modal */}
      <OccasionHubModal
        open={showHub}
        occasions={OCCASIONS_REGISTRY}
        activeSlug={occasion.slug}
        onSelect={handleSelectOccasion}
        onClose={() => setShowHub(false)}
      />
    </div>
  );
};

export default App;
