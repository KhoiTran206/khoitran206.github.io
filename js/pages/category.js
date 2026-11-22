/* ==========================================================
   Trang danh mục / tìm kiếm / khuyến mãi
   URL: danh-muc?cat=&q=&sale=1&cond=new|used&type=&brand=A,B&min=&max=&sort=&page=
   ========================================================== */

const PER_PAGE = 20;
const PRICE_PRESETS = [
  ['Dưới 2 triệu', 0, 2e6],
  ['2 - 5 triệu', 2e6, 5e6],
  ['5 - 10 triệu', 5e6, 10e6],
  ['10 - 20 triệu', 10e6, 20e6],
  ['20 - 30 triệu', 20e6, 30e6],
  ['Trên 30 triệu', 30e6, Infinity],
];
const SORTS = [
  ['popular', 'Phổ biến'],
  ['discount', 'Giảm giá nhiều'],
  ['price-asc', 'Giá tăng dần'],
  ['price-desc', 'Giá giảm dần'],
  ['name', 'Tên A → Z'],
];

const state = {
  cat: params.get('cat') || '',
  q: params.get('q') || '',
  sale: params.get('sale') === '1',
  cond: ['new', 'used'].includes(params.get('cond')) ? params.get('cond') : '', // tìm kiếm: hàng mới / hàng cũ
  type: params.get('type') || '', // loại hàng cũ (USED_TYPES)
  brands: (params.get('brand') || '').split(',').filter(Boolean),
  min: Number(params.get('min')) || 0,
  max: params.get('max') ? Number(params.get('max')) : Infinity,
  sort: params.get('sort') || 'popular',
  page: Math.max(1, Number(params.get('page')) || 1),
};

function syncUrl() {
  const u = new URLSearchParams();
  if (state.cat) u.set('cat', state.cat);
  if (state.q) u.set('q', state.q);
  if (state.sale) u.set('sale', '1');
  if (state.cond) u.set('cond', state.cond);
  if (state.type) u.set('type', state.type);
  if (state.brands.length) u.set('brand', state.brands.join(','));
  if (state.min) u.set('min', state.min);
  if (state.max !== Infinity) u.set('max', state.max);
  if (state.sort !== 'popular') u.set('sort', state.sort);
  if (state.page > 1) u.set('page', state.page);
  history.replaceState(null, '', `${location.pathname}${u.toString() ? `?${u}` : ''}`);
}

function pageTitle() {
  if (state.q && !Catalog.parsePrice(state.q)) return `Kết quả tìm kiếm cho “${esc(state.q)}”`;
  if (usedType()) return usedType()[1];
  if (state.cat && CATEGORY_RULES[state.cat]) return CATEGORY_RULES[state.cat].name;
  if (state.sale) return 'Sản phẩm khuyến mãi';
  return 'Tất cả sản phẩm';
}

/* Danh sách gốc (chưa lọc thương hiệu/giá) để đếm số lượng trong bộ lọc */
const baseList = () => Catalog.filter({ cat: state.cat, q: state.q, sale: state.sale, cond: state.cond, type: state.type });
const usedType = () => (state.cat === 'used' ? USED_TYPES.find(([id]) => id === state.type) : null);

/* Thanh tách hàng mới / hàng cũ:
   - Danh mục Hàng cũ: chọn loại (laptop, PC, linh kiện...)
   - Tìm kiếm / tất cả sản phẩm: Tất cả · Hàng mới · Hàng cũ (chỉ hiện khi có cả hai) */
function conditionBar() {
  const seg = (attr, value, label, count, active) =>
    `<button type="button" class="seg__btn${active ? ' is-active' : ''}" ${attr}="${value}" aria-pressed="${active}">${label}<span>${count}</span></button>`;
  if (state.cat === 'used') {
    const all = Catalog.filter({ cat: 'used', q: state.q, sale: state.sale });
    const types = USED_TYPES.map(([id, label, match]) => [id, label, all.filter(match).length]).filter(([, , n]) => n);
    return `<div class="seg" role="group" aria-label="Loại hàng cũ">${seg('data-type', '', 'Tất cả hàng cũ', all.length, !state.type)}${types.map(([id, label, n]) => seg('data-type', id, label, n, state.type === id)).join('')}</div>`;
  }
  if (state.cat || state.sale) return '';
  const all = Catalog.filter({ q: state.q });
  const used = all.filter(isUsed).length;
  const fresh = all.length - used;
  if (!used || !fresh) return '';
  return `<div class="seg" role="group" aria-label="Tình trạng sản phẩm">${seg('data-cond', '', 'Tất cả', all.length, !state.cond)}${seg('data-cond', 'new', `${icon('sparkles')}Hàng mới`, fresh, state.cond === 'new')}${seg('data-cond', 'used', `${icon('recycle')}Hàng cũ`, used, state.cond === 'used')}</div>`;
}

function renderFilters() {
  const base = baseList();
  const brandCounts = base.reduce((acc, p) => ({ ...acc, [p.brand]: (acc[p.brand] || 0) + 1 }), {});
  const brands = Object.keys(brandCounts).sort((a, b) => brandCounts[b] - brandCounts[a]);
  const catLinks = Object.entries(CATEGORY_RULES).map(([id, rule]) => {
    const count = PRODUCTS.filter(rule.match).length;
    return `<li><a class="filter-cat${state.cat === id ? ' is-active' : ''}" href="danh-muc?cat=${id}">${rule.name}<span>${count}</span></a></li>`;
  }).join('');
  const presetActive = (lo, hi) => state.min === lo && state.max === hi;

  return `
    <div class="filters__head">
      <h2>${icon('sliders-horizontal')}Bộ lọc</h2>
      <button class="header-icon-btn filters__close" type="button" data-filters-close aria-label="Đóng bộ lọc">${icon('x')}</button>
    </div>
    <section class="filter-group">
      <h3 class="filter-group__title">Danh mục</h3>
      <ul class="filter-cats">${catLinks}</ul>
    </section>
    <section class="filter-group">
      <h3 class="filter-group__title">Khoảng giá</h3>
      <div class="filter-prices">
        ${PRICE_PRESETS.map(([label, lo, hi]) => `<button type="button" class="filter-chip${presetActive(lo, hi) ? ' is-active' : ''}" data-price="${lo},${hi === Infinity ? '' : hi}">${label}</button>`).join('')}
      </div>
      <form class="filter-range" data-price-form>
        <input class="input" type="number" min="0" step="100000" name="min" placeholder="Từ (đ)" value="${state.min || ''}" aria-label="Giá từ">
        <span>—</span>
        <input class="input" type="number" min="0" step="100000" name="max" placeholder="Đến (đ)" value="${state.max === Infinity ? '' : state.max}" aria-label="Giá đến">
        <button class="btn btn--primary" type="submit">Áp dụng</button>
      </form>
    </section>
    ${brands.length ? `
    <section class="filter-group">
      <h3 class="filter-group__title">Thương hiệu</h3>
      <div class="filter-brands">
        ${brands.map((b) => `<label class="check"><input type="checkbox" value="${b}" data-brand ${state.brands.includes(b) ? 'checked' : ''}>${b}<span class="filter-count">${brandCounts[b]}</span></label>`).join('')}
      </div>
    </section>` : ''}
    <section class="filter-group">
      <label class="check"><input type="checkbox" data-sale ${state.sale ? 'checked' : ''}>Chỉ hiện sản phẩm đang giảm giá</label>
    </section>`;
}

function activeChips() {
  const chips = [];
  if (state.q) chips.push(['q', `Từ khóa: ${esc(state.q)}`]);
  if (state.sale) chips.push(['sale', 'Đang giảm giá']);
  state.brands.forEach((b) => chips.push([`brand:${b}`, b]));
  if (state.min || state.max !== Infinity) {
    const lo = state.min ? formatPrice(state.min) : '0đ';
    const hi = state.max === Infinity ? 'trở lên' : formatPrice(state.max);
    chips.push(['price', `Giá: ${lo} – ${hi}`]);
  }
  if (!chips.length) return '';
  return `
    <div class="active-filters">
      ${chips.map(([key, label]) => `<button type="button" class="active-chip" data-remove="${key}">${label}${icon('x')}</button>`).join('')}
      <button type="button" class="active-clear" data-remove="all">Xóa tất cả</button>
    </div>`;
}

function pagination(total) {
  const pages = Math.ceil(total / PER_PAGE);
  if (pages <= 1) return '';
  const btn = (n, label = n, extra = '') => `<button type="button" class="pagination__btn${n === state.page ? ' is-active' : ''}" data-page="${n}" ${extra}>${label}</button>`;
  let html = btn(state.page - 1, icon('chevron-left'), `aria-label="Trang trước" ${state.page === 1 ? 'disabled' : ''}`);
  for (let n = 1; n <= pages; n += 1) html += btn(n);
  html += btn(state.page + 1, icon('chevron-right'), `aria-label="Trang sau" ${state.page === pages ? 'disabled' : ''}`);
  return `<nav class="pagination" aria-label="Phân trang">${html}</nav>`;
}

function render() {
  const list = Catalog.filter(state);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  state.page = Math.min(state.page, pages);
  const slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
  const crumbs = usedType() ? [[CATEGORY_RULES.used.name, 'danh-muc?cat=used'], [usedType()[1], '#']]
    : state.cat && CATEGORY_RULES[state.cat] ? [[CATEGORY_RULES[state.cat].name, '#']] : [[state.q ? 'Tìm kiếm' : 'Sản phẩm', '#']];

  $('#category-page').innerHTML = `
    ${renderBreadcrumb(crumbs)}
    <div class="catalog">
      <aside class="filters" id="filters" aria-label="Bộ lọc sản phẩm">${renderFilters()}</aside>
      <div class="filters-overlay" data-filters-close></div>
      <section class="catalog__main">
        <div class="catalog__head">
          <h1 class="page-title">${pageTitle()}<small>${list.length} sản phẩm</small></h1>
          <div class="catalog__tools">
            <button class="btn btn--outline catalog__filter-btn" type="button" data-filters-open>${icon('sliders-horizontal')}Bộ lọc</button>
            <label class="catalog__sort">
              <span>Sắp xếp:</span>
              <select class="select" data-sort aria-label="Sắp xếp sản phẩm">
                ${SORTS.map(([v, l]) => `<option value="${v}" ${state.sort === v ? 'selected' : ''}>${l}</option>`).join('')}
              </select>
            </label>
          </div>
        </div>
        ${conditionBar()}
        ${activeChips()}
        ${slice.length
          ? `<div class="product-grid reveal">${slice.map((p, i) => renderProductCard(p, { index: i % 8, itemClass: 'reveal-item' })).join('')}</div>${pagination(list.length)}`
          : `<div class="panel">${renderEmpty('search-x', 'Không tìm thấy sản phẩm phù hợp', 'Hãy thử bỏ bớt bộ lọc, đổi từ khóa khác hoặc gọi hotline để được tư vấn.', `<div class="empty__actions"><button class="btn btn--primary" type="button" data-remove="all">Xóa bộ lọc</button><a class="btn btn--outline" href="tel:${COMPANY.phone}">${icon('phone')}Gọi ${COMPANY.phoneDisplay}</a></div>`)}</div>`}
      </section>
    </div>`;

  document.title = `${pageTitle().replace(/<[^>]+>|&[a-z#0-9]+;/g, '')} | ${COMPANY.name}`;
  syncUrl();
  refreshIcons();
  initReveal($('#category-page'));
}

function update(changes, resetPage = true) {
  Object.assign(state, changes);
  if (resetPage) state.page = 1;
  render();
}

function bindEvents() {
  const root = $('#category-page');

  root.addEventListener('change', (e) => {
    if (e.target.matches('[data-sort]')) update({ sort: e.target.value });
    if (e.target.matches('[data-brand]')) {
      const brands = $$('[data-brand]:checked', root).map((el) => el.value);
      update({ brands });
    }
    if (e.target.matches('[data-sale]')) update({ sale: e.target.checked });
  });

  root.addEventListener('click', (e) => {
    const price = e.target.closest('[data-price]');
    if (price) {
      const [lo, hi] = price.dataset.price.split(',');
      const same = state.min === Number(lo) && state.max === (hi ? Number(hi) : Infinity);
      update(same ? { min: 0, max: Infinity } : { min: Number(lo), max: hi ? Number(hi) : Infinity });
      return;
    }
    const cond = e.target.closest('[data-cond]');
    if (cond) { update({ cond: cond.dataset.cond }); return; }
    const type = e.target.closest('[data-type]');
    if (type) { update({ type: type.dataset.type }); return; }
    const remove = e.target.closest('[data-remove]');
    if (remove) {
      const key = remove.dataset.remove;
      if (key === 'all') update({ q: '', sale: false, cond: '', type: '', brands: [], min: 0, max: Infinity });
      else if (key === 'q') update({ q: '' });
      else if (key === 'sale') update({ sale: false });
      else if (key === 'price') update({ min: 0, max: Infinity });
      else if (key.startsWith('brand:')) update({ brands: state.brands.filter((b) => b !== key.slice(6)) });
      return;
    }
    const pageBtn = e.target.closest('[data-page]');
    if (pageBtn) {
      update({ page: Number(pageBtn.dataset.page) }, false);
      root.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (e.target.closest('[data-filters-open]')) {
      $('#filters').classList.add('is-open');
      document.body.classList.add('is-locked');
    }
    if (e.target.closest('[data-filters-close]')) {
      $('#filters').classList.remove('is-open');
      document.body.classList.remove('is-locked');
    }
  });

  root.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-price-form]')) return;
    e.preventDefault();
    const data = new FormData(e.target);
    const lo = Number(data.get('min')) || 0;
    const hi = data.get('max') ? Number(data.get('max')) : Infinity;
    update({ min: Math.min(lo, hi), max: Math.max(lo, hi) });
  });
}

function initPage() {
  render();
  bindEvents();
}
