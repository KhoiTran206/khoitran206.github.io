/* ==========================================================
   Trang tài khoản — thông tin khách & lịch sử đơn
   (Lưu trên thiết bị của khách; không cần mật khẩu)
   ========================================================== */

function profileForm(profile = {}) {
  const f = (name, label, type = 'text', placeholder = '', required = false, full = false) => `
    <div class="field${full ? ' field--full' : ''}">
      <label class="field__label" for="a-${name}">${label}${required ? ' <b>*</b>' : ''}</label>
      <input class="input" id="a-${name}" name="${name}" type="${type}" placeholder="${placeholder}" value="${esc(profile[name] || '')}">
      <span class="field__error"></span>
    </div>`;
  return `
    <form class="form-grid form-grid--2" id="profile-form" novalidate>
      ${f('name', 'Họ và tên', 'text', 'Nguyễn Văn A', true)}
      ${f('phone', 'Số điện thoại', 'tel', '09xx xxx xxx', true)}
      ${f('email', 'Email', 'email', 'email@vidu.com', false, true)}
      ${f('address', 'Địa chỉ nhận hàng mặc định', 'text', 'Số nhà, đường, phường/xã, tỉnh/thành phố', false, true)}
      <div class="field--full account__actions">
        <button class="btn btn--primary" type="submit">${icon('save')}Lưu thông tin</button>
        ${profile.name ? `<button class="btn btn--ghost" type="button" data-cancel>Hủy</button>` : ''}
      </div>
    </form>`;
}

function render(editing = false) {
  const root = $('#account-page');
  const profile = Profile.get();
  const orders = Orders.all();
  const recent = Recent.list().slice(0, 10);
  const totalSpent = orders.reduce((s, o) => s + o.totals.total, 0);

  root.innerHTML = `
    ${renderBreadcrumb([['Tài khoản', '#']])}
    <div class="account">
      <aside class="panel account__card">
        <span class="account__avatar">${profile?.name ? esc(profile.name.trim().charAt(0).toUpperCase()) : icon('user-round')}</span>
        <h1 class="account__name">${profile?.name ? `Xin chào, ${esc(profile.name)}` : 'Khách hàng mới'}</h1>
        <p class="account__sub">${profile?.phone ? esc(profile.phone) : 'Lưu thông tin để đặt hàng nhanh hơn'}</p>
        <dl class="account__stats">
          <div><dt>Đơn hàng</dt><dd>${orders.length}</dd></div>
          <div><dt>Tổng chi tiêu</dt><dd>${formatPrice(totalSpent)}</dd></div>
        </dl>
        <nav class="account__nav" aria-label="Tài khoản">
          <a href="#thong-tin">${icon('id-card')}Thông tin cá nhân</a>
          <a href="#don-hang">${icon('package')}Đơn hàng của tôi</a>
          <a href="order.html">${icon('search')}Tra cứu đơn hàng</a>
          <a href="cart.html">${icon('shopping-cart')}Giỏ hàng (${Cart.count()})</a>
          ${profile ? `<button type="button" data-logout>${icon('log-out')}Xóa thông tin khỏi thiết bị</button>` : ''}
        </nav>
      </aside>

      <div class="account__main">
        <section class="panel" id="thong-tin">
          <h2 class="panel__title">${icon('id-card')}Thông tin cá nhân${profile && !editing ? `<button class="btn btn--ghost account__edit" type="button" data-edit>${icon('pencil')}Sửa</button>` : ''}</h2>
          ${profile && !editing ? `
            <dl class="info-list">
              <div><dt>Họ tên</dt><dd>${esc(profile.name)}</dd></div>
              <div><dt>Điện thoại</dt><dd>${esc(profile.phone)}</dd></div>
              <div><dt>Email</dt><dd>${esc(profile.email || '—')}</dd></div>
              <div><dt>Địa chỉ</dt><dd>${esc(profile.address || '—')}</dd></div>
            </dl>` : `
            <div class="alert alert--info account__note">${icon('info')}<span>Thông tin được lưu <b>trên thiết bị này</b> để tự điền khi đặt hàng. ${COMPANY.name} không yêu cầu mật khẩu.</span></div>
            ${profileForm(profile || {})}`}
        </section>

        <section class="panel" id="don-hang">
          <h2 class="panel__title">${icon('package')}Đơn hàng của tôi</h2>
          ${orders.length ? `
            <ul class="order-list">
              ${orders.map((o) => `
                <li><a href="order.html?code=${o.code}">
                  <span><b>${o.code}</b><small>${new Date(o.createdAt).toLocaleString('vi-VN')} · ${o.items.map((i) => esc(i.name)).join(', ').slice(0, 80)}…</small></span>
                  <span class="order-list__right"><b>${formatPrice(o.totals.total)}</b><small class="status-tag">${o.status}</small></span>
                </a></li>`).join('')}
            </ul>` : renderEmpty('package-open', 'Bạn chưa có đơn hàng nào', 'Các đơn hàng đặt trên thiết bị này sẽ hiển thị tại đây.', '<a class="btn btn--primary" href="index.html">Mua sắm ngay</a>')}
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

function initPage() {
  render(!Profile.get());
  const root = $('#account-page');

  root.addEventListener('submit', (e) => {
    if (e.target.id !== 'profile-form') return;
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(['name', 'phone', 'email', 'address'].map((k) => [k, form[k].value.trim()]));
    setFieldError(form.name, data.name.length >= 2 ? '' : 'Vui lòng nhập họ tên');
    setFieldError(form.phone, isValidPhone(data.phone) ? '' : 'Số điện thoại không hợp lệ');
    setFieldError(form.email, !data.email || isValidEmail(data.email) ? '' : 'Email không hợp lệ');
    if (data.name.length < 2 || !isValidPhone(data.phone) || (data.email && !isValidEmail(data.email))) return;
    Profile.set(data);
    render(false);
    showToast('Đã lưu thông tin của bạn');
  });

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-edit]')) render(true);
    if (e.target.closest('[data-cancel]')) render(false);
    if (e.target.closest('[data-logout]') && window.confirm('Xóa thông tin cá nhân đã lưu trên thiết bị này?')) {
      Profile.clear();
      render(true);
      showToast('Đã xóa thông tin khỏi thiết bị');
    }
  });
}
