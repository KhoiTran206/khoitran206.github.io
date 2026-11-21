// Tạo js/icons.js: chỉ chứa các icon Lucide mà website dùng (thay cho ~190KB tải từ CDN).
// Chạy lại mỗi khi dùng icon mới:   node tools/build-icons.mjs
// Script tự quét mọi chuỗi 'ten-icon' trong js/ và data-lucide="..." trong *.html.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const VERSION = '0.460.0';
const src = await (await fetch(`https://unpkg.com/lucide@${VERSION}/dist/umd/lucide.min.js`)).text();
const ctx = {};
ctx.self = ctx;
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const ICONS = ctx.lucide.icons;
const pascal = (n) => n.replace(/(^|-)(\w)/g, (m, d, c) => c.toUpperCase());

const files = [
  ...fs.readdirSync(path.join(ROOT, 'js')).filter((f) => f.endsWith('.js') && f !== 'icons.js').map((f) => path.join(ROOT, 'js', f)),
  ...fs.readdirSync(path.join(ROOT, 'js/pages')).map((f) => path.join(ROOT, 'js/pages', f)),
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.html')).map((f) => path.join(ROOT, f)),
];
const names = new Set();
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/['"`]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)['"`]/g)) if (ICONS[pascal(m[1])]) names.add(m[1]);
}

const attrs = (a) => Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ');
const out = [...names].sort().map((n) => {
  const [, , children] = ICONS[pascal(n)];
  return `  '${n}': '${children.map(([tag, a]) => `<${tag} ${attrs(a)}/>`).join('')}',`;
});

fs.writeFileSync(path.join(ROOT, 'js/icons.js'), `/* Icon Lucide v${VERSION} (ISC License — https://lucide.dev) — chỉ các icon website dùng.
   FILE TỰ SINH bởi tools/build-icons.mjs — đừng sửa tay; dùng icon mới thì chạy lại script. */
const LUCIDE_ICONS = {
${out.join('\n')}
};
`);
console.log(`js/icons.js: ${names.size} icon, ${Math.round(fs.statSync(path.join(ROOT, 'js/icons.js')).size / 1024)}KB`);
