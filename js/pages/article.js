/* ==========================================================
   Trang bài viết — article.html?id=
   ========================================================== */

function initPage() {
  const root = $('#article-page');
  const article = NEWS.find((n) => n.id === params.get('id'));
  if (!article) {
    root.innerHTML = `${renderBreadcrumb([['Tin tức', 'news.html'], ['Không tìm thấy', '#']])}<div class="panel">${renderEmpty('file-x', 'Không tìm thấy bài viết', 'Bài viết có thể đã bị gỡ hoặc đường dẫn không đúng.', '<a class="btn btn--primary" href="news.html">Xem tin tức khác</a>')}</div>`;
    return;
  }
  document.title = `${article.title} | ${COMPANY.name}`;
  $('meta[name="description"]').setAttribute('content', article.excerpt);

  const others = NEWS.filter((n) => n.id !== article.id).slice(0, 4);
  const featured = PRODUCTS.filter((p) => p.label === 'Bán chạy').slice(0, 8);
  const url = encodeURIComponent(location.href);

  root.innerHTML = `
    ${renderBreadcrumb([['Tin tức', 'news.html'], [article.tag, `news.html?tag=${encodeURIComponent(article.tag)}`], [article.title, '#']])}
    <div class="article-layout">
      <article class="panel article">
        <span class="news-tile__tag article__tag">${article.tag}</span>
        <h1 class="article__title">${article.title}</h1>
        <p class="article__meta">${icon('calendar')}${article.date}<span>·</span>${icon('user-round')}${COMPANY.name}</p>
        <img class="article__cover" src="${IMG}${article.img}" alt="${article.title}">
        <p class="article__lead">${article.excerpt}</p>
        <div class="prose">${renderRichText(article.body)}</div>
        <div class="article__share">
          <span>Chia sẻ:</span>
          <a class="share-btn" href="https://www.facebook.com/sharer/sharer.php?u=${url}" target="_blank" rel="noopener" aria-label="Chia sẻ Facebook">${icon('facebook')}</a>
          <button class="share-btn" type="button" data-copy-link aria-label="Sao chép liên kết">${icon('link')}</button>
        </div>
      </article>
      <aside class="article-aside">
        <section class="panel">
          <h2 class="panel__title">${icon('newspaper')}Bài viết khác</h2>
          <ul class="side-news">
            ${others.map((n) => `
              <li><a href="article.html?id=${n.id}">
                <img src="${IMG}${n.img}" alt="" width="88" height="66" loading="lazy">
                <span><b>${n.title}</b><small>${n.date}</small></span>
              </a></li>`).join('')}
          </ul>
        </section>
        <section class="panel cta-box">
          <h2>Cần tư vấn cấu hình?</h2>
          <p>Gọi ngay để được kỹ thuật viên hỗ trợ miễn phí.</p>
          <a class="btn btn--primary btn--block" href="tel:${COMPANY.phone}">${icon('phone')}${COMPANY.phoneDisplay}</a>
          <a class="btn btn--outline btn--block" href="build-pc.html">${icon('wrench')}Tự build PC</a>
        </section>
      </aside>
    </div>
    <section class="section block reveal">
      <div class="block-head"><h2 class="block-head__title">Sản phẩm bán chạy</h2><a class="block-head__more" href="category.html?sale=1">Xem tất cả${icon('chevron-right')}</a></div>
      ${sliderHTML(productCardsHTML(featured, { compact: true }))}
    </section>`;

  root.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-copy-link]')) return;
    try {
      await navigator.clipboard.writeText(location.href);
      showToast('Đã sao chép liên kết bài viết');
    } catch {
      window.prompt('Sao chép liên kết:', location.href);
    }
  });
}
