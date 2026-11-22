/* ==========================================================
   Trang tài khoản — cần đăng nhập (Firebase)
   Thông tin cá nhân · đơn hàng của tôi (từ máy chủ) · đổi mật khẩu · đã xem
   ========================================================== */

function accountField(name, label, { type = 'text', value = '', placeholder = '', required = false, full = false, readonly = false, autocomplete = '' } = {}) {
  return `
    <div class="field${full ? ' field--full' : ''}">
      <label class="field__label" for="a-${name}">${label}${required ? ' <b>*</b>' : ''}</label>
      <input class="input" id="a-${name}" name="${name}" type="${type}" placeholder="${placeholder}" value="${esc(value)}" autocomplete="${autocomplete}"${readonly ? ' readonly' : ''}>
      <span class="field__error"></span>
    </div>`;
}

function profileSection(user, editing) {
  if (!editing) {
    return `
      <dl class="info-list">
        <div><dt>Họ tên</dt><dd>${esc(user.name)}</dd></div>
        <div><dt>Điện thoại</dt><dd>${esc(user.phone || 'Chưa có')}</dd></div>
        <div><dt>Email</dt><dd>${esc(user.email)}</dd></div>
        <div><dt>Địa chỉ nhận hàng</dt><dd>${esc(user.address || 'Chưa có — thêm để đặt hàng nhanh hơn')}</dd></div>
        <div><dt>Ngày tham gia</dt><dd>${new Date(user.createdAt).toLocaleDateString('vi-VN')}</dd></div>
      </dl>`;
  }
  return `
    <form class="form-grid form-grid--2" id="profile-form" novalidate>
      ${accountField('name', 'Họ và tên', { value: user.name, required: true, autocomplete: 'name' })}
      ${accountField('phone', 'Số điện thoại', { type: 'tel', value: user.phone, required: true, autocomplete: 'tel' })}
      ${accountField('email', 'Email (dùng để đăng nhập)', { type: 'email', value: user.email, full: true, readonly: true })}
      ${accountField('address', 'Địa chỉ nhận hàng mặc định', { value: user.address, placeholder: 'Số nhà, đường, phường/xã, tỉnh/thành phố', full: true, autocomplete: 'street-address' })}
      <div class="field--full account__actions">
        <button class="btn btn--primary" type="submit">${icon('save')}Lưu thông tin</button>
        <button class="btn btn--ghost" type="button" data-cancel>Hủy</button>
      </div>
    </form>`;
}

function passwordSection(user) {
  if (user.provider !== 'password') {
    return `<p class="alert alert--info">${icon('info')}<span>Bạn đăng nhập bằng tài khoản Google — mật khẩu do Google quản lý, không cần đặt mật khẩu riêng.</span></p>`;
  }
  return `
    <form class="form-grid form-grid--2" id="password-form" novalidate>
      ${accountField('old', 'Mật khẩu hiện tại', { type: 'password', full: true, autocomplete: 'current-password' })}
      ${accountField('password', 'Mật khẩu mới', { type: 'password', placeholder: 'Tối thiểu 6 ký tự', autocomplete: 'new-password' })}
      ${accountField('confirm', 'Nhập lại mật khẩu mới', { type: 'password', autocomplete: 'new-password' })}
      <div class="field--full account__actions">
        <button class="btn btn--dark" type="submit">${icon('key-round')}Đổi mật khẩu</button>
      </div>
    </form>`;
}

function verifyNotice(user) {
  if (user.provider !== 'password' || user.emailVerified) return '';
  return `
    <div class="alert alert--info account__verify">${icon('mail-check')}
      <span>Email <b>${esc(user.email)}</b> chưa được xác minh. Mở email từ Firebase (kiểm tra cả mục <b>Spam</b>) và bấm link xác minh.</span>
      <span class="account__verify-actions">
        <button class="btn btn--ghost" type="button" data-verify-send>Gửi lại email</button>
        <button class="btn btn--ghost" type="button" data-verify-check>Tôi đã xác minh</button>
      </span>
    </div>`;
}

function ordersSection(orders) {
  if (!orders) return `<p class="account__loading">${icon('loader-circle', 'spin')}Đang tải đơn hàng...</p>`;
  if (!orders.length) {
    return renderEmpty('package-open', 'Bạn chưa có đơn hàng nào', 'Đơn hàng bạn đặt khi đăng nhập sẽ hiển thị tại đây, trên mọi thiết bị.', `<a class="btn btn--primary" href="${HOME_URL}">Mua sắm ngay</a>`);
  }
  return `
    <ul class="order-list">
      ${orders.map((o) => `
        <li><a href="tra-cuu-don-hang?code=${esc(o.code)}">
          <span><b>${esc(o.code)}</b><small>${new Date(o.createdAt).toLocaleString('vi-VN')} · ${esc(o.items.map((i) => i.name).join(', ').slice(0, 80))}…</small></span>
          <span class="order-list__right"><b>${formatPrice(o.totals.total)}</b><small class="status-tag" data-status="${esc(o.status)}">${esc(o.status)}</small></span>
        </a></li>`).join('')}
    </ul>`;
}

/* orders = null khi đang tải từ máy chủ */
const state = { editing: false, orders: null };

function render(editing = state.editing) {
  state.editing = editing;
  const root = $('#account-page');
  const user = Auth.current();
  const { orders } = state;
  const recent = Recent.list().slice(0, 10);
  const totalSpent = (orders || []).filter((o) => o.status !== 'Đã hủy').reduce((s, o) => s + o.totals.total, 0);

  root.innerHTML = `
    ${renderBreadcrumb([['Tài khoản của tôi', '#']])}
    <div class="account">
      <aside class="panel account__card">
        ${avatarHTML(user, 'account__avatar')}
        <h1 class="account__name">Xin chào, ${esc(user.name)}</h1>
        <p class="account__sub">${esc(user.email)}</p>
        <dl class="account__stats">
          <div><dt>Đơn hàng</dt><dd>${orders ? orders.length : '…'}</dd></div>
          <div><dt>Tổng chi tiêu</dt><dd>${formatPrice(totalSpent)}</dd></div>
        </dl>
        <nav class="account__nav" aria-label="Tài khoản">
          <a href="#thong-tin">${icon('id-card')}Thông tin cá nhân</a>
          <a href="#don-hang">${icon('shopping-bag')}Đơn hàng của tôi</a>
          <a href="yeu-thich">${icon('heart')}Sản phẩm yêu thích (${Wishlist.ids().length})</a>
          <a href="#mat-khau">${icon('key-round')}Mật khẩu</a>
          <a href="tra-cuu-don-hang">${icon('search')}Tra cứu đơn hàng</a>
          <a href="gio-hang">${icon('shopping-cart')}Giỏ hàng (${Cart.count()})</a>
          ${Auth.isAdmin(user) ? `<a href="quan-tri">${icon('layout-dashboard')}Quản trị cửa hàng</a>` : ''}
          <button type="button" data-logout>${icon('log-out')}Đăng xuất</button>
        </nav>
      </aside>

      <div class="account__main">
        ${verifyNotice(user)}
        <section class="panel" id="thong-tin">
          <h2 class="panel__title">${icon('id-card')}Thông tin cá nhân${editing ? '' : `<button class="btn btn--ghost account__edit" type="button" data-edit>${icon('pencil')}Sửa</button>`}</h2>
          ${profileSection(user, editing)}
        </section>

        <section class="panel" id="don-hang">
          <h2 class="panel__title">${icon('shopping-bag')}Đơn hàng của tôi</h2>
          ${ordersSection(orders)}
        </section>

        <section class="panel" id="mat-khau">
          <h2 class="panel__title">${icon('key-round')}Mật khẩu</h2>
          ${passwordSection(user)}
        </section>
      </div>
    </div>

    ${recent.length ? `
    <section class="section block reveal">
      <div class="block-head"><h2 class="block-head__title">Sản phẩm bạn đã xem</h2></div>
      ${sliderHTML(productCardsHTML(recent, { compact: true }))}
    </section>` : ''}`;

  refreshIcons();
  initSliders(root);
  initReveal(root);
}

async function submitPassword(form) {
  const okOld = !!form.old.value;
  const okPw = form.password.value.length >= 6;
  const okConfirm = okPw && form.confirm.value === form.password.value;
  setFieldError(form.old, okOld ? '' : 'Vui lòng nhập mật khẩu hiện tại');
  setFieldError(form.password, okPw ? '' : 'Mật khẩu tối thiểu 6 ký tự');
  setFieldError(form.confirm, okConfirm || !okPw ? '' : 'Mật khẩu nhập lại không khớp');
  if (!okOld || !okPw || !okConfirm) return;
  const btn = $('button[type="submit"]', form);
  btn.classList.add('is-loading');
  const res = await Auth.changePassword(form.old.value, form.password.value);
  btn.classList.remove('is-loading');
  if (!res.ok) {
    setFieldError(form[res.field] || form.old, res.message);
    return;
  }
  form.reset();
  showToast('Đã đổi mật khẩu');
}

async function submitProfile(form) {
  const data = { name: form.name.value.trim(), phone: form.phone.value.trim(), address: form.address.value.trim() };
  const okName = data.name.length >= 2;
  const okPhone = isValidPhone(data.phone);
  setFieldError(form.name, okName ? '' : 'Vui lòng nhập họ tên');
  setFieldError(form.phone, okPhone ? '' : 'Số điện thoại không hợp lệ');
  if (!okName || !okPhone) return;
  const btn = $('button[type="submit"]', form);
  btn.classList.add('is-loading');
  const res = await Auth.update(data);
  render(false);
  showToast(res.ok ? 'Đã lưu thông tin của bạn' : res.message, res.ok ? 'success' : 'error');
}

async function initPage() {
  const root = $('#account-page');
  root.innerHTML = `<div class="panel"><p class="account__loading">${icon('loader-circle', 'spin')}Đang tải tài khoản...</p></div>`;
  refreshIcons();

  const user = await Auth.ready();
  if (!user) {
    location.replace(`dang-nhap?next=${encodeURIComponent('tai-khoan' + location.hash)}`);
    return;
  }
  render(false);
  if (location.hash) $(location.hash)?.scrollIntoView();

  // Tải hồ sơ + đơn hàng từ máy chủ rồi vẽ lại
  const [, orders] = await Promise.all([Auth.loadProfile(), Orders.mine()]);
  state.orders = orders;
  if (!state.editing) render();

  // Đăng xuất ở tab khác → về trang đăng nhập
  document.addEventListener('auth:change', () => {
    if (!Auth.current()) location.replace('dang-nhap');
  });

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'profile-form') submitProfile(e.target);
    if (e.target.id === 'password-form') submitPassword(e.target);
  });

  root.addEventListener('click', async (e) => {
    if (e.target.closest('[data-edit]')) render(true);
    if (e.target.closest('[data-cancel]')) render(false);
    const send = e.target.closest('[data-verify-send]');
    if (send) {
      send.disabled = true;
      const res = await Auth.sendVerification();
      showToast(res.ok ? 'Đã gửi lại email xác minh' : res.message, res.ok ? 'success' : 'error');
      setTimeout(() => (send.disabled = false), 30000);
    }
    if (e.target.closest('[data-verify-check]')) {
      const u = await Auth.refresh();
      if (u?.emailVerified) {
        showToast('Email đã được xác minh');
        render();
      } else {
        showToast('Email chưa được xác minh. Vui lòng bấm link trong email trước.', 'error');
      }
    }
  });
}
