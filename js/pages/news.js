/* ==========================================================
   Trang danh sách tin tức — tin-tuc?tag=
   ========================================================== */

function newsCard(n, i) {
  return `
    <a class="news-card reveal-item" style="--i:${i}" href="bai-viet?id=${n.id}">
      <span class="news-card__img"><img src="${photo(n.img)}" alt="" loading="lazy"><span class="news-tile__tag">${n.tag}</span></span>
      <span class="news-card__body">
        <h2 class="news-card__title">${n.title}</h2>
        <p class="news-card__excerpt">${n.excerpt}</p>
        <span class="news-card__meta">${icon('calendar')}${n.date}<span class="news-card__more">Đọc tiếp${icon('arrow-right')}</span></span>
      </span>
    </a>`;
}

function render(tag) {
  const tags = [...new Set(NEWS.map((n) => n.tag))];
  const list = tag ? NEWS.filter((n) => n.tag === tag) : NEWS;
  const [first, ...rest] = list;
  $('#news-page').innerHTML = `
    ${renderBreadcrumb([['Tin tức - Review', '#']])}
    <div class="news-page__head">
      <h1 class="page-title">Tin tức công nghệ</h1>
      <div class="tag-filter" role="tablist" aria-label="Lọc chủ đề">
        <button type="button" class="filter-chip${!tag ? ' is-active' : ''}" data-tag="">Tất cả</button>
        ${tags.map((t) => `<button type="button" class="filter-chip${tag === t ? ' is-active' : ''}" data-tag="${t}">${t}</button>`).join('')}
      </div>
    </div>
    ${first ? `
      <a class="news-feature reveal" href="bai-viet?id=${first.id}">
        <img src="${photo(first.img)}" alt="">
        <div class="news-feature__body">
          <span class="news-tile__tag">${first.tag}</span>
          <h2>${first.title}</h2>
          <p>${first.excerpt}</p>
          <span class="news-tile__meta">${icon('calendar')}${first.date}</span>
        </div>
      </a>` : ''}
    <div class="news-grid reveal">${rest.map(newsCard).join('')}</div>`;
  refreshIcons();
  initReveal($('#news-page'));
}

function initPage() {
  render(params.get('tag') || '');
  $('#news-page').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    const tag = btn.dataset.tag;
    history.replaceState(null, '', tag ? `tin-tuc?tag=${encodeURIComponent(tag)}` : 'tin-tuc');
    render(tag);
  });
}
