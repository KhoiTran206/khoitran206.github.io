# Minh Khôi PC — Website bán hàng

Website bán PC, laptop, linh kiện, màn hình và gaming gear của **Minh Khôi PC**.
Web tĩnh (HTML/CSS/JS thuần), không cần máy chủ — chạy được trên GitHub Pages.

## Chức năng

- Trang chủ: banner, flash sale đếm ngược, sản phẩm theo danh mục, tin tức
- Tìm kiếm có gợi ý (gõ tiếng Việt có dấu hoặc không dấu)
- Danh mục: lọc theo danh mục, thương hiệu, khoảng giá, hàng giảm giá; sắp xếp; phân trang
- Chi tiết sản phẩm: giá, khuyến mãi, thông số, mô tả, đánh giá, sản phẩm tương tự
- Giỏ hàng: đổi số lượng, mã giảm giá, tính phí giao hàng
- Thanh toán: giao tận nơi / nhận tại cửa hàng, COD / chuyển khoản / trả góp
- **Đơn hàng được gửi về email chủ shop** (qua dịch vụ miễn phí FormSubmit)
- Tra cứu đơn, tài khoản khách (lưu trên thiết bị), Build PC, tin tức, liên hệ, chính sách

## ⚠️ Việc cần làm ngay sau khi website lên mạng

1. Mở website, **đặt thử 1 đơn hàng**.
2. Vào hộp thư `tranngminhkhoi062@gmail.com` → mở email từ **FormSubmit** → bấm **Activate Form**.
   (Kiểm tra cả mục Spam/Quảng cáo.)
3. Đặt thử thêm 1 đơn nữa → kiểm tra email đã nhận được đơn.

Chỉ cần làm **1 lần**. Trước khi kích hoạt, đơn hàng sẽ không về email (khách sẽ thấy hướng dẫn gọi hotline).

## Chỉnh sửa nội dung

| Muốn sửa | File |
|---|---|
| Tên, địa chỉ, SĐT, email, link mạng xã hội | `js/data.js` → `COMPANY` |
| Email nhận đơn, phí giao hàng, mã giảm giá, bảo hành | `js/data.js` → `SHOP` |
| Sản phẩm (tên, giá, ảnh, thông số) | `js/data.js` → `PRODUCTS` |
| Banner, flash sale | `js/data.js` → `HERO_SLIDES`, `MID_BANNERS`, `FLASH_SALE` |
| Tin tức, chính sách | `js/content.js` |
| Ảnh | Thêm vào `assets/images/photos/`, rồi đổi tên file trong `js/data.js` |

Sau khi sửa: commit và push lên GitHub, khoảng 1–2 phút sau website tự cập nhật.

## Lưu ý

- Giỏ hàng, tài khoản, lịch sử đơn được lưu **trên trình duyệt của khách** (không có máy chủ).
  Chủ shop quản lý đơn qua email; cập nhật trạng thái cho khách qua điện thoại/Zalo.
- Giá, tồn kho, đánh giá, nội dung chính sách hiện là **dữ liệu mẫu** — cần rà soát trước khi bán thật.
- Ảnh sản phẩm là ảnh Pexels theo loại sản phẩm (giấy phép miễn phí thương mại), chưa phải ảnh đúng từng model.

## Chạy thử trên máy

Mở file `index.html` bằng trình duyệt. (Khi chạy từ máy, chức năng gửi email sẽ không hoạt động — chỉ hoạt động khi đã lên mạng.)
