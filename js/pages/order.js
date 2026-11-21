/* ==========================================================
   Trang đơn hàng: đặt hàng thành công + tra cứu đơn
   order.html?code=MK...&new=1
   ========================================================== */

/* 4 bước trên thanh trạng thái — dùng đúng tên trạng thái của ORDER_STATUSES (app.js),
   trang quản trị cũng lưu theo danh sách đó */
const STATUS_STEPS = ORDER_STATUSES.slice(0, 4);
const STATUS_LABELS = { 'Đang giao': 'Đang giao hàng' };

function orderDetailHTML(order, isNew) {
  const cancelled = order.status === 'Đã hủy';
  const step = cancelled ? -1 : Math.max(0, STATUS_STEPS.indexOf(order.status));
  const updated = order.updatedAt ? ` · Cập nhật lúc ${new Date(order.updatedAt).toLocaleString('vi-VN')}` : '';
  const created = new Date(order.createdAt).toLocaleString('vi-VN');
  return `
    ${isNew ? `
      <section class="panel order-success">
        <span class="order-success__icon${order.emailSent ? '' : ' is-pending'}">${icon(order.emailSent ? 'circle-check' : 'clock')}</span>
        <h1>${order.emailSent ? 'Đặt hàng thành công!' : 'Đơn hàng đã được tạo'}</h1>
        <p>Cảm ơn <b>${esc(order.customer.name)}</b> đã mua sắm tại ${COMPANY.name}. ${order.emailSent ? 'Nhân viên sẽ gọi điện xác nhận đơn hàng trong giờ làm việc.' : 'Vui lòng hoàn tất bước gửi đơn bên dưới để cửa hàng nhận được đơn của bạn.'}</p>
        <p class="order-success__code">Mã đơn hàng: <b>${order.code}</b><button type="button" class="btn btn--ghost" data-copy="${order.code}">${icon('copy')}Sao chép</button></p>
      </section>` : `<h1 class="page-title">Đơn hàng ${order.code}</h1>`}

    ${order.emailSent ? '' : `
      <div class="alert alert--info order-alert">
        ${icon('triangle-alert')}
        <div>
          <b>Đơn hàng chưa được gửi tới cửa hàng.</b> Có thể do mạng không ổn định.
          Vui lòng bấm “Gửi lại” hoặc gọi <a href="tel:${COMPANY.phone}"><b>${COMPANY.phoneDisplay}</b></a> và đọc mã đơn <b>${order.code}</b>.
          <div class="order-alert__actions"><button type="button" class="btn btn--primary" data-resend>${icon('send')}Gửi lại đơn hàng</button></div>
        </div>
      </div>`}

    <div class="checkout-grid">
      <div>
        <section class="panel">
          <h2 class="panel__title">${icon('package')}Trạng thái đơn hàng</h2>
          ${cancelled ? `<p class="alert alert--info order-cancelled">${icon('circle-x')}<span>Đơn hàng đã được hủy. Cần hỗ trợ, vui lòng gọi <a href="tel:${COMPANY.phone}"><b>${COMPANY.phoneDisplay}</b></a>.</span></p>` : ''}
          <ol class="timeline${cancelled ? ' timeline--cancelled' : ''}">
            ${STATUS_STEPS.map((s, i) => `<li class="${i < step ? 'is-done' : ''}${i === step ? ' is-active' : ''}"${i === step ? ' aria-current="step"' : ''}><span>${icon(['clipboard-list', 'phone-call', 'truck', 'package-check'][i])}</span>${STATUS_LABELS[s] || s}</li>`).join('')}
          </ol>
          <p class="field__hint">Đặt lúc ${created}${updated}. ${order.uid ? 'Trạng thái do cửa hàng cập nhật, bạn xem được trên mọi thiết bị khi đăng nhập.' : 'Nhân viên sẽ gọi điện / Zalo để báo trạng thái đơn.'}</p>
        </section>
        <section class="panel">
          <h2 class="panel__title">${icon('shopping-bag')}Sản phẩm</h2>
          <ul class="mini-list mini-list--lg">
            ${order.items.map((i) => `
              <li>
                <span class="mini-list__img"><img src="${i.img}" alt="" width="64" height="64"><b>${i.qty}</b></span>
                <a class="mini-list__name" href="product.html?id=${i.id}">${esc(i.name)}<small>${formatPrice(i.price)} × ${i.qty}</small></a>
                <span class="mini-list__price">${formatPrice(i.price * i.qty)}</span>
              </li>`).join('')}
          </ul>
        </section>
      </div>
      <aside class="summary-col">
        <section class="panel">
          <h2 class="panel__title">${icon('user-round')}Thông tin nhận hàng</h2>
          <dl class="info-list">
            <div><dt>Người nhận</dt><dd>${esc(order.customer.name)}</dd></div>
            <div><dt>Điện thoại</dt><dd>${esc(order.customer.phone)}</dd></div>
            ${order.customer.email ? `<div><dt>Email</dt><dd>${esc(order.customer.email)}</dd></div>` : ''}
            <div><dt>Hình thức</dt><dd>${DELIVERY_LABELS[order.delivery]}</dd></div>
            <div><dt>${order.delivery === 'ship' ? 'Địa chỉ' : 'Nhận tại'}</dt><dd>${esc(order.delivery === 'ship' ? order.customer.address : COMPANY.address)}</dd></div>
            <div><dt>Thanh toán</dt><dd>${PAYMENT_LABELS[order.payment]}</dd></div>
            ${order.note ? `<div><dt>Ghi chú</dt><dd>${esc(order.note)}</dd></div>` : ''}
          </dl>
        </section>
        <section class="panel">
          <dl class="totals">
            <div><dt>Tạm tính</dt><dd>${formatPrice(order.totals.subtotal)}</dd></div>
            ${order.totals.discount ? `<div class="totals__discount"><dt>Giảm giá (${esc(order.totals.couponCode)})</dt><dd>-${formatPrice(order.totals.discount)}</dd></div>` : ''}
            <div><dt>Phí giao hàng</dt><dd>${order.totals.shipping ? formatPrice(order.totals.shipping) : 'Miễn phí'}</dd></div>
            <div class="totals__grand"><dt>Tổng thanh toán</dt><dd>${formatPrice(order.totals.total)}</dd></div>
          </dl>
          <div class="order-actions">
            <a class="btn btn--primary btn--block" href="${HOME_URL}">${icon('house')}Tiếp tục mua sắm</a>
            <button type="button" class="btn btn--outline btn--block" data-reorder>${icon('rotate-ccw')}Mua lại đơn này</button>
            <a class="btn btn--ghost btn--block" href="tel:${COMPANY.phone}">${icon('phone')}Cần hỗ trợ? ${COMPANY.phoneDisplay}</a>
          </div>
        </section>
      </aside>
    </div>`;
}

function lookupHTML(message = '') {
  const recent = Orders.all();
  return `
    ${renderBreadcrumb([['Tra cứu đơn hàng', '#']])}
    <div class="lookup">
      <section class="panel">
        <h1 class="page-title">Tra cứu đơn hàng</h1>
        <form class="form-grid" id="lookup-form" novalidate>
          <div class="field">
            <label class="field__label" for="l-code">Mã đơn hàng <b>*</b></label>
            <input class="input" id="l-code" name="code" placeholder="VD: MK261121ABCD" value="${esc(params.get('code') || '')}" required>
            <span class="field__error"></span>
          </div>
          <div class="field">
            <label class="field__label" for="l-phone">Số điện thoại đặt hàng <b>*</b></label>
            <input class="input" id="l-phone" name="phone" type="tel" placeholder="09xx xxx xxx" required>
            <span class="field__error"></span>
          </div>
          <button class="btn btn--primary btn--lg" type="submit">${icon('search')}Tra cứu</button>
        </form>
        ${message ? `<div class="alert alert--info lookup__msg">${icon('info')}<span>${message}</span></div>` : ''}
        <p class="field__hint lookup__hint">Tra cứu áp dụng cho đơn đặt trên thiết bị này. Đơn đặt ở thiết bị khác hoặc qua điện thoại, vui lòng gọi <a href="tel:${COMPANY.phone}"><b>${COMPANY.phoneDisplay}</b></a>.</p>
      </section>
      ${recent.length ? `
      <section class="panel">
        <h2 class="panel__title">${icon('history')}Đơn hàng gần đây trên thiết bị này</h2>
        <ul class="order-list">
          ${recent.slice(0, 8).map((o) => `
            <li><a href="order.html?code=${o.code}">
              <span><b>${o.code}</b><small>${new Date(o.createdAt).toLocaleDateString('vi-VN')} · ${o.items.length} sản phẩm</small></span>
              <span class="order-list__right"><b>${formatPrice(o.totals.total)}</b><small class="status-tag">${o.status}</small></span>
            </a></li>`).join('')}
        </ul>
      </section>` : ''}
    </div>`;
}

let shownOrder = null;

function showOrder(order, isNew) {
  shownOrder = order;
  const root = $('#order-page');
  root.innerHTML = `${renderBreadcrumb([['Đơn hàng', 'order.html'], [order.code, '#']])}${orderDetailHTML(order, isNew)}`;
  document.title = `Đơn hàng ${order.code} | ${COMPANY.name}`;
  refreshIcons();
}

function showLookup(message) {
  $('#order-page').innerHTML = lookupHTML(message);
  refreshIcons();
}

/* Đơn trên thiết bị + bản mới nhất trên máy chủ (trạng thái do cửa hàng cập nhật) */
async function findOrder(code) {
  const local = Orders.find(code);
  if (!Auth.current()) return local;
  await Auth.ready();
  const cloud = await Orders.fetch(code);
  return cloud ? { ...(local || {}), ...cloud } : local;
}

let stopWatch = () => {};

async function watchOrder(code, isNew) {
  stopWatch();
  await Auth.ready();
  let first = true;
  stopWatch = await Orders.watch(code, (cloud) => {
    const prev = shownOrder?.code === cloud.code ? shownOrder.status : null;
    showOrder({ ...(Orders.find(cloud.code) || {}), ...cloud }, isNew);
    if (!first && prev && prev !== cloud.status) showToast(`Đơn hàng ${cloud.code}: ${cloud.status}`);
    first = false;
  });
}

async function initPage() {
  const root = $('#order-page');
  const code = params.get('code');
  const isNew = params.get('new') === '1';
  const order = code ? Orders.find(code) : null;
  if (order) showOrder(order, isNew);
  else showLookup(code ? `Không tìm thấy đơn hàng <b>${esc(code)}</b>.` : '');

  // Khách đã đăng nhập: theo dõi đơn trên máy chủ — cửa hàng đổi trạng thái là trang tự cập nhật
  if (code && Auth.current()) watchOrder(code, isNew);

  root.addEventListener('submit', async (e) => {
    if (e.target.id !== 'lookup-form') return;
    e.preventDefault();
    const form = e.target;
    const c = form.code.value.trim();
    const phone = form.phone.value.replace(/\D/g, '');
    setFieldError(form.code, c ? '' : 'Vui lòng nhập mã đơn hàng');
    setFieldError(form.phone, isValidPhone(phone) ? '' : 'Số điện thoại không hợp lệ');
    if (!c || !isValidPhone(phone)) return;
    const found = await findOrder(c);
    if (found && found.customer.phone.replace(/\D/g, '') === phone) {
      history.replaceState(null, '', `order.html?code=${found.code}`);
      showOrder(found, false);
      if (Auth.current()) watchOrder(found.code, false);
    } else {
      showLookup(`Không tìm thấy đơn hàng <b>${esc(c)}</b> với số điện thoại này.${Auth.current() ? '' : ' Nếu đặt hàng trên thiết bị khác, hãy <a href="login.html?next=order.html">đăng nhập</a> tài khoản đã dùng khi đặt, hoặc gọi hotline để được hỗ trợ.'}`);
    }
  });

  root.addEventListener('click', async (e) => {
    const copy = e.target.closest('[data-copy]');
    if (copy) {
      try {
        await navigator.clipboard.writeText(copy.dataset.copy);
        showToast('Đã sao chép mã đơn hàng');
      } catch {
        showToast(`Mã đơn hàng: ${copy.dataset.copy}`);
      }
    }
    const current = shownOrder;
    if (e.target.closest('[data-reorder]') && current) {
      current.items.forEach((i) => { if (productById(i.id)) Cart.add(i.id, i.qty); });
      location.href = 'cart.html';
    }
    const resend = e.target.closest('[data-resend]');
    if (resend && current) {
      resend.classList.add('is-loading');
      resend.textContent = 'Đang gửi...';
      const result = await sendOrderEmail(current);
      if (result.ok) {
        showToast('Đã gửi đơn hàng tới cửa hàng');
        Orders.markSent(current.code);
        showOrder({ ...current, emailSent: true }, params.get('new') === '1');
      } else {
        resend.classList.remove('is-loading');
        resend.textContent = 'Gửi lại đơn hàng';
        showToast('Chưa gửi được, vui lòng gọi hotline', 'error');
      }
    }
  });
}
