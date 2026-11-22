/* ==========================================================
   Components dùng chung: header, footer, drawer, product card,
   promo banner. Mỗi hàm trả về chuỗi HTML.
   ========================================================== */

const priceFormatter = new Intl.NumberFormat('vi-VN');
const formatPrice = (value) => `${priceFormatter.format(value)}đ`;
const discountPercent = (price, oldPrice) => (oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0);
/* Icon Lucide → chuỗi SVG, lấy từ js/icons.js (chỉ các icon web dùng, tự sinh bởi tools/build-icons.mjs).
   Không tải thư viện Lucide từ CDN, không phải quét DOM → trang hiện nhanh hơn. */
const icon = (name, extraClass = '') => {
  const inner = LUCIDE_ICONS[name];
  if (!inner) {
    console.warn(`Thiếu icon "${name}" — chạy: node tools/build-icons.mjs`);
    return '';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${name}${extraClass ? ` ${extraClass}` : ''}" aria-hidden="true">${inner}</svg>`;
};

const SPEC_ICONS = {
  cpu: 'cpu', gpu: 'circuit-board', ram: 'memory-stick', ssd: 'hard-drive', screen: 'monitor',
  fan: 'fan', power: 'plug-zap', speed: 'gauge', socket: 'square-dashed',
  dpi: 'crosshair', wireless: 'wifi', wired: 'cable', weight: 'weight',
  switch: 'keyboard', layout: 'layout-grid', size: 'maximize', panel: 'layers', hz: 'activity', res: 'scan',
  driver: 'audio-lines', material: 'armchair',
  chipset: 'microchip', form: 'box', watt: 'zap', cert: 'badge-check', radiator: 'snowflake', tdp: 'thermometer',
  capacity: 'database', rpm: 'disc', wifi: 'router', ports: 'ethernet-port', license: 'key-round', platform: 'app-window',
  condition: 'sparkles',
};

/* Tên thông số (trang chi tiết, so sánh) */
const SPEC_LABELS = {
  cpu: 'CPU', gpu: 'Card đồ họa', ram: 'RAM', ssd: 'Ổ cứng', screen: 'Màn hình',
  fan: 'Tản nhiệt', power: 'Nguồn đề nghị', speed: 'Tốc độ', socket: 'Socket',
  dpi: 'Cảm biến', wireless: 'Kết nối', wired: 'Kết nối', weight: 'Trọng lượng / tải trọng',
  switch: 'Switch', layout: 'Layout', size: 'Kích thước', panel: 'Tấm nền', hz: 'Tần số quét', res: 'Độ phân giải',
  driver: 'Driver', material: 'Chất liệu',
  chipset: 'Chipset', form: 'Chuẩn / kích thước', watt: 'Công suất', cert: 'Chứng nhận', radiator: 'Kiểu tản', tdp: 'TDP hỗ trợ',
  capacity: 'Dung lượng', rpm: 'Tốc độ quay', wifi: 'Chuẩn kết nối', ports: 'Cổng kết nối', license: 'Bản quyền', platform: 'Hệ điều hành',
  condition: 'Tình trạng',
};

const LOGO_MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><path fill-rule="evenodd" fill="currentColor" d="M18 14h28a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z M21 42V22h5l6 8 6-8h5v20h-5V30.5l-6 7.5-6-7.5V42z M21 7h3v7h-3z M21 50h3v7h-3z M7 21h7v3H7z M50 21h7v3h-7z M30.5 7h3v7h-3z M30.5 50h3v7h-3z M7 30.5h7v3H7z M50 30.5h7v3h-7z M40 7h3v7h-3z M40 50h3v7h-3z M7 40h7v3H7z M50 40h7v3h-7z"/></svg>';

/* Link trang chủ: trên web dùng "./" (địa chỉ gọn https://minhkhoipc.github.io/), mở file trên máy dùng index.html */
const HOME_URL = location.protocol === 'file:' ? 'index.html' : './';

function renderLogo() {
  return `
    <a class="logo" href="${HOME_URL}" aria-label="${COMPANY.name} — Trang chủ">
      <span class="logo__mark">${LOGO_MARK}</span>
      <span class="logo__name">MINH KHÔI PC</span>
    </a>`;
}

/* ---------- Header ---------- */
function renderHeader() {
  return `
    <div class="topbar" role="region" aria-label="Thông báo khuyến mãi">
      <div class="container topbar__inner">
        ${icon('flame', 'topbar__flame')}
        <p class="topbar__msg" data-topbar-msg>${PROMO_MESSAGES[0].text}</p>
        ${icon('flame', 'topbar__flame')}
      </div>
    </div>
    <header class="site-header" id="site-header">
      <div class="container site-header__inner">
        <button class="header-icon-btn header-icon-btn--menu" type="button" data-drawer-open aria-label="Mở danh mục sản phẩm">${icon('menu')}</button>
        ${renderLogo()}
        <form class="search" role="search" action="danh-muc">
          <label class="sr-only" for="search-input">Tìm kiếm sản phẩm</label>
          <input class="search__input" id="search-input" name="q" type="search" placeholder="Bạn cần tìm gì?" autocomplete="off" aria-controls="search-suggest">
          <button class="search__btn" type="submit" aria-label="Tìm kiếm">${icon('search')}</button>
          <div class="search__suggest" id="search-suggest" role="listbox" aria-label="Gợi ý sản phẩm"></div>
        </form>
        <nav class="header-actions" aria-label="Tiện ích">
          <a class="header-action" href="tel:${COMPANY.phone}">${icon('headphones')}<span>Hotline<br><b>${COMPANY.phoneDisplay}</b></span></a>
          <a class="header-action" href="lien-he">${icon('map-pin')}<span>Hệ thống<br>cửa hàng</span></a>
          <a class="header-action" href="tra-cuu-don-hang">${icon('clipboard-list')}<span>Tra cứu<br>đơn hàng</span></a>
          <a class="header-cart header-wish" href="yeu-thich" aria-label="Sản phẩm yêu thích" title="Sản phẩm yêu thích">
            ${icon('heart')}<span class="cart-count" data-wish-count hidden>0</span>
          </a>
          <a class="header-cart" href="gio-hang" aria-label="Giỏ hàng">
            ${icon('shopping-cart')}<span class="cart-count" data-cart-count>0</span>
          </a>
          <div class="account-menu" data-account-slot>${renderAccountMenu(Auth.current())}</div>
        </nav>
      </div>
    </header>
    <nav class="subnav" aria-label="Điều hướng phụ">
      <div class="container subnav__inner">
        <div class="subnav__cat" data-cat-wrap>
          <button class="subnav__cat-btn" type="button" data-cat-toggle aria-expanded="false" aria-controls="cat-dropdown">${icon('menu')}<span>Danh mục</span></button>
          <nav class="cat-menu subnav__dropdown" id="cat-dropdown" aria-label="Danh mục sản phẩm"></nav>
        </div>
        <ul class="subnav__list">
          ${SUB_NAV.map((l) => `<li><a class="subnav__link" href="${l.href}">${l.text}</a></li>`).join('')}
        </ul>
      </div>
    </nav>`;
}

/* ---------- Menu danh mục (desktop: mega menu) ----------
   Liên kết: 'chữ' → tìm trong danh mục đó, hoặc ['chữ', 'địa chỉ riêng'] */
const catLink = (c, l) => (Array.isArray(l) ? l : [l, `danh-muc?cat=${c.id}&q=${encodeURIComponent(l)}`]);

function renderCategoryMenu() {
  return `<ul>${CATEGORIES.map((c) => `
    <li class="cat-menu__item" data-mega-cat="${c.id}">
      <a class="cat-menu__link" href="danh-muc?cat=${c.id}">${icon(c.icon)}<span>${c.name}</span>${icon('chevron-right', 'cat-menu__chevron')}</a>
      <div class="mega">
        <div class="mega__groups">
          ${c.groups.map((g) => `
            <div>
              <p class="mega__title">${g.title}</p>
              <ul class="mega__list">${g.links.map((l) => catLink(c, l)).map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}</ul>
            </div>`).join('')}
        </div>
        <div class="mega__featured" data-mega-featured></div>
      </div>
    </li>`).join('')}</ul>`;
}

/* Hàng "Bán chạy nhất" trong mega menu — chỉ dựng khi khách rê chuột vào (ảnh không tải sẵn) */
function megaFeaturedHTML(catId) {
  const rule = CATEGORY_RULES[catId];
  if (!rule) return '';
  const all = PRODUCTS.filter((p) => rule.match(p) && (catId === 'used' || !p.tags.includes('used')));
  const top = [...all].sort((a, b) => b.reviews - a.reviews).slice(0, 5);
  if (!top.length) return '';
  return `
    <div class="mega__featured-head">
      <p class="mega__title">${icon('flame')}Bán chạy nhất</p>
      <a class="mega__all" href="danh-muc?cat=${catId}">Xem tất cả ${all.length} sản phẩm${icon('chevron-right')}</a>
    </div>
    <div class="mega__products">
      ${top.map((p) => `
        <a class="mega-card" href="${productUrl(p)}">
          <span class="mega-card__img"><img src="${thumb(p.img)}" alt="${p.name}" width="120" height="120" loading="lazy"></span>
          <span class="mega-card__name">${p.name}</span>
          <b class="mega-card__price">${formatPrice(p.price)}</b>
          ${p.oldPrice > p.price ? `<del class="mega-card__old">${formatPrice(p.oldPrice)}</del>` : ''}
        </a>`).join('')}
    </div>`;
}

/* ---------- Drawer (mobile + nút Danh mục) ---------- */
/* Danh sách danh mục trong drawer — chỉ dựng khi khách mở menu lần đầu (trang nhẹ hơn ~450 phần tử) */
function drawerBodyHTML() {
  return CATEGORIES.map((c) => `
    <details class="drawer__group">
      <summary>${icon(c.icon)}<span>${c.name}</span>${icon('chevron-right', 'drawer__chevron')}</summary>
      <div class="drawer__sub">
        <a class="drawer__all" href="danh-muc?cat=${c.id}">Xem tất cả ${c.name}${icon('chevron-right')}</a>
        ${c.groups.flatMap((g) => g.links).slice(0, 10).map((l) => catLink(c, l)).map(([text, href]) => `<a href="${href}">${text}</a>`).join('')}
      </div>
    </details>`).join('');
}

function renderDrawer() {
  return `
    <div class="drawer" id="drawer" aria-hidden="true">
      <div class="drawer__overlay" data-drawer-close></div>
      <aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Danh mục sản phẩm">
        <div class="drawer__head">
          ${renderLogo()}
          <button class="header-icon-btn" type="button" data-drawer-close aria-label="Đóng danh mục">${icon('x')}</button>
        </div>
        <div class="drawer__body" data-drawer-body></div>
        <div class="drawer__foot">
          <a href="yeu-thich">${icon('heart')}<span>Sản phẩm yêu thích</span></a>
          <a href="so-sanh">${icon('git-compare-arrows')}<span>So sánh sản phẩm</span></a>
          <a href="tra-cuu-don-hang">${icon('clipboard-list')}<span>Tra cứu đơn hàng</span></a>
          <button class="drawer__install" type="button" data-install>${icon('smartphone')}<span>Tải app ${COMPANY.name}</span></button>
          <a href="tel:${COMPANY.phone}">${icon('phone')}<span>Hotline: <b>${COMPANY.phoneDisplay}</b></span></a>
          <a href="mailto:${COMPANY.email}">${icon('mail')}<span>${COMPANY.email}</span></a>
          <p>${icon('map-pin')}<span>${COMPANY.address}</span></p>
        </div>
      </aside>
    </div>`;
}

/* ---------- Nút tài khoản trên header ---------- */
function renderAccountMenu(user) {
  if (!user) {
    return `<a class="header-login" href="dang-nhap" aria-label="Đăng nhập">${icon('user-round')}<span>Đăng nhập</span></a>`;
  }
  const words = user.name.trim().split(/\s+/);
  const given = words[words.length - 1];
  const isAdmin = Auth.isAdmin(user);
  return `
    <button class="header-login header-login--user" type="button" data-account-toggle aria-expanded="false" aria-haspopup="true" aria-label="Tài khoản của ${esc(user.name)}${isAdmin ? ' (quản trị viên)' : ''}">
      <b class="header-login__avatar">${esc(given.charAt(0).toUpperCase())}</b><span>${esc(given)}</span>
      ${isAdmin ? `<small class="header-login__badge" aria-hidden="true">${icon('shield-check')}<i>Quản trị</i></small>` : ''}
      ${icon('chevron-down', 'header-login__chevron')}
    </button>
    <div class="account-dropdown" role="menu">
      <div class="account-dropdown__head"><b>${esc(user.name)}</b><small>${esc(user.email)}</small>${isAdmin ? `<em class="account-dropdown__role">${icon('shield-check')}Quản trị viên</em>` : ''}</div>
      <a href="tai-khoan" role="menuitem">${icon('user-round')}Tài khoản của tôi</a>
      <a href="tai-khoan#don-hang" role="menuitem">${icon('shopping-bag')}Đơn hàng của tôi</a>
      <a href="yeu-thich" role="menuitem">${icon('heart')}Sản phẩm yêu thích</a>
      ${Auth.isAdmin(user) ? `<a href="quan-tri" role="menuitem">${icon('layout-dashboard')}Quản trị cửa hàng</a>` : ''}
      <button type="button" role="menuitem" data-logout>${icon('log-out')}Đăng xuất</button>
    </div>`;
}

/* ---------- Product card (dùng chung toàn site) ---------- */
function renderProductCard(p, options = {}) {
  const discount = discountPercent(p.price, p.oldPrice);
  const url = productUrl(p);
  const specs = p.specs.slice(0, 4).map(([type, value]) => `<li>${icon(SPEC_ICONS[type] || 'dot')}<span>${value}</span></li>`).join('');

  const compact = !!options.compact;
  const wished = Wishlist.has(p.id);
  const compared = Compare.has(p.id);
  // Hàng cũ: giá gạch là giá khi còn mới → ghi "Rẻ hơn mới x%" thay cho "Giảm x%"
  const used = p.tags.includes('used');
  const condition = used ? p.specs.find(([t]) => t === 'condition')?.[1] : '';

  return `
    <article class="product-card${compact ? ' product-card--compact' : ''}${used ? ' product-card--used' : ''} ${options.itemClass || ''}" style="--i:${options.index || 0}">
      <a class="product-card__media" href="${url}" tabindex="-1" aria-hidden="true">
        <img src="${thumb(p.img)}" alt="${p.name}" loading="lazy" width="200" height="200">
        ${discount ? `<span class="product-card__discount">${used ? `Rẻ hơn mới ${discount}%` : `Giảm ${discount}%`}</span>` : ''}
        ${used ? `<span class="product-card__cond">${icon('recycle')}Hàng cũ${condition ? ` · ${condition.split(',')[0]}` : ''}</span>` : ''}
      </a>
      <button class="product-card__cart" type="button" data-add-cart="${p.id}" aria-label="Thêm ${p.name} vào giỏ hàng">${icon('shopping-cart')}</button>
      <div class="product-card__tools">
        <button class="product-card__tool${wished ? ' is-active' : ''}" type="button" data-wish="${p.id}" aria-pressed="${wished}" aria-label="Yêu thích ${p.name}" title="Yêu thích">${icon('heart')}</button>
        <button class="product-card__tool product-card__tool--compare${compared ? ' is-active' : ''}" type="button" data-compare="${p.id}" aria-pressed="${compared}" aria-label="So sánh ${p.name}" title="So sánh">${icon('git-compare-arrows')}</button>
      </div>
      ${p.label && !compact && !used ? `<span class="product-card__tag">${icon('flame')}${p.label}</span>` : ''}
      <h3 class="product-card__name"><a href="${url}">${p.name}</a></h3>
      ${compact ? '' : `<ul class="product-card__specs" aria-label="Thông số chính">${specs}</ul>`}
      <div class="product-card__prices">
        ${discount ? `<div class="product-card__old-row">${used ? '<span class="product-card__new-label">Giá mới</span>' : ''}<del class="product-card__old">${formatPrice(p.oldPrice)}</del>${used ? '' : `<span class="product-card__percent">-${discount}%</span>`}</div>` : ''}
        <strong class="product-card__price">${formatPrice(p.price)}</strong>
      </div>
      ${compact ? '' : `<div class="product-card__rating">${icon('star')}<b>${p.rating.toFixed(1)}</b>(${p.reviews} đánh giá)</div>`}
      ${!compact && p.gift ? `<a class="product-card__gift" href="${url}">${icon('gift')}<span>${p.gift}</span>${icon('chevron-right')}</a>` : ''}
    </article>`;
}

/* ---------- Promo banner ---------- */
function renderPromo(b, size = '') {
  const plainTitle = b.title.replace(/<[^>]+>/g, '');
  return `
    <a class="promo promo--${b.theme}${size ? ` promo--${size}` : ''}" href="${b.href || 'danh-muc?sale=1'}" aria-label="${plainTitle}">
      <div class="promo__content">
        ${b.tag ? `<span class="promo__tag">${b.tag}</span>` : ''}
        <h3 class="promo__title">${b.title}</h3>
        ${b.desc ? `<p class="promo__desc">${b.desc}</p>` : ''}
        ${b.cta ? `<span class="btn btn--light promo__cta">${b.cta}${icon('arrow-right')}</span>` : ''}
      </div>
      <img class="promo__img" src="${photo(b.img)}" alt="" loading="lazy">
    </a>`;
}

/* ---------- Footer ---------- */
/* ---------- Trợ lý nổi góc phải: robot "Khôi Bot" (vẽ từ logo con chip) + bảng liên hệ nhanh ---------- */
const MASCOT_SVG = `
  <svg class="mascot" viewBox="0 0 64 64" aria-hidden="true">
    <g class="mascot__bot">
      <path class="mascot__antenna" d="M32 15V9" />
      <circle class="mascot__tip" cx="32" cy="7.5" r="3" />
      <rect class="mascot__pin" x="9" y="24" width="6" height="3" rx="1.5" /><rect class="mascot__pin" x="9" y="31" width="6" height="3" rx="1.5" />
      <rect class="mascot__pin" x="49" y="24" width="6" height="3" rx="1.5" /><rect class="mascot__pin" x="49" y="31" width="6" height="3" rx="1.5" />
      <rect class="mascot__head" x="13" y="14" width="38" height="31" rx="11" />
      <rect class="mascot__visor" x="18" y="20" width="28" height="18" rx="8" />
      <g class="mascot__eyes"><rect x="23.5" y="24.5" width="5" height="7" rx="2.5" /><rect x="35.5" y="24.5" width="5" height="7" rx="2.5" /></g>
      <path class="mascot__smile" d="M29 34.2q3 1.8 6 0" />
      <rect class="mascot__body" x="18" y="47" width="28" height="17" rx="8" />
      <path class="mascot__chest" d="M27 59v-8h2.4l2.6 3.4 2.6-3.4H37v8h-2.4v-4.4L32 58l-2.6-3.4V59z" />
    </g>
    <g class="mascot__bubble">
      <path d="M44 1.5h15a4.5 4.5 0 0 1 4.5 4.5v6a4.5 4.5 0 0 1-4.5 4.5h-9l-4 3.5v-3.5h-2A4.5 4.5 0 0 1 39.5 12V6A4.5 4.5 0 0 1 44 1.5z" />
      <circle cx="46" cy="9" r="1.6" /><circle cx="51.5" cy="9" r="1.6" /><circle cx="57" cy="9" r="1.6" />
    </g>
  </svg>`;

const ASSIST_OPTIONS = [
  ['zalo', 'Chat Zalo', 'Tư vấn cấu hình, báo giá nhanh', COMPANY.zalo, true],
  ['phone', 'Gọi hotline', COMPANY.phoneDisplay, `tel:${COMPANY.phone}`],
  ['facebook', 'Nhắn Facebook', 'Fanpage Minh Khôi PC', COMPANY.socials.facebook, true],
  ['clipboard-list', 'Tra cứu đơn hàng', 'Xem trạng thái đơn đã đặt', 'tra-cuu-don-hang'],
  ['cpu', 'Tự build PC', 'Chọn linh kiện, xem tổng giá', 'xay-dung-cau-hinh'],
];

function renderAssist() {
  return `
    <div class="assist">
      <div class="assist__panel" id="assist-panel" role="dialog" aria-label="Hỗ trợ khách hàng" hidden>
        <div class="assist__head">
          <span class="assist__avatar">${MASCOT_SVG}</span>
          <div class="assist__who"><b>Khôi Bot</b><small><i></i>Trợ lý ${COMPANY.name}</small></div>
          <button class="assist__close" type="button" data-assist-close aria-label="Đóng">${icon('x')}</button>
        </div>
        <p class="assist__hello">Xin chào! 👋 Bạn cần tư vấn cấu hình, báo giá hay kiểm tra đơn hàng? Chọn cách liên hệ bên dưới nhé.</p>
        <div class="assist__options">
          ${ASSIST_OPTIONS.map(([ic, title, desc, href, ext]) => `
            <a class="assist__opt" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>
              <span class="assist__opt-icon">${ic === 'zalo' ? '<img src="assets/icons/zalo.png" alt="" width="34" height="34" loading="lazy">' : icon(ic)}</span>
              <span class="assist__opt-text"><b>${title}</b><small>${desc}</small></span>
              ${icon('chevron-right')}
            </a>`).join('')}
        </div>
      </div>
      <p class="assist__tip" data-assist-tip hidden>Cần tư vấn? Hỏi mình nhé!</p>
      <button class="floating__btn floating__btn--assist" type="button" data-assist-toggle aria-expanded="false" aria-controls="assist-panel" aria-label="Mở trợ lý hỗ trợ khách hàng">${MASCOT_SVG}</button>
    </div>`;
}

/* Footer: hình thức thanh toán / giao hàng (khớp trang Hướng dẫn thanh toán + Chính sách giao hàng) */
const FOOTER_PAYMENTS = [
  ['banknote', 'Tiền mặt', 'Trả khi nhận hàng (COD)'],
  ['landmark', 'Chuyển khoản', 'Qua ngân hàng'],
  ['wallet', 'Ví điện tử', 'MoMo, ZaloPay, VNPAY'],
  ['credit-card', 'Quẹt thẻ', 'ATM, Visa, MasterCard'],
  ['percent', 'Trả góp 0%', 'Qua thẻ tín dụng'],
];
const FOOTER_SHIPPING = [
  ['zap', 'Giao nhanh nội thành', 'TP.HCM: trong ngày hoặc hôm sau'],
  ['truck', 'Giao toàn quốc', '2–5 ngày làm việc'],
  ['store', 'Nhận tại cửa hàng', 'Đặt online, ghé shop lấy hàng'],
];

function renderFooter() {
  const year = new Date().getFullYear();
  const list = (title, links) => `
    <h3 class="footer-col__title">${title}</h3>
    <ul class="footer-col__list">${links.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}</ul>`;

  return `
    <footer class="site-footer" id="footer-contact">
      <div class="container site-footer__top">
        <div class="footer-brand">
          ${renderLogo()}
          <p class="footer-brand__slogan">“${COMPANY.slogan}”</p>
          <h3 class="footer-col__title footer-col__title--spaced">Kết nối với chúng tôi</h3>
          <div class="socials">
            <a href="${COMPANY.socials.facebook}" aria-label="Facebook" target="_blank" rel="noopener">${icon('facebook')}</a>
            <a href="${COMPANY.socials.tiktok}" aria-label="TikTok" target="_blank" rel="noopener">${icon('music-2')}</a>
            <a href="${COMPANY.socials.youtube}" aria-label="YouTube" target="_blank" rel="noopener">${icon('youtube')}</a>
            <a href="${COMPANY.socials.github}" aria-label="GitHub" target="_blank" rel="noopener">${icon('github')}</a>
          </div>
          <h3 class="footer-col__title footer-col__title--spaced" data-install-wrap>Tải ứng dụng</h3>
          <button class="footer-app" type="button" data-install>
            <img src="assets/icons/icon-192.png" alt="" width="36" height="36" loading="lazy">
            <span><b>App ${COMPANY.name}</b><small>Android &amp; iPhone · Miễn phí</small></span>
            ${icon('download')}
          </button>
        </div>
        <div>
          <h3 class="footer-col__title">Tổng đài hỗ trợ</h3>
          <ul class="footer-support">
            <li><span>Mua hàng - Tư vấn</span><a href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a></li>
            <li><span>Kỹ thuật - Bảo hành</span><a href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a></li>
            <li><span>Email</span><a href="mailto:${COMPANY.email}">${COMPANY.email}</a></li>
            <li><span>Địa chỉ</span><p>${COMPANY.address}</p></li>
          </ul>
        </div>
        <div>
          ${list('Về Minh Khôi PC', [['Giới thiệu', 'chinh-sach?type=gioi-thieu'], ['Tin tức - Review', 'tin-tuc'], ['Liên hệ', 'lien-he']])}
          <div class="footer-col__gap"></div>
          ${list('Chính sách', [['Chính sách bảo hành', 'chinh-sach?type=bao-hanh'], ['Chính sách đổi trả', 'chinh-sach?type=doi-tra'], ['Chính sách giao hàng', 'chinh-sach?type=giao-hang'], ['Bảo mật thông tin', 'chinh-sach?type=bao-mat']])}
        </div>
        <div>
          ${list('Thông tin', [['Hệ thống cửa hàng', 'lien-he'], ['Hướng dẫn mua hàng', 'chinh-sach?type=huong-dan-mua-hang'], ['Hướng dẫn thanh toán', 'chinh-sach?type=thanh-toan'], ['Hướng dẫn trả góp', 'chinh-sach?type=tra-gop'], ['Tra cứu đơn hàng', 'tra-cuu-don-hang'], ['Build PC', 'xay-dung-cau-hinh']])}
        </div>
        <div class="footer-pay">
          <h3 class="footer-col__title">Hỗ trợ thanh toán</h3>
          <ul class="pay-grid">
            ${FOOTER_PAYMENTS.map(([ic, title, desc]) => `<li class="pay-tile">${icon(ic)}<b>${title}</b><small>${desc}</small></li>`).join('')}
          </ul>
          <h3 class="footer-col__title footer-col__title--spaced">Hình thức vận chuyển</h3>
          <div class="footer-ship">
            <ul class="ship-list">
              ${FOOTER_SHIPPING.map(([ic, title, desc]) => `<li class="ship-item"><span class="ship-item__icon">${icon(ic)}</span><span><b>${title}</b><small>${desc}</small></span></li>`).join('')}
            </ul>
            <a class="freeship" href="chinh-sach?type=giao-hang">${icon('gift')}<span>Miễn phí giao hàng đơn từ <b>${formatPrice(SHOP.freeShipFrom)}</b></span>${icon('chevron-right')}</a>
          </div>
        </div>
      </div>
      <div class="container"><div class="site-footer__bottom">
        <p>© ${year} ${COMPANY.name} — ${COMPANY.address}. Điện thoại: ${COMPANY.phoneDisplay}. Email: ${COMPANY.email}.</p>
        <p>${COMPANY.slogan}</p>
      </div></div>
    </footer>
    <div class="floating">
      ${renderAssist()}
      <a class="floating__btn floating__btn--zalo" href="${COMPANY.zalo}" target="_blank" rel="noopener" aria-label="Chat Zalo với cửa hàng"><img src="assets/icons/zalo.png" alt="" width="56" height="56" loading="lazy"></a>
      <button class="floating__btn floating__btn--top" type="button" data-back-top aria-label="Lên đầu trang">
        <svg class="floating__ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/><circle class="floating__ring-bar" cx="24" cy="24" r="22" pathLength="100"/></svg>
        ${icon('chevron-up')}
      </button>
    </div>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

/* ---------- Breadcrumb + tiêu đề trang ---------- */
function renderBreadcrumb(items) {
  const all = [['Trang chủ', HOME_URL], ...items];
  return `
    <nav class="breadcrumb" aria-label="Đường dẫn">
      <ol>${all.map(([text, href], i) => (i === all.length - 1
        ? `<li aria-current="page">${text}</li>`
        : `<li><a href="${href}">${text}</a>${icon('chevron-right')}</li>`)).join('')}</ol>
    </nav>`;
}

/* ---------- Nội dung bài viết / chính sách ---------- */
function renderRichText(blocks) {
  return blocks.map(([type, value]) => {
    if (type === 'h') return `<h2>${value}</h2>`;
    if (type === 'ul') return `<ul>${value.map((v) => `<li>${v}</li>`).join('')}</ul>`;
    return `<p>${value}</p>`;
  }).join('');
}

/* ---------- Trạng thái rỗng ---------- */
function renderEmpty(iconName, title, desc, actionHTML = '') {
  return `
    <div class="empty">
      <span class="empty__icon">${icon(iconName)}</span>
      <h2 class="empty__title">${title}</h2>
      <p class="empty__desc">${desc}</p>
      ${actionHTML}
    </div>`;
}


/* =====================================================================
   GIAO DIỆN APP (chỉ khi mở bằng app đã cài trên điện thoại: html.is-app)
   Thanh tab dưới đáy, thanh tiêu đề có nút quay lại, màn hình Danh mục.
   Xem thử trên trình duyệt: thêm ?app=1 vào địa chỉ (tắt: ?app=0).
   ===================================================================== */
const APP_TABS = [
  { id: 'home', icon: 'house', label: 'Trang chủ', href: HOME_URL },
  { id: 'cats', icon: 'layout-grid', label: 'Danh mục' },
  { id: 'sale', icon: 'badge-percent', label: 'Khuyến mãi', href: 'danh-muc?sale=1' },
  { id: 'cart', icon: 'shopping-cart', label: 'Giỏ hàng', href: 'gio-hang', badge: true },
  { id: 'account', icon: 'circle-user-round', label: 'Tài khoản', href: 'tai-khoan' },
];

const APP_SHORTCUTS = [
  { icon: 'cpu', label: 'Build PC', href: 'xay-dung-cau-hinh' },
  { icon: 'refresh-cw', label: 'Thu cũ đổi mới', href: 'thu-cu-doi-moi' },
  { icon: 'clipboard-list', label: 'Tra cứu đơn', href: 'tra-cuu-don-hang' },
  { icon: 'message-circle', label: 'Chat Zalo', href: COMPANY.zalo, external: true },
];

function renderTabBar(active) {
  return `
    <nav class="tabbar" aria-label="Điều hướng app">
      ${APP_TABS.map((t) => {
        const inner = `${icon(t.icon)}<span>${t.label}</span>${t.badge ? '<b class="tabbar__badge" data-cart-count>0</b>' : ''}`;
        const cls = `tabbar__item${t.id === active ? ' is-active' : ''}`;
        return t.href
          ? `<a class="${cls}" href="${t.href}" data-app-tab="${t.id}"${t.id === active ? ' aria-current="page"' : ''}>${inner}</a>`
          : `<button class="${cls}" type="button" data-app-tab="${t.id}" data-cats-open aria-controls="app-cats">${inner}</button>`;
      }).join('')}
    </nav>`;
}

function renderAppShortcuts() {
  return `
    <section class="container app-shortcuts" aria-label="Tiện ích">
      ${APP_SHORTCUTS.map((s) => `
        <a class="app-shortcut" href="${s.href}"${s.external ? ' target="_blank" rel="noopener"' : ''}>
          <span class="app-shortcut__icon">${icon(s.icon)}</span><span>${s.label}</span>
        </a>`).join('')}
    </section>`;
}

/* Thanh tiêu đề trang con: quay lại · tên trang · tìm kiếm */
function renderAppBarControls(title) {
  return `
    <button class="appbar__btn" type="button" data-app-back aria-label="Quay lại">${icon('chevron-left')}</button>
    <p class="appbar__title">${esc(title)}</p>
    <button class="appbar__btn" type="button" data-app-search aria-label="Tìm kiếm" aria-expanded="false">${icon('search')}</button>`;
}

/* Màn hình Danh mục: cột trái chọn nhóm, bên phải nhóm con + bán chạy */
const APP_SUPPORT = { id: 'ho-tro', icon: 'headset', name: 'Hỗ trợ' };

function renderAppCats() {
  const rail = [...CATEGORIES, APP_SUPPORT];
  return `
    <div class="app-cats" id="app-cats" role="dialog" aria-modal="true" aria-label="Danh mục sản phẩm" hidden>
      <div class="app-cats__head">
        <p class="app-cats__title">Danh mục</p>
        <button class="appbar__btn" type="button" data-cats-close aria-label="Đóng danh mục">${icon('x')}</button>
      </div>
      <div class="app-cats__body">
        <div class="app-cats__rail" role="tablist" aria-orientation="vertical">
          ${rail.map((c, i) => `
            <button class="app-cats__tab${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-cats-tab="${c.id}">
              ${icon(c.icon)}<span>${c.name}</span>
            </button>`).join('')}
        </div>
        <div class="app-cats__pane" role="tabpanel" data-cats-pane></div>
      </div>
    </div>`;
}

function appCatsPaneHTML(catId) {
  if (catId === APP_SUPPORT.id) {
    const link = (ic, text, href, ext) => `<a class="app-cats__row" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${icon(ic)}<span>${text}</span>${icon('chevron-right')}</a>`;
    return `
      <p class="app-cats__group">Liên hệ cửa hàng</p>
      ${link('phone', `Hotline <b>${COMPANY.phoneDisplay}</b>`, `tel:${COMPANY.phone}`)}
      ${link('message-circle', 'Chat Zalo', COMPANY.zalo, true)}
      ${link('mail', COMPANY.email, `mailto:${COMPANY.email}`)}
      ${link('map-pin', 'Địa chỉ cửa hàng', 'lien-he')}
      <p class="app-cats__group">Tiện ích</p>
      ${link('clipboard-list', 'Tra cứu đơn hàng', 'tra-cuu-don-hang')}
      ${link('heart', 'Sản phẩm yêu thích', 'yeu-thich')}
      ${link('git-compare-arrows', 'So sánh sản phẩm', 'so-sanh')}
      ${link('newspaper', 'Tin tức công nghệ', 'tin-tuc')}
      <p class="app-cats__group">Chính sách</p>
      ${Object.entries(POLICIES).map(([k, v]) => link('file-text', v.title, `chinh-sach?type=${k}`)).join('')}
      <p class="app-cats__foot">${COMPANY.name} · ${COMPANY.address}</p>`;
  }
  const c = CATEGORIES.find((x) => x.id === catId);
  if (!c) return '';
  const rule = CATEGORY_RULES[c.id];
  const top = rule ? PRODUCTS.filter((p) => rule.match(p) && (c.id === 'used' || !p.tags.includes('used'))).sort((a, b) => b.reviews - a.reviews).slice(0, 6) : [];
  return `
    <a class="app-cats__all" href="danh-muc?cat=${c.id}">
      <span>Xem tất cả<b>${c.name}</b></span>${icon('chevron-right')}
    </a>
    ${top.length ? `
      <p class="app-cats__group">${icon('flame')}Bán chạy</p>
      <div class="app-cats__products">
        ${top.map((p) => `
          <a class="app-cats__product" href="${productUrl(p)}">
            <img src="${thumb(p.img)}" alt="${p.name}" width="96" height="96" loading="lazy">
            <span>${p.name}</span>
            <b>${formatPrice(p.price)}</b>
          </a>`).join('')}
      </div>` : ''}
    ${c.groups.map((g) => `
      <p class="app-cats__group">${g.title}</p>
      <div class="app-cats__chips">
        ${g.links.map((l) => catLink(c, l)).map(([text, href]) => `<a href="${href}">${text}</a>`).join('')}
      </div>`).join('')}`;
}
