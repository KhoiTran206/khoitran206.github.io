// Tạo trang tĩnh cho từng sản phẩm: san-pham/<slug>.html → đường dẫn đẹp /san-pham/<slug>
// Mỗi trang là bản sao san-pham.html với tiêu đề, mô tả, ảnh chia sẻ (Facebook/Zalo) riêng của sản phẩm.
// Chạy lại SAU KHI: thêm/sửa/đổi tên sản phẩm, sửa san-pham.html, hoặc đổi số ?v= phiên bản:
//   node tools/build-product-pages.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const BASE = 'https://khoitran206.github.io/';
const OUT = path.join(ROOT, 'san-pham');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

const ctx = { location: { protocol: 'https:' }, console };
vm.createContext(ctx);
vm.runInContext(`${read('js/data.js')}\nthis.__d = { PRODUCTS, COMPANY };`, ctx);
const { PRODUCTS, COMPANY } = ctx.__d;

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const price = (n) => `${new Intl.NumberFormat('vi-VN').format(n)}đ`;
const template = read('san-pham.html').replace(/\r\n/g, '\n');

function page(p) {
  const title = attr(`${p.name} | ${COMPANY.name}`);
  const desc = attr(`${p.name} giá ${price(p.price)} — ${p.tags.includes('used') ? 'hàng cũ đã kiểm tra' : 'chính hãng'}, bảo hành ${p.warranty} tháng tại ${COMPANY.name}.`);
  const url = `${BASE}san-pham/${p.slug}`;
  // og:image dùng bản JPG gốc (Facebook/Zalo đọc JPG ổn định hơn WebP)
  const image = BASE + p.img.replace(/\.webp$/i, '.jpg');
  const set = (html, re, value) => {
    if (!re.test(html)) throw new Error(`Không tìm thấy ${re} trong san-pham.html`);
    return html.replace(re, value);
  };
  let html = template;
  // Trang nằm trong thư mục con → mọi đường dẫn tương đối tính từ gốc web (file:// trên máy thì lùi 1 cấp)
  html = set(html, /<meta charset="UTF-8">/, `<meta charset="UTF-8">\n  <base href="/"><script>if(location.protocol==='file:')document.querySelector('base').href='../';</script>`);
  html = set(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = set(html, /<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
  html = set(html, /<meta property="og:type" content="[^"]*">/, `<link rel="canonical" href="${url}">\n  <meta property="og:type" content="product">\n  <meta property="og:url" content="${url}">`);
  html = set(html, /<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`);
  html = set(html, /<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${desc}">`);
  html = set(html, /<meta property="og:image" content="[^"]*">\n\s*<meta property="og:image:width" content="1200">\n\s*<meta property="og:image:height" content="630">/, `<meta property="og:image" content="${image}">\n  <meta property="og:image:alt" content="${attr(p.name)}">`);
  html = set(html, /<meta name="twitter:card" content="[^"]*">/, `<meta name="twitter:card" content="summary_large_image">\n  <meta property="product:price:amount" content="${p.price}">\n  <meta property="product:price:currency" content="VND">`);
  html = set(html, /(\s*)<script src="js\/icons\.js/, `$1<script>window.PRODUCT_ID = '${p.id}';</script>$1<script src="js/icons.js`);
  return html.replace(/\n/g, '\r\n');
}

// Xóa trang cũ (sản phẩm đã đổi tên/gỡ) rồi tạo lại toàn bộ
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
let bytes = 0;
for (const p of PRODUCTS) {
  const html = page(p);
  bytes += Buffer.byteLength(html);
  fs.writeFileSync(path.join(OUT, `${p.slug}.html`), html);
}
// /san-pham/ (không có tên sản phẩm) → về trang san-pham.html giữ ?id= của link cũ
fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="vi"><head><meta charset="UTF-8"><meta name="robots" content="noindex">
<title>Chi tiết sản phẩm | ${COMPANY.name}</title>
<script>location.replace((location.protocol === 'file:' ? '../san-pham.html' : '/san-pham.html') + location.search + location.hash);</script>
</head><body><a href="../san-pham.html">Xem sản phẩm</a></body></html>
`.replace(/\n/g, '\r\n'));
console.log(`san-pham/: ${PRODUCTS.length} trang (${(bytes / 1048576).toFixed(1)}MB)`);
