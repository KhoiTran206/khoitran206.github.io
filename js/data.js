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
  warranty: { pc: 36, 'laptop-gaming': 24, laptop: 24, components: 36, mouse: 24, keyboard: 24, monitor: 36, headset: 12, chair: 12, desk: 12, software: 12, network: 24, accessory: 12 },
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

const BRANDS = ['MKPC', 'ASUS', 'Acer', 'MSI', 'Lenovo', 'Dell', 'HP', 'Apple', 'Logitech', 'Razer', 'Corsair', 'Akko', 'AULA', 'LG', 'Samsung', 'ViewSonic', 'Kingston', 'Crucial', 'G.Skill', 'Lexar', 'WD', 'Seagate', 'Toshiba', 'Intel', 'AMD', 'GIGABYTE', 'ASRock', 'ZOTAC', 'Cooler Master', 'DeepCool', 'Thermalright', 'NZXT', 'Lian Li', 'Xigmatek', 'be quiet', 'HyperX', 'SteelSeries', 'Sony', 'E-Dra', 'Warrior', 'Microsoft', 'Kaspersky', 'Adobe', 'TP-Link', 'Mercusys', 'UGREEN', 'Tenda', 'Bitdefender', 'ESET', 'AOC', 'Philips', 'Keychron', 'Dareu', 'Leopold', 'Pulsar', 'VGN', 'Palit', 'INNO3D', 'Sapphire', 'TeamGroup', 'ADATA', 'Super Flower', 'ID-COOLING', 'ARCTIC', 'Montech', 'Jonsbo', 'Cougar', 'Microlab', 'Edifier', 'Creative', 'Rapoo', 'Fifine', 'Rode', 'Elgato', '8BitDo', 'SanDisk', 'North Bayou'];

/* Danh mục "ảo" trên menu → điều kiện lọc sản phẩm */
const CATEGORY_RULES = {
  laptop: { name: 'Laptop văn phòng', match: (p) => p.cat === 'laptop' },
  'laptop-gaming': { name: 'Laptop gaming', match: (p) => p.cat === 'laptop-gaming' },
  pc: { name: 'PC Gaming', match: (p) => p.cat === 'pc' && p.tags.includes('gaming') },
  'pc-office': { name: 'PC Văn phòng - Đồ họa', match: (p) => p.cat === 'pc' && !p.tags.includes('gaming') },
  components: { name: 'Linh kiện máy tính', match: (p) => p.cat === 'components' },
  cpu: { name: 'CPU - Vi xử lý', match: (p) => p.cat === 'components' && p.tags.includes('cpu') },
  mainboard: { name: 'Mainboard', match: (p) => p.cat === 'components' && p.tags.includes('mainboard') },
  vga: { name: 'Card đồ họa (VGA)', match: (p) => p.cat === 'components' && p.tags.includes('vga') },
  ram: { name: 'RAM', match: (p) => p.cat === 'components' && p.tags.includes('ram') },
  storage: { name: 'Ổ cứng SSD - HDD', match: (p) => p.cat === 'components' && (p.tags.includes('ssd') || p.tags.includes('hdd')) },
  psu: { name: 'Nguồn máy tính (PSU)', match: (p) => p.cat === 'components' && p.tags.includes('psu') },
  cooler: { name: 'Tản nhiệt', match: (p) => p.cat === 'components' && p.tags.includes('cooler') },
  case: { name: 'Vỏ case', match: (p) => p.cat === 'components' && p.tags.includes('case') },
  monitor: { name: 'Màn hình', match: (p) => p.cat === 'monitor' },
  keyboard: { name: 'Bàn phím', match: (p) => p.cat === 'keyboard' },
  mouse: { name: 'Chuột - Lót chuột', match: (p) => p.cat === 'mouse' },
  headset: { name: 'Tai nghe', match: (p) => p.cat === 'headset' },
  furniture: { name: 'Bàn ghế gaming', match: (p) => p.cat === 'chair' || p.cat === 'desk' },
  chair: { name: 'Ghế gaming - Công thái học', match: (p) => p.cat === 'chair' },
  desk: { name: 'Bàn gaming', match: (p) => p.cat === 'desk' },
  software: { name: 'Phần mềm bản quyền', match: (p) => p.cat === 'software' },
  network: { name: 'Thiết bị mạng', match: (p) => p.cat === 'network' },
  accessory: { name: 'Phụ kiện (loa, webcam, micro…)', match: (p) => p.cat === 'accessory' },
  used: { name: 'Hàng cũ giá tốt', match: (p) => p.tags.includes('used') },
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
      { title: 'CPU - Mainboard', links: ['CPU Intel', 'CPU AMD', 'Mainboard Intel', 'Mainboard AMD'] },
      { title: 'VGA - RAM', links: ['Card màn hình', 'Radeon', 'RAM DDR4', 'RAM DDR5'] },
      { title: 'Lưu trữ', links: ['SSD NVMe', 'SSD SATA', 'Ổ cứng HDD'] },
      { title: 'Nguồn - Tản - Case', links: ['Nguồn', 'Tản nhiệt khí', 'Tản nhiệt nước AIO', 'Case'] },
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
      { title: 'Thương hiệu', links: ['HyperX', 'Logitech', 'Razer', 'Corsair', 'Sony', 'SteelSeries'] },
      { title: 'Kết nối', links: ['Có dây', 'Không dây', 'Bluetooth'] },
    ],
  },
  {
    id: 'furniture', name: 'Bàn ghế gaming', icon: 'armchair',
    groups: [
      { title: 'Ghế gaming', links: ['E-Dra', 'Corsair', 'Cooler Master'] },
      { title: 'Ghế công thái học', links: ['Lưng lưới', 'Có tựa đầu'] },
      { title: 'Bàn', links: ['Bàn gaming', 'Bàn nâng hạ', 'Có LED'] },
    ],
  },
  {
    id: 'storage', name: 'Ổ cứng SSD - HDD', icon: 'hard-drive',
    groups: [
      { title: 'SSD', links: ['SSD NVMe', 'SSD SATA', '1TB', '2TB'] },
      { title: 'HDD', links: ['Ổ cứng HDD', 'NAS', 'Camera'] },
    ],
  },
  {
    id: 'accessory', name: 'Phụ kiện', icon: 'cable',
    groups: [
      { title: 'Âm thanh', links: ['Loa', 'Micro', 'Soundbar'] },
      { title: 'Stream - Học online', links: ['Webcam', 'Micro livestream'] },
      { title: 'Chơi game', links: ['Tay cầm', 'Xbox', 'DualSense'] },
      { title: 'Lưu trữ - Kết nối', links: ['Ổ cứng di động', 'USB', 'Thẻ nhớ', 'Hub USB-C', 'Giá treo màn hình'] },
    ],
  },
  {
    id: 'network', name: 'Thiết bị mạng', icon: 'router',
    groups: [
      { title: 'WiFi', links: ['Router WiFi 6', 'WiFi Mesh', 'Bộ phát WiFi'] },
      { title: 'Có dây', links: ['Switch', 'Cáp mạng'] },
      { title: 'Thương hiệu', links: ['TP-Link', 'ASUS', 'Mercusys'] },
    ],
  },
  {
    id: 'software', name: 'Phần mềm', icon: 'app-window',
    groups: [
      { title: 'Hệ điều hành', links: ['Windows 11 Home', 'Windows 11 Pro'] },
      { title: 'Văn phòng', links: ['Office 2024', 'Microsoft 365'] },
      { title: 'Khác', links: ['Diệt virus', 'Adobe'] },
    ],
  },
  {
    id: 'used', name: 'Hàng cũ', icon: 'recycle',
    groups: [
      { title: 'Linh kiện cũ', links: ['Card màn hình', 'CPU'] },
      { title: 'Máy cũ', links: ['Laptop', 'PC văn phòng', 'Màn hình'] },
      { title: 'Gear cũ', links: ['Chuột', 'Ghế'] },
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
    warranty: extra.warranty ?? SHOP.warranty[cat] ?? 12, // tháng (hàng cũ có thời hạn riêng)
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

  /* ====== Bổ sung (giữ nguyên thứ tự các sản phẩm phía trên để không đổi mã mk001…) ====== */

  /* Mainboard */
  product('components', 'Mainboard ASUS PRIME B760M-A WIFI D4', 'mainboard-1.jpg', 3290000, 3690000,
    [['chipset', 'Intel B760'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], { reviews: 31, label: 'Bán chạy' }),
  product('components', 'Mainboard MSI PRO B760M-P DDR4', 'mainboard-2.jpg', 2490000, 2790000,
    [['chipset', 'Intel B760'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], { reviews: 22 }),
  product('components', 'Mainboard GIGABYTE B650M AORUS ELITE AX', 'mainboard-3.jpg', 4990000, 5590000,
    [['chipset', 'AMD B650'], ['socket', 'AM5'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], { reviews: 17 }),
  product('components', 'Mainboard ASUS ROG STRIX B650-A GAMING WIFI', 'mainboard-4.jpg', 6490000, 7290000,
    [['chipset', 'AMD B650'], ['socket', 'AM5'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], { reviews: 12 }),
  product('components', 'Mainboard MSI MAG B550M MORTAR WIFI', 'mainboard-1.jpg', 3390000, 3890000,
    [['chipset', 'AMD B550'], ['socket', 'AM4'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'amd'], { reviews: 26 }),
  product('components', 'Mainboard ASRock B760M Pro RS', 'mainboard-2.jpg', 2690000, 2990000,
    [['chipset', 'Intel B760'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], { reviews: 9 }),
  product('components', 'Mainboard GIGABYTE Z790 AORUS ELITE AX', 'mainboard-3.jpg', 7490000, 8490000,
    [['chipset', 'Intel Z790'], ['socket', 'LGA 1700'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], { reviews: 8 }),
  product('components', 'Mainboard ASUS TUF GAMING B850M-PLUS WIFI', 'mainboard-4.jpg', 5690000, 6290000,
    [['chipset', 'AMD B850'], ['socket', 'AM5'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], { reviews: 5, label: 'Mới' }),

  /* Card đồ họa */
  product('components', 'Card màn hình GIGABYTE GeForce RTX 3050 WINDFORCE OC 6GB', 'vga-2.jpg', 4790000, 5490000,
    [['gpu', '6GB GDDR6'], ['fan', '2 quạt'], ['power', '450W']], ['vga'], { reviews: 39 }),
  product('components', 'Card màn hình MSI GeForce RTX 5060 Ventus 2X OC 8GB', 'vga-1.jpg', 8990000, 9790000,
    [['gpu', '8GB GDDR7'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], { reviews: 11, label: 'Mới' }),
  product('components', 'Card màn hình ZOTAC GAMING GeForce RTX 4060 Ti Twin Edge 8GB', 'vga-3.jpg', 10490000, 11990000,
    [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], { reviews: 15 }),
  product('components', 'Card màn hình ASUS TUF Gaming GeForce RTX 5070 Ti OC 16GB', 'vga-2.jpg', 27990000, 30990000,
    [['gpu', '16GB GDDR7'], ['fan', '3 quạt'], ['power', '750W']], ['vga'], { reviews: 6, label: 'Mới' }),
  product('components', 'Card màn hình MSI GeForce RTX 5080 Gaming Trio OC 16GB', 'vga-3.jpg', 35990000, 38990000,
    [['gpu', '16GB GDDR7'], ['fan', '3 quạt'], ['power', '850W']], ['vga'], { reviews: 4 }),
  product('components', 'Card màn hình GIGABYTE Radeon RX 7600 GAMING OC 8GB', 'vga-1.jpg', 6790000, 7490000,
    [['gpu', '8GB GDDR6'], ['fan', '3 quạt'], ['power', '550W']], ['vga', 'amd'], { reviews: 13 }),
  product('components', 'Card màn hình ASUS Prime Radeon RX 9070 XT OC 16GB', 'vga-2.jpg', 19990000, 21990000,
    [['gpu', '16GB GDDR6'], ['fan', '3 quạt'], ['power', '750W']], ['vga', 'amd'], { reviews: 7 }),

  /* CPU */
  product('components', 'CPU Intel Core i3-12100F (up to 4.3GHz, 4 nhân)', 'cpu-3.jpg', 1990000, 2390000,
    [['cpu', '4C / 8T'], ['speed', '4.3GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], { reviews: 42 }),
  product('components', 'CPU Intel Core i5-12400F (up to 4.4GHz, 6 nhân)', 'cpu-2.jpg', 2590000, 2990000,
    [['cpu', '6C / 12T'], ['speed', '4.4GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], { reviews: 77, label: 'Bán chạy' }),
  product('components', 'CPU Intel Core i7-14700K (up to 5.6GHz, 20 nhân)', 'cpu-1.jpg', 9290000, 10490000,
    [['cpu', '20C / 28T'], ['speed', '5.6GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], { reviews: 14 }),
  product('components', 'CPU Intel Core Ultra 7 265K (up to 5.5GHz, 20 nhân)', 'cpu-3.jpg', 9990000, 11490000,
    [['cpu', '20C / 20T'], ['speed', '5.5GHz'], ['socket', 'LGA 1851']], ['cpu', 'intel'], { reviews: 6, label: 'Mới' }),
  product('components', 'CPU AMD Ryzen 5 5600 (up to 4.4GHz, 6 nhân)', 'cpu-1.jpg', 2690000, 3190000,
    [['cpu', '6C / 12T'], ['speed', '4.4GHz'], ['socket', 'AM4']], ['cpu', 'amd'], { reviews: 51 }),
  product('components', 'CPU AMD Ryzen 5 7500F (up to 5.0GHz, 6 nhân)', 'cpu-2.jpg', 3890000, 4390000,
    [['cpu', '6C / 12T'], ['speed', '5.0GHz'], ['socket', 'AM5']], ['cpu', 'amd'], { reviews: 36 }),
  product('components', 'CPU AMD Ryzen 7 7700 (up to 5.3GHz, 8 nhân)', 'cpu-3.jpg', 6990000, 7790000,
    [['cpu', '8C / 16T'], ['speed', '5.3GHz'], ['socket', 'AM5']], ['cpu', 'amd'], { reviews: 10 }),

  /* RAM */
  product('components', 'RAM Kingston Fury Beast 8GB DDR4 3200MHz', 'ram-2.jpg', 490000, 650000,
    [['ram', '8GB DDR4'], ['speed', '3200MHz']], ['ram'], { reviews: 93 }),
  product('components', 'RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', 'ram-1.jpg', 1090000, 1290000,
    [['ram', '16GB DDR4'], ['speed', '3200MHz']], ['ram'], { reviews: 48 }),
  product('components', 'RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz', 'ram-1.jpg', 3290000, 3790000,
    [['ram', '32GB DDR5'], ['speed', '6400MHz']], ['ram'], { reviews: 12 }),
  product('components', 'RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 6000MHz', 'ram-2.jpg', 2890000, 3290000,
    [['ram', '32GB DDR5'], ['speed', '6000MHz']], ['ram'], { reviews: 19 }),
  product('components', 'RAM Laptop Crucial 16GB DDR5 5600MHz SODIMM', 'ram-2.jpg', 1090000, 1290000,
    [['ram', '16GB DDR5'], ['speed', '5600MHz']], ['ram', 'laptop-ram'], { reviews: 24 }),

  /* SSD */
  product('components', 'SSD Kingston NV3 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 1690000, 1990000,
    [['ssd', '1TB NVMe'], ['speed', '6000MB/s']], ['ssd'], { reviews: 61, label: 'Bán chạy' }),
  product('components', 'SSD Samsung 870 EVO 500GB 2.5" SATA', 'ssd-1.jpg', 1290000, 1490000,
    [['ssd', '500GB SATA'], ['speed', '560MB/s']], ['ssd'], { reviews: 33 }),
  product('components', 'SSD Lexar NM790 2TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 3490000, 3990000,
    [['ssd', '2TB NVMe'], ['speed', '7400MB/s']], ['ssd'], { reviews: 9 }),
  product('components', 'SSD WD Blue SN580 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 1790000, 2090000,
    [['ssd', '1TB NVMe'], ['speed', '4150MB/s']], ['ssd'], { reviews: 21 }),

  /* Ổ cứng HDD */
  product('components', 'Ổ cứng HDD Seagate BarraCuda 1TB 7200rpm', 'hdd-1.jpg', 1190000, 1390000,
    [['capacity', '1TB'], ['rpm', '7200rpm'], ['form', '3.5 inch SATA']], ['hdd'], { reviews: 28 }),
  product('components', 'Ổ cứng HDD WD Blue 2TB 7200rpm', 'hdd-2.jpg', 1690000, 1890000,
    [['capacity', '2TB'], ['rpm', '7200rpm'], ['form', '3.5 inch SATA']], ['hdd'], { reviews: 35 }),
  product('components', 'Ổ cứng HDD Toshiba P300 2TB 7200rpm', 'hdd-3.jpg', 1590000, 1790000,
    [['capacity', '2TB'], ['rpm', '7200rpm'], ['form', '3.5 inch SATA']], ['hdd'], { reviews: 14 }),
  product('components', 'Ổ cứng HDD Seagate IronWolf 4TB NAS', 'hdd-1.jpg', 2990000, 3390000,
    [['capacity', '4TB'], ['rpm', '5400rpm'], ['form', 'Chuyên NAS']], ['hdd'], { reviews: 8 }),
  product('components', 'Ổ cứng HDD WD Purple 4TB chuyên camera', 'hdd-2.jpg', 2690000, 2990000,
    [['capacity', '4TB'], ['rpm', '5400rpm'], ['form', 'Chuyên camera']], ['hdd'], { reviews: 11 }),

  /* Nguồn (PSU) */
  product('components', 'Nguồn Xigmatek X-Power III 500W', 'psu-1.jpg', 690000, 850000,
    [['watt', '500W'], ['cert', '80 Plus'], ['form', 'ATX']], ['psu'], { reviews: 46 }),
  product('components', 'Nguồn MSI MAG A650BN 650W 80 Plus Bronze', 'psu-1.jpg', 1190000, 1390000,
    [['watt', '650W'], ['cert', '80 Plus Bronze'], ['form', 'ATX']], ['psu'], { reviews: 38, label: 'Bán chạy' }),
  product('components', 'Nguồn Corsair CX650 650W 80 Plus Bronze', 'psu-1.jpg', 1590000, 1890000,
    [['watt', '650W'], ['cert', '80 Plus Bronze'], ['form', 'ATX']], ['psu'], { reviews: 20 }),
  product('components', 'Nguồn be quiet! Pure Power 12 M 750W 80 Plus Gold', 'psu-2.jpg', 2490000, 2890000,
    [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.0, Full Modular']], ['psu'], { reviews: 9 }),
  product('components', 'Nguồn Cooler Master MWE Gold 850 V2 Full Modular', 'psu-1.jpg', 2390000, 2790000,
    [['watt', '850W'], ['cert', '80 Plus Gold'], ['form', 'ATX, Full Modular']], ['psu'], { reviews: 13 }),
  product('components', 'Nguồn ASUS ROG Strix 1000W Gold Aura Edition', 'psu-1.jpg', 4990000, 5690000,
    [['watt', '1000W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.0, Full Modular']], ['psu'], { reviews: 5 }),

  /* Tản nhiệt */
  product('components', 'Tản nhiệt khí Cooler Master Hyper 212 Black Edition', 'cooler-2.jpg', 590000, 750000,
    [['radiator', '1 tháp, 1 quạt'], ['tdp', '150W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 54 }),
  product('components', 'Tản nhiệt khí DeepCool AK400 Digital', 'cooler-2.jpg', 790000, 950000,
    [['radiator', '1 tháp, 1 quạt'], ['tdp', '220W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 27 }),
  product('components', 'Tản nhiệt khí Thermalright Peerless Assassin 120 SE ARGB', 'cooler-2.jpg', 890000, 1090000,
    [['radiator', '2 tháp, 2 quạt'], ['tdp', '260W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 63, label: 'Bán chạy' }),
  product('components', 'Tản nhiệt nước AIO DeepCool LE720 360mm ARGB', 'cooler-1.jpg', 1990000, 2390000,
    [['radiator', 'Radiator 360mm'], ['tdp', '300W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 18 }),
  product('components', 'Tản nhiệt nước AIO NZXT Kraken 240 RGB', 'cooler-3.jpg', 3290000, 3790000,
    [['radiator', 'Radiator 240mm'], ['tdp', '250W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 7 }),
  product('components', 'Tản nhiệt nước AIO Corsair iCUE LINK H150i RGB 360mm', 'cooler-1.jpg', 5490000, 6190000,
    [['radiator', 'Radiator 360mm'], ['tdp', '350W'], ['socket', 'LGA 1851 / AM5']], ['cooler'], { reviews: 6 }),

  /* Case */
  product('components', 'Case Xigmatek Gaming X 3FX (kèm 3 fan RGB)', 'case-2.jpg', 790000, 950000,
    [['form', 'Mid Tower, ATX'], ['fan', '3 fan RGB'], ['material', 'Kính cường lực']], ['case'], { reviews: 41 }),
  product('components', 'Case MSI MAG Forge 120A Airflow', 'case-2.jpg', 1090000, 1290000,
    [['form', 'Mid Tower, ATX'], ['fan', '6 fan ARGB'], ['material', 'Kính cường lực']], ['case'], { reviews: 23 }),
  product('components', 'Case Corsair 4000D Airflow', 'case-1.jpg', 2090000, 2390000,
    [['form', 'Mid Tower, ATX'], ['fan', '2 fan'], ['material', 'Kính cường lực']], ['case'], { reviews: 19 }),
  product('components', 'Case NZXT H5 Flow (2024)', 'case-1.jpg', 2190000, 2490000,
    [['form', 'Mid Tower, ATX'], ['fan', '3 fan'], ['material', 'Kính cường lực']], ['case'], { reviews: 12, label: 'Bán chạy' }),
  product('components', 'Case DeepCool CH560 Digital', 'case-3.jpg', 2290000, 2590000,
    [['form', 'Mid Tower, E-ATX'], ['fan', '4 fan ARGB'], ['material', 'Kính cường lực']], ['case'], { reviews: 8 }),
  product('components', 'Case Lian Li O11 Dynamic EVO', 'case-3.jpg', 3990000, 4490000,
    [['form', 'Mid Tower, E-ATX'], ['fan', 'Không kèm fan'], ['material', 'Nhôm + kính']], ['case'], { reviews: 10 }),

  /* PC */
  product('pc', 'PC MKPC Gaming i3 12100F - RTX 3050 6GB', 'pc-1.jpg', 11990000, 13490000,
    [['cpu', 'i3-12100F'], ['gpu', 'RTX 3050'], ['ram', '16GB DDR4'], ['ssd', '500GB NVMe']], ['gaming', 'intel'], { gift: 'Tặng lót chuột', reviews: 29 }),
  product('pc', 'PC MKPC Gaming i5 12400F - RTX 5060 8GB', 'pc-4.jpg', 17490000, 19290000,
    [['cpu', 'i5-12400F'], ['gpu', 'RTX 5060'], ['ram', '16GB DDR4'], ['ssd', '500GB NVMe']], ['gaming', 'intel'], { gift: 'Tặng bàn phím + chuột', reviews: 16, label: 'Mới' }),
  product('pc', 'PC MKPC Gaming Ryzen 7 7700 - RTX 5070 Ti 16GB', 'pc-3.jpg', 44990000, 48990000,
    [['cpu', 'Ryzen 7 7700'], ['gpu', 'RTX 5070 Ti'], ['ram', '32GB DDR5'], ['ssd', '1TB NVMe']], ['gaming', 'amd'], { reviews: 6 }),
  product('pc', 'PC MKPC Workstation i9 14900K - RTX 4080 Super', 'pc-2.jpg', 79990000, 86990000,
    [['cpu', 'i9-14900K'], ['gpu', 'RTX 4080 S'], ['ram', '64GB DDR5'], ['ssd', '2TB NVMe']], ['design', 'intel'], { reviews: 3 }),
  product('pc', 'PC MKPC Office i5 12400 - 16GB - SSD 512GB', 'pc-office.jpg', 9990000, 10990000,
    [['cpu', 'i5-12400'], ['gpu', 'UHD 730'], ['ram', '16GB DDR4'], ['ssd', '512GB NVMe']], ['office', 'intel'], { reviews: 20 }),
  product('pc', 'PC MKPC Mini Ryzen 5 8600G - 16GB DDR5', 'setup-1.jpg', 10490000, 11490000,
    [['cpu', 'Ryzen 5 8600G'], ['gpu', 'Radeon 760M'], ['ram', '16GB DDR5'], ['ssd', '512GB NVMe']], ['office', 'amd'], { reviews: 8 }),

  /* Laptop gaming */
  product('laptop-gaming', 'Laptop gaming ASUS TUF Gaming A15 FA507NUR', 'laptop-gaming-2.jpg', 21990000, 24990000,
    [['cpu', 'Ryzen 7 7435HS'], ['gpu', 'RTX 4050'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['asus'], { gift: 'Tặng balo', reviews: 23 }),
  product('laptop-gaming', 'Laptop gaming Acer Nitro V 16 ANV16-41', 'laptop-gaming-1.jpg', 27490000, 30990000,
    [['cpu', 'Ryzen 7 8845HS'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '16" 165Hz']], ['acer'], { reviews: 12, label: 'Mới' }),
  product('laptop-gaming', 'Laptop gaming MSI Thin 15 B13UC', 'laptop-gaming-4.jpg', 15990000, 18990000,
    [['cpu', 'i5-13420H'], ['gpu', 'RTX 3050'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['msi'], { reviews: 30 }),
  product('laptop-gaming', 'Laptop gaming Dell G15 5530', 'laptop-gaming-3.jpg', 29990000, 33990000,
    [['cpu', 'i7-13650HX'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" 165Hz']], ['dell'], { reviews: 10 }),
  product('laptop-gaming', 'Laptop gaming Lenovo Legion Pro 7 16IRX9H', 'laptop-gaming-2.jpg', 69990000, 74990000,
    [['cpu', 'i9-14900HX'], ['gpu', 'RTX 4080'], ['ram', '32GB'], ['ssd', '1TB'], ['screen', '16" 240Hz']], ['lenovo'], { gift: 'Tặng chuột Legion', reviews: 4 }),

  /* Laptop văn phòng */
  product('laptop', 'Laptop Apple MacBook Air 13 M3 8GB 256GB', 'laptop-office-2.jpg', 24990000, 27990000,
    [['cpu', 'Apple M3'], ['gpu', 'GPU 8 nhân'], ['ram', '8GB'], ['ssd', '256GB'], ['screen', '13.6" Liquid Retina']], ['apple'], { reviews: 25, label: 'Bán chạy' }),
  product('laptop', 'Laptop HP 15-fd0234TU', 'laptop-office-3.jpg', 13490000, 15490000,
    [['cpu', 'i5-1334U'], ['gpu', 'Iris Xe'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" FHD']], ['hp'], { reviews: 34 }),
  product('laptop', 'Laptop Lenovo IdeaPad Slim 3 15IAH8', 'laptop-office-1.jpg', 12990000, 14990000,
    [['cpu', 'i5-12450H'], ['gpu', 'UHD Graphics'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" FHD']], ['lenovo'], { reviews: 41 }),
  product('laptop', 'Laptop Dell Vostro 3530', 'laptop-office-4.jpg', 15290000, 16990000,
    [['cpu', 'i5-1335U'], ['gpu', 'Iris Xe'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" FHD 120Hz']], ['dell'], { reviews: 15 }),
  product('laptop', 'Laptop ASUS Vivobook S14 OLED S5406MA', 'laptop-office-1.jpg', 21990000, 23990000,
    [['cpu', 'Ultra 5 125H'], ['gpu', 'Intel Arc'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" 3K OLED']], ['asus'], { gift: 'Tặng túi chống sốc', reviews: 9 }),
  product('laptop', 'Laptop Acer Aspire Lite 15 AL15-51M', 'laptop-office-2.jpg', 10990000, 12490000,
    [['cpu', 'i5-1155G7'], ['gpu', 'Iris Xe'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" FHD']], ['acer'], { reviews: 47 }),

  /* Màn hình */
  product('monitor', 'Màn hình ViewSonic VA2432-H 24" IPS 100Hz', 'monitor-1.jpg', 2290000, 2690000,
    [['size', '23.8 inch'], ['panel', 'IPS'], ['hz', '100Hz'], ['res', 'Full HD']], ['viewsonic'], { reviews: 66 }),
  product('monitor', 'Màn hình LG UltraGear 32GS75Q-B 32" 2K 180Hz', 'monitor-4.jpg', 7990000, 9290000,
    [['size', '31.5 inch'], ['panel', 'IPS'], ['hz', '180Hz'], ['res', '2K QHD']], ['lg'], { reviews: 12 }),
  product('monitor', 'Màn hình ASUS ProArt PA278CV 27" 2K đồ họa', 'monitor-5.jpg', 8490000, 9490000,
    [['size', '27 inch'], ['panel', 'IPS 100% sRGB'], ['hz', '75Hz'], ['res', '2K QHD']], ['asus'], { reviews: 8 }),
  product('monitor', 'Màn hình Samsung Odyssey G6 OLED 27" 2K 360Hz', 'monitor-3.jpg', 18990000, 22990000,
    [['size', '27 inch'], ['panel', 'QD-OLED'], ['hz', '360Hz'], ['res', '2K QHD']], ['samsung'], { reviews: 5, label: 'Mới' }),
  product('monitor', 'Màn hình MSI MAG 341CQP QD-OLED 34" cong', 'monitor-2.jpg', 21990000, 24990000,
    [['size', '34 inch cong'], ['panel', 'QD-OLED'], ['hz', '175Hz'], ['res', 'UWQHD']], ['msi'], { reviews: 4 }),

  /* Bàn phím */
  product('keyboard', 'Bàn phím văn phòng Logitech K120', 'keyboard-5.jpg', 190000, 250000,
    [['switch', 'Membrane'], ['layout', 'Full size'], ['wired', 'Có dây']], ['logitech'], { reviews: 150 }),
  product('keyboard', 'Bàn phím cơ E-Dra EK387 Pro', 'keyboard-3.jpg', 690000, 890000,
    [['switch', 'Huano Red'], ['layout', 'TKL'], ['wired', 'Có dây']], ['edra'], { reviews: 72 }),
  product('keyboard', 'Bàn phím cơ Akko 3087 v2 DS Horizon', 'keyboard-2.jpg', 1190000, 1390000,
    [['switch', 'Akko V3 Pink'], ['layout', 'TKL'], ['wired', 'Có dây']], ['akko'], { reviews: 37 }),
  product('keyboard', 'Bàn phím không dây Logitech MX Keys S', 'keyboard-6.jpg', 2590000, 2990000,
    [['switch', 'Phím chiclet'], ['layout', 'Full size'], ['wireless', 'Bluetooth + Bolt']], ['logitech'], { reviews: 20 }),
  product('keyboard', 'Bàn phím Razer Huntsman V3 Pro TKL', 'keyboard-4.jpg', 5290000, 5990000,
    [['switch', 'Analog Optical'], ['layout', 'TKL'], ['wired', 'Có dây']], ['razer'], { reviews: 6 }),

  /* Chuột */
  product('mouse', 'Chuột văn phòng Logitech B100', 'mouse-3.jpg', 120000, 150000,
    [['dpi', '800 DPI'], ['wired', 'Có dây'], ['weight', '90g']], ['logitech'], { reviews: 210 }),
  product('mouse', 'Chuột gaming E-Dra EM624', 'mouse-5.jpg', 290000, 390000,
    [['dpi', '12.400 DPI'], ['wired', 'Có dây'], ['weight', '73g']], ['edra'], { reviews: 84 }),
  product('mouse', 'Chuột Razer Basilisk V3', 'mouse-4.jpg', 1190000, 1490000,
    [['dpi', '26.000 DPI'], ['wired', 'Có dây'], ['weight', '101g']], ['razer'], { reviews: 25 }),
  product('mouse', 'Chuột không dây Logitech MX Master 3S', 'mouse-1.jpg', 2290000, 2590000,
    [['dpi', '8.000 DPI'], ['wireless', 'Bluetooth + Bolt'], ['weight', '141g']], ['logitech'], { reviews: 38, label: 'Bán chạy' }),
  product('mouse', 'Lót chuột Corsair MM300 Extended', 'mouse-2.jpg', 590000, 690000,
    [['size', '930 x 300mm'], ['material', 'Vải dệt chống sờn']], ['corsair', 'mousepad'], { reviews: 30 }),

  /* Tai nghe */
  product('headset', 'Tai nghe Razer BlackShark V2 X', 'headset-1.jpg', 990000, 1290000,
    [['driver', '50mm'], ['wired', 'Có dây']], ['razer'], { reviews: 57, label: 'Bán chạy' }),
  product('headset', 'Tai nghe Logitech G435 Lightspeed', 'headset-2.jpg', 1290000, 1690000,
    [['driver', '40mm'], ['wireless', 'Không dây + Bluetooth']], ['logitech'], { reviews: 44 }),
  product('headset', 'Tai nghe Corsair HS80 RGB Wireless', 'headset-1.jpg', 2990000, 3490000,
    [['driver', '50mm'], ['wireless', 'Không dây']], ['corsair'], { reviews: 13 }),
  product('headset', 'Tai nghe Sony INZONE H5', 'headset-2.jpg', 3490000, 3990000,
    [['driver', '40mm'], ['wireless', 'Không dây']], ['sony'], { reviews: 9 }),
  product('headset', 'Tai nghe SteelSeries Arctis Nova 7 Wireless', 'headset-1.jpg', 3990000, 4590000,
    [['driver', '40mm'], ['wireless', 'Không dây + Bluetooth']], ['steelseries'], { reviews: 7 }),
  product('headset', 'Tai nghe HyperX Cloud Alpha Wireless', 'headset-2.jpg', 3990000, 4690000,
    [['driver', '50mm'], ['wireless', 'Pin 300 giờ']], ['hyperx'], { reviews: 11 }),

  /* Ghế */
  product('chair', 'Ghế gaming E-Dra Mars EGC202', 'chair-1.jpg', 2490000, 3190000,
    [['material', 'Da PU'], ['weight', 'Tải 130kg']], ['edra'], { reviews: 33 }),
  product('chair', 'Ghế công thái học Warrior WEC501 lưng lưới', 'chair-3.jpg', 2790000, 3490000,
    [['material', 'Lưới thoáng khí'], ['weight', 'Tải 120kg']], ['warrior'], { reviews: 18 }),
  product('chair', 'Ghế công thái học E-Dra Ergo có tựa đầu', 'chair-2.jpg', 3990000, 4790000,
    [['material', 'Lưới + đệm mút'], ['weight', 'Tải 150kg']], ['edra'], { reviews: 10 }),
  product('chair', 'Ghế gaming Cooler Master Caliber R3', 'chair-1.jpg', 5490000, 6290000,
    [['material', 'Da PU cao cấp'], ['weight', 'Tải 150kg']], ['coolermaster'], { reviews: 5 }),

  /* Bàn */
  product('desk', 'Bàn gaming chữ K MKPC 1m2', 'desk-2.jpg', 1290000, 1590000,
    [['size', '120 x 60cm'], ['material', 'Thép sơn tĩnh điện']], ['mkpc'], { reviews: 27 }),
  product('desk', 'Bàn gaming E-Dra EGT1460 chữ Z có LED 1m4', 'desk-1.jpg', 1990000, 2490000,
    [['size', '140 x 60cm'], ['material', 'Mặt carbon, khung thép']], ['edra'], { reviews: 19, label: 'Bán chạy' }),
  product('desk', 'Bàn gaming E-Dra EGT1680 1m6', 'desk-2.jpg', 2890000, 3390000,
    [['size', '160 x 70cm'], ['material', 'Mặt carbon, khung thép']], ['edra'], { reviews: 8 }),
  product('desk', 'Bàn nâng hạ điện Warrior WGT301 1m2', 'desk-1.jpg', 4990000, 5990000,
    [['size', '120 x 60cm'], ['material', 'Motor điện, 3 nút nhớ']], ['warrior'], { reviews: 6, label: 'Mới' }),

  /* Phần mềm bản quyền */
  product('software', 'Microsoft Windows 11 Home bản quyền (key điện tử)', 'software-1.jpg', 3190000, 3690000,
    [['license', 'Vĩnh viễn, 1 PC'], ['platform', 'Windows']], ['microsoft'], { reviews: 22 }),
  product('software', 'Microsoft Windows 11 Pro bản quyền (key điện tử)', 'software-3.jpg', 4290000, 4990000,
    [['license', 'Vĩnh viễn, 1 PC'], ['platform', 'Windows']], ['microsoft'], { reviews: 35, label: 'Bán chạy' }),
  product('software', 'Microsoft Office Home 2024 (vĩnh viễn)', 'software-2.jpg', 3490000, 3990000,
    [['license', 'Vĩnh viễn, 1 PC/Mac'], ['platform', 'Windows / macOS']], ['microsoft'], { reviews: 14 }),
  product('software', 'Microsoft 365 Personal 12 tháng', 'software-3.jpg', 1290000, 1590000,
    [['license', '12 tháng, 1 người'], ['platform', 'Windows / macOS / Mobile']], ['microsoft'], { reviews: 28 }),
  product('software', 'Phần mềm diệt virus Kaspersky Plus 1 PC 1 năm', 'software-1.jpg', 290000, 390000,
    [['license', '12 tháng, 1 thiết bị'], ['platform', 'Windows / macOS / Android']], ['kaspersky'], { reviews: 41 }),
  product('software', 'Adobe Photoshop bản quyền 12 tháng', 'software-4.jpg', 5490000, 5990000,
    [['license', '12 tháng, 1 người'], ['platform', 'Windows / macOS']], ['adobe'], { reviews: 6 }),

  /* Thiết bị mạng */
  product('network', 'Bộ phát WiFi 6 Mercusys MR70X AX1800', 'router-3.jpg', 790000, 990000,
    [['wifi', 'WiFi 6 AX1800'], ['ports', '4 cổng Gigabit']], ['mercusys'], { reviews: 52 }),
  product('network', 'Router WiFi 6 TP-Link Archer AX23 AX1800', 'router-1.jpg', 1190000, 1390000,
    [['wifi', 'WiFi 6 AX1800'], ['ports', '5 cổng Gigabit']], ['tplink'], { reviews: 38, label: 'Bán chạy' }),
  product('network', 'Router WiFi 6 ASUS RT-AX55 AX1800', 'router-3.jpg', 1690000, 1990000,
    [['wifi', 'WiFi 6 AX1800'], ['ports', '5 cổng Gigabit']], ['asus'], { reviews: 17 }),
  product('network', 'Bộ WiFi Mesh TP-Link Deco X20 (2 cục)', 'router-2.jpg', 3290000, 3790000,
    [['wifi', 'WiFi 6 Mesh AX1800'], ['ports', '2 cổng Gigabit/cục']], ['tplink'], { reviews: 12 }),
  product('network', 'Switch TP-Link TL-SG1005D 5 cổng Gigabit', 'switch-1.jpg', 290000, 350000,
    [['ports', '5 cổng Gigabit'], ['wifi', 'Không quản lý, cắm là chạy']], ['tplink'], { reviews: 64 }),
  product('network', 'Switch TP-Link TL-SG1016D 16 cổng Gigabit', 'switch-2.jpg', 1290000, 1490000,
    [['ports', '16 cổng Gigabit'], ['wifi', 'Gắn tủ rack 19"']], ['tplink'], { reviews: 9 }),
  product('network', 'Cáp mạng Cat6 UGREEN 5m bấm sẵn', 'switch-1.jpg', 150000, 190000,
    [['ports', 'Cat6, 1000Mbps'], ['size', 'Dài 5m']], ['ugreen'], { reviews: 47 }),

  /* Hàng cũ (đã kiểm tra, bảo hành tại cửa hàng) */
  product('components', 'Card màn hình ASUS Dual GeForce RTX 3060 12GB (Cũ - Like new)', 'vga-2.jpg', 4990000, 7490000,
    [['gpu', '12GB GDDR6'], ['condition', 'Like new 98%'], ['fan', '2 quạt']], ['vga', 'used'], { reviews: 14, label: 'Hàng cũ', warranty: 3 }),
  product('components', 'Card màn hình MSI GeForce RTX 3070 Ti Gaming X Trio 8GB (Cũ)', 'vga-3.jpg', 7490000, 10990000,
    [['gpu', '8GB GDDR6X'], ['condition', 'Đẹp 95%'], ['fan', '3 quạt']], ['vga', 'used'], { reviews: 6, label: 'Hàng cũ', warranty: 3 }),
  product('components', 'CPU Intel Core i5-12400F (Cũ - tray)', 'cpu-3.jpg', 1890000, 2590000,
    [['cpu', '6C / 12T'], ['condition', 'Like new 99%'], ['socket', 'LGA 1700']], ['cpu', 'used'], { reviews: 9, label: 'Hàng cũ', warranty: 3 }),
  product('pc', 'PC văn phòng Dell OptiPlex 7060 SFF i5-8500 (Cũ)', 'pc-office.jpg', 3990000, 5490000,
    [['cpu', 'i5-8500'], ['ram', '8GB DDR4'], ['ssd', '256GB SSD'], ['condition', 'Đẹp 95%']], ['office', 'used'], { reviews: 31, label: 'Hàng cũ', warranty: 6 }),
  product('laptop-gaming', 'Laptop gaming Acer Nitro 5 AN515-57 (Cũ)', 'laptop-gaming-4.jpg', 11990000, 16990000,
    [['cpu', 'i5-11400H'], ['gpu', 'RTX 3050'], ['ram', '16GB'], ['condition', 'Đẹp 95%']], ['acer', 'used', 'laptop'], { reviews: 12, label: 'Hàng cũ', warranty: 6 }),
  product('laptop', 'Laptop Dell Latitude 7490 i5-8350U (Cũ)', 'laptop-office-4.jpg', 5490000, 7990000,
    [['cpu', 'i5-8350U'], ['ram', '8GB'], ['ssd', '256GB'], ['condition', 'Đẹp 95%']], ['dell', 'used', 'laptop'], { reviews: 26, label: 'Hàng cũ', warranty: 6 }),
  product('monitor', 'Màn hình Dell P2419H 24" IPS (Cũ)', 'monitor-5.jpg', 1890000, 2990000,
    [['size', '23.8 inch'], ['panel', 'IPS'], ['res', 'Full HD'], ['condition', 'Like new 98%']], ['dell', 'used'], { reviews: 18, label: 'Hàng cũ', warranty: 3 }),
  product('mouse', 'Chuột Logitech G Pro Wireless (Cũ)', 'mouse-1.jpg', 1290000, 2190000,
    [['dpi', '25.600 DPI'], ['wireless', 'Không dây'], ['condition', 'Đẹp 95%']], ['logitech', 'used'], { reviews: 7, label: 'Hàng cũ', warranty: 1 }),
  product('chair', 'Ghế gaming Corsair T3 Rush (Cũ)', 'chair-2.jpg', 2990000, 4990000,
    [['material', 'Vải thoáng'], ['condition', 'Đẹp 90%']], ['corsair', 'used'], { reviews: 4, label: 'Hàng cũ', warranty: 1 }),

  /* ====== Bổ sung đợt 2 ====== */

  /* Phụ kiện: loa */
  product('accessory', 'Loa vi tính Microlab M-108 2.1', 'speaker-1.jpg', 490000, 590000,
    [['driver', '2.1 kênh, 11W'], ['wired', 'Jack 3.5mm']], ['speaker', 'microlab'], { reviews: 96, label: 'Bán chạy' }),
  product('accessory', 'Loa Edifier R1080BT Bluetooth', 'speaker-1.jpg', 1690000, 1990000,
    [['driver', '2.0 kênh, 24W'], ['wireless', 'Bluetooth + AUX']], ['speaker', 'edifier'], { reviews: 41 }),
  product('accessory', 'Loa kiểm âm Edifier MR4 (cặp)', 'speaker-2.jpg', 2390000, 2790000,
    [['driver', '2.0 kênh, 42W'], ['wired', 'RCA / TRS / AUX']], ['speaker', 'edifier'], { reviews: 18 }),
  product('accessory', 'Loa Creative Pebble V3 USB-C', 'speaker-1.jpg', 890000, 1090000,
    [['driver', '2.0 kênh, 16W'], ['wireless', 'USB-C + Bluetooth']], ['speaker', 'creative'], { reviews: 33 }),
  product('accessory', 'Loa Logitech Z407 Bluetooth 2.1', 'speaker-2.jpg', 2190000, 2590000,
    [['driver', '2.1 kênh, 80W'], ['wireless', 'Bluetooth + USB']], ['speaker', 'logitech'], { reviews: 22 }),
  product('accessory', 'Loa thanh Razer Leviathan V2 X', 'speaker-1.jpg', 2490000, 2990000,
    [['driver', 'Soundbar RGB'], ['wireless', 'USB-C + Bluetooth']], ['speaker', 'razer'], { reviews: 9 }),

  /* Phụ kiện: webcam */
  product('accessory', 'Webcam Logitech C270 HD 720p', 'webcam-1.jpg', 490000, 590000,
    [['res', 'HD 720p'], ['wired', 'USB']], ['webcam', 'logitech'], { reviews: 120 }),
  product('accessory', 'Webcam Logitech C922 Pro Stream Full HD', 'webcam-1.jpg', 1990000, 2390000,
    [['res', 'Full HD 1080p 30fps'], ['wired', 'USB']], ['webcam', 'logitech'], { reviews: 37, label: 'Bán chạy' }),
  product('accessory', 'Webcam Logitech StreamCam 1080p 60fps', 'webcam-1.jpg', 3490000, 3990000,
    [['res', 'Full HD 1080p 60fps'], ['wired', 'USB-C']], ['webcam', 'logitech'], { reviews: 12 }),
  product('accessory', 'Webcam Rapoo C260 Full HD', 'webcam-1.jpg', 590000, 750000,
    [['res', 'Full HD 1080p'], ['wired', 'USB']], ['webcam', 'rapoo'], { reviews: 44 }),

  /* Phụ kiện: micro */
  product('accessory', 'Micro thu âm Fifine K669B USB', 'mic-3.jpg', 590000, 750000,
    [['driver', 'Condenser cardioid'], ['wired', 'USB']], ['mic', 'fifine'], { reviews: 71 }),
  product('accessory', 'Micro HyperX QuadCast S RGB', 'mic-2.jpg', 3290000, 3790000,
    [['driver', 'Condenser 4 kiểu thu'], ['wired', 'USB-C']], ['mic', 'hyperx'], { reviews: 19, label: 'Bán chạy' }),
  product('accessory', 'Micro Rode NT-USB Mini', 'mic-1.jpg', 2690000, 2990000,
    [['driver', 'Condenser cardioid'], ['wired', 'USB-C']], ['mic', 'rode'], { reviews: 10 }),
  product('accessory', 'Micro livestream Elgato Wave:3', 'mic-2.jpg', 3990000, 4590000,
    [['driver', 'Condenser cardioid'], ['wired', 'USB-C']], ['mic', 'elgato'], { reviews: 7 }),

  /* Phụ kiện: tay cầm */
  product('accessory', 'Tay cầm Microsoft Xbox Wireless Controller', 'gamepad-1.jpg', 1390000, 1590000,
    [['wireless', 'Bluetooth / USB-C'], ['platform', 'PC / Xbox / Mobile']], ['gamepad', 'microsoft'], { reviews: 52, label: 'Bán chạy' }),
  product('accessory', 'Tay cầm Sony DualShock 4 (PS4 / PC)', 'gamepad-2.jpg', 1190000, 1390000,
    [['wireless', 'Bluetooth / Micro USB'], ['platform', 'PS4 / PC']], ['gamepad', 'sony'], { reviews: 36 }),
  product('accessory', 'Tay cầm Sony DualSense (PS5 / PC)', 'gamepad-2.jpg', 1690000, 1890000,
    [['wireless', 'Bluetooth / USB-C'], ['platform', 'PS5 / PC']], ['gamepad', 'sony'], { reviews: 28 }),
  product('accessory', 'Tay cầm 8BitDo Ultimate 2C Wireless', 'gamepad-1.jpg', 690000, 850000,
    [['wireless', '2.4GHz / USB-C'], ['platform', 'PC / Android']], ['gamepad', '8bitdo'], { reviews: 31 }),
  product('accessory', 'Tay cầm Logitech F310 có dây', 'gamepad-2.jpg', 490000, 590000,
    [['wired', 'USB'], ['platform', 'PC']], ['gamepad', 'logitech'], { reviews: 40 }),

  /* Phụ kiện: ổ di động, USB */
  product('accessory', 'Ổ cứng di động SanDisk Extreme Portable SSD 1TB', 'extssd-1.jpg', 2490000, 2990000,
    [['capacity', '1TB'], ['speed', '1050MB/s'], ['ports', 'USB-C 3.2']], ['extssd', 'sandisk'], { reviews: 26, label: 'Bán chạy' }),
  product('accessory', 'Ổ cứng di động SanDisk Extreme Portable SSD 2TB', 'extssd-1.jpg', 3990000, 4590000,
    [['capacity', '2TB'], ['speed', '1050MB/s'], ['ports', 'USB-C 3.2']], ['extssd', 'sandisk'], { reviews: 11 }),
  product('accessory', 'Ổ cứng di động Samsung Portable SSD T5 1TB', 'extssd-2.jpg', 2290000, 2690000,
    [['capacity', '1TB'], ['speed', '540MB/s'], ['ports', 'USB-C 3.1']], ['extssd', 'samsung'], { reviews: 17 }),
  product('accessory', 'Ổ cứng di động WD Elements 2TB HDD', 'hdd-3.jpg', 1890000, 2190000,
    [['capacity', '2TB'], ['rpm', 'HDD 2.5 inch'], ['ports', 'USB 3.0']], ['extssd', 'wd'], { reviews: 23 }),
  product('accessory', 'USB Kingston DataTraveler Exodia 64GB', 'extssd-1.jpg', 120000, 150000,
    [['capacity', '64GB'], ['ports', 'USB 3.2']], ['usb', 'kingston'], { reviews: 130 }),
  product('accessory', 'Thẻ nhớ SanDisk Extreme microSD 128GB', 'extssd-1.jpg', 390000, 490000,
    [['capacity', '128GB'], ['speed', '190MB/s']], ['usb', 'sandisk'], { reviews: 58 }),
  product('accessory', 'Hub chuyển USB-C UGREEN 6 in 1 (HDMI 4K)', 'switch-1.jpg', 590000, 750000,
    [['ports', 'HDMI, 3 USB, SD, PD 100W'], ['wired', 'USB-C']], ['hub', 'ugreen'], { reviews: 45 }),
  product('accessory', 'Giá treo màn hình North Bayou F80 (17-30 inch)', 'desk-1.jpg', 390000, 490000,
    [['size', '17 - 30 inch'], ['weight', 'Tải 9kg']], ['arm'], { reviews: 62 }),

  /* Laptop gaming */
  product('laptop-gaming', 'Laptop gaming Acer Nitro 5 Tiger AN515-58', 'laptop-gaming-3.jpg', 18490000, 21990000,
    [['cpu', 'i5-12450H'], ['gpu', 'RTX 3050'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['acer'], { reviews: 64, label: 'Bán chạy' }),
  product('laptop-gaming', 'Laptop gaming ASUS TUF Gaming F15 FX507ZC4', 'laptop-gaming-1.jpg', 18990000, 22490000,
    [['cpu', 'i5-12500H'], ['gpu', 'RTX 3050'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['asus'], { reviews: 48 }),
  product('laptop-gaming', 'Laptop gaming Lenovo LOQ 15ARP9 Ryzen 7', 'laptop-gaming-2.jpg', 23990000, 26990000,
    [['cpu', 'Ryzen 7 7435HS'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['lenovo'], { reviews: 27 }),
  product('laptop-gaming', 'Laptop gaming MSI Bravo 15 C7VFK', 'laptop-gaming-4.jpg', 20990000, 24990000,
    [['cpu', 'Ryzen 7 7735HS'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.6" 144Hz']], ['msi'], { reviews: 15 }),
  product('laptop-gaming', 'Laptop gaming HP Victus 16-r0127TX', 'laptop-gaming-3.jpg', 26490000, 29990000,
    [['cpu', 'i7-13700H'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '16.1" 144Hz']], ['hp'], { reviews: 13 }),
  product('laptop-gaming', 'Laptop gaming ASUS ROG Zephyrus G14 GA403UV', 'laptop-gaming-1.jpg', 46990000, 51990000,
    [['cpu', 'Ryzen 9 8945HS'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '1TB'], ['screen', '14" 3K OLED 120Hz']], ['asus'], { reviews: 6, label: 'Mới' }),
  product('laptop-gaming', 'Laptop gaming Acer Predator Helios 18 PH18-72', 'laptop-gaming-2.jpg', 64990000, 69990000,
    [['cpu', 'Ultra 9 275HX'], ['gpu', 'RTX 5070 Ti'], ['ram', '32GB'], ['ssd', '1TB'], ['screen', '18" 2.5K 240Hz']], ['acer'], { reviews: 3, label: 'Mới' }),
  product('laptop-gaming', 'Laptop gaming MSI Crosshair 16 HX D14VFKG', 'laptop-gaming-4.jpg', 32990000, 36990000,
    [['cpu', 'i7-14700HX'], ['gpu', 'RTX 4060'], ['ram', '16GB'], ['ssd', '1TB'], ['screen', '16" 165Hz']], ['msi'], { reviews: 8 }),

  /* Laptop văn phòng */
  product('laptop', 'Laptop ASUS Vivobook Go 15 E1504FA', 'laptop-office-3.jpg', 10490000, 11990000,
    [['cpu', 'Ryzen 5 7520U'], ['gpu', 'Radeon 610M'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" FHD']], ['asus'], { reviews: 58, label: 'Bán chạy' }),
  product('laptop', 'Laptop Lenovo ThinkPad X1 Carbon Gen 12', 'laptop-office-4.jpg', 45990000, 49990000,
    [['cpu', 'Ultra 7 155U'], ['gpu', 'Intel Graphics'], ['ram', '32GB'], ['ssd', '1TB'], ['screen', '14" 2.8K OLED']], ['lenovo'], { reviews: 4 }),
  product('laptop', 'Laptop Dell XPS 13 9340', 'laptop-office-1.jpg', 39990000, 43990000,
    [['cpu', 'Ultra 7 155H'], ['gpu', 'Intel Arc'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '13.4" FHD+ 120Hz']], ['dell'], { reviews: 5 }),
  product('laptop', 'Laptop HP Envy x360 14-fc0090TU', 'laptop-office-2.jpg', 25990000, 28990000,
    [['cpu', 'Ultra 5 125U'], ['gpu', 'Intel Graphics'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" 2.8K OLED cảm ứng']], ['hp'], { reviews: 7 }),
  product('laptop', 'Laptop Acer Swift 3 SF314-512', 'laptop-office-3.jpg', 16490000, 18990000,
    [['cpu', 'i5-1240P'], ['gpu', 'Iris Xe'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" 2K']], ['acer'], { reviews: 19 }),
  product('laptop', 'Laptop MSI Modern 15 B13M', 'laptop-office-4.jpg', 11990000, 13990000,
    [['cpu', 'i5-1335U'], ['gpu', 'Iris Xe'], ['ram', '8GB'], ['ssd', '512GB'], ['screen', '15.6" FHD']], ['msi'], { reviews: 26 }),
  product('laptop', 'Laptop Apple MacBook Air 15 M3 16GB 512GB', 'laptop-office-2.jpg', 37990000, 40990000,
    [['cpu', 'Apple M3'], ['gpu', 'GPU 10 nhân'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '15.3" Liquid Retina']], ['apple'], { reviews: 9 }),
  product('laptop', 'Laptop Lenovo IdeaPad Slim 5 Light 14ABR8', 'laptop-office-1.jpg', 14990000, 16990000,
    [['cpu', 'Ryzen 7 7730U'], ['gpu', 'Radeon Graphics'], ['ram', '16GB'], ['ssd', '512GB'], ['screen', '14" FHD']], ['lenovo'], { reviews: 21 }),

  /* PC */
  product('pc', 'PC MKPC Gaming Ryzen 5 7500F - RTX 5060 Ti 16GB', 'pc-4.jpg', 25990000, 28490000,
    [['cpu', 'Ryzen 5 7500F'], ['gpu', 'RTX 5060 Ti'], ['ram', '32GB DDR5'], ['ssd', '1TB NVMe']], ['gaming', 'amd'], { gift: 'Tặng bàn phím + chuột', reviews: 10, label: 'Mới' }),
  product('pc', 'PC MKPC Gaming i5 14600KF - RTX 5070 12GB', 'pc-3.jpg', 37990000, 41490000,
    [['cpu', 'i5-14600KF'], ['gpu', 'RTX 5070'], ['ram', '32GB DDR5'], ['ssd', '1TB NVMe']], ['gaming', 'intel'], { reviews: 7 }),
  product('pc', 'PC MKPC Streaming Ryzen 7 9700X - RTX 4070 Super', 'setup-3.jpg', 46990000, 50990000,
    [['cpu', 'Ryzen 7 9700X'], ['gpu', 'RTX 4070 S'], ['ram', '32GB DDR5'], ['ssd', '2TB NVMe']], ['gaming', 'amd', 'design'], { reviews: 4 }),
  product('pc', 'PC MKPC Esport i3 13100F - GTX 1650', 'pc-1.jpg', 9490000, 10490000,
    [['cpu', 'i3-13100F'], ['gpu', 'GTX 1650'], ['ram', '16GB DDR4'], ['ssd', '256GB NVMe']], ['gaming', 'intel'], { reviews: 35 }),
  product('pc', 'PC MKPC Đồ họa Ryzen 9 9900X - RTX 4070 Ti Super', 'pc-2.jpg', 58990000, 63990000,
    [['cpu', 'Ryzen 9 9900X'], ['gpu', 'RTX 4070 Ti S'], ['ram', '64GB DDR5'], ['ssd', '2TB NVMe']], ['design', 'amd'], { reviews: 3 }),
  product('pc', 'PC MKPC Office i3 14100 - 8GB - SSD 256GB', 'pc-office.jpg', 6990000, 7790000,
    [['cpu', 'i3-14100'], ['gpu', 'UHD 730'], ['ram', '8GB DDR4'], ['ssd', '256GB NVMe']], ['office', 'intel'], { reviews: 24 }),

  /* Màn hình */
  product('monitor', 'Màn hình AOC 24G4 24" IPS 180Hz', 'monitor-1.jpg', 2990000, 3490000,
    [['size', '23.8 inch'], ['panel', 'Fast IPS'], ['hz', '180Hz'], ['res', 'Full HD']], ['aoc'], { reviews: 49, label: 'Bán chạy' }),
  product('monitor', 'Màn hình GIGABYTE GS27Q 27" 2K 170Hz', 'monitor-4.jpg', 5490000, 6290000,
    [['size', '27 inch'], ['panel', 'SS IPS'], ['hz', '170Hz'], ['res', '2K QHD']], ['gigabyte'], { reviews: 22 }),
  product('monitor', 'Màn hình Samsung Odyssey G4 25" 240Hz', 'monitor-3.jpg', 4790000, 5590000,
    [['size', '25 inch'], ['panel', 'IPS'], ['hz', '240Hz'], ['res', 'Full HD']], ['samsung'], { reviews: 16 }),
  product('monitor', 'Màn hình Dell S2725DS 27" 2K 100Hz', 'monitor-5.jpg', 5990000, 6790000,
    [['size', '27 inch'], ['panel', 'IPS'], ['hz', '100Hz'], ['res', '2K QHD']], ['dell'], { reviews: 10 }),
  product('monitor', 'Màn hình Philips 241V8 24" IPS 100Hz', 'monitor-2.jpg', 1990000, 2390000,
    [['size', '23.8 inch'], ['panel', 'IPS'], ['hz', '100Hz'], ['res', 'Full HD']], ['philips'], { reviews: 54 }),
  product('monitor', 'Màn hình LG 27UP850N-W 27" 4K USB-C', 'monitor-3.jpg', 9490000, 10990000,
    [['size', '27 inch'], ['panel', 'IPS HDR400'], ['hz', '60Hz'], ['res', '4K UHD']], ['lg'], { reviews: 6 }),

  /* Bàn phím */
  product('keyboard', 'Bàn phím cơ Keychron K2 Pro', 'keyboard-2.jpg', 2490000, 2790000,
    [['switch', 'K Pro Red'], ['layout', '75%'], ['wireless', 'Bluetooth + có dây']], ['keychron'], { reviews: 21 }),
  product('keyboard', 'Bàn phím cơ Dareu EK87 v2', 'keyboard-3.jpg', 490000, 650000,
    [['switch', 'Dareu Red'], ['layout', 'TKL'], ['wired', 'Có dây']], ['dareu'], { reviews: 97, label: 'Bán chạy' }),
  product('keyboard', 'Bàn phím Logitech G213 Prodigy RGB', 'keyboard-5.jpg', 990000, 1290000,
    [['switch', 'Mech-Dome'], ['layout', 'Full size'], ['wired', 'Có dây']], ['logitech'], { reviews: 43 }),
  product('keyboard', 'Bàn phím cơ AULA F99 Pro 3 mode', 'keyboard-1.jpg', 1190000, 1390000,
    [['switch', 'Graywood V4'], ['layout', '96%'], ['wireless', '3 mode']], ['aula'], { reviews: 38 }),
  product('keyboard', 'Bàn phím Corsair K65 Plus Wireless', 'keyboard-4.jpg', 3490000, 3990000,
    [['switch', 'MLX Red'], ['layout', '75%'], ['wireless', '3 mode']], ['corsair'], { reviews: 8 }),
  product('keyboard', 'Bàn phím cơ Leopold FC900R PD', 'keyboard-6.jpg', 3290000, 3590000,
    [['switch', 'Cherry MX Brown'], ['layout', 'Full size'], ['wired', 'Có dây']], ['leopold'], { reviews: 5 }),

  /* Chuột */
  product('mouse', 'Chuột gaming Logitech G102 Lightsync', 'mouse-4.jpg', 390000, 490000,
    [['dpi', '8.000 DPI'], ['wired', 'Có dây'], ['weight', '85g']], ['logitech'], { reviews: 230, label: 'Bán chạy' }),
  product('mouse', 'Chuột gaming Razer Cobra Pro', 'mouse-2.jpg', 2490000, 2890000,
    [['dpi', '30.000 DPI'], ['wireless', 'Không dây + Bluetooth'], ['weight', '77g']], ['razer'], { reviews: 9 }),
  product('mouse', 'Chuột gaming Pulsar X2V2 Mini Wireless', 'mouse-5.jpg', 2190000, 2490000,
    [['dpi', '26.000 DPI'], ['wireless', 'Không dây'], ['weight', '52g']], ['pulsar'], { reviews: 11 }),
  product('mouse', 'Chuột gaming VGN Dragonfly F1 Pro Max', 'mouse-3.jpg', 990000, 1190000,
    [['dpi', '26.000 DPI'], ['wireless', 'Không dây'], ['weight', '49g']], ['vgn'], { reviews: 27 }),
  product('mouse', 'Chuột văn phòng Logitech M331 Silent Plus', 'mouse-1.jpg', 290000, 350000,
    [['dpi', '1.000 DPI'], ['wireless', 'Không dây'], ['weight', '91g']], ['logitech'], { reviews: 88 }),
  product('mouse', 'Lót chuột Razer Gigantus V2 XXL', 'mouse-2.jpg', 790000, 950000,
    [['size', '940 x 410mm'], ['material', 'Vải mềm, đế cao su']], ['razer', 'mousepad'], { reviews: 20 }),

  /* Tai nghe */
  product('headset', 'Tai nghe HyperX Cloud Stinger 2 Core', 'headset-2.jpg', 690000, 890000,
    [['driver', '40mm'], ['wired', 'Có dây']], ['hyperx'], { reviews: 76 }),
  product('headset', 'Tai nghe Logitech G Pro X 2 Lightspeed', 'headset-1.jpg', 5490000, 6290000,
    [['driver', '50mm Graphene'], ['wireless', 'Không dây + Bluetooth']], ['logitech'], { reviews: 6 }),
  product('headset', 'Tai nghe Razer Kraken V4 X', 'headset-2.jpg', 1490000, 1790000,
    [['driver', '40mm'], ['wired', 'USB, RGB']], ['razer'], { reviews: 14 }),
  product('headset', 'Tai nghe Corsair Void Wireless v2', 'headset-1.jpg', 2490000, 2890000,
    [['driver', '50mm'], ['wireless', 'Không dây + Bluetooth']], ['corsair'], { reviews: 10 }),
  product('headset', 'Tai nghe Sony INZONE H9', 'headset-2.jpg', 5990000, 6990000,
    [['driver', '40mm, chống ồn ANC'], ['wireless', 'Không dây + Bluetooth']], ['sony'], { reviews: 4 }),

  /* Linh kiện: VGA */
  product('components', 'Card màn hình Palit GeForce RTX 4060 Dual 8GB', 'vga-1.jpg', 7690000, 8490000,
    [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], { reviews: 33 }),
  product('components', 'Card màn hình INNO3D GeForce RTX 5060 Ti Twin X2 16GB', 'vga-3.jpg', 12990000, 13990000,
    [['gpu', '16GB GDDR7'], ['fan', '2 quạt'], ['power', '600W']], ['vga'], { reviews: 9, label: 'Mới' }),
  product('components', 'Card màn hình GIGABYTE GeForce RTX 5070 WINDFORCE OC 12GB', 'vga-2.jpg', 17490000, 18990000,
    [['gpu', '12GB GDDR7'], ['fan', '3 quạt'], ['power', '650W']], ['vga'], { reviews: 12 }),
  product('components', 'Card màn hình ASUS ROG Astral GeForce RTX 5090 32GB', 'vga-3.jpg', 89990000, 95990000,
    [['gpu', '32GB GDDR7'], ['fan', '4 quạt'], ['power', '1000W']], ['vga'], { reviews: 2 }),
  product('components', 'Card màn hình Sapphire PULSE Radeon RX 7800 XT 16GB', 'vga-1.jpg', 14490000, 15990000,
    [['gpu', '16GB GDDR6'], ['fan', '2 quạt'], ['power', '700W']], ['vga', 'amd'], { reviews: 8 }),

  /* Linh kiện: CPU */
  product('components', 'CPU Intel Core i5-14600KF (up to 5.3GHz, 14 nhân)', 'cpu-2.jpg', 6290000, 6990000,
    [['cpu', '14C / 20T'], ['speed', '5.3GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], { reviews: 18 }),
  product('components', 'CPU Intel Core i9-14900K (up to 6.0GHz, 24 nhân)', 'cpu-1.jpg', 13990000, 15490000,
    [['cpu', '24C / 32T'], ['speed', '6.0GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], { reviews: 7 }),
  product('components', 'CPU AMD Ryzen 7 9700X (up to 5.5GHz, 8 nhân)', 'cpu-3.jpg', 8490000, 9290000,
    [['cpu', '8C / 16T'], ['speed', '5.5GHz'], ['socket', 'AM5']], ['cpu', 'amd'], { reviews: 9 }),
  product('components', 'CPU AMD Ryzen 5 8600G (up to 5.0GHz, 6 nhân, có iGPU)', 'cpu-2.jpg', 5190000, 5790000,
    [['cpu', '6C / 12T'], ['speed', '5.0GHz'], ['socket', 'AM5']], ['cpu', 'amd'], { reviews: 15 }),

  /* Linh kiện: Mainboard */
  product('components', 'Mainboard GIGABYTE H610M S2H DDR4', 'mainboard-2.jpg', 1690000, 1990000,
    [['chipset', 'Intel H610'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], { reviews: 52, label: 'Bán chạy' }),
  product('components', 'Mainboard MSI MAG B650 TOMAHAWK WIFI', 'mainboard-4.jpg', 5490000, 5990000,
    [['chipset', 'AMD B650'], ['socket', 'AM5'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], { reviews: 14 }),
  product('components', 'Mainboard ASUS PRIME Z890-P WIFI', 'mainboard-1.jpg', 6990000, 7790000,
    [['chipset', 'Intel Z890'], ['socket', 'LGA 1851'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], { reviews: 4, label: 'Mới' }),
  product('components', 'Mainboard ASRock A620M-HDV/M.2+', 'mainboard-3.jpg', 1990000, 2290000,
    [['chipset', 'AMD A620'], ['socket', 'AM5'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], { reviews: 21 }),

  /* Linh kiện: RAM */
  product('components', 'RAM TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5 6000MHz', 'ram-1.jpg', 2690000, 3090000,
    [['ram', '32GB DDR5'], ['speed', '6000MHz']], ['ram'], { reviews: 17 }),
  product('components', 'RAM ADATA XPG Lancer 16GB DDR5 5200MHz', 'ram-2.jpg', 1090000, 1290000,
    [['ram', '16GB DDR5'], ['speed', '5200MHz']], ['ram'], { reviews: 23 }),
  product('components', 'RAM Corsair Vengeance RGB 64GB (2x32GB) DDR5 6000MHz', 'ram-1.jpg', 5490000, 6190000,
    [['ram', '64GB DDR5'], ['speed', '6000MHz']], ['ram'], { reviews: 5 }),
  product('components', 'RAM Laptop Kingston 8GB DDR4 3200MHz SODIMM', 'ram-2.jpg', 490000, 590000,
    [['ram', '8GB DDR4'], ['speed', '3200MHz']], ['ram', 'laptop-ram'], { reviews: 66 }),

  /* Linh kiện: SSD */
  product('components', 'SSD Samsung 990 EVO Plus 2TB M.2 NVMe', 'ssd-1.jpg', 3690000, 4190000,
    [['ssd', '2TB NVMe'], ['speed', '7250MB/s']], ['ssd'], { reviews: 13 }),
  product('components', 'SSD Kingston A400 240GB 2.5" SATA', 'ssd-1.jpg', 490000, 590000,
    [['ssd', '240GB SATA'], ['speed', '500MB/s']], ['ssd'], { reviews: 140, label: 'Bán chạy' }),
  product('components', 'SSD Crucial P3 Plus 500GB M.2 NVMe', 'ssd-1.jpg', 990000, 1190000,
    [['ssd', '500GB NVMe'], ['speed', '4700MB/s']], ['ssd'], { reviews: 31 }),
  product('components', 'SSD WD Black SN850X 2TB M.2 NVMe', 'ssd-1.jpg', 4290000, 4890000,
    [['ssd', '2TB NVMe'], ['speed', '7300MB/s']], ['ssd'], { reviews: 9 }),

  /* Linh kiện: HDD, Nguồn, Tản, Case */
  product('components', 'Ổ cứng HDD Seagate SkyHawk 2TB chuyên camera', 'hdd-2.jpg', 1690000, 1890000,
    [['capacity', '2TB'], ['rpm', '5400rpm'], ['form', 'Chuyên camera']], ['hdd'], { reviews: 19 }),
  product('components', 'Ổ cứng HDD WD Red Plus 8TB NAS', 'hdd-1.jpg', 5990000, 6690000,
    [['capacity', '8TB'], ['rpm', '5640rpm'], ['form', 'Chuyên NAS']], ['hdd'], { reviews: 4 }),
  product('components', 'Nguồn Super Flower Leadex III Gold 850W', 'psu-1.jpg', 2690000, 2990000,
    [['watt', '850W'], ['cert', '80 Plus Gold'], ['form', 'ATX, Full Modular']], ['psu'], { reviews: 11 }),
  product('components', 'Nguồn MSI MAG A750GL PCIE5 750W Gold', 'psu-1.jpg', 2190000, 2490000,
    [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.0, Full Modular']], ['psu'], { reviews: 16 }),
  product('components', 'Nguồn Corsair RM1000e 1000W Gold', 'psu-1.jpg', 3990000, 4490000,
    [['watt', '1000W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.1, Full Modular']], ['psu'], { reviews: 6 }),
  product('components', 'Tản nhiệt khí ID-COOLING SE-224-XTS', 'cooler-2.jpg', 390000, 490000,
    [['radiator', '1 tháp, 1 quạt'], ['tdp', '220W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 47 }),
  product('components', 'Tản nhiệt nước AIO ARCTIC Liquid Freezer III 360', 'cooler-1.jpg', 2790000, 3190000,
    [['radiator', 'Radiator 360mm'], ['tdp', '350W'], ['socket', 'LGA 1851 / AM5']], ['cooler'], { reviews: 12 }),
  product('components', 'Tản nhiệt nước AIO MSI MAG CoreLiquid A13 240', 'cooler-3.jpg', 1690000, 1990000,
    [['radiator', 'Radiator 240mm'], ['tdp', '250W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], { reviews: 9 }),
  product('components', 'Case Montech AIR 903 MAX', 'case-1.jpg', 1990000, 2290000,
    [['form', 'Mid Tower, E-ATX'], ['fan', '4 fan 140mm'], ['material', 'Kính cường lực']], ['case'], { reviews: 14 }),
  product('components', 'Case Jonsbo D41 Mesh (mATX)', 'case-3.jpg', 1690000, 1890000,
    [['form', 'Mid Tower, ATX'], ['fan', '3 fan ARGB'], ['material', 'Kính + lưới thép']], ['case'], { reviews: 8 }),
  product('components', 'Case Xigmatek Aquarius Plus (bể cá, 7 fan)', 'case-3.jpg', 1490000, 1790000,
    [['form', 'Mid Tower, ATX'], ['fan', '7 fan ARGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], { reviews: 37, label: 'Bán chạy' }),
  product('components', 'Case Cooler Master MasterBox Q300L (mATX)', 'case-2.jpg', 990000, 1190000,
    [['form', 'Mini Tower, Micro-ATX'], ['fan', '1 fan'], ['material', 'Mica trong suốt']], ['case'], { reviews: 25 }),

  /* Bàn ghế */
  product('chair', 'Ghế gaming E-Dra Jupiter EGC206 ngả 180°', 'chair-3.jpg', 3290000, 3990000,
    [['material', 'Da PU, kê chân'], ['weight', 'Tải 150kg']], ['edra'], { reviews: 21 }),
  product('chair', 'Ghế công thái học Warrior WEC503 Pro', 'chair-2.jpg', 4490000, 5290000,
    [['material', 'Lưới Hàn Quốc, tựa đầu 3D'], ['weight', 'Tải 136kg']], ['warrior'], { reviews: 9 }),
  product('chair', 'Ghế gaming Cougar Armor One', 'chair-1.jpg', 3590000, 4190000,
    [['material', 'Da PVC thoáng khí'], ['weight', 'Tải 120kg']], ['cougar'], { reviews: 12 }),
  product('desk', 'Bàn gaming chữ L MKPC 1m4 góc phòng', 'desk-2.jpg', 2490000, 2990000,
    [['size', '140 x 120cm'], ['material', 'Mặt gỗ MDF, khung thép']], ['mkpc'], { reviews: 11 }),
  product('desk', 'Bàn nâng hạ điện E-Dra EGD1460 2 motor', 'desk-1.jpg', 6990000, 7990000,
    [['size', '140 x 70cm'], ['material', '2 motor, 4 nút nhớ']], ['edra'], { reviews: 4 }),

  /* Thiết bị mạng */
  product('network', 'Router WiFi 7 TP-Link Archer BE230 BE3600', 'router-1.jpg', 2490000, 2890000,
    [['wifi', 'WiFi 7 BE3600'], ['ports', '4 cổng 2.5G + Gigabit']], ['tplink'], { reviews: 8, label: 'Mới' }),
  product('network', 'Router WiFi 6 ASUS TUF Gaming AX4200', 'router-3.jpg', 2990000, 3490000,
    [['wifi', 'WiFi 6 AX4200'], ['ports', 'Cổng 2.5G gaming']], ['asus'], { reviews: 11 }),
  product('network', 'Bộ phát WiFi Tenda AC10 AC1200', 'router-3.jpg', 490000, 590000,
    [['wifi', 'WiFi 5 AC1200'], ['ports', '4 cổng Gigabit']], ['tenda'], { reviews: 59 }),
  product('network', 'Card WiFi PCIe TP-Link Archer TX55E AX3000', 'switch-2.jpg', 890000, 1090000,
    [['wifi', 'WiFi 6 AX3000 + Bluetooth 5.2'], ['ports', 'PCIe x1']], ['tplink'], { reviews: 24 }),
  product('network', 'USB WiFi TP-Link Archer T3U AC1300', 'switch-1.jpg', 290000, 350000,
    [['wifi', 'WiFi 5 AC1300'], ['ports', 'USB 3.0']], ['tplink'], { reviews: 81 }),

  /* Phần mềm */
  product('software', 'Phần mềm diệt virus Bitdefender Total Security 1 năm', 'software-1.jpg', 590000, 790000,
    [['license', '12 tháng, 5 thiết bị'], ['platform', 'Windows / macOS / Android / iOS']], ['bitdefender'], { reviews: 17 }),
  product('software', 'Phần mềm diệt virus ESET Internet Security 1 năm', 'software-3.jpg', 390000, 490000,
    [['license', '12 tháng, 1 thiết bị'], ['platform', 'Windows / macOS / Android']], ['eset'], { reviews: 23 }),
  product('software', 'Microsoft Office Home & Business 2024', 'software-2.jpg', 6490000, 6990000,
    [['license', 'Vĩnh viễn, 1 PC/Mac, dùng doanh nghiệp'], ['platform', 'Windows / macOS']], ['microsoft'], { reviews: 6 }),
  product('software', 'Microsoft 365 Family 12 tháng (6 người)', 'software-4.jpg', 1890000, 2290000,
    [['license', '12 tháng, 6 người'], ['platform', 'Windows / macOS / Mobile']], ['microsoft'], { reviews: 14 }),

  /* Hàng cũ */
  product('components', 'Card màn hình GIGABYTE GeForce GTX 1660 Super 6GB (Cũ)', 'vga-1.jpg', 2290000, 3990000,
    [['gpu', '6GB GDDR6'], ['condition', 'Đẹp 95%'], ['fan', '2 quạt']], ['vga', 'used'], { reviews: 22, label: 'Hàng cũ', warranty: 3 }),
  product('components', 'Card màn hình ASUS TUF Gaming RTX 3080 10GB (Cũ)', 'vga-2.jpg', 9490000, 14990000,
    [['gpu', '10GB GDDR6X'], ['condition', 'Đẹp 95%'], ['fan', '3 quạt']], ['vga', 'used'], { reviews: 5, label: 'Hàng cũ', warranty: 3 }),
  product('components', 'CPU AMD Ryzen 5 5600X (Cũ)', 'cpu-1.jpg', 1990000, 2890000,
    [['cpu', '6C / 12T'], ['condition', 'Like new 99%'], ['socket', 'AM4']], ['cpu', 'used'], { reviews: 13, label: 'Hàng cũ', warranty: 3 }),
  product('components', 'Mainboard ASUS TUF Gaming B550M-PLUS (Cũ)', 'mainboard-1.jpg', 1690000, 2790000,
    [['chipset', 'AMD B550'], ['socket', 'AM4'], ['condition', 'Đẹp 95%']], ['mainboard', 'used'], { reviews: 8, label: 'Hàng cũ', warranty: 3 }),
  product('laptop-gaming', 'Laptop gaming ASUS TUF Gaming F15 FX506HC (Cũ)', 'laptop-gaming-1.jpg', 12990000, 18990000,
    [['cpu', 'i5-11400H'], ['gpu', 'RTX 3050'], ['ram', '16GB'], ['condition', 'Đẹp 95%']], ['asus', 'used', 'laptop'], { reviews: 10, label: 'Hàng cũ', warranty: 6 }),
  product('laptop', 'Laptop Lenovo ThinkPad T14 Gen 2 i5-1135G7 (Cũ)', 'laptop-office-4.jpg', 7990000, 11990000,
    [['cpu', 'i5-1135G7'], ['ram', '16GB'], ['ssd', '512GB'], ['condition', 'Đẹp 95%']], ['lenovo', 'used', 'laptop'], { reviews: 19, label: 'Hàng cũ', warranty: 6 }),
  product('monitor', 'Màn hình LG 27GL850 27" 2K 144Hz (Cũ)', 'monitor-4.jpg', 3990000, 6490000,
    [['size', '27 inch'], ['panel', 'Nano IPS'], ['hz', '144Hz'], ['condition', 'Đẹp 95%']], ['lg', 'used'], { reviews: 7, label: 'Hàng cũ', warranty: 3 }),
  product('keyboard', 'Bàn phím cơ Akko 3068B Plus (Cũ)', 'keyboard-2.jpg', 790000, 1490000,
    [['switch', 'Akko CS Jelly'], ['layout', '65%'], ['condition', 'Like new 98%']], ['akko', 'used'], { reviews: 6, label: 'Hàng cũ', warranty: 1 }),
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
  { name: 'Laptop gaming', img: 'laptop-gaming-3.jpg', href: 'category.html?cat=laptop-gaming' },
  { name: 'PC Gaming', img: 'pc-1.jpg', href: 'category.html?cat=pc' },
  { name: 'Màn hình', img: 'monitor-2.jpg', href: 'category.html?cat=monitor' },
  { name: 'CPU', img: 'cpu-1.jpg', href: 'category.html?cat=cpu' },
  { name: 'Mainboard', img: 'mainboard-1.jpg', href: 'category.html?cat=mainboard' },
  { name: 'VGA', img: 'vga-1.jpg', href: 'category.html?cat=vga' },
  { name: 'RAM', img: 'ram-2.jpg', href: 'category.html?cat=ram' },
  { name: 'Ổ cứng', img: 'ssd-1.jpg', href: 'category.html?cat=storage' },
  { name: 'Nguồn', img: 'psu-1.jpg', href: 'category.html?cat=psu' },
  { name: 'Tản nhiệt', img: 'cooler-2.jpg', href: 'category.html?cat=cooler' },
  { name: 'Case', img: 'case-1.jpg', href: 'category.html?cat=case' },
  { name: 'Bàn phím', img: 'keyboard-3.jpg', href: 'category.html?cat=keyboard' },
  { name: 'Chuột', img: 'mouse-4.jpg', href: 'category.html?cat=mouse' },
  { name: 'Tai nghe', img: 'headset-1.jpg', href: 'category.html?cat=headset' },
  { name: 'Bàn ghế', img: 'chair-3.jpg', href: 'category.html?cat=furniture' },
  { name: 'Phụ kiện', img: 'gamepad-1.jpg', href: 'category.html?cat=accessory' },
  { name: 'Thiết bị mạng', img: 'router-1.jpg', href: 'category.html?cat=network' },
  { name: 'Phần mềm', img: 'software-1.jpg', href: 'category.html?cat=software' },
  { name: 'PC văn phòng', img: 'pc-office.jpg', href: 'category.html?cat=pc-office' },
  { name: 'Hàng cũ', img: 'laptop-gaming-4.jpg', href: 'category.html?cat=used' },
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
      { theme: 'red', tag: 'Góc gaming', title: 'Deal bàn ghế <em>thả ga lựa chọn</em>', img: 'chair-2.jpg', href: 'category.html?cat=furniture' },
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
    tabs: [['all', 'Tất cả'], ['vga', 'VGA'], ['cpu', 'CPU'], ['mainboard', 'Mainboard'], ['ram', 'RAM'], ['ssd', 'SSD'], ['hdd', 'HDD'], ['psu', 'Nguồn'], ['cooler', 'Tản nhiệt'], ['case', 'Case']] },
  { type: 'products', id: 'headset', title: 'Tai nghe gaming', tag: { icon: 'shield-check', text: 'Bảo hành 12 tháng' },
    tabs: [['all', 'Tất cả'], ['hyperx', 'HyperX'], ['logitech', 'Logitech'], ['razer', 'Razer'], ['corsair', 'Corsair']] },
  { type: 'products', id: 'accessory', title: 'Phụ kiện máy tính', tag: { icon: 'gift', text: 'Giá tốt mỗi ngày' },
    tabs: [['all', 'Tất cả'], ['speaker', 'Loa'], ['webcam', 'Webcam'], ['mic', 'Micro'], ['gamepad', 'Tay cầm'], ['extssd', 'Ổ di động']] },
  { type: 'products', id: 'furniture', rule: 'furniture', title: 'Bàn ghế gaming', tag: { icon: 'truck', text: 'Giao & lắp tận nơi' },
    tabs: [['all', 'Tất cả'], ['edra', 'E-Dra'], ['warrior', 'Warrior'], ['corsair', 'Corsair'], ['mkpc', 'MKPC']] },
  { type: 'products', id: 'network', title: 'Thiết bị mạng', tag: { icon: 'wifi', text: 'Hỗ trợ cài đặt miễn phí' },
    tabs: [['all', 'Tất cả'], ['tplink', 'TP-Link'], ['asus', 'ASUS'], ['mercusys', 'Mercusys']] },
  { type: 'products', id: 'software', title: 'Phần mềm bản quyền', tag: { icon: 'key-round', text: 'Giao key qua email' },
    tabs: [['all', 'Tất cả'], ['microsoft', 'Microsoft'], ['kaspersky', 'Kaspersky'], ['adobe', 'Adobe']] },
  { type: 'products', id: 'used', rule: 'used', title: 'Hàng cũ giá tốt', tag: { icon: 'badge-check', text: 'Kiểm tra kỹ, có bảo hành' },
    tabs: [['all', 'Tất cả'], ['vga', 'VGA'], ['cpu', 'CPU'], ['laptop', 'Laptop'], ['office', 'PC']] },
];


