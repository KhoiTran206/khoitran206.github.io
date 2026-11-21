/* ==========================================================
   Trang đăng nhập / đăng ký / quên mật khẩu
   login.html?tab=register | forgot  ·  &next=checkout.html
   ========================================================== */

const AUTH_TABS = ['login', 'register', 'forgot'];

/* Chỉ cho phép quay lại trang nội bộ (chống chuyển hướng ra site lạ) */
function nextUrl() {
  const next = params.get('next') || '';
  return /^[a-z0-9-]+\.html([?#][^\s]*)?$/i.test(next) && !next.startsWith('login.html') ? next : 'account.html';
}

function authField(name, label, { type = 'text', placeholder = '', autocomplete = '', hint = '' } = {}) {
  const isPassword = type === 'password';
  return `
    <div class="field">
      <label class="field__label" for="f-${name}">${label}</label>
      <div class="${isPassword ? 'password-field' : ''}">
        <input class="input" id="f-${name}" name="${name}" type="${type}" placeholder="${placeholder}" autocomplete="${autocomplete}">
        ${isPassword ? `<button class="password-field__toggle" type="button" data-toggle-password aria-label="Hiện mật khẩu">${icon('eye')}</button>` : ''}
      </div>
      ${hint ? `<span class="field__hint">${hint}</span>` : ''}
      <span class="field__error"></span>
    </div>`;
}

/* Nút "Tiếp tục với Google" (logo Google theo hướng dẫn thương hiệu của Google) */
function googleButton() {
  return `
    <button class="btn btn--google btn--lg btn--block" type="button" data-google>
      <svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
      Tiếp tục với Google
    </button>
    <p class="auth__or"><span>hoặc</span></p>`;
}

function loginForm() {
  return `
    <form class="auth__form" id="auth-login" novalidate>
      ${googleButton()}
      ${authField('email', 'Email', { type: 'email', placeholder: 'email@vidu.com', autocomplete: 'username' })}
      ${authField('password', 'Mật khẩu', { type: 'password', placeholder: 'Nhập mật khẩu', autocomplete: 'current-password' })}
      <div class="auth__row">
        <label class="check"><input type="checkbox" name="remember" checked>Ghi nhớ đăng nhập</label>
        <a class="auth__link" href="login.html?tab=forgot" data-tab="forgot">Quên mật khẩu?</a>
      </div>
      <p class="auth__error" role="alert" hidden></p>
      <button class="btn btn--primary btn--lg btn--block" type="submit">Đăng nhập</button>
      <p class="auth__switch">Bạn chưa có tài khoản? <a href="login.html?tab=register" data-tab="register">Đăng ký ngay</a></p>
    </form>`;
}

function registerForm() {
  return `
    <form class="auth__form" id="auth-register" novalidate>
      ${googleButton()}
      ${authField('name', 'Họ và tên', { placeholder: 'Nguyễn Văn A', autocomplete: 'name' })}
      <div class="form-grid form-grid--2">
        ${authField('phone', 'Số điện thoại', { type: 'tel', placeholder: '09xx xxx xxx', autocomplete: 'tel' })}
        ${authField('email', 'Email', { type: 'email', placeholder: 'email@vidu.com', autocomplete: 'email' })}
      </div>
      ${authField('password', 'Mật khẩu', { type: 'password', placeholder: 'Tối thiểu 6 ký tự', autocomplete: 'new-password' })}
      <div class="password-meter" aria-hidden="true"><span></span></div>
      ${authField('confirm', 'Nhập lại mật khẩu', { type: 'password', placeholder: 'Nhập lại mật khẩu', autocomplete: 'new-password' })}
      <div class="field">
        <label class="check"><input type="checkbox" name="agree"><span>Tôi đồng ý với <a href="policy.html?type=bao-mat" target="_blank" rel="noopener">chính sách bảo mật</a> của ${COMPANY.name}</span></label>
        <span class="field__error"></span>
      </div>
      <p class="auth__error" role="alert" hidden></p>
      <button class="btn btn--primary btn--lg btn--block" type="submit">Tạo tài khoản</button>
      <p class="auth__switch">Bạn đã có tài khoản? <a href="login.html" data-tab="login">Đăng nhập</a></p>
    </form>`;
}

function forgotForm() {
  return `
    <form class="auth__form" id="auth-forgot" novalidate>
      <p class="auth__desc">Nhập email đã đăng ký, chúng tôi sẽ gửi cho bạn đường link để đặt mật khẩu mới.</p>
      ${authField('email', 'Email đã đăng ký', { type: 'email', placeholder: 'email@vidu.com', autocomplete: 'email' })}
      <p class="auth__error" role="alert" hidden></p>
      <p class="alert alert--success auth__sent" role="status" hidden></p>
      <button class="btn btn--primary btn--lg btn--block" type="submit">Gửi link đặt lại mật khẩu</button>
      <p class="auth__switch">Không nhớ thông tin? Gọi <a href="tel:${COMPANY.phone}">${COMPANY.phoneDisplay}</a> để được hỗ trợ · <a href="login.html" data-tab="login">Quay lại đăng nhập</a></p>
    </form>`;
}

const AUTH_VIEWS = {
  login: { title: 'Đăng nhập', form: loginForm },
  register: { title: 'Đăng ký', form: registerForm },
  forgot: { title: 'Quên mật khẩu', form: forgotForm },
};

function renderAuth(tab) {
  const root = $('#login-page');
  const view = AUTH_VIEWS[tab];
  document.title = `${view.title} | ${COMPANY.name}`;
  root.innerHTML = `
    ${renderBreadcrumb([[view.title, '#']])}
    <div class="auth reveal">
      <aside class="auth__intro">
        <img src="${IMG}setup-2.jpg" alt="Góc máy tính gaming" width="600" height="800">
        <div class="auth__intro-body">
          ${renderLogo()}
          <h2>${COMPANY.slogan}</h2>
          <ul>
            <li>${icon('zap')}Đặt hàng nhanh, tự điền thông tin giao hàng</li>
            <li>${icon('package-search')}Theo dõi lịch sử và trạng thái đơn hàng</li>
            <li>${icon('shield-check')}Tra cứu bảo hành dễ dàng</li>
            <li>${icon('headphones')}Hỗ trợ ${COMPANY.phoneDisplay}</li>
          </ul>
        </div>
      </aside>
      <section class="auth__card panel">
        ${tab === 'forgot' ? `<h1 class="auth__title">Quên mật khẩu</h1>` : `
        <div class="auth__tabs" role="tablist">
          <a class="auth__tab${tab === 'login' ? ' is-active' : ''}" href="login.html" data-tab="login" role="tab" aria-selected="${tab === 'login'}">Đăng nhập</a>
          <a class="auth__tab${tab === 'register' ? ' is-active' : ''}" href="login.html?tab=register" data-tab="register" role="tab" aria-selected="${tab === 'register'}">Đăng ký</a>
        </div>`}
        ${view.form()}
        <p class="auth__note">${icon('info')}<span>Tài khoản được bảo mật bởi Google Firebase — đăng nhập được trên mọi thiết bị.</span></p>
      </section>
    </div>`;
  refreshIcons();
  initReveal(root);
  $('.auth__form input', root)?.focus({ preventScroll: true });
}

function switchTab(tab) {
  const url = new URL(location.href);
  if (tab === 'login') url.searchParams.delete('tab');
  else url.searchParams.set('tab', tab);
  history.replaceState(null, '', url);
  renderAuth(tab);
}

function showFormError(form, message) {
  const box = $('.auth__error', form);
  box.textContent = message;
  box.hidden = !message;
}

/* Kiểm tra mật khẩu; trả về true nếu hợp lệ */
function checkPasswords(form) {
  const pw = form.password.value;
  const okPw = pw.length >= 6;
  const okConfirm = okPw && form.confirm.value === pw;
  setFieldError(form.password, okPw ? '' : 'Mật khẩu tối thiểu 6 ký tự');
  setFieldError(form.confirm, okConfirm || !okPw ? '' : 'Mật khẩu nhập lại không khớp');
  return okPw && okConfirm;
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score += 1;
  if (pw.length >= 10) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

async function withLoading(form, task) {
  const btn = $('button[type="submit"]', form);
  btn.classList.add('is-loading');
  try {
    return await task();
  } finally {
    btn.classList.remove('is-loading');
  }
}

function afterAuth(message) {
  showToast(message);
  setTimeout(() => (location.href = nextUrl()), 700);
}

const AUTH_HANDLERS = {
  async 'auth-login'(form) {
    const email = form.email.value.trim();
    const okEmail = isValidEmail(email);
    setFieldError(form.email, okEmail ? '' : 'Vui lòng nhập email hợp lệ');
    setFieldError(form.password, form.password.value ? '' : 'Vui lòng nhập mật khẩu');
    if (!okEmail || !form.password.value) return;
    authBusy = true;
    const res = await withLoading(form, () => Auth.login(email, form.password.value, form.remember.checked));
    authBusy = false;
    if (!res.ok) return showFormError(form, res.message);
    afterAuth(`Xin chào, ${res.user.name}!`);
  },

  async 'auth-register'(form) {
    const data = { name: form.name.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim() };
    const okName = data.name.length >= 2;
    const okPhone = isValidPhone(data.phone);
    const okEmail = isValidEmail(data.email);
    setFieldError(form.name, okName ? '' : 'Vui lòng nhập họ tên');
    setFieldError(form.phone, okPhone ? '' : 'Số điện thoại không hợp lệ');
    setFieldError(form.email, okEmail ? '' : 'Email không hợp lệ');
    const okPw = checkPasswords(form);
    setFieldError(form.agree, form.agree.checked ? '' : 'Vui lòng đồng ý với chính sách bảo mật');
    if (!okName || !okPhone || !okEmail || !okPw || !form.agree.checked) return;
    authBusy = true;
    const res = await withLoading(form, () => Auth.register({ ...data, password: form.password.value }));
    authBusy = false;
    if (!res.ok) {
      if (res.field) setFieldError(form[res.field], res.message);
      return showFormError(form, res.message);
    }
    Store.remove(Profile.key); // hồ sơ khách vãng lai đã chuyển vào tài khoản
    afterAuth('Tạo tài khoản thành công! Kiểm tra email để xác minh tài khoản.');
  },

  async 'auth-forgot'(form) {
    const email = form.email.value.trim();
    const okEmail = isValidEmail(email);
    setFieldError(form.email, okEmail ? '' : 'Email không hợp lệ');
    if (!okEmail) return;
    const res = await withLoading(form, () => Auth.resetPassword(email));
    if (!res.ok) return showFormError(form, res.message);
    const sent = $('.auth__sent', form);
    sent.innerHTML = `Nếu <b>${esc(email)}</b> đã đăng ký, bạn sẽ nhận được email đặt lại mật khẩu trong vài phút. Nhớ kiểm tra cả hộp thư <b>Spam</b>.`;
    sent.hidden = false;
  },
};

let authBusy = false;

async function googleLogin(btn) {
  const form = btn.closest('form');
  showFormError(form, '');
  btn.classList.add('is-loading');
  authBusy = true;
  const res = await Auth.loginGoogle();
  authBusy = false;
  btn.classList.remove('is-loading');
  if (!res.ok) return res.message && showFormError(form, res.message);
  afterAuth(`Xin chào, ${res.user.name}!`);
}

function initPage() {
  if (Auth.current()) {
    location.replace(nextUrl());
    return;
  }
  // Kết nối Firebase sẵn; nếu đã đăng nhập (vd. quay về sau khi đăng nhập Google) → chuyển trang
  Auth.ready();
  document.addEventListener('auth:change', () => {
    if (Auth.current() && !authBusy) location.replace(nextUrl());
  });
  const root = $('#login-page');
  const tab = AUTH_TABS.includes(params.get('tab')) ? params.get('tab') : 'login';
  renderAuth(tab);

  root.addEventListener('click', (e) => {
    const tabLink = e.target.closest('[data-tab]');
    if (tabLink) {
      e.preventDefault();
      switchTab(tabLink.dataset.tab);
      return;
    }
    const google = e.target.closest('[data-google]');
    if (google) {
      googleLogin(google);
      return;
    }
    const eye = e.target.closest('[data-toggle-password]');
    if (eye) {
      const input = eye.previousElementSibling;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      eye.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu');
      eye.innerHTML = icon(show ? 'eye-off' : 'eye');
      refreshIcons();
    }
  });

  root.addEventListener('input', (e) => {
    const form = e.target.form;
    if (!form) return;
    showFormError(form, '');
    setFieldError(e.target, '');
    if (form.id === 'auth-register' && e.target.name === 'password') {
      const meter = $('.password-meter', form);
      meter.dataset.level = e.target.value ? passwordStrength(e.target.value) : '';
    }
  });

  root.addEventListener('submit', (e) => {
    const handler = AUTH_HANDLERS[e.target.id];
    if (!handler) return;
    e.preventDefault();
    handler(e.target);
  });
}
