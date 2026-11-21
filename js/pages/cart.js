/* ==========================================================
   Trang giỏ hàng
   ========================================================== */

const COUPON_KEY = 'mkpc-coupon';

function summaryHTML(totals) {
  const remain = SHOP.freeShipFrom - totals.subtotal;
  const pct = Math.min(100, Math.round((totals.subtotal / SHOP.freeShipFrom) * 100));
  return `
    <div class="ship-progress">
      <p>${remain > 0 ? `Mua thêm <b>${formatPrice(remain)}</b> để được <b>miễn phí giao hàng</b>` : `${icon('party-popper')}Đơn hàng của bạn được <b>miễn phí giao hàng</b>`}</p>
      <div class="ship-progress__bar"><span class="ship-progress__fill" data-width="${pct}"></span></div>
    </div>
    <form class="coupon" data-coupon-form>
      <label class="sr-only" for="coupon-input">Mã giảm giá</label>
      <input class="input" id="coupon-input" name="code" placeholder="Nhập mã giảm giá" value="${esc(totals.coupon.code || Store.get(COUPON_KEY, ''))}" autocomplete="off">
      <button class="btn btn--dark" type="submit">Áp dụng</button>
    </form>
    ${totals.coupon.message ? `<p class="coupon__msg ${totals.coupon.ok ? 'is-ok' : 'is-error'}">${icon(totals.coupon.ok ? 'badge-check' : 'circle-alert')}${totals.coupon.message}</p>` : ''}
    <p class="coupon__hint">Thử mã: ${Object.keys(SHOP.coupons).map((c) => `<button type="button" class="coupon__tag" data-coupon="${c}">${c}</button>`).join(' ')}</p>
    <dl class="totals">
      <div><dt>Tạm tính</dt><dd>${formatPrice(totals.subtotal)}</dd></div>
      ${totals.discount ? `<div class="totals__discount"><dt>Giảm giá (${totals.coupon.code})</dt><dd>-${formatPrice(totals.discount)}</dd></div>` : ''}
      <div><dt>Phí giao hàng</dt><dd>${totals.shipping ? formatPrice(totals.shipping) : 'Miễn phí'}</dd></div>
      <div class="totals__grand"><dt>Tổng cộng</dt><dd>${formatPrice(totals.total)}<small>(Đã bao gồm VAT nếu có)</small></dd></div>
    </dl>
    <a class="btn btn--primary btn--lg btn--block" href="checkout.html">TIẾN HÀNH ĐẶT HÀNG${icon('arrow-right')}</a>
    <a class="btn btn--ghost btn--block" href="category.html">${icon('arrow-left')}Tiếp tục mua sắm</a>`;
}

function render() {
  const root = $('#cart-page');
  const lines = Cart.lines();

  if (!lines.length) {
    root.innerHTML = `
      ${renderBreadcrumb([['Giỏ hàng', '#']])}
      <div class="panel">${renderEmpty('shopping-cart', 'Giỏ hàng của bạn đang trống', 'Hãy chọn thêm sản phẩm để mua sắm nhé.', `<a class="btn btn--primary" href="${HOME_URL}">Về trang chủ mua sắm</a>`)}</div>
      ${suggestionsHTML()}`;
    refreshIcons();
    initSliders(root);
    initReveal(root);
    return;
  }

  const totals = calcTotals(lines, Store.get(COUPON_KEY, ''));
  root.innerHTML = `
    ${renderBreadcrumb([['Giỏ hàng', '#']])}
    <h1 class="page-title">Giỏ hàng<small>${Cart.count()} sản phẩm</small></h1>
    <div class="checkout-grid">
      <section class="panel">
        <div class="cart-head">
          <span>Sản phẩm</span>
          <button type="button" class="btn btn--ghost" data-clear>${icon('trash-2')}Xóa tất cả</button>
        </div>
        <ul class="cart-list">
          ${lines.map(({ p, qty, total }) => `
            <li class="cart-item" data-id="${p.id}">
              <a class="cart-item__img" href="product.html?id=${p.id}"><img src="${thumb(p.img)}" alt="${p.name}" width="88" height="88" loading="lazy"></a>
              <div class="cart-item__info">
                <a class="cart-item__name" href="product.html?id=${p.id}">${p.name}</a>
                <p class="cart-item__price">${formatPrice(p.price)} ${p.oldPrice > p.price ? `<del>${formatPrice(p.oldPrice)}</del>` : ''}</p>
                ${p.gift ? `<p class="cart-item__gift">${icon('gift')}${p.gift}</p>` : ''}
                <button type="button" class="cart-item__remove" data-remove>${icon('trash-2')}Xóa</button>
              </div>
              <div class="cart-item__side">
                <div class="qty">
                  <button class="qty__btn" type="button" data-step="-1" aria-label="Giảm số lượng" ${qty <= 1 ? 'disabled' : ''}>${icon('minus')}</button>
                  <input class="qty__input" type="number" value="${qty}" min="1" max="${p.stock}" aria-label="Số lượng ${p.name}" data-qty-input>
                  <button class="qty__btn" type="button" data-step="1" aria-label="Tăng số lượng" ${qty >= p.stock ? 'disabled' : ''}>${icon('plus')}</button>
                </div>
                <b class="cart-item__total">${formatPrice(total)}</b>
              </div>
            </li>`).join('')}
        </ul>
      </section>
      <aside class="panel summary">
        <h2 class="panel__title">${icon('receipt')}Thông tin đơn hàng</h2>
        ${summaryHTML(totals)}
      </aside>
    </div>
    ${suggestionsHTML()}`;

  $$('.ship-progress__fill', root).forEach((el) => { el.style.width = `${el.dataset.width}%`; });
  refreshIcons();
  initSliders(root);
  initReveal(root);
}

function suggestionsHTML() {
  const inCart = Object.keys(Cart.read());
  const list = PRODUCTS.filter((p) => !inCart.includes(p.id) && p.cat !== 'pc').sort((a, b) => b.reviews - a.reviews).slice(0, 10);
  return `
    <section class="section block reveal">
      <div class="block-head"><h2 class="block-head__title">Có thể bạn cũng thích</h2></div>
      ${sliderHTML(productCardsHTML(list, { compact: true }))}
    </section>`;
}

function initPage() {
  render();
  const root = $('#cart-page');

  root.addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    const step = e.target.closest('[data-step]');
    if (item && step) {
      Cart.set(item.dataset.id, (Cart.read()[item.dataset.id] || 0) + Number(step.dataset.step));
      render();
    } else if (item && e.target.closest('[data-remove]')) {
      const p = productById(item.dataset.id);
      Cart.remove(item.dataset.id);
      render();
      showToast(`Đã xóa “${esc(p.name)}” khỏi giỏ hàng`);
    } else if (e.target.closest('[data-clear]')) {
      if (window.confirm('Xóa toàn bộ sản phẩm trong giỏ hàng?')) {
        Cart.clear();
        render();
      }
    } else if (e.target.closest('[data-coupon]')) {
      Store.set(COUPON_KEY, e.target.closest('[data-coupon]').dataset.coupon);
      render();
    }
  });

  root.addEventListener('change', (e) => {
    if (!e.target.matches('[data-qty-input]')) return;
    const id = e.target.closest('.cart-item').dataset.id;
    Cart.set(id, Math.max(1, Number(e.target.value) || 1));
    render();
  });

  root.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-coupon-form]')) return;
    e.preventDefault();
    const code = new FormData(e.target).get('code').trim().toUpperCase();
    Store.set(COUPON_KEY, code);
    render();
  });
}
