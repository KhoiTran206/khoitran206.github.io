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
  // Banner đầu trang hiển thị ngay, không lazy
  $$('#hero-slider img, #hero-side img').forEach((img) => img.removeAttribute('loading'));
}

function renderCategoryIcons() {
  $('#cat-icons').innerHTML = QUICK_CATS.map((c, i) => `
    <a class="cat-icon reveal-item" style="--i:${i}" href="${c.href}">
      ${c.special
        ? `<span class="cat-icon__img cat-icon__img--special">${icon('flame')}<b>BLACK<br>FRIDAY</b></span>`
        : `<span class="cat-icon__img"><img src="${thumb(IMG + c.img)}" alt="" loading="lazy" width="64" height="64"></span>`}
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

function productsFor(section, filter) {
  return PRODUCTS.filter((p) => p.cat === section.id && (filter === 'all' || p.tags.includes(filter)));
}

function renderHomeSections() {
  $('#home-sections').innerHTML = HOME_SECTIONS.map((s) => {
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
  }).join('');
}

function renderNews() {
  const [featured, ...rest] = NEWS;
  const tile = (n, large = false) => `
    <a class="news-tile${large ? ' news-tile--lg' : ''}" href="article.html?id=${n.id}">
      <img class="news-tile__img" src="${IMG}${n.img}" alt="" loading="lazy">
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
  const units = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const diff = Math.max(0, end - Date.now());
    units.d.textContent = Math.floor(diff / 8.64e7);
    units.h.textContent = pad(Math.floor((diff % 8.64e7) / 3.6e6));
    units.m.textContent = pad(Math.floor((diff % 3.6e6) / 6e4));
    units.s.textContent = pad(Math.floor((diff % 6e4) / 1000));
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
}
