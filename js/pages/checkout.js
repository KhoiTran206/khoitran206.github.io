/* ==========================================================
   Trang thanh toán — gửi đơn về email chủ shop qua FormSubmit
   ========================================================== */

const CHECKOUT_COUPON_KEY = 'mkpc-coupon';

function orderCode() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MK${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}${rand}`;
}

function field(name, label, { type = 'text', required = false, placeholder = '', value = '', full = false, autocomplete = '' } = {}) {
  return `
    <div class="field${full ? ' field--full' : ''}">
      <label class="field__label" for="f-${name}">${label}${required ? ' <b>*</b>' : ''}</label>
      <input class="input" id="f-${name}" name="${name}" type="${type}" placeholder="${placeholder}" value="${esc(value)}" ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''}>
      <span class="field__error"></span>
    </div>`;
}

function summaryBox(totals, lines) {
  return `
    <h2 class="panel__title">${icon('shopping-bag')}Đơn hàng (${lines.reduce((s, l) => s + l.qty, 0)} sản phẩm)<a class="summary__edit" href="gio-hang">Sửa</a></h2>
    <ul class="mini-list">
      ${lines.map(({ p, qty, total }) => `
        <li>
          <span class="mini-list__img"><img src="${thumb(p.img)}" alt="" width="56" height="56"><b>${qty}</b></span>
          <span class="mini-list__name">${p.name}</span>
          <span class="mini-list__price">${formatPrice(total)}</span>
        </li>`).join('')}
    </ul>
    <div class="coupon">
      <label class="sr-only" for="co-coupon">Mã giảm giá</label>
      <input class="input" id="co-coupon" placeholder="Mã giảm giá" value="${esc(Store.get(CHECKOUT_COUPON_KEY, ''))}" autocomplete="off">
      <button class="btn btn--dark" type="button" data-apply-coupon>Áp dụng</button>
    </div>
    ${totals.coupon.message ? `<p class="coupon__msg ${totals.coupon.ok ? 'is-ok' : 'is-error'}">${icon(totals.coupon.ok ? 'badge-check' : 'circle-alert')}${totals.coupon.message}</p>` : ''}
    <dl class="totals">
      <div><dt>Tạm tính</dt><dd>${formatPrice(totals.subtotal)}</dd></div>
      ${totals.discount ? `<div class="totals__discount"><dt>Giảm giá (${totals.coupon.code})</dt><dd>-${formatPrice(totals.discount)}</dd></div>` : ''}
      <div><dt>Phí giao hàng</dt><dd>${totals.shipping ? formatPrice(totals.shipping) : 'Miễn phí'}</dd></div>
      <div class="totals__grand"><dt>Tổng thanh toán</dt><dd>${formatPrice(totals.total)}</dd></div>
    </dl>`;
}

function render() {
  const root = $('#checkout-page');
  const lines = Cart.lines();
  if (!lines.length) {
    root.innerHTML = `${renderBreadcrumb([['Thanh toán', '#']])}<div class="panel">${renderEmpty('shopping-cart', 'Chưa có sản phẩm để thanh toán', 'Giỏ hàng của bạn đang trống.', `<a class="btn btn--primary" href="${HOME_URL}">Tiếp tục mua sắm</a>`)}</div>`;
    return;
  }
  const user = Auth.current();
  const profile = Profile.get() || {};
  const totals = calcTotals(lines, Store.get(CHECKOUT_COUPON_KEY, ''), 'ship');
  const loginHint = user ? '' : `
    <p class="alert alert--info checkout__login">${icon('user-round')}<span>Đã có tài khoản? <a href="dang-nhap?next=thanh-toan">Đăng nhập</a> để điền nhanh và theo dõi đơn hàng, hoặc <a href="dang-nhap?tab=register&amp;next=thanh-toan">đăng ký</a>.</span></p>`;

  root.innerHTML = `
    ${renderBreadcrumb([['Giỏ hàng', 'gio-hang'], ['Thanh toán', '#']])}
    <ol class="steps" aria-label="Các bước đặt hàng">
      <li class="is-done">${icon('shopping-cart')}Giỏ hàng</li>
      <li class="is-active">${icon('clipboard-pen')}Thông tin đặt hàng</li>
      <li>${icon('circle-check')}Hoàn tất</li>
    </ol>
    <form class="checkout-grid" id="checkout-form" novalidate>
      <div>
        <section class="panel">
          <h2 class="panel__title">${icon('user-round')}Thông tin người mua</h2>
          ${loginHint}
          <div class="form-grid form-grid--2">
            ${field('name', 'Họ và tên', { required: true, placeholder: 'Nguyễn Văn A', value: profile.name, autocomplete: 'name' })}
            ${field('phone', 'Số điện thoại', { type: 'tel', required: true, placeholder: '09xx xxx xxx', value: profile.phone, autocomplete: 'tel' })}
            ${field('email', 'Email (nhận thông tin đơn hàng)', { type: 'email', placeholder: 'email@vidu.com', value: profile.email, full: true, autocomplete: 'email' })}
          </div>
        </section>

        <section class="panel">
          <h2 class="panel__title">${icon('truck')}Hình thức nhận hàng</h2>
          <div class="choice-list choice-list--2">
            <label class="choice"><input type="radio" name="delivery" value="ship" checked><span>${icon('truck', 'choice__icon')}</span><span><span class="choice__title">Giao hàng tận nơi</span><span class="choice__desc">Miễn phí cho đơn từ ${formatPrice(SHOP.freeShipFrom)}</span></span></label>
            <label class="choice"><input type="radio" name="delivery" value="pickup"><span>${icon('store', 'choice__icon')}</span><span><span class="choice__title">Nhận tại cửa hàng</span><span class="choice__desc">${COMPANY.address}</span></span></label>
          </div>
          <div class="form-grid" data-ship-fields>
            ${field('address', 'Địa chỉ nhận hàng', { required: true, placeholder: 'Số nhà, tên đường, phường/xã, tỉnh/thành phố', value: profile.address, full: true, autocomplete: 'street-address' })}
          </div>
        </section>

        <section class="panel">
          <h2 class="panel__title">${icon('wallet')}Hình thức thanh toán</h2>
          <div class="choice-list">
            <label class="choice"><input type="radio" name="payment" value="cod" checked><span>${icon('banknote', 'choice__icon')}</span><span><span class="choice__title">Thanh toán khi nhận hàng (COD)</span><span class="choice__desc">Kiểm tra hàng rồi mới thanh toán</span></span></label>
            <label class="choice"><input type="radio" name="payment" value="bank"><span>${icon('landmark', 'choice__icon')}</span><span><span class="choice__title">Chuyển khoản ngân hàng</span><span class="choice__desc">Nhân viên gửi thông tin tài khoản khi gọi xác nhận đơn</span></span></label>
            <label class="choice"><input type="radio" name="payment" value="ewallet"><span>${icon('wallet', 'choice__icon')}</span><span><span class="choice__title">Ví MoMo, ZaloPay, VNPAY</span><span class="choice__desc">Nhân viên gửi mã QR khi gọi xác nhận đơn</span></span></label>
            <label class="choice"><input type="radio" name="payment" value="installment"><span>${icon('credit-card', 'choice__icon')}</span><span><span class="choice__title">Trả góp 0%</span><span class="choice__desc">Nhân viên liên hệ tư vấn hồ sơ trả góp</span></span></label>
            <label class="choice" data-store-pay hidden><input type="radio" name="payment" value="store"><span>${icon('store', 'choice__icon')}</span><span><span class="choice__title">Thanh toán tại cửa hàng</span><span class="choice__desc">Tiền mặt, thẻ ATM, Visa/MasterCard</span></span></label>
          </div>
        </section>

        <section class="panel">
          <h2 class="panel__title">${icon('notebook-pen')}Ghi chú</h2>
          <div class="field">
            <label class="sr-only" for="f-note">Ghi chú đơn hàng</label>
            <textarea class="textarea" id="f-note" name="note" maxlength="500" placeholder="Ví dụ: giao giờ hành chính, xuất hóa đơn công ty, gọi trước khi giao..."></textarea>
          </div>
          <label class="check check--spaced"><input type="checkbox" name="remember" ${profile.name ? 'checked' : ''}>${user ? 'Cập nhật thông tin này vào tài khoản của tôi' : 'Lưu thông tin cho lần mua sau (trên thiết bị này)'}</label>
        </section>
      </div>

      <aside class="summary-col">
        <div class="panel summary" id="checkout-summary">${summaryBox(totals, lines)}</div>
        <div class="panel">
          <button class="btn btn--primary btn--lg btn--block" type="submit" id="place-order">${icon('lock')}ĐẶT HÀNG</button>
          <p class="summary__terms">Bằng việc đặt hàng, bạn đồng ý với <a href="chinh-sach?type=doi-tra">chính sách đổi trả</a> và <a href="chinh-sach?type=bao-mat">bảo mật thông tin</a> của ${COMPANY.name}.</p>
          <div class="summary__trust">
            <span>${icon('shield-check')}Bảo mật thông tin</span>
            <span>${icon('phone-call')}Gọi xác nhận đơn</span>
          </div>
        </div>
      </aside>
    </form>`;
  refreshIcons();
}

function currentDelivery() {
  return $('input[name="delivery"]:checked')?.value || 'ship';
}

function refreshSummary() {
  const totals = calcTotals(Cart.lines(), Store.get(CHECKOUT_COUPON_KEY, ''), currentDelivery());
  $('#checkout-summary').innerHTML = summaryBox(totals, Cart.lines());
  refreshIcons();
}

function validate(form) {
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();
  const address = form.address.value.trim();
  const ship = currentDelivery() === 'ship';
  const errors = {
    name: name.length >= 2 ? '' : 'Vui lòng nhập họ tên',
    phone: isValidPhone(phone) ? '' : 'Số điện thoại không hợp lệ (VD: 0937805704)',
    email: !email || isValidEmail(email) ? '' : 'Email không hợp lệ',
    address: !ship || address.length >= 10 ? '' : 'Vui lòng nhập địa chỉ đầy đủ',
  };
  Object.entries(errors).forEach(([key, msg]) => setFieldError(form[key], msg));
  const firstError = Object.keys(errors).find((k) => errors[k]);
  if (firstError) form[firstError].focus();
  return !firstError;
}

async function placeOrder(form) {
  if (!validate(form)) {
    showToast('Vui lòng kiểm tra lại thông tin đặt hàng', 'error');
    return;
  }
  const btn = $('#place-order');
  btn.classList.add('is-loading');
  btn.innerHTML = `${icon('loader-circle', 'spin')}Đang gửi đơn hàng...`;
  refreshIcons();

  const delivery = currentDelivery();
  const lines = Cart.lines();
  const totals = calcTotals(lines, Store.get(CHECKOUT_COUPON_KEY, ''), delivery);
  const customer = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    address: delivery === 'ship' ? form.address.value.trim() : '',
  };
  const order = {
    code: orderCode(),
    createdAt: new Date().toISOString(),
    status: 'Chờ xác nhận',
    customer,
    delivery,
    payment: $('input[name="payment"]:checked').value,
    note: form.note.value.trim(),
    items: lines.map(({ p, qty }) => ({ id: p.id, name: p.name, price: p.price, qty, img: p.img })),
    totals: { subtotal: totals.subtotal, discount: totals.discount, couponCode: totals.coupon.code || '', shipping: totals.shipping, total: totals.total },
    emailSent: false,
    account: Auth.current()?.email || '',
    uid: Auth.current()?.uid || null,
  };

  if (form.remember.checked) Profile.set({ ...(Profile.get() || {}), ...customer, address: form.address.value.trim() });
  Orders.save(order);
  // Gửi email cho shop, rồi lưu đơn lên máy chủ (để shop xem ở trang quản trị, khách xem trên mọi máy)
  const mail = await sendOrderEmail(order);
  await Orders.saveCloud({ ...order, emailSent: mail.ok });

  Cart.clear();
  Store.remove(CHECKOUT_COUPON_KEY);
  location.href = `tra-cuu-don-hang?code=${order.code}&new=1`;
}

function initPage() {
  render();
  const form = $('#checkout-form');
  if (!form) return;

  // Đã đăng nhập → lấy hồ sơ mới nhất trên máy chủ, điền vào các ô còn trống
  if (Auth.current()) {
    Auth.ready().then(() => Auth.loadProfile()).then((user) => {
      if (!user) return;
      ['name', 'phone', 'email', 'address'].forEach((k) => {
        if (form[k] && !form[k].value && user[k]) form[k].value = user[k];
      });
    });
  }

  form.addEventListener('change', (e) => {
    if (e.target.name === 'delivery') {
      const pickup = e.target.value === 'pickup';
      $('[data-ship-fields]').hidden = pickup;
      $('[data-store-pay]').hidden = !pickup;
      if (!pickup && $('input[name="payment"]:checked').value === 'store') form.querySelector('input[value="cod"]').checked = true;
      setFieldError(form.address, '');
      refreshSummary();
    }
  });
  form.addEventListener('input', (e) => {
    if (e.target.closest('.field.is-invalid')) setFieldError(e.target, '');
  });
  form.addEventListener('click', (e) => {
    if (!e.target.closest('[data-apply-coupon]')) return;
    Store.set(CHECKOUT_COUPON_KEY, $('#co-coupon').value.trim().toUpperCase());
    refreshSummary();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    placeOrder(form);
  });
}
