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
const slugify = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

const LOGO_MARK = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 50 17 14h10l5 14 12-14h10l-9 36h-9l5-20-11 13h-5l-4-13-5 20z" fill="currentColor"/></svg>';

/* Link trang chủ: trên web dùng "./" (địa chỉ gọn https://khoitran206.github.io/), mở file trên máy dùng index.html */
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
        <form class="search" role="search" action="category.html">
          <label class="sr-only" for="search-input">Tìm kiếm sản phẩm</label>
          <input class="search__input" id="search-input" name="q" type="search" placeholder="Bạn cần tìm gì?" autocomplete="off" aria-controls="search-suggest">
          <button class="search__btn" type="submit" aria-label="Tìm kiếm">${icon('search')}</button>
          <div class="search__suggest" id="search-suggest" role="listbox" aria-label="Gợi ý sản phẩm"></div>
        </form>
        <nav class="header-actions" aria-label="Tiện ích">
          <a class="header-action" href="tel:${COMPANY.phone}">${icon('headphones')}<span>Hotline<br><b>${COMPANY.phoneDisplay}</b></span></a>
          <a class="header-action" href="contact.html">${icon('map-pin')}<span>Hệ thống<br>cửa hàng</span></a>
          <a class="header-action" href="order.html">${icon('clipboard-list')}<span>Tra cứu<br>đơn hàng</span></a>
          <a class="header-cart header-wish" href="wishlist.html" aria-label="Sản phẩm yêu thích" title="Sản phẩm yêu thích">
            ${icon('heart')}<span class="cart-count" data-wish-count hidden>0</span>
          </a>
          <a class="header-cart" href="cart.html" aria-label="Giỏ hàng">
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
          <nav class="cat-menu subnav__dropdown" id="cat-dropdown" aria-label="Danh mục sản phẩm">${renderCategoryMenu()}</nav>
        </div>
        <ul class="subnav__list">
          ${SUB_NAV.map((l) => `<li><a class="subnav__link" href="${l.href}">${l.text}</a></li>`).join('')}
        </ul>
      </div>
    </nav>`;
}

/* ---------- Menu danh mục (desktop: mega menu) ----------
   Liên kết: 'chữ' → tìm trong danh mục đó, hoặc ['chữ', 'địa chỉ riêng'] */
const catLink = (c, l) => (Array.isArray(l) ? l : [l, `category.html?cat=${c.id}&q=${encodeURIComponent(l)}`]);

function renderCategoryMenu() {
  return `<ul>${CATEGORIES.map((c) => `
    <li class="cat-menu__item" data-mega-cat="${c.id}">
      <a class="cat-menu__link" href="category.html?cat=${c.id}">${icon(c.icon)}<span>${c.name}</span>${icon('chevron-right', 'cat-menu__chevron')}</a>
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
      <a class="mega__all" href="category.html?cat=${catId}">Xem tất cả ${all.length} sản phẩm${icon('chevron-right')}</a>
    </div>
    <div class="mega__products">
      ${top.map((p) => `
        <a class="mega-card" href="product.html?id=${p.id}">
          <span class="mega-card__img"><img src="${thumb(p.img)}" alt="${p.name}" width="120" height="120" loading="lazy"></span>
          <span class="mega-card__name">${p.name}</span>
          <b class="mega-card__price">${formatPrice(p.price)}</b>
          ${p.oldPrice > p.price ? `<del class="mega-card__old">${formatPrice(p.oldPrice)}</del>` : ''}
        </a>`).join('')}
    </div>`;
}

/* ---------- Drawer (mobile + nút Danh mục) ---------- */
function renderDrawer() {
  return `
    <div class="drawer" id="drawer" aria-hidden="true">
      <div class="drawer__overlay" data-drawer-close></div>
      <aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Danh mục sản phẩm">
        <div class="drawer__head">
          ${renderLogo()}
          <button class="header-icon-btn" type="button" data-drawer-close aria-label="Đóng danh mục">${icon('x')}</button>
        </div>
        <div class="drawer__body">
          ${CATEGORIES.map((c) => `
            <details class="drawer__group">
              <summary>${icon(c.icon)}<span>${c.name}</span>${icon('chevron-right', 'drawer__chevron')}</summary>
              <div class="drawer__sub">
                <a class="drawer__all" href="category.html?cat=${c.id}">Xem tất cả ${c.name}${icon('chevron-right')}</a>
                ${c.groups.flatMap((g) => g.links).slice(0, 10).map((l) => catLink(c, l)).map(([text, href]) => `<a href="${href}">${text}</a>`).join('')}
              </div>
            </details>`).join('')}
        </div>
        <div class="drawer__foot">
          <a href="wishlist.html">${icon('heart')}<span>Sản phẩm yêu thích</span></a>
          <a href="compare.html">${icon('git-compare-arrows')}<span>So sánh sản phẩm</span></a>
          <a href="order.html">${icon('clipboard-list')}<span>Tra cứu đơn hàng</span></a>
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
    return `<a class="header-login" href="login.html" aria-label="Đăng nhập">${icon('user-round')}<span>Đăng nhập</span></a>`;
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
      <a href="account.html" role="menuitem">${icon('user-round')}Tài khoản của tôi</a>
      <a href="account.html#don-hang" role="menuitem">${icon('shopping-bag')}Đơn hàng của tôi</a>
      <a href="wishlist.html" role="menuitem">${icon('heart')}Sản phẩm yêu thích</a>
      ${Auth.isAdmin(user) ? `<a href="admin.html" role="menuitem">${icon('layout-dashboard')}Quản trị cửa hàng</a>` : ''}
      <button type="button" role="menuitem" data-logout>${icon('log-out')}Đăng xuất</button>
    </div>`;
}

/* ---------- Product card (dùng chung toàn site) ---------- */
function renderProductCard(p, options = {}) {
  const discount = discountPercent(p.price, p.oldPrice);
  const url = `product.html?id=${p.id}`;
  const specs = p.specs.slice(0, 4).map(([type, value]) => `<li>${icon(SPEC_ICONS[type] || 'dot')}<span>${value}</span></li>`).join('');

  const compact = !!options.compact;
  const wished = Wishlist.has(p.id);
  const compared = Compare.has(p.id);

  return `
    <article class="product-card${compact ? ' product-card--compact' : ''} ${options.itemClass || ''}" style="--i:${options.index || 0}">
      <a class="product-card__media" href="${url}" tabindex="-1" aria-hidden="true">
        <img src="${thumb(p.img)}" alt="${p.name}" loading="lazy" width="200" height="200">
        ${discount ? `<span class="product-card__discount">Giảm ${discount}%</span>` : ''}
      </a>
      <button class="product-card__cart" type="button" data-add-cart="${p.id}" aria-label="Thêm ${p.name} vào giỏ hàng">${icon('shopping-cart')}</button>
      <div class="product-card__tools">
        <button class="product-card__tool${wished ? ' is-active' : ''}" type="button" data-wish="${p.id}" aria-pressed="${wished}" aria-label="Yêu thích ${p.name}" title="Yêu thích">${icon('heart')}</button>
        <button class="product-card__tool product-card__tool--compare${compared ? ' is-active' : ''}" type="button" data-compare="${p.id}" aria-pressed="${compared}" aria-label="So sánh ${p.name}" title="So sánh">${icon('git-compare-arrows')}</button>
      </div>
      ${p.label && !compact ? `<span class="product-card__tag">${icon('flame')}${p.label}</span>` : ''}
      <h3 class="product-card__name"><a href="${url}">${p.name}</a></h3>
      ${compact ? '' : `<ul class="product-card__specs" aria-label="Thông số chính">${specs}</ul>`}
      <div class="product-card__prices">
        ${discount ? `<div class="product-card__old-row"><del class="product-card__old">${formatPrice(p.oldPrice)}</del><span class="product-card__percent">-${discount}%</span></div>` : ''}
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
    <a class="promo promo--${b.theme}${size ? ` promo--${size}` : ''}" href="${b.href || 'category.html?sale=1'}" aria-label="${plainTitle}">
      <div class="promo__content">
        ${b.tag ? `<span class="promo__tag">${b.tag}</span>` : ''}
        <h3 class="promo__title">${b.title}</h3>
        ${b.desc ? `<p class="promo__desc">${b.desc}</p>` : ''}
        ${b.cta ? `<span class="btn btn--light promo__cta">${b.cta}${icon('arrow-right')}</span>` : ''}
      </div>
      <img class="promo__img" src="${IMG}${b.img}" alt="" loading="lazy">
    </a>`;
}

/* ---------- Footer ---------- */
function renderFooter() {
  const year = new Date().getFullYear();
  const list = (title, links) => `
    <h3 class="footer-col__title">${title}</h3>
    <ul class="footer-col__list">${links.map(([text, href]) => `<li><a href="${href}">${text}</a></li>`).join('')}</ul>`;
  const chips = (items) => `<div class="chips">${items.map((c) => `<span class="chip">${c}</span>`).join('')}</div>`;

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
          ${list('Về Minh Khôi PC', [['Giới thiệu', 'policy.html?type=gioi-thieu'], ['Tin tức - Review', 'news.html'], ['Liên hệ', 'contact.html']])}
          <div class="footer-col__gap"></div>
          ${list('Chính sách', [['Chính sách bảo hành', 'policy.html?type=bao-hanh'], ['Chính sách đổi trả', 'policy.html?type=doi-tra'], ['Chính sách giao hàng', 'policy.html?type=giao-hang'], ['Bảo mật thông tin', 'policy.html?type=bao-mat']])}
        </div>
        <div>
          ${list('Thông tin', [['Hệ thống cửa hàng', 'contact.html'], ['Hướng dẫn mua hàng', 'policy.html?type=huong-dan-mua-hang'], ['Hướng dẫn thanh toán', 'policy.html?type=thanh-toan'], ['Hướng dẫn trả góp', 'policy.html?type=tra-gop'], ['Tra cứu đơn hàng', 'order.html'], ['Build PC', 'build-pc.html']])}
        </div>
        <div>
          <h3 class="footer-col__title">Hỗ trợ thanh toán</h3>
          ${chips(['VISA', 'MasterCard', 'JCB', 'VNPAY', 'MoMo', 'ZaloPay', 'Tiền mặt', 'Trả góp'])}
          <h3 class="footer-col__title footer-col__title--spaced">Hình thức vận chuyển</h3>
          <div class="chips chips--auto">${['Giao nội thành', 'Giao toàn quốc', 'Nhận tại cửa hàng'].map((c) => `<span class="chip">${c}</span>`).join('')}</div>
        </div>
      </div>
      <div class="container"><div class="site-footer__bottom">
        <p>© ${year} ${COMPANY.name} — ${COMPANY.address}. Điện thoại: ${COMPANY.phoneDisplay}. Email: ${COMPANY.email}.</p>
        <p>${COMPANY.slogan}</p>
      </div></div>
    </footer>
    <div class="floating">
      <a class="floating__btn floating__btn--call" href="tel:${COMPANY.phone}" aria-label="Gọi hotline ${COMPANY.phoneDisplay}">${icon('phone')}</a>
      <a class="floating__btn" href="${COMPANY.zalo}" target="_blank" rel="noopener" aria-label="Chat Zalo với cửa hàng">${icon('message-circle')}</a>
      <button class="floating__btn floating__btn--top" type="button" data-back-top aria-label="Lên đầu trang">${icon('arrow-up')}</button>
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
