// Gera as imagens de marca em /public a partir de HTML (usa o Chrome instalado na máquina).
//   og.png               1200x630  (prévia ao compartilhar o link no WhatsApp, LinkedIn etc.)
//   apple-touch-icon.png  180x180  (ícone ao salvar o site na tela inicial do celular)
//   logo.png              512x512  (logo para o Google / dados estruturados)
// Uso: npm run images   (defina CHROME_PATH se o Chrome estiver em outro local)
// TODO: quando o cliente enviar o logo original, trocar o SVG abaixo pelo vetor oficial e rodar de novo.
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Fontes embutidas em base64 (a página é gerada em memória, sem acesso a arquivos locais).
const font = (pkg, file) =>
  'data:font/woff2;base64,' + readFileSync(path.join(root, 'node_modules/@fontsource-variable', pkg, 'files', file)).toString('base64');
const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function compass(tone = 'light') {
  const c = tone === 'light'
    ? { a: '#ffffff', b: '#c7d8ee', d: '#6f9bd1', ring: 'rgba(255,255,255,.45)', dot: '#c7d8ee', center: '#0f2341' }
    : { a: '#4a78b0', b: '#0f2341', d: '#18345c', ring: '#a9b0ba', dot: '#18345c', center: '#ffffff' };
  const diag = [45, 135, 225, 315];
  const main = [0, 90, 180, 270];
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="${c.ring}">
      <circle cx="50" cy="50" r="33" stroke-width="3.2"/>
      <ellipse cx="50" cy="50" rx="33" ry="13" stroke-width=".8" opacity=".7"/>
      <ellipse cx="50" cy="50" rx="13" ry="33" stroke-width=".8" opacity=".7"/>
      <ellipse cx="50" cy="50" rx="33" ry="13" stroke-width=".6" opacity=".5" transform="rotate(45 50 50)"/>
      <ellipse cx="50" cy="50" rx="33" ry="13" stroke-width=".6" opacity=".5" transform="rotate(-45 50 50)"/>
    </g>
    <g fill="${c.dot}">${diag.map((d) => `<circle cx="50" cy="7" r="2.6" transform="rotate(${d} 50 50)"/>`).join('')}</g>
    ${diag.map((d) => `<g transform="rotate(${d} 50 50)"><path d="M50 18 L50 50 L45.5 45.5Z" fill="${c.d}"/><path d="M50 18 L50 50 L54.5 45.5Z" fill="${c.b}"/></g>`).join('')}
    ${main.map((d) => `<g transform="rotate(${d} 50 50)"><path d="M50 2 L50 50 L43 43Z" fill="${c.a}"/><path d="M50 2 L50 50 L57 43Z" fill="${c.b}"/></g>`).join('')}
    <circle cx="50" cy="50" r="2.2" fill="${c.center}"/>
  </svg>`;
}

const base = `
  <style>
    @font-face { font-family: 'Montserrat'; src: url('${font('montserrat', 'montserrat-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
    @font-face { font-family: 'Inter'; src: url('${font('inter', 'inter-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
    * { margin: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
  </style>`;

const og = `${base}
  <style>
    .og { position: relative; width: 1200px; height: 630px; overflow: hidden; color: #fff;
      background: radial-gradient(ellipse at 72% 25%, #18345c 0%, #0a1830 55%, #071226 100%); }
    .dots { position: absolute; inset: 0; opacity: .45; background-image: radial-gradient(rgba(199,216,238,.35) 1.2px, transparent 1.2px);
      background-size: 24px 24px; -webkit-mask-image: radial-gradient(ellipse at 70% 45%, black 10%, transparent 70%); }
    .mark { position: absolute; right: 70px; top: 95px; width: 440px; height: 440px; filter: drop-shadow(0 30px 60px rgba(0,0,0,.4)); }
    .content { position: absolute; left: 80px; top: 72px; width: 640px; }
    .brand { display: flex; align-items: center; gap: 14px; }
    .brand svg { width: 52px; height: 52px; }
    .brand b { display: block; font: 700 30px/1 'Montserrat'; letter-spacing: -.5px; }
    .brand i { display: block; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,.3); font: 400 14px/1 'Montserrat'; font-style: normal; letter-spacing: .06em; color: #c7d8ee; }
    .eyebrow { margin-top: 92px; display: flex; align-items: center; gap: 14px; font: 600 16px/1 'Montserrat'; letter-spacing: .2em; text-transform: uppercase; color: #6f9bd1; }
    .eyebrow::before { content: ''; width: 36px; height: 1px; background: currentColor; }
    h1 { margin-top: 22px; font: 700 66px/1.04 'Montserrat'; letter-spacing: -1.5px; }
    h1 span { background: linear-gradient(90deg, #6f9bd1, #c7d8ee); -webkit-background-clip: text; color: transparent; }
    p { margin-top: 26px; font-size: 24px; color: rgba(199,216,238,.9); }
  </style>
  <div class="og">
    <div class="dots"></div>
    <div class="mark">${compass('light')}</div>
    <div class="content">
      <div class="brand">${compass('light')}<div><b>Northpoint</b><i>Global Holding</i></div></div>
      <div class="eyebrow">Consultoria + Fulfillment</div>
      <h1>Pare de perder vendas no <span>Mercado Livre</span>.</h1>
      <p>São Paulo · Atendimento online para todo o Brasil</p>
    </div>
  </div>`;

const square = (size, bg, tone, scale) => `${base}
  <div style="width:${size}px;height:${size}px;background:${bg};display:grid;place-items:center">
    <div style="width:${Math.round(size * scale)}px;height:${Math.round(size * scale)}px">${compass(tone)}</div>
  </div>`;

const jobs = [
  { file: 'og.png', w: 1200, h: 630, html: og },
  { file: 'apple-touch-icon.png', w: 180, h: 180, html: square(180, '#0f2341', 'light', 0.78) },
  { file: 'logo.png', w: 512, h: 512, html: square(512, '#ffffff', 'brand', 0.86) },
];

const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage();
for (const job of jobs) {
  await page.setViewport({ width: job.w, height: job.h, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><meta charset="utf-8">${job.html}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'public', job.file), clip: { x: 0, y: 0, width: job.w, height: job.h } });
  console.log('gerado: public/' + job.file);
}
await browser.close();
