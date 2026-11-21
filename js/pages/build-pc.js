/* ==========================================================
   Build PC — tự chọn linh kiện, tính tổng tiền, thêm vào giỏ
   ========================================================== */

const BUILD_KEY = 'mkpc-build';
const SLOTS = [
  { id: 'cpu', name: 'Vi xử lý (CPU)', icon: 'cpu', match: (p) => p.cat === 'components' && p.tags.includes('cpu') },
  { id: 'vga', name: 'Card đồ họa (VGA)', icon: 'circuit-board', match: (p) => p.cat === 'components' && p.tags.includes('vga') },
  { id: 'ram', name: 'Bộ nhớ RAM', icon: 'memory-stick', match: (p) => p.cat === 'components' && p.tags.includes('ram') },
  { id: 'ssd', name: 'Ổ cứng SSD', icon: 'hard-drive', match: (p) => p.cat === 'components' && p.tags.includes('ssd') },
  { id: 'monitor', name: 'Màn hình', icon: 'monitor', match: (p) => p.cat === 'monitor' },
  { id: 'keyboard', name: 'Bàn phím', icon: 'keyboard', match: (p) => p.cat === 'keyboard' },
  { id: 'mouse', name: 'Chuột', icon: 'mouse', match: (p) => p.cat === 'mouse' },
  { id: 'headset', name: 'Tai nghe', icon: 'headphones', match: (p) => p.cat === 'headset' },
  { id: 'chair', name: 'Ghế gaming', icon: 'armchair', match: (p) => p.cat === 'chair' },
];

/* build = { slotId: { id, qty } } */
const readBuild = () => {
  const b = Store.get(BUILD_KEY, {});
  Object.keys(b).forEach((k) => { if (!productById(b[k]?.id)) delete b[k]; });
  return b;
};
const writeBuild = (b) => Store.set(BUILD_KEY, b);

function buildLines() {
  const b = readBuild();
  return SLOTS.filter((s) => b[s.id]).map((s) => ({ slot: s, p: productById(b[s.id].id), qty: b[s.id].qty }));
}

function render() {
  const root = $('#build-page');
  const b = readBuild();
  const lines = buildLines();
  const total = lines.reduce((s, l) => s + l.p.price * l.qty, 0);

  root.innerHTML = `
    ${renderBreadcrumb([['Build PC', '#']])}
    <section class="build-hero">
      <div>
        <h1>Build PC theo ý bạn</h1>
        <p>Chọn từng linh kiện, hệ thống tự tính tổng tiền. Nhân viên kỹ thuật sẽ kiểm tra tương thích, tư vấn thêm <b>mainboard, nguồn, vỏ case</b> phù hợp và lắp ráp miễn phí.</p>
      </div>
      <a class="btn btn--light" href="tel:${COMPANY.phone}">${icon('phone-call')}Tư vấn: ${COMPANY.phoneDisplay}</a>
    </section>

    <div class="checkout-grid">
      <section class="panel">
        <ol class="build-list">
          ${SLOTS.map((s, i) => {
            const sel = b[s.id] ? productById(b[s.id].id) : null;
            return `
            <li class="build-row" data-slot="${s.id}">
              <span class="build-row__index">${i + 1}</span>
              <span class="build-row__slot">${icon(s.icon)}${s.name}</span>
              ${sel ? `
                <div class="build-row__item">
                  <img src="${sel.img}" alt="" width="56" height="56">
                  <div>
                    <a href="product.html?id=${sel.id}" class="build-row__name">${sel.name}</a>
                    <b>${formatPrice(sel.price)}</b>
                  </div>
                </div>
                <div class="build-row__actions">
                  <div class="qty">
                    <button class="qty__btn" type="button" data-step="-1" aria-label="Giảm" ${b[s.id].qty <= 1 ? 'disabled' : ''}>${icon('minus')}</button>
                    <input class="qty__input" value="${b[s.id].qty}" readonly aria-label="Số lượng">
                    <button class="qty__btn" type="button" data-step="1" aria-label="Tăng" ${b[s.id].qty >= sel.stock ? 'disabled' : ''}>${icon('plus')}</button>
                  </div>
                  <button class="btn btn--ghost" type="button" data-pick aria-label="Đổi ${s.name}">${icon('repeat')}</button>
                  <button class="btn btn--ghost" type="button" data-clear-slot aria-label="Bỏ ${s.name}">${icon('trash-2')}</button>
                </div>` : `
                <button class="btn btn--outline build-row__pick" type="button" data-pick>${icon('plus')}Chọn ${s.name.toLowerCase()}</button>`}
            </li>`;
          }).join('')}
        </ol>
      </section>

      <aside class="panel summary">
        <h2 class="panel__title">${icon('calculator')}Chi phí dự tính</h2>
        <ul class="build-summary">
          ${lines.length ? lines.map((l) => `<li><span>${l.slot.name}${l.qty > 1 ? ` × ${l.qty}` : ''}</span><b>${formatPrice(l.p.price * l.qty)}</b></li>`).join('') : '<li class="field__hint">Chưa chọn linh kiện nào.</li>'}
        </ul>
        <dl class="totals"><div class="totals__grand"><dt>Tổng cộng</dt><dd>${formatPrice(total)}</dd></div></dl>
        <button class="btn btn--primary btn--lg btn--block" type="button" data-build-buy ${lines.length ? '' : 'disabled'}>${icon('zap')}ĐẶT MUA CẤU HÌNH</button>
        <button class="btn btn--outline btn--block" type="button" data-build-cart ${lines.length ? '' : 'disabled'}>${icon('shopping-cart')}Thêm tất cả vào giỏ</button>
        <button class="btn btn--ghost btn--block" type="button" data-build-copy ${lines.length ? '' : 'disabled'}>${icon('copy')}Sao chép cấu hình</button>
        <button class="btn btn--ghost btn--block" type="button" data-build-reset ${lines.length ? '' : 'disabled'}>${icon('rotate-ccw')}Làm lại từ đầu</button>
      </aside>
    </div>

    <div class="modal" id="pick-modal" role="dialog" aria-modal="true" aria-labelledby="pick-title" hidden>
      <div class="modal__overlay" data-close-modal></div>
      <div class="modal__box">
        <div class="modal__head">
          <h2 id="pick-title">Chọn linh kiện</h2>
          <button class="header-icon-btn modal__close" type="button" data-close-modal aria-label="Đóng">${icon('x')}</button>
        </div>
        <div class="modal__tools">
          <input class="input" type="search" placeholder="Tìm theo tên, thông số..." data-pick-search aria-label="Tìm linh kiện">
          <select class="select" data-pick-sort aria-label="Sắp xếp">
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="popular">Phổ biến</option>
          </select>
        </div>
        <ul class="pick-list" id="pick-list"></ul>
      </div>
    </div>`;
  refreshIcons();
}

let currentSlot = null;

function renderPickList() {
  const slot = SLOTS.find((s) => s.id === currentSlot);
  const q = $('[data-pick-search]').value;
  const sort = $('[data-pick-sort]').value;
  const list = Catalog.sort(Catalog.search(q, PRODUCTS.filter(slot.match)), sort);
  const chosen = readBuild()[slot.id]?.id;
  $('#pick-list').innerHTML = list.length ? list.map((p) => `
    <li class="pick-item${p.id === chosen ? ' is-chosen' : ''}">
      <img src="${p.img}" alt="" width="72" height="72">
      <div class="pick-item__info">
        <a href="product.html?id=${p.id}" target="_blank" rel="noopener">${p.name}</a>
        <p>${p.specs.map((s) => s[1]).join(' · ')}</p>
        <b>${formatPrice(p.price)}</b>${p.oldPrice > p.price ? `<del>${formatPrice(p.oldPrice)}</del>` : ''}
      </div>
      <button class="btn btn--primary" type="button" data-choose="${p.id}">${p.id === chosen ? 'Đang chọn' : 'Chọn'}</button>
    </li>`).join('') : '<li class="field__hint">Không có linh kiện phù hợp.</li>';
}

function openPicker(slotId) {
  currentSlot = slotId;
  const slot = SLOTS.find((s) => s.id === slotId);
  const modal = $('#pick-modal');
  $('#pick-title').textContent = `Chọn ${slot.name.toLowerCase()}`;
  $('[data-pick-search]').value = '';
  modal.hidden = false;
  document.body.classList.add('is-locked');
  renderPickList();
  $('[data-pick-search]').focus();
}

function closePicker() {
  $('#pick-modal').hidden = true;
  document.body.classList.remove('is-locked');
}

function buildText() {
  const lines = buildLines();
  const total = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  return `Cấu hình PC - ${COMPANY.name}\n${lines.map((l) => `- ${l.slot.name}: ${l.p.name} x${l.qty} = ${formatPrice(l.p.price * l.qty)}`).join('\n')}\nTổng: ${formatPrice(total)}`;
}

function initPage() {
  render();
  const root = $('#build-page');

  root.addEventListener('click', async (e) => {
    const row = e.target.closest('[data-slot]');
    if (row && e.target.closest('[data-pick]')) openPicker(row.dataset.slot);
    if (row && e.target.closest('[data-clear-slot]')) {
      const b = readBuild();
      delete b[row.dataset.slot];
      writeBuild(b);
      render();
    }
    const step = e.target.closest('[data-step]');
    if (row && step) {
      const b = readBuild();
      const p = productById(b[row.dataset.slot].id);
      b[row.dataset.slot].qty = Math.min(p.stock, Math.max(1, b[row.dataset.slot].qty + Number(step.dataset.step)));
      writeBuild(b);
      render();
    }
    const choose = e.target.closest('[data-choose]');
    if (choose) {
      const b = readBuild();
      b[currentSlot] = { id: choose.dataset.choose, qty: 1 };
      writeBuild(b);
      closePicker();
      render();
      showToast('Đã thêm linh kiện vào cấu hình');
    }
    if (e.target.closest('[data-close-modal]')) closePicker();
    if (e.target.closest('[data-build-cart]') || e.target.closest('[data-build-buy]')) {
      buildLines().forEach((l) => Cart.add(l.p.id, l.qty));
      updateCartCount(true);
      if (e.target.closest('[data-build-buy]')) location.href = 'checkout.html';
      else showToast('Đã thêm toàn bộ cấu hình vào giỏ hàng');
    }
    if (e.target.closest('[data-build-copy]')) {
      try {
        await navigator.clipboard.writeText(buildText());
        showToast('Đã sao chép cấu hình — gửi cho nhân viên qua Zalo để được tư vấn');
      } catch {
        window.prompt('Sao chép cấu hình:', buildText());
      }
    }
    if (e.target.closest('[data-build-reset]') && window.confirm('Xóa toàn bộ cấu hình đã chọn?')) {
      writeBuild({});
      render();
    }
  });

  root.addEventListener('input', (e) => {
    if (e.target.matches('[data-pick-search]')) renderPickList();
  });
  root.addEventListener('change', (e) => {
    if (e.target.matches('[data-pick-sort]')) renderPickList();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !$('#pick-modal').hidden) closePicker();
  });
}
