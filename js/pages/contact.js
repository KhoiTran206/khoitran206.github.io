/* ==========================================================
   Trang liên hệ — thông tin cửa hàng, bản đồ, form liên hệ
   ========================================================== */

function initPage() {
  const root = $('#contact-page');
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(COMPANY.address)}&z=16&output=embed`;
  const profile = Profile.get() || {};

  root.innerHTML = `
    ${renderBreadcrumb([['Liên hệ', '#']])}
    <h1 class="page-title">Liên hệ ${COMPANY.name}</h1>
    <div class="contact-cards">
      <a class="contact-card" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}" target="_blank" rel="noopener">
        <span class="contact-card__icon">${icon('map-pin')}</span>
        <span><b>Địa chỉ cửa hàng</b><small>${COMPANY.address}</small></span>
      </a>
      <a class="contact-card" href="tel:${COMPANY.phone}">
        <span class="contact-card__icon">${icon('phone-call')}</span>
        <span><b>Hotline mua hàng & bảo hành</b><small>${COMPANY.phoneDisplay}</small></span>
      </a>
      <a class="contact-card" href="mailto:${COMPANY.email}">
        <span class="contact-card__icon">${icon('mail')}</span>
        <span><b>Email</b><small>${COMPANY.email}</small></span>
      </a>
      <a class="contact-card" href="${COMPANY.socials.facebook}" target="_blank" rel="noopener">
        <span class="contact-card__icon">${icon('facebook')}</span>
        <span><b>Facebook</b><small>Theo dõi khuyến mãi mới nhất</small></span>
      </a>
    </div>

    <div class="contact-layout">
      <section class="panel">
        <h2 class="panel__title">${icon('send')}Gửi tin nhắn cho chúng tôi</h2>
        <form class="form-grid form-grid--2" id="contact-form" novalidate>
          <div class="field"><label class="field__label" for="c-name">Họ và tên <b>*</b></label><input class="input" id="c-name" name="name" value="${esc(profile.name || '')}" autocomplete="name"><span class="field__error"></span></div>
          <div class="field"><label class="field__label" for="c-phone">Số điện thoại <b>*</b></label><input class="input" id="c-phone" name="phone" type="tel" value="${esc(profile.phone || '')}" autocomplete="tel"><span class="field__error"></span></div>
          <div class="field field--full"><label class="field__label" for="c-email">Email</label><input class="input" id="c-email" name="email" type="email" value="${esc(profile.email || '')}" autocomplete="email"><span class="field__error"></span></div>
          <div class="field field--full">
            <label class="field__label" for="c-topic">Bạn cần hỗ trợ</label>
            <select class="select" id="c-topic" name="topic">
              <option>Tư vấn mua hàng</option><option>Tư vấn build PC</option><option>Bảo hành - sửa chữa</option><option>Thu cũ đổi mới</option><option>Hợp tác - khác</option>
            </select>
          </div>
          <div class="field field--full"><label class="field__label" for="c-message">Nội dung <b>*</b></label><textarea class="textarea" id="c-message" name="message" maxlength="1000" placeholder="Bạn cần tư vấn sản phẩm nào, ngân sách bao nhiêu..."></textarea><span class="field__error"></span></div>
          <div class="field--full"><button class="btn btn--primary btn--lg" type="submit" id="contact-submit">${icon('send')}Gửi liên hệ</button></div>
        </form>
        <div id="contact-result"></div>
      </section>
      <section class="panel contact-map">
        <h2 class="panel__title">${icon('map')}Bản đồ đường đi</h2>
        <iframe src="${mapSrc}" title="Bản đồ ${COMPANY.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
      </section>
    </div>`;

  const form = $('#contact-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    setFieldError(form.name, data.name.trim().length >= 2 ? '' : 'Vui lòng nhập họ tên');
    setFieldError(form.phone, isValidPhone(data.phone) ? '' : 'Số điện thoại không hợp lệ');
    setFieldError(form.email, !data.email || isValidEmail(data.email) ? '' : 'Email không hợp lệ');
    setFieldError(form.message, data.message.trim().length >= 5 ? '' : 'Vui lòng nhập nội dung (tối thiểu 5 ký tự)');
    if ($('.field.is-invalid', form)) return;

    const btn = $('#contact-submit');
    btn.classList.add('is-loading');
    btn.textContent = 'Đang gửi...';
    const result = await sendToShop({
      _subject: `Liên hệ từ website: ${data.topic} - ${data.name}`,
      ...(data.email ? { _replyto: data.email } : {}),
      'Họ tên': data.name,
      'Số điện thoại': data.phone,
      Email: data.email || '(không có)',
      'Chủ đề': data.topic,
      'Nội dung': data.message,
    });
    btn.classList.remove('is-loading');
    btn.innerHTML = `${icon('send')}Gửi liên hệ`;
    $('#contact-result').innerHTML = result.ok
      ? `<div class="alert alert--success">${icon('circle-check')}<span>Cảm ơn bạn! ${COMPANY.name} đã nhận được tin nhắn và sẽ liên hệ lại sớm nhất.</span></div>`
      : `<div class="alert alert--info">${icon('triangle-alert')}<span>Chưa gửi được tin nhắn (${esc(result.message || 'lỗi kết nối')}). Vui lòng gọi <a href="tel:${COMPANY.phone}"><b>${COMPANY.phoneDisplay}</b></a> hoặc nhắn Zalo.</span></div>`;
    if (result.ok) form.reset();
    refreshIcons();
  });
}
