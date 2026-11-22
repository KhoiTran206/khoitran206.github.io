/* ==========================================================
   Trang chủ: hero, icon danh mục, flash sale, khối sản phẩm, tin tức
   ========================================================== */

function renderHero() {
  $('#hero-slider').innerHTML = `
    <div class="hero-slider__track">${HERO_SLIDES.map((s) => renderPromo(s)).join('')}</div>
    <button class="hero-slider__btn hero-slider__btn--prev" type="button" aria-label="Banner trước">${icon('chevron-left')}</button>
    <button class="hero-slider__btn hero-slider__btn--next" type="button" aria-label="Banner tiếp theo">${icon('chevron-right')}</button>
    <div class="hero-slider__dots">${HERO_SLIDES.map((_, i) => `<button class="hero-slider__dot" type="button" aria-label="Chuyển tới banner ${i + 1}"></button>`).join('')}</div>`;
  $('#hero-side').innerHTML = HERO_SIDE.map((b) => renderPromo(b, 'sm')).join('');
  // Chỉ banner đầu tiên (và 2 banner bên phải trên máy tính) tải ngay, ưu tiên cao; các banner trượt sau tải khi cần
  const first = $('#hero-slider img');
  if (first) { first.removeAttribute('loading'); first.fetchPriority = 'high'; }
  if (window.matchMedia('(min-width: 1025px)').matches) $$('#hero-side img').forEach((img) => img.removeAttribute('loading'));
}

function renderCategoryIcons() {
  $('#cat-icons').innerHTML = QUICK_CATS.map((c, i) => `
    <a class="cat-icon reveal-item" style="--i:${i}" href="${c.href}">
      ${c.special
        ? `<span class="cat-icon__img cat-icon__img--special">${icon('flame')}<b>BLACK<br>FRIDAY</b></span>`
        : `<span class="cat-icon__img"><img src="${thumb(photo(c.img))}" alt="" loading="lazy" width="64" height="64"></span>`}
      <span class="cat-icon__label">${c.name}</span>
    </a>`).join('');
}

function renderFlashSale() {
  const cards = FLASH_SALE.map((id, index) => {
    const p = productById(id);
    return p ? renderProductCard(p, { compact: true, index, itemClass: 'reveal-item' }) : '';
  }).join('');

  $('#flash-sale').innerHTML = `
    <div class="flash__head">
      <h2 class="flash__title">${FLASH_TITLE}</h2>
      <div class="countdown" aria-label="Thời gian còn lại">
        <b class="countdown__unit countdown__unit--day"><span data-cd="d">0</span> ngày</b>
        <b class="countdown__unit" data-cd="h">00</b>
        <b class="countdown__unit" data-cd="m">00</b>
        <b class="countdown__unit" data-cd="s">00</b>
      </div>
      <a class="flash__more" href="category.html?sale=1">Xem tất cả${icon('chevron-right')}</a>
    </div>
    ${sliderHTML(cards)}`;
}

const HOME_SECTION_LIMIT = 12;

function productsFor(section, filter) {
  const inSection = section.rule ? CATEGORY_RULES[section.rule].match : (p) => p.cat === section.id;
  const usedOk = (p) => section.rule === 'used' || !p.tags.includes('used');
  // Trang chủ chỉ hiện 12 sản phẩm bán chạy nhất mỗi khối (xem hết ở "Xem tất cả") → trang nhẹ, mở nhanh
  return PRODUCTS.filter((p) => inSection(p) && usedOk(p) && (filter === 'all' || p.tags.includes(filter)))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, HOME_SECTION_LIMIT);
}

/* Khối sản phẩm vẽ dần: 2 khối đầu vẽ ngay, các khối sau là ô giữ chỗ → vẽ khi khách cuộn tới gần (nhẹ trang, mở nhanh) */
const HOME_EAGER_BLOCKS = 2;

function renderHomeSections() {
  let blocks = 0;
  $('#home-sections').innerHTML = HOME_SECTIONS.map((s, i) => {
    if (s.type !== 'banners' && ++blocks > HOME_EAGER_BLOCKS) {
      return `<section class="container section home-lazy" id="${s.id}" data-home-sec="${i}" aria-label="${s.title}"></section>`;
    }
    return homeSectionHTML(s);
  }).join('');
  initLazySections();
}

function initLazySections() {
  const holders = $$('[data-home-sec]');
  const fill = (el) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = homeSectionHTML(HOME_SECTIONS[Number(el.dataset.homeSec)]).trim();
    const section = tpl.content.firstElementChild;
    el.replaceWith(section);
    refreshIcons();
    initSliders(section);
    initReveal($("#home-sections"));
  };
  if (!('IntersectionObserver' in window)) { holders.forEach(fill); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    fill(e.target);
  }), { rootMargin: '800px 0px' });
  holders.forEach((el) => io.observe(el));
}

function homeSectionHTML(s) {
  {
    if (s.type === 'banners') {
      const { layout, items } = MID_BANNERS[s.key];
      const inner = layout === 'feature'
        ? `${renderPromo(items[0], 'feature')}<div class="banner-row__stack">${items.slice(1).map((b) => renderPromo(b, 'sm')).join('')}</div>`
        : items.map((b) => renderPromo(b)).join('');
      return `<section class="container section reveal" aria-label="Khuyến mãi"><div class="banner-row banner-row--${layout}">${inner}</div></section>`;
    }
    return `
      <section class="container section reveal" id="${s.id}" aria-labelledby="title-${s.id}">
        <div class="block">
          <div class="block-head">
            <h2 class="block-head__title" id="title-${s.id}"><a href="category.html?cat=${s.id}">${s.title}</a></h2>
            <span class="block-head__tag">${icon(s.tag.icon)}${s.tag.text}</span>
            <div class="block-head__right">
              <div class="tabs" role="tablist" aria-label="Lọc ${s.title}">
                ${s.tabs.map(([key, label], i) => `<button class="tabs__btn${i === 0 ? ' is-active' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-tab="${key}" data-section="${s.id}">${label}</button>`).join('')}
              </div>
              <a class="block-head__more" href="category.html?cat=${s.id}">Xem tất cả${icon('chevron-right')}</a>
            </div>
          </div>
          ${sliderHTML(productCardsHTML(productsFor(s, 'all')))}
        </div>
      </section>`;
  }
}

function renderNews() {
  const [featured, ...rest] = NEWS;
  const tile = (n, large = false) => `
    <a class="news-tile${large ? ' news-tile--lg' : ''}" href="article.html?id=${n.id}">
      <img class="news-tile__img" src="${photo(n.img)}" alt="" loading="lazy">
      <div class="news-tile__body">
        <span class="news-tile__tag">${n.tag}</span>
        <h3 class="news-tile__title">${n.title}</h3>
        ${large && n.excerpt ? `<p class="news-tile__excerpt">${n.excerpt}</p>` : ''}
        <p class="news-tile__meta">${icon('calendar')}${n.date}</p>
      </div>
      <span class="news-tile__go">${icon('arrow-up-right')}</span>
    </a>`;
  $('#news').innerHTML = `
    <div class="news__main">
      <h2 class="news__col-title">Tin tức nổi bật</h2>
      ${tile(featured, true)}
    </div>
    <div class="news__side">
      <h2 class="news__col-title">Bài viết mới</h2>
      <div class="news__stack">${rest.slice(0, 2).map((n) => tile(n)).join('')}</div>
    </div>`;
}

/* ---------- Hero slider ---------- */
function initHeroSlider() {
  const root = $('#hero-slider');
  const track = $('.hero-slider__track', root);
  const dots = $$('.hero-slider__dot', root);
  const total = dots.length;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer;

  const go = (i) => {
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, n) => {
      d.classList.toggle('is-active', n === index);
      d.setAttribute('aria-current', n === index ? 'true' : 'false');
    });
    [...track.children].forEach((slide, n) => {
      slide.setAttribute('aria-hidden', n === index ? 'false' : 'true');
      slide.tabIndex = n === index ? 0 : -1;
    });
    // Tải trước ảnh banner kế tiếp để khi trượt sang không bị trống
    const next = track.children[(index + 1) % total]?.querySelector('img');
    if (next) next.loading = 'eager';
  };
  const start = () => {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(() => go(index + 1), 5000);
  };
  const stop = () => clearInterval(timer);

  $('.hero-slider__btn--prev', root).addEventListener('click', () => { go(index - 1); start(); });
  $('.hero-slider__btn--next', root).addEventListener('click', () => { go(index + 1); start(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { go(i); start(); }));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // Vuốt trên mobile
  let startX = null;
  root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null;
    start();
  });

  go(0);
  start();
}

/* ---------- Countdown flash sale (đến FLASH_END, quá hạn thì đến hết ngày) ---------- */
function initCountdown() {
  let end = new Date(FLASH_END);
  if (Number.isNaN(end.getTime()) || end <= Date.now()) {
    end = new Date();
    end.setHours(23, 59, 59, 999);
  }
  const pad = (n) => String(n).padStart(2, '0');
  // Cập nhật mọi đồng hồ [data-cd] trên trang (Flash Sale + pop-up khuyến mãi)
  const tick = () => {
    const diff = Math.max(0, end - Date.now());
    const values = {
      d: Math.floor(diff / 8.64e7),
      h: pad(Math.floor((diff % 8.64e7) / 3.6e6)),
      m: pad(Math.floor((diff % 3.6e6) / 6e4)),
      s: pad(Math.floor((diff % 6e4) / 1000)),
    };
    $$('[data-cd]').forEach((el) => {
      el.textContent = values[el.dataset.cd];
    });
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Tabs lọc sản phẩm ---------- */
function initTabs() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (btn) {
      const section = HOME_SECTIONS.find((s) => s.id === btn.dataset.section);
      const block = btn.closest('.block');
      $$('[data-tab]', block).forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn);
      });
      const track = $('.slider__track', block);
      track.innerHTML = productCardsHTML(productsFor(section, btn.dataset.tab));
      track.scrollLeft = 0;
      refreshIcons();
      initSliders(block);
    }
  });
}

function initPage() {
  renderHero();
  renderCategoryIcons();
  renderFlashSale();
  renderHomeSections();
  renderNews();
  initHeroSlider();
  initCountdown();
  initTabs();
  initPromoPopup();
}

/* ---------- Pop-up khuyến mãi (cấu hình PROMO_POPUP trong data.js) ----------
   Thẻ chia đôi: ảnh thật + mã giảm giá dạng vé (bấm để sao chép/tự áp dụng) + đếm ngược.
   Mobile: ngăn trượt từ dưới lên. Mỗi khách thấy tối đa 1 lần/ngày. */
const POPUP_SEEN_KEY = 'mkpc-popup-seen';

function promoPopupHTML(cfg) {
  const coupon = SHOP.coupons[cfg.coupon];
  const stamp = coupon && (coupon.type === 'percent' ? `-${coupon.value}%` : `-${Math.round(coupon.value / 1000)}K`);
  return `
    <div class="promo-pop" id="promo-pop" role="dialog" aria-modal="true" aria-labelledby="promo-pop-title">
      <div class="promo-pop__backdrop" data-pop-close></div>
      <div class="promo-pop__card">
        <button class="promo-pop__close" type="button" data-pop-close aria-label="Đóng">${icon('x')}</button>
        <div class="promo-pop__media">
          <img src="${photo(cfg.img)}" alt="Góc máy tính gaming tại ${COMPANY.name}" width="400" height="600">
          ${stamp ? `<span class="promo-pop__stamp"><b>${stamp}</b><small>thêm</small></span>` : ''}
        </div>
        <div class="promo-pop__body">
          <span class="promo-pop__tag">${icon('zap')}${cfg.tag}</span>
          <h2 class="promo-pop__title" id="promo-pop-title">${cfg.title}</h2>
          <p class="promo-pop__desc">${cfg.desc}</p>
          ${coupon ? `
          <div class="promo-pop__ticket">
            <span class="promo-pop__code"><small>Mã giảm giá</small><b>${cfg.coupon}</b></span>
            <button class="promo-pop__copy" type="button" data-pop-copy>${icon('copy')}Sao chép</button>
          </div>` : ''}
          <div class="promo-pop__timer">
            <span>${icon('clock')}Kết thúc sau</span>
            <span class="promo-pop__clock"><b data-cd="d">0</b>ngày<b data-cd="h">00</b>:<b data-cd="m">00</b>:<b data-cd="s">00</b></span>
          </div>
          <ul class="promo-pop__perks">${cfg.perks.map((p) => `<li>${icon('circle-check')}${p}</li>`).join('')}</ul>
          <div class="promo-pop__actions">
            <a class="btn btn--primary btn--lg" href="${cfg.cta.href}" data-pop-apply>${cfg.cta.text}${icon('arrow-right')}</a>
            <button class="promo-pop__later" type="button" data-pop-close>Để sau</button>
          </div>
        </div>
      </div>
    </div>`;
}

function initPromoPopup() {
  const cfg = typeof PROMO_POPUP !== 'undefined' ? PROMO_POPUP : null;
  const today = new Date().toDateString();
  if (!cfg?.enabled || Store.get(POPUP_SEEN_KEY, '') === today) return;

  const open = () => {
    // Khách đang mở menu/drawer → đợi thêm
    if (document.body.classList.contains('is-locked')) {
      setTimeout(open, 2000);
      return;
    }
    Store.set(POPUP_SEEN_KEY, today);
    document.body.insertAdjacentHTML('beforeend', promoPopupHTML(cfg));
    const pop = $('#promo-pop');
    const lastFocus = document.activeElement;
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => pop.classList.add('is-open'));
    $('.promo-pop__close', pop).focus({ preventScroll: true });

    const applyCoupon = () => Store.set('mkpc-coupon', cfg.coupon); // giỏ hàng/thanh toán tự điền mã
    let onKey;
    const close = () => {
      pop.classList.remove('is-open');
      document.body.classList.remove('is-locked');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => pop.parentNode?.removeChild(pop), 300);
      lastFocus?.focus?.({ preventScroll: true });
    };
    // Esc để đóng; Tab chỉ chạy vòng trong pop-up
    onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key !== 'Tab') return;
      const items = $$('a[href], button', pop);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    pop.addEventListener('click', async (e) => {
      if (e.target.closest('[data-pop-close]')) {
        close();
        return;
      }
      if (e.target.closest('[data-pop-apply]')) {
        applyCoupon();
        return;
      }
      const copyBtn = e.target.closest('[data-pop-copy]');
      if (!copyBtn) return;
      applyCoupon();
      try {
        await navigator.clipboard.writeText(cfg.coupon);
      } catch {
        /* trình duyệt chặn clipboard — mã vẫn được tự áp dụng */
      }
      copyBtn.innerHTML = `${icon('check')}Đã lưu mã`;
      copyBtn.classList.add('is-done');
      showToast(`Đã lưu mã ${cfg.coupon} — tự áp dụng khi bạn vào giỏ hàng`);
    });
  };
  setTimeout(open, cfg.delay || 2500);
}
