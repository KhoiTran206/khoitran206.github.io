/* ==========================================================
   Minh Khôi PC — Dữ liệu tĩnh (sau này có thể thay bằng API)
   ========================================================== */

const COMPANY = {
  name: 'Minh Khôi PC',
  slogan: 'Nâng tầm trải nghiệm, vững bước tương lai.',
  address: '26B Lạc Long Quân, Phường Bình Thới, Thành phố Hồ Chí Minh',
  phone: '0937805704',
  phoneDisplay: '0937 805 704',
  email: 'tranngminhkhoi062@gmail.com',
  // Mạng xã hội — đang để trang chủ chung, chủ shop thay bằng link trang của shop
  socials: { facebook: 'https://facebook.com/', tiktok: 'https://www.tiktok.com/', youtube: 'https://www.youtube.com/', github: 'https://github.com/' },
  zalo: 'https://zalo.me/0937805704', // nút chat nổi góc phải dưới (Zalo theo số hotline)
};

const IMG = 'assets/images/photos/'; // Ảnh chụp thật (Pexels, giấy phép miễn phí thương mại)
/* Ảnh thu nhỏ 400px (photos/thumb/) cho ô sản phẩm, giỏ hàng, danh sách — nhẹ hơn ~3,5 lần.
   Thêm ảnh mới: đặt bản gốc vào photos/ và bản rộng 400px cùng tên vào photos/thumb/. */
const thumb = (src) => String(src || '').replace('/photos/', '/photos/thumb/');

const PROMO_MESSAGES = [
  { icon: 'flame', text: 'BLACK FRIDAY — Giảm đến 50% toàn bộ gaming gear' },
  { icon: 'credit-card', text: 'Trả góp 0% lãi suất qua thẻ tín dụng' },
  { icon: 'truck', text: 'Miễn phí giao hàng nội thành TP.HCM cho đơn từ 1 triệu' },
  { icon: 'gift', text: 'Tặng combo bàn phím + chuột khi mua PC Gaming' },
  { icon: 'shield-check', text: 'Sản phẩm chính hãng — Bảo hành tận nơi' },
];

const SUB_NAV = [
  { text: 'Tất cả khuyến mãi', href: 'category.html?sale=1' },
  { text: 'Tin tức - Review', href: 'news.html' },
  { text: 'Tra cứu đơn hàng', href: 'order.html' },
  { text: 'Chính sách bảo hành', href: 'policy.html?type=bao-hanh' },
  { text: 'Thu cũ đổi mới', href: 'policy.html?type=thu-cu-doi-moi' },
  { text: 'Build PC', href: 'build-pc.html' },
  { text: 'Trả góp 0%', href: 'policy.html?type=tra-gop' },
];

/* ----------------------------------------------------------
   Cấu hình bán hàng (chủ shop chỉnh tại đây)
   ---------------------------------------------------------- */
const SHOP = {
  // Đơn hàng được gửi về email chủ shop qua FormSubmit (miễn phí, không cần máy chủ).
  // Lần đầu có đơn, FormSubmit gửi email "Activate" — bấm xác nhận 1 lần là xong.
  orderEndpoint: `https://formsubmit.co/ajax/${COMPANY.email}`,
  freeShipFrom: 1000000, // Miễn phí giao hàng cho đơn từ 1.000.000đ
  shippingFee: 30000,
  // Mã giảm giá mẫu — chủ shop chỉnh/xoá tuỳ ý
  coupons: {
    MKPC50K: { type: 'fixed', value: 50000, minOrder: 1000000, label: 'Giảm 50.000đ cho đơn từ 1 triệu' },
    BLACKFRIDAY: { type: 'percent', value: 5, max: 500000, minOrder: 0, label: 'Giảm 5% (tối đa 500.000đ)' },
  },
  // Bảo hành mẫu theo nhóm hàng (tháng)
  warranty: { pc: 36, 'laptop-gaming': 24, laptop: 24, components: 36, mouse: 24, keyboard: 24, monitor: 36, headset: 12, chair: 12 },
  // Email quản trị viên: xem toàn bộ đơn hàng + khách hàng ở admin.html.
  // Thêm/bớt email ở đây VÀ trong firestore.rules (hàm isAdmin) rồi dán lại Rules trên Firebase.
  adminEmails: ['tranngminhkhoi062@gmail.com'],
};

/* Firebase (tài khoản + đơn hàng trên mạng). Cấu hình web này là công khai theo thiết kế của Firebase —
   bảo mật dữ liệu nằm ở firestore.rules. */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyCCUcjCtpoTOGvDWc2-1Dyq2p80Wzm-WiI',
  authDomain: 'minhkhoi-pc.firebaseapp.com',
  projectId: 'minhkhoi-pc',
  storageBucket: 'minhkhoi-pc.firebasestorage.app',
  messagingSenderId: '1042786037845',
  appId: '1:1042786037845:web:7127f793d192961e47e4dc',
};
const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/13.4.0/';

const BRANDS = ['MKPC', 'ASUS', 'Acer', 'MSI', 'Lenovo', 'Dell', 'HP', 'Logitech', 'Razer', 'Corsair', 'Akko', 'AULA', 'LG', 'Samsung', 'Kingston', 'WD', 'Intel', 'AMD', 'HyperX', 'E-Dra'];

/* Danh mục "ảo" trên menu → điều kiện lọc sản phẩm */
const CATEGORY_RULES = {
  laptop: { name: 'Laptop văn phòng', match: (p) => p.cat === 'laptop' },
  'laptop-gaming': { name: 'Laptop gaming', match: (p) => p.cat === 'laptop-gaming' },
  pc: { name: 'PC Gaming', match: (p) => p.cat === 'pc' && p.tags.includes('gaming') },
  'pc-office': { name: 'PC Văn phòng - Đồ họa', match: (p) => p.cat === 'pc' && !p.tags.includes('gaming') },
  components: { name: 'Linh kiện máy tính', match: (p) => p.cat === 'components' },
  vga: { name: 'Card đồ họa (VGA)', match: (p) => p.cat === 'components' && p.tags.includes('vga') },
  monitor: { name: 'Màn hình', match: (p) => p.cat === 'monitor' },
  keyboard: { name: 'Bàn phím', match: (p) => p.cat === 'keyboard' },
  mouse: { name: 'Chuột', match: (p) => p.cat === 'mouse' },
  headset: { name: 'Tai nghe', match: (p) => p.cat === 'headset' },
  chair: { name: 'Ghế gaming', match: (p) => p.cat === 'chair' },
  storage: { name: 'Ổ cứng - RAM', match: (p) => p.cat === 'components' && (p.tags.includes('ram') || p.tags.includes('ssd')) },
};

/* Danh mục: dùng cho menu hero, mega menu, drawer mobile và hàng icon */
const CATEGORIES = [
  {
    id: 'laptop', name: 'Laptop', icon: 'laptop',
    groups: [
      { title: 'Thương hiệu', links: ['ASUS', 'ACER', 'MSI', 'LENOVO', 'DELL', 'HP', 'LG'] },
      { title: 'Giá bán', links: ['Dưới 15 triệu', '15 - 20 triệu', '20 - 25 triệu', 'Trên 25 triệu'] },
      { title: 'Nhu cầu', links: ['Văn phòng', 'Sinh viên', 'Mỏng nhẹ', 'Đồ họa - Kỹ thuật'] },
      { title: 'CPU', links: ['Intel Core i5', 'Intel Core i7', 'Intel Core Ultra', 'AMD Ryzen'] },
    ],
  },
  {
    id: 'laptop-gaming', name: 'Laptop Gaming', icon: 'gamepad-2',
    groups: [
      { title: 'Thương hiệu', links: ['ASUS ROG / TUF', 'MSI', 'Acer Predator / Nitro', 'Lenovo Legion / LOQ', 'Dell Alienware'] },
      { title: 'Giá bán', links: ['Dưới 20 triệu', '20 - 25 triệu', '25 - 35 triệu', 'Trên 35 triệu'] },
      { title: 'Card đồ họa', links: ['RTX 3050', 'RTX 4050', 'RTX 4060', 'RTX 4070 trở lên'] },
      { title: 'Màn hình', links: ['144Hz', '165Hz', '240Hz', '2K / QHD'] },
    ],
  },
  {
    id: 'pc', name: 'PC Gaming', icon: 'pc-case',
    groups: [
      { title: 'Theo giá', links: ['Dưới 15 triệu', '15 - 20 triệu', '20 - 30 triệu', 'Trên 30 triệu'] },
      { title: 'Theo CPU', links: ['Intel Core i5', 'Intel Core i7', 'Intel Core Ultra', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
      { title: 'Theo VGA', links: ['RTX 4060', 'RTX 4060 Ti', 'RTX 5070', 'RTX 5080', 'RX 7600'] },
      { title: 'Dịch vụ', links: ['Build PC theo yêu cầu', 'Nâng cấp PC', 'Vệ sinh PC'] },
    ],
  },
  {
    id: 'pc-office', name: 'PC Văn phòng', icon: 'computer',
    groups: [
      { title: 'PC Văn phòng', links: ['Intel Core i3', 'Intel Core i5', 'AMD Ryzen 5 APU'] },
      { title: 'PC Đồ họa', links: ['Thiết kế 2D', 'Dựng phim - 3D', 'Workstation'] },
      { title: 'Theo giá', links: ['Dưới 10 triệu', '10 - 15 triệu', 'Trên 15 triệu'] },
      { title: 'Combo', links: ['PC + Màn hình', 'PC + Bàn phím chuột'] },
    ],
  },
  {
    id: 'components', name: 'Linh kiện PC', icon: 'cpu',
    groups: [
      { title: 'CPU', links: ['Intel', 'AMD'] },
      { title: 'VGA', links: ['NVIDIA GeForce', 'AMD Radeon'] },
      { title: 'RAM - Lưu trữ', links: ['RAM DDR4', 'RAM DDR5', 'SSD NVMe', 'HDD'] },
      { title: 'Khác', links: ['Mainboard', 'Nguồn (PSU)', 'Case', 'Tản nhiệt'] },
    ],
  },
  {
    id: 'vga', name: 'Card đồ họa', icon: 'circuit-board',
    groups: [
      { title: 'NVIDIA', links: ['RTX 5090 / 5080', 'RTX 5070 Ti / 5070', 'RTX 4060 / 4060 Ti', 'RTX 3050'] },
      { title: 'AMD', links: ['RX 9070 XT', 'RX 7800 XT', 'RX 7600'] },
      { title: 'Thương hiệu', links: ['ASUS', 'MSI', 'GIGABYTE', 'ZOTAC'] },
      { title: 'Giá bán', links: ['Dưới 8 triệu', '8 - 15 triệu', 'Trên 15 triệu'] },
    ],
  },
  {
    id: 'monitor', name: 'Màn hình', icon: 'monitor',
    groups: [
      { title: 'Thương hiệu', links: ['ASUS', 'LG', 'Samsung', 'MSI', 'Dell', 'ViewSonic'] },
      { title: 'Kích thước', links: ['22 - 24 inch', '27 inch', '32 inch', 'Màn hình cong'] },
      { title: 'Tần số quét', links: ['60 - 100Hz', '144 - 180Hz', '240Hz trở lên'] },
      { title: 'Độ phân giải', links: ['Full HD', '2K QHD', '4K UHD'] },
    ],
  },
  {
    id: 'keyboard', name: 'Bàn phím', icon: 'keyboard',
    groups: [
      { title: 'Thương hiệu', links: ['Akko', 'Logitech', 'Razer', 'Corsair', 'ASUS', 'AULA'] },
      { title: 'Loại', links: ['Bàn phím cơ', 'Hall Effect', 'Bàn phím văn phòng'] },
      { title: 'Layout', links: ['Full size', 'TKL', '75%', '65%'] },
      { title: 'Kết nối', links: ['Có dây', 'Không dây', '3 mode'] },
    ],
  },
  {
    id: 'mouse', name: 'Chuột', icon: 'mouse',
    groups: [
      { title: 'Thương hiệu', links: ['Logitech', 'Razer', 'Corsair', 'ASUS', 'Pulsar'] },
      { title: 'Loại', links: ['Chuột gaming', 'Chuột văn phòng', 'Lót chuột'] },
      { title: 'Kết nối', links: ['Có dây', 'Không dây', 'Bluetooth'] },
      { title: 'Giá bán', links: ['Dưới 500K', '500K - 1 triệu', 'Trên 1 triệu'] },
    ],
  },
  {
    id: 'headset', name: 'Tai nghe', icon: 'headphones',
    groups: [
      { title: 'Tai nghe', links: ['HyperX', 'Logitech', 'Razer', 'Corsair'] },
      { title: 'Loại', links: ['Có dây', 'Không dây', 'True Wireless'] },
      { title: 'Loa', links: ['Loa vi tính', 'Loa bluetooth', 'Soundbar'] },
      { title: 'Micro', links: ['Micro thu âm', 'Micro livestream'] },
    ],
  },
  {
    id: 'chair', name: 'Ghế gaming', icon: 'armchair',
    groups: [
      { title: 'Ghế gaming', links: ['E-Dra', 'Corsair', 'Warrior', 'Cougar'] },
      { title: 'Ghế công thái học', links: ['Lưng lưới', 'Có tựa đầu'] },
      { title: 'Bàn', links: ['Bàn gaming', 'Bàn nâng hạ'] },
      { title: 'Phụ kiện', links: ['Giá treo màn hình', 'Đèn LED'] },
    ],
  },
  {
    id: 'storage', name: 'Ổ cứng - RAM', icon: 'hard-drive',
    groups: [
      { title: 'SSD', links: ['SSD NVMe', 'SSD SATA', 'SSD di động'] },
      { title: 'RAM', links: ['RAM PC', 'RAM Laptop'] },
      { title: 'HDD', links: ['HDD PC', 'HDD di động'] },
      { title: 'USB - Thẻ nhớ', links: ['USB', 'Thẻ nhớ'] },
    ],
  },
];

/* ----------------------------------------------------------
   Sản phẩm
   specs: [loại, giá trị] — loại map sang icon trong components.js
   ---------------------------------------------------------- */
let __id = 0;
function product(cat, name, img, price, oldPrice, specs, tags = [], extra = {}) {
  __id += 1;
  return {
    id: `mk${String(__id).padStart(3, '0')}`,
    cat, name, img: IMG + img, price, oldPrice, specs, tags,
    // Điểm mẫu 4.5–5.0 (thay bằng đánh giá thật khi có backend)
    rating: extra.rating ?? 4.5 + ((__id * 7) % 6) / 10,
    reviews: extra.reviews ?? 0,
    gift: extra.gift ?? '',
    label: extra.label ?? '',
    brand: BRANDS.find((b) => new RegExp(`\\b${b}\\b`, 'i').test(name)) || 'Khác',
    stock: extra.stock ?? 5 + ((__id * 13) % 20), // Tồn kho mẫu
  };
}

const PRODUCTS = [
  /* PC */
  product('pc', 'PC MKPC Gaming i5 14400F - RTX 4060 8GB', 'pc-1.jpg', 19990000, 22490000,
    [['cpu', 'i5-14400F'], ['gpu', 'RTX 4060'], ['ram', '16GB DDR5'], ['ssd', '500GB NVMe']], ['gaming', 'intel'], { gift: 'Tặng bàn phím + chuột', reviews: 24, label: 'Bán chạy' }),
  product('pc', 'PC MKPC Gaming Ryzen 5 7500F - RTX 4060 Ti', 'pc-4.jpg', 21490000, 23990000,
    [['cpu', 'Ryzen 5 7500F'], ['gpu', 'RTX 4060 Ti'], ['ram', '16GB DDR5'], ['ssd', '1TB NVMe']], ['gaming', 'amd'], { gift: 'Tặng bàn phím + chuột', reviews: 18 }),
  product('pc', 'PC MKPC Gaming Ultra 7 265K - RTX 5070 12GB', 'pc-3.jpg', 42990000, 46500000,
    [['cpu', 'Ultra 7 265K'], ['gpu', 'RTX 5070'], ['ram', '32GB DDR5'], ['ssd', '1TB NVMe']], ['gaming', 'intel'], { reviews: 9, label: 'Mới' }),
  product('pc', 'PC MKPC Extreme Ryzen 7 9800X3D - RTX 5080', 'setup-3.jpg', 68990000, 74990000,
    [['cpu', 'R7 9800X3D'], ['gpu', 'RTX 5080'], ['ram', '32GB DDR5'], ['ssd', '2TB NVMe']], ['gaming', 'amd'], { reviews: 5, label: 'Mới' }),
  product('pc', 'PC MKPC Office i3 12100 - 8GB - SSD 256GB', 'pc-office.jpg', 7490000, 8290000,
    [['cpu', 'i3-12100'], ['gpu', 'UHD 730'], ['ram', '8GB DDR4'], ['ssd', '256GB NVMe']], ['office', 'intel'], { reviews: 31 }),
  product('pc', 'PC MKPC Đồ họa i7 14700 - RTX 4070 Super', 'pc-2.jpg', 36990000, 39990000,
    [['cpu', 'i7-14700'], ['gpu', 'RTX 4070 S'], ['ram', '32GB DDR5'], ['ssd', '1TB NVMe']], ['design', 'intel'], { reviews: 12 }),
  product('pc', 'PC MKPC Gaming Ryzen 5 5600 - RX 7600 8GB', 'setup-2.jpg', 14990000, 16490000,
    [['cpu', 'Ryzen 5 5600'], ['gpu', 'RX 7600'], ['ram', '16GB DDR4'], ['ssd', '500GB NVMe']], ['gaming', 'amd'], { gift: 'Tặng lót chuột', reviews: 40 }),
  product('pc', 'PC MKPC Office Ryzen 5 8600G - 16GB', 'setup-1.jpg', 11490000, 12490000,
    [['cpu', 'Ryzen 5 8600G'], ['gpu', 'Radeon 760M'], ['ram', '16GB DDR5'], ['ssd', '500GB NVMe']], ['office', 'amd'], { reviews: 15 }),

  /* Laptop gaming */
  product('laptop-gaming', 'Laptop gaming ASUS TUF Gaming F16 FX607JV', 'laptop-gaming-1.jpg', 28490000, 32990000,
    [['cpu', 'i7-13650HX'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '16" 165Hz']], ['asus'], { gift: 'Tặng balo + chuột', reviews: 27, label: 'Bán chạy' }),
  product('laptop-gaming', 'Laptop gaming Acer Nitro V 15 ANV15-51-58AN', 'laptop-gaming-3.jpg', 19990000, 23990000,
    [['cpu', 'i5-13420H'], ['gpu', 'RTX 4050'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['acer'], { gift: 'Tặng balo', reviews: 52 }),
  product('laptop-gaming', 'Laptop gaming MSI Katana 15 B13VFK', 'laptop-gaming-2.jpg', 25490000, 29990000,
    [['cpu', 'i7-13620H'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '1TB'], ['screen', '15.6" 144Hz']], ['msi'], { reviews: 19 }),
  product('laptop-gaming', 'Laptop gaming Lenovo LOQ 15IAX9', 'laptop-gaming-4.jpg', 17990000, 20990000,
    [['cpu', 'i5-12450HX'], ['gpu', 'RTX 3050'], ['ram', '12GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['lenovo'], { reviews: 33 }),
  product('laptop-gaming', 'Laptop gaming ASUS ROG Strix G16 G614JV', 'laptop-gaming-3.jpg', 37990000, 42990000,
    [['cpu', 'i7-13650HX'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '1TB'], ['screen', '16" 240Hz']], ['asus'], { gift: 'Tặng tai nghe ROG', reviews: 11 }),
  product('laptop-gaming', 'Laptop gaming Acer Predator Helios Neo 16', 'laptop-gaming-1.jpg', 32990000, 38990000,
    [['cpu', 'i7-14700HX'], ['gpu', 'RTX 4070'], ['ram', '16GB'], ['ssd', '1TB'], ['screen', '16" 240Hz']], ['acer'], { reviews: 8 }),
  product('laptop-gaming', 'Laptop gaming MSI Cyborg 15 A13UC', 'laptop-gaming-4.jpg', 17490000, 21990000,
    [['cpu', 'i5-13420H'], ['gpu', 'RTX 3050'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['msi'], { reviews: 21 }),
  product('laptop-gaming', 'Laptop gaming Lenovo Legion 5 16IRX9', 'laptop-gaming-2.jpg', 35990000, 39990000,
    [['cpu', 'i7-14650HX'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '1TB'], ['screen', '16" 165Hz']], ['lenovo'], { reviews: 14, label: 'Mới' }),

  /* Laptop văn phòng */
  product('laptop', 'Laptop ASUS Vivobook 15 OLED A1505VA', 'laptop-office-1.jpg', 15990000, 18490000,
    [['cpu', 'i5-13500H'], ['gpu', 'Iris Xe'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" OLED']], ['asus'], { gift: 'Tặng balo + chuột', reviews: 36, label: 'Bán chạy' }),
  product('laptop', 'Laptop Acer Swift Go 14 SFG14-73', 'laptop-office-2.jpg', 18990000, 21990000,
    [['cpu', 'Ultra 5 125H'], ['gpu', 'Intel Arc'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" OLED']], ['acer'], { reviews: 17 }),
  product('laptop', 'Laptop Lenovo IdeaPad Slim 5 14IMH9', 'laptop-office-3.jpg', 17990000, 20490000,
    [['cpu', 'Ultra 5 125H'], ['gpu', 'Intel Arc'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" WUXGA']], ['lenovo'], { reviews: 22 }),
  product('laptop', 'Laptop Dell Inspiron 14 5440', 'laptop-office-4.jpg', 16490000, 18990000,
    [['cpu', 'i5-1334U'], ['gpu', 'Iris Xe'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" FHD+']], ['dell'], { reviews: 10 }),
  product('laptop', 'Laptop HP Pavilion 15-eg3098TU', 'laptop-office-2.jpg', 14490000, 16990000,
    [['cpu', 'i5-1335U'], ['gpu', 'Iris Xe'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" FHD']], ['hp'], { reviews: 29 }),
  product('laptop', 'Laptop ASUS Zenbook 14 OLED UX3405MA', 'laptop-office-1.jpg', 24990000, 27990000,
    [['cpu', 'Ultra 7 155H'], ['gpu', 'Intel Arc'], ['ram', '32GB'], ['ssd', '1TB'], ['screen', '14" 3K OLED']], ['asus'], { gift: 'Tặng túi chống sốc', reviews: 13 }),
  product('laptop', 'Laptop Lenovo ThinkPad E14 Gen 5', 'laptop-office-4.jpg', 19490000, 21490000,
    [['cpu', 'i5-1335U'], ['gpu', 'Iris Xe'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" WUXGA']], ['lenovo'], { reviews: 9 }),

  /* Linh kiện */
  product('components', 'Card màn hình ASUS Dual GeForce RTX 4060 OC 8GB', 'vga-1.jpg', 7990000, 8990000,
    [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], { reviews: 44, label: 'Bán chạy' }),
  product('components', 'Card màn hình MSI GeForce RTX 5070 Gaming Trio OC 12GB', 'vga-3.jpg', 18990000, 20990000,
    [['gpu', '12GB GDDR7'], ['fan', '3 quạt'], ['power', '650W']], ['vga'], { reviews: 6, label: 'Mới' }),
  product('components', 'CPU Intel Core i5-14400F (up to 4.7GHz, 10 nhân)', 'cpu-2.jpg', 3990000, 4490000,
    [['cpu', '10C / 16T'], ['speed', '4.7GHz'], ['socket', 'LGA 1700']], ['cpu'], { reviews: 58 }),
  product('components', 'CPU AMD Ryzen 7 9800X3D (up to 5.2GHz, 8 nhân)', 'cpu-1.jpg', 13490000, 14990000,
    [['cpu', '8C / 16T'], ['speed', '5.2GHz'], ['socket', 'AM5']], ['cpu'], { reviews: 20 }),
  product('components', 'RAM Kingston Fury Beast 16GB DDR5 5600MHz', 'ram-2.jpg', 1190000, 1490000,
    [['ram', '16GB DDR5'], ['speed', '5600MHz']], ['ram'], { reviews: 65 }),
  product('components', 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', 'ram-1.jpg', 2790000, 3290000,
    [['ram', '32GB DDR5'], ['speed', '6000MHz']], ['ram'], { reviews: 23 }),
  product('components', 'SSD Samsung 990 PRO 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 2990000, 3590000,
    [['ssd', '1TB NVMe'], ['speed', '7450MB/s']], ['ssd'], { reviews: 47 }),
  product('components', 'SSD WD Black SN770 500GB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 1190000, 1490000,
    [['ssd', '500GB NVMe'], ['speed', '5000MB/s']], ['ssd'], { reviews: 38 }),

  /* Chuột */
  product('mouse', 'Chuột Logitech G502 X Plus Lightspeed RGB', 'mouse-4.jpg', 2990000, 3790000,
    [['dpi', '25.600 DPI'], ['wireless', 'Không dây'], ['weight', '106g']], ['logitech'], { reviews: 41 }),
  product('mouse', 'Chuột Razer DeathAdder V3 Pro', 'mouse-2.jpg', 3290000, 3990000,
    [['dpi', '30.000 DPI'], ['wireless', 'Không dây'], ['weight', '63g']], ['razer'], { reviews: 16 }),
  product('mouse', 'Chuột Logitech G304 Lightspeed Wireless', 'mouse-1.jpg', 690000, 990000,
    [['dpi', '12.000 DPI'], ['wireless', 'Không dây'], ['weight', '99g']], ['logitech'], { reviews: 120, label: 'Bán chạy' }),
  product('mouse', 'Chuột Corsair M65 RGB Ultra', 'mouse-3.jpg', 1590000, 1990000,
    [['dpi', '26.000 DPI'], ['wired', 'Có dây'], ['weight', '97g']], ['corsair'], { reviews: 12 }),
  product('mouse', 'Chuột ASUS ROG Keris II Ace', 'mouse-5.jpg', 2690000, 3290000,
    [['dpi', '42.000 DPI'], ['wireless', 'Không dây'], ['weight', '54g']], ['asus'], { reviews: 7 }),
  product('mouse', 'Chuột Razer Viper V3 HyperSpeed', 'mouse-2.jpg', 1590000, 1890000,
    [['dpi', '30.000 DPI'], ['wireless', 'Không dây'], ['weight', '82g']], ['razer'], { reviews: 19 }),
  product('mouse', 'Chuột Logitech G Pro X Superlight 2', 'mouse-1.jpg', 3190000, 3690000,
    [['dpi', '32.000 DPI'], ['wireless', 'Không dây'], ['weight', '60g']], ['logitech'], { reviews: 34 }),

  /* Bàn phím */
  product('keyboard', 'Bàn phím cơ Akko 5075B Plus Black & Gold', 'keyboard-2.jpg', 1690000, 1990000,
    [['switch', 'Akko V3 Cream'], ['layout', '75%'], ['wireless', '3 mode']], ['akko'], { reviews: 45, label: 'Bán chạy' }),
  product('keyboard', 'Bàn phím Logitech G Pro X TKL Lightspeed', 'keyboard-5.jpg', 3990000, 4790000,
    [['switch', 'GX Brown'], ['layout', 'TKL'], ['wireless', 'Không dây']], ['logitech'], { reviews: 13 }),
  product('keyboard', 'Bàn phím Razer BlackWidow V4 X', 'keyboard-1.jpg', 2990000, 3490000,
    [['switch', 'Razer Yellow'], ['layout', 'Full size'], ['wired', 'Có dây']], ['razer'], { reviews: 18 }),
  product('keyboard', 'Bàn phím Corsair K70 RGB Pro', 'keyboard-3.jpg', 3290000, 3990000,
    [['switch', 'Cherry MX Red'], ['layout', 'Full size'], ['wired', 'Có dây']], ['corsair'], { reviews: 10 }),
  product('keyboard', 'Bàn phím cơ Akko MOD007B HE Magnetic', 'keyboard-4.jpg', 2490000, 2990000,
    [['switch', 'Hall Effect'], ['layout', '75%'], ['wireless', '3 mode']], ['akko'], { reviews: 8, label: 'Mới' }),
  product('keyboard', 'Bàn phím ASUS ROG Azoth Extreme', 'keyboard-6.jpg', 5490000, 6290000,
    [['switch', 'ROG NX Snow'], ['layout', '75%'], ['wireless', '3 mode']], ['asus'], { reviews: 4 }),
  product('keyboard', 'Bàn phím cơ AULA F75 Gasket', 'keyboard-1.jpg', 990000, 1290000,
    [['switch', 'Reaper'], ['layout', '75%'], ['wireless', '3 mode']], ['aula'], { reviews: 88 }),

  /* Màn hình */
  product('monitor', 'Màn hình ASUS TUF Gaming VG249Q3A 24" IPS 180Hz', 'monitor-1.jpg', 3290000, 3990000,
    [['size', '23.8 inch'], ['panel', 'IPS'], ['hz', '180Hz'], ['res', 'Full HD']], ['asus'], { reviews: 57, label: 'Bán chạy' }),
  product('monitor', 'Màn hình LG UltraGear 27GS65F 27" IPS 180Hz', 'monitor-2.jpg', 4590000, 5490000,
    [['size', '27 inch'], ['panel', 'IPS'], ['hz', '180Hz'], ['res', 'Full HD']], ['lg'], { reviews: 22 }),
  product('monitor', 'Màn hình Samsung Odyssey G5 LS27CG552 27" 2K 165Hz', 'monitor-3.jpg', 5990000, 7490000,
    [['size', '27 inch cong'], ['panel', 'VA'], ['hz', '165Hz'], ['res', '2K QHD']], ['samsung'], { reviews: 30 }),
  product('monitor', 'Màn hình MSI MAG 274QRF QD E2 27" 2K 180Hz', 'monitor-4.jpg', 6490000, 7990000,
    [['size', '27 inch'], ['panel', 'Rapid IPS'], ['hz', '180Hz'], ['res', '2K QHD']], ['msi'], { reviews: 15 }),
  product('monitor', 'Màn hình Dell UltraSharp U2424H 24" IPS 120Hz', 'monitor-5.jpg', 5790000, 6490000,
    [['size', '23.8 inch'], ['panel', 'IPS'], ['hz', '120Hz'], ['res', 'Full HD']], ['dell'], { reviews: 11 }),
  product('monitor', 'Màn hình ASUS ROG Strix XG27ACS 27" 2K 180Hz', 'monitor-2.jpg', 7490000, 8990000,
    [['size', '27 inch'], ['panel', 'Fast IPS'], ['hz', '180Hz'], ['res', '2K QHD']], ['asus'], { reviews: 9 }),
  product('monitor', 'Màn hình LG 27US500-W 27" 4K UHD', 'monitor-3.jpg', 5290000, 6290000,
    [['size', '27 inch'], ['panel', 'IPS'], ['hz', '60Hz'], ['res', '4K UHD']], ['lg'], { reviews: 6 }),

  /* Tai nghe & ghế (dùng cho flash sale) */
  product('headset', 'Tai nghe HyperX Cloud III Wired', 'headset-1.jpg', 1990000, 2490000,
    [['driver', '53mm'], ['wired', 'Có dây']], ['hyperx'], { reviews: 26 }),
  product('headset', 'Tai nghe Logitech G733 Lightspeed RGB', 'headset-2.jpg', 2490000, 3290000,
    [['driver', '40mm'], ['wireless', 'Không dây']], ['logitech'], { reviews: 19 }),
  product('chair', 'Ghế gaming E-Dra Hercules EGC203', 'chair-3.jpg', 2990000, 3990000,
    [['material', 'Da PU'], ['weight', 'Tải 150kg']], ['edra'], { reviews: 14 }),
  product('chair', 'Ghế gaming Corsair TC100 Relaxed', 'chair-2.jpg', 4990000, 5990000,
    [['material', 'Vải thoáng'], ['weight', 'Tải 120kg']], ['corsair'], { reviews: 7 }),
];

/* Flash sale: danh sách id sản phẩm */
const FLASH_SALE = ['mk010', 'mk017', 'mk001', 'mk034', 'mk039', 'mk046', 'mk053', 'mk024', 'mk055', 'mk029', 'mk012', 'mk021'];

/* Flash sale kết thúc vào Black Friday (nếu đã qua thì đếm đến hết ngày) */
const FLASH_END = '2026-11-27T23:59:59+07:00';
const FLASH_TITLE = 'Black Friday giảm sốc - Bỏ vào giỏ ngay!';
/* Pop-up khuyến mãi ở trang chủ (mỗi khách thấy tối đa 1 lần/ngày). Tắt: enabled: false.
   coupon phải là mã có trong SHOP.coupons; đồng hồ đếm ngược tới FLASH_END. */
const PROMO_POPUP = {
  enabled: true,
  delay: 2500, // hiện sau 2,5 giây
  tag: 'Black Friday · Ưu đãi có hạn',
  title: 'Giảm thêm 5% cho mọi đơn hàng',
  desc: 'Áp dụng toàn bộ sản phẩm, tối đa 500.000đ — cộng dồn cùng giá Flash Sale.',
  coupon: 'BLACKFRIDAY',
  img: 'setup-1.jpg',
  perks: ['Trả góp 0% qua thẻ tín dụng', 'Giao nhanh 2h nội thành TP.HCM', 'Bảo hành tận nơi'],
  cta: { text: 'Săn deal ngay', href: 'category.html?sale=1' },
};

/* Banner */
const HERO_SLIDES = [
  { theme: 'red', tag: 'Black Friday', title: 'PC Gaming <em>giảm đến 5 triệu</em>', desc: 'Tặng kèm bàn phím + chuột gaming cho mọi cấu hình từ 15 triệu', cta: 'Mua ngay', img: 'pc-4.jpg', href: 'category.html?cat=pc' },
  { theme: 'dark', tag: 'Hàng mới về', title: 'Laptop Gaming <em>RTX 50 Series</em>', desc: 'Trả góp 0% — Giao nhanh 2h nội thành TP.HCM', cta: 'Khám phá', img: 'laptop-gaming-3.jpg', href: 'category.html?cat=laptop-gaming' },
  { theme: 'dark', tag: 'Deal hot', title: 'Màn hình 2K 180Hz <em>chỉ từ 4.59 triệu</em>', desc: 'ASUS, LG, Samsung, MSI chính hãng — bảo hành 36 tháng', cta: 'Xem ngay', img: 'monitor-4.jpg', href: 'category.html?cat=monitor' },
  { theme: 'red', tag: 'Gaming gear', title: 'Gear chính hãng <em>giảm đến 50%</em>', desc: 'Chuột, bàn phím, tai nghe từ Logitech, Razer, Akko, Corsair', cta: 'Săn deal', img: 'keyboard-2.jpg', href: 'category.html?cat=keyboard' },
];

const HERO_SIDE = [
  { theme: 'dark', tag: 'Miễn phí', title: 'Build PC <em>theo yêu cầu</em>', img: 'setup-3.jpg', href: 'build-pc.html' },
  { theme: 'light', tag: 'Trợ giá', title: 'Thu cũ đổi mới <em>đến 2 triệu</em>', img: 'laptop-office-3.jpg', href: 'policy.html?type=thu-cu-doi-moi' },
];

/* Hàng icon danh mục nhanh dưới hero */
const QUICK_CATS = [
  { name: 'Black Friday', href: 'category.html?sale=1', special: true },
  { name: 'Laptop', img: 'laptop-office-2.jpg', href: 'category.html?cat=laptop' },
  { name: 'PC', img: 'pc-1.jpg', href: 'category.html?cat=pc' },
  { name: 'Màn hình', img: 'monitor-2.jpg', href: 'category.html?cat=monitor' },
  { name: 'Ghế', img: 'chair-3.jpg', href: 'category.html?cat=chair' },
  { name: 'CPU', img: 'cpu-1.jpg', href: 'category.html?cat=components&q=CPU' },
  { name: 'VGA', img: 'vga-1.jpg', href: 'category.html?cat=vga' },
  { name: 'RAM', img: 'ram-2.jpg', href: 'category.html?cat=storage&q=RAM' },
  { name: 'Ổ cứng', img: 'ssd-1.jpg', href: 'category.html?cat=storage' },
  { name: 'Chuột', img: 'mouse-4.jpg', href: 'category.html?cat=mouse' },
  { name: 'Bàn phím', img: 'keyboard-3.jpg', href: 'category.html?cat=keyboard' },
  { name: 'Tai nghe', img: 'headset-1.jpg', href: 'category.html?cat=headset' },
];

/* Banner xen kẽ: 'pair' = 2 banner đều nhau, 'feature' = 1 lớn + 2 nhỏ xếp dọc */
const MID_BANNERS = {
  a: {
    layout: 'pair',
    items: [
      { theme: 'red', tag: 'Build PC', title: 'Build PC từ 12 triệu <em>tặng màn hình</em>', desc: 'Áp dụng cho cấu hình RTX 4060 trở lên', cta: 'Xem cấu hình', img: 'pc-2.jpg', href: 'build-pc.html' },
      { theme: 'dark', tag: 'Gaming gear', title: 'Gear đa dạng <em>giảm đến 50%</em>', desc: 'Chuột, bàn phím, tai nghe chính hãng', cta: 'Săn deal', img: 'headset-2.jpg', href: 'category.html?cat=mouse' },
    ],
  },
  b: {
    layout: 'feature',
    items: [
      { theme: 'dark', tag: 'Màn hình chính hãng', title: 'Giảm sốc <em>đến 35%</em>', desc: 'Màn hình 2K 180Hz chỉ từ 4.590.000đ — ASUS, LG, Samsung, MSI', cta: 'Mua ngay', img: 'monitor-5.jpg', href: 'category.html?cat=monitor' },
      { theme: 'light', tag: 'Combo', title: 'Combo gear <em>đẹp cả đôi</em>', img: 'keyboard-4.jpg', href: 'category.html?cat=keyboard' },
      { theme: 'red', tag: 'Góc gaming', title: 'Deal bàn ghế <em>thả ga lựa chọn</em>', img: 'chair-2.jpg', href: 'category.html?cat=chair' },
    ],
  },
};

/* Cấu hình các khối trên trang chủ (theo thứ tự hiển thị) */
const HOME_SECTIONS = [
  { type: 'banners', key: 'a' },
  { type: 'products', id: 'pc', title: 'PC bán chạy', tag: { icon: 'truck', text: 'Miễn phí giao hàng & lắp đặt' },
    tabs: [['all', 'Tất cả'], ['gaming', 'PC Gaming'], ['office', 'PC Văn phòng'], ['design', 'PC Đồ họa'], ['intel', 'Intel'], ['amd', 'AMD']] },
  { type: 'products', id: 'laptop-gaming', title: 'Laptop gaming bán chạy', tag: { icon: 'badge-percent', text: 'Trả góp 0%' },
    tabs: [['all', 'Tất cả'], ['asus', 'ASUS'], ['acer', 'ACER'], ['msi', 'MSI'], ['lenovo', 'LENOVO']] },
  { type: 'products', id: 'laptop', title: 'Laptop văn phòng bán chạy', tag: { icon: 'gift', text: 'Tặng balo + chuột' },
    tabs: [['all', 'Tất cả'], ['asus', 'ASUS'], ['acer', 'ACER'], ['lenovo', 'LENOVO'], ['dell', 'DELL'], ['hp', 'HP']] },
  { type: 'products', id: 'mouse', title: 'Chuột bán chạy', tag: { icon: 'shield-check', text: 'Bảo hành 1 đổi 1' },
    tabs: [['all', 'Tất cả'], ['logitech', 'Logitech'], ['razer', 'Razer'], ['corsair', 'Corsair'], ['asus', 'ASUS']] },
  { type: 'products', id: 'keyboard', title: 'Bàn phím bán chạy', tag: { icon: 'shield-check', text: 'Bảo hành 1 đổi 1' },
    tabs: [['all', 'Tất cả'], ['akko', 'Akko'], ['logitech', 'Logitech'], ['razer', 'Razer'], ['corsair', 'Corsair'], ['aula', 'AULA']] },
  { type: 'banners', key: 'b' },
  { type: 'products', id: 'monitor', title: 'Màn hình chính hãng', tag: { icon: 'shield-check', text: 'Bảo hành 36 tháng' },
    tabs: [['all', 'Tất cả'], ['asus', 'ASUS'], ['lg', 'LG'], ['samsung', 'Samsung'], ['msi', 'MSI'], ['dell', 'Dell']] },
  { type: 'products', id: 'components', title: 'Linh kiện máy tính', tag: { icon: 'wrench', text: 'Lắp đặt miễn phí' },
    tabs: [['all', 'Tất cả'], ['vga', 'VGA'], ['cpu', 'CPU'], ['ram', 'RAM'], ['ssd', 'SSD']] },
];


