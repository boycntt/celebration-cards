# Celebration Cards — CLB Vovinam Thanh Xuân

Nền tảng thiệp chúc mừng điện tử đa dịp lễ (Multi-Occasion Celebration Cards) với phiên bản ra mắt tri ân **Ngày Nhà giáo Việt Nam 20/11** dành cho **Võ sư Lữ Thanh Xuân** và **các anh em giáo chức CLB Vovinam Thanh Xuân**.

## Tính năng nổi bật

- **Phong bì Nghiêm Lễ tương tác:** Hiệu ứng mở phong bì đóng ấn triện sáp Đỏ-Vàng kèm pháo giấy Vovinam và nền lá tre rơi nhẹ (HTML5 Canvas).
- **Chuyển đổi đối tượng linh hoạt:** 3 bộ lời chúc chuyên biệt (*Toàn thể CLB*, *Võ sư Lữ Thanh Xuân*, *Anh Em Giáo Chức CLB*).
- **Cá nhân hóa qua URL:** Tùy chỉnh tên người nhận, lời chúc riêng và chữ ký người gửi, tự động sinh đường dẫn chia sẻ Zalo/Facebook (`?to=...&from=...&msg=...`).
- **Xuất ảnh PNG sắc nét (2x) & Mã QR:** Tải ảnh thiệp chất lượng cao để gửi trực tiếp vào nhóm Zalo/Facebook hoặc tạo mã QR trình chiếu.
- **Sổ Lưu Bút Tri Ân:** Lưu lời chúc trực tiếp trên trình duyệt (Static / `localStorage`).
- **Kiến trúc đa dịp lễ:** Dễ dàng mở rộng thêm các dịp lễ khác (Tết Nguyên Đán, 8/3, 20/10, Kỷ niệm thành lập CLB...) trong thư mục `src/occasions/`.

## Chạy cục bộ (Local Development)

```bash
npm install
npm run dev
```

Build bản production:

```bash
npm run build
```

## Quy trình CI/CD (GitHub Actions → Render.com)

Dự án đã tích hợp sẵn **GitHub Actions** (`.github/workflows/ci-cd.yml`) và **Render Blueprint** (`render.yaml`):

- **CI tự động trên mọi PR & nhánh `feature/**`, `hotfix/**`, `main`:** Tự động cài đặt (`npm ci`), kiểm tra kiểu TypeScript (`tsc --noEmit`), build production (`vite build`), xác minh file đầu ra (`dist/index.html`, ảnh CLB) và lưu artifact `dist/`.
- **PR Preview trên Render:** Khi mở Pull Request lên GitHub, Render tự động tạo link xem trước (nhờ `pullRequestPreviewsEnabled: true`).
- **CD (2 chế độ linh hoạt):**
  - **Mặc định (Nhanh gọn):** Khi merge vào `main`, Render tự động deploy bản mới (`autoDeploy: true`).
  - **CI-Gated Deploy (Chặt chẽ hơn — chỉ deploy sau khi CI pass 100%):**
    1. Trong Render Dashboard → Service → **Settings** → copy **Deploy Hook URL**.
    2. Trong GitHub Repo → **Settings** → **Secrets and variables** → **Actions** → tạo secret tên `RENDER_DEPLOY_HOOK_URL` và dán URL vào.
    3. Đổi `autoDeploy: false` trong `render.yaml`. Từ đó, chỉ khi GitHub Actions job `ci` pass xanh thì job `deploy-render` mới kích hoạt Render deploy.

### Đẩy code lên GitHub lần đầu

```bash
git init -b main
git add .
git commit -m "feat: initial celebration cards platform with 20/11 Vovinam Thanh Xuan"
git remote add origin https://github.com/<tai-khoan-cua-ban>/celebration-cards.git
git push -u origin main
```

## Hướng dẫn Publish lên Render.com (Miễn phí)

Dự án đã tích hợp sẵn file `render.yaml` (**Render Blueprint — Static Site**, miễn phí, không bị cold-start, đã cấu hình sẵn SPA rewrite `/* -> /index.html` và Cache Headers).

### Cách 1: Deploy tự động qua Blueprint (Khuyến nghị)
1. Push mã nguồn dự án lên GitHub hoặc GitLab.
2. Đăng nhập [Render.com](https://render.com) → chọn **New +** → **Blueprint**.
3. Kết nối repository vừa push → Render sẽ tự nhận diện file `render.yaml`.
4. Nhấn **Apply** để Render tự động build (`npm ci && npm run build`) và publish thư mục `dist`.
5. Sau khoảng 1–2 phút, bạn sẽ có đường dẫn dạng `https://vovinam-thanh-xuan-celebration-cards.onrender.com` để gửi ngay vào nhóm Zalo/Facebook CLB!

### Cách 2: Tạo Static Site thủ công trên Render
- **Service Type:** Static Site
- **Build Command:** `npm ci && npm run build`
- **Publish Directory:** `dist`
- **Redirects/Rewrites:** Source `/*` → Destination `/index.html` → Action `Rewrite`

## Mở rộng thêm dịp lễ mới

1. Tạo thư mục mới trong `src/occasions/<ten-dip-le>/config.ts` theo interface `OccasionConfig` tại `src/core/types/occasion.ts`.
2. Đăng ký vào `OCCASIONS_REGISTRY` tại `src/occasions/index.ts`.
3. Push code lên GitHub — Render.com sẽ tự động cập nhật bản mới.
