/* ==========================================================
   Trang so sánh sản phẩm — compare.html (tối đa 3, cùng loại)
   ========================================================== */

function renderCompare() {
  const root = $('#compare-page');
  const items = Compare.list();

  if (!items.length) {
    root.innerHTML = `
      ${renderBreadcrumb([['So sánh sản phẩm', '#']])}
      <div class="panel">${renderEmpty('git-compare-arrows', 'Chưa có sản phẩm để so sánh', 'Bấm nút "So sánh" trên sản phẩm (tối đa 3 sản phẩm cùng loại) để xem thông số cạnh nhau.', `<a class="btn btn--primary" href="${HOME_URL}">Chọn sản phẩm</a>`)}</div>`;
    refreshIcons();
    return;
  }

  // Gộp mọi loại thông số của các sản phẩm, giữ thứ tự xuất hiện
  const types = [...new Set(items.flatMap((p) => p.specs.map(([t]) => (t === 'wired' ? 'wireless' : t))))];
  const spec = (p, type) => p.specs.find(([t]) => t === type || (type === 'wireless' && t === 'wired'))?.[1] || '—';
  const minPrice = Math.min(...items.map((p) => p.price));
  const bestRating = Math.max(...items.map((p) => p.rating));
  const catId = Object.keys(CATEGORY_RULES).find((k) => CATEGORY_RULES[k].match(items[0])) || '';
  const canAdd = items.length < Compare.max;

  const row = (label, cells, cls = '') => `<tr class="${cls}"><th scope="row">${label}</th>${cells.join('')}${canAdd ? '<td></td>' : ''}</tr>`;

  root.innerHTML = `
    ${renderBreadcrumb([['So sánh sản phẩm', '#']])}
    <section class="panel compare reveal">
      <div class="compare__head">
        <h1 class="panel__title">${icon('git-compare-arrows')}So sánh ${items.length} sản phẩm</h1>
        <button class="btn btn--ghost" type="button" data-compare-clear>${icon('trash-2')}Xóa tất cả</button>
      </div>
      <div class="compare__scroll">
        <table class="compare__table" style="--cols:${items.length + (canAdd ? 1 : 0)}">
          <thead>
            <tr>
              <th scope="col"><span class="sr-only">Thông số</span></th>
              ${items.map((p) => `
                <th scope="col">
                  <div class="compare__product">
                    <button class="compare__remove" type="button" data-compare-remove="${p.id}" aria-label="Bỏ ${p.name}">${icon('x')}</button>
                    <a href="product.html?id=${p.id}"><img src="${thumb(p.img)}" alt="${p.name}" width="160" height="160"></a>
                    <a class="compare__name" href="product.html?id=${p.id}">${p.name}</a>
                    <strong class="compare__price">${formatPrice(p.price)}</strong>
                    ${p.oldPrice > p.price ? `<del>${formatPrice(p.oldPrice)}</del>` : ''}
                    <button class="btn btn--primary btn--block" type="button" data-add-cart="${p.id}">${icon('shopping-cart')}Thêm vào giỏ</button>
                  </div>
                </th>`).join('')}
              ${canAdd ? `<th scope="col"><a class="compare__add" href="category.html?cat=${catId}">${icon('plus')}<span>Thêm sản phẩm<br><small>cùng loại để so sánh</small></span></a></th>` : ''}
            </tr>
          </thead>
          <tbody>
            ${row('Giá bán', items.map((p) => `<td class="${p.price === minPrice && items.length > 1 ? 'is-best' : ''}">${formatPrice(p.price)}${p.price === minPrice && items.length > 1 ? '<small>Giá tốt nhất</small>' : ''}</td>`))}
            ${row('Thương hiệu', items.map((p) => `<td>${p.brand}</td>`))}
            ${types.map((t) => row(SPEC_LABELS[t] || t, items.map((p) => `<td>${spec(p, t)}</td>`))).join('')}
            ${row('Bảo hành', items.map((p) => `<td>${SHOP.warranty[p.cat] || 12} tháng</td>`))}
            ${row('Đánh giá', items.map((p) => `<td class="${p.rating === bestRating && items.length > 1 ? 'is-best' : ''}">${icon('star')} ${p.rating.toFixed(1)}/5</td>`))}
            ${row('Tình trạng', items.map((p) => `<td>${p.stock > 0 ? `<span class="compare__stock">${icon('circle-check')}Còn hàng</span>` : 'Hết hàng'}</td>`))}
            ${row('Quà tặng', items.map((p) => `<td>${p.gift || '—'}</td>`))}
          </tbody>
        </table>
      </div>
    </section>`;
  refreshIcons();
  initReveal(root);
}

function initPage() {
  renderCompare();
  // Nút xóa/bỏ dùng chung xử lý trong app.js → vẽ lại bảng sau khi đổi
  $('#compare-page').addEventListener('click', (e) => {
    if (e.target.closest('[data-compare-remove], [data-compare-clear]')) setTimeout(renderCompare);
  });
}
