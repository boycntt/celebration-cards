export type ParticleTheme = 'bamboo-gold' | 'blossom-tet' | 'petals-pink' | 'confetti-festive';

export interface RecipientPreset {
  id: string;
  label: string;
  shortLabel: string;
  salutation: string;
  recipientTitle: string;
  headline: string;
  quote: string;
  paragraphs: string[];
  closing: string;
  signature: string;
}

export interface WishItem {
  id: string;
  author: string;
  role: string;
  message: string;
  createdAt: string;
}

export interface OccasionConfig {
  slug: string;
  title: string;
  subtitle: string;
  dateBadge: string;
  dateLabel: string;
  organization: string;
  status: 'active' | 'coming-soon';
  particleTheme: ParticleTheme;
  accentColor: string;
  heroImage?: string;
  heroImageCaption?: string;
  envelopeTitle: string;
  envelopeSubtitle: string;
  sealText: string;
  motto: string;
  presets: RecipientPreset[];
  defaultWishes: WishItem[];
}

export interface CardPersonalization {
  presetId: string;
  customTo: string;
  customFrom: string;
  customMessage: string;
}
