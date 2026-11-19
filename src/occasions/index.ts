import { OccasionConfig } from '../core/types/occasion';
import { teachersDay2011Config } from './teachers-day-20-11/config';

const upcomingOccasions: OccasionConfig[] = [
  {
    slug: 'tet-nguyen-dan',
    accessSlug: 'vovinamthanhxuantet2027',
    validFrom: '2027-02-01T00:00:00+07:00',
    validTo: '2027-02-20T23:59:59+07:00',
    title: 'Chúc Mừng Năm Mới — Tết Nguyên Đán',
    subtitle: 'Thiệp Xuân An Khang & Tinh thần Thượng Võ gửi đại gia đình CLB',
    dateBadge: 'Tết Âm Lịch',
    dateLabel: 'Xuân Đinh Mùi',
    organization: 'CLB Vovinam Thanh Xuân',
    status: 'coming-soon',
    particleTheme: 'blossom-tet',
    accentColor: '#DC2626',
    envelopeTitle: 'Thiệp Chúc Xuân',
    envelopeSubtitle: 'CLB Vovinam Thanh Xuân',
    sealText: 'An Khang',
    motto: 'Xuân mới vững bước — Việt Võ Đạo vươn xa',
    presets: [],
    defaultWishes: [],
  },
  {
    slug: 'quoc-te-phu-nu-8-3',
    accessSlug: 'vovinamthanhxuan08032027',
    validFrom: '2027-03-04T00:00:00+07:00',
    validTo: '2027-03-12T23:59:59+07:00',
    title: 'Quốc Tế Phụ Nữ 8/3',
    subtitle: 'Tôn vinh các nữ môn sinh & nữ huấn luyện viên Vovinam Thanh Xuân',
    dateBadge: '08 / 03',
    dateLabel: 'Ngày Quốc tế Phụ nữ 8/3',
    organization: 'CLB Vovinam Thanh Xuân',
    status: 'coming-soon',
    particleTheme: 'petals-pink',
    accentColor: '#EC4899',
    envelopeTitle: 'Thiệp Chúc Mừng 8/3',
    envelopeSubtitle: 'CLB Vovinam Thanh Xuân',
    sealText: '8 / 3',
    motto: 'Bản lĩnh — Dịu dàng — Tỏa sáng',
    presets: [],
    defaultWishes: [],
  },
  {
    slug: 'phu-nu-viet-nam-20-10',
    accessSlug: 'vovinamthanhxuan20102027',
    validFrom: '2027-10-16T00:00:00+07:00',
    validTo: '2027-10-25T23:59:59+07:00',
    title: 'Ngày Phụ Nữ Việt Nam 20/10',
    subtitle: 'Gửi lời chúc yêu thương tới các bông hoa áo xanh lam CLB',
    dateBadge: '20 / 10',
    dateLabel: 'Ngày Phụ nữ Việt Nam 20/10',
    organization: 'CLB Vovinam Thanh Xuân',
    status: 'coming-soon',
    particleTheme: 'petals-pink',
    accentColor: '#F43F5E',
    envelopeTitle: 'Thiệp Chúc Mừng 20/10',
    envelopeSubtitle: 'CLB Vovinam Thanh Xuân',
    sealText: '20 / 10',
    motto: 'Tự tin — Kiên cường — Duyên dáng',
    presets: [],
    defaultWishes: [],
  },
  {
    slug: 'ky-niem-clb-vovinam-thanh-xuan',
    accessSlug: 'vovinamthanhxuankyniem2027',
    validFrom: '2027-04-01T00:00:00+07:00',
    validTo: '2027-04-30T23:59:59+07:00',
    title: 'Kỷ Niệm Thành Lập CLB Vovinam Thanh Xuân',
    subtitle: 'Khung trời kỷ niệm — Hành trình gắn kết các thế hệ môn sinh từ 2006',
    dateBadge: 'Tháng 4',
    dateLabel: 'Kỷ niệm Thành lập CLB',
    organization: 'CLB Vovinam Thanh Xuân',
    status: 'coming-soon',
    particleTheme: 'confetti-festive',
    accentColor: '#1D63DC',
    envelopeTitle: 'Thiệp Kỷ Niệm CLB',
    envelopeSubtitle: 'CLB Vovinam Thanh Xuân',
    sealText: 'Thanh Xuân',
    motto: 'Một nhà Vovinam — Trọn nghĩa đồng môn',
    presets: [],
    defaultWishes: [],
  },
];

export const OCCASIONS_REGISTRY: OccasionConfig[] = [
  teachersDay2011Config,
  ...upcomingOccasions,
];

export function isOccasionWithinValidWindow(
  occasion: OccasionConfig,
  now: Date = new Date()
): boolean {
  const fromMs = Date.parse(occasion.validFrom);
  const toMs = Date.parse(occasion.validTo);
  const nowMs = now.getTime();

  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) {
    return false;
  }

  return nowMs >= fromMs && nowMs <= toMs;
}

export function resolveValidOccasion(
  accessSlug: string | null,
  now: Date = new Date()
): OccasionConfig | null {
  if (!accessSlug) {
    return null;
  }

  const normalized = accessSlug.trim().toLowerCase();
  const matched = OCCASIONS_REGISTRY.find(
    (item) =>
      item.status === 'active' &&
      item.accessSlug.toLowerCase() === normalized &&
      isOccasionWithinValidWindow(item, now)
  );

  return matched ?? null;
}
