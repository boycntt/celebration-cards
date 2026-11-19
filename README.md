# Celebration Cards — CLB Vovinam Thanh Xuân

Nền tảng thiệp chúc mừng điện tử đa dịp lễ (Multi-Occasion Celebration Cards) với phiên bản ra mắt tri ân **Ngày Nhà giáo Việt Nam 20/11** dành cho **Võ sư Lữ Thanh Xuân** và **các anh em giáo chức CLB Vovinam Thanh Xuân**.

## Đường dẫn truy cập & Thời gian hiển thị

Mỗi dịp lễ được gắn một đường dẫn riêng (`accessSlug`) và khung thời gian hiệu lực (`validFrom` → `validTo`, múi giờ `+07:00`). Các đường dẫn không hợp lệ (bao gồm `/`) hoặc ngoài thời gian hiển thị sẽ tự động trả về trang **404 — Không tìm thấy thiệp**.

- **Thiệp Tri Ân Ngày Nhà Giáo Việt Nam 20/11/2026:**
  - Đường dẫn truy cập: `/vovinamthanhxuan20112026` (cũng hỗ trợ `/card/vovinamthanhxuan20112026`)
  - Thời gian hiệu lực: `15/11/2026 00:00:00 +07:00` → `25/11/2026 23:59:59 +07:00`

## Tính năng nổi bật

- **Phong bì Nghiêm Lễ tương tác:** Hiệu ứng mở phong bì đóng ấn triện sáp Đỏ-Vàng kèm pháo giấy Vovinam và nền lá tre rơi nhẹ (HTML5 Canvas).
- **Chuyển đổi đối tượng linh hoạt:** 3 bộ lời chúc chuyên biệt (*Toàn thể CLB*, *Võ sư Lữ Thanh Xuân*, *Anh Em Giáo Chức CLB*).
- **Cá nhân hóa qua URL:** Tùy chỉnh tên người nhận, lời chúc riêng và chữ ký người gửi, tự động sinh đường dẫn chia sẻ Zalo/Facebook (`?to=...&from=...&msg=...`).
- **Xuất ảnh PNG sắc nét (2x) & Mã QR:** Tải ảnh thiệp chất lượng cao để gửi trực tiếp vào nhóm Zalo/Facebook hoặc tạo mã QR trình chiếu.
- **Sổ Lưu Bút Tri Ân (MongoDB + Fallback ngoại tuyến):** Lưu lời chúc chung trên MongoDB Atlas để mọi thành viên CLB đều đọc được, đồng thời tự động dự phòng `localStorage` nếu chạy ở chế độ ngoại tuyến.
- **Kiến trúc đa dịp lễ:** Dễ dàng mở rộng thêm các dịp lễ khác (Tết Nguyên Đán, 8/3, 20/10, Kỷ niệm thành lập CLB...) trong thư mục `src/occasions/`.

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

Build và chạy bản production:

```bash
npm run build
npm start
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

## Hướng dẫn Publish lên Render.com (Node Web Service + MongoDB)

Dự án đã tích hợp sẵn file `render.yaml` (**Render Blueprint — Node Web Service**, hỗ trợ backend Express + MongoDB cho Sổ Lưu Bút chung và tự động phục vụ giao diện SPA từ `dist/`).

### Cách 1: Deploy tự động qua Blueprint (Khuyến nghị)
1. Push mã nguồn dự án lên GitHub hoặc GitLab.
2. Đăng nhập [Render.com](https://render.com) → chọn **New +** → **Blueprint**.
3. Kết nối repository vừa push → Render sẽ tự nhận diện file `render.yaml`.
4. Trong bước cấu hình **Environment Variables** (hoặc vào Service → **Environment** sau khi tạo), nhập biến môi trường:
   - `MONGODB_URI`: chuỗi kết nối MongoDB Atlas của bạn (Render đánh dấu `sync: false` nên giá trị này chỉ lưu an toàn trên Render Dashboard, không lưu trong Git).
5. Nhấn **Apply** để Render tự động build (`npm ci && npm run build`) và khởi chạy (`npm start`). Health check tự động kiểm tra `/api/health`.
6. Sau khi deploy xong, gửi đường dẫn `https://<ten-service>.onrender.com/vovinamthanhxuan20112026` vào nhóm Zalo/Facebook CLB!

### Cách 2: Tạo Web Service thủ công trên Render
- **Service Type:** Web Service (Runtime: Node)
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`
- **Health Check Path:** `/api/health`
- **Environment Variables:** `NODE_ENV=production`, `MONGODB_URI=<chuỗi kết nối MongoDB Atlas>`

## Mở rộng thêm dịp lễ mới

1. Tạo thư mục mới trong `src/occasions/<ten-dip-le>/config.ts` theo interface `OccasionConfig` tại `src/core/types/occasion.ts`.
2. Đăng ký vào `OCCASIONS_REGISTRY` tại `src/occasions/index.ts`.
3. Push code lên GitHub — Render.com sẽ tự động cập nhật bản mới.
