// Tạo ảnh WebP cho web từ ảnh JPG (cần Microsoft Edge). Chạy sau khi thêm ảnh mới vào assets/images/photos (+ thumb/):
//   node tools/build-webp.mjs   → photos/*.webp (rộng tối đa 960px) và photos/thumb/*.webp (400px)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const DIR = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '../assets/images/photos');
const jobs = [
  ...fs.readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f)).map((f) => [path.join(DIR, f), 960, 0.72]),
  ...fs.readdirSync(path.join(DIR, 'thumb')).filter((f) => /\.jpe?g$/i.test(f)).map((f) => [path.join(DIR, 'thumb', f), 400, 0.72]),
];
const chrome = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const port = 9950 + Math.floor(Math.random() * 40);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${fs.mkdtempSync(path.join(tmpdir(), 'wp-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) { try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl; } catch {} if (!wsUrl) await sleep(200); }
const ws = new WebSocket(wsUrl); await new Promise((r) => ws.addEventListener('open', r));
let seq = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });

let before = 0, after = 0;
for (const [file, maxW, quality] of jobs) {
  const data = 'data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64');
  const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `new Promise((res) => { const img = new Image(); img.onload = () => {
    const s = Math.min(1, ${maxW} / img.naturalWidth); const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
    res(c.toDataURL('image/webp', ${quality})); }; img.onerror = () => res(''); img.src = ${JSON.stringify(data)}; })` });
  const url = r.result?.result?.value || '';
  if (!url.startsWith('data:image/webp')) { console.log('LỖI', file); continue; }
  const out = file.replace(/\.jpe?g$/i, '.webp');
  const buf = Buffer.from(url.split(',')[1], 'base64');
  fs.writeFileSync(out, buf);
  before += fs.statSync(file).size; after += buf.length;
}
console.log(`${jobs.length} ảnh: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB (giảm ${Math.round((1 - after / before) * 100)}%)`);
ws.close(); proc.kill(); process.exit(0);
