/* ==========================================================
   Minh Khôi PC — Logic dùng chung cho mọi trang
   (giỏ hàng, đơn hàng, tìm kiếm, header/footer, slider, reveal...)
   Mỗi trang có thể khai báo hàm initPage() trong js/pages/*.js —
   hàm này được gọi sau khi header/footer đã render.
   ========================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const productById = (id) => PRODUCTS.find((p) => p.id === id);
const params = new URLSearchParams(location.search);

/* Chống chèn HTML khi hiển thị dữ liệu người dùng nhập */
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Bỏ dấu tiếng Việt để tìm kiếm */
const normalize = (text) => String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();

/* ---------- Lưu trữ trên trình duyệt (luôn bọc try/catch) ---------- */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* bỏ qua */
    }
  },
};

/* ---------- Giỏ hàng: { idSảnPhẩm: sốLượng } ---------- */
const Cart = {
  key: 'mkpc-cart',
  read() {
    const cart = Store.get(this.key, {});
    // Bỏ sản phẩm không còn tồn tại trong dữ liệu
    Object.keys(cart).forEach((id) => { if (!productById(id)) delete cart[id]; });
    return cart;
  },
  write(cart) {
    Store.set(this.key, cart);
    updateCartCount();
  },
  add(id, qty = 1) {
    const p = productById(id);
    if (!p) return { ok: false };
    const cart = this.read();
    const next = Math.min((cart[id] || 0) + qty, p.stock);
    const capped = next < (cart[id] || 0) + qty;
    cart[id] = next;
    this.write(cart);
    return { ok: true, capped, qty: next };
  },
  set(id, qty) {
    const p = productById(id);
    const cart = this.read();
    if (!p || qty <= 0) delete cart[id];
    else cart[id] = Math.min(qty, p.stock);
    this.write(cart);
  },
  remove(id) {
    this.set(id, 0);
  },
  clear() {
    this.write({});
  },
  count() {
    return Object.values(this.read()).reduce((sum, qty) => sum + qty, 0);
  },
  lines() {
    return Object.entries(this.read()).map(([id, qty]) => {
      const p = productById(id);
      return { p, qty, total: p.price * qty };
    });
  },
};

/* ---------- Mã giảm giá + phí giao hàng ---------- */
function checkCoupon(code, subtotal) {
  const key = String(code || '').trim().toUpperCase();
  if (!key) return { ok: false, discount: 0 };
  const c = SHOP.coupons[key];
  if (!c) return { ok: false, discount: 0, message: 'Mã giảm giá không tồn tại.' };
  if (subtotal < (c.minOrder || 0)) {
    return { ok: false, discount: 0, message: `Mã ${key} áp dụng cho đơn từ ${formatPrice(c.minOrder)}.` };
  }
  let discount = c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value;
  if (c.max) discount = Math.min(discount, c.max);
  return { ok: true, code: key, discount: Math.min(discount, subtotal), message: c.label };
}

function calcTotals(lines, couponCode, delivery = 'ship') {
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const coupon = checkCoupon(couponCode, subtotal);
  const shipping = delivery === 'pickup' || subtotal === 0 || subtotal >= SHOP.freeShipFrom ? 0 : SHOP.shippingFee;
  const discount = coupon.ok ? coupon.discount : 0;
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping), coupon };
}

/* ---------- Đơn hàng, hồ sơ, sản phẩm đã xem ---------- */
const Orders = {
  key: 'mkpc-orders',
  all() {
    return Store.get(this.key, []);
  },
  save(order) {
    const list = this.all();
    list.unshift(order);
    Store.set(this.key, list.slice(0, 50));
  },
  find(code) {
    return this.all().find((o) => o.code.toUpperCase() === String(code).trim().toUpperCase());
  },
};

const Profile = {
  key: 'mkpc-profile',
  get() {
    return Store.get(this.key, null);
  },
  set(data) {
    Store.set(this.key, data);
    updateAccountLabel();
  },
  clear() {
    Store.remove(this.key);
    updateAccountLabel();
  },
};

const Recent = {
  key: 'mkpc-recent',
  add(id) {
    const list = Store.get(this.key, []).filter((x) => x !== id);
    list.unshift(id);
    Store.set(this.key, list.slice(0, 12));
  },
  list(exclude) {
    return Store.get(this.key, []).filter((id) => id !== exclude).map(productById).filter(Boolean);
  },
};

/* ---------- Danh mục + tìm kiếm ---------- */
const Catalog = {
  /* "Dưới 15 triệu", "15 - 20 triệu", "Trên 1 triệu", "500K - 1 triệu" → khoảng giá */
  parsePrice(query) {
    const q = normalize(query);
    const money = (num, unit) => parseFloat(String(num).replace(',', '.')) * (unit === 'k' ? 1e3 : 1e6);
    let m = q.match(/(\d+(?:[.,]\d+)?)\s*(k|trieu)?\s*-\s*(\d+(?:[.,]\d+)?)\s*(k|trieu)/);
    if (m) return { min: money(m[1], m[2] || m[4]), max: money(m[3], m[4]) };
    m = q.match(/duoi\s*(\d+(?:[.,]\d+)?)\s*(k|trieu)/);
    if (m) return { min: 0, max: money(m[1], m[2]) };
    m = q.match(/tren\s*(\d+(?:[.,]\d+)?)\s*(k|trieu)/);
    if (m) return { min: money(m[1], m[2]), max: Infinity };
    return null;
  },

  haystack(p) {
    const catName = CATEGORY_RULES[p.cat]?.name || '';
    return normalize([p.name, p.brand, catName, p.tags.join(' '), p.specs.map((s) => s[1]).join(' ')].join(' '));
  },

  search(query, list = PRODUCTS) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return list;
    const scored = list.map((p) => {
      const hay = this.haystack(p);
      return { p, hits: tokens.filter((t) => hay.includes(t)).length };
    });
    const exact = scored.filter((s) => s.hits === tokens.length).map((s) => s.p);
    if (exact.length) return exact;
    // Không khớp hết từ khóa: trả về sản phẩm khớp nhiều từ nhất
    return scored.filter((s) => s.hits > 0).sort((a, b) => b.hits - a.hits).map((s) => s.p);
  },

  filter({ cat, q, sale, brands = [], min = 0, max = Infinity, sort = 'popular' } = {}) {
    let list = PRODUCTS.slice();
    if (cat && CATEGORY_RULES[cat]) list = list.filter(CATEGORY_RULES[cat].match);
    if (sale) list = list.filter((p) => p.oldPrice > p.price);
    let priceFromQuery = null;
    if (q) {
      priceFromQuery = this.parsePrice(q);
      if (!priceFromQuery) list = this.search(q, list);
    }
    const lo = Math.max(min, priceFromQuery?.min ?? 0);
    const hi = Math.min(max, priceFromQuery?.max ?? Infinity);
    list = list.filter((p) => p.price >= lo && p.price <= hi);
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    return this.sort(list, sort);
  },

  sort(list, sort) {
    const sorted = list.slice();
    const discount = (p) => discountPercent(p.price, p.oldPrice);
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'discount') sorted.sort((a, b) => discount(b) - discount(a));
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    else sorted.sort((a, b) => b.reviews - a.reviews); // phổ biến
    return sorted;
  },
};

/* ---------- Gửi form về email chủ shop (FormSubmit) ----------
   Trả về { ok, needsActivation, message }. Không bao giờ throw. */
async function sendToShop(fields) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(SHOP.orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _template: 'table', _captcha: 'false', ...fields }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    const ok = res.ok && String(data.success) === 'true';
    const needsActivation = /activat/i.test(data.message || '');
    return { ok, needsActivation, message: data.message || '' };
  } catch (err) {
    return { ok: false, needsActivation: false, message: err.name === 'AbortError' ? 'Hết thời gian chờ' : 'Lỗi kết nối' };
  } finally {
    clearTimeout(timer);
  }
}

const DELIVERY_LABELS = { ship: 'Giao hàng tận nơi', pickup: 'Nhận tại cửa hàng' };
const PAYMENT_LABELS = { cod: 'Thanh toán khi nhận hàng (COD)', bank: 'Chuyển khoản ngân hàng', installment: 'Trả góp', store: 'Thanh toán tại cửa hàng' };

/* Gửi 1 đơn hàng về email, cập nhật trạng thái emailSent */
async function sendOrderEmail(order) {
  const items = order.items.map((i, n) => `${n + 1}. ${i.name} — SL: ${i.qty} × ${formatPrice(i.price)} = ${formatPrice(i.price * i.qty)}`).join('\n');
  const result = await sendToShop({
    _subject: `Đơn hàng mới ${order.code} - ${order.customer.name} - ${formatPrice(order.totals.total)}`,
    ...(order.customer.email ? { _replyto: order.customer.email } : {}),
    'Mã đơn hàng': order.code,
    'Thời gian đặt': new Date(order.createdAt).toLocaleString('vi-VN'),
    'Khách hàng': order.customer.name,
    'Số điện thoại': order.customer.phone,
    Email: order.customer.email || '(không có)',
    'Hình thức nhận': DELIVERY_LABELS[order.delivery],
    'Địa chỉ giao hàng': order.delivery === 'ship' ? order.customer.address : COMPANY.address,
    'Thanh toán': PAYMENT_LABELS[order.payment],
    'Sản phẩm': items,
    'Tạm tính': formatPrice(order.totals.subtotal),
    'Giảm giá': order.totals.discount ? `-${formatPrice(order.totals.discount)} (${order.totals.couponCode})` : '0đ',
    'Phí giao hàng': order.totals.shipping ? formatPrice(order.totals.shipping) : 'Miễn phí',
    'TỔNG THANH TOÁN': formatPrice(order.totals.total),
    'Ghi chú': order.note || '(không có)',
  });
  const list = Orders.all();
  const saved = list.find((o) => o.code === order.code);
  if (saved) {
    saved.emailSent = result.ok;
    Store.set(Orders.key, list);
  }
  return result;
}

const isValidPhone = (v) => /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(String(v).replace(/[\s.-]/g, ''));
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

/* Đánh dấu lỗi cho một ô nhập */
function setFieldError(input, message) {
  const field = input.closest('.field');
  if (!field) return;
  field.classList.toggle('is-invalid', !!message);
  const err = $('.field__error', field);
  if (err) err.textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

/* ---------- UI nhỏ dùng chung ---------- */
function updateCartCount(bump = false) {
  $$('[data-cart-count]').forEach((el) => {
    el.textContent = Cart.count();
    if (bump) {
      el.classList.remove('is-bump');
      void el.offsetWidth; // chạy lại animation
      el.classList.add('is-bump');
    }
  });
}

function updateAccountLabel() {
  const profile = Profile.get();
  $$('[data-account-label]').forEach((el) => {
    el.textContent = profile?.name ? profile.name.split(' ').slice(-1)[0] : 'Tài khoản';
  });
}

let toastTimer;
function showToast(message, type = 'success') {
  const toast = $('#toast');
  if (!toast) return;
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `${icon(type === 'error' ? 'circle-alert' : 'circle-check')}<span>${message}</span>`;
  refreshIcons();
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

/* Lucide chỉ thay các thẻ <i data-lucide> chưa được chuyển thành SVG */
function refreshIcons() {
  if (window.lucide) lucide.createIcons();
}

function sliderHTML(itemsHTML) {
  return `
    <div class="slider" data-slider>
      <button class="slider__btn slider__btn--prev" type="button" aria-label="Xem sản phẩm trước">${icon('chevron-left')}</button>
      <div class="slider__track">${itemsHTML}</div>
      <button class="slider__btn slider__btn--next" type="button" aria-label="Xem sản phẩm tiếp theo">${icon('chevron-right')}</button>
    </div>`;
}

function productCardsHTML(list, options = {}) {
  if (!list.length) return '<p class="slider__empty">Sản phẩm đang được cập nhật.</p>';
  return list.map((p, index) => renderProductCard(p, { index, itemClass: 'reveal-item', ...options })).join('');
}

/* ---------- Slider sản phẩm (scroll-snap + nút) ---------- */
function updateSliderButtons(slider) {
  const track = $('.slider__track', slider);
  const max = track.scrollWidth - track.clientWidth - 2;
  $('.slider__btn--prev', slider).disabled = track.scrollLeft <= 2;
  $('.slider__btn--next', slider).disabled = track.scrollLeft >= max;
}

function initSliders(root = document) {
  $$('[data-slider]', root).forEach((slider) => {
    if (slider.dataset.ready) {
      updateSliderButtons(slider);
      return;
    }
    slider.dataset.ready = '1';
    const track = $('.slider__track', slider);
    $('.slider__btn--prev', slider).addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }));
    $('.slider__btn--next', slider).addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }));
    track.addEventListener('scroll', () => updateSliderButtons(slider), { passive: true });
    updateSliderButtons(slider);
  });
}

/* ---------- Nút thêm giỏ / mua ngay (ủy quyền sự kiện) ---------- */
function addToCartWithFeedback(id, qty = 1) {
  const p = productById(id);
  const result = Cart.add(id, qty);
  if (!result.ok) return result;
  updateCartCount(true);
  if (result.capped) showToast(`Chỉ còn ${p.stock} sản phẩm “${esc(p.name)}” trong kho`, 'error');
  else showToast(`Đã thêm “${esc(p.name)}” vào giỏ hàng`);
  return result;
}

function initCartButtons() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      addToCartWithFeedback(addBtn.dataset.addCart);
      return;
    }
    const buyBtn = e.target.closest('[data-buy-now]');
    if (buyBtn) {
      Cart.add(buyBtn.dataset.buyNow, Number(buyBtn.dataset.qty || 1));
      location.href = 'checkout.html';
    }
  });
}

/* ---------- Tìm kiếm có gợi ý ---------- */
function initSearch() {
  const form = $('.search');
  const input = $('#search-input');
  const box = $('#search-suggest');
  if (!form || !input || !box) return;
  if (params.get('q') && location.pathname.endsWith('category.html')) input.value = params.get('q');
  let active = -1;

  const close = () => {
    box.classList.remove('is-open');
    active = -1;
  };
  const render = () => {
    const q = input.value.trim();
    if (q.length < 2) return close();
    const results = Catalog.search(q).slice(0, 6);
    box.innerHTML = results.length
      ? results.map((p) => `
          <a class="suggest__item" href="product.html?id=${p.id}" role="option">
            <img src="${p.img}" alt="" width="44" height="44">
            <span class="suggest__name">${p.name}</span>
            <b class="suggest__price">${formatPrice(p.price)}</b>
          </a>`).join('') + `<a class="suggest__all" href="category.html?q=${encodeURIComponent(q)}">Xem tất cả kết quả cho “${esc(q)}”${icon('arrow-right')}</a>`
      : `<p class="suggest__empty">Không tìm thấy sản phẩm phù hợp với “${esc(q)}”.</p>`;
    refreshIcons();
    box.classList.add('is-open');
    active = -1;
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('keydown', (e) => {
    const items = $$('.suggest__item, .suggest__all', box);
    if (!box.classList.contains('is-open') || !items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((el, i) => el.classList.toggle('is-active', i === active));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      items[active].click();
    } else if (e.key === 'Escape') {
      close();
    }
  });
  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) close();
  });
  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      input.focus();
    }
  });
}

/* ---------- Drawer (menu mobile) ---------- */
function initDrawer() {
  const drawer = $('#drawer');
  if (!drawer) return;
  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    $('[data-drawer-close].header-icon-btn', drawer).focus();
  };
  const close = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };
  $$('[data-drawer-open]').forEach((b) => b.addEventListener('click', open));
  $$('[data-drawer-close]', drawer).forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
}

/* ---------- Nút "Danh mục" ở sub-nav ---------- */
function initCategoryDropdown() {
  const wrap = $('[data-cat-wrap]');
  if (!wrap) return;
  const btn = $('[data-cat-toggle]', wrap);
  const isDesktop = () => window.matchMedia('(min-width: 1025px)').matches;
  const setOpen = (open) => {
    wrap.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  };
  btn.addEventListener('click', () => {
    if (!isDesktop()) {
      $('[data-drawer-open]').click();
      return;
    }
    setOpen(!wrap.classList.contains('is-open'));
  });
  wrap.addEventListener('mouseenter', () => isDesktop() && setOpen(true));
  wrap.addEventListener('mouseleave', () => setOpen(false));
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ---------- Top bar: đổi thông báo luân phiên ---------- */
function initTopbar() {
  const msg = $('[data-topbar-msg]');
  if (!msg || PROMO_MESSAGES.length < 2) return;
  let i = 0;
  setInterval(() => {
    msg.classList.add('is-out');
    setTimeout(() => {
      i = (i + 1) % PROMO_MESSAGES.length;
      msg.textContent = PROMO_MESSAGES[i].text;
      msg.classList.remove('is-out');
    }, 300);
  }, 4000);
}

/* ---------- Scroll: header shadow + nút lên đầu trang ---------- */
function initScrollUI() {
  const header = $('#site-header');
  const backTop = $('[data-back-top]');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 40);
    backTop?.classList.toggle('is-visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0 }));
  onScroll();
}

/* ---------- Animation khi scroll ---------- */
let revealObserver;
function initReveal(root = document) {
  const items = $$('.reveal:not(.reveal--visible)', root);
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }
  revealObserver ||= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('reveal--visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => revealObserver.observe(el));
}

/* ---------- Khởi động ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const headerSlot = $('#site-header-slot');
  const footerSlot = $('#site-footer-slot');
  if (headerSlot) headerSlot.outerHTML = renderHeader();
  if (footerSlot) footerSlot.outerHTML = renderFooter() + renderDrawer();

  if (typeof initPage === 'function') initPage();

  refreshIcons();
  updateCartCount();
  updateAccountLabel();

  initTopbar();
  initCategoryDropdown();
  initSearch();
  initSliders();
  initCartButtons();
  initDrawer();
  initScrollUI();
  initReveal();

  window.addEventListener('resize', () => $$('[data-slider]').forEach(updateSliderButtons));
});
