import type { WishItem } from '../../platform/types';

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

export interface VvntxOccasionConfig {
  accessSlug: string;
  title: string;
  pageTitle: string;
  description: string;
  themeColor: string;
  subtitle: string;
  dateBadge: string;
  dateLabel: string;
  organization: string;
  organizationSubline?: string;
  heroImage: string;
  heroImageCaption: string;
  envelopeTitle: string;
  envelopeSubtitle: string;
  sealText: string;
  motto: string;
  mottoSubline?: string;
  defaultWishRole: string;
  presets: RecipientPreset[];
  defaultWishes: WishItem[];
}

export const VVNTX_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap';

export const vvntx2011Config: VvntxOccasionConfig = {
  accessSlug: 'vvntx2011',
  title: 'Ngày Nhà Giáo Việt Nam 20/11',
  pageTitle: 'Tri Ân 20/11 — Võ sư Lữ Thanh Xuân & CLB Vovinam Thanh Xuân',
  description:
    'Thiệp chúc mừng Ngày Nhà giáo Việt Nam 20/11 kính tặng Võ sư Lữ Thanh Xuân và các anh em giáo chức CLB Vovinam Thanh Xuân — Cương Nhu Phối Triển.',
  themeColor: '#071A3C',
  subtitle: 'Tri ân Võ sư Lữ Thanh Xuân & Các Anh Em Giáo Chức CLB Vovinam Thanh Xuân',
  dateBadge: '20 / 11',
  dateLabel: 'Kỷ niệm Ngày Nhà Giáo Việt Nam',
  organization: 'CLB Vovinam Thanh Xuân',
  organizationSubline: 'Khung Trời Kỷ Niệm',
  heroImage: '/images/vovinam-thanh-xuan-20.jpg',
  heroImageCaption: '20 Năm Vovinam Thanh Xuân — Khung Trời Kỷ Niệm',
  envelopeTitle: 'Thiệp Tri Ân 20/11',
  envelopeSubtitle: 'CLB Vovinam Thanh Xuân',
  sealText: 'Mở Thiệp',
  motto: 'Bàn tay thép đặt lên trái tim từ ái',
  mottoSubline: 'Cương Nhu Phối Triển',
  defaultWishRole: 'Môn sinh CLB Vovinam Thanh Xuân',
  presets: [
    {
      id: 'all',
      label: 'Thầy Xuân & Anh Em Giáo Chức',
      shortLabel: 'Toàn thể CLB',
      salutation: 'Trân trọng kính gửi',
      recipientTitle: 'Võ sư Lữ Thanh Xuân\nCác Anh Em Giáo Chức',
      headline: 'Chúc Mừng Ngày Nhà Giáo Việt Nam 20/11',
      quote: '“Một đời rèn võ, một đời trồng người,\ngiữ trọn ngọn lửa Việt Võ Đạo.”',
      paragraphs: [
        'Nhân dịp kỷ niệm Ngày Nhà giáo Việt Nam 20/11, tập thể môn sinh và đồng môn CLB Vovinam Thanh Xuân xin gửi lời tri ân sâu sắc cùng lời chúc sức khỏe, bình an và vững bền nhiệt huyết đến Võ sư Lữ Thanh Xuân cùng toàn thể các anh em giáo chức.',
        'Cảm ơn Thầy và các anh em đã luôn tận tâm dìu dắt, không chỉ truyền trao từng thế võ, đường quyền của môn phái Vovinam – Việt Võ Đạo, mà còn thắp sáng tinh thần khiêm nhường, bao dung và bản lĩnh sống “Cương Nhu Phối Triển” trên cả bục giảng lẫn sân tập.',
        'Kính chúc Thầy Xuân và các anh em giáo chức luôn mạnh khỏe, hạnh phúc, mãi là ngọn hải đăng soi đường cho biết bao thế hệ học trò và môn sinh Vovinam Thanh Xuân!',
      ],
      closing: 'Nghiêm lễ tri ân,',
      signature: 'Tập thể Môn sinh & Đồng môn\nCLB Vovinam Thanh Xuân',
    },
    {
      id: 'thay-xuan',
      label: 'Kính tặng Võ sư Lữ Thanh Xuân',
      shortLabel: 'Võ sư Lữ Thanh Xuân',
      salutation: 'Kính dâng người Thầy đáng kính',
      recipientTitle: 'Võ sư Lữ Thanh Xuân',
      headline: 'Tri Ân Người Thầy Gieo Mầm Võ Đạo',
      quote: '“Ơn Thầy soi lối võ đạo,\nnghĩa nặng tình sâu suốt chặng đường 20 năm.”',
      paragraphs: [
        'Nhân ngày Nhà giáo Việt Nam 20/11, toàn thể học trò và anh em CLB Vovinam Thanh Xuân xin cúi đầu Nghiêm lễ, gửi lời chúc sức khỏe dồi dào, tâm an trí sáng đến Võ sư Lữ Thanh Xuân.',
        'Hơn hai thập kỷ bền bỉ gây dựng mái nhà chung Vovinam Thanh Xuân và phong trào Vovinam học đường, Thầy không chỉ dạy chúng con cách đứng vững trước thử thách bằng kỹ thuật võ thuật, mà còn dạy cách sống tử tế, trọng nghĩa và bao dung với mọi người.',
        'Dù đi đâu, làm gì, màu áo xanh lam và những lời răn dạy của Thầy sẽ mãi là hành trang quý giá nhất trong khung trời kỷ niệm của mỗi thế hệ môn sinh Thanh Xuân.',
      ],
      closing: 'Môn sinh xin kính chúc Thầy,',
      signature: 'Các thế hệ Học trò\nCLB Vovinam Thanh Xuân',
    },
    {
      id: 'giao-chuc',
      label: 'Tặng Các Anh Em Giáo Chức CLB',
      shortLabel: 'Anh Em Giáo Chức',
      salutation: 'Thân ái chúc mừng',
      recipientTitle: 'Các Anh Em Giáo Chức\nCLB Vovinam Thanh Xuân',
      headline: 'Chúc Mừng Những Người Lái Đò Áo Xanh',
      quote: '“Trên bục giảng trao tri thức,\ntrên sân tập giữ lửa Việt Võ Đạo.”',
      paragraphs: [
        'Nhân ngày Nhà giáo Việt Nam 20/11, xin gửi lời chúc mừng nồng nhiệt và trân trọng nhất tới toàn thể các anh em giáo chức, giảng viên, thầy cô giáo trong đại gia đình CLB Vovinam Thanh Xuân.',
        'Thật tự hào khi giữa nhịp sống bận rộn, các anh em vẫn vừa hoàn thành xuất sắc sứ mệnh “trồng người” cao quý trên bục giảng, vừa chung tay gìn giữ và lan tỏa ngọn lửa đam mê Vovinam đến với thế hệ trẻ.',
        'Chúc các anh em giáo chức luôn dồi dào sức khỏe, vững tay chèo, gặt hái thật nhiều thành công trong sự nghiệp giáo dục và luôn giữ mãi tinh thần đồng môn gắn kết của Vovinam Thanh Xuân!',
      ],
      closing: 'Thân ái & Nghiêm lễ,',
      signature: 'Đại gia đình\nCLB Vovinam Thanh Xuân',
    },
  ],
  defaultWishes: [
    {
      id: 'default-1',
      author: 'Tập thể Cựu môn sinh Thanh Xuân',
      role: 'Khung trời kỷ niệm 20 năm',
      message:
        'Kính chúc Võ sư Lữ Thanh Xuân và các anh em giáo chức ngày 20/11 thật nhiều sức khỏe, niềm vui và mãi giữ ngọn lửa nhiệt huyết với sự nghiệp trồng người & Việt Võ Đạo!',
      createdAt: '20/11/2026',
    },
    {
      id: 'default-2',
      author: 'Anh em Đai Vàng – Đai Xanh',
      role: 'CLB Vovinam Thanh Xuân',
      message:
        'Cảm ơn Thầy Xuân đã luôn tận tâm dìu dắt từng thế hệ môn sinh. Chúc Thầy và các anh em đang công tác trong ngành giáo dục một mùa Hiến chương Nhà giáo thật trọn vẹn và ấm áp!',
      createdAt: '20/11/2026',
    },
    {
      id: 'default-3',
      author: 'Môn sinh Vovinam Thanh Xuân',
      role: 'Đồng môn',
      message:
        'Bàn tay thép đặt lên trái tim từ ái. Xin Nghiêm lễ tri ân Thầy Xuân cùng toàn thể các anh em giáo chức CLB — những người lái đò thầm lặng đáng kính!',
      createdAt: '20/11/2026',
    },
  ],
};
