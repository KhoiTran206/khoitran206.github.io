/* ==========================================================
   Trang chính sách / thông tin — policy.html?type=
   ========================================================== */

function initPage() {
  const type = POLICIES[params.get('type')] ? params.get('type') : 'gioi-thieu';
  const policy = POLICIES[type];
  document.title = `${policy.title} | ${COMPANY.name}`;

  $('#policy-page').innerHTML = `
    ${renderBreadcrumb([['Chính sách', 'policy.html'], [policy.title, '#']])}
    <div class="policy-layout">
      <aside class="panel policy-nav">
        <h2 class="panel__title">${icon('book-open')}Thông tin & chính sách</h2>
        <ul>
          ${POLICY_NAV.map((key) => `<li><a href="policy.html?type=${key}" class="${key === type ? 'is-active' : ''}">${POLICIES[key].title}${icon('chevron-right')}</a></li>`).join('')}
        </ul>
      </aside>
      <article class="panel">
        <h1 class="page-title">${policy.title}</h1>
        <div class="prose">${renderRichText(policy.body)}</div>
        <div class="alert alert--info policy-help">${icon('headset')}<span>Cần hỗ trợ thêm? Gọi <a href="tel:${COMPANY.phone}"><b>${COMPANY.phoneDisplay}</b></a> hoặc email <a href="mailto:${COMPANY.email}"><b>${COMPANY.email}</b></a>.</span></div>
      </article>
    </div>`;
}
