/* ==========================================================
   Trang sản phẩm yêu thích — yeu-thich
   ========================================================== */

function renderWishlist() {
  const root = $('#wishlist-page');
  const items = Wishlist.list();
  const total = items.reduce((s, p) => s + p.price, 0);

  root.innerHTML = `
    ${renderBreadcrumb([['Sản phẩm yêu thích', '#']])}
    <section class="block reveal">
      <div class="block-head">
        <h1 class="block-head__title">${icon('heart')}Sản phẩm yêu thích <small class="wishlist__count">(${items.length})</small></h1>
        ${items.length ? `
        <div class="wishlist__actions">
          <button class="btn btn--primary" type="button" data-wish-all>${icon('shopping-cart')}Thêm tất cả vào giỏ · ${formatPrice(total)}</button>
          <button class="btn btn--ghost" type="button" data-wish-clear>${icon('trash-2')}Xóa tất cả</button>
        </div>` : ''}
      </div>
      ${items.length
        ? `<div class="product-grid">${productCardsHTML(items)}</div>`
        : renderEmpty('heart', 'Chưa có sản phẩm yêu thích', 'Bấm biểu tượng trái tim trên sản phẩm để lưu lại và xem sau.', `<a class="btn btn--primary" href="${HOME_URL}">Khám phá sản phẩm</a>`)}
    </section>`;
  refreshIcons();
  initReveal(root);
}

function initPage() {
  renderWishlist();
  const root = $('#wishlist-page');
  document.addEventListener('wishlist:change', renderWishlist);

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-wish-all]')) {
      Wishlist.list().forEach((p) => Cart.add(p.id, 1));
      updateCartCount(true);
      showToast('Đã thêm tất cả vào giỏ hàng');
    }
    if (e.target.closest('[data-wish-clear]') && window.confirm('Xóa toàn bộ sản phẩm yêu thích?')) {
      Wishlist.clear();
      syncWishCompare();
      renderWishlist();
    }
  });
}
