/* ==========================================================
   Trang chi tiết sản phẩm — product.html?id=mk001
   ========================================================== */

const SPEC_LABELS = {
  cpu: 'CPU', gpu: 'Card đồ họa', ram: 'RAM', ssd: 'Ổ cứng', screen: 'Màn hình',
  fan: 'Tản nhiệt', power: 'Nguồn đề nghị', speed: 'Tốc độ', socket: 'Socket',
  dpi: 'Cảm biến', wireless: 'Kết nối', wired: 'Kết nối', weight: 'Trọng lượng / tải trọng',
  switch: 'Switch', layout: 'Layout', size: 'Kích thước', panel: 'Tấm nền', hz: 'Tần số quét', res: 'Độ phân giải',
  driver: 'Driver', material: 'Chất liệu',
};

const CAT_FOR_PRODUCT = {
  pc: (p) => (p.tags.includes('gaming') ? 'pc' : 'pc-office'),
  'laptop-gaming': () => 'laptop-gaming',
  laptop: () => 'laptop',
  components: () => 'components',
  monitor: () => 'monitor',
  keyboard: () => 'keyboard',
  mouse: () => 'mouse',
  headset: () => 'headset',
  chair: () => 'chair',
};

/* Mô tả sinh từ thông số (thay bằng mô tả thật khi có) */
function describe(p) {
  const spec = (type) => p.specs.find((s) => s[0] === type)?.[1];
  const intro = {
    pc: `${p.name} là bộ máy được Minh Khôi PC lắp ráp và kiểm tra kỹ lưỡng trước khi giao. Cấu hình sử dụng CPU ${spec('cpu')} kết hợp card đồ họa ${spec('gpu')}, RAM ${spec('ram')} và ổ ${spec('ssd')} cho tốc độ khởi động, tải game nhanh.`,
    'laptop-gaming': `${p.name} trang bị CPU ${spec('cpu')}, card đồ họa ${spec('gpu')} và màn hình ${spec('screen')} — lựa chọn mạnh mẽ cho game thủ và người làm đồ họa cần sự cơ động.`,
    laptop: `${p.name} với CPU ${spec('cpu')}, RAM ${spec('ram')} và màn hình ${spec('screen')} đáp ứng tốt nhu cầu học tập, làm việc văn phòng và giải trí hằng ngày.`,
    components: `${p.name} là linh kiện chính hãng, phù hợp nâng cấp hoặc build mới PC. Đội ngũ kỹ thuật Minh Khôi PC hỗ trợ kiểm tra tương thích và lắp đặt miễn phí khi mua tại cửa hàng.`,
    monitor: `${p.name} kích thước ${spec('size')}, tấm nền ${spec('panel')}, tần số quét ${spec('hz')} và độ phân giải ${spec('res')} cho hình ảnh sắc nét, chuyển động mượt mà.`,
    keyboard: `${p.name} sử dụng switch ${spec('switch')}, layout ${spec('layout')}, kết nối ${spec('wireless') || spec('wired')} — cảm giác gõ chắc tay, phù hợp cả chơi game lẫn làm việc.`,
    mouse: `${p.name} với cảm biến ${spec('dpi')}, kết nối ${spec('wireless') || spec('wired')} và trọng lượng ${spec('weight')} giúp thao tác chính xác, thoải mái trong thời gian dài.`,
    headset: `${p.name} cho âm thanh sống động, đeo êm tai, phù hợp chơi game, học online và giải trí.`,
    chair: `${p.name} thiết kế công thái học, chất liệu ${spec('material')}, hỗ trợ ngồi lâu thoải mái khi chơi game và làm việc.`,
  }[p.cat] || p.name;
  return [
    ['p', intro],
    ['h', 'Điểm nổi bật'],
    ['ul', [
      'Sản phẩm chính hãng, mới 100%.',
      `Bảo hành ${SHOP.warranty[p.cat] || 12} tháng tại ${COMPANY.name}.`,
      p.gift ? `Quà tặng: ${p.gift}.` : 'Hỗ trợ kỹ thuật trọn đời sản phẩm.',
      'Giao hàng toàn quốc, kiểm tra hàng trước khi thanh toán.',
    ]],
    ['p', `Cần tư vấn thêm? Gọi ngay ${COMPANY.phoneDisplay} để được nhân viên hỗ trợ.`],
  ];
}

/* Đánh giá do khách gửi — lưu trên thiết bị */
const Reviews = {
  key: (id) => `mkpc-reviews-${id}`,
  list: (id) => Store.get(Reviews.key(id), []),
  add(id, review) {
    const list = Reviews.list(id);
    list.unshift(review);
    Store.set(Reviews.key(id), list.slice(0, 30));
  },
};

function starIcons(value) {
  return Array.from({ length: 5 }, (_, i) => `<i data-lucide="star" class="${i < Math.round(value) ? 'is-on' : ''}" aria-hidden="true"></i>`).join('');
}

function renderReviews(p) {
  const mine = Reviews.list(p.id);
  return `
    <div class="reviews">
      <div class="reviews__summary">
        <b class="reviews__score">${p.rating.toFixed(1)}</b>
        <div class="stars">${starIcons(p.rating)}</div>
        <p>${p.reviews + mine.length} đánh giá</p>
      </div>
      <form class="reviews__form" data-review-form>
        <p class="field__label">Đánh giá của bạn</p>
        <div class="rate-input" role="radiogroup" aria-label="Chọn số sao">
          ${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="stars" id="star-${n}" value="${n}" ${n === 5 ? 'checked' : ''}><label for="star-${n}" title="${n} sao">${icon('star')}</label>`).join('')}
        </div>
        <div class="form-grid form-grid--2">
          <div class="field"><input class="input" name="name" placeholder="Tên của bạn *" maxlength="40" required><span class="field__error"></span></div>
          <div class="field field--full"><textarea class="textarea" name="content" placeholder="Chia sẻ cảm nhận về sản phẩm *" maxlength="500" required></textarea><span class="field__error"></span></div>
        </div>
        <button class="btn btn--primary" type="submit">${icon('send')}Gửi đánh giá</button>
        <p class="field__hint">Đánh giá của bạn được lưu trên thiết bị này.</p>
      </form>
      <div class="reviews__list" id="reviews-list">
        ${mine.length ? mine.map((r) => `
          <article class="review">
            <div class="review__head"><b>${esc(r.name)}</b><span class="stars stars--sm">${starIcons(r.stars)}</span><time>${esc(r.date)}</time></div>
            <p>${esc(r.content)}</p>
          </article>`).join('') : '<p class="field__hint">Chưa có nhận xét nào trên thiết bị này. Hãy là người đầu tiên!</p>'}
      </div>
    </div>`;
}

function renderProduct(p) {
  const discount = discountPercent(p.price, p.oldPrice);
  const catId = CAT_FOR_PRODUCT[p.cat]?.(p) || p.cat;
  const catName = CATEGORY_RULES[catId]?.name || 'Sản phẩm';
  const warranty = SHOP.warranty[p.cat] || 12;
  const related = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 10);
  const recent = Recent.list(p.id).slice(0, 10);
  const specRows = [
    ['Thương hiệu', p.brand],
    ...p.specs.map(([type, value]) => [SPEC_LABELS[type] || type, value]),
    ['Bảo hành', `${warranty} tháng`],
    ['Tình trạng', 'Mới 100%, nguyên seal'],
  ];

  return `
    ${renderBreadcrumb([[catName, `category.html?cat=${catId}`], [p.name, '#']])}
    <section class="pd panel">
      <div class="pd__gallery">
        <div class="pd__image" data-zoom>
          <img src="${p.img}" alt="${p.name}" width="600" height="600">
          ${discount ? `<span class="pd__badge">-${discount}%</span>` : ''}
        </div>
        <p class="pd__note">${icon('info')}Hình ảnh mang tính minh họa theo dòng sản phẩm.</p>
      </div>

      <div class="pd__info">
        <p class="pd__brand">Thương hiệu: <a href="category.html?cat=${catId}&brand=${encodeURIComponent(p.brand)}">${p.brand}</a> · Mã SP: ${p.id.toUpperCase()}</p>
        <h1 class="pd__name">${p.name}</h1>
        <div class="pd__meta">
          <span class="stars">${starIcons(p.rating)}</span>
          <b>${p.rating.toFixed(1)}</b>
          <a href="#danh-gia">${p.reviews} đánh giá</a>
          ${p.label ? `<span class="product-card__tag">${icon('flame')}${p.label}</span>` : ''}
        </div>

        <div class="pd__price">
          <strong>${formatPrice(p.price)}</strong>
          ${discount ? `<del>${formatPrice(p.oldPrice)}</del><span class="badge badge--solid">-${discount}%</span>` : ''}
          ${discount ? `<p class="pd__save">Tiết kiệm ${formatPrice(p.oldPrice - p.price)}</p>` : ''}
        </div>

        <div class="pd__promo">
          <p class="pd__promo-title">${icon('gift')}Khuyến mãi & ưu đãi</p>
          <ul>
            ${p.gift ? `<li>${icon('circle-check')}<span>${p.gift}</span></li>` : ''}
            <li>${icon('circle-check')}<span>Miễn phí giao hàng cho đơn từ ${formatPrice(SHOP.freeShipFrom)}</span></li>
            <li>${icon('circle-check')}<span>Hỗ trợ trả góp 0% qua thẻ tín dụng</span></li>
            <li>${icon('circle-check')}<span>Nhập mã <b>BLACKFRIDAY</b> giảm thêm 5% (tối đa 500.000đ)</span></li>
          </ul>
        </div>

        <p class="pd__stock ${p.stock <= 5 ? 'is-low' : ''}">${icon(p.stock <= 5 ? 'alert-triangle' : 'package-check')}${p.stock <= 5 ? `Chỉ còn ${p.stock} sản phẩm` : 'Còn hàng — sẵn sàng giao ngay'}</p>

        <div class="pd__qty">
          <span>Số lượng:</span>
          <div class="qty qty--lg" data-qty>
            <button class="qty__btn" type="button" data-step="-1" aria-label="Giảm số lượng">${icon('minus')}</button>
            <input class="qty__input" type="number" value="1" min="1" max="${p.stock}" aria-label="Số lượng">
            <button class="qty__btn" type="button" data-step="1" aria-label="Tăng số lượng">${icon('plus')}</button>
          </div>
        </div>

        <div class="pd__actions">
          <button class="btn btn--primary btn--lg btn--stack pd__buy" type="button" data-pd-buy>MUA NGAY<span class="btn__sub">Giao tận nơi hoặc nhận tại cửa hàng</span></button>
          <button class="btn btn--outline btn--lg" type="button" data-pd-add>${icon('shopping-cart')}Thêm vào giỏ</button>
          <a class="btn btn--dark btn--lg btn--stack" href="policy.html?type=tra-gop">TRẢ GÓP 0%<span class="btn__sub">Duyệt nhanh qua điện thoại</span></a>
        </div>

        <ul class="pd__commits">
          <li>${icon('shield-check')}Bảo hành ${warranty} tháng</li>
          <li>${icon('badge-check')}Hàng chính hãng 100%</li>
          <li>${icon('refresh-ccw')}Đổi mới trong 7 ngày nếu lỗi</li>
          <li>${icon('truck')}Giao hàng toàn quốc</li>
        </ul>

        <a class="pd__call" href="tel:${COMPANY.phone}">${icon('phone-call')}Gọi đặt mua: <b>${COMPANY.phoneDisplay}</b></a>
      </div>
    </section>

    <div class="pd-detail">
      <section class="panel reveal">
        <h2 class="panel__title">${icon('file-text')}Mô tả sản phẩm</h2>
        <div class="prose">${renderRichText(describe(p))}</div>
      </section>
      <section class="panel reveal">
        <h2 class="panel__title">${icon('list')}Thông số kỹ thuật</h2>
        <table class="spec-table"><tbody>${specRows.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>
      </section>
    </div>

    <section class="panel section reveal" id="danh-gia">
      <h2 class="panel__title">${icon('message-square')}Đánh giá & nhận xét</h2>
      ${renderReviews(p)}
    </section>

    ${related.length ? `
    <section class="section block reveal">
      <div class="block-head"><h2 class="block-head__title">Sản phẩm tương tự</h2><a class="block-head__more" href="category.html?cat=${catId}">Xem tất cả${icon('chevron-right')}</a></div>
      ${sliderHTML(productCardsHTML(related))}
    </section>` : ''}

    ${recent.length ? `
    <section class="section block reveal">
      <div class="block-head"><h2 class="block-head__title">Sản phẩm bạn đã xem</h2></div>
      ${sliderHTML(productCardsHTML(recent, { compact: true }))}
    </section>` : ''}

    <div class="pd-sticky" aria-hidden="false">
      <div><p class="pd-sticky__name">${p.name}</p><b>${formatPrice(p.price)}</b></div>
      <button class="btn btn--outline" type="button" data-pd-add aria-label="Thêm vào giỏ">${icon('shopping-cart')}</button>
      <button class="btn btn--primary" type="button" data-pd-buy>Mua ngay</button>
    </div>`;
}

function bindProduct(p) {
  const root = $('#product-page');
  const input = $('.qty__input', root);
  const qty = () => Math.min(p.stock, Math.max(1, Number(input.value) || 1));
  const syncQty = () => {
    input.value = qty();
    $('[data-step="-1"]', root).disabled = qty() <= 1;
    $('[data-step="1"]', root).disabled = qty() >= p.stock;
  };
  syncQty();

  root.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]');
    if (step) {
      input.value = qty() + Number(step.dataset.step);
      syncQty();
    }
    if (e.target.closest('[data-pd-add]')) addToCartWithFeedback(p.id, qty());
    if (e.target.closest('[data-pd-buy]')) {
      Cart.add(p.id, qty());
      location.href = 'checkout.html';
    }
  });
  input.addEventListener('change', syncQty);

  // Phóng to ảnh khi rê chuột
  const zoom = $('[data-zoom]', root);
  const img = $('img', zoom);
  zoom.addEventListener('mousemove', (e) => {
    const r = zoom.getBoundingClientRect();
    img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
    img.style.transform = 'scale(1.8)';
  });
  zoom.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });

  // Gửi đánh giá (ủy quyền sự kiện vì form được vẽ lại sau mỗi lần gửi)
  root.addEventListener('submit', (e) => {
    const form = e.target.closest('[data-review-form]');
    if (!form) return;
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name')).trim();
    const content = String(data.get('content')).trim();
    setFieldError(form.name, name ? '' : 'Vui lòng nhập tên');
    setFieldError(form.content, content.length >= 5 ? '' : 'Nhận xét tối thiểu 5 ký tự');
    if (!name || content.length < 5) return;
    Reviews.add(p.id, { name, content, stars: Number(data.get('stars')), date: new Date().toLocaleDateString('vi-VN') });
    $('#danh-gia .reviews').outerHTML = renderReviews(p);
    refreshIcons();
    showToast('Cảm ơn bạn đã đánh giá sản phẩm!');
  });
}

function initPage() {
  const p = productById(params.get('id'));
  const root = $('#product-page');
  if (!p) {
    root.innerHTML = `${renderBreadcrumb([['Không tìm thấy', '#']])}<div class="panel">${renderEmpty('package-x', 'Không tìm thấy sản phẩm', 'Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.', '<a class="btn btn--primary" href="category.html">Xem sản phẩm khác</a>')}</div>`;
    return;
  }
  document.title = `${p.name} | ${COMPANY.name}`;
  $('meta[name="description"]').setAttribute('content', `${p.name} giá ${formatPrice(p.price)} — chính hãng, bảo hành ${SHOP.warranty[p.cat] || 12} tháng tại ${COMPANY.name}.`);
  root.innerHTML = renderProduct(p);
  Recent.add(p.id);
  bindProduct(p);
}
