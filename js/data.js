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
  { text: 'Thu cũ đổi mới', href: 'thu-cu-doi-moi.html' },
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

const BRANDS = ['MKPC', 'ASUS', 'Acer', 'MSI', 'Lenovo', 'Dell', 'HP', 'Apple', 'Logitech', 'Razer', 'Corsair', 'Akko', 'AULA', 'LG', 'Samsung', 'ViewSonic', 'Kingston', 'Crucial', 'G.Skill', 'Lexar', 'WD', 'Seagate', 'Toshiba', 'Intel', 'AMD', 'GIGABYTE', 'ASRock', 'ZOTAC', 'Cooler Master', 'DeepCool', 'Thermalright', 'NZXT', 'Lian Li', 'Xigmatek', 'be quiet', 'HyperX', 'SteelSeries', 'Sony', 'E-Dra', 'Warrior', 'Microsoft', 'Kaspersky', 'Adobe', 'TP-Link', 'Mercusys', 'UGREEN', 'Tenda', 'Bitdefender', 'ESET', 'AOC', 'Philips', 'Keychron', 'Dareu', 'Leopold', 'Pulsar', 'VGN', 'Palit', 'INNO3D', 'Sapphire', 'TeamGroup', 'ADATA', 'Super Flower', 'ID-COOLING', 'ARCTIC', 'Montech', 'Jonsbo', 'Cougar', 'Microlab', 'Edifier', 'Creative', 'Rapoo', 'Fifine', 'Rode', 'Elgato', '8BitDo', 'SanDisk', 'North Bayou', 'BenQ', 'Xiaomi', 'Glorious', 'Fuhlen', 'Ajazz', 'GALAX', 'Colorful', 'PowerColor', 'Patriot', 'Thermaltake', 'Seasonic', 'Noctua', 'Fractal Design', 'Fantech', 'XFX'];

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
      { title: 'Thương hiệu', links: ['ASUS', 'Acer', 'Lenovo', 'Dell', 'HP', 'MSI', 'Apple MacBook'] },
      { title: 'Giá bán', links: ['Dưới 12 triệu', '12 - 15 triệu', '15 - 20 triệu', '20 - 25 triệu', 'Trên 25 triệu'] },
      { title: 'Nhu cầu', links: ['Văn phòng', 'Sinh viên', 'Mỏng nhẹ', 'Doanh nhân', 'Đồ họa - Kỹ thuật'] },
      { title: 'CPU', links: ['Intel Core i5', 'Intel Core i7', 'Intel Core Ultra', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M3'] },
      { title: 'Màn hình', links: ['OLED', '14 inch', '15.6 inch', '2K - 3K', 'Cảm ứng'] },
    ],
  },
  {
    id: 'laptop-gaming', name: 'Laptop Gaming', icon: 'gamepad-2',
    groups: [
      { title: 'Thương hiệu', links: ['ASUS ROG', 'ASUS TUF', 'Acer Nitro', 'Acer Predator', 'Lenovo LOQ', 'Lenovo Legion', 'MSI', 'Dell G15', 'HP Victus'] },
      { title: 'Giá bán', links: ['Dưới 20 triệu', '20 - 25 triệu', '25 - 35 triệu', '35 - 50 triệu', 'Trên 50 triệu'] },
      { title: 'Card đồ họa', links: ['RTX 3050', 'RTX 4050', 'RTX 4060', 'RTX 4070', 'RTX 4080', 'RTX 5070 Ti'] },
      { title: 'CPU', links: ['Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'AMD Ryzen 7', 'AMD Ryzen 9'] },
      { title: 'Màn hình', links: ['144Hz', '165Hz', '240Hz', '16 inch', '18 inch', 'OLED'] },
    ],
  },
  {
    id: 'pc', name: 'PC Gaming', icon: 'pc-case',
    groups: [
      { title: 'Theo giá', links: ['Dưới 15 triệu', '15 - 20 triệu', '20 - 30 triệu', '30 - 50 triệu', 'Trên 50 triệu'] },
      { title: 'Theo CPU', links: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core Ultra', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
      { title: 'Theo VGA', links: ['GTX 1650', 'RTX 3050', 'RTX 4060', 'RTX 5060', 'RTX 5070', 'RTX 5080', 'RX 7600'] },
      { title: 'Theo nhu cầu', links: ['Esport', 'Streaming', 'AAA 2K', 'Đồ họa - Render'] },
      { title: 'Dịch vụ', links: [['Build PC theo yêu cầu', 'build-pc.html'], ['Bảo hành tận nơi', 'policy.html?type=bao-hanh'], ['Thu cũ đổi mới', 'thu-cu-doi-moi.html'], ['Trả góp 0%', 'policy.html?type=tra-gop']] },
    ],
  },
  {
    id: 'pc-office', name: 'PC Văn phòng', icon: 'computer',
    groups: [
      { title: 'PC Văn phòng', links: ['Intel Core i3', 'Intel Core i5', 'AMD Ryzen 5 8600G', 'PC Mini'] },
      { title: 'PC Đồ họa', links: ['Thiết kế 2D', 'Dựng phim - 3D', 'Workstation', 'RTX 4070', 'RTX 4080'] },
      { title: 'Theo giá', links: ['Dưới 8 triệu', '8 - 12 triệu', '12 - 20 triệu', 'Trên 20 triệu'] },
      { title: 'RAM - SSD', links: ['8GB', '16GB', '32GB', '64GB', 'SSD 512GB'] },
      { title: 'Máy đồng bộ cũ', links: [['Dell OptiPlex', 'category.html?cat=used&q=OptiPlex'], ['PC cũ giá rẻ', 'category.html?cat=used&q=PC']] },
    ],
  },
  {
    id: 'components', name: 'Linh kiện PC', icon: 'cpu',
    groups: [
      { title: 'CPU', links: ['CPU Intel Core i3', 'CPU Intel Core i5', 'CPU Intel Core i7', 'CPU Intel Core i9', 'CPU AMD Ryzen 5', 'CPU AMD Ryzen 7'] },
      { title: 'Mainboard', links: ['Mainboard H610', 'Mainboard B760', 'Mainboard Z790', 'Mainboard B650', 'Mainboard B550', 'Mainboard B850'] },
      { title: 'VGA - RAM', links: ['Card màn hình RTX', 'Card màn hình Radeon', 'RAM DDR4', 'RAM DDR5', 'RAM Laptop'] },
      { title: 'Lưu trữ', links: ['SSD NVMe', 'SSD SATA', 'SSD 1TB', 'SSD 2TB', 'Ổ cứng HDD'] },
      { title: 'Nguồn - Tản - Case', links: ['Nguồn 650W', 'Nguồn 850W', 'Tản nhiệt khí', 'Tản nhiệt nước AIO', 'Case Mid Tower', 'Case mATX'] },
    ],
  },
  {
    id: 'vga', name: 'Card đồ họa', icon: 'circuit-board',
    groups: [
      { title: 'NVIDIA RTX 50', links: ['RTX 5090', 'RTX 5080', 'RTX 5070 Ti', 'RTX 5070', 'RTX 5060 Ti', 'RTX 5060'] },
      { title: 'NVIDIA RTX 40 / 30', links: ['RTX 4060 Ti', 'RTX 4060', 'RTX 3050'] },
      { title: 'AMD Radeon', links: ['RX 9070 XT', 'RX 7800 XT', 'RX 7600'] },
      { title: 'Thương hiệu', links: ['ASUS', 'MSI', 'GIGABYTE', 'ZOTAC', 'Palit', 'INNO3D', 'Sapphire'] },
      { title: 'Giá bán', links: ['Dưới 8 triệu', '8 - 15 triệu', '15 - 25 triệu', 'Trên 25 triệu'] },
    ],
  },
  {
    id: 'monitor', name: 'Màn hình', icon: 'monitor',
    groups: [
      { title: 'Thương hiệu', links: ['ASUS', 'LG', 'Samsung', 'MSI', 'Dell', 'GIGABYTE', 'AOC', 'ViewSonic', 'Philips'] },
      { title: 'Kích thước', links: ['24 inch', '25 inch', '27 inch', '32 inch', '34 inch cong'] },
      { title: 'Tần số quét', links: ['75 - 100Hz', '144Hz', '165Hz', '180Hz', '240Hz', '360Hz'] },
      { title: 'Độ phân giải', links: ['Full HD', '2K QHD', '4K UHD', 'UWQHD'] },
      { title: 'Tấm nền - Nhu cầu', links: ['IPS', 'VA', 'OLED', 'Đồ họa', 'Gaming'] },
    ],
  },
  {
    id: 'keyboard', name: 'Bàn phím', icon: 'keyboard',
    groups: [
      { title: 'Thương hiệu', links: ['Akko', 'AULA', 'Logitech', 'Razer', 'Corsair', 'ASUS ROG', 'Keychron', 'E-Dra', 'Dareu', 'Leopold'] },
      { title: 'Loại', links: ['Bàn phím cơ', 'Hall Effect', 'Analog', 'Bàn phím văn phòng'] },
      { title: 'Layout', links: ['Full size', 'TKL', '96%', '75%', '65%'] },
      { title: 'Kết nối', links: ['Có dây', 'Không dây', '3 mode', 'Bluetooth'] },
      { title: 'Giá bán', links: ['Dưới 500K', '500K - 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
    ],
  },
  {
    id: 'mouse', name: 'Chuột', icon: 'mouse',
    groups: [
      { title: 'Thương hiệu', links: ['Logitech', 'Razer', 'Corsair', 'ASUS ROG', 'Pulsar', 'VGN', 'E-Dra'] },
      { title: 'Loại', links: ['Chuột gaming', 'Chuột văn phòng', 'Siêu nhẹ', 'Lót chuột'] },
      { title: 'Kết nối', links: ['Có dây', 'Không dây', 'Bluetooth'] },
      { title: 'Cảm biến', links: ['8.000 DPI', '26.000 DPI', '30.000 DPI', '42.000 DPI'] },
      { title: 'Giá bán', links: ['Dưới 500K', '500K - 1 triệu', '1 - 2 triệu', 'Trên 2 triệu'] },
    ],
  },
  {
    id: 'headset', name: 'Tai nghe', icon: 'headphones',
    groups: [
      { title: 'Thương hiệu', links: ['HyperX', 'Logitech', 'Razer', 'Corsair', 'Sony INZONE', 'SteelSeries'] },
      { title: 'Kết nối', links: ['Có dây', 'Không dây', 'Bluetooth'] },
      { title: 'Driver', links: ['40mm', '50mm', 'Chống ồn ANC'] },
      { title: 'Giá bán', links: ['Dưới 1 triệu', '1 - 3 triệu', 'Trên 3 triệu'] },
      { title: 'Âm thanh khác', links: [['Loa vi tính', 'category.html?cat=accessory&q=Loa'], ['Micro thu âm', 'category.html?cat=accessory&q=Micro'], ['Soundbar', 'category.html?cat=accessory&q=Loa thanh']] },
    ],
  },
  {
    id: 'furniture', name: 'Bàn ghế gaming', icon: 'armchair',
    groups: [
      { title: 'Ghế gaming', links: ['E-Dra', 'Corsair', 'Cooler Master', 'Cougar', 'Ngả 180'] },
      { title: 'Ghế công thái học', links: ['Lưng lưới', 'Có tựa đầu', 'Warrior'] },
      { title: 'Bàn gaming', links: ['Bàn chữ K', 'Bàn chữ Z', 'Bàn chữ L', 'Có LED', 'Bàn nâng hạ'] },
      { title: 'Kích thước bàn', links: ['1m2', '1m4', '1m6'] },
      { title: 'Phụ kiện', links: [['Giá treo màn hình', 'category.html?cat=accessory&q=Giá treo'], ['Lót chuột', 'category.html?cat=mouse&q=Lót chuột']] },
    ],
  },
  {
    id: 'storage', name: 'Ổ cứng SSD - HDD', icon: 'hard-drive',
    groups: [
      { title: 'SSD NVMe', links: ['500GB', '1TB', '2TB', 'PCIe 4.0'] },
      { title: 'SSD SATA', links: ['240GB', '500GB'] },
      { title: 'Ổ cứng HDD', links: ['1TB', '2TB', '4TB', '8TB', 'NAS', 'Camera'] },
      { title: 'Thương hiệu', links: ['Samsung', 'Kingston', 'WD', 'Crucial', 'Lexar', 'Seagate', 'Toshiba'] },
      { title: 'Lưu trữ di động', links: [['Ổ cứng di động', 'category.html?cat=accessory&q=di động'], ['USB', 'category.html?cat=accessory&q=USB Kingston'], ['Thẻ nhớ', 'category.html?cat=accessory&q=Thẻ nhớ']] },
    ],
  },
  {
    id: 'accessory', name: 'Phụ kiện', icon: 'cable',
    groups: [
      { title: 'Âm thanh', links: ['Loa vi tính', 'Loa Bluetooth', 'Loa kiểm âm', 'Soundbar'] },
      { title: 'Stream - Học online', links: ['Webcam', 'Webcam Full HD', 'Micro thu âm', 'Micro livestream'] },
      { title: 'Chơi game', links: ['Tay cầm Xbox', 'Tay cầm DualSense', 'Tay cầm 8BitDo', 'Tay cầm có dây'] },
      { title: 'Lưu trữ di động', links: ['Ổ cứng di động', 'SSD di động', 'USB', 'Thẻ nhớ'] },
      { title: 'Kết nối - Tiện ích', links: ['Hub USB-C', 'Giá treo màn hình'] },
    ],
  },
  {
    id: 'network', name: 'Thiết bị mạng', icon: 'router',
    groups: [
      { title: 'Router WiFi', links: ['WiFi 7', 'WiFi 6', 'WiFi 5', 'Router gaming'] },
      { title: 'WiFi Mesh', links: ['Deco', 'Mesh 2 cục'] },
      { title: 'Có dây', links: ['Switch 5 cổng', 'Switch 16 cổng', 'Cáp mạng Cat6'] },
      { title: 'Card - USB WiFi', links: ['Card WiFi PCIe', 'USB WiFi'] },
      { title: 'Thương hiệu', links: ['TP-Link', 'ASUS', 'Mercusys', 'Tenda'] },
    ],
  },
  {
    id: 'software', name: 'Phần mềm', icon: 'app-window',
    groups: [
      { title: 'Hệ điều hành', links: ['Windows 11 Home', 'Windows 11 Pro'] },
      { title: 'Văn phòng', links: ['Office Home 2024', 'Office Home & Business', 'Microsoft 365 Personal', 'Microsoft 365 Family'] },
      { title: 'Diệt virus', links: ['Kaspersky', 'Bitdefender', 'ESET'] },
      { title: 'Đồ họa', links: ['Adobe Photoshop'] },
      { title: 'Thời hạn', links: ['Vĩnh viễn', '12 tháng'] },
    ],
  },
  {
    id: 'used', name: 'Hàng cũ', icon: 'recycle',
    groups: [
      { title: 'Linh kiện cũ', links: ['Card màn hình', 'RTX 3060', 'RTX 3080', 'CPU', 'Mainboard'] },
      { title: 'Laptop cũ', links: ['Laptop gaming', 'ThinkPad', 'Dell Latitude'] },
      { title: 'PC - Màn hình cũ', links: ['PC văn phòng', 'Màn hình'] },
      { title: 'Gear cũ', links: ['Chuột', 'Bàn phím', 'Ghế'] },
      { title: 'Tình trạng', links: ['Like new', 'Đẹp 95%'] },
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

/* ----------------------------------------------------------
   Sản phẩm bổ sung đợt 3 — viết gọn 1 dòng / sản phẩm bằng hàm tắt.
   Giá ghi theo NGHÌN ĐỒNG (15990 = 15.990.000đ). Thêm sản phẩm mới ở CUỐI khối này.
   ---------------------------------------------------------- */
{
  const k = (n) => n * 1000;
  const x = (rv, label = '', gift = '') => ({ reviews: rv, ...(label ? { label } : {}), ...(gift ? { gift } : {}) });
  const lap = (cat) => (name, img, price, old, cpu, gpu, ram, ssd, screen, tags, rv, label, gift) =>
    product(cat, name, img, k(price), k(old), [['cpu', cpu], ['gpu', gpu], ['ram', ram], ['ssd', ssd], ['screen', screen]], tags, x(rv, label, gift));
  const LG = lap('laptop-gaming');
  const LO = lap('laptop');
  const PC = (name, img, price, old, cpu, gpu, ram, ssd, tags, rv, label, gift) =>
    product('pc', name, img, k(price), k(old), [['cpu', cpu], ['gpu', gpu], ['ram', ram], ['ssd', ssd]], tags, x(rv, label, gift));
  const MON = (name, img, price, old, size, panel, hz, res, tags, rv, label) =>
    product('monitor', name, img, k(price), k(old), [['size', size], ['panel', panel], ['hz', hz], ['res', res]], tags, x(rv, label));
  const KB = (name, img, price, old, sw, layout, conn, tags, rv, label) =>
    product('keyboard', name, img, k(price), k(old), [['switch', sw], ['layout', layout], [/dây/i.test(conn) && !/không/i.test(conn) ? 'wired' : 'wireless', conn]], tags, x(rv, label));
  const MS = (name, img, price, old, dpi, conn, weight, tags, rv, label) =>
    product('mouse', name, img, k(price), k(old), [['dpi', dpi], [/có dây/i.test(conn) ? 'wired' : 'wireless', conn], ['weight', weight]], tags, x(rv, label));
  const HS = (name, img, price, old, driver, conn, tags, rv, label) =>
    product('headset', name, img, k(price), k(old), [['driver', driver], [/có dây|usb|3\.5/i.test(conn) && !/không dây/i.test(conn) ? 'wired' : 'wireless', conn]], tags, x(rv, label));
  const C = (name, img, price, old, specs, tags, rv, label) => product('components', name, img, k(price), k(old), specs, tags, x(rv, label));
  const AC = (name, img, price, old, specs, tags, rv, label) => product('accessory', name, img, k(price), k(old), specs, tags, x(rv, label));
  const NW = (name, img, price, old, wifi, ports, tags, rv, label) => product('network', name, img, k(price), k(old), [['wifi', wifi], ['ports', ports]], tags, x(rv, label));
  const SW = (name, img, price, old, license, platform, tags, rv, label) => product('software', name, img, k(price), k(old), [['license', license], ['platform', platform]], tags, x(rv, label));
  const CH = (cat) => (name, img, price, old, a, b, tags, rv, label) => product(cat, name, img, k(price), k(old), cat === 'desk' ? [['size', a], ['material', b]] : [['material', a], ['weight', b]], tags, x(rv, label));
  const CHAIR = CH('chair');
  const DESK = CH('desk');
  const USED = (cat, name, img, price, old, specs, tags, rv, warranty) =>
    product(cat, name, img, k(price), k(old), specs, [...tags, 'used'], { reviews: rv, label: 'Hàng cũ', warranty });

  PRODUCTS.push(
    /* Laptop gaming */
    LG('Laptop gaming ASUS TUF Gaming F16 FX608JHR', 'laptop-gaming-1.jpg', 32990, 36990, 'i7-14650HX', 'RTX 5060', '16GB', '512GB', '16" 165Hz', ['asus'], 9, 'Mới'),
    LG('Laptop gaming ASUS ROG Strix G16 G614PH', 'laptop-gaming-3.jpg', 45990, 49990, 'Ryzen 9 8940HX', 'RTX 5060', '16GB', '1TB', '16" 2.5K 165Hz', ['asus'], 5, 'Mới'),
    LG('Laptop gaming ASUS ROG Strix SCAR 18 G835LX', 'laptop-gaming-2.jpg', 119990, 129990, 'Ultra 9 275HX', 'RTX 5090', '64GB', '4TB', '18" 2.5K 240Hz', ['asus'], 2),
    LG('Laptop gaming ASUS TUF Gaming A16 FA608UH', 'laptop-gaming-4.jpg', 27990, 31490, 'Ryzen 7 260', 'RTX 5050', '16GB', '512GB', '16" 165Hz', ['asus'], 7),
    LG('Laptop gaming Acer Nitro Lite 16 NL16-71G', 'laptop-gaming-1.jpg', 20490, 23490, 'i5-13420H', 'RTX 4050', '16GB', '512GB', '16" 165Hz', ['acer'], 18),
    LG('Laptop gaming Acer Predator Helios Neo 16 AI PHN16-73', 'laptop-gaming-3.jpg', 44990, 48990, 'Ultra 7 255HX', 'RTX 5070 Ti', '32GB', '1TB', '16" 2.5K 240Hz', ['acer'], 4, 'Mới'),
    LG('Laptop gaming Acer Nitro V 15 ANV15-41 Ryzen 5', 'laptop-gaming-2.jpg', 18490, 20990, 'Ryzen 5 7535HS', 'RTX 3050', '16GB', '512GB', '15.6" 144Hz', ['acer'], 37),
    LG('Laptop gaming MSI Katana 17 B13VFK', 'laptop-gaming-4.jpg', 28490, 32990, 'i7-13620H', 'RTX 4060', '16GB', '1TB', '17.3" 144Hz', ['msi'], 11),
    LG('Laptop gaming MSI Sword 16 HX B14VGKG', 'laptop-gaming-1.jpg', 36990, 40990, 'i7-14700HX', 'RTX 4070', '16GB', '1TB', '16" 165Hz', ['msi'], 6),
    LG('Laptop gaming MSI Raider 18 HX AI A2XWJG', 'laptop-gaming-3.jpg', 109990, 119990, 'Ultra 9 285HX', 'RTX 5090', '64GB', '2TB', '18" 4K 120Hz', ['msi'], 1),
    LG('Laptop gaming MSI Thin A15 B7VE', 'laptop-gaming-2.jpg', 19990, 22990, 'Ryzen 5 7535HS', 'RTX 4050', '16GB', '512GB', '15.6" 144Hz', ['msi'], 15),
    LG('Laptop gaming Lenovo LOQ 15IRX10', 'laptop-gaming-4.jpg', 26990, 29990, 'i7-14700HX', 'RTX 5060', '16GB', '512GB', '15.6" 144Hz', ['lenovo'], 12, 'Mới'),
    LG('Laptop gaming Lenovo Legion 5 15AHP10', 'laptop-gaming-1.jpg', 41990, 45990, 'Ryzen 7 260', 'RTX 5070', '32GB', '1TB', '15.1" 2.5K OLED 165Hz', ['lenovo'], 5),
    LG('Laptop gaming Lenovo Legion Slim 5 14APH8', 'laptop-gaming-3.jpg', 37990, 41990, 'Ryzen 7 7840HS', 'RTX 4060', '16GB', '1TB', '14.5" 3K OLED 120Hz', ['lenovo'], 7),
    LG('Laptop gaming HP Victus 15-fb2063AX', 'laptop-gaming-2.jpg', 19490, 22490, 'Ryzen 5 8645HS', 'RTX 4050', '16GB', '512GB', '15.6" 144Hz', ['hp'], 21),
    LG('Laptop gaming HP OMEN 16-xf0000AX', 'laptop-gaming-4.jpg', 39990, 43990, 'Ryzen 7 7840HS', 'RTX 4070', '16GB', '1TB', '16.1" 2.5K 240Hz', ['hp'], 4),
    LG('Laptop gaming Dell Alienware m16 R2', 'laptop-gaming-1.jpg', 62990, 67990, 'Ultra 7 155H', 'RTX 4070', '32GB', '1TB', '16" 2.5K 240Hz', ['dell'], 3),
    LG('Laptop gaming GIGABYTE G5 MF5', 'laptop-gaming-3.jpg', 21490, 24990, 'i5-13500H', 'RTX 4050', '16GB', '512GB', '15.6" 144Hz', ['gigabyte'], 13),
    LG('Laptop gaming GIGABYTE AORUS 16X 9KG', 'laptop-gaming-2.jpg', 44990, 49990, 'i7-13650HX', 'RTX 4070', '16GB', '1TB', '16" 2.5K 165Hz', ['gigabyte'], 3),
    LG('Laptop gaming ASUS Vivobook Gaming K3605ZF', 'laptop-gaming-4.jpg', 18990, 21990, 'i5-12500H', 'RTX 2050', '16GB', '512GB', '16" 144Hz', ['asus'], 26),

    /* Laptop văn phòng */
    LO('Laptop ASUS Vivobook 14 X1404VA', 'laptop-office-1.jpg', 11990, 13490, 'i5-1335U', 'Iris Xe', '8GB', '512GB', '14" FHD', ['asus'], 44),
    LO('Laptop ASUS Vivobook 16 X1605VA', 'laptop-office-3.jpg', 13990, 15990, 'i5-13420H', 'UHD Graphics', '16GB', '512GB', '16" WUXGA', ['asus'], 31),
    LO('Laptop ASUS Zenbook S 14 UX5406SA', 'laptop-office-2.jpg', 36990, 39990, 'Ultra 7 258V', 'Intel Arc 140V', '32GB', '1TB', '14" 3K OLED 120Hz', ['asus'], 5, 'Mới'),
    LO('Laptop ASUS ExpertBook B1 B1402CVA', 'laptop-office-4.jpg', 12490, 13990, 'i5-1335U', 'Iris Xe', '8GB', '512GB', '14" FHD', ['asus'], 18),
    LO('Laptop Acer Aspire 3 A315-59', 'laptop-office-3.jpg', 10490, 11990, 'i3-1215U', 'UHD Graphics', '8GB', '512GB', '15.6" FHD', ['acer'], 52),
    LO('Laptop Acer Aspire 5 A515-58P', 'laptop-office-1.jpg', 14490, 16490, 'i5-1335U', 'Iris Xe', '16GB', '512GB', '15.6" FHD', ['acer'], 23),
    LO('Laptop Acer Swift Go 14 AI SFG14-74', 'laptop-office-2.jpg', 23990, 26490, 'Ultra 5 226V', 'Intel Arc 130V', '16GB', '512GB', '14" 2.8K OLED', ['acer'], 6, 'Mới'),
    LO('Laptop Lenovo IdeaPad Slim 3 14IRH10', 'laptop-office-4.jpg', 14990, 16490, 'i5-13420H', 'UHD Graphics', '16GB', '512GB', '14" WUXGA', ['lenovo'], 29),
    LO('Laptop Lenovo ThinkPad E16 Gen 2', 'laptop-office-1.jpg', 21490, 23490, 'Ultra 5 125U', 'Intel Graphics', '16GB', '512GB', '16" WUXGA', ['lenovo'], 9),
    LO('Laptop Lenovo ThinkBook 14 G7 IML', 'laptop-office-3.jpg', 18990, 20990, 'Ultra 5 125U', 'Intel Graphics', '16GB', '512GB', '14" WUXGA', ['lenovo'], 12),
    LO('Laptop Lenovo Yoga Slim 7 14IMH9', 'laptop-office-2.jpg', 29990, 32990, 'Ultra 7 155H', 'Intel Arc', '32GB', '1TB', '14" 2.8K OLED', ['lenovo'], 6),
    LO('Laptop Dell Inspiron 15 3530', 'laptop-office-4.jpg', 13990, 15490, 'i5-1334U', 'Iris Xe', '8GB', '512GB', '15.6" FHD 120Hz', ['dell'], 35),
    LO('Laptop Dell Latitude 3450', 'laptop-office-1.jpg', 17990, 19490, 'i5-1335U', 'Iris Xe', '16GB', '512GB', '14" FHD', ['dell'], 8),
    LO('Laptop Dell 14 Plus DB14250', 'laptop-office-3.jpg', 24990, 26990, 'Ultra 7 256V', 'Intel Arc 140V', '16GB', '1TB', '14" 2.5K', ['dell'], 4, 'Mới'),
    LO('Laptop HP 240 G10', 'laptop-office-2.jpg', 10990, 12490, 'i3-1315U', 'UHD Graphics', '8GB', '256GB', '14" FHD', ['hp'], 47),
    LO('Laptop HP ProBook 450 G10', 'laptop-office-4.jpg', 18490, 20490, 'i5-1335U', 'Iris Xe', '16GB', '512GB', '15.6" FHD', ['hp'], 14),
    LO('Laptop HP Pavilion Plus 14-ew1037TU', 'laptop-office-1.jpg', 21990, 24490, 'Ultra 5 125H', 'Intel Arc', '16GB', '512GB', '14" 2.8K OLED', ['hp'], 7),
    LO('Laptop HP OmniBook X Flip 14', 'laptop-office-2.jpg', 27990, 30490, 'Ultra 5 226V', 'Intel Arc 130V', '16GB', '512GB', '14" 2K OLED cảm ứng', ['hp'], 3, 'Mới'),
    LO('Laptop MSI Prestige 14 AI Evo C1MG', 'laptop-office-3.jpg', 23990, 26990, 'Ultra 5 125H', 'Intel Arc', '16GB', '512GB', '14" 2.8K OLED', ['msi'], 5),
    LO('Laptop MSI Modern 14 C12MO', 'laptop-office-4.jpg', 9990, 11490, 'i5-1235U', 'Iris Xe', '8GB', '512GB', '14" FHD', ['msi'], 38),
    LO('Laptop Apple MacBook Air 13 M4 16GB 256GB', 'laptop-office-2.jpg', 26990, 28990, 'Apple M4', 'GPU 8 nhân', '16GB', '256GB', '13.6" Liquid Retina', ['apple'], 11, 'Mới'),
    LO('Laptop Apple MacBook Pro 14 M4 Pro 24GB 512GB', 'laptop-office-1.jpg', 52990, 55990, 'Apple M4 Pro', 'GPU 16 nhân', '24GB', '512GB', '14.2" Liquid Retina XDR', ['apple'], 4),
    LO('Laptop LG gram 14 2024 14Z90S', 'laptop-office-3.jpg', 27990, 31990, 'Ultra 5 125H', 'Intel Arc', '16GB', '512GB', '14" WUXGA, 1.1kg', ['lg'], 6),
    LO('Laptop LG gram 16 2024 16Z90S', 'laptop-office-2.jpg', 32990, 36990, 'Ultra 7 155H', 'Intel Arc', '16GB', '1TB', '16" WQXGA, 1.2kg', ['lg'], 4),
    LO('Laptop Samsung Galaxy Book4 15', 'laptop-office-4.jpg', 15990, 17990, 'i5-1335U', 'Iris Xe', '8GB', '512GB', '15.6" FHD', ['samsung'], 9),

    /* PC */
    PC('PC MKPC Gaming i5 12400F - RTX 4060 8GB', 'pc-4.jpg', 18990, 20990, 'i5-12400F', 'RTX 4060', '16GB DDR4', '500GB NVMe', ['gaming', 'intel'], 41, 'Bán chạy', 'Tặng bàn phím + chuột'),
    PC('PC MKPC Gaming Ryzen 5 5600 - RTX 3060 12GB', 'pc-1.jpg', 15490, 16990, 'Ryzen 5 5600', 'RTX 3060', '16GB DDR4', '500GB NVMe', ['gaming', 'amd'], 33),
    PC('PC MKPC Gaming i5 13400F - RTX 4060 Ti 8GB', 'pc-3.jpg', 23490, 25490, 'i5-13400F', 'RTX 4060 Ti', '16GB DDR5', '1TB NVMe', ['gaming', 'intel'], 14),
    PC('PC MKPC Gaming Ryzen 5 7600 - RX 7800 XT 16GB', 'setup-2.jpg', 31990, 34490, 'Ryzen 5 7600', 'RX 7800 XT', '32GB DDR5', '1TB NVMe', ['gaming', 'amd'], 6),
    PC('PC MKPC Gaming i7 14700F - RTX 5070 12GB', 'pc-2.jpg', 42990, 46490, 'i7-14700F', 'RTX 5070', '32GB DDR5', '1TB NVMe', ['gaming', 'intel'], 8, 'Mới'),
    PC('PC MKPC Gaming Ultra 5 245K - RTX 5060 Ti 16GB', 'pc-3.jpg', 32990, 35990, 'Ultra 5 245K', 'RTX 5060 Ti', '32GB DDR5', '1TB NVMe', ['gaming', 'intel'], 5, 'Mới'),
    PC('PC MKPC Gaming Ryzen 7 7800X3D - RTX 5070 Ti', 'setup-3.jpg', 54990, 58990, 'R7 7800X3D', 'RTX 5070 Ti', '32GB DDR5', '2TB NVMe', ['gaming', 'amd'], 4),
    PC('PC MKPC Gaming i9 14900K - RTX 5080 16GB', 'pc-2.jpg', 74990, 80990, 'i9-14900K', 'RTX 5080', '64GB DDR5', '2TB NVMe', ['gaming', 'intel'], 2),
    PC('PC MKPC Ultimate Ryzen 9 9950X3D - RTX 5090', 'setup-3.jpg', 139990, 149990, 'R9 9950X3D', 'RTX 5090', '96GB DDR5', '4TB NVMe', ['gaming', 'amd', 'design'], 1),
    PC('PC MKPC Esport Ryzen 5 5500 - RX 6600 8GB', 'pc-1.jpg', 11490, 12490, 'Ryzen 5 5500', 'RX 6600', '16GB DDR4', '500GB NVMe', ['gaming', 'amd'], 27),
    PC('PC MKPC Office Ryzen 3 8300G - 8GB', 'pc-office.jpg', 7490, 8290, 'Ryzen 3 8300G', 'Radeon 740M', '8GB DDR5', '256GB NVMe', ['office', 'amd'], 19),
    PC('PC MKPC Office i5 14400 - 16GB DDR5', 'setup-1.jpg', 12990, 13990, 'i5-14400', 'UHD 730', '16GB DDR5', '512GB NVMe', ['office', 'intel'], 13),
    PC('PC MKPC Đồ họa Ultra 7 265K - RTX 4070 Super', 'pc-2.jpg', 49990, 53990, 'Ultra 7 265K', 'RTX 4070 S', '64GB DDR5', '2TB NVMe', ['design', 'intel'], 3),
    PC('PC MKPC Đồ họa Ryzen 7 9700X - RTX 4060 Ti 16GB', 'pc-3.jpg', 33990, 36990, 'Ryzen 7 9700X', 'RTX 4060 Ti', '32GB DDR5', '1TB NVMe', ['design', 'amd'], 4),
    PC('PC MKPC Workstation Ryzen 9 9950X - RTX 4090', 'setup-3.jpg', 119990, 129990, 'Ryzen 9 9950X', 'RTX 4090', '128GB DDR5', '4TB NVMe', ['design', 'amd'], 1),

    /* Màn hình */
    MON('Màn hình ASUS VA24EHF 24" IPS 100Hz', 'monitor-1.jpg', 2190, 2590, '23.8 inch', 'IPS', '100Hz', 'Full HD', ['asus'], 71, 'Bán chạy'),
    MON('Màn hình ASUS TUF Gaming VG27AQ3A 27" 2K 180Hz', 'monitor-4.jpg', 5790, 6490, '27 inch', 'Fast IPS', '180Hz', '2K QHD', ['asus'], 19),
    MON('Màn hình ASUS ROG Swift OLED PG27AQDM 27" 240Hz', 'monitor-3.jpg', 21990, 25990, '26.5 inch', 'OLED', '240Hz', '2K QHD', ['asus'], 4),
    MON('Màn hình LG 24MR400-B 24" IPS 100Hz', 'monitor-2.jpg', 1990, 2390, '23.8 inch', 'IPS', '100Hz', 'Full HD', ['lg'], 58),
    MON('Màn hình LG UltraGear 27GR75Q-B 27" 2K 165Hz', 'monitor-4.jpg', 6290, 7290, '27 inch', 'IPS', '165Hz', '2K QHD', ['lg'], 16),
    MON('Màn hình LG UltraGear 27GS95QE OLED 240Hz', 'monitor-3.jpg', 19990, 23990, '26.5 inch', 'OLED', '240Hz', '2K QHD', ['lg'], 5),
    MON('Màn hình Samsung S3 LS24C310 24" IPS 75Hz', 'monitor-1.jpg', 2090, 2490, '24 inch', 'IPS', '75Hz', 'Full HD', ['samsung'], 39),
    MON('Màn hình Samsung Odyssey G5 LS32CG552 32" 2K cong', 'monitor-3.jpg', 7490, 8990, '32 inch cong', 'VA', '165Hz', '2K QHD', ['samsung'], 11),
    MON('Màn hình Samsung ViewFinity S8 LS27B800 27" 4K', 'monitor-5.jpg', 8990, 10490, '27 inch', 'IPS', '60Hz', '4K UHD', ['samsung'], 6),
    MON('Màn hình MSI PRO MP243X 24" IPS 100Hz', 'monitor-2.jpg', 2290, 2690, '23.8 inch', 'IPS', '100Hz', 'Full HD', ['msi'], 33),
    MON('Màn hình MSI MAG 275QF 27" 2K 180Hz', 'monitor-4.jpg', 5490, 6290, '27 inch', 'Rapid IPS', '180Hz', '2K QHD', ['msi'], 14),
    MON('Màn hình Dell SE2425H 24" VA 75Hz', 'monitor-5.jpg', 2390, 2790, '23.8 inch', 'VA', '75Hz', 'Full HD', ['dell'], 27),
    MON('Màn hình Dell UltraSharp U2724D 27" 2K 120Hz', 'monitor-5.jpg', 10490, 11990, '27 inch', 'IPS Black', '120Hz', '2K QHD', ['dell'], 7),
    MON('Màn hình GIGABYTE G27F 2 27" IPS 170Hz', 'monitor-4.jpg', 3990, 4590, '27 inch', 'SS IPS', '170Hz', 'Full HD', ['gigabyte'], 22),
    MON('Màn hình GIGABYTE M27Q P 27" 2K 170Hz KVM', 'monitor-2.jpg', 6990, 7990, '27 inch', 'SS IPS', '170Hz', '2K QHD', ['gigabyte'], 8),
    MON('Màn hình AOC Q27G4 27" 2K 180Hz', 'monitor-4.jpg', 4990, 5790, '27 inch', 'Fast IPS', '180Hz', '2K QHD', ['aoc'], 18),
    MON('Màn hình ViewSonic VX2758A-2K-PRO 27" 2K 170Hz', 'monitor-2.jpg', 4790, 5490, '27 inch', 'IPS', '170Hz', '2K QHD', ['viewsonic'], 15),
    MON('Màn hình BenQ ZOWIE XL2546X 25" 240Hz Esport', 'monitor-1.jpg', 12990, 14490, '24.5 inch', 'Fast TN', '240Hz', 'Full HD', ['benq'], 6),
    MON('Màn hình BenQ GW2790 27" IPS 100Hz chống chói', 'monitor-5.jpg', 3290, 3790, '27 inch', 'IPS', '100Hz', 'Full HD', ['benq'], 20),
    MON('Màn hình Xiaomi G27i 27" IPS 165Hz', 'monitor-3.jpg', 3490, 4190, '27 inch', 'Fast IPS', '165Hz', 'Full HD', ['xiaomi'], 29),

    /* Bàn phím */
    KB('Bàn phím cơ Akko 5075S VIA', 'keyboard-2.jpg', 1490, 1790, 'Akko V3 Piano', '75%', 'Có dây', ['akko'], 32),
    KB('Bàn phím cơ Akko MonsGeek M1 V5 Gasket', 'keyboard-4.jpg', 2190, 2490, 'Akko Silver', '75%', '3 mode', ['akko'], 14),
    KB('Bàn phím cơ AULA F87 Pro 3 mode', 'keyboard-1.jpg', 990, 1190, 'Graywood V4', 'TKL', '3 mode', ['aula'], 61, 'Bán chạy'),
    KB('Bàn phím cơ AULA Win68 HE Magnetic', 'keyboard-4.jpg', 1290, 1590, 'Hall Effect', '65%', 'Có dây', ['aula'], 27, 'Mới'),
    KB('Bàn phím Logitech G Pro X 60 Lightspeed', 'keyboard-5.jpg', 4290, 4790, 'GX Optical', '60%', 'Không dây + Bluetooth', ['logitech'], 6),
    KB('Bàn phím Logitech G413 SE', 'keyboard-3.jpg', 1290, 1590, 'Tactile', 'Full size', 'Có dây', ['logitech'], 22),
    KB('Bàn phím Razer BlackWidow V4 Pro 75%', 'keyboard-6.jpg', 5990, 6790, 'Razer Orange', '75%', '3 mode', ['razer'], 4),
    KB('Bàn phím Razer Ornata V3 X', 'keyboard-1.jpg', 990, 1290, 'Mecha-Membrane', 'Full size', 'Có dây', ['razer'], 29),
    KB('Bàn phím Corsair K70 Core RGB', 'keyboard-3.jpg', 2290, 2690, 'Corsair MLX Red', 'Full size', 'Có dây', ['corsair'], 11),
    KB('Bàn phím ASUS ROG Strix Scope II 96 Wireless', 'keyboard-6.jpg', 3990, 4490, 'ROG NX Snow', '96%', '3 mode', ['asus'], 5),
    KB('Bàn phím cơ Keychron V1 Max', 'keyboard-2.jpg', 2290, 2590, 'Gateron Jupiter', '75%', '3 mode', ['keychron'], 12),
    KB('Bàn phím cơ Keychron Q1 Pro nhôm CNC', 'keyboard-4.jpg', 4790, 5290, 'K Pro Banana', '75%', 'Bluetooth + có dây', ['keychron'], 5),
    KB('Bàn phím cơ E-Dra EK375 Pro 3 mode', 'keyboard-3.jpg', 890, 1090, 'Huano Brown', '75%', '3 mode', ['edra'], 34),
    KB('Bàn phím cơ Dareu A87 Pro', 'keyboard-1.jpg', 790, 990, 'Dareu Sky', 'TKL', '3 mode', ['dareu'], 26),
    KB('Bàn phím cơ Ajazz AK820 Pro', 'keyboard-2.jpg', 1090, 1290, 'Ajazz Flying Fish', '75%', '3 mode', ['ajazz'], 31),

    /* Chuột */
    MS('Chuột gaming Logitech G502 Hero', 'mouse-4.jpg', 890, 1090, '25.600 DPI', 'Có dây', '121g', ['logitech'], 140, 'Bán chạy'),
    MS('Chuột gaming Logitech G304 Lightspeed (Trắng)', 'mouse-1.jpg', 690, 990, '12.000 DPI', 'Không dây', '99g', ['logitech'], 58),
    MS('Chuột Logitech MX Anywhere 3S', 'mouse-3.jpg', 1690, 1990, '8.000 DPI', 'Bluetooth + Bolt', '99g', ['logitech'], 19),
    MS('Chuột gaming Razer DeathAdder Essential', 'mouse-2.jpg', 390, 490, '6.400 DPI', 'Có dây', '96g', ['razer'], 77),
    MS('Chuột gaming Razer Viper V3 Pro', 'mouse-5.jpg', 3990, 4490, '35.000 DPI', 'Không dây', '54g', ['razer'], 6, 'Mới'),
    MS('Chuột gaming Corsair Harpoon RGB Wireless', 'mouse-3.jpg', 990, 1290, '10.000 DPI', 'Không dây + Bluetooth', '99g', ['corsair'], 15),
    MS('Chuột gaming ASUS TUF Gaming M4 Air', 'mouse-4.jpg', 590, 790, '16.000 DPI', 'Có dây', '47g', ['asus'], 24),
    MS('Chuột gaming ASUS ROG Harpe Ace Aim Lab', 'mouse-5.jpg', 2990, 3490, '36.000 DPI', 'Không dây + Bluetooth', '54g', ['asus'], 5),
    MS('Chuột gaming Pulsar Xlite V3 Wireless', 'mouse-2.jpg', 1990, 2290, '26.000 DPI', 'Không dây', '55g', ['pulsar'], 8),
    MS('Chuột gaming VGN Dragonfly F1 MOBA', 'mouse-1.jpg', 690, 890, '26.000 DPI', 'Không dây', '55g', ['vgn'], 33),
    MS('Chuột gaming BenQ ZOWIE EC2-C', 'mouse-4.jpg', 1690, 1890, '3.200 DPI', 'Có dây', '73g', ['benq'], 9),
    MS('Chuột gaming E-Dra EM6502 Pro Wireless', 'mouse-5.jpg', 490, 650, '16.000 DPI', 'Không dây', '78g', ['edra'], 28),
    MS('Chuột không dây Rapoo M100 Silent', 'mouse-3.jpg', 190, 250, '1.300 DPI', 'Không dây + Bluetooth', '85g', ['rapoo'], 64),
    MS('Chuột gaming Glorious Model O 2 Wireless', 'mouse-2.jpg', 1990, 2290, '26.000 DPI', 'Không dây', '68g', ['glorious'], 7),
    MS('Chuột gaming Fuhlen G90 Evo', 'mouse-1.jpg', 390, 490, '7.200 DPI', 'Có dây', '90g', ['fuhlen'], 46),

    /* Tai nghe */
    HS('Tai nghe HyperX Cloud II Wireless', 'headset-2.jpg', 2990, 3490, '53mm, 7.1', 'Không dây', ['hyperx'], 23),
    HS('Tai nghe HyperX Cloud III S Wireless', 'headset-1.jpg', 3690, 4190, '53mm', 'Không dây + Bluetooth', ['hyperx'], 6, 'Mới'),
    HS('Tai nghe Logitech G335 có dây', 'headset-2.jpg', 1190, 1490, '40mm', 'Có dây 3.5mm', ['logitech'], 31),
    HS('Tai nghe Logitech G733 Lightspeed (Trắng)', 'headset-1.jpg', 2490, 3290, '40mm', 'Không dây', ['logitech'], 17),
    HS('Tai nghe Razer BlackShark V2 Pro 2023', 'headset-2.jpg', 4290, 4790, '50mm TriForce', 'Không dây + Bluetooth', ['razer'], 8),
    HS('Tai nghe Razer Barracuda X 2022', 'headset-1.jpg', 2190, 2590, '40mm', 'Không dây + Bluetooth', ['razer'], 12),
    HS('Tai nghe Corsair HS55 Stereo', 'headset-2.jpg', 1190, 1390, '50mm', 'Có dây 3.5mm', ['corsair'], 14),
    HS('Tai nghe ASUS ROG Delta II', 'headset-1.jpg', 4790, 5490, '50mm', 'Không dây + Bluetooth', ['asus'], 4),
    HS('Tai nghe ASUS TUF Gaming H3', 'headset-2.jpg', 790, 990, '50mm', 'Có dây 3.5mm', ['asus'], 38),
    HS('Tai nghe SteelSeries Arctis Nova 1', 'headset-1.jpg', 1390, 1690, '40mm', 'Có dây 3.5mm', ['steelseries'], 15),
    HS('Tai nghe Sony INZONE H3', 'headset-2.jpg', 1990, 2390, '40mm', 'Có dây USB + 3.5mm', ['sony'], 9),
    HS('Tai nghe E-Dra EH412 Pro 7.1', 'headset-1.jpg', 490, 650, '50mm, 7.1 giả lập', 'Có dây USB', ['edra'], 52),

    /* Linh kiện: VGA */
    C('Card màn hình MSI GeForce RTX 5060 Gaming OC 8GB', 'vga-3.jpg', 9690, 10490, [['gpu', '8GB GDDR7'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], 10, 'Mới'),
    C('Card màn hình ASUS Dual GeForce RTX 5060 Ti OC 16GB', 'vga-1.jpg', 13490, 14490, [['gpu', '16GB GDDR7'], ['fan', '2 quạt'], ['power', '600W']], ['vga'], 12),
    C('Card màn hình GIGABYTE GeForce RTX 5070 Ti GAMING OC 16GB', 'vga-2.jpg', 26990, 28990, [['gpu', '16GB GDDR7'], ['fan', '3 quạt'], ['power', '750W']], ['vga'], 7),
    C('Card màn hình ZOTAC GAMING GeForce RTX 5080 SOLID OC 16GB', 'vga-3.jpg', 33990, 36490, [['gpu', '16GB GDDR7'], ['fan', '3 quạt'], ['power', '850W']], ['vga'], 3),
    C('Card màn hình MSI GeForce RTX 5090 32G SUPRIM LIQUID SOC', 'vga-2.jpg', 99990, 105990, [['gpu', '32GB GDDR7'], ['fan', 'Tản nước 360mm'], ['power', '1000W']], ['vga'], 1),
    C('Card màn hình GALAX GeForce RTX 4060 1-Click OC 8GB', 'vga-1.jpg', 7490, 8290, [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], 21),
    C('Card màn hình Colorful iGame RTX 4060 Ti Ultra W OC 8GB', 'vga-3.jpg', 10290, 11290, [['gpu', '8GB GDDR6'], ['fan', '3 quạt'], ['power', '550W']], ['vga'], 9),
    C('Card màn hình ASUS Dual GeForce RTX 3050 OC 6GB', 'vga-2.jpg', 4590, 5190, [['gpu', '6GB GDDR6'], ['fan', '2 quạt'], ['power', '300W']], ['vga'], 34),
    C('Card màn hình GIGABYTE GeForce GTX 1650 D6 OC 4GB', 'vga-1.jpg', 3390, 3890, [['gpu', '4GB GDDR6'], ['fan', '1 quạt'], ['power', '300W']], ['vga'], 46),
    C('Card màn hình Sapphire PULSE Radeon RX 9070 16GB', 'vga-2.jpg', 17490, 18990, [['gpu', '16GB GDDR6'], ['fan', '3 quạt'], ['power', '650W']], ['vga', 'amd'], 6, 'Mới'),
    C('Card màn hình ASRock Radeon RX 7600 Challenger 8GB', 'vga-3.jpg', 6290, 6990, [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga', 'amd'], 15),
    C('Card màn hình PowerColor Hellhound Radeon RX 7700 XT 12GB', 'vga-1.jpg', 11990, 12990, [['gpu', '12GB GDDR6'], ['fan', '3 quạt'], ['power', '700W']], ['vga', 'amd'], 5),

    /* Linh kiện: CPU */
    C('CPU Intel Core i3-14100F (up to 4.7GHz, 4 nhân)', 'cpu-3.jpg', 2390, 2790, [['cpu', '4C / 8T'], ['speed', '4.7GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], 22),
    C('CPU Intel Core i5-13400F (up to 4.6GHz, 10 nhân)', 'cpu-2.jpg', 3490, 3990, [['cpu', '10C / 16T'], ['speed', '4.6GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], 40),
    C('CPU Intel Core Ultra 5 245K (up to 5.2GHz, 14 nhân)', 'cpu-1.jpg', 6990, 7790, [['cpu', '14C / 14T'], ['speed', '5.2GHz'], ['socket', 'LGA 1851']], ['cpu', 'intel'], 8),
    C('CPU Intel Core Ultra 9 285K (up to 5.7GHz, 24 nhân)', 'cpu-3.jpg', 15990, 17490, [['cpu', '24C / 24T'], ['speed', '5.7GHz'], ['socket', 'LGA 1851']], ['cpu', 'intel'], 3),
    C('CPU AMD Ryzen 5 5500 (up to 4.2GHz, 6 nhân)', 'cpu-1.jpg', 1990, 2390, [['cpu', '6C / 12T'], ['speed', '4.2GHz'], ['socket', 'AM4']], ['cpu', 'amd'], 47),
    C('CPU AMD Ryzen 7 5700X3D (up to 4.1GHz, 8 nhân)', 'cpu-2.jpg', 5490, 6190, [['cpu', '8C / 16T'], ['speed', '4.1GHz'], ['socket', 'AM4']], ['cpu', 'amd'], 18),
    C('CPU AMD Ryzen 5 9600X (up to 5.4GHz, 6 nhân)', 'cpu-3.jpg', 6290, 6990, [['cpu', '6C / 12T'], ['speed', '5.4GHz'], ['socket', 'AM5']], ['cpu', 'amd'], 9),
    C('CPU AMD Ryzen 9 9950X3D (up to 5.7GHz, 16 nhân)', 'cpu-1.jpg', 19990, 21990, [['cpu', '16C / 32T'], ['speed', '5.7GHz'], ['socket', 'AM5']], ['cpu', 'amd'], 2, 'Mới'),

    /* Linh kiện: Mainboard */
    C('Mainboard ASUS PRIME H610M-E D4', 'mainboard-3.jpg', 1790, 2090, [['chipset', 'Intel H610'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], 39),
    C('Mainboard MSI MAG B760M MORTAR WIFI II', 'mainboard-1.jpg', 4290, 4790, [['chipset', 'Intel B760'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], 16),
    C('Mainboard GIGABYTE B760M GAMING X AX DDR4', 'mainboard-2.jpg', 3190, 3590, [['chipset', 'Intel B760'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], 24),
    C('Mainboard ASUS ROG STRIX Z790-E GAMING WIFI II', 'mainboard-4.jpg', 12490, 13990, [['chipset', 'Intel Z790'], ['socket', 'LGA 1700'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], 3),
    C('Mainboard MSI MAG B860 TOMAHAWK WIFI', 'mainboard-3.jpg', 5990, 6690, [['chipset', 'Intel B860'], ['socket', 'LGA 1851'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], 5, 'Mới'),
    C('Mainboard ASUS TUF GAMING B650M-PLUS WIFI', 'mainboard-1.jpg', 4790, 5290, [['chipset', 'AMD B650'], ['socket', 'AM5'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], 18),
    C('Mainboard GIGABYTE B550M DS3H', 'mainboard-2.jpg', 2090, 2390, [['chipset', 'AMD B550'], ['socket', 'AM4'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'amd'], 44, 'Bán chạy'),
    C('Mainboard MSI B450M-A PRO MAX II', 'mainboard-4.jpg', 1390, 1690, [['chipset', 'AMD B450'], ['socket', 'AM4'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'amd'], 57),
    C('Mainboard ASRock X870 Steel Legend WiFi', 'mainboard-3.jpg', 7290, 7990, [['chipset', 'AMD X870'], ['socket', 'AM5'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], 4),
    C('Mainboard GIGABYTE B850 AORUS ELITE WIFI7', 'mainboard-1.jpg', 6990, 7690, [['chipset', 'AMD B850'], ['socket', 'AM5'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], 3, 'Mới'),

    /* Linh kiện: RAM */
    C('RAM Kingston Fury Beast 16GB DDR4 3200MHz', 'ram-2.jpg', 790, 950, [['ram', '16GB DDR4'], ['speed', '3200MHz']], ['ram'], 88, 'Bán chạy'),
    C('RAM Kingston Fury Beast RGB 16GB DDR4 3600MHz', 'ram-1.jpg', 990, 1190, [['ram', '16GB DDR4'], ['speed', '3600MHz']], ['ram'], 31),
    C('RAM Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz', 'ram-1.jpg', 1990, 2290, [['ram', '32GB DDR4'], ['speed', '3200MHz']], ['ram'], 22),
    C('RAM G.Skill Ripjaws S5 32GB (2x16GB) DDR5 6000MHz', 'ram-2.jpg', 2590, 2990, [['ram', '32GB DDR5'], ['speed', '6000MHz']], ['ram'], 14),
    C('RAM TeamGroup T-Create Expert 32GB (2x16GB) DDR5 6000MHz', 'ram-1.jpg', 2490, 2890, [['ram', '32GB DDR5'], ['speed', '6000MHz']], ['ram'], 11),
    C('RAM ADATA XPG Lancer RGB 32GB (2x16GB) DDR5 6400MHz', 'ram-2.jpg', 2990, 3390, [['ram', '32GB DDR5'], ['speed', '6400MHz']], ['ram'], 8),
    C('RAM Corsair Dominator Titanium 64GB (2x32GB) DDR5 6600MHz', 'ram-1.jpg', 8490, 9290, [['ram', '64GB DDR5'], ['speed', '6600MHz']], ['ram'], 2),
    C('RAM Laptop Kingston Fury Impact 16GB DDR4 3200MHz', 'ram-2.jpg', 890, 1050, [['ram', '16GB DDR4'], ['speed', '3200MHz']], ['ram', 'laptop-ram'], 36),

    /* Linh kiện: SSD + HDD */
    C('SSD Samsung 990 PRO 2TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 4990, 5590, [['ssd', '2TB NVMe'], ['speed', '7450MB/s']], ['ssd'], 15),
    C('SSD Samsung 980 500GB M.2 NVMe', 'ssd-1.jpg', 1190, 1390, [['ssd', '500GB NVMe'], ['speed', '3100MB/s']], ['ssd'], 49),
    C('SSD Kingston KC3000 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 2290, 2590, [['ssd', '1TB NVMe'], ['speed', '7000MB/s']], ['ssd'], 18),
    C('SSD Kingston NV3 500GB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 990, 1190, [['ssd', '500GB NVMe'], ['speed', '5000MB/s']], ['ssd'], 53),
    C('SSD Crucial T500 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 2190, 2490, [['ssd', '1TB NVMe'], ['speed', '7300MB/s']], ['ssd'], 12),
    C('SSD WD Black SN7100 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 2090, 2390, [['ssd', '1TB NVMe'], ['speed', '7250MB/s']], ['ssd'], 9, 'Mới'),
    C('SSD Lexar NM620 512GB M.2 NVMe', 'ssd-1.jpg', 890, 1090, [['ssd', '512GB NVMe'], ['speed', '3500MB/s']], ['ssd'], 41),
    C('SSD Samsung 990 EVO Plus 4TB M.2 NVMe', 'ssd-1.jpg', 7490, 8290, [['ssd', '4TB NVMe'], ['speed', '7250MB/s']], ['ssd'], 3),
    C('SSD Crucial MX500 1TB 2.5" SATA', 'ssd-1.jpg', 1790, 2090, [['ssd', '1TB SATA'], ['speed', '560MB/s']], ['ssd'], 24),
    C('SSD Patriot P300 256GB M.2 NVMe', 'ssd-1.jpg', 590, 720, [['ssd', '256GB NVMe'], ['speed', '1700MB/s']], ['ssd'], 62),
    C('Ổ cứng HDD Seagate BarraCuda 4TB 5400rpm', 'hdd-1.jpg', 2390, 2690, [['capacity', '4TB'], ['rpm', '5400rpm'], ['form', '3.5 inch SATA']], ['hdd'], 13),
    C('Ổ cứng HDD WD Blue 1TB 7200rpm', 'hdd-2.jpg', 1090, 1290, [['capacity', '1TB'], ['rpm', '7200rpm'], ['form', '3.5 inch SATA']], ['hdd'], 42),
    C('Ổ cứng HDD Toshiba N300 6TB NAS', 'hdd-3.jpg', 4290, 4790, [['capacity', '6TB'], ['rpm', '7200rpm'], ['form', 'Chuyên NAS']], ['hdd'], 4),
    C('Ổ cứng HDD Seagate SkyHawk 4TB chuyên camera', 'hdd-1.jpg', 2590, 2890, [['capacity', '4TB'], ['rpm', '5400rpm'], ['form', 'Chuyên camera']], ['hdd'], 10),

    /* Linh kiện: Nguồn */
    C('Nguồn Cooler Master MWE 550 Bronze V2', 'psu-1.jpg', 1090, 1290, [['watt', '550W'], ['cert', '80 Plus Bronze'], ['form', 'ATX']], ['psu'], 36),
    C('Nguồn Corsair RM850e 850W Gold', 'psu-1.jpg', 2990, 3390, [['watt', '850W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.1, Full Modular']], ['psu'], 12),
    C('Nguồn Corsair HX1500i 1500W Platinum', 'psu-1.jpg', 8490, 9290, [['watt', '1500W'], ['cert', '80 Plus Platinum'], ['form', 'ATX 3.1, Full Modular']], ['psu'], 1),
    C('Nguồn ASUS TUF Gaming 750W Gold', 'psu-1.jpg', 2490, 2790, [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.0, Full Modular']], ['psu'], 14),
    C('Nguồn DeepCool PK650D 650W Bronze', 'psu-1.jpg', 1090, 1290, [['watt', '650W'], ['cert', '80 Plus Bronze'], ['form', 'ATX']], ['psu'], 29),
    C('Nguồn Thermaltake Toughpower GF A3 1050W Gold', 'psu-1.jpg', 3690, 4190, [['watt', '1050W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.0, Full Modular']], ['psu'], 4),
    C('Nguồn Seasonic Focus GX-750 750W Gold', 'psu-1.jpg', 2790, 3090, [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX, Full Modular']], ['psu'], 7),
    C('Nguồn be quiet! Pure Power 12 1000W Gold', 'psu-2.jpg', 3290, 3690, [['watt', '1000W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.1']], ['psu'], 3),

    /* Linh kiện: Tản nhiệt */
    C('Tản nhiệt khí DeepCool AG400 ARGB', 'cooler-2.jpg', 490, 590, [['radiator', '1 tháp, 1 quạt'], ['tdp', '220W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 41),
    C('Tản nhiệt khí Thermalright Phantom Spirit 120 SE', 'cooler-2.jpg', 990, 1190, [['radiator', '2 tháp, 2 quạt'], ['tdp', '265W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 33),
    C('Tản nhiệt khí Noctua NH-D15 G2', 'cooler-2.jpg', 3990, 4390, [['radiator', '2 tháp, 2 quạt 140mm'], ['tdp', '300W'], ['socket', 'LGA 1851 / AM5']], ['cooler'], 4),
    C('Tản nhiệt nước AIO DeepCool LE520 240mm', 'cooler-3.jpg', 1490, 1790, [['radiator', 'Radiator 240mm'], ['tdp', '250W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 22),
    C('Tản nhiệt nước AIO ASUS ROG Ryujin III 360 ARGB', 'cooler-1.jpg', 8490, 9290, [['radiator', 'Radiator 360mm, màn LCD'], ['tdp', '350W'], ['socket', 'LGA 1851 / AM5']], ['cooler'], 3),
    C('Tản nhiệt nước AIO Cooler Master MasterLiquid 360L Core', 'cooler-1.jpg', 2290, 2590, [['radiator', 'Radiator 360mm'], ['tdp', '300W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 11),
    C('Tản nhiệt nước AIO NZXT Kraken Elite 360 RGB', 'cooler-3.jpg', 7490, 8290, [['radiator', 'Radiator 360mm, màn LCD'], ['tdp', '350W'], ['socket', 'LGA 1851 / AM5']], ['cooler'], 2),
    C('Tản nhiệt nước AIO Thermalright Frozen Warframe 360', 'cooler-1.jpg', 2190, 2490, [['radiator', 'Radiator 360mm, màn LCD'], ['tdp', '300W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 9, 'Mới'),

    /* Linh kiện: Case */
    C('Case NZXT H6 Flow RGB', 'case-1.jpg', 2990, 3390, [['form', 'Mid Tower, ATX'], ['fan', '3 fan RGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], 9),
    C('Case Lian Li Lancool 216 RGB', 'case-3.jpg', 2490, 2790, [['form', 'Mid Tower, E-ATX'], ['fan', '3 fan ARGB'], ['material', 'Kính cường lực']], ['case'], 12),
    C('Case Corsair 3500X ARGB', 'case-1.jpg', 2690, 2990, [['form', 'Mid Tower, ATX'], ['fan', '3 fan ARGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], 6),
    C('Case ASUS TUF Gaming GT502', 'case-3.jpg', 3290, 3690, [['form', 'Mid Tower, ATX'], ['fan', 'Không kèm fan'], ['material', 'Kính cường lực 2 mặt']], ['case'], 7),
    C('Case MSI MAG PANO M100R PZ', 'case-2.jpg', 1690, 1890, [['form', 'Mini Tower, Micro-ATX'], ['fan', '4 fan ARGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], 15),
    C('Case DeepCool CC560 V2', 'case-2.jpg', 1190, 1390, [['form', 'Mid Tower, ATX'], ['fan', '4 fan ARGB'], ['material', 'Kính cường lực']], ['case'], 33),
    C('Case Xigmatek Aquarius S (mATX, 4 fan)', 'case-3.jpg', 990, 1190, [['form', 'Mini Tower, Micro-ATX'], ['fan', '4 fan ARGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], 41),
    C('Case Montech XR (bể cá, có màn hình)', 'case-1.jpg', 2190, 2490, [['form', 'Mid Tower, ATX'], ['fan', '3 fan ARGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], 5, 'Mới'),
    C('Case Jonsbo Z20 (mATX nhỏ gọn)', 'case-2.jpg', 1990, 2290, [['form', 'Micro-ATX nhỏ gọn'], ['fan', 'Không kèm fan'], ['material', 'Nhôm + kính']], ['case'], 6),
    C('Case Fractal Design North (gỗ óc chó)', 'case-1.jpg', 3990, 4390, [['form', 'Mid Tower, ATX'], ['fan', '2 fan 140mm'], ['material', 'Gỗ + lưới thép']], ['case'], 3),

    /* Bàn ghế */
    CHAIR('Ghế gaming E-Dra Sirius EGC224', 'chair-1.jpg', 2290, 2890, 'Da PU', 'Tải 130kg', ['edra'], 26),
    CHAIR('Ghế công thái học E-Dra EEC218 lưng lưới', 'chair-3.jpg', 1990, 2490, 'Lưới thoáng khí', 'Tải 120kg', ['edra'], 31),
    CHAIR('Ghế công thái học Warrior WEC507 Ergonomic', 'chair-2.jpg', 5490, 6290, 'Lưới cao cấp, tựa tay 4D', 'Tải 150kg', ['warrior'], 6),
    CHAIR('Ghế gaming Warrior Raider WGC206', 'chair-1.jpg', 2690, 3290, 'Da PU, gối cổ + lưng', 'Tải 130kg', ['warrior'], 15),
    CHAIR('Ghế gaming Corsair TC200 Leatherette', 'chair-2.jpg', 7990, 8990, 'Da PU cao cấp', 'Tải 136kg', ['corsair'], 3),
    CHAIR('Ghế gaming Cougar Hotrod Royal', 'chair-3.jpg', 6490, 7290, 'Da PVC thoáng khí', 'Tải 136kg', ['cougar'], 2),
    DESK('Bàn gaming E-Dra EGT1260 chữ K 1m2', 'desk-2.jpg', 1490, 1790, '120 x 60cm', 'Mặt carbon, khung thép', ['edra'], 23),
    DESK('Bàn gaming Warrior WGT201 chữ Z có LED 1m4', 'desk-1.jpg', 2290, 2790, '140 x 60cm', 'Mặt carbon, LED RGB', ['warrior'], 9),
    DESK('Bàn nâng hạ điện MKPC Smart Desk 1m4', 'desk-2.jpg', 4490, 5290, '140 x 70cm', 'Motor đơn, 4 nút nhớ', ['mkpc'], 7, 'Mới'),
    DESK('Bàn gaming chữ L E-Dra EGT1612L 1m6', 'desk-1.jpg', 3490, 3990, '160 x 120cm', 'Mặt MDF phủ carbon', ['edra'], 4),

    /* Phụ kiện */
    AC('Loa Edifier R1280DB Bluetooth', 'speaker-2.jpg', 2490, 2890, [['driver', '2.0 kênh, 42W'], ['wireless', 'Bluetooth + Optical']], ['speaker', 'edifier'], 19),
    AC('Loa Microlab B77BT Bluetooth', 'speaker-1.jpg', 690, 850, [['driver', '2.0 kênh, 20W'], ['wireless', 'Bluetooth + AUX']], ['speaker', 'microlab'], 28),
    AC('Loa Logitech Z333 2.1', 'speaker-1.jpg', 1290, 1590, [['driver', '2.1 kênh, 40W'], ['wired', 'Jack 3.5mm / RCA']], ['speaker', 'logitech'], 22),
    AC('Loa Creative Pebble Pro RGB Bluetooth', 'speaker-1.jpg', 1390, 1690, [['driver', '2.0 kênh, 30W'], ['wireless', 'USB-C + Bluetooth']], ['speaker', 'creative'], 12),
    AC('Webcam Logitech Brio 300 Full HD', 'webcam-1.jpg', 1390, 1690, [['res', 'Full HD 1080p'], ['wired', 'USB-C']], ['webcam', 'logitech'], 16),
    AC('Webcam Logitech Brio 4K Pro', 'webcam-1.jpg', 4990, 5590, [['res', '4K 30fps, HDR'], ['wired', 'USB-C']], ['webcam', 'logitech'], 4),
    AC('Webcam Elgato Facecam MK.2', 'webcam-1.jpg', 3290, 3690, [['res', 'Full HD 60fps'], ['wired', 'USB-C']], ['webcam', 'elgato'], 5),
    AC('Micro HyperX SoloCast USB', 'mic-1.jpg', 1190, 1390, [['driver', 'Condenser cardioid'], ['wired', 'USB']], ['mic', 'hyperx'], 27),
    AC('Micro Razer Seiren V3 Mini', 'mic-2.jpg', 1390, 1690, [['driver', 'Condenser cardioid'], ['wired', 'USB-C']], ['mic', 'razer'], 13),
    AC('Micro Fifine AM8 USB/XLR RGB', 'mic-3.jpg', 1090, 1290, [['driver', 'Dynamic cardioid'], ['wired', 'USB + XLR']], ['mic', 'fifine'], 34, 'Bán chạy'),
    AC('Tay cầm Microsoft Xbox Wireless Controller kèm cáp USB-C', 'gamepad-1.jpg', 1590, 1790, [['wireless', 'Bluetooth / USB-C'], ['platform', 'PC / Xbox / Mobile']], ['gamepad', 'microsoft'], 21),
    AC('Tay cầm 8BitDo Ultimate 2 Wireless Hall Effect', 'gamepad-1.jpg', 1290, 1490, [['wireless', '2.4GHz / Bluetooth'], ['platform', 'PC / Switch / Android']], ['gamepad', '8bitdo'], 9, 'Mới'),
    AC('Ổ cứng di động Samsung T7 Shield 2TB', 'extssd-2.jpg', 4490, 4990, [['capacity', '2TB'], ['speed', '1050MB/s'], ['ports', 'USB-C 3.2, IP65']], ['extssd', 'samsung'], 8),
    AC('Ổ cứng di động Seagate One Touch 2TB HDD', 'hdd-3.jpg', 1990, 2290, [['capacity', '2TB'], ['rpm', 'HDD 2.5 inch'], ['ports', 'USB 3.0']], ['extssd', 'seagate'], 14),
    AC('Hub USB-C UGREEN 10 in 1 (HDMI, LAN, SD)', 'switch-1.jpg', 1090, 1290, [['ports', 'HDMI 4K, LAN, 3 USB, SD, PD 100W'], ['wired', 'USB-C']], ['hub', 'ugreen'], 17),

    /* Thiết bị mạng */
    NW('Router WiFi 6 TP-Link Archer AX55 AX3000', 'router-1.jpg', 1690, 1990, 'WiFi 6 AX3000', '5 cổng Gigabit', ['tplink'], 31),
    NW('Router WiFi 6 TP-Link Archer AX73 AX5400', 'router-1.jpg', 2690, 2990, 'WiFi 6 AX5400', '5 cổng Gigabit', ['tplink'], 12),
    NW('Router WiFi 7 ASUS RT-BE88U BE7200', 'router-3.jpg', 8490, 9290, 'WiFi 7 BE7200', 'Cổng 10G + 4x 2.5G', ['asus'], 3, 'Mới'),
    NW('Router gaming ASUS ROG Rapture GT-AX6000', 'router-3.jpg', 7490, 8290, 'WiFi 6 AX6000', 'Cổng 2.5G gaming', ['asus'], 4),
    NW('Bộ WiFi Mesh TP-Link Deco X50 (3 cục)', 'router-2.jpg', 5990, 6690, 'WiFi 6 Mesh AX3000', '3 cổng Gigabit/cục', ['tplink'], 8),
    NW('Bộ phát WiFi Mercusys MR30G AC1200', 'router-3.jpg', 450, 550, 'WiFi 5 AC1200', '3 cổng Gigabit', ['mercusys'], 66, 'Bán chạy'),
    NW('Switch TP-Link TL-SG108 8 cổng Gigabit vỏ thép', 'switch-1.jpg', 490, 590, '8 cổng Gigabit', 'Vỏ thép, không quạt', ['tplink'], 39),
    NW('Switch TP-Link TL-SG108PE 8 cổng PoE+ quản lý', 'switch-2.jpg', 1690, 1890, '8 cổng Gigabit, 4 PoE+', 'Quản lý web, VLAN', ['tplink'], 7),
    NW('Card WiFi PCIe ASUS PCE-AXE59BT WiFi 6E', 'switch-2.jpg', 1390, 1590, 'WiFi 6E AXE5400 + Bluetooth 5.2', 'PCIe x1', ['asus'], 6),

    /* Phần mềm */
    SW('Microsoft Windows 11 Pro for Workstations', 'software-3.jpg', 6990, 7990, 'Vĩnh viễn, 1 PC', 'Windows', ['microsoft'], 3),
    SW('Microsoft Office LTSC Standard 2024', 'software-2.jpg', 9990, 10990, 'Vĩnh viễn, doanh nghiệp', 'Windows', ['microsoft'], 2),
    SW('Phần mềm diệt virus Kaspersky Premium 3 thiết bị 1 năm', 'software-1.jpg', 690, 890, '12 tháng, 3 thiết bị', 'Windows / macOS / Android / iOS', ['kaspersky'], 15),
    SW('Phần mềm diệt virus ESET NOD32 Antivirus 3 PC 1 năm', 'software-3.jpg', 590, 750, '12 tháng, 3 PC', 'Windows', ['eset'], 18),
    SW('Adobe Creative Cloud All Apps 12 tháng', 'software-4.jpg', 15990, 17490, '12 tháng, 1 người, 20+ ứng dụng', 'Windows / macOS', ['adobe'], 2),

    /* Hàng cũ */
    USED('components', 'Card màn hình MSI GeForce RTX 3060 Ti Ventus 2X 8GB (Cũ)', 'vga-3.jpg', 4290, 6990, [['gpu', '8GB GDDR6'], ['condition', 'Đẹp 95%'], ['fan', '2 quạt']], ['vga'], 11, 3),
    USED('components', 'Card màn hình GIGABYTE RTX 2060 SUPER 8GB (Cũ)', 'vga-1.jpg', 2990, 4990, [['gpu', '8GB GDDR6'], ['condition', 'Đẹp 90%'], ['fan', '2 quạt']], ['vga'], 9, 1),
    USED('components', 'Card màn hình ASUS Dual Radeon RX 6600 8GB (Cũ)', 'vga-2.jpg', 2490, 3990, [['gpu', '8GB GDDR6'], ['condition', 'Like new 98%'], ['fan', '2 quạt']], ['vga', 'amd'], 7, 3),
    USED('components', 'CPU Intel Core i7-12700F (Cũ - tray)', 'cpu-2.jpg', 3490, 4990, [['cpu', '12C / 20T'], ['condition', 'Like new 99%'], ['socket', 'LGA 1700']], ['cpu'], 6, 3),
    USED('components', 'CPU AMD Ryzen 7 5800X (Cũ)', 'cpu-1.jpg', 2790, 3990, [['cpu', '8C / 16T'], ['condition', 'Like new 99%'], ['socket', 'AM4']], ['cpu'], 5, 3),
    USED('components', 'RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz (Cũ)', 'ram-1.jpg', 590, 1090, [['ram', '16GB DDR4'], ['condition', 'Đẹp 95%'], ['speed', '3200MHz']], ['ram'], 13, 3),
    USED('components', 'Mainboard MSI B660M-A PRO DDR4 (Cũ)', 'mainboard-2.jpg', 1490, 2490, [['chipset', 'Intel B660'], ['socket', 'LGA 1700'], ['condition', 'Đẹp 95%']], ['mainboard'], 4, 3),
    USED('laptop', 'Laptop Dell Latitude 5420 i5-1145G7 (Cũ)', 'laptop-office-4.jpg', 7490, 10990, [['cpu', 'i5-1145G7'], ['ram', '16GB'], ['ssd', '256GB'], ['condition', 'Đẹp 95%']], ['dell', 'laptop'], 15, 6),
    USED('laptop', 'Laptop HP EliteBook 840 G8 i5-1135G7 (Cũ)', 'laptop-office-3.jpg', 7990, 11490, [['cpu', 'i5-1135G7'], ['ram', '16GB'], ['ssd', '512GB'], ['condition', 'Đẹp 95%']], ['hp', 'laptop'], 12, 6),
    USED('laptop-gaming', 'Laptop gaming Lenovo Legion 5 15ACH6H (Cũ)', 'laptop-gaming-2.jpg', 16990, 23990, [['cpu', 'Ryzen 7 5800H'], ['gpu', 'RTX 3060'], ['ram', '16GB'], ['condition', 'Đẹp 95%']], ['lenovo', 'laptop'], 8, 6),
    USED('monitor', 'Màn hình Samsung Odyssey G5 27" 2K cong (Cũ)', 'monitor-3.jpg', 3290, 5490, [['size', '27 inch cong'], ['panel', 'VA'], ['hz', '144Hz'], ['condition', 'Đẹp 95%']], ['samsung'], 6, 3),
    USED('pc', 'PC văn phòng HP ProDesk 400 G6 SFF i5-9500 (Cũ)', 'pc-office.jpg', 4490, 6490, [['cpu', 'i5-9500'], ['ram', '8GB DDR4'], ['ssd', '256GB SSD'], ['condition', 'Đẹp 95%']], ['office'], 17, 6),

    /* ====== Đợt 4 ====== */
    /* Laptop gaming */
    LG('Laptop gaming ASUS TUF Gaming F15 FX507VV4', 'laptop-gaming-3.jpg', 25990, 29490, 'i7-13700H', 'RTX 4060', '16GB', '512GB', '15.6" 144Hz', ['asus'], 19),
    LG('Laptop gaming ASUS TUF Gaming A15 FA506NFR', 'laptop-gaming-2.jpg', 17990, 20990, 'Ryzen 7 7435HS', 'RTX 2050', '16GB', '512GB', '15.6" 144Hz', ['asus'], 41, 'Bán chạy'),
    LG('Laptop gaming ASUS ROG Flow Z13 GZ302EA', 'laptop-gaming-1.jpg', 54990, 59990, 'Ryzen AI Max 390', 'Radeon 8050S', '32GB', '1TB', '13.4" 2.5K 180Hz cảm ứng', ['asus'], 2, 'Mới'),
    LG('Laptop gaming ASUS ROG Zephyrus G16 GU605CW', 'laptop-gaming-4.jpg', 72990, 78990, 'Ultra 9 285H', 'RTX 5080', '32GB', '2TB', '16" 2.5K OLED 240Hz', ['asus'], 2),
    LG('Laptop gaming ASUS V16 V3607VJ', 'laptop-gaming-3.jpg', 21490, 24490, 'i5-210H', 'RTX 3050', '16GB', '512GB', '16" 144Hz', ['asus'], 9),
    LG('Laptop gaming Acer Nitro 16 AN16-42', 'laptop-gaming-2.jpg', 24990, 28490, 'Ryzen 5 8645HS', 'RTX 4050', '16GB', '512GB', '16" 165Hz', ['acer'], 13),
    LG('Laptop gaming Acer Predator Helios 16 PH16-72', 'laptop-gaming-1.jpg', 49990, 54990, 'i9-14900HX', 'RTX 4070', '32GB', '1TB', '16" 2.5K 240Hz', ['acer'], 3),
    LG('Laptop gaming Acer Nitro V 14 ANV14-61', 'laptop-gaming-4.jpg', 22990, 25990, 'Ryzen 7 8845HS', 'RTX 4050', '16GB', '512GB', '14.5" 2.5K 120Hz', ['acer'], 7),
    LG('Laptop gaming Acer Aspire 7 A715-59G', 'laptop-gaming-3.jpg', 17490, 19990, 'i5-12450H', 'RTX 3050', '16GB', '512GB', '15.6" 144Hz', ['acer'], 22),
    LG('Laptop gaming MSI Katana A15 AI B8VF', 'laptop-gaming-2.jpg', 27990, 31490, 'Ryzen 7 8845HS', 'RTX 4060', '16GB', '1TB', '15.6" 2.5K 165Hz', ['msi'], 8),
    LG('Laptop gaming MSI Cyborg 15 AI A1VEK', 'laptop-gaming-1.jpg', 22990, 25990, 'Ultra 7 155H', 'RTX 4050', '16GB', '512GB', '15.6" 144Hz', ['msi'], 10),
    LG('Laptop gaming MSI Vector 16 HX AI A2XWHG', 'laptop-gaming-4.jpg', 54990, 59990, 'Ultra 9 275HX', 'RTX 5070 Ti', '32GB', '1TB', '16" 2.5K 240Hz', ['msi'], 2, 'Mới'),
    LG('Laptop gaming MSI Stealth 16 AI Studio A1VGG', 'laptop-gaming-3.jpg', 59990, 65990, 'Ultra 9 185H', 'RTX 4070', '32GB', '2TB', '16" 2.5K 240Hz', ['msi'], 2),
    LG('Laptop gaming Lenovo LOQ 15ARP9 Ryzen 5', 'laptop-gaming-2.jpg', 19990, 22490, 'Ryzen 5 7235HS', 'RTX 3050', '12GB', '512GB', '15.6" 144Hz', ['lenovo'], 34),
    LG('Laptop gaming Lenovo Legion 7 16IRX9', 'laptop-gaming-1.jpg', 54990, 59990, 'i7-14700HX', 'RTX 4070', '32GB', '1TB', '16" 3.2K 165Hz', ['lenovo'], 3),
    LG('Laptop gaming Lenovo Legion Pro 5 16IRX10', 'laptop-gaming-4.jpg', 49990, 54990, 'Ultra 7 255HX', 'RTX 5070', '32GB', '1TB', '16" 2.5K OLED 240Hz', ['lenovo'], 4, 'Mới'),
    LG('Laptop gaming HP Victus 15-fa1155TX', 'laptop-gaming-3.jpg', 18990, 21490, 'i5-12450H', 'RTX 2050', '16GB', '512GB', '15.6" 144Hz', ['hp'], 29),
    LG('Laptop gaming HP OMEN Transcend 14-fb0014TU', 'laptop-gaming-2.jpg', 47990, 52990, 'Ultra 9 185H', 'RTX 4060', '32GB', '1TB', '14" 2.8K OLED 120Hz', ['hp'], 2),
    LG('Laptop gaming Dell G16 7630', 'laptop-gaming-1.jpg', 36990, 40990, 'i7-13650HX', 'RTX 4060', '16GB', '1TB', '16" 2.5K 240Hz', ['dell'], 5),
    LG('Laptop gaming GIGABYTE G6 KF', 'laptop-gaming-4.jpg', 26490, 29990, 'i7-13620H', 'RTX 4060', '16GB', '512GB', '16" 165Hz', ['gigabyte'], 6),

    /* Laptop văn phòng */
    LO('Laptop ASUS Vivobook 15 OLED A1505ZA', 'laptop-office-1.jpg', 14990, 16990, 'i5-12500H', 'Iris Xe', '16GB', '512GB', '15.6" OLED', ['asus'], 37),
    LO('Laptop ASUS Vivobook S16 OLED S5606MA', 'laptop-office-2.jpg', 25990, 28490, 'Ultra 7 155H', 'Intel Arc', '16GB', '1TB', '16" 3.2K OLED 120Hz', ['asus'], 5),
    LO('Laptop ASUS Zenbook 14 OLED UM3406HA', 'laptop-office-3.jpg', 22990, 25490, 'Ryzen 7 8840HS', 'Radeon 780M', '16GB', '512GB', '14" 3K OLED', ['asus'], 8),
    LO('Laptop ASUS Zenbook Duo UX8406MA (2 màn hình)', 'laptop-office-4.jpg', 42990, 46990, 'Ultra 7 155H', 'Intel Arc', '32GB', '1TB', '2 × 14" 3K OLED cảm ứng', ['asus'], 3, 'Mới'),
    LO('Laptop Acer Aspire Go 15 AG15-31P', 'laptop-office-1.jpg', 8990, 10490, 'i3-N305', 'UHD Graphics', '8GB', '512GB', '15.6" FHD', ['acer'], 49),
    LO('Laptop Acer Swift Lite 14 SFL14-51M', 'laptop-office-2.jpg', 15990, 17990, 'Ultra 5 125U', 'Intel Graphics', '16GB', '512GB', '14" WUXGA', ['acer'], 11),
    LO('Laptop Acer TravelMate P2 TMP214-55', 'laptop-office-3.jpg', 14490, 15990, 'i5-1335U', 'Iris Xe', '8GB', '512GB', '14" FHD', ['acer'], 9),
    LO('Laptop Lenovo IdeaPad 1 15AMN7', 'laptop-office-4.jpg', 8490, 9990, 'Ryzen 3 7320U', 'Radeon 610M', '8GB', '256GB', '15.6" FHD', ['lenovo'], 56, 'Bán chạy'),
    LO('Laptop Lenovo IdeaPad Slim 5 16IRL8', 'laptop-office-1.jpg', 18490, 20490, 'i5-13420H', 'UHD Graphics', '16GB', '512GB', '16" WUXGA', ['lenovo'], 14),
    LO('Laptop Lenovo ThinkPad T14 Gen 5', 'laptop-office-2.jpg', 33990, 36990, 'Ultra 7 155U', 'Intel Graphics', '16GB', '512GB', '14" WUXGA', ['lenovo'], 4),
    LO('Laptop Lenovo ThinkPad X13 Gen 5', 'laptop-office-3.jpg', 31990, 34990, 'Ultra 5 125U', 'Intel Graphics', '16GB', '512GB', '13.3" WUXGA, 1.1kg', ['lenovo'], 3),
    LO('Laptop Lenovo Yoga 7 2-in-1 14AHP9', 'laptop-office-4.jpg', 23990, 26490, 'Ryzen 7 8840HS', 'Radeon 780M', '16GB', '1TB', '14" 2.2K OLED cảm ứng', ['lenovo'], 6),
    LO('Laptop Dell Inspiron 14 7440 2-in-1', 'laptop-office-1.jpg', 22990, 25490, 'i5-1335U', 'Iris Xe', '16GB', '512GB', '14" FHD+ cảm ứng', ['dell'], 7),
    LO('Laptop Dell Vostro 3440', 'laptop-office-2.jpg', 14990, 16490, 'i5-1334U', 'Iris Xe', '8GB', '512GB', '14" FHD+', ['dell'], 19),
    LO('Laptop Dell XPS 14 9440', 'laptop-office-3.jpg', 52990, 57990, 'Ultra 7 155H', 'RTX 4050', '32GB', '1TB', '14.5" 3.2K OLED cảm ứng', ['dell'], 2),
    LO('Laptop HP 15-fc0085AU', 'laptop-office-4.jpg', 11490, 12990, 'Ryzen 5 7520U', 'Radeon 610M', '8GB', '512GB', '15.6" FHD', ['hp'], 33),
    LO('Laptop HP Pavilion x360 14-ek1047TU', 'laptop-office-1.jpg', 17990, 19990, 'i5-1335U', 'Iris Xe', '16GB', '512GB', '14" FHD cảm ứng', ['hp'], 10),
    LO('Laptop HP EliteBook 640 G11', 'laptop-office-2.jpg', 26990, 29490, 'Ultra 5 125U', 'Intel Graphics', '16GB', '512GB', '14" WUXGA', ['hp'], 4),
    LO('Laptop HP Envy 16-h1053TX', 'laptop-office-3.jpg', 39990, 43990, 'i7-13700H', 'RTX 4060', '16GB', '1TB', '16" 2.5K 120Hz', ['hp'], 3),
    LO('Laptop MSI Modern 15 H AI C1MG', 'laptop-office-4.jpg', 17490, 19490, 'Ultra 5 125H', 'Intel Arc', '16GB', '512GB', '15.6" FHD', ['msi'], 8),
    LO('Laptop MSI Venture A16 AI+ A3HMG', 'laptop-office-1.jpg', 28990, 31990, 'Ryzen AI 9 365', 'Radeon 880M', '32GB', '1TB', '16" 2.5K 120Hz', ['msi'], 2, 'Mới'),
    LO('Laptop Apple MacBook Air 15 M4 16GB 512GB', 'laptop-office-2.jpg', 37490, 39990, 'Apple M4', 'GPU 10 nhân', '16GB', '512GB', '15.3" Liquid Retina', ['apple'], 6, 'Mới'),
    LO('Laptop Apple MacBook Pro 16 M4 Max 36GB 1TB', 'laptop-office-3.jpg', 89990, 94990, 'Apple M4 Max', 'GPU 32 nhân', '36GB', '1TB', '16.2" Liquid Retina XDR', ['apple'], 1),
    LO('Laptop LG gram Pro 16 16Z90SP', 'laptop-office-4.jpg', 38990, 42990, 'Ultra 7 155H', 'Intel Arc', '16GB', '1TB', '16" 2.5K OLED 120Hz', ['lg'], 2),
    LO('Laptop Samsung Galaxy Book4 Pro 14', 'laptop-office-1.jpg', 35990, 39990, 'Ultra 7 155H', 'Intel Arc', '16GB', '512GB', '14" 3K AMOLED cảm ứng', ['samsung'], 3),
    LO('Laptop GIGABYTE AERO 14 OLED BMF', 'laptop-office-2.jpg', 31990, 35990, 'i7-13700H', 'RTX 4050', '16GB', '1TB', '14" 2.8K OLED', ['gigabyte'], 2),

    /* PC */
    PC('PC MKPC Gaming i3 14100F - RTX 3050 6GB', 'pc-1.jpg', 12490, 13790, 'i3-14100F', 'RTX 3050', '16GB DDR4', '500GB NVMe', ['gaming', 'intel'], 23),
    PC('PC MKPC Gaming Ryzen 5 5600 - RTX 4060 8GB', 'pc-4.jpg', 17990, 19790, 'Ryzen 5 5600', 'RTX 4060', '16GB DDR4', '500GB NVMe', ['gaming', 'amd'], 38, 'Bán chạy', 'Tặng bàn phím + chuột'),
    PC('PC MKPC Gaming i5 14400F - RTX 5060 Ti 16GB', 'pc-3.jpg', 27990, 30490, 'i5-14400F', 'RTX 5060 Ti', '32GB DDR5', '1TB NVMe', ['gaming', 'intel'], 9, 'Mới'),
    PC('PC MKPC Gaming Ryzen 5 7500F - RTX 5070 12GB', 'pc-2.jpg', 34990, 37990, 'Ryzen 5 7500F', 'RTX 5070', '32GB DDR5', '1TB NVMe', ['gaming', 'amd'], 7),
    PC('PC MKPC Gaming i7 14700F - RTX 4070 Super', 'setup-3.jpg', 44990, 48490, 'i7-14700F', 'RTX 4070 S', '32GB DDR5', '1TB NVMe', ['gaming', 'intel'], 5),
    PC('PC MKPC Gaming Ryzen 7 9800X3D - RTX 5080', 'setup-3.jpg', 79990, 85990, 'R7 9800X3D', 'RTX 5080', '64GB DDR5', '2TB NVMe', ['gaming', 'amd'], 3),
    PC('PC MKPC Gaming Ultra 7 265K - RTX 5070 Ti 16GB', 'pc-2.jpg', 52990, 56990, 'Ultra 7 265K', 'RTX 5070 Ti', '32GB DDR5', '2TB NVMe', ['gaming', 'intel'], 3, 'Mới'),
    PC('PC MKPC Gaming Ryzen 5 7600 - RX 9070 XT 16GB', 'pc-4.jpg', 39990, 43490, 'Ryzen 5 7600', 'RX 9070 XT', '32GB DDR5', '1TB NVMe', ['gaming', 'amd'], 4, 'Mới'),
    PC('PC MKPC Mini ITX Ryzen 7 7700 - RTX 4060 Ti', 'pc-3.jpg', 32990, 35990, 'Ryzen 7 7700', 'RTX 4060 Ti', '32GB DDR5', '1TB NVMe', ['gaming', 'amd'], 2),
    PC('PC MKPC Esport i5 12400F - GTX 1650', 'pc-1.jpg', 11990, 12990, 'i5-12400F', 'GTX 1650', '16GB DDR4', '256GB NVMe', ['gaming', 'intel'], 29),
    PC('PC MKPC Office i5 12400 - 8GB - SSD 256GB', 'pc-office.jpg', 8990, 9890, 'i5-12400', 'UHD 730', '8GB DDR4', '256GB NVMe', ['office', 'intel'], 26),
    PC('PC MKPC Office Ryzen 7 8700G - 32GB', 'setup-1.jpg', 16990, 18490, 'Ryzen 7 8700G', 'Radeon 780M', '32GB DDR5', '1TB NVMe', ['office', 'amd'], 6),
    PC('PC MKPC Office i7 14700 - 32GB DDR5', 'pc-office.jpg', 19990, 21990, 'i7-14700', 'UHD 770', '32GB DDR5', '1TB NVMe', ['office', 'intel'], 5),
    PC('PC MKPC Đồ họa i7 14700K - RTX 4070 Ti Super', 'pc-2.jpg', 59990, 64990, 'i7-14700K', 'RTX 4070 Ti S', '64GB DDR5', '2TB NVMe', ['design', 'intel'], 2),
    PC('PC MKPC Đồ họa Ryzen 9 7950X - RTX 4080 Super', 'setup-3.jpg', 84990, 91990, 'Ryzen 9 7950X', 'RTX 4080 S', '64GB DDR5', '2TB NVMe', ['design', 'amd'], 1),

    /* Màn hình */
    MON('Màn hình ASUS VY249HF 24" IPS 100Hz Eye Care', 'monitor-2.jpg', 2390, 2790, '23.8 inch', 'IPS', '100Hz', 'Full HD', ['asus'], 33),
    MON('Màn hình ASUS ROG Strix XG259CMS 25" 310Hz', 'monitor-1.jpg', 7990, 8990, '24.5 inch', 'Fast IPS', '310Hz', 'Full HD', ['asus'], 6),
    MON('Màn hình ASUS ProArt PA248QV 24" 16:10 đồ họa', 'monitor-5.jpg', 5490, 6190, '24.1 inch', 'IPS 100% sRGB', '75Hz', 'WUXGA', ['asus'], 9),
    MON('Màn hình ASUS ROG Swift PG32UCDM 32" 4K OLED 240Hz', 'monitor-3.jpg', 32990, 36990, '31.5 inch', 'QD-OLED', '240Hz', '4K UHD', ['asus'], 2),
    MON('Màn hình LG 27MR400-B 27" IPS 100Hz', 'monitor-2.jpg', 2790, 3290, '27 inch', 'IPS', '100Hz', 'Full HD', ['lg'], 41, 'Bán chạy'),
    MON('Màn hình LG UltraGear 24GS60F 24" IPS 180Hz', 'monitor-1.jpg', 3190, 3690, '23.8 inch', 'IPS', '180Hz', 'Full HD', ['lg'], 19),
    MON('Màn hình LG UltraWide 34WQ60C 34" cong', 'monitor-3.jpg', 7490, 8490, '34 inch cong', 'IPS', '100Hz', 'UWQHD', ['lg'], 6),
    MON('Màn hình LG 32UN650-W 32" 4K HDR', 'monitor-5.jpg', 8990, 9990, '31.5 inch', 'IPS HDR10', '60Hz', '4K UHD', ['lg'], 5),
    MON('Màn hình Samsung Essential S36GD 27" IPS 100Hz', 'monitor-2.jpg', 2690, 3190, '27 inch', 'IPS', '100Hz', 'Full HD', ['samsung'], 22),
    MON('Màn hình Samsung Odyssey G3 LS24DG302 24" 180Hz', 'monitor-1.jpg', 2990, 3490, '24 inch', 'VA', '180Hz', 'Full HD', ['samsung'], 17),
    MON('Màn hình Samsung Odyssey OLED G8 32" 4K 240Hz', 'monitor-3.jpg', 29990, 33990, '32 inch', 'QD-OLED', '240Hz', '4K UHD', ['samsung'], 2),
    MON('Màn hình MSI G244F E2 24" IPS 180Hz', 'monitor-4.jpg', 2790, 3290, '23.8 inch', 'Rapid IPS', '180Hz', 'Full HD', ['msi'], 26),
    MON('Màn hình MSI MAG 271QPX QD-OLED E2 27" 240Hz', 'monitor-3.jpg', 16990, 19490, '26.5 inch', 'QD-OLED', '240Hz', '2K QHD', ['msi'], 3),
    MON('Màn hình Dell P2425H 24" IPS 100Hz', 'monitor-5.jpg', 3690, 4190, '23.8 inch', 'IPS', '100Hz', 'Full HD', ['dell'], 14),
    MON('Màn hình Dell Alienware AW2725DF 27" QD-OLED 360Hz', 'monitor-3.jpg', 21990, 24990, '26.7 inch', 'QD-OLED', '360Hz', '2K QHD', ['dell'], 2),
    MON('Màn hình GIGABYTE GS25F14 25" IPS 200Hz', 'monitor-1.jpg', 2990, 3490, '24.5 inch', 'SS IPS', '200Hz', 'Full HD', ['gigabyte'], 12),
    MON('Màn hình AOC 24B20JH2 24" IPS 100Hz', 'monitor-2.jpg', 1890, 2190, '23.8 inch', 'IPS', '100Hz', 'Full HD', ['aoc'], 31),
    MON('Màn hình AOC CU34G2XP 34" cong 180Hz', 'monitor-3.jpg', 7990, 8990, '34 inch cong', 'VA', '180Hz', 'UWQHD', ['aoc'], 5),
    MON('Màn hình ViewSonic VX2479-HD-PRO 24" IPS 180Hz', 'monitor-1.jpg', 2790, 3190, '23.8 inch', 'IPS', '180Hz', 'Full HD', ['viewsonic'], 16),
    MON('Màn hình Philips 27M2N3200S 27" IPS 180Hz', 'monitor-4.jpg', 3690, 4290, '27 inch', 'Fast IPS', '180Hz', 'Full HD', ['philips'], 11),
    MON('Màn hình BenQ MOBIUZ EX2710Q 27" 2K 165Hz', 'monitor-4.jpg', 7490, 8490, '27 inch', 'IPS', '165Hz', '2K QHD', ['benq'], 5),
    MON('Màn hình Xiaomi A27Qi 27" 2K 100Hz', 'monitor-5.jpg', 3290, 3890, '27 inch', 'IPS', '100Hz', '2K QHD', ['xiaomi'], 20),

    /* Bàn phím */
    KB('Bàn phím cơ Akko 3087 Silent', 'keyboard-3.jpg', 1090, 1290, 'Akko Silent Pink', 'TKL', 'Có dây', ['akko'], 19),
    KB('Bàn phím cơ Akko 5098B Plus 3 mode', 'keyboard-2.jpg', 1990, 2290, 'Akko V3 Cream Yellow', '96%', '3 mode', ['akko'], 21),
    KB('Bàn phím cơ Akko MOD 007S PC', 'keyboard-4.jpg', 2790, 3190, 'Akko Crystal', '75%', '3 mode', ['akko'], 7),
    KB('Bàn phím cơ AULA F75 Max (màn hình TFT)', 'keyboard-1.jpg', 1490, 1790, 'Reaper Switch', '75%', '3 mode', ['aula'], 29, 'Mới'),
    KB('Bàn phím cơ AULA S2022 RGB', 'keyboard-3.jpg', 590, 750, 'Blue Switch', 'Full size', 'Có dây', ['aula'], 47),
    KB('Bàn phím Logitech G715 Wireless', 'keyboard-5.jpg', 3690, 4190, 'GX Tactile', 'TKL', 'Không dây + Bluetooth', ['logitech'], 6),
    KB('Bàn phím Logitech MX Mechanical Mini', 'keyboard-6.jpg', 3290, 3690, 'Tactile Quiet', '75%', 'Bluetooth + Bolt', ['logitech'], 7),
    KB('Bàn phím không dây Logitech MK295 (kèm chuột)', 'keyboard-5.jpg', 490, 590, 'Silent Touch', 'Full size', 'Không dây', ['logitech'], 63, 'Bán chạy'),
    KB('Bàn phím Razer Huntsman Mini', 'keyboard-4.jpg', 2290, 2690, 'Razer Optical Red', '60%', 'Có dây', ['razer'], 12),
    KB('Bàn phím Razer DeathStalker V2 Pro TKL', 'keyboard-1.jpg', 4990, 5590, 'Low-profile Optical', 'TKL', 'Không dây + Bluetooth', ['razer'], 4),
    KB('Bàn phím Corsair K55 Core RGB', 'keyboard-3.jpg', 990, 1190, 'Rubber Dome', 'Full size', 'Có dây', ['corsair'], 24),
    KB('Bàn phím ASUS ROG Falchion RX Low Profile', 'keyboard-6.jpg', 3490, 3990, 'ROG RX Low Profile', '65%', '3 mode', ['asus'], 4),
    KB('Bàn phím ASUS TUF Gaming K3 Gen II', 'keyboard-1.jpg', 1690, 1990, 'TUF Optical Red', 'Full size', 'Có dây', ['asus'], 10),
    KB('Bàn phím cơ Keychron K8 Pro', 'keyboard-2.jpg', 2190, 2490, 'Gateron G Pro Red', 'TKL', 'Bluetooth + có dây', ['keychron'], 9),
    KB('Bàn phím cơ Keychron C3 Pro', 'keyboard-4.jpg', 1090, 1290, 'Keychron Super Red', 'TKL', 'Có dây', ['keychron'], 18),
    KB('Bàn phím cơ E-Dra EK368L Alpha', 'keyboard-3.jpg', 990, 1190, 'Huano Rose Red', '65%', '3 mode', ['edra'], 15),
    KB('Bàn phím cơ Dareu EK75 Pro 3 mode', 'keyboard-2.jpg', 1290, 1490, 'Dareu Dream', '75%', '3 mode', ['dareu'], 22),
    KB('Bàn phím cơ Leopold FC750R PD', 'keyboard-6.jpg', 2990, 3290, 'Cherry MX Red', 'TKL', 'Có dây', ['leopold'], 3),

    /* Chuột */
    MS('Chuột gaming Logitech G Pro X Superlight 2 DEX', 'mouse-1.jpg', 3590, 3990, '44.000 DPI', 'Không dây', '60g', ['logitech'], 9, 'Mới'),
    MS('Chuột gaming Logitech G703 Lightspeed Hero', 'mouse-4.jpg', 1690, 1990, '25.600 DPI', 'Không dây', '95g', ['logitech'], 21),
    MS('Chuột gaming Logitech G309 Lightspeed', 'mouse-3.jpg', 1190, 1390, '25.600 DPI', 'Không dây + Bluetooth', '86g', ['logitech'], 18),
    MS('Chuột văn phòng Logitech Pebble 2 M350s', 'mouse-1.jpg', 390, 490, '4.000 DPI', 'Bluetooth', '76g', ['logitech'], 44),
    MS('Chuột Logitech Lift Vertical (công thái học)', 'mouse-3.jpg', 1590, 1890, '4.000 DPI', 'Bluetooth + Bolt', '125g', ['logitech'], 12),
    MS('Chuột gaming Razer DeathAdder V3 HyperSpeed', 'mouse-2.jpg', 2190, 2490, '26.000 DPI', 'Không dây', '55g', ['razer'], 10),
    MS('Chuột gaming Razer Basilisk V3 Pro 35K', 'mouse-4.jpg', 3990, 4490, '35.000 DPI', 'Không dây + Bluetooth', '112g', ['razer'], 4),
    MS('Chuột gaming Razer Orochi V2', 'mouse-5.jpg', 1390, 1690, '18.000 DPI', 'Không dây + Bluetooth', '60g', ['razer'], 11),
    MS('Chuột gaming Corsair Katar Pro XT', 'mouse-2.jpg', 590, 750, '18.000 DPI', 'Có dây', '73g', ['corsair'], 27),
    MS('Chuột gaming Corsair M75 Air Wireless', 'mouse-5.jpg', 2490, 2790, '26.000 DPI', 'Không dây + Bluetooth', '60g', ['corsair'], 5),
    MS('Chuột gaming ASUS ROG Gladius III Wireless AimPoint', 'mouse-4.jpg', 2490, 2890, '36.000 DPI', 'Không dây + Bluetooth', '79g', ['asus'], 6),
    MS('Chuột gaming ASUS TUF Gaming M3 Gen II', 'mouse-3.jpg', 390, 490, '8.000 DPI', 'Có dây', '59g', ['asus'], 36),
    MS('Chuột gaming Pulsar X2H Mini', 'mouse-1.jpg', 1790, 1990, '26.000 DPI', 'Không dây', '52g', ['pulsar'], 6),
    MS('Chuột gaming BenQ ZOWIE S2-DW', 'mouse-5.jpg', 3290, 3590, '3.200 DPI', 'Không dây', '65g', ['benq'], 4),
    MS('Chuột gaming VGN Dragonfly F2 Pro', 'mouse-2.jpg', 890, 1090, '26.000 DPI', 'Không dây', '53g', ['vgn'], 21),
    MS('Chuột gaming E-Dra EM623 Pro', 'mouse-4.jpg', 250, 350, '7.200 DPI', 'Có dây', '85g', ['edra'], 58),
    MS('Chuột gaming Dareu EM901X RGB Wireless', 'mouse-1.jpg', 590, 750, '16.000 DPI', 'Không dây', '89g', ['dareu'], 24),
    product('mouse', 'Lót chuột Logitech G640 Large', 'mouse-2.jpg', k(690), k(850), [['size', '460 x 400mm'], ['material', 'Vải, đế cao su']], ['logitech', 'mousepad'], x(26)),

    /* Tai nghe */
    HS('Tai nghe HyperX Cloud Alpha (có dây)', 'headset-1.jpg', 1990, 2390, '50mm Dual Chamber', 'Có dây 3.5mm', ['hyperx'], 33, 'Bán chạy'),
    HS('Tai nghe HyperX Cloud Mix 2 Wireless', 'headset-2.jpg', 4490, 4990, '40mm', 'Không dây + Bluetooth', ['hyperx'], 4),
    HS('Tai nghe Logitech G Pro X Wireless Lightspeed', 'headset-1.jpg', 3990, 4590, '50mm Pro-G', 'Không dây', ['logitech'], 8),
    HS('Tai nghe Logitech G321 Lightspeed', 'headset-2.jpg', 1190, 1390, '40mm', 'Không dây + Bluetooth', ['logitech'], 12, 'Mới'),
    HS('Tai nghe Razer Kraken V3 X', 'headset-1.jpg', 1190, 1490, '40mm TriForce', 'Có dây USB', ['razer'], 23),
    HS('Tai nghe Razer Blackshark V2 HyperSpeed', 'headset-2.jpg', 2990, 3390, '50mm TriForce', 'Không dây + Bluetooth', ['razer'], 7),
    HS('Tai nghe Corsair Virtuoso Pro', 'headset-1.jpg', 4790, 5390, '50mm Graphene', 'Có dây 3.5mm', ['corsair'], 3),
    HS('Tai nghe Corsair HS65 Surround', 'headset-2.jpg', 1690, 1990, '50mm', 'Có dây USB + 3.5mm', ['corsair'], 14),
    HS('Tai nghe ASUS ROG Cetra True Wireless', 'headset-1.jpg', 2690, 3090, '10mm, chống ồn ANC', 'Không dây True Wireless', ['asus'], 6),
    HS('Tai nghe SteelSeries Arctis Nova Pro Wireless', 'headset-2.jpg', 8990, 9990, '40mm, chống ồn ANC', 'Không dây + Bluetooth', ['steelseries'], 2),
    HS('Tai nghe Sony INZONE Buds', 'headset-1.jpg', 4490, 4990, '8.4mm, chống ồn ANC', 'Không dây True Wireless', ['sony'], 4),
    HS('Tai nghe Fantech MH87 Blitz', 'headset-2.jpg', 390, 490, '50mm', 'Có dây USB + 3.5mm', ['fantech'], 41),
    HS('Tai nghe Edifier G2 II 7.1', 'headset-1.jpg', 690, 850, '50mm, 7.1 giả lập', 'Có dây USB', ['edifier'], 27),

    /* Linh kiện: VGA */
    C('Card màn hình ASUS TUF Gaming GeForce RTX 5070 OC 12GB', 'vga-2.jpg', 19490, 20990, [['gpu', '12GB GDDR7'], ['fan', '3 quạt'], ['power', '750W']], ['vga'], 8),
    C('Card màn hình MSI GeForce RTX 5060 Ti 16G Ventus 2X OC', 'vga-1.jpg', 12990, 13990, [['gpu', '16GB GDDR7'], ['fan', '2 quạt'], ['power', '600W']], ['vga'], 13),
    C('Card màn hình GIGABYTE GeForce RTX 5060 WINDFORCE OC 8GB', 'vga-3.jpg', 8790, 9490, [['gpu', '8GB GDDR7'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], 15, 'Bán chạy'),
    C('Card màn hình ASUS ROG Strix GeForce RTX 5080 OC 16GB', 'vga-2.jpg', 42990, 45990, [['gpu', '16GB GDDR7'], ['fan', '3 quạt'], ['power', '850W']], ['vga'], 2),
    C('Card màn hình GIGABYTE AORUS GeForce RTX 5090 MASTER 32GB', 'vga-3.jpg', 104990, 112990, [['gpu', '32GB GDDR7'], ['fan', '3 quạt'], ['power', '1000W']], ['vga'], 1),
    C('Card màn hình ZOTAC GAMING GeForce RTX 4070 Twin Edge 12GB', 'vga-1.jpg', 14490, 15990, [['gpu', '12GB GDDR6X'], ['fan', '2 quạt'], ['power', '650W']], ['vga'], 9),
    C('Card màn hình MSI GeForce RTX 4060 Ventus 2X Black OC 8GB', 'vga-3.jpg', 7590, 8290, [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], 27),
    C('Card màn hình INNO3D GeForce RTX 3050 Twin X2 8GB', 'vga-2.jpg', 5290, 5890, [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga'], 18),
    C('Card màn hình Sapphire NITRO+ Radeon RX 9070 XT 16GB', 'vga-1.jpg', 22990, 24490, [['gpu', '16GB GDDR6'], ['fan', '3 quạt'], ['power', '750W']], ['vga', 'amd'], 4, 'Mới'),
    C('Card màn hình GIGABYTE Radeon RX 9060 XT GAMING OC 16GB', 'vga-3.jpg', 10490, 11290, [['gpu', '16GB GDDR6'], ['fan', '3 quạt'], ['power', '550W']], ['vga', 'amd'], 7, 'Mới'),
    C('Card màn hình XFX Speedster SWFT 210 Radeon RX 7600 8GB', 'vga-2.jpg', 6190, 6890, [['gpu', '8GB GDDR6'], ['fan', '2 quạt'], ['power', '550W']], ['vga', 'amd'], 11),

    /* Linh kiện: CPU */
    C('CPU Intel Core i5-12600KF (up to 4.9GHz, 10 nhân)', 'cpu-2.jpg', 4290, 4790, [['cpu', '10C / 16T'], ['speed', '4.9GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], 19),
    C('CPU Intel Core i7-14700F (up to 5.4GHz, 20 nhân)', 'cpu-1.jpg', 8290, 9190, [['cpu', '20C / 28T'], ['speed', '5.4GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], 13),
    C('CPU Intel Core i5-14400 (up to 4.7GHz, 10 nhân, có iGPU)', 'cpu-3.jpg', 4490, 4990, [['cpu', '10C / 16T'], ['speed', '4.7GHz'], ['socket', 'LGA 1700']], ['cpu', 'intel'], 17),
    C('CPU Intel Core Ultra 7 265KF (up to 5.5GHz, 20 nhân)', 'cpu-2.jpg', 8990, 9990, [['cpu', '20C / 20T'], ['speed', '5.5GHz'], ['socket', 'LGA 1851']], ['cpu', 'intel'], 5),
    C('CPU AMD Ryzen 7 7800X3D (up to 5.0GHz, 8 nhân)', 'cpu-1.jpg', 10990, 12290, [['cpu', '8C / 16T'], ['speed', '5.0GHz'], ['socket', 'AM5']], ['cpu', 'amd'], 21, 'Bán chạy'),
    C('CPU AMD Ryzen 9 9900X (up to 5.6GHz, 12 nhân)', 'cpu-3.jpg', 11490, 12790, [['cpu', '12C / 24T'], ['speed', '5.6GHz'], ['socket', 'AM5']], ['cpu', 'amd'], 4),
    C('CPU AMD Ryzen 7 8700G (up to 5.1GHz, 8 nhân, có iGPU)', 'cpu-2.jpg', 7490, 8290, [['cpu', '8C / 16T'], ['speed', '5.1GHz'], ['socket', 'AM5']], ['cpu', 'amd'], 8),
    C('CPU AMD Ryzen 5 5600GT (up to 4.6GHz, 6 nhân, có iGPU)', 'cpu-1.jpg', 2790, 3190, [['cpu', '6C / 12T'], ['speed', '4.6GHz'], ['socket', 'AM4']], ['cpu', 'amd'], 16),

    /* Linh kiện: Mainboard */
    C('Mainboard ASUS PRIME B760M-K D4', 'mainboard-2.jpg', 2390, 2690, [['chipset', 'Intel B760'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], 33),
    C('Mainboard MSI PRO H610M-E DDR4', 'mainboard-4.jpg', 1590, 1890, [['chipset', 'Intel H610'], ['socket', 'LGA 1700'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'intel'], 41),
    C('Mainboard GIGABYTE Z790 UD AX', 'mainboard-1.jpg', 5490, 6090, [['chipset', 'Intel Z790'], ['socket', 'LGA 1700'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], 7),
    C('Mainboard ASUS TUF GAMING Z890-PLUS WIFI', 'mainboard-3.jpg', 8490, 9290, [['chipset', 'Intel Z890'], ['socket', 'LGA 1851'], ['form', 'ATX'], ['ram', 'DDR5']], ['mainboard', 'intel'], 3),
    C('Mainboard MSI PRO B650M-A WIFI', 'mainboard-4.jpg', 3790, 4190, [['chipset', 'AMD B650'], ['socket', 'AM5'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], 19),
    C('Mainboard GIGABYTE A520M K V2', 'mainboard-1.jpg', 1290, 1490, [['chipset', 'AMD A520'], ['socket', 'AM4'], ['form', 'Micro-ATX'], ['ram', 'DDR4']], ['mainboard', 'amd'], 37),
    C('Mainboard ASUS ROG STRIX B850-I GAMING WIFI', 'mainboard-2.jpg', 7990, 8790, [['chipset', 'AMD B850'], ['socket', 'AM5'], ['form', 'Mini-ITX'], ['ram', 'DDR5']], ['mainboard', 'amd'], 2),
    C('Mainboard ASRock B650M Pro RS WiFi', 'mainboard-3.jpg', 3590, 3990, [['chipset', 'AMD B650'], ['socket', 'AM5'], ['form', 'Micro-ATX'], ['ram', 'DDR5']], ['mainboard', 'amd'], 12),

    /* Linh kiện: RAM */
    C('RAM Kingston Fury Beast 32GB (2x16GB) DDR5 5600MHz', 'ram-2.jpg', 2490, 2890, [['ram', '32GB DDR5'], ['speed', '5600MHz']], ['ram'], 29),
    C('RAM Corsair Vengeance 16GB DDR5 5200MHz', 'ram-1.jpg', 1090, 1290, [['ram', '16GB DDR5'], ['speed', '5200MHz']], ['ram'], 21),
    C('RAM G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5 6000MHz', 'ram-1.jpg', 3190, 3590, [['ram', '32GB DDR5'], ['speed', '6000MHz CL30']], ['ram'], 9),
    C('RAM TeamGroup T-Force Vulcan 16GB (2x8GB) DDR4 3200MHz', 'ram-2.jpg', 890, 1050, [['ram', '16GB DDR4'], ['speed', '3200MHz']], ['ram'], 34),
    C('RAM Kingston Fury Renegade RGB 48GB (2x24GB) DDR5 7200MHz', 'ram-1.jpg', 4990, 5590, [['ram', '48GB DDR5'], ['speed', '7200MHz']], ['ram'], 2, 'Mới'),
    C('RAM Laptop Samsung 16GB DDR5 5600MHz SODIMM', 'ram-2.jpg', 1190, 1390, [['ram', '16GB DDR5'], ['speed', '5600MHz']], ['ram', 'laptop-ram'], 18),

    /* Linh kiện: SSD + HDD */
    C('SSD Samsung 990 EVO Plus 1TB M.2 NVMe', 'ssd-1.jpg', 2190, 2490, [['ssd', '1TB NVMe'], ['speed', '7150MB/s']], ['ssd'], 27),
    C('SSD WD Blue SN5000 2TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 3290, 3690, [['ssd', '2TB NVMe'], ['speed', '5150MB/s']], ['ssd'], 9),
    C('SSD Kingston Fury Renegade 2TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 4490, 4990, [['ssd', '2TB NVMe'], ['speed', '7300MB/s']], ['ssd'], 5),
    C('SSD Crucial T705 2TB M.2 NVMe PCIe 5.0', 'ssd-1.jpg', 7990, 8790, [['ssd', '2TB NVMe Gen5'], ['speed', '14500MB/s']], ['ssd'], 2, 'Mới'),
    C('SSD Lexar NM790 1TB M.2 NVMe PCIe 4.0', 'ssd-1.jpg', 1890, 2190, [['ssd', '1TB NVMe'], ['speed', '7400MB/s']], ['ssd'], 21),
    C('SSD Samsung 870 EVO 1TB 2.5" SATA', 'ssd-1.jpg', 2190, 2490, [['ssd', '1TB SATA'], ['speed', '560MB/s']], ['ssd'], 15),
    C('SSD ADATA Legend 860 1TB M.2 NVMe', 'ssd-1.jpg', 1690, 1990, [['ssd', '1TB NVMe'], ['speed', '6000MB/s']], ['ssd'], 12),
    C('Ổ cứng HDD WD Red Plus 4TB NAS', 'hdd-2.jpg', 3290, 3690, [['capacity', '4TB'], ['rpm', '5400rpm'], ['form', 'Chuyên NAS']], ['hdd'], 7),
    C('Ổ cứng HDD Seagate IronWolf Pro 12TB NAS', 'hdd-3.jpg', 8990, 9890, [['capacity', '12TB'], ['rpm', '7200rpm'], ['form', 'Chuyên NAS doanh nghiệp']], ['hdd'], 2),
    C('Ổ cứng HDD Toshiba P300 1TB 7200rpm', 'hdd-1.jpg', 1090, 1290, [['capacity', '1TB'], ['rpm', '7200rpm'], ['form', '3.5 inch SATA']], ['hdd'], 22),

    /* Linh kiện: Nguồn */
    C('Nguồn MSI MAG A550BN 550W Bronze', 'psu-1.jpg', 990, 1190, [['watt', '550W'], ['cert', '80 Plus Bronze'], ['form', 'ATX']], ['psu'], 31),
    C('Nguồn Cooler Master MWE Gold 750 V3 ATX 3.1', 'psu-1.jpg', 2190, 2490, [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.1, Full Modular']], ['psu'], 9),
    C('Nguồn Corsair RM750e 750W Gold', 'psu-1.jpg', 2590, 2890, [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.1, Full Modular']], ['psu'], 13),
    C('Nguồn ASUS ROG Thor 1200W Platinum II', 'psu-1.jpg', 8990, 9890, [['watt', '1200W'], ['cert', '80 Plus Platinum'], ['form', 'ATX 3.0, màn OLED']], ['psu'], 1),
    C('Nguồn DeepCool PN850M 850W Gold', 'psu-1.jpg', 2390, 2690, [['watt', '850W'], ['cert', '80 Plus Gold'], ['form', 'ATX 3.1, Full Modular']], ['psu'], 6, 'Mới'),
    C('Nguồn Xigmatek Hydra M 750W Gold', 'psu-1.jpg', 1890, 2190, [['watt', '750W'], ['cert', '80 Plus Gold'], ['form', 'ATX, Full Modular']], ['psu'], 11),

    /* Linh kiện: Tản nhiệt */
    C('Tản nhiệt khí Cooler Master Hyper 622 Halo White', 'cooler-2.jpg', 1290, 1490, [['radiator', '2 tháp, 2 quạt ARGB'], ['tdp', '250W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 8),
    C('Tản nhiệt khí DeepCool AK620 Digital', 'cooler-2.jpg', 1490, 1790, [['radiator', '2 tháp, 2 quạt'], ['tdp', '260W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 14),
    C('Tản nhiệt khí Thermalright Assassin X 120 Refined SE', 'cooler-2.jpg', 390, 490, [['radiator', '1 tháp, 1 quạt'], ['tdp', '220W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 49, 'Bán chạy'),
    C('Tản nhiệt nước AIO Corsair NAUTILUS 360 RS ARGB', 'cooler-1.jpg', 2790, 3190, [['radiator', 'Radiator 360mm'], ['tdp', '320W'], ['socket', 'LGA 1851 / AM5']], ['cooler'], 6),
    C('Tản nhiệt nước AIO Lian Li Galahad II Trinity 360', 'cooler-3.jpg', 4290, 4790, [['radiator', 'Radiator 360mm'], ['tdp', '350W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 4),
    C('Tản nhiệt nước AIO ID-COOLING FX360 ARGB', 'cooler-1.jpg', 1590, 1890, [['radiator', 'Radiator 360mm'], ['tdp', '300W'], ['socket', 'LGA 1700 / AM5']], ['cooler'], 17),

    /* Linh kiện: Case */
    C('Case Corsair 2500X mATX (bể cá)', 'case-1.jpg', 2390, 2690, [['form', 'Micro-ATX, 2 khoang'], ['fan', 'Không kèm fan'], ['material', 'Kính cường lực 2 mặt']], ['case'], 6),
    C('Case Lian Li O11 Vision Compact', 'case-3.jpg', 2790, 3090, [['form', 'Mid Tower, ATX'], ['fan', 'Không kèm fan'], ['material', 'Kính 3 mặt']], ['case'], 5),
    C('Case NZXT H7 Flow (2024)', 'case-1.jpg', 3290, 3690, [['form', 'Mid Tower, E-ATX'], ['fan', '3 fan'], ['material', 'Kính cường lực']], ['case'], 4),
    C('Case MSI MAG FORGE 112R', 'case-2.jpg', 990, 1190, [['form', 'Mid Tower, ATX'], ['fan', '4 fan ARGB'], ['material', 'Kính cường lực']], ['case'], 27),
    C('Case DeepCool CH360 Digital (mATX)', 'case-2.jpg', 1690, 1890, [['form', 'Micro-ATX'], ['fan', '2 fan ARGB'], ['material', 'Kính + lưới']], ['case'], 9),
    C('Case Montech SKY TWO (bể cá, 4 fan)', 'case-3.jpg', 2490, 2790, [['form', 'Mid Tower, ATX'], ['fan', '4 fan ARGB'], ['material', 'Kính cường lực 2 mặt']], ['case'], 6),
    C('Case Xigmatek Gaming G (kèm 3 fan)', 'case-2.jpg', 690, 850, [['form', 'Mid Tower, ATX'], ['fan', '3 fan RGB'], ['material', 'Kính cường lực']], ['case'], 52, 'Bán chạy'),
    C('Case Cooler Master HAF 700 EVO', 'case-1.jpg', 9990, 10990, [['form', 'Full Tower, E-ATX'], ['fan', '5 fan ARGB'], ['material', 'Kính + lưới, màn LCD']], ['case'], 1),

    /* Bàn ghế */
    CHAIR('Ghế gaming E-Dra Apollo EGC209', 'chair-3.jpg', 2790, 3390, 'Da PU, kê chân', 'Tải 150kg', ['edra'], 13),
    CHAIR('Ghế gaming E-Dra Hunter EGC206 Pro', 'chair-1.jpg', 3590, 4290, 'Da PU cao cấp, ngả 180°', 'Tải 150kg', ['edra'], 8),
    CHAIR('Ghế công thái học Warrior WEC502 Lưng lưới', 'chair-2.jpg', 3490, 4190, 'Lưới, tựa lưng S-shape', 'Tải 130kg', ['warrior'], 11),
    CHAIR('Ghế gaming Corsair TC100 Fabric', 'chair-2.jpg', 4790, 5490, 'Vải thoáng khí', 'Tải 120kg', ['corsair'], 6),
    CHAIR('Ghế công thái học MKPC Ergo One', 'chair-3.jpg', 2490, 2990, 'Lưới, tựa tay 3D', 'Tải 120kg', ['mkpc'], 9, 'Mới'),
    CHAIR('Ghế gaming Cooler Master Caliber X2', 'chair-1.jpg', 6990, 7790, 'Vải lạnh cao cấp', 'Tải 150kg', ['coolermaster'], 2),
    DESK('Bàn gaming E-Dra EGT1200 cơ bản 1m2', 'desk-2.jpg', 990, 1290, '120 x 60cm', 'Mặt MDF, khung thép', ['edra'], 31),
    DESK('Bàn gaming MKPC chữ Z có LED 1m6', 'desk-1.jpg', 2690, 3190, '160 x 60cm', 'Mặt carbon, LED RGB', ['mkpc'], 8),
    DESK('Bàn nâng hạ điện Warrior WGT401 2 motor 1m6', 'desk-2.jpg', 8490, 9490, '160 x 80cm', '2 motor, 4 nút nhớ, chống va chạm', ['warrior'], 2),

    /* Phụ kiện */
    AC('Loa Edifier MR3 kiểm âm (cặp)', 'speaker-2.jpg', 1990, 2290, [['driver', '2.0 kênh, 36W'], ['wired', 'TRS / RCA / AUX']], ['speaker', 'edifier'], 12),
    AC('Loa Edifier M60 Bluetooth', 'speaker-1.jpg', 4490, 4990, [['driver', '2.0 kênh, 66W'], ['wireless', 'Bluetooth + USB-C']], ['speaker', 'edifier'], 4),
    AC('Loa Creative Pebble 2.0 USB', 'speaker-1.jpg', 450, 550, [['driver', '2.0 kênh, 4.4W'], ['wired', 'USB + 3.5mm']], ['speaker', 'creative'], 61, 'Bán chạy'),
    AC('Loa thanh Creative Sound Blaster Katana SE', 'speaker-2.jpg', 5490, 5990, [['driver', 'Soundbar 2.1, RGB'], ['wireless', 'Bluetooth + Optical + USB']], ['speaker', 'creative'], 3),
    AC('Webcam Logitech C920e Full HD', 'webcam-1.jpg', 1490, 1790, [['res', 'Full HD 1080p'], ['wired', 'USB']], ['webcam', 'logitech'], 22),
    AC('Webcam Razer Kiyo Pro', 'webcam-1.jpg', 3490, 3990, [['res', 'Full HD 60fps, HDR'], ['wired', 'USB']], ['webcam', 'razer'], 4),
    AC('Micro Rode PodMic USB', 'mic-1.jpg', 4490, 4990, [['driver', 'Dynamic'], ['wired', 'USB-C + XLR']], ['mic', 'rode'], 3),
    AC('Micro Elgato Wave:1 USB', 'mic-2.jpg', 2490, 2790, [['driver', 'Condenser cardioid'], ['wired', 'USB-C']], ['mic', 'elgato'], 5),
    AC('Micro Fifine A6V USB RGB', 'mic-3.jpg', 590, 750, [['driver', 'Condenser cardioid'], ['wired', 'USB']], ['mic', 'fifine'], 37),
    AC('Tay cầm Sony DualSense Edge (PS5 / PC)', 'gamepad-2.jpg', 4990, 5490, [['wireless', 'Bluetooth / USB-C'], ['platform', 'PS5 / PC']], ['gamepad', 'sony'], 6),
    AC('Tay cầm Razer Wolverine V3 Pro', 'gamepad-1.jpg', 4990, 5590, [['wireless', '2.4GHz / USB-C'], ['platform', 'PC / Xbox']], ['gamepad', 'razer'], 3),
    AC('Tay cầm 8BitDo Pro 2 Bluetooth', 'gamepad-1.jpg', 990, 1190, [['wireless', 'Bluetooth / USB-C'], ['platform', 'PC / Switch / Android / iOS']], ['gamepad', '8bitdo'], 15),
    AC('Ổ cứng di động SanDisk Extreme Pro Portable SSD 2TB', 'extssd-1.jpg', 5490, 5990, [['capacity', '2TB'], ['speed', '2000MB/s'], ['ports', 'USB-C 3.2 Gen 2x2']], ['extssd', 'sandisk'], 5),
    AC('Ổ cứng di động WD My Passport 4TB HDD', 'hdd-3.jpg', 3190, 3590, [['capacity', '4TB'], ['rpm', 'HDD 2.5 inch'], ['ports', 'USB 3.2']], ['extssd', 'wd'], 9),
    AC('USB SanDisk Ultra Dual Drive Go 128GB (USB-C)', 'extssd-1.jpg', 290, 350, [['capacity', '128GB'], ['ports', 'USB-A + USB-C']], ['usb', 'sandisk'], 44),
    AC('Thẻ nhớ Samsung PRO Plus microSD 256GB', 'extssd-2.jpg', 690, 850, [['capacity', '256GB'], ['speed', '180MB/s']], ['usb', 'samsung'], 26),
    AC('Giá treo 2 màn hình North Bayou F160', 'desk-1.jpg', 690, 850, [['size', '17 - 27 inch × 2'], ['weight', 'Tải 9kg / màn']], ['arm'], 21),

    /* Thiết bị mạng */
    NW('Router WiFi 6 TP-Link Archer AX12 AX1500', 'router-1.jpg', 790, 950, 'WiFi 6 AX1500', '4 cổng LAN 100Mbps', ['tplink'], 43),
    NW('Router WiFi 7 TP-Link Archer BE550 BE9300', 'router-1.jpg', 5990, 6690, 'WiFi 7 BE9300', '5 cổng 2.5G', ['tplink'], 3, 'Mới'),
    NW('Router WiFi 6 ASUS RT-AX58U AX3000', 'router-3.jpg', 2490, 2790, 'WiFi 6 AX3000', '5 cổng Gigabit', ['asus'], 9),
    NW('Bộ WiFi Mesh ASUS ZenWiFi XD5 (2 cục)', 'router-2.jpg', 4490, 4990, 'WiFi 6 Mesh AX3000', '2 cổng Gigabit/cục', ['asus'], 4),
    NW('Bộ WiFi Mesh Mercusys Halo H80X (3 cục)', 'router-2.jpg', 2990, 3490, 'WiFi 6 Mesh AX3000', '3 cổng Gigabit/cục', ['mercusys'], 11),
    NW('Bộ kích sóng WiFi TP-Link RE315 AC1200', 'router-3.jpg', 490, 590, 'WiFi 5 AC1200', '1 cổng LAN', ['tplink'], 37),
    NW('Switch TP-Link TL-SG105E 5 cổng quản lý', 'switch-1.jpg', 590, 690, '5 cổng Gigabit', 'Quản lý web, VLAN, QoS', ['tplink'], 14),
    NW('Switch TP-Link TL-SG1024D 24 cổng Gigabit', 'switch-2.jpg', 1990, 2290, '24 cổng Gigabit', 'Gắn tủ rack 19"', ['tplink'], 6),
    NW('USB WiFi 6 TP-Link Archer TX20U Plus', 'switch-1.jpg', 490, 590, 'WiFi 6 AX1800', 'USB 3.0, anten rời', ['tplink'], 18),

    /* Phần mềm */
    SW('Microsoft Windows 11 Home bản quyền (USB đóng hộp)', 'software-1.jpg', 3690, 3990, 'Vĩnh viễn, 1 PC', 'Windows', ['microsoft'], 6),
    SW('Microsoft 365 Business Standard 12 tháng', 'software-2.jpg', 3390, 3790, '12 tháng, 1 người, doanh nghiệp', 'Windows / macOS / Mobile', ['microsoft'], 4),
    SW('Phần mềm diệt virus Bitdefender Antivirus Plus 1 PC 1 năm', 'software-1.jpg', 290, 390, '12 tháng, 1 PC', 'Windows', ['bitdefender'], 21),
    SW('Adobe Acrobat Pro 12 tháng', 'software-4.jpg', 4790, 5290, '12 tháng, 1 người', 'Windows / macOS', ['adobe'], 3),

    /* Hàng cũ */
    USED('components', 'Card màn hình ZOTAC GeForce RTX 3070 Twin Edge 8GB (Cũ)', 'vga-1.jpg', 5290, 8490, [['gpu', '8GB GDDR6'], ['condition', 'Đẹp 95%'], ['fan', '2 quạt']], ['vga'], 6, 3),
    USED('components', 'Card màn hình MSI GeForce GTX 1650 Ventus XS 4GB (Cũ)', 'vga-3.jpg', 1390, 2490, [['gpu', '4GB GDDR6'], ['condition', 'Đẹp 90%'], ['fan', '2 quạt']], ['vga'], 14, 1),
    USED('components', 'CPU Intel Core i5-10400F (Cũ)', 'cpu-3.jpg', 990, 1690, [['cpu', '6C / 12T'], ['condition', 'Like new 99%'], ['socket', 'LGA 1200']], ['cpu'], 18, 3),
    USED('components', 'Mainboard GIGABYTE B460M DS3H (Cũ)', 'mainboard-4.jpg', 790, 1390, [['chipset', 'Intel B460'], ['socket', 'LGA 1200'], ['condition', 'Đẹp 95%']], ['mainboard'], 9, 3),
    USED('components', 'Ổ cứng SSD Samsung 970 EVO Plus 1TB (Cũ)', 'ssd-1.jpg', 1290, 2190, [['ssd', '1TB NVMe'], ['condition', 'Sức khỏe 96%'], ['speed', '3500MB/s']], ['ssd'], 7, 3),
    USED('laptop', 'Laptop Lenovo ThinkPad X1 Carbon Gen 9 (Cũ)', 'laptop-office-2.jpg', 13990, 19990, [['cpu', 'i7-1165G7'], ['ram', '16GB'], ['ssd', '512GB'], ['condition', 'Đẹp 95%']], ['lenovo', 'laptop'], 6, 6),
    USED('laptop', 'Laptop Apple MacBook Air M1 8GB 256GB (Cũ)', 'laptop-office-1.jpg', 11990, 15990, [['cpu', 'Apple M1'], ['ram', '8GB'], ['ssd', '256GB'], ['condition', 'Like new 98%']], ['apple', 'laptop'], 21, 6),
    USED('laptop-gaming', 'Laptop gaming MSI GF63 Thin 11UC (Cũ)', 'laptop-gaming-4.jpg', 9990, 14990, [['cpu', 'i5-11400H'], ['gpu', 'RTX 3050'], ['ram', '8GB'], ['condition', 'Đẹp 90%']], ['msi', 'laptop'], 10, 6),
    USED('monitor', 'Màn hình ASUS TUF Gaming VG249Q1A 24" 165Hz (Cũ)', 'monitor-1.jpg', 1990, 3490, [['size', '23.8 inch'], ['panel', 'IPS'], ['hz', '165Hz'], ['condition', 'Like new 98%']], ['asus'], 9, 3),
    USED('pc', 'PC MKPC Gaming i5 10400F - GTX 1660 Super (Cũ)', 'pc-1.jpg', 6990, 9990, [['cpu', 'i5-10400F'], ['gpu', 'GTX 1660 S'], ['ram', '16GB DDR4'], ['condition', 'Đẹp 95%']], ['gaming'], 11, 3),
    USED('headset', 'Tai nghe HyperX Cloud II (Cũ)', 'headset-2.jpg', 790, 1690, [['driver', '53mm, 7.1'], ['condition', 'Đẹp 95%']], ['hyperx'], 8, 1),
    USED('chair', 'Ghế công thái học Warrior WEC501 (Cũ)', 'chair-3.jpg', 1490, 2790, [['material', 'Lưới thoáng khí'], ['condition', 'Đẹp 90%']], ['warrior'], 4, 1),
  );
}

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
  { theme: 'light', tag: 'Trợ giá', title: 'Thu cũ đổi mới <em>đến 2 triệu</em>', img: 'laptop-office-3.jpg', href: 'thu-cu-doi-moi.html' },
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


