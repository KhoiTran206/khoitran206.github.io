# CLAUDE.md — Website Minh Khoi PC

## 1. Tổng quan dự án

- **Dự án:** Website thương mại điện tử cho **Minh Khoi PC** — cửa hàng bán PC (gaming, văn phòng, workstation), laptop, linh kiện máy tính (CPU, VGA, RAM, SSD, mainboard, PSU, case, tản nhiệt), màn hình và phụ kiện (chuột, bàn phím, tai nghe, ghế, bàn...).
- **Khách hàng mục tiêu:** Game thủ, sinh viên, dân văn phòng, người tự build PC tại Việt Nam.
- **Mục đích:** Giới thiệu sản phẩm, khuyến mãi, giúp khách tìm và so sánh sản phẩm nhanh, liên hệ/đặt hàng dễ dàng. Tạo cảm giác **uy tín, chuyên nghiệp, hiện đại**.
- **Ngôn ngữ nội dung:** Tiếng Việt. Giá hiển thị dạng `15.290.000đ`.
- **Design tham khảo:** `gearvn.com_.png` (trong thư mục gốc). Chỉ học theo **bố cục và phong cách**, KHÔNG sao chép logo, tên thương hiệu, hình ảnh hay nội dung của GearVN.

### Thông tin công ty (dùng chính xác, không tự sửa)

| Mục | Nội dung |
|---|---|
| Tên công ty | **Minh Khôi PC** |
| Slogan | *Nâng tầm trải nghiệm, vững bước tương lai.* |
| Địa chỉ | 26B Lạc Long Quân, Phường Bình Thới, Thành phố Hồ Chí Minh |
| Số điện thoại / Hotline | 0937805704 (hiển thị: `0937 805 704`, link: `tel:0937805704`) |
| Email | tranngminhkhoi062@gmail.com (link: `mailto:`) |

- Hiển thị tên + slogan ở header/logo area, footer và thẻ `<title>` / meta description.
- Hotline hiển thị nổi bật trên header; địa chỉ, SĐT, email đầy đủ ở footer và trang liên hệ.
- Nên lưu thông tin này một chỗ trong `js/data.js` (object `COMPANY`) để dùng lại, không lặp lại thủ công.

## 2. Tech Stack

- **HTML5 + CSS3 + JavaScript thuần (vanilla)** — không framework, không cần build, mở `index.html` là chạy.
- CSS dùng **CSS Variables** cho màu/spacing, layout bằng **Flexbox + CSS Grid**.
- Font: **Be Vietnam Pro** (Google Fonts) — hỗ trợ tiếng Việt tốt. Fallback: `system-ui, sans-serif`.
- Icon: **Lucide** — KHÔNG tải cả thư viện từ CDN; `js/icons.js` chỉ chứa icon web dùng (tự sinh bằng `node tools/build-icons.mjs`, chạy lại khi dùng icon mới). Dùng `icon(name, class)` → trả SVG.
- Dữ liệu sản phẩm để trong `js/data.js` (hàm `product(cat, tên, ảnh, giá, giá gốc, specs, tags, extra)`). **Thêm sản phẩm mới ở CUỐI khối `PRODUCTS.push(...)` (đợt 3, dùng hàm tắt `LG`, `LO`, `PC`, `MON`, `KB`, `MS`, `HS`, `C`, `AC`, `NW`, `SW`, `CHAIR`, `DESK`, `USED`; giá tính theo nghìn đồng)** (mã mk001… đánh theo thứ tự — chèn giữa sẽ làm lệch giỏ hàng/yêu thích/đơn cũ). Linh kiện: `cat: 'components'` + tag `cpu|mainboard|vga|ram|ssd|hdd|psu|cooler|case`; hàng cũ: tag `used` + `extra.warranty` (tháng) — **hàng cũ tách riêng**: mọi rule trong `CATEGORY_RULES` (trừ `used`) có `isNew(p)`, danh mục Hàng cũ lọc theo loại bằng `USED_TYPES` (`?cat=used&type=laptop`), tìm kiếm có thanh Hàng mới/Hàng cũ (`?cond=new|used`), Khuyến mãi/Build PC/gợi ý chỉ lấy hàng mới, thẻ SP hàng cũ ghi "Rẻ hơn mới x%"; phụ kiện: `cat: 'accessory'` + tag `speaker|webcam|mic|gamepad|extssd|usb|hub`. Hàng icon trang chủ: `QUICK_CATS` (22 mục, 2 hàng × 11). Danh mục lọc ở `CATEGORY_RULES`, menu ở `CATEGORIES`, khối trang chủ ở `HOME_SECTIONS` (tối đa 12 SP/khối). Sau khi thêm SP chạy `node tools/build-sitemap.mjs`. Logo (hình con chip có chữ M): `LOGO_MARK` trong `components.js`; favicon + icon app tạo bằng `node tools/build-app-icons.mjs` (đổi xong tăng `?v=` của icon/manifest trong các trang và `VERSION` trong `sw.js`).
- Ảnh: **chỉ dùng ảnh chụp thật**, không dùng hình vẽ minh họa. Hiện dùng ảnh Pexels (miễn phí thương mại) lưu tại `assets/images/photos/`, sẽ thay bằng ảnh chụp đúng model khi chủ shop cung cấp.
- Ảnh nhỏ (ô sản phẩm, giỏ hàng, danh sách) dùng `thumb(src)` → bản rộng 400px trong `assets/images/photos/thumb/` (cùng tên). Thêm ảnh mới: thêm cả bản gốc lẫn bản thumb.

### Cấu trúc thư mục

```
/
├── index.html            # Trang chủ
├── category.html         # Danh mục / tìm kiếm / khuyến mãi (lọc, sắp xếp, phân trang)
├── product.html          # Chi tiết sản phẩm (?id=mk001)
├── cart.html             # Giỏ hàng (mã giảm giá, phí ship)
├── checkout.html         # Thanh toán → gửi đơn về email qua FormSubmit
├── order.html            # Đặt hàng thành công + tra cứu đơn (?code=)
├── login.html            # Đăng nhập / đăng ký / quên mật khẩu (?tab=register|forgot&next=)
├── account.html          # Tài khoản (cần đăng nhập): thông tin, đơn hàng, đổi mật khẩu
├── admin.html            # Quản trị (chỉ email quản trị): đơn hàng, trạng thái, khách hàng
├── firestore.rules       # Quy tắc bảo mật Firestore (dán vào Firebase Console)
├── wishlist.html         # Sản phẩm yêu thích (Wishlist)
├── compare.html          # So sánh tối đa 3 sản phẩm cùng loại (Compare)
├── manifest.webmanifest, sitemap.xml, robots.txt, favicon.ico  # SEO + cài như app (tạo lại bằng script khi thêm trang)
├── build-pc.html         # Tự chọn cấu hình PC
├── thu-cu-doi-moi.html   # Thu cũ đổi mới: định giá online (bảng giá TRADE_IN đầu file js/pages/trade-in.js), chính sách thu, gửi yêu cầu qua email
├── news.html, article.html  # Tin tức + bài viết (?id=)
├── contact.html          # Liên hệ, bản đồ, form gửi email
├── policy.html           # Chính sách (?type=bao-hanh...)
├── 404.html              # Trang lỗi (tự chứa CSS, cho GitHub Pages)
├── offline.html          # Trang "Không có kết nối" (sw.js trả về khi mất mạng, tự chứa CSS)
├── sw.js                 # Service worker: HTML lấy mạng trước, CSS/JS/ảnh lưu đệm. Đổi VERSION để xóa đệm cũ
├── css/
│   ├── variables.css     # Màu, font, spacing, shadow, radius
│   ├── base.css          # Reset + style chung + animation reveal
│   ├── components.css    # Header, footer, card, form, slider... dùng chung
│   └── pages/            # CSS riêng từng trang (home, category, product, checkout, build-pc, content)
├── js/
│   ├── data.js           # COMPANY, SHOP (email nhận đơn, phí ship, mã giảm giá), danh mục, sản phẩm, banner
│   ├── content.js        # Tin tức + nội dung trang chính sách
│   ├── components.js     # Hàm render header, footer, product card, breadcrumb...
│   ├── app.js            # Logic dùng chung: giỏ hàng, đơn hàng, tìm kiếm, gửi email, slider, reveal
│   └── pages/*.js        # Mỗi trang 1 file, khai báo hàm initPage()
└── assets/
    ├── images/photos/    # Ảnh chụp thật: sản phẩm, banner, tin tức
    └── logo/             # Logo Minh Khoi PC
```

- Thứ tự nạp script mọi trang: `icons.js` → `data.js` → `content.js` → `components.js` → `app.js` → `pages/<trang>.js`.
- Mọi link CSS/JS nội bộ có hậu tố `?v=<phiên bản>` để trình duyệt (nhất là Safari iPhone) lấy bản mới ngay. **Mỗi lần sửa CSS/JS rồi đẩy lên, đổi số phiên bản ở tất cả trang** (thay hàng loạt bằng sed).
- Không có backend: giỏ hàng, hồ sơ, đơn hàng lưu `localStorage` (luôn qua `Store` có try/catch); đơn hàng + form liên hệ gửi email qua FormSubmit (`SHOP.orderEndpoint`).
- Link trang chủ luôn dùng `HOME_URL` (web: `./` → https://khoitran206.github.io/, file trên máy: `index.html`), không viết cứng `index.html`.
- Thêm trang mới: chép một trang có sẵn, đổi `<title>`/description/id/script, cập nhật khối `<!-- SEO -->` và `sitemap.xml`.
- Tài khoản khách: **Firebase Authentication** (email/mật khẩu + Google), cấu hình `FIREBASE_CONFIG` trong `data.js`. `Auth` trong `app.js`: `Auth.current()` đọc tức thì bản sao `mkpc-user` (localStorage), `Auth.ready()` chờ Firebase xác nhận phiên (tải SDK khi cần), sự kiện `auth:change` khi đăng nhập/xuất. SDK chỉ tải khi đã đăng nhập hoặc ở trang cần (khách vãng lai không tải). Nút tài khoản trên header do `renderAccountMenu()` vẽ, gọi `updateAccountLabel()`.
- Dữ liệu trên mạng: **Firestore** (`Cloud.db()` tải lười) — `users/{uid}` (hồ sơ) và `orders/{code}` (đơn, có `uid` nếu đã đăng nhập). Quyền đọc/ghi do `firestore.rules` quyết định: sửa xong phải dán lại vào Firebase Console → Firestore → Rules → Publish. Quản trị viên = `SHOP.adminEmails` **và** danh sách trong `isAdmin()` của rules (email phải đã xác minh — nên đăng nhập bằng Google). Trang `admin.html`: thống kê, đổi trạng thái đơn, danh sách khách.
- App cài từ website (PWA, miễn phí): `manifest.webmanifest` + `sw.js` + thẻ `apple-mobile-web-app-*` ở mọi trang. Mọi nút có `[data-install]` mở luồng cài (`initInstallApp()` trong `app.js`): Android/Chrome hiện hộp cài, iPhone hiện hướng dẫn. Đã cài → `html.is-app`, ẩn nút cài. Không lên CH Play/App Store (cần tài khoản trả phí). **Giao diện app riêng**: đoạn script nhỏ trong `<head>` mọi trang gắn `html.is-app` khi mở bằng app (hoặc xem thử bằng `?app=1`, tắt `?app=0`); `css/app-mode.css` (chỉ áp dụng ≤768px) ẩn topbar/subnav/footer/breadcrumb, header trang con thành thanh tiêu đề (quay lại · tên trang · tìm kiếm), thêm thanh tab dưới đáy (`APP_TABS`), phím tắt trang chủ (`APP_SHORTCUTS`) và màn hình Danh mục (`renderAppCats`) — tất cả trong `components.js` + `initAppShell()` ở `app.js`. Trang mới nhớ thêm link `app-mode.css` và đoạn script `<head>`.
- Pop-up khuyến mãi trang chủ: cấu hình `PROMO_POPUP` trong `data.js` (bật/tắt, mã giảm giá, ảnh, nội dung); mỗi khách thấy tối đa 1 lần/ngày (`mkpc-popup-seen`). Thiết kế riêng (thẻ chia đôi + mã dạng vé), không chép pop-up của trang khác.
- Mọi dữ liệu người dùng nhập khi hiển thị lại phải qua `esc()`.

## 3. Quy tắc thiết kế

### Phong cách tổng thể
Sàn TMĐT công nghệ: **nền sáng, sạch sẽ, mật độ thông tin cao nhưng gọn gàng**, điểm nhấn màu đỏ mạnh mẽ cho khuyến mãi và CTA. Các khối nội dung là "card" trắng bo góc đặt trên nền xám nhạt.

### Bảng màu (khai báo trong `css/variables.css`)

| Biến | Giá trị | Dùng cho |
|---|---|---|
| `--color-primary` | `#E30019` | Header, nút chính, giá bán, badge giảm giá |
| `--color-primary-dark` | `#B80014` | Hover của nút/link đỏ |
| `--color-primary-light` | `#FFE8EA` | Nền nhẹ cho tag, highlight |
| `--color-bg` | `#F3F3F3` | Nền trang |
| `--color-surface` | `#FFFFFF` | Nền card, section |
| `--color-text` | `#111111` | Chữ chính |
| `--color-text-muted` | `#6D6E72` | Thông số, chữ phụ, giá gạch |
| `--color-border` | `#E5E5E5` | Viền card, đường kẻ |
| `--color-success` | `#24B400` | Còn hàng, quà tặng |
| `--color-warning` | `#FF9F00` | Đánh giá sao |
| `--color-footer` | `#0E0E0F` | Nền footer |

### Typography
- Font: **Be Vietnam Pro**. Weight: 400 (thường), 500 (tên sản phẩm), 700 (tiêu đề, giá).
- Cỡ chữ: tiêu đề section `20–24px` bold, tên sản phẩm `14px` (giới hạn 2 dòng, dùng `line-clamp`), giá `16–18px` bold màu đỏ, giá gốc `13px` gạch ngang màu xám.

### Spacing, bo góc, đổ bóng
- Container tối đa `1200px`, căn giữa, padding 2 bên `16px`.
- Khoảng cách giữa các section: `24px`.
- Bo góc: card `8px`, nút `6px`, badge `4px`.
- Shadow nhẹ: `0 1px 3px rgba(0,0,0,.08)`; khi hover card: `0 4px 16px rgba(0,0,0,.12)`.

### Các thành phần chính (theo design tham khảo)
1. **Top bar** mỏng nền trắng, 1 thông báo khuyến mãi căn giữa (icon lửa 2 bên), tự đổi luân phiên.
2. **Header đỏ** (sticky): logo · ô tìm kiếm lớn · hotline · hệ thống cửa hàng · tra cứu đơn hàng · giỏ hàng (nút vuông đen, có số lượng) · đăng nhập (nút đen). Dưới header là **sub-nav trắng**: nút "☰ DANH MỤC" (dropdown + mega menu trên desktop, drawer trên mobile) + link chữ xám viết hoa.
3. **Hero** (trên dải nền trắng full-width): slider banner lớn (~2/3) + 2 banner xếp dọc bên phải.
4. **Hàng icon danh mục** (cùng dải trắng): 12 ảnh sản phẩm không nền, mục đầu là "Black Friday".
5. **Flash Sale:** khối nền đỏ, tiêu đề viết hoa + **đồng hồ đếm ngược (ngày:giờ:phút:giây)** + "Xem tất cả ›", slider 6 card gọn (ảnh, tên, giá).
6. **Các section sản phẩm** ("PC bán chạy", "Laptop gaming bán chạy", "Laptop văn phòng", "Chuột", "Bàn phím", "Màn hình"...): tiêu đề bên trái + tab lọc theo hãng/phân khúc + link "Xem tất cả" bên phải; lưới/slider 5 sản phẩm trên desktop.
7. **Product card** (không viền, chỉ hiện bóng khi hover): nhãn "Giảm x%" · ảnh vuông nền trắng · tag "Bán chạy/Mới" · tên (2 dòng) · ô thông số xám · giá gốc gạch + "-x%" · **giá bán đỏ đậm** · đánh giá sao · ô quà tặng nền nhạt có "›".
8. **Banner xen kẽ:** 2 banner đều nhau sau Flash Sale; 1 banner lớn + 2 banner nhỏ xếp dọc trước khối Màn hình.
9. **Tin tức:** CTA nền tối tiêu đề 2 dòng + nút viền bo tròn; dưới là 1 tin lớn + 2 tin dọc, chữ đè lên ảnh.
10. **Footer đen:** logo + slogan + mạng xã hội · tổng đài (nhãn + số, email, địa chỉ) · Về + Chính sách · Thông tin · Thanh toán + Vận chuyển; dòng pháp lý cuối trang.

## 4. Quy tắc bắt buộc

### PHẢI
- **Sau mỗi thay đổi lớn, chụp screenshot và so sánh với design gốc** (`gearvn.com_.png`) — xem chi tiết ở mục 5.
- **Mọi section phải có animation khi scroll:** khi section xuất hiện trong khung nhìn thì fade-in + trượt lên nhẹ (`opacity 0→1`, `translateY(24px→0)`, `0.5–0.6s ease-out`). Dùng **`IntersectionObserver`** (không dùng thư viện), thêm class `.reveal` / `.reveal--visible`; các product card trong cùng section xuất hiện lần lượt (stagger ~60ms). Animation chỉ chạy một lần, và phải tắt khi người dùng bật `prefers-reduced-motion: reduce`.
- **Website phải mobile-friendly — Responsive, mobile-first.** Breakpoint: `≤576px` (mobile), `≤768px` (tablet), `≤1024px` (laptop nhỏ), `>1200px` (desktop). Lưới sản phẩm: 2 cột mobile → 3 tablet → 4 laptop → 5 desktop.
- Trên mobile: menu danh mục thành **drawer** (nút hamburger), ô tìm kiếm xuống dòng riêng, không có thanh cuộn ngang toàn trang.
- **Mọi nút, link, card đều có hover effect** (đổi màu, nâng card nhẹ `translateY(-2px)`, phóng ảnh `scale(1.05)`), transition `0.2–0.3s`.
- Luôn dùng **CSS Variables** — không hardcode mã màu trong component.
- Dùng HTML ngữ nghĩa (`header`, `nav`, `main`, `section`, `article`, `footer`), mọi `<img>` có `alt` tiếng Việt, ảnh dưới màn hình đầu dùng `loading="lazy"`.
- Định dạng giá bằng `Intl.NumberFormat('vi-VN')` + hậu tố `đ`.
- Tên class theo kiểu BEM: `.product-card`, `.product-card__price`, `.product-card--sale`.
- Code sạch, chia component; product card chỉ viết **một** hàm render dùng lại ở mọi nơi.
- Độ tương phản chữ đạt chuẩn dễ đọc; nút có trạng thái `:focus-visible`.

### KHÔNG ĐƯỢC
- Không dùng logo, tên, hình ảnh hay nội dung của GearVN hoặc thương hiệu khác (ngoài tên hãng sản phẩm như ASUS, MSI...).
- Không thêm framework/thư viện nặng (React, jQuery, Bootstrap, Tailwind) khi chưa được yêu cầu.
- Không dùng quá nhiều màu: chỉ đỏ là màu nhấn chính, tránh gradient sặc sỡ.
- Không dùng `!important` và inline style (trừ khi thật cần thiết).
- Không bịa hoặc thay đổi thông tin công ty — chỉ dùng đúng thông tin ở mục 1. Thông tin chưa có (MST, giờ mở cửa, mạng xã hội...) thì dùng placeholder rõ ràng và ghi chú để chủ shop thay.

## 5. Workflow

1. **Trước khi code** một trang/section lớn: xem lại `gearvn.com_.png` và mục 3 để bám sát bố cục.
2. **Build theo thứ tự:** `variables.css` + `base.css` → header & footer → trang chủ (hero → flash sale → section sản phẩm → tin tức) → trang danh mục → chi tiết sản phẩm → giỏ hàng.
3. Làm **từng section một**, hoàn thành xong mới sang section tiếp theo.
4. **Sau mỗi thay đổi lớn:** chụp screenshot trang (desktop 1440px và mobile 375px) và so sánh với design gốc về bố cục, màu sắc, khoảng cách; liệt kê điểm khác biệt và sửa.
5. Kiểm tra responsive ở 375px, 768px, 1024px, 1440px trước khi báo hoàn thành; kiểm tra animation khi scroll hoạt động ở mọi section.
6. Kiểm tra console trình duyệt không có lỗi JS.
7. Khi báo cáo, tóm tắt ngắn gọn bằng tiếng Việt: đã làm gì, file nào thay đổi, việc gì còn lại.
