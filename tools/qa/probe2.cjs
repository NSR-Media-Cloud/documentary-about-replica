// Probe 2: scroll the page in steps; save screenshots + numeric animation state at each step.
// usage: node probe2.cjs <orig|replica> <vw> <vh> <outDir> [url]
const { launch, openPage, waitReady, sleep, fs, path, SP } = require('./lib.cjs');
const [, , SITE = 'orig', VW = '1440', VH = '900', OUTDIR, URLARG] = process.argv;
const vw = +VW, vh = +VH;
const url = URLARG || (SITE === 'orig' ? 'https://theartofdocumentary.com/about' : 'http://localhost:4660/');
const OUT = OUTDIR || path.join(SP, 'shots', `${SITE}-${vw}x${vh}`);
fs.mkdirSync(OUT, { recursive: true });

const MAPS = {
  orig: {
    header: 'header[class*="flyingImages_header"]',
    heroImgs: '[class*="flyingImages_images"] > picture',
    heroH1: 'header[class*="flyingImages_header"] h1',
    heroH2: 'header[class*="flyingImages_header"] h2',
    scrollText: 'section[class*="scrollText_section"]',
    stLines: '[class*="scrollText_abs"] .split > .wrap, [class*="scrollText_abs"].split > .wrap',
    numbered: 'section[class*="numberedTextBlocks_section"]',
    slide: 'section[class*="slideoverImage_section"]',
    sticky: '[class*="slideoverImage_stickyImages"]',
    stickyPics: '[class*="slideoverImage_stickyImages"] > picture',
    overlay: '[class*="slideoverImage_overlay"]',
    imagesBox: '[class*="slideoverImage_images"]',
    smallPics: '[class*="slideoverImage_smallOverflow"] picture',
    footer: 'footer',
    nav: '#nav',
  },
  replica: {
    header: '.hero', heroImgs: '.hero__images > .img', heroH1: '.hero h1', heroH2: '.hero h2',
    scrollText: '.scroll-text', stLines: '.scroll-text__abs .split > .wrap, .scroll-text__abs.split > .wrap',
    numbered: '.numbered', slide: '.founders', sticky: '.founders__sticky', stickyPics: '.founders__sticky > .img',
    overlay: '.founders__overlay', imagesBox: '.founders__images', smallPics: '.founders__small-overflow .img',
    footer: 'footer', nav: '#nav',
  },
};
const MAP = MAPS[SITE];

const STATE_FN = (MAP) => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const rect = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)]; };
  const mat = (e) => { if (!e) return null; const t = getComputedStyle(e).transform; if (!t || t === 'none') return 'none'; const m = t.match(/matrix(3d)?\((.+)\)/); if (!m) return t; const v = m[2].split(',').map(Number); return m[1] ? { s: +v[0].toFixed(3), tx: +v[12].toFixed(1), ty: +v[13].toFixed(1), tz: +v[14].toFixed(1) } : { s: +v[0].toFixed(3), tx: +v[4].toFixed(1), ty: +v[5].toFixed(1) }; };
  const st = {
    y: Math.round(scrollY),
    nav: mat($(MAP.nav)),
    hero: $$(MAP.heroImgs).map((e) => ({ r: rect(e), m: mat(e), o: +(+getComputedStyle(e).opacity).toFixed(3), f: getComputedStyle(e).filter })),
    h2r: rect($(MAP.heroH2)),
    st: $$(MAP.stLines).map((w) => +parseFloat(getComputedStyle(w).getPropertyValue('--scale') || '0').toFixed(1)),
    stRect: rect($(MAP.scrollText)),
    numRect: rect($(MAP.numbered)),
    slideRect: rect($(MAP.slide)),
    sticky: { r: rect($(MAP.sticky)), f: $(MAP.sticky) ? getComputedStyle($(MAP.sticky)).filter : null },
    overlay: $(MAP.overlay) ? getComputedStyle($(MAP.overlay)).backgroundColor : null,
    stickyPics: $$(MAP.stickyPics).map((e) => +(+getComputedStyle(e).opacity).toFixed(3)),
    imagesBoxM: mat($(MAP.imagesBox)),
    smallPics: $$(MAP.smallPics).map((e) => mat(e)),
    footerRect: rect($(MAP.footer)),
  };
  return st;
};

(async () => {
  const browser = await launch();
  const page = await openPage(browser, { vw, vh, url, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  const ms = await waitReady(page);
  console.log('ready after', ms, 'ms');
  await sleep(3800); // hero intro
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('scrollHeight', H);
  const positions = [];
  const step = Math.round(vh * 0.5);
  for (let y = 0; y < H - vh + step; y += step) positions.push(Math.min(y, H - vh));
  positions.push(H - vh);
  const uniq = [...new Set(positions)];
  const states = [];
  let i = 0;
  for (const y of uniq) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(900);
    const s = await page.evaluate(STATE_FN, MAP);
    states.push(s);
    await page.screenshot({ path: path.join(OUT, `s${String(i).padStart(2, '0')}-y${y}.png`) });
    i++;
  }
  fs.writeFileSync(path.join(OUT, 'states.json'), JSON.stringify({ vw, vh, H, states }, null, 1));
  console.log('saved', states.length, 'states to', OUT);
  await browser.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
