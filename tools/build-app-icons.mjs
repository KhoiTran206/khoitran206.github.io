// Tạo favicon.ico, assets/logo/logo-mark.svg và icon app (assets/icons) từ hình logo M (con chip). Cần Microsoft Edge.
// Đổi logo: sửa M bên dưới + LOGO_MARK trong js/components.js, rồi chạy:  node tools/build-app-icons.mjs
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path, { join } from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const M = 'M18 14h28a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z M21 42V22h5l6 8 6-8h5v20h-5V30.5l-6 7.5-6-7.5V42z M21 7h3v7h-3z M21 50h3v7h-3z M7 21h7v3H7z M50 21h7v3h-7z M30.5 7h3v7h-3z M30.5 50h3v7h-3z M7 30.5h7v3H7z M50 30.5h7v3h-7z M40 7h3v7h-3z M40 50h3v7h-3z M7 40h7v3H7z M50 40h7v3h-7z';
const RED = '#E30019';
// rounded: icon thường (bo góc sẵn); full: nền tràn (iOS / maskable tự bo); scale: cỡ chữ M trong ô
const svg = (kind) => {
  const bg = kind === 'rounded' ? `<rect width="64" height="64" rx="14" fill="${RED}"/>` : `<rect width="64" height="64" fill="${RED}"/>`;
  const s = kind === 'maskable' ? 0.68 : kind === 'full' ? 0.78 : 0.84;
  const t = +(32 - 32 * s).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${bg}<path transform="translate(${t} ${t}) scale(${s})" fill-rule="evenodd" d="${M}" fill="#fff"/></svg>`;
};

const targets = [
  ['assets/icons/icon-192.png', 192, 'rounded'],
  ['assets/icons/icon-512.png', 512, 'rounded'],
  ['assets/icons/icon-maskable-192.png', 192, 'maskable'],
  ['assets/icons/icon-maskable-512.png', 512, 'maskable'],
  ['assets/icons/apple-touch-icon.png', 180, 'full'],
  ['ico16', 16, 'rounded'], ['ico32', 32, 'rounded'], ['ico48', 48, 'rounded'],
];

const chrome = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9800 + Math.floor(Math.random() * 100);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'ico-'))}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) { try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl; } catch {} if (!wsUrl) await sleep(200); }
const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable');
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });

const pngs = {};
for (const [out, size, kind] of targets) {
  await send('Emulation.setDeviceMetricsOverride', { width: size, height: size, deviceScaleFactor: 1, mobile: false });
  const html = `<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml,${encodeURIComponent(svg(kind))}" width="${size}" height="${size}" style="display:block"></body></html>`;
  await send('Page.navigate', { url: 'data:text/html,' + encodeURIComponent(html) });
  await sleep(400);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: size, height: size, scale: 1 } });
  const buf = Buffer.from(shot.result.data, 'base64');
  if (out.startsWith('ico')) pngs[size] = buf; else writeFileSync(join(ROOT, out), buf);
  console.log(out, size, buf.length);
}

// favicon.ico chứa 3 ảnh PNG 16/32/48
const list = [16, 32, 48].map((s) => [s, pngs[s]]);
const head = Buffer.alloc(6 + 16 * list.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(list.length, 4);
let off = head.length;
list.forEach(([s, b], i) => {
  const o = 6 + i * 16;
  head.writeUInt8(s, o); head.writeUInt8(s, o + 1); head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3);
  head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6); head.writeUInt32LE(b.length, o + 8); head.writeUInt32LE(off, o + 12);
  off += b.length;
});
writeFileSync(join(ROOT, 'favicon.ico'), Buffer.concat([head, ...list.map(([, b]) => b)]));
writeFileSync(join(ROOT, 'assets/logo/logo-mark.svg'), svg('rounded').replace('><rect', '>\n<rect').replace('/><path', '/>\n<path').replace('</svg>', '\n</svg>\n'));
console.log('favicon.ico + logo-mark.svg done');
ws.close(); proc.kill(); process.exit(0);
