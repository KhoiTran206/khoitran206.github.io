/* ==========================================================
   Minh Khôi PC — Logic dùng chung cho mọi trang
   (giỏ hàng, đơn hàng, tìm kiếm, header/footer, slider, reveal...)
   Mỗi trang có thể khai báo hàm initPage() trong js/pages/*.js —
   hàm này được gọi sau khi header/footer đã render.
   ========================================================== */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const productById = (id) => PRODUCTS.find((p) => p.id === id);
const params = new URLSearchParams(location.search);

/* Chống chèn HTML khi hiển thị dữ liệu người dùng nhập */
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* Bỏ dấu tiếng Việt để tìm kiếm */
const normalize = (text) => String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').trim();

/* ---------- Lưu trữ trên trình duyệt (luôn bọc try/catch) ---------- */
const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* bỏ qua */
    }
  },
};

/* ---------- Giỏ hàng: { idSảnPhẩm: sốLượng } ---------- */
const Cart = {
  key: 'mkpc-cart',
  read() {
    const cart = Store.get(this.key, {});
    // Bỏ sản phẩm không còn tồn tại trong dữ liệu
    Object.keys(cart).forEach((id) => { if (!productById(id)) delete cart[id]; });
    return cart;
  },
  write(cart) {
    Store.set(this.key, cart);
    updateCartCount();
  },
  add(id, qty = 1) {
    const p = productById(id);
    if (!p) return { ok: false };
    const cart = this.read();
    const next = Math.min((cart[id] || 0) + qty, p.stock);
    const capped = next < (cart[id] || 0) + qty;
    cart[id] = next;
    this.write(cart);
    return { ok: true, capped, qty: next };
  },
  set(id, qty) {
    const p = productById(id);
    const cart = this.read();
    if (!p || qty <= 0) delete cart[id];
    else cart[id] = Math.min(qty, p.stock);
    this.write(cart);
  },
  remove(id) {
    this.set(id, 0);
  },
  clear() {
    this.write({});
  },
  count() {
    return Object.values(this.read()).reduce((sum, qty) => sum + qty, 0);
  },
  lines() {
    return Object.entries(this.read()).map(([id, qty]) => {
      const p = productById(id);
      return { p, qty, total: p.price * qty };
    });
  },
};

/* ---------- Mã giảm giá + phí giao hàng ---------- */
function checkCoupon(code, subtotal) {
  const key = String(code || '').trim().toUpperCase();
  if (!key) return { ok: false, discount: 0 };
  const c = SHOP.coupons[key];
  if (!c) return { ok: false, discount: 0, message: 'Mã giảm giá không tồn tại.' };
  if (subtotal < (c.minOrder || 0)) {
    return { ok: false, discount: 0, message: `Mã ${key} áp dụng cho đơn từ ${formatPrice(c.minOrder)}.` };
  }
  let discount = c.type === 'percent' ? Math.round((subtotal * c.value) / 100) : c.value;
  if (c.max) discount = Math.min(discount, c.max);
  return { ok: true, code: key, discount: Math.min(discount, subtotal), message: c.label };
}

function calcTotals(lines, couponCode, delivery = 'ship') {
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);
  const coupon = checkCoupon(couponCode, subtotal);
  const shipping = delivery === 'pickup' || subtotal === 0 || subtotal >= SHOP.freeShipFrom ? 0 : SHOP.shippingFee;
  const discount = coupon.ok ? coupon.discount : 0;
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount + shipping), coupon };
}

/* ---------- Firebase: tài khoản + dữ liệu trên mạng ----------
   SDK chỉ được tải khi cần (đã đăng nhập, hoặc trang đăng nhập/tài khoản/đặt hàng/quản trị)
   → khách vãng lai không phải tải thêm gì. */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Không tải được ${src}`));
    document.head.appendChild(s);
  });
}

const withTimeout = (promise, ms) => Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);

const Cloud = {
  _auth: null,
  _db: null,
  /* Tải firebase-app + firebase-auth (1 lần) → firebase.auth() */
  auth() {
    if (!this._auth) {
      this._auth = (async () => {
        if (!window.firebase?.auth) {
          if (!window.firebase) await loadScript(`${FIREBASE_SDK}firebase-app-compat.js`);
          await loadScript(`${FIREBASE_SDK}firebase-auth-compat.js`);
        }
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        const auth = firebase.auth();
        auth.languageCode = 'vi';
        return auth;
      })();
      this._auth.catch(() => (this._auth = null)); // lỗi mạng → lần sau thử lại
    }
    return this._auth;
  },
  /* Firestore nặng hơn → chỉ tải ở trang cần dữ liệu */
  async db() {
    await this.auth();
    if (!firebase.firestore) await loadScript(`${FIREBASE_SDK}firebase-firestore-compat.js`);
    if (!this._db) this._db = firebase.firestore();
    return this._db;
  },
};

/* ---------- Đơn hàng ----------
   Lưu 1 bản trên thiết bị (để khách vãng lai tra cứu) + 1 bản trên Firestore (khách đăng nhập
   xem trên mọi máy, chủ shop xem ở quan-tri). */
const ORDER_STATUSES = ['Chờ xác nhận', 'Đã xác nhận', 'Đang giao', 'Hoàn thành', 'Đã hủy'];

const Orders = {
  key: 'mkpc-orders',
  all() {
    return Store.get(this.key, []);
  },
  save(order) {
    const list = this.all().filter((o) => o.code !== order.code);
    list.unshift(order);
    Store.set(this.key, list.slice(0, 50));
  },
  find(code) {
    return this.all().find((o) => o.code.toUpperCase() === String(code).trim().toUpperCase());
  },
  async saveCloud(order) {
    try {
      const db = await Cloud.db();
      await withTimeout(db.collection('orders').doc(order.code).set(order), 8000);
      return true;
    } catch (e) {
      console.warn('Chưa lưu được đơn lên máy chủ:', e.message);
      return false;
    }
  },
  /* Đơn trên máy chủ (chỉ chủ đơn hoặc quản trị viên đọc được) */
  async fetch(code) {
    if (!Auth.current()) return null;
    try {
      const db = await Cloud.db();
      const snap = await db.collection('orders').doc(String(code).trim().toUpperCase()).get();
      return snap.exists ? snap.data() : null;
    } catch {
      return null;
    }
  },
  /* Theo dõi 1 đơn theo thời gian thực (chủ đơn / quản trị) → gọi onChange(order) mỗi khi đơn đổi.
     Trả về hàm hủy theo dõi. */
  async watch(code, onChange) {
    if (!Auth.current()) return () => {};
    try {
      const db = await Cloud.db();
      return db.collection('orders').doc(String(code).trim().toUpperCase()).onSnapshot(
        (snap) => snap.exists && onChange(snap.data()),
        () => {}, // không có quyền (đơn của người khác / khách vãng lai) → bỏ qua
      );
    } catch {
      return () => {};
    }
  },
  async markSent(code) {
    if (!Auth.current()) return;
    try {
      const db = await Cloud.db();
      await db.collection('orders').doc(code).update({ emailSent: true });
    } catch {
      /* không sao — email đã tới shop */
    }
  },
  /* Đơn của tài khoản đang đăng nhập: trên máy chủ + đơn trên thiết bị này chưa đồng bộ */
  async mine() {
    const user = Auth.current();
    if (!user) return [];
    const local = this.all().filter((o) => o.uid === user.uid);
    try {
      const db = await Cloud.db();
      const snap = await db.collection('orders').where('uid', '==', user.uid).get();
      const cloud = snap.docs.map((d) => d.data());
      const codes = new Set(cloud.map((o) => o.code));
      return [...cloud, ...local.filter((o) => !codes.has(o.code))].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (e) {
      console.warn('Không tải được đơn hàng:', e.message);
      return local;
    }
  },
};

/* ---------- Tài khoản khách hàng (Firebase Authentication) ----------
   Mật khẩu do Firebase (Google) quản lý — web không bao giờ thấy/lưu mật khẩu.
   Hồ sơ (SĐT, địa chỉ) lưu ở Firestore users/{uid}; bản sao nhẹ lưu localStorage
   'mkpc-user' để header hiện ngay tên khách khi mở trang. */
const AUTH_ERRORS = {
  'auth/email-already-in-use': 'Email này đã được đăng ký. Vui lòng đăng nhập.',
  'auth/invalid-email': 'Email không hợp lệ.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không đúng.',
  'auth/invalid-login-credentials': 'Email hoặc mật khẩu không đúng.',
  'auth/wrong-password': 'Mật khẩu không đúng.',
  'auth/user-not-found': 'Email hoặc mật khẩu không đúng.',
  'auth/user-disabled': 'Tài khoản này đã bị khóa. Vui lòng liên hệ cửa hàng.',
  'auth/weak-password': 'Mật khẩu quá yếu (tối thiểu 6 ký tự).',
  'auth/too-many-requests': 'Bạn thử quá nhiều lần. Vui lòng đợi vài phút rồi thử lại.',
  'auth/network-request-failed': 'Mất kết nối mạng. Vui lòng kiểm tra Internet và thử lại.',
  'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập Google.',
  'auth/cancelled-popup-request': 'Bạn đã đóng cửa sổ đăng nhập Google.',
  'auth/unauthorized-domain': 'Tên miền này chưa được phép đăng nhập Google (thêm vào Authorized domains trên Firebase).',
  'auth/operation-not-allowed': 'Hình thức đăng nhập này chưa được bật trên Firebase.',
  'auth/requires-recent-login': 'Vui lòng đăng xuất rồi đăng nhập lại để thực hiện thao tác này.',
  'auth/account-exists-with-different-credential': 'Email này đã đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email + mật khẩu.',
};
const authError = (e) => AUTH_ERRORS[e?.code] || (e?.message === 'timeout' || /Không tải được/.test(e?.message || '') ? AUTH_ERRORS['auth/network-request-failed'] : 'Có lỗi xảy ra, vui lòng thử lại.');

const Auth = {
  cacheKey: 'mkpc-user',
  _ready: null,

  /* Thông tin tài khoản đang đăng nhập (đọc tức thì từ bản sao trên máy) */
  current() {
    return Store.get(this.cacheKey, null);
  },
  isAdmin(user = this.current()) {
    return !!user && !!user.emailVerified && SHOP.adminEmails.includes(user.email);
  },
  setCache(data) {
    if (data) Store.set(this.cacheKey, data);
    else Store.remove(this.cacheKey);
    updateAccountLabel();
  },

  /* Đồng bộ bản sao từ tài khoản Firebase */
  sync(u) {
    if (!u) {
      if (this.current()) this.setCache(null);
      return null;
    }
    const prev = this.current();
    const p = prev?.uid === u.uid ? prev : {};
    this.setCache({
      uid: u.uid,
      email: u.email || '',
      emailVerified: !!u.emailVerified,
      provider: u.providerData?.[0]?.providerId || 'password',
      name: p.nameSet ? p.name : u.displayName || p.name || (u.email || 'Khách').split('@')[0],
      nameSet: !!p.nameSet,
      phone: p.phone || '',
      address: p.address || '',
      createdAt: p.createdAt || new Date(u.metadata?.creationTime || Date.now()).toISOString(),
    });
    return this.current();
  },

  /* Chờ Firebase xác định trạng thái đăng nhập (lần đầu gọi sẽ tải SDK) → user | null */
  ready() {
    if (!this._ready) {
      this._ready = Cloud.auth()
        .then((auth) => new Promise((resolve) => {
          let first = true;
          auth.onAuthStateChanged((u) => {
            this.sync(u);
            document.dispatchEvent(new CustomEvent('auth:change'));
            if (first) {
              first = false;
              resolve(this.current());
            }
          });
        }))
        .catch((e) => {
          console.warn('Không kết nối được Firebase:', e.message);
          this._ready = null;
          return this.current();
        });
    }
    return this._ready;
  },

  /* Hồ sơ trên Firestore: tải về (tạo mới nếu chưa có) */
  async loadProfile() {
    const user = this.current();
    if (!user) return null;
    try {
      const db = await Cloud.db();
      const snap = await db.collection('users').doc(user.uid).get();
      if (snap.exists) {
        const d = snap.data();
        this.setCache({ ...this.current(), name: d.name || user.name, nameSet: true, phone: d.phone || '', address: d.address || '' });
      } else {
        await this.saveProfile();
      }
    } catch (e) {
      console.warn('Không tải được hồ sơ:', e.message);
    }
    return this.current();
  },
  async saveProfile() {
    const u = this.current();
    if (!u) return;
    const db = await Cloud.db();
    await db.collection('users').doc(u.uid).set({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      address: u.address || '',
      provider: u.provider,
      createdAt: u.createdAt,
      updatedAt: new Date().toISOString(),
    });
  },

  async register({ name, email, phone, password }) {
    try {
      const auth = await Cloud.auth();
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const cred = await auth.createUserWithEmailAndPassword(email.trim(), password);
      await cred.user.updateProfile({ displayName: name.trim() });
      this.sync(cred.user);
      this.setCache({ ...this.current(), name: name.trim(), nameSet: true, phone: phone.trim() });
      cred.user.sendEmailVerification().catch(() => {});
      await this.saveProfile().catch((e) => console.warn('Chưa lưu được hồ sơ:', e.message));
      return { ok: true, user: this.current() };
    } catch (e) {
      const field = { 'auth/email-already-in-use': 'email', 'auth/invalid-email': 'email', 'auth/weak-password': 'password' }[e.code];
      return { ok: false, field, message: authError(e) };
    }
  },

  async login(email, password, remember = true) {
    try {
      const auth = await Cloud.auth();
      await auth.setPersistence(remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
      const cred = await auth.signInWithEmailAndPassword(email.trim(), password);
      this.sync(cred.user);
      await this.loadProfile();
      return { ok: true, user: this.current() };
    } catch (e) {
      return { ok: false, message: authError(e) };
    }
  },

  async loginGoogle() {
    try {
      const auth = await Cloud.auth();
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      let cred;
      try {
        cred = await auth.signInWithPopup(provider);
      } catch (e) {
        if (e.code !== 'auth/popup-blocked') throw e;
        await auth.signInWithRedirect(provider); // trình duyệt chặn popup → chuyển trang
        return { ok: false, message: '' };
      }
      this.sync(cred.user);
      await this.loadProfile();
      return { ok: true, user: this.current() };
    } catch (e) {
      return { ok: false, message: authError(e) };
    }
  },

  async logout() {
    try {
      const auth = await withTimeout(Cloud.auth(), 5000);
      await auth.signOut();
    } catch {
      /* vẫn xóa phiên trên máy */
    }
    this.setCache(null);
  },

  /* Cập nhật hồ sơ (họ tên, SĐT, địa chỉ) — đổi ngay trên máy, lưu lên máy chủ ở nền */
  async update(fields) {
    const user = this.current();
    if (!user) return { ok: false };
    const next = { ...user, nameSet: true };
    ['name', 'phone', 'address'].forEach((k) => {
      if (fields[k] !== undefined) next[k] = String(fields[k]).trim();
    });
    this.setCache(next);
    try {
      const auth = await Cloud.auth();
      if (auth.currentUser && next.name !== auth.currentUser.displayName) await auth.currentUser.updateProfile({ displayName: next.name });
      await withTimeout(this.saveProfile(), 8000);
      return { ok: true };
    } catch (e) {
      console.warn('Chưa lưu được hồ sơ lên máy chủ:', e.message);
      return { ok: false, message: 'Đã lưu trên máy này, chưa đồng bộ được lên máy chủ.' };
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const auth = await Cloud.auth();
      const u = auth.currentUser;
      if (!u) return { ok: false, message: 'Bạn chưa đăng nhập.' };
      await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email, oldPassword));
      await u.updatePassword(newPassword);
      return { ok: true };
    } catch (e) {
      const wrong = ['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(e.code);
      return { ok: false, field: wrong ? 'old' : 'password', message: wrong ? 'Mật khẩu hiện tại không đúng.' : authError(e) };
    }
  },

  /* Quên mật khẩu: Firebase gửi email chứa link đặt lại */
  async resetPassword(email) {
    try {
      const auth = await Cloud.auth();
      await auth.sendPasswordResetEmail(email.trim());
      return { ok: true };
    } catch (e) {
      if (e.code === 'auth/user-not-found') return { ok: true }; // không tiết lộ email có tồn tại hay không
      return { ok: false, message: authError(e) };
    }
  },

  async sendVerification() {
    try {
      const auth = await Cloud.auth();
      await auth.currentUser.sendEmailVerification();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: authError(e) };
    }
  },
  /* Sau khi khách bấm link xác minh trong email */
  async refresh() {
    try {
      const auth = await Cloud.auth();
      if (!auth.currentUser) return this.current();
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      return this.sync(auth.currentUser);
    } catch {
      return this.current();
    }
  },
};

/* Hồ sơ dùng để tự điền form: lấy từ tài khoản nếu đã đăng nhập, không thì lưu cho khách vãng lai */
const Profile = {
  key: 'mkpc-profile',
  get() {
    const user = Auth.current();
    if (user) return { name: user.name, phone: user.phone, email: user.email, address: user.address || '' };
    return Store.get(this.key, null);
  },
  set(data) {
    if (Auth.current()) Auth.update(data);
    else Store.set(this.key, data);
    updateAccountLabel();
  },
  clear() {
    Store.remove(this.key);
    updateAccountLabel();
  },
};

const Recent = {
  key: 'mkpc-recent',
  add(id) {
    const list = Store.get(this.key, []).filter((x) => x !== id);
    list.unshift(id);
    Store.set(this.key, list.slice(0, 12));
  },
  list(exclude) {
    return Store.get(this.key, []).filter((id) => id !== exclude).map(productById).filter(Boolean);
  },
};

/* ---------- Yêu thích & so sánh ---------- */
const Wishlist = {
  key: 'mkpc-wishlist',
  ids() {
    return Store.get(this.key, []).filter((id) => productById(id));
  },
  list() {
    return this.ids().map(productById);
  },
  has(id) {
    return this.ids().includes(id);
  },
  toggle(id) {
    const ids = this.ids();
    const added = !ids.includes(id);
    Store.set(this.key, added ? [id, ...ids] : ids.filter((x) => x !== id));
    return added;
  },
  clear() {
    Store.remove(this.key);
  },
};

/* So sánh tối đa 3 sản phẩm cùng loại (cat) */
const Compare = {
  key: 'mkpc-compare',
  max: 3,
  ids() {
    return Store.get(this.key, []).filter((id) => productById(id));
  },
  list() {
    return this.ids().map(productById);
  },
  has(id) {
    return this.ids().includes(id);
  },
  toggle(id) {
    const ids = this.ids();
    if (ids.includes(id)) {
      Store.set(this.key, ids.filter((x) => x !== id));
      return { ok: true, added: false };
    }
    const p = productById(id);
    const first = productById(ids[0]);
    if (first && first.cat !== p.cat) return { ok: false, message: `Chỉ so sánh được các sản phẩm cùng loại với "${first.name}".` };
    if (ids.length >= this.max) return { ok: false, message: `Chỉ so sánh tối đa ${this.max} sản phẩm cùng lúc.` };
    Store.set(this.key, [...ids, id]);
    return { ok: true, added: true };
  },
  remove(id) {
    Store.set(this.key, this.ids().filter((x) => x !== id));
  },
  clear() {
    Store.remove(this.key);
  },
};

/* Đồng bộ trạng thái nút tim / so sánh và số đếm trên toàn trang */
function syncWishCompare() {
  const wish = Wishlist.ids();
  const cmp = Compare.ids();
  $$('[data-wish-count]').forEach((el) => {
    el.textContent = wish.length;
    el.hidden = !wish.length;
  });
  $$('[data-wish]').forEach((btn) => {
    const on = wish.includes(btn.dataset.wish);
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  $$('[data-compare]').forEach((btn) => {
    const on = cmp.includes(btn.dataset.compare);
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', String(on));
  });
  renderCompareBar();
}

/* Thanh so sánh nổi ở đáy màn hình */
function renderCompareBar() {
  let bar = $('#compare-bar');
  const items = Compare.list();
  if (!items.length || $('#compare-page')) {
    bar?.remove();
    document.body.classList.remove('has-compare-bar');
    return;
  }
  if (!bar) {
    bar = document.createElement('aside');
    bar.id = 'compare-bar';
    bar.className = 'compare-bar';
    bar.setAttribute('aria-label', 'Sản phẩm đang so sánh');
    document.body.appendChild(bar);
  }
  const slots = Array.from({ length: Compare.max }, (_, i) => items[i]);
  bar.innerHTML = `
    <div class="container compare-bar__inner">
      <ul class="compare-bar__list">
        ${slots.map((p) => (p ? `
          <li class="compare-bar__item">
            <img src="${thumb(p.img)}" alt="" width="44" height="44">
            <span>${p.name}</span>
            <button type="button" data-compare-remove="${p.id}" aria-label="Bỏ ${p.name} khỏi so sánh">${icon('x')}</button>
          </li>` : `<li class="compare-bar__item compare-bar__item--empty">${icon('plus')}<span>Thêm sản phẩm</span></li>`)).join('')}
      </ul>
      <div class="compare-bar__actions">
        <a class="btn btn--primary" href="so-sanh">${icon('git-compare-arrows')}So sánh (${items.length})</a>
        <button class="btn btn--ghost" type="button" data-compare-clear>Xóa tất cả</button>
      </div>
    </div>`;
  document.body.classList.add('has-compare-bar');
  refreshIcons();
}

async function shareLink(title) {
  const url = location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
    } catch {
      /* người dùng hủy */
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    showToast('Đã sao chép liên kết');
  } catch {
    window.prompt('Sao chép liên kết:', url);
  }
}

function initWishCompare() {
  document.addEventListener('click', (e) => {
    const wishBtn = e.target.closest('[data-wish]');
    if (wishBtn) {
      e.preventDefault();
      const added = Wishlist.toggle(wishBtn.dataset.wish);
      showToast(added ? 'Đã thêm vào sản phẩm yêu thích' : 'Đã bỏ khỏi yêu thích');
      syncWishCompare();
      document.dispatchEvent(new CustomEvent('wishlist:change'));
      return;
    }
    const cmpBtn = e.target.closest('[data-compare]');
    if (cmpBtn) {
      e.preventDefault();
      const res = Compare.toggle(cmpBtn.dataset.compare);
      if (!res.ok) showToast(res.message, 'error');
      syncWishCompare();
      return;
    }
    const removeBtn = e.target.closest('[data-compare-remove]');
    if (removeBtn) {
      Compare.remove(removeBtn.dataset.compareRemove);
      syncWishCompare();
      return;
    }
    if (e.target.closest('[data-compare-clear]')) {
      Compare.clear();
      syncWishCompare();
      return;
    }
    const shareBtn = e.target.closest('[data-share]');
    if (shareBtn) shareLink(shareBtn.dataset.share || document.title);
  });
}

/* ---------- Danh mục + tìm kiếm ---------- */
const Catalog = {
  /* "Dưới 15 triệu", "15 - 20 triệu", "Trên 1 triệu", "500K - 1 triệu" → khoảng giá */
  parsePrice(query) {
    const q = normalize(query);
    const money = (num, unit) => parseFloat(String(num).replace(',', '.')) * (unit === 'k' ? 1e3 : 1e6);
    let m = q.match(/(\d+(?:[.,]\d+)?)\s*(k|trieu)?\s*-\s*(\d+(?:[.,]\d+)?)\s*(k|trieu)/);
    if (m) return { min: money(m[1], m[2] || m[4]), max: money(m[3], m[4]) };
    m = q.match(/duoi\s*(\d+(?:[.,]\d+)?)\s*(k|trieu)/);
    if (m) return { min: 0, max: money(m[1], m[2]) };
    m = q.match(/tren\s*(\d+(?:[.,]\d+)?)\s*(k|trieu)/);
    if (m) return { min: money(m[1], m[2]), max: Infinity };
    return null;
  },

  haystack(p) {
    const catName = CATEGORY_RULES[p.cat]?.name || '';
    return normalize([p.name, p.brand, catName, p.tags.join(' '), p.specs.map((s) => s[1]).join(' ')].join(' '));
  },

  search(query, list = PRODUCTS) {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return list;
    const scored = list.map((p) => {
      const hay = this.haystack(p);
      return { p, hits: tokens.filter((t) => hay.includes(t)).length };
    });
    const exact = scored.filter((s) => s.hits === tokens.length).map((s) => s.p);
    if (exact.length) return exact;
    // Không khớp hết từ khóa: trả về sản phẩm khớp nhiều từ nhất
    return scored.filter((s) => s.hits > 0).sort((a, b) => b.hits - a.hits).map((s) => s.p);
  },

  /* cond: 'new' | 'used' (khi tìm kiếm / xem tất cả); type: loại hàng cũ trong danh mục Hàng cũ (USED_TYPES) */
  filter({ cat, q, sale, cond = '', type = '', brands = [], min = 0, max = Infinity, sort = 'popular' } = {}) {
    let list = PRODUCTS.slice();
    if (cat && CATEGORY_RULES[cat]) list = list.filter(CATEGORY_RULES[cat].match);
    if (cat === 'used' && type) {
      const t = USED_TYPES.find(([id]) => id === type);
      if (t) list = list.filter(t[2]);
    }
    if (!cat && cond) list = list.filter(cond === 'used' ? isUsed : isNew);
    // Khuyến mãi = hàng mới đang giảm giá (giá gạch của hàng cũ là giá khi còn mới, không phải khuyến mãi)
    if (sale) list = list.filter((p) => p.oldPrice > p.price && (cat === 'used' || isNew(p)));
    let priceFromQuery = null;
    if (q) {
      priceFromQuery = this.parsePrice(q);
      if (!priceFromQuery) list = this.search(q, list);
    }
    const lo = Math.max(min, priceFromQuery?.min ?? 0);
    const hi = Math.min(max, priceFromQuery?.max ?? Infinity);
    list = list.filter((p) => p.price >= lo && p.price <= hi);
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    list = this.sort(list, sort);
    // Tìm kiếm chung, sắp xếp "Phổ biến": hàng mới xếp trước, hàng cũ xếp sau
    if (!cat && !cond && sort === 'popular') list = [...list.filter(isNew), ...list.filter(isUsed)];
    return list;
  },

  sort(list, sort) {
    const sorted = list.slice();
    const discount = (p) => discountPercent(p.price, p.oldPrice);
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'discount') sorted.sort((a, b) => discount(b) - discount(a));
    else if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    else sorted.sort((a, b) => b.reviews - a.reviews); // phổ biến
    return sorted;
  },
};

/* ---------- Gửi form về email chủ shop (FormSubmit) ----------
   Trả về { ok, needsActivation, message }. Không bao giờ throw. */
async function sendToShop(fields) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(SHOP.orderEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _template: 'table', _captcha: 'false', ...fields }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    const ok = res.ok && String(data.success) === 'true';
    const needsActivation = /activat/i.test(data.message || '');
    return { ok, needsActivation, message: data.message || '' };
  } catch (err) {
    return { ok: false, needsActivation: false, message: err.name === 'AbortError' ? 'Hết thời gian chờ' : 'Lỗi kết nối' };
  } finally {
    clearTimeout(timer);
  }
}

const DELIVERY_LABELS = { ship: 'Giao hàng tận nơi', pickup: 'Nhận tại cửa hàng' };
const PAYMENT_LABELS = { cod: 'Thanh toán khi nhận hàng (COD)', bank: 'Chuyển khoản ngân hàng', ewallet: 'Ví điện tử (MoMo, ZaloPay, VNPAY)', installment: 'Trả góp', store: 'Thanh toán tại cửa hàng' };

/* Gửi 1 đơn hàng về email, cập nhật trạng thái emailSent */
async function sendOrderEmail(order) {
  const items = order.items.map((i, n) => `${n + 1}. ${i.name} — SL: ${i.qty} × ${formatPrice(i.price)} = ${formatPrice(i.price * i.qty)}`).join('\n');
  const result = await sendToShop({
    _subject: `Đơn hàng mới ${order.code} - ${order.customer.name} - ${formatPrice(order.totals.total)}`,
    ...(order.customer.email ? { _replyto: order.customer.email } : {}),
    'Mã đơn hàng': order.code,
    'Thời gian đặt': new Date(order.createdAt).toLocaleString('vi-VN'),
    'Khách hàng': order.customer.name,
    'Số điện thoại': order.customer.phone,
    Email: order.customer.email || '(không có)',
    'Hình thức nhận': DELIVERY_LABELS[order.delivery],
    'Địa chỉ giao hàng': order.delivery === 'ship' ? order.customer.address : COMPANY.address,
    'Thanh toán': PAYMENT_LABELS[order.payment],
    'Sản phẩm': items,
    'Tạm tính': formatPrice(order.totals.subtotal),
    'Giảm giá': order.totals.discount ? `-${formatPrice(order.totals.discount)} (${order.totals.couponCode})` : '0đ',
    'Phí giao hàng': order.totals.shipping ? formatPrice(order.totals.shipping) : 'Miễn phí',
    'TỔNG THANH TOÁN': formatPrice(order.totals.total),
    'Ghi chú': order.note || '(không có)',
  });
  const list = Orders.all();
  const saved = list.find((o) => o.code === order.code);
  if (saved) {
    saved.emailSent = result.ok;
    Store.set(Orders.key, list);
  }
  return result;
}

const isValidPhone = (v) => /^(0|\+84)(3|5|7|8|9)\d{8}$/.test(String(v).replace(/[\s.-]/g, ''));
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

/* Đánh dấu lỗi cho một ô nhập */
function setFieldError(input, message) {
  const field = input.closest('.field');
  if (!field) return;
  field.classList.toggle('is-invalid', !!message);
  const err = $('.field__error', field);
  if (err) err.textContent = message || '';
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
}

/* ---------- UI nhỏ dùng chung ---------- */
function updateCartCount(bump = false) {
  $$('[data-cart-count]').forEach((el) => {
    el.textContent = Cart.count();
    if (el.classList.contains('tabbar__badge')) el.hidden = !Cart.count();
    if (bump) {
      el.classList.remove('is-bump');
      void el.offsetWidth; // chạy lại animation
      el.classList.add('is-bump');
    }
  });
}

/* Vẽ lại nút tài khoản trên header (Đăng nhập ↔ avatar + tên + menu) */
function updateAccountLabel() {
  $$('[data-account-slot]').forEach((el) => {
    el.innerHTML = renderAccountMenu(Auth.current());
  });
  refreshIcons();
}

function closeAccountMenu() {
  $$('[data-account-slot]').forEach((el) => {
    el.classList.remove('is-open');
    $('[data-account-toggle]', el)?.setAttribute('aria-expanded', 'false');
  });
}

function initAccountMenu() {
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-account-toggle]');
    if (toggle) {
      const slot = toggle.closest('[data-account-slot]');
      const open = !slot.classList.contains('is-open');
      closeAccountMenu();
      slot.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      return;
    }
    if (e.target.closest('[data-logout]')) {
      closeAccountMenu();
      Auth.logout().then(() => {
        showToast('Bạn đã đăng xuất');
        if ($('#account-page, #admin-page')) setTimeout(() => (location.href = 'dang-nhap'), 600);
      });
      return;
    }
    if (!e.target.closest('[data-account-slot]')) closeAccountMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAccountMenu();
  });
}

let toastTimer;
function showToast(message, type = 'success') {
  const toast = $('#toast');
  if (!toast) return;
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `${icon(type === 'error' ? 'circle-alert' : 'circle-check')}<span>${message}</span>`;
  refreshIcons();
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

/* Lucide chỉ thay các thẻ <i data-lucide> chưa được chuyển thành SVG */
/* icon() đã trả về SVG sẵn; chỉ còn vài <i data-lucide="..."> viết tay trong HTML cần đổi sang SVG */
function refreshIcons() {
  $$('i[data-lucide]').forEach((el) => {
    el.outerHTML = icon(el.dataset.lucide, el.getAttribute('class') || '');
  });
}

function sliderHTML(itemsHTML) {
  return `
    <div class="slider" data-slider>
      <button class="slider__btn slider__btn--prev" type="button" aria-label="Xem sản phẩm trước">${icon('chevron-left')}</button>
      <div class="slider__track">${itemsHTML}</div>
      <button class="slider__btn slider__btn--next" type="button" aria-label="Xem sản phẩm tiếp theo">${icon('chevron-right')}</button>
    </div>`;
}

function productCardsHTML(list, options = {}) {
  if (!list.length) return '<p class="slider__empty">Sản phẩm đang được cập nhật.</p>';
  return list.map((p, index) => renderProductCard(p, { index, itemClass: 'reveal-item', ...options })).join('');
}

/* ---------- Slider sản phẩm (scroll-snap + nút) ---------- */
function updateSliderButtons(slider) {
  const track = $('.slider__track', slider);
  const max = track.scrollWidth - track.clientWidth - 2;
  $('.slider__btn--prev', slider).disabled = track.scrollLeft <= 2;
  $('.slider__btn--next', slider).disabled = track.scrollLeft >= max;
}

/* Cập nhật nút của nhiều slider: đo hết trước rồi mới đổi nút → trình duyệt chỉ tính bố cục 1 lần */
function updateAllSliderButtons(sliders) {
  const states = sliders.map((slider) => {
    const track = $('.slider__track', slider);
    return [slider, track.scrollLeft <= 2, track.scrollLeft >= track.scrollWidth - track.clientWidth - 2];
  });
  states.forEach(([slider, atStart, atEnd]) => {
    $('.slider__btn--prev', slider).disabled = atStart;
    $('.slider__btn--next', slider).disabled = atEnd;
  });
}

function initSliders(root = document) {
  const sliders = $$('[data-slider]', root);
  sliders.forEach((slider) => {
    if (slider.dataset.ready) return;
    slider.dataset.ready = '1';
    const track = $('.slider__track', slider);
    $('.slider__btn--prev', slider).addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' }));
    $('.slider__btn--next', slider).addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior: 'smooth' }));
    track.addEventListener('scroll', () => updateSliderButtons(slider), { passive: true });
  });
  // Đợi trình duyệt vẽ xong khung đầu rồi mới đo (không chặn lúc dựng trang)
  requestAnimationFrame(() => updateAllSliderButtons(sliders));
}

/* ---------- Nút thêm giỏ / mua ngay (ủy quyền sự kiện) ---------- */
function addToCartWithFeedback(id, qty = 1) {
  const p = productById(id);
  const result = Cart.add(id, qty);
  if (!result.ok) return result;
  updateCartCount(true);
  if (result.capped) showToast(`Chỉ còn ${p.stock} sản phẩm “${esc(p.name)}” trong kho`, 'error');
  else showToast(`Đã thêm “${esc(p.name)}” vào giỏ hàng`);
  return result;
}

function initCartButtons() {
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('[data-add-cart]');
    if (addBtn) {
      addToCartWithFeedback(addBtn.dataset.addCart);
      return;
    }
    const buyBtn = e.target.closest('[data-buy-now]');
    if (buyBtn) {
      Cart.add(buyBtn.dataset.buyNow, Number(buyBtn.dataset.qty || 1));
      location.href = 'thanh-toan';
    }
  });
}

/* ---------- Tìm kiếm có gợi ý ---------- */
function initSearch() {
  const form = $('.search');
  const input = $('#search-input');
  const box = $('#search-suggest');
  if (!form || !input || !box) return;
  if (params.get('q') && /\/danh-muc(\.html)?$/.test(location.pathname)) input.value = params.get('q');
  let active = -1;

  const close = () => {
    box.classList.remove('is-open');
    active = -1;
  };
  const render = () => {
    const q = input.value.trim();
    if (q.length < 2) return close();
    // Hàng mới hiện trước, hàng cũ sau (có nhãn "Cũ")
    const found = Catalog.search(q);
    const results = [...found.filter(isNew), ...found.filter(isUsed)].slice(0, 6);
    box.innerHTML = results.length
      ? results.map((p) => `
          <a class="suggest__item" href="${productUrl(p)}" role="option">
            <img src="${thumb(p.img)}" alt="" width="44" height="44">
            <span class="suggest__name">${isUsed(p) ? '<em class="suggest__used">Cũ</em>' : ''}${p.name}</span>
            <b class="suggest__price">${formatPrice(p.price)}</b>
          </a>`).join('') + `<a class="suggest__all" href="danh-muc?q=${encodeURIComponent(q)}">Xem tất cả kết quả cho “${esc(q)}”${icon('arrow-right')}</a>`
      : `<p class="suggest__empty">Không tìm thấy sản phẩm phù hợp với “${esc(q)}”.</p>`;
    refreshIcons();
    box.classList.add('is-open');
    active = -1;
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('keydown', (e) => {
    const items = $$('.suggest__item, .suggest__all', box);
    if (!box.classList.contains('is-open') || !items.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((el, i) => el.classList.toggle('is-active', i === active));
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault();
      items[active].click();
    } else if (e.key === 'Escape') {
      close();
    }
  });
  document.addEventListener('click', (e) => {
    if (!form.contains(e.target)) close();
  });
  form.addEventListener('submit', (e) => {
    if (!input.value.trim()) {
      e.preventDefault();
      input.focus();
    }
  });
}

/* ---------- Drawer (menu mobile) ---------- */
function initDrawer() {
  const drawer = $('#drawer');
  if (!drawer) return;
  let lastFocus = null;
  const open = () => {
    lastFocus = document.activeElement;
    // Dựng danh sách danh mục lần đầu mở menu (không làm nặng lúc tải trang)
    const body = $('[data-drawer-body]', drawer);
    if (body && !body.childElementCount) body.innerHTML = drawerBodyHTML();
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    $('[data-drawer-close].header-icon-btn', drawer).focus();
  };
  const close = () => {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus();
  };
  $$('[data-drawer-open]').forEach((b) => b.addEventListener('click', open));
  $$('[data-drawer-close]', drawer).forEach((b) => b.addEventListener('click', close));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
}

/* ---------- Nút "Danh mục" ở sub-nav ---------- */
function initCategoryDropdown() {
  const wrap = $('[data-cat-wrap]');
  if (!wrap) return;
  const btn = $('[data-cat-toggle]', wrap);
  const isDesktop = () => window.matchMedia('(min-width: 1025px)').matches;
  // Mega menu (~1.200 phần tử) chỉ dựng khi khách rê chuột / bấm / tab vào "Danh mục" lần đầu
  const fillMenu = () => {
    const dd = $('#cat-dropdown', wrap);
    if (dd && !dd.childElementCount) dd.innerHTML = renderCategoryMenu();
  };
  wrap.addEventListener('pointerenter', fillMenu);
  wrap.addEventListener('focusin', fillMenu);
  const setOpen = (open) => {
    if (open) fillMenu();
    wrap.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open);
  };
  btn.addEventListener('click', () => {
    if (!isDesktop()) {
      $('[data-drawer-open]').click();
      return;
    }
    setOpen(!wrap.classList.contains('is-open'));
  });
  wrap.addEventListener('mouseenter', () => isDesktop() && setOpen(true));
  wrap.addEventListener('mouseleave', () => setOpen(false));
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ---------- Top bar: đổi thông báo luân phiên ---------- */
function initTopbar() {
  const msg = $('[data-topbar-msg]');
  if (!msg || PROMO_MESSAGES.length < 2) return;
  let i = 0;
  setInterval(() => {
    msg.classList.add('is-out');
    setTimeout(() => {
      i = (i + 1) % PROMO_MESSAGES.length;
      msg.textContent = PROMO_MESSAGES[i].text;
      msg.classList.remove('is-out');
    }, 300);
  }, 4000);
}

/* ---------- Scroll: header shadow + nút lên đầu trang ---------- */
function initScrollUI() {
  const header = $('#site-header');
  const backTop = $('[data-back-top]');
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('is-scrolled', y > 40);
    backTop?.classList.toggle('is-visible', y > 600);
    // Vòng tròn quanh nút lên đầu trang chạy theo phần trăm đã cuộn
    const max = document.documentElement.scrollHeight - window.innerHeight;
    backTop?.style.setProperty('--progress', max > 0 ? Math.min(100, (y / max) * 100).toFixed(1) : 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0 }));
  onScroll();
  initAssist();
}

/* ---------- Trợ lý nổi (Khôi Bot): bấm mở bảng liên hệ nhanh; lời chào hiện 1 lần mỗi phiên ---------- */
function initAssist() {
  const toggle = $('[data-assist-toggle]');
  const panel = $('#assist-panel');
  const tip = $('[data-assist-tip]');
  if (!toggle || !panel) return;
  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.classList.toggle('is-open', open);
    if (open && tip) tip.hidden = true;
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  $('[data-assist-close]', panel).addEventListener('click', () => { setOpen(false); toggle.focus(); });
  document.addEventListener('click', (e) => { if (!panel.hidden && !e.target.closest('.assist')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); } });
  // Lời chào nhỏ cạnh robot: hiện sau 5 giây, tự ẩn sau 6 giây, mỗi phiên 1 lần
  let greeted = false;
  try { greeted = sessionStorage.getItem('mkpc-assist-hi') === '1'; sessionStorage.setItem('mkpc-assist-hi', '1'); } catch { greeted = true; }
  if (tip && !greeted) {
    setTimeout(() => { if (panel.hidden) tip.hidden = false; }, 5000);
    setTimeout(() => { tip.hidden = true; }, 11000);
    tip.addEventListener('click', () => setOpen(true));
  }
}

/* ---------- Animation khi scroll ---------- */
let revealObserver;
function initReveal(root = document) {
  const items = $$('.reveal:not(.reveal--visible)', root);
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('reveal--visible'));
    return;
  }
  // Bắt đầu hiện sớm (khi còn cách mép dưới màn hình 15%) để không thấy khoảng trống lúc cuộn nhanh;
  // khối đã cuộn qua (nằm phía trên, vd. trình duyệt khôi phục vị trí cuộn) thì hiện luôn.
  revealObserver ||= new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting && entry.boundingClientRect.bottom > 0) return;
      entry.target.classList.add('reveal--visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px 15% 0px' });
  items.forEach((el) => revealObserver.observe(el));
}

/* ---------- Cài app Minh Khôi PC (PWA — cài từ website, miễn phí) ----------
   Mọi nút có [data-install] đều mở luồng cài:
   - Android / Chrome / Edge: hộp cài đặt của trình duyệt (beforeinstallprompt)
   - iPhone / iPad hoặc trình duyệt không hỗ trợ: bảng hướng dẫn từng bước
   Đã cài (mở bằng icon) → html.is-app, mọi nút cài tự ẩn. */
const InstallApp = {
  bannerKey: 'mkpc-app-banner',
  prompt: null,
  isStandalone: () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true,
  isIOS: () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
  isMobile: () => /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent) || InstallApp.isIOS(),
};

function installStepsHTML() {
  if (InstallApp.isIOS()) {
    const safari = /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);
    return `
      <ol class="app-guide__steps">
        <li><b>1</b><span>Bấm nút <strong>Chia sẻ</strong> ${icon('share')} ${safari ? 'ở thanh dưới cùng của Safari' : 'trên thanh địa chỉ'}</span></li>
        <li><b>2</b><span>Kéo xuống, chọn <strong>Thêm vào MH chính</strong> ${icon('square-plus')}</span></li>
        <li><b>3</b><span>Bấm <strong>Thêm</strong> — icon Minh Khôi PC sẽ nằm trên màn hình chính</span></li>
      </ol>
      ${safari ? '' : `<p class="app-guide__note">${icon('info')}Nếu không thấy mục "Thêm vào MH chính", hãy mở trang này bằng <strong>Safari</strong>.</p>`}`;
  }
  if (InstallApp.isMobile()) {
    return `
      <ol class="app-guide__steps">
        <li><b>1</b><span>Bấm nút <strong>menu</strong> ${icon('ellipsis-vertical')} ở góc trên trình duyệt</span></li>
        <li><b>2</b><span>Chọn <strong>Cài đặt ứng dụng</strong> hoặc <strong>Thêm vào màn hình chính</strong></span></li>
        <li><b>3</b><span>Bấm <strong>Cài đặt</strong> — icon Minh Khôi PC sẽ nằm trên màn hình chính</span></li>
      </ol>`;
  }
  return `
    <ol class="app-guide__steps">
      <li><b>1</b><span>Mở trang bằng <strong>Chrome</strong> hoặc <strong>Edge</strong></span></li>
      <li><b>2</b><span>Bấm biểu tượng <strong>Cài đặt</strong> ${icon('monitor-down')} ở cuối thanh địa chỉ (hoặc menu ${icon('ellipsis-vertical')} → <strong>Cài đặt Minh Khôi PC</strong>)</span></li>
      <li><b>3</b><span>Hoặc dùng điện thoại: quét/mở <strong>${location.host}</strong> và cài từ trình duyệt</span></li>
    </ol>`;
}

function openInstallGuide() {
  if ($('#app-guide')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div class="app-guide" id="app-guide" role="dialog" aria-modal="true" aria-labelledby="app-guide-title">
      <div class="app-guide__backdrop" data-guide-close></div>
      <div class="app-guide__card">
        <button class="app-guide__close" type="button" data-guide-close aria-label="Đóng">${icon('x')}</button>
        <div class="app-guide__head">
          <img src="assets/icons/icon-192.png" alt="" width="64" height="64">
          <div>
            <h2 class="app-guide__title" id="app-guide-title">Cài app ${COMPANY.name}</h2>
            <p>Miễn phí · Mở nhanh từ màn hình chính · Không tốn dung lượng</p>
          </div>
        </div>
        ${installStepsHTML()}
        <button class="btn btn--primary btn--lg btn--block" type="button" data-guide-close>Đã hiểu</button>
      </div>
    </div>`);
  const guide = $('#app-guide');
  const lastFocus = document.activeElement;
  document.body.classList.add('is-locked');
  requestAnimationFrame(() => guide.classList.add('is-open'));
  $('.app-guide__close', guide).focus({ preventScroll: true });
  const close = () => {
    guide.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => guide.parentNode?.removeChild(guide), 300);
    lastFocus?.focus?.({ preventScroll: true });
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };
  document.addEventListener('keydown', onKey);
  guide.addEventListener('click', (e) => {
    if (e.target.closest('[data-guide-close]')) close();
  });
}

function hideInstallEntries() {
  document.documentElement.classList.add('is-app');
  $('[data-app-banner]')?.classList.add('is-hidden');
}

async function installApp() {
  // iPhone không có hộp cài tự động → luôn hiện hướng dẫn
  if (InstallApp.prompt && !InstallApp.isIOS()) {
    try {
      InstallApp.prompt.prompt();
      const { outcome } = await InstallApp.prompt.userChoice;
      InstallApp.prompt = null;
      if (outcome === 'accepted') hideInstallEntries();
      return;
    } catch {
      InstallApp.prompt = null; // hộp cài bị trình duyệt chặn → dùng hướng dẫn
    }
  }
  openInstallGuide();
}

function initInstallApp() {
  // Bộ nhớ đệm + trang offline (chỉ chạy trên https / localhost)
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(() => {}));
  }
  if (InstallApp.isStandalone()) {
    hideInstallEntries();
    return;
  }
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    InstallApp.prompt = e;
  });
  window.addEventListener('appinstalled', () => {
    hideInstallEntries();
    showToast(`Đã cài app ${COMPANY.name} — mở từ màn hình chính nhé!`);
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-install]')) {
      e.preventDefault();
      installApp();
    }
    if (e.target.closest('[data-app-banner-close]')) {
      Store.set(InstallApp.bannerKey, Date.now());
      $('[data-app-banner]')?.classList.add('is-hidden');
    }
  });

  // Dải gợi ý cài app trên điện thoại (ẩn 7 ngày sau khi bấm ✕)
  const hiddenAt = Number(Store.get(InstallApp.bannerKey, 0)) || 0;
  if (InstallApp.isMobile() && Date.now() - hiddenAt > 7 * 864e5) {
    const banner = `
      <div class="app-banner" data-app-banner>
        <button class="app-banner__close" type="button" data-app-banner-close aria-label="Ẩn gợi ý cài app">${icon('x')}</button>
        <img class="app-banner__icon" src="assets/icons/icon-192.png" alt="" width="40" height="40">
        <span class="app-banner__text"><b>App ${COMPANY.name}</b><small>Miễn phí · Mở nhanh từ màn hình chính</small></span>
        <button class="app-banner__btn" type="button" data-install>Cài app</button>
      </div>`;
    const skip = $('.skip-link');
    if (skip) skip.insertAdjacentHTML('afterend', banner);
    else document.body.insertAdjacentHTML('afterbegin', banner);
  }
}

/* Mega menu: điền sản phẩm bán chạy khi khách mở danh mục lần đầu */
function initMegaFeatured() {
  const fill = (e) => {
    const item = e.target.closest?.('[data-mega-cat]');
    if (!item || item.dataset.filled) return;
    item.dataset.filled = '1';
    const slot = $('[data-mega-featured]', item);
    if (slot) slot.innerHTML = megaFeaturedHTML(item.dataset.megaCat);
  };
  document.addEventListener('mouseover', fill);
  document.addEventListener('focusin', fill);
}

/* ---------- Giao diện app (html.is-app — gắn sẵn bởi đoạn script trong <head>) ----------
   Trang chủ: header gọn + phím tắt; trang con: thanh tiêu đề (quay lại · tên trang · tìm kiếm).
   Thanh tab dưới đáy (ẩn ở trang chi tiết SP và thanh toán để nhường chỗ nút mua). */
const isAppMode = () => document.documentElement.classList.contains('is-app');

function initAppShell() {
  if (!isAppMode()) return;
  const page = window.PRODUCT_ID ? 'san-pham' : (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  const isHome = page === 'index';
  const params = new URLSearchParams(location.search);
  const tab = isHome ? 'home'
    : page === 'danh-muc' && params.get('sale') ? 'sale'
    : page === 'gio-hang' ? 'cart'
    : ['tai-khoan', 'dang-nhap', 'quan-tri'].includes(page) ? 'account' : '';
  const hideTabs = ['san-pham', 'thanh-toan'].includes(page);

  document.body.classList.add('app-shell', hideTabs ? 'app-shell--notab' : 'app-shell--tab');
  document.body.insertAdjacentHTML('beforeend', (hideTabs ? '' : renderTabBar(tab)) + renderAppCats());

  const header = $('#site-header');
  if (header && isHome) {
    $('#flash')?.insertAdjacentHTML('beforebegin', renderAppShortcuts());
  } else if (header) {
    const title = page === 'san-pham' ? 'Chi tiết sản phẩm' : document.title.split('|')[0].trim();
    header.classList.add('appbar');
    $('.site-header__inner', header).insertAdjacentHTML('afterbegin', renderAppBarControls(title));
    $('[data-app-back]', header).addEventListener('click', () => {
      if (document.referrer.startsWith(location.origin) && history.length > 1) history.back();
      else location.href = HOME_URL;
    });
    $('[data-app-search]', header).addEventListener('click', (e) => {
      const open = header.classList.toggle('is-search-open');
      e.currentTarget.setAttribute('aria-expanded', String(open));
      if (open) $('#search-input')?.focus();
    });
  }
  initAppCats(tab);
  refreshIcons();
  updateCartCount();
}

function initAppCats(activeTab) {
  const screen = $('#app-cats');
  if (!screen) return;
  const pane = $('[data-cats-pane]', screen);
  const show = (id) => {
    $$('[data-cats-tab]', screen).forEach((b) => {
      const on = b.dataset.catsTab === id;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
    });
    pane.innerHTML = appCatsPaneHTML(id);
    pane.scrollTop = 0;
    refreshIcons();
  };
  const setTab = (id) => $$('.tabbar__item').forEach((t) => t.classList.toggle('is-active', t.dataset.appTab === id));
  const open = (push = true) => {
    if (!screen.hidden) return;
    if (!pane.innerHTML) show(CATEGORIES[0].id);
    screen.hidden = false;
    document.body.classList.add('is-locked');
    setTab('cats');
    if (push) history.pushState({ appCats: true }, '');
  };
  const close = (fromHistory) => {
    if (screen.hidden) return;
    screen.hidden = true;
    document.body.classList.remove('is-locked');
    setTab(activeTab);
    if (!fromHistory && history.state?.appCats) history.back();
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cats-open]')) { e.preventDefault(); screen.hidden ? open() : close(); }
    else if (e.target.closest('[data-cats-close]')) close();
    const t = e.target.closest('[data-cats-tab]');
    if (t) show(t.dataset.catsTab);
  });
  // Nút quay lại của điện thoại đóng màn hình Danh mục thay vì rời trang
  window.addEventListener('popstate', () => close(true));
  // Quay lại từ trang khác khi Danh mục đang mở → mở lại đúng như lúc rời
  if (history.state?.appCats) open(false);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---------- Khởi động ---------- */
/* Đường dẫn đẹp không đuôi .html (vd: tin-tuc, san-pham?id=) — GitHub Pages tự hiểu.
   Khi mở file trực tiếp trên máy (file://) thì gắn lại .html lúc bấm link để vẫn chạy được. */
if (location.protocol === 'file:') {
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href]');
    const href = a?.getAttribute('href') || '';
    if (/^[a-z0-9-]+(\/[a-z0-9-]+)?([?#]|$)/i.test(href)) a.setAttribute('href', href.replace(/^([a-z0-9-]+(\/[a-z0-9-]+)?)/i, '$1.html'));
  }, true);
}
/* Trang sản phẩm san-pham/<slug> dùng <base href="/"> → link "#muc" phải giữ nguyên trang hiện tại */
if (document.querySelector('base')) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) a.setAttribute('href', location.pathname + location.search + a.getAttribute('href'));
  }, true);
}

document.addEventListener('DOMContentLoaded', () => {
  const headerSlot = $('#site-header-slot');
  const footerSlot = $('#site-footer-slot');
  if (headerSlot) headerSlot.outerHTML = renderHeader();
  if (footerSlot) footerSlot.outerHTML = renderFooter() + renderDrawer();

  if (typeof initPage === 'function') initPage();

  refreshIcons();
  updateCartCount();
  updateAccountLabel();

  initTopbar();
  initAccountMenu();
  initInstallApp();
  initAppShell();
  // Đã đăng nhập → kết nối Firebase ở nền để kiểm tra phiên còn hiệu lực
  if (Auth.current()) Auth.ready();
  // Dọn dữ liệu tài khoản kiểu cũ (lưu trên trình duyệt) — nay dùng Firebase
  Store.remove('mkpc-users');
  Store.remove('mkpc-session');
  initWishCompare();
  syncWishCompare();
  initCategoryDropdown();
  initMegaFeatured();
  initSearch();
  initSliders();
  initCartButtons();
  initDrawer();
  initScrollUI();
  initReveal();

  window.addEventListener('resize', () => updateAllSliderButtons($$('[data-slider]')));
});
