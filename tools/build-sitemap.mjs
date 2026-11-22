// Tạo lại sitemap.xml từ dữ liệu sản phẩm / tin tức / chính sách.
// Chạy sau khi thêm sản phẩm, bài viết hoặc danh mục:   node tools/build-sitemap.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const BASE = 'https://khoitran206.github.io/';
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

const ctx = { location: { protocol: 'https:' }, console };
vm.createContext(ctx);
vm.runInContext(`${read('js/data.js')}\n${read('js/content.js')}\nthis.__d = { PRODUCTS, NEWS, POLICIES, CATEGORY_RULES };`, ctx);
const { PRODUCTS, NEWS, POLICIES, CATEGORY_RULES } = ctx.__d;

const today = new Date().toISOString().slice(0, 10);
const urls = [
  [BASE, '1.0', 'daily'],
  ...['danh-muc', 'xay-dung-cau-hinh', 'thu-cu-doi-moi', 'tin-tuc', 'lien-he'].map((f) => [BASE + f, '0.8', 'weekly']),
  ...Object.keys(CATEGORY_RULES).map((k) => [`${BASE}danh-muc?cat=${k}`, '0.8', 'daily']),
  ...PRODUCTS.map((p) => [`${BASE}san-pham?id=${p.id}`, '0.7', 'weekly']),
  ...NEWS.map((n) => [`${BASE}bai-viet?id=${n.id}`, '0.5', 'monthly']),
  ...Object.keys(POLICIES).map((k) => [`${BASE}chinh-sach?type=${k}`, '0.3', 'yearly']),
];

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, pr, cf]) => `  <url><loc>${loc.replace(/&/g, '&amp;')}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);
console.log(`sitemap.xml: ${urls.length} URL (${PRODUCTS.length} sản phẩm)`);
