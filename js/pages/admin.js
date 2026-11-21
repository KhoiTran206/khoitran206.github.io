/* ==========================================================
   Trang quản trị — admin.html (chỉ email trong SHOP.adminEmails)
   Thống kê · đơn hàng (lọc, tìm, đổi trạng thái) · khách hàng
   Quyền thật sự được kiểm tra ở firestore.rules, không chỉ ở giao diện.
   ========================================================== */

const admin = { orders: [], users: [], tab: 'orders', status: '', q: '' };

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '—');

function adminShell(body) {
  return `${renderBreadcrumb([['Quản trị cửa hàng', '#']])}${body}`;
}

function deniedHTML(user) {
  return adminShell(`
    <div class="panel">${renderEmpty('shield-alert', 'Bạn không có quyền truy cập', `Tài khoản <b>${esc(user.email)}</b> không phải quản trị viên${user.emailVerified ? '' : ' hoặc email chưa được xác minh'}. Quản trị viên nên đăng nhập bằng nút <b>Tiếp tục với Google</b>.`, `<button class="btn btn--primary" type="button" data-logout>${icon('log-out')}Đăng xuất để đổi tài khoản</button>`)}</div>`);
}

function statsHTML() {
  const valid = admin.orders.filter((o) => o.status !== 'Đã hủy');
  const today = new Date().toDateString();
  const stats = [
    ['shopping-bag', 'Tổng đơn hàng', admin.orders.length],
    ['clock', 'Chờ xác nhận', admin.orders.filter((o) => o.status === 'Chờ xác nhận').length],
    ['calendar-check', 'Đơn hôm nay', admin.orders.filter((o) => new Date(o.createdAt).toDateString() === today).length],
    ['banknote', 'Doanh thu (trừ đơn hủy)', formatPrice(valid.reduce((s, o) => s + (o.totals?.total || 0), 0))],
    ['users', 'Khách hàng', admin.users.length],
  ];
  return `<div class="admin__stats">${stats.map(([ic, label, value]) => `<div class="panel admin__stat">${icon(ic)}<span>${label}</span><b>${value}</b></div>`).join('')}</div>`;
}

function filteredOrders() {
  const q = normalize(admin.q);
  return admin.orders.filter((o) => (!admin.status || o.status === admin.status)
    && (!q || normalize(`${o.code} ${o.customer?.name} ${o.customer?.phone} ${o.customer?.email}`).includes(q)));
}

function orderRowHTML(o) {
  return `
    <details class="admin-order">
      <summary class="admin-order__row">
        <span class="admin-order__code"><b>${esc(o.code)}</b><small>${fmtDate(o.createdAt)}</small></span>
        <span class="admin-order__customer"><b>${esc(o.customer?.name)}</b><small><a href="tel:${esc(o.customer?.phone)}">${esc(o.customer?.phone)}</a>${o.uid ? ' · có tài khoản' : ' · khách vãng lai'}</small></span>
        <span class="admin-order__total">${formatPrice(o.totals?.total || 0)}<small>${o.items.length} sản phẩm</small></span>
        <span class="admin-order__status">
          <label class="sr-only" for="st-${esc(o.code)}">Trạng thái đơn ${esc(o.code)}</label>
          <select class="input admin-order__select" id="st-${esc(o.code)}" data-status-select="${esc(o.code)}" data-status="${esc(o.status)}">
            ${ORDER_STATUSES.map((s) => `<option${s === o.status ? ' selected' : ''}>${s}</option>`).join('')}
          </select>
        </span>
        ${icon('chevron-down', 'admin-order__chevron')}
      </summary>
      <div class="admin-order__body">
        <dl class="info-list">
          <div><dt>Email</dt><dd>${esc(o.customer?.email || '—')}</dd></div>
          <div><dt>Nhận hàng</dt><dd>${esc(DELIVERY_LABELS[o.delivery] || o.delivery)}${o.delivery === 'ship' ? ` — ${esc(o.customer?.address)}` : ''}</dd></div>
          <div><dt>Thanh toán</dt><dd>${esc(PAYMENT_LABELS[o.payment] || o.payment)}</dd></div>
          <div><dt>Ghi chú</dt><dd>${esc(o.note || '—')}</dd></div>
          <div><dt>Email báo đơn</dt><dd>${o.emailSent ? 'Đã gửi' : 'Chưa gửi được — hãy gọi khách xác nhận'}</dd></div>
          ${o.updatedAt ? `<div><dt>Cập nhật</dt><dd>${fmtDate(o.updatedAt)}</dd></div>` : ''}
        </dl>
        <ul class="admin-order__items">
          ${o.items.map((i) => `<li><img src="${esc(thumb(i.img))}" alt="" width="48" height="48" loading="lazy"><span>${esc(i.name)}<small>${i.qty} × ${formatPrice(i.price)}</small></span><b>${formatPrice(i.qty * i.price)}</b></li>`).join('')}
        </ul>
        <p class="admin-order__sum">Tạm tính ${formatPrice(o.totals?.subtotal || 0)}${o.totals?.discount ? ` · Giảm ${formatPrice(o.totals.discount)} (${esc(o.totals.couponCode)})` : ''} · Ship ${o.totals?.shipping ? formatPrice(o.totals.shipping) : 'miễn phí'} · <b>Tổng ${formatPrice(o.totals?.total || 0)}</b></p>
      </div>
    </details>`;
}

function ordersTabHTML() {
  const list = filteredOrders();
  return `
    <div class="admin__filters">
      <input class="input" type="search" placeholder="Tìm mã đơn, tên, SĐT, email..." value="${esc(admin.q)}" data-admin-search aria-label="Tìm đơn hàng">
      <select class="input" data-admin-status aria-label="Lọc theo trạng thái">
        <option value="">Tất cả trạng thái</option>
        ${ORDER_STATUSES.map((s) => `<option${s === admin.status ? ' selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    ${list.length ? `<div class="admin__list">${list.map(orderRowHTML).join('')}</div>` : renderEmpty('package-open', admin.orders.length ? 'Không có đơn phù hợp' : 'Chưa có đơn hàng nào', admin.orders.length ? 'Thử đổi từ khóa hoặc trạng thái.' : 'Đơn hàng khách đặt trên website sẽ hiện ở đây.')}`;
}

function usersTabHTML() {
  if (!admin.users.length) return renderEmpty('users', 'Chưa có khách hàng', 'Khách đăng ký tài khoản sẽ hiện ở đây.');
  const orderCount = (u) => admin.orders.filter((o) => o.account === u.email).length;
  return `
    <div class="admin__scroll">
      <table class="admin-table">
        <thead><tr><th>Khách hàng</th><th>Điện thoại</th><th>Địa chỉ</th><th>Đăng nhập</th><th>Đơn</th><th>Ngày tham gia</th></tr></thead>
        <tbody>
          ${admin.users.map((u) => `
            <tr>
              <td><b>${esc(u.name)}</b><small>${esc(u.email)}</small></td>
              <td>${u.phone ? `<a href="tel:${esc(u.phone)}">${esc(u.phone)}</a>` : '—'}</td>
              <td>${esc(u.address || '—')}</td>
              <td>${u.provider === 'google.com' ? 'Google' : 'Email'}</td>
              <td>${orderCount(u)}</td>
              <td>${fmtDate(u.createdAt)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderAdmin() {
  const root = $('#admin-page');
  root.innerHTML = adminShell(`
    <div class="admin__head">
      <h1 class="page-title">${icon('layout-dashboard')}Quản trị cửa hàng</h1>
      <button class="btn btn--ghost" type="button" data-admin-refresh>${icon('refresh-cw')}Tải lại</button>
    </div>
    ${statsHTML()}
    <section class="panel">
      <div class="auth__tabs admin__tabs" role="tablist">
        <button class="auth__tab${admin.tab === 'orders' ? ' is-active' : ''}" type="button" role="tab" aria-selected="${admin.tab === 'orders'}" data-admin-tab="orders">Đơn hàng (${admin.orders.length})</button>
        <button class="auth__tab${admin.tab === 'users' ? ' is-active' : ''}" type="button" role="tab" aria-selected="${admin.tab === 'users'}" data-admin-tab="users">Khách hàng (${admin.users.length})</button>
      </div>
      <div data-admin-body>${admin.tab === 'orders' ? ordersTabHTML() : usersTabHTML()}</div>
    </section>`);
  refreshIcons();
}

function renderOrdersOnly() {
  $('[data-admin-body]').innerHTML = ordersTabHTML();
  refreshIcons();
}

async function loadAdminData() {
  const db = await Cloud.db();
  const [orders, users] = await Promise.all([
    db.collection('orders').orderBy('createdAt', 'desc').limit(500).get(),
    db.collection('users').get(),
  ]);
  admin.orders = orders.docs.map((d) => d.data());
  // Tài khoản quản trị không tính là khách hàng
  admin.users = users.docs.map((d) => d.data()).filter((u) => !SHOP.adminEmails.includes(u.email)).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function refreshAdmin() {
  try {
    await loadAdminData();
    renderAdmin();
  } catch (e) {
    console.warn(e);
    const rulesHint = e.code === 'permission-denied' ? 'Firestore từ chối truy cập — kiểm tra đã dán <b>firestore.rules</b> vào tab Rules và bấm Publish chưa.' : 'Không tải được dữ liệu. Vui lòng kiểm tra mạng và thử lại.';
    $('#admin-page').innerHTML = adminShell(`<div class="panel">${renderEmpty('cloud-off', 'Lỗi tải dữ liệu', rulesHint, `<button class="btn btn--primary" type="button" data-admin-refresh>${icon('refresh-cw')}Thử lại</button>`)}</div>`);
    refreshIcons();
  }
}

async function changeStatus(select) {
  const code = select.dataset.statusSelect;
  const order = admin.orders.find((o) => o.code === code);
  const prev = order.status;
  const status = select.value;
  select.disabled = true;
  try {
    const db = await Cloud.db();
    const updatedAt = new Date().toISOString();
    await db.collection('orders').doc(code).update({ status, updatedAt });
    Object.assign(order, { status, updatedAt });
    select.dataset.status = status;
    showToast(`Đơn ${code}: ${status}`);
  } catch (e) {
    select.value = prev;
    showToast(e.code === 'permission-denied' ? 'Không có quyền cập nhật đơn' : 'Chưa cập nhật được, thử lại', 'error');
  }
  select.disabled = false;
}

async function initPage() {
  const root = $('#admin-page');
  root.innerHTML = adminShell(`<div class="panel"><p class="account__loading">${icon('loader-circle', 'spin')}Đang kiểm tra quyền truy cập...</p></div>`);
  refreshIcons();

  const user = await Auth.ready();
  if (!user) {
    location.replace('login.html?next=admin.html');
    return;
  }
  if (!Auth.isAdmin(user)) {
    root.innerHTML = deniedHTML(user);
    refreshIcons();
    return;
  }
  await refreshAdmin();

  root.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-admin-tab]');
    if (tab) {
      admin.tab = tab.dataset.adminTab;
      renderAdmin();
    }
    const refresh = e.target.closest('[data-admin-refresh]');
    if (refresh) {
      refresh.classList.add('is-loading');
      refreshAdmin();
    }
    // Bấm vào ô chọn trạng thái không mở/đóng chi tiết đơn
    if (e.target.closest('[data-status-select]')) e.preventDefault();
  });
  root.addEventListener('change', (e) => {
    if (e.target.matches('[data-status-select]')) changeStatus(e.target);
    if (e.target.matches('[data-admin-status]')) {
      admin.status = e.target.value;
      renderOrdersOnly();
    }
  });
  root.addEventListener('input', (e) => {
    if (!e.target.matches('[data-admin-search]')) return;
    admin.q = e.target.value;
    const pos = e.target.selectionStart;
    renderOrdersOnly();
    const input = $('[data-admin-search]');
    input.focus();
    input.setSelectionRange(pos, pos);
  });
}
