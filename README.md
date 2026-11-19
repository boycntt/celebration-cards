# Celebration Cards — Nền Tảng Thiệp Chúc Mừng Đa Dịp Lễ

Nền tảng thiệp chúc mừng điện tử thiết kế độc lập theo từng đường dẫn (**Per-URL Vertical Slice Architecture**), trong đó mỗi đường dẫn thiệp (`/:slug`) là một module tự chứa hoàn toàn (giao diện, bảng màu, font chữ, CSS, hiệu ứng riêng) được tải lười (`React.lazy`) trên nền tảng SDK không giao diện (**Headless Platform SDK**) và **Shared Manifest + SSR Meta** cho Zalo/Facebook preview.

## Đường dẫn truy cập & Thời gian hiển thị

Mỗi tấm thiệp được khai báo trong `shared/cards-manifest.json` với `accessSlug` và khung thời gian hiệu lực (`validFrom` → `validTo`, múi giờ `+07:00`). Các đường dẫn không hợp lệ (bao gồm `/`) hoặc ngoài thời gian hiển thị sẽ trả về mã HTTP `404` kèm trang **404 — Không tìm thấy thiệp** trung tính.

- **Thiệp Tri Ân Ngày Nhà Giáo Việt Nam 20/11 (CLB Vovinam Thanh Xuân):**
  - Đường dẫn truy cập: `/vvntx2011` (cũng hỗ trợ `/card/vvntx2011`)
  - Thời gian hiệu lực: `15/11/2026 00:00:00 +07:00` → `25/11/2026 23:59:59 +07:00`

## Kiến trúc hệ thống

```text
shared/
  cards-manifest.json      # Nguồn chân lý chung (slug, validFrom/validTo, SSR meta, backendOptions)
server/
  index.mjs                # Express server: SSR Open Graph meta, HTTP 404 thật, Shared Backend APIs
src/
  App.tsx                  # Pure URL Router + Date-Window Guard + React.Suspense + NotFoundPage
  index.css                # Chỉ chứa Tailwind + reset trung tính (không CSS riêng của thiệp)
  platform/                # Headless Platform SDK (KHÔNG chứa UI/CSS/branding của bất kỳ dịp lễ nào)
    types.ts               # CardManifestEntry, CardRouteEntry, WishItem, WishFeedback
    router/
      urlParams.ts         # extractAccessSlugFromPath, readQueryParams, buildCardUrl
      routeGuard.ts        # isRouteWithinValidWindow, resolveValidCardRoute
    hooks/
      useWishes.ts         # Headless API /api/wishes/:slug + localStorage fallback ngoại tuyến
      useShareLink.ts      # Cá nhân hóa URL (?preset, ?to, ?from, ?msg), copy link, tạo mã QR
      useDocumentHead.ts   # Cập nhật document.title, theme-color và nạp/gỡ Google Fonts động theo thiệp
    utils/
      exportImage.ts       # Xuất ảnh PNG sắc nét (html-to-image, tùy chỉnh backgroundColor & pixelRatio)
    components/
      NotFoundPage.tsx     # Trang 404 trung tính (slate/zinc)
  cards/
    registry.ts            # Đọc shared/cards-manifest.json và ánh xạ React.lazy() cho từng slug
    vvntx2011/             # Vertical slice tự chứa 100% cho thiệp 20/11 CLB Vovinam Thanh Xuân
      index.tsx            # Entry component (default export) + useDocumentHead + ./theme.css
      theme.css            # Bảng màu, font chữ, hiệu ứng riêng của thiệp 20/11
      config.ts            # Nội dung lời chúc, presets, defaultWishes
      components/          # EnvelopeIntro, TeachersDayCard, VovinamDecorations, BambooParticleCanvas, ExportShareBar, WishWall
```

## Chạy cục bộ (Local Development)

1. Tạo file `.env` từ mẫu `.env.example` và điền chuỗi kết nối MongoDB Atlas của bạn (tuyệt đối không commit file `.env` lên Git):

```bash
cp .env.example .env
```

2. Cài đặt dependencies và chạy server API + Vite dev server:

```bash
npm install
# Terminal 1 — chạy backend Express + MongoDB (mặc định cổng 3001)
npm run server
# Terminal 2 — chạy frontend Vite (proxy /api -> http://localhost:3001)
npm run dev
```

3. Build và chạy bản production:

```bash
npm run build
npm start
```

Mở trình duyệt tại `http://localhost:3001/vvntx2011`.

## Mở rộng thêm thiệp mới (`src/cards/<slug>/`)

Để thêm một tấm thiệp hoàn toàn độc lập cho dịp lễ mới (ví dụ: `tet2027`):

1. **Khai báo trong `shared/cards-manifest.json`**:
   - Cập nhật `status: "active"`, `validFrom`, `validTo`, thông tin `meta` (`title`, `description`, `ogImage`, `themeColor`) để server tự động inject thẻ Open Graph (Zalo/Facebook preview).
   - Bật/tắt các **Shared Backend Options** tùy chọn ngay trong manifest:
     ```json
     "backendOptions": {
       "wishes": {
         "enabled": true,
         "collectionKey": "tet-2027",
         "defaultRole": "Khách mời",
         "maxMessageLength": 600
       }
     }
     ```
     Khi `backendOptions.wishes.enabled` là `true`, backend tự động mở `GET/POST /api/wishes/<slug>` kết nối MongoDB; nếu không khai báo hoặc `enabled: false`, endpoint sẽ trả về `404`.

2. **Tạo vertical slice trong `src/cards/<slug>/`**:
   - Tạo `src/cards/<slug>/index.tsx` (default export), `theme.css`, `config.ts` và các component riêng.
   - Tùy chọn dùng các hook headless từ `src/platform/hooks/` (`useDocumentHead`, `useShareLink`, `useWishes`) và `exportElementToPng` từ `src/platform/utils/exportImage.ts`.

3. **Đăng ký lazy chunk trong `src/cards/registry.ts`**:
   ```ts
   const CARD_COMPONENTS = {
     vvntx2011: React.lazy(() => import('./vvntx2011')),
     tet2027: React.lazy(() => import('./tet2027')),
   };
   ```

## Quy trình CI/CD & Deploy lên Render.com

Dự án đã tích hợp sẵn **GitHub Actions** (`.github/workflows/ci-cd.yml`) và **Render Blueprint** (`render.yaml`):

- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`
- **Environment Variables:** `NODE_ENV=production`, `MONGODB_URI=<chuỗi kết nối MongoDB Atlas>` (lưu trên Render Dashboard, không commit vào Git).
- Sau khi deploy, chia sẻ đường dẫn `https://<ten-service>.onrender.com/vvntx2011` trực tiếp vào nhóm Zalo/Facebook.
