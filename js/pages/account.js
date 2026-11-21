/* ==========================================================
   Trang tài khoản — cần đăng nhập
   Thông tin cá nhân · đổi mật khẩu · đơn hàng của tôi · đã xem
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
        <div><dt>Điện thoại</dt><dd>${esc(user.phone)}</dd></div>
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

function passwordSection() {
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

function render(editing = false) {
  const root = $('#account-page');
  const user = Auth.current();
  const orders = Orders.mine();
  const recent = Recent.list().slice(0, 10);
  const totalSpent = orders.reduce((s, o) => s + o.totals.total, 0);
  const given = user.name.trim().split(/\s+/).pop();

  root.innerHTML = `
    ${renderBreadcrumb([['Tài khoản của tôi', '#']])}
    <div class="account">
      <aside class="panel account__card">
        <span class="account__avatar">${esc(given.charAt(0).toUpperCase())}</span>
        <h1 class="account__name">Xin chào, ${esc(user.name)}</h1>
        <p class="account__sub">${esc(user.email)}</p>
        <dl class="account__stats">
          <div><dt>Đơn hàng</dt><dd>${orders.length}</dd></div>
          <div><dt>Tổng chi tiêu</dt><dd>${formatPrice(totalSpent)}</dd></div>
        </dl>
        <nav class="account__nav" aria-label="Tài khoản">
          <a href="#thong-tin">${icon('id-card')}Thông tin cá nhân</a>
          <a href="#don-hang">${icon('shopping-bag')}Đơn hàng của tôi</a>
          <a href="wishlist.html">${icon('heart')}Sản phẩm yêu thích (${Wishlist.ids().length})</a>
          <a href="#mat-khau">${icon('key-round')}Đổi mật khẩu</a>
          <a href="order.html">${icon('search')}Tra cứu đơn hàng</a>
          <a href="cart.html">${icon('shopping-cart')}Giỏ hàng (${Cart.count()})</a>
          <button type="button" data-logout>${icon('log-out')}Đăng xuất</button>
        </nav>
      </aside>

      <div class="account__main">
        <section class="panel" id="thong-tin">
          <h2 class="panel__title">${icon('id-card')}Thông tin cá nhân${editing ? '' : `<button class="btn btn--ghost account__edit" type="button" data-edit>${icon('pencil')}Sửa</button>`}</h2>
          ${profileSection(user, editing)}
        </section>

        <section class="panel" id="don-hang">
          <h2 class="panel__title">${icon('shopping-bag')}Đơn hàng của tôi</h2>
          ${orders.length ? `
            <ul class="order-list">
              ${orders.map((o) => `
                <li><a href="order.html?code=${esc(o.code)}">
                  <span><b>${esc(o.code)}</b><small>${new Date(o.createdAt).toLocaleString('vi-VN')} · ${esc(o.items.map((i) => i.name).join(', ').slice(0, 80))}…</small></span>
                  <span class="order-list__right"><b>${formatPrice(o.totals.total)}</b><small class="status-tag">${esc(o.status)}</small></span>
                </a></li>`).join('')}
            </ul>` : renderEmpty('package-open', 'Bạn chưa có đơn hàng nào', 'Đơn hàng bạn đặt khi đăng nhập sẽ hiển thị tại đây.', `<a class="btn btn--primary" href="${HOME_URL}">Mua sắm ngay</a>`)}
        </section>

        <section class="panel" id="mat-khau">
          <h2 class="panel__title">${icon('key-round')}Đổi mật khẩu</h2>
          ${passwordSection()}
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
  const res = await Auth.changePassword(form.old.value, form.password.value);
  if (!res.ok) {
    setFieldError(form.old, res.message);
    return;
  }
  form.reset();
  showToast('Đã đổi mật khẩu');
}

function submitProfile(form) {
  const data = { name: form.name.value.trim(), phone: form.phone.value.trim(), address: form.address.value.trim() };
  const okName = data.name.length >= 2;
  const okPhone = isValidPhone(data.phone);
  const takenBy = okPhone && Auth.findKey(data.phone);
  const phoneFree = !takenBy || takenBy === Auth.current().email;
  setFieldError(form.name, okName ? '' : 'Vui lòng nhập họ tên');
  setFieldError(form.phone, !okPhone ? 'Số điện thoại không hợp lệ' : phoneFree ? '' : 'Số điện thoại đã được tài khoản khác sử dụng');
  if (!okName || !okPhone || !phoneFree) return;
  Auth.update(data);
  render(false);
  showToast('Đã lưu thông tin của bạn');
}

function initPage() {
  if (!Auth.current()) {
    location.replace(`login.html?next=${encodeURIComponent('account.html' + location.hash)}`);
    return;
  }
  render(false);
  if (location.hash) $(location.hash)?.scrollIntoView();
  const root = $('#account-page');

  root.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'profile-form') submitProfile(e.target);
    if (e.target.id === 'password-form') submitPassword(e.target);
  });

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-edit]')) render(true);
    if (e.target.closest('[data-cancel]')) render(false);
  });
}
