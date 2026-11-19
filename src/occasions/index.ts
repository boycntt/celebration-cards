import { OccasionConfig } from '../core/types/occasion';
import { teachersDay2011Config } from './teachers-day-20-11/config';

const upcomingOccasions: OccasionConfig[] = [
  {
    slug: 'tet-nguyen-dan',
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

export const DEFAULT_OCCASION_SLUG = teachersDay2011Config.slug;

export function getOccasionBySlug(slug: string): OccasionConfig {
  return (
    OCCASIONS_REGISTRY.find((item) => item.slug === slug && item.status === 'active') ||
    teachersDay2011Config
  );
}
