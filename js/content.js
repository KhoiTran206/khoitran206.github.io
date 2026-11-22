/* ==========================================================
   Minh Khôi PC — Nội dung: tin tức & trang chính sách
   body: ['h', tiêu đề] | ['p', đoạn văn] | ['ul', [ý]]
   LƯU Ý: nội dung mẫu — chủ shop vui lòng rà soát trước khi công bố
   ========================================================== */

/* Tin tức — 3 bài đầu hiển thị trên trang chủ */
const NEWS = [
  {
    id: 'build-pc-gaming-20-trieu', tag: 'Hướng dẫn', date: '18/11/2026', img: 'setup-1.jpg',
    title: 'Hướng dẫn build PC gaming 20 triệu chiến mượt mọi tựa game năm 2026',
    excerpt: 'Gợi ý cấu hình cân bằng giữa CPU, VGA và RAM để tối ưu hiệu năng trên từng đồng chi phí.',
    body: [
      ['p', 'Với ngân sách khoảng 20 triệu đồng, bạn hoàn toàn có thể sở hữu một bộ PC chơi tốt hầu hết tựa game phổ biến ở độ phân giải Full HD. Bí quyết nằm ở việc phân bổ ngân sách hợp lý giữa các linh kiện.'],
      ['h', 'Ưu tiên card đồ họa'],
      ['p', 'Với PC gaming, card đồ họa (VGA) quyết định phần lớn số khung hình. Nên dành khoảng 35–40% ngân sách cho VGA, ví dụ các dòng RTX 4060 / RTX 4060 Ti.'],
      ['h', 'CPU vừa đủ, không thừa'],
      ['p', 'Các CPU 6 nhân như Intel Core i5-14400F hoặc AMD Ryzen 5 7500F đủ sức “gánh” VGA tầm trung mà không gây nghẽn cổ chai.'],
      ['h', 'RAM và ổ cứng'],
      ['ul', ['RAM: tối thiểu 16GB, nên chạy kênh đôi (2 thanh 8GB).', 'SSD NVMe từ 500GB để cài Windows và game, tốc độ tải nhanh hơn HDD nhiều lần.', 'Nguồn (PSU) đạt chuẩn 80 Plus, công suất 550–650W cho cấu hình này.']],
      ['p', 'Bạn có thể tự chọn từng linh kiện ở trang Build PC của Minh Khôi PC, hệ thống sẽ tính tổng tiền ngay. Nhân viên kỹ thuật sẽ kiểm tra độ tương thích trước khi lắp ráp.'],
    ],
  },
  {
    id: 'rtx-5070-vs-rtx-4070-super', tag: 'So sánh', date: '16/11/2026', img: 'vga-2.jpg',
    title: 'RTX 5070 vs RTX 4070 Super: Nên chọn card đồ họa nào?',
    excerpt: 'Thế hệ mới có đáng để nâng cấp? Cùng so sánh nhanh để chọn VGA phù hợp nhu cầu.',
    body: [
      ['p', 'Cả hai đều là lựa chọn mạnh cho chơi game 2K. Điểm khác biệt chính nằm ở thế hệ kiến trúc, công nghệ hỗ trợ và mức giá tại thời điểm mua.'],
      ['h', 'Khi nào nên chọn thế hệ mới?'],
      ['ul', ['Bạn muốn tận dụng các công nghệ dựng hình và tạo khung hình mới nhất.', 'Bạn dự định dùng lâu dài, 4–5 năm.', 'Chênh lệch giá không quá lớn.']],
      ['h', 'Khi nào thế hệ trước vẫn đáng mua?'],
      ['p', 'Nếu đang có chương trình giảm giá sâu, card thế hệ trước vẫn cho hiệu năng/giá rất tốt, đặc biệt với người chơi Full HD và 2K.'],
      ['p', 'Liên hệ Minh Khôi PC để được tư vấn theo đúng tựa game và màn hình bạn đang dùng.'],
    ],
  },
  {
    id: 'chon-man-hinh-gaming', tag: 'Tư vấn', date: '12/11/2026', img: 'monitor-3.jpg',
    title: 'Cách chọn màn hình gaming: tần số quét, tấm nền và độ phân giải',
    excerpt: '144Hz, 180Hz hay 240Hz? IPS hay VA? Những điều cần biết trước khi xuống tiền.',
    body: [
      ['h', 'Tần số quét (Hz)'],
      ['p', 'Tần số quét càng cao, chuyển động càng mượt. 144–180Hz là mức “ngon” cho đa số game thủ; 240Hz trở lên dành cho người chơi game thi đấu.'],
      ['h', 'Tấm nền'],
      ['ul', ['IPS: màu đẹp, góc nhìn rộng — phù hợp vừa chơi game vừa làm đồ họa.', 'VA: tương phản cao, màu đen sâu — hợp xem phim, chơi game cốt truyện.', 'TN: phản hồi nhanh, giá rẻ nhưng màu kém hơn.']],
      ['h', 'Độ phân giải'],
      ['p', 'Màn 24 inch nên chọn Full HD; 27 inch nên chọn 2K để hình ảnh sắc nét. Hãy đảm bảo VGA đủ mạnh để đạt số khung hình tương ứng với tần số quét.'],
    ],
  },
  {
    id: 'ban-phim-hall-effect', tag: 'Kiến thức', date: '10/11/2026', img: 'keyboard-2.jpg',
    title: 'Bàn phím Hall Effect là gì? Có đáng để nâng cấp?',
    excerpt: 'Switch từ tính đang là xu hướng mới của bàn phím gaming. Ưu nhược điểm ra sao?',
    body: [
      ['p', 'Switch Hall Effect dùng cảm biến từ trường thay cho tiếp điểm kim loại, giúp phím bền hơn và cho phép tùy chỉnh điểm nhận phím.'],
      ['h', 'Ưu điểm'],
      ['ul', ['Tùy chỉnh độ sâu nhận phím theo ý muốn.', 'Tính năng Rapid Trigger giúp thao tác nhanh trong game FPS.', 'Độ bền cao do không có tiếp điểm cơ học.']],
      ['h', 'Nhược điểm'],
      ['p', 'Giá thường cao hơn bàn phím cơ truyền thống và cần phần mềm để tinh chỉnh. Nếu bạn chủ yếu gõ văn bản, bàn phím cơ thông thường vẫn là lựa chọn kinh tế.'],
    ],
  },
  {
    id: 'chon-laptop-sinh-vien', tag: 'Tư vấn', date: '08/11/2026', img: 'laptop-office-2.jpg',
    title: 'Tiêu chí chọn laptop cho sinh viên dưới 20 triệu',
    excerpt: 'Mỏng nhẹ, pin lâu hay cấu hình mạnh? Chọn đúng ngay từ đầu để dùng bền suốt những năm đại học.',
    body: [
      ['ul', ['CPU: Intel Core i5 / Core Ultra 5 hoặc AMD Ryzen 5 trở lên.', 'RAM: tối thiểu 16GB để đa nhiệm thoải mái.', 'SSD: từ 512GB.', 'Màn hình: tấm nền IPS hoặc OLED, độ phủ màu tốt.', 'Trọng lượng: dưới 1.6kg nếu thường xuyên mang theo.']],
      ['p', 'Sinh viên ngành kỹ thuật, đồ họa nên cân nhắc laptop có card rời. Liên hệ hotline Minh Khôi PC để được tư vấn theo đúng ngành học.'],
    ],
  },
  {
    id: 've-sinh-pc-dung-cach', tag: 'Mẹo hay', date: '05/11/2026', img: 'pc-3.jpg',
    title: 'Mẹo vệ sinh PC đúng cách giúp máy chạy mát và bền hơn',
    excerpt: 'Bụi bẩn là nguyên nhân hàng đầu khiến PC nóng và giảm hiệu năng. Vệ sinh thế nào cho đúng?',
    body: [
      ['p', 'Nên vệ sinh PC định kỳ 3–6 tháng/lần, tùy môi trường sử dụng.'],
      ['ul', ['Tắt nguồn, rút điện và chạm tay vào vỏ kim loại để xả tĩnh điện.', 'Dùng bình khí nén hoặc máy thổi bụi chuyên dụng, giữ cố định cánh quạt khi thổi.', 'Lau nhẹ bằng cọ mềm, không dùng khăn ướt lên linh kiện.', 'Thay keo tản nhiệt CPU mỗi 1–2 năm.']],
      ['p', 'Minh Khôi PC nhận vệ sinh, bảo dưỡng PC tại cửa hàng. Gọi hotline để đặt lịch.'],
    ],
  },
];

/* Trang chính sách / thông tin — policy.html?type=<key> */
const POLICIES = {
  'gioi-thieu': {
    title: 'Giới thiệu Minh Khôi PC',
    body: [
      ['p', `${COMPANY.name} chuyên cung cấp PC gaming, PC văn phòng, laptop, linh kiện máy tính, màn hình và gaming gear chính hãng tại Thành phố Hồ Chí Minh.`],
      ['p', `Với phương châm “${COMPANY.slogan}”, chúng tôi mong muốn mang đến cho khách hàng sản phẩm chất lượng, giá hợp lý cùng dịch vụ tư vấn, lắp ráp và bảo hành tận tâm.`],
      ['h', 'Vì sao chọn chúng tôi?'],
      ['ul', ['Sản phẩm chính hãng, nguồn gốc rõ ràng.', 'Tư vấn cấu hình theo đúng nhu cầu và ngân sách.', 'Lắp ráp, cài đặt và kiểm tra miễn phí.', 'Hỗ trợ kỹ thuật sau bán hàng nhanh chóng.']],
    ],
  },
  'bao-hanh': {
    title: 'Chính sách bảo hành',
    body: [
      ['p', 'Sản phẩm được bảo hành theo thời gian ghi trên trang sản phẩm / phiếu bảo hành, tính từ ngày mua.'],
      ['h', 'Điều kiện bảo hành'],
      ['ul', ['Sản phẩm còn trong thời hạn bảo hành, tem bảo hành còn nguyên vẹn.', 'Lỗi phát sinh do nhà sản xuất.', 'Có hóa đơn hoặc thông tin đơn hàng tại cửa hàng.']],
      ['h', 'Không áp dụng bảo hành'],
      ['ul', ['Sản phẩm hư hỏng do rơi vỡ, vào nước, cháy nổ, thiên tai.', 'Tự ý tháo dỡ, sửa chữa ngoài hệ thống.', 'Sử dụng sai hướng dẫn của nhà sản xuất.']],
      ['p', `Liên hệ bảo hành: ${COMPANY.phoneDisplay} hoặc mang sản phẩm đến ${COMPANY.address}.`],
    ],
  },
  'doi-tra': {
    title: 'Chính sách đổi trả',
    body: [
      ['ul', ['Đổi mới trong 7 ngày nếu sản phẩm lỗi do nhà sản xuất.', 'Sản phẩm đổi trả phải còn đầy đủ hộp, phụ kiện, quà tặng kèm.', 'Không áp dụng đổi trả với sản phẩm đã kích hoạt bản quyền phần mềm hoặc hư hỏng do người dùng.']],
      ['p', 'Vui lòng liên hệ hotline trước khi mang sản phẩm đến để được hỗ trợ nhanh nhất.'],
    ],
  },
  'giao-hang': {
    title: 'Chính sách giao hàng',
    body: [
      ['ul', [`Miễn phí giao hàng cho đơn từ ${new Intl.NumberFormat('vi-VN').format(SHOP.freeShipFrom)}đ.`, `Đơn dưới mức trên: phí giao hàng ${new Intl.NumberFormat('vi-VN').format(SHOP.shippingFee)}đ.`, 'Nội thành TP.HCM: giao trong ngày hoặc ngày hôm sau.', 'Tỉnh/thành khác: 2–5 ngày làm việc tùy khu vực.', 'Khách được kiểm tra hàng trước khi thanh toán (với đơn COD).']],
      ['p', 'Bạn cũng có thể chọn nhận hàng trực tiếp tại cửa hàng khi đặt hàng.'],
    ],
  },
  'thanh-toan': {
    title: 'Hướng dẫn thanh toán',
    body: [
      ['ul', ['Thanh toán khi nhận hàng (COD).', 'Chuyển khoản ngân hàng: nhân viên sẽ gửi thông tin tài khoản khi gọi xác nhận đơn.', 'Ví điện tử MoMo, ZaloPay, VNPAY: nhân viên gửi mã QR khi gọi xác nhận đơn, hoặc quét mã tại cửa hàng.', 'Thanh toán trực tiếp tại cửa hàng: tiền mặt, thẻ ATM, Visa/MasterCard.']],
    ],
  },
  'tra-gop': {
    title: 'Hướng dẫn mua trả góp',
    body: [
      ['p', 'Minh Khôi PC hỗ trợ mua trả góp qua thẻ tín dụng và công ty tài chính.'],
      ['ul', ['Trả góp 0% qua thẻ tín dụng của các ngân hàng liên kết.', 'Trả góp qua công ty tài chính: cần CCCD, thủ tục nhanh gọn.', 'Kỳ hạn linh hoạt 3–12 tháng.']],
      ['p', 'Khi đặt hàng, chọn hình thức thanh toán “Trả góp” để nhân viên liên hệ tư vấn chi tiết.'],
    ],
  },
  'huong-dan-mua-hang': {
    title: 'Hướng dẫn mua hàng online',
    body: [
      ['ul', ['Bước 1: Tìm sản phẩm bằng ô tìm kiếm hoặc menu Danh mục.', 'Bước 2: Bấm “Thêm vào giỏ” hoặc “Mua ngay”.', 'Bước 3: Kiểm tra giỏ hàng, nhập mã giảm giá (nếu có).', 'Bước 4: Điền thông tin nhận hàng và chọn hình thức thanh toán.', 'Bước 5: Bấm “Đặt hàng” — nhân viên sẽ gọi xác nhận trong giờ làm việc.']],
      ['p', 'Bạn có thể tra cứu đơn đã đặt tại trang Tra cứu đơn hàng.'],
    ],
  },
  'thu-cu-doi-moi': {
    title: 'Chương trình thu cũ đổi mới',
    body: [
      ['p', 'Mang thiết bị cũ (laptop, PC, linh kiện, màn hình) đến cửa hàng để được định giá và trợ giá khi lên đời sản phẩm mới.'],
      ['ul', ['Định giá miễn phí, nhanh chóng.', 'Trợ giá thêm khi đổi sang sản phẩm mới tại cửa hàng.', 'Giá thu phụ thuộc tình trạng thực tế của thiết bị.']],
      ['p', `Định giá online ngay tại trang <a href="thu-cu-doi-moi.html">Thu cũ đổi mới</a> hoặc liên hệ ${COMPANY.phoneDisplay} để được báo giá sơ bộ.`],
    ],
  },
  'bao-mat': {
    title: 'Chính sách bảo mật thông tin',
    body: [
      ['p', 'Thông tin khách hàng (họ tên, số điện thoại, email, địa chỉ) chỉ được dùng để xử lý đơn hàng, giao hàng và chăm sóc khách hàng.'],
      ['ul', ['Không chia sẻ thông tin cho bên thứ ba ngoài mục đích giao hàng.', 'Khách hàng có thể yêu cầu chỉnh sửa hoặc xóa thông tin bất cứ lúc nào.', 'Tài khoản được quản lý bởi Firebase Authentication (Google): website không lưu và không xem được mật khẩu của bạn.']],
    ],
  },
};

/* Nhóm link trong menu chính sách */
const POLICY_NAV = ['gioi-thieu', 'huong-dan-mua-hang', 'thanh-toan', 'tra-gop', 'giao-hang', 'bao-hanh', 'doi-tra', 'thu-cu-doi-moi', 'bao-mat'];
