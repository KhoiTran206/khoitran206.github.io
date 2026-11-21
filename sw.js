/* ==========================================================
   Service worker — app Minh Khôi PC (cài từ website)
   - Trang HTML: lấy mạng trước (luôn mới nhất), mất mạng → bản đã lưu hoặc offline.html
   - CSS/JS/ảnh cùng tên miền: dùng bản đã lưu cho nhanh, cập nhật ngầm
   - Không đụng tới Firebase, FormSubmit, Google Fonts (tên miền khác)
   Đổi VERSION khi muốn xóa sạch bộ nhớ đệm cũ của mọi khách.
   ========================================================== */
const VERSION = 'mkpc-v2';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = 'offline.html';
const PRECACHE = [OFFLINE_URL, 'assets/icons/icon-192.png', 'assets/logo/logo-mark.svg'];
const STATIC_EXT = /\.(css|js|png|jpe?g|webp|svg|ico|webmanifest)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/* Lưu file tĩnh; bỏ bản cũ cùng đường dẫn nhưng khác ?v= để bộ nhớ không phình ra */
async function putStatic(cache, request, response) {
  const url = new URL(request.url);
  if (url.search) {
    const old = await cache.keys();
    await Promise.all(old.filter((r) => {
      const u = new URL(r.url);
      return u.pathname === url.pathname && u.search !== url.search;
    }).map((r) => cache.delete(r)));
  }
  await cache.put(request, response);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Trang HTML: mạng trước, luôn hỏi lại máy chủ (bỏ qua bộ đệm 10 phút của GitHub Pages)
  // → khách thấy bản cập nhật ngay; không đổi thì máy chủ chỉ trả 304 rất nhẹ
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request.url, { cache: 'no-cache', credentials: 'same-origin', redirect: 'follow' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => (await caches.match(request)) || caches.match(OFFLINE_URL)),
    );
    return;
  }

  // File tĩnh: bản đã lưu trước, cập nhật ngầm
  if (STATIC_EXT.test(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) putStatic(cache, request, response.clone());
            return response;
          })
          .catch(() => cached);
        if (cached) {
          event.waitUntil(network);
          return cached;
        }
        return network;
      }),
    );
  }
});
