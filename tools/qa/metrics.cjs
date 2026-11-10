// Text/box metrics at any viewport for the original (orig) or the replica.
// usage: node metrics.cjs <vw> <vh> <orig|replica> [url]
const { launch, openPage, waitReady, sleep, fs, path, SP } = require('./lib.cjs');
const [, , VW = '1440', VH = '900', SITE = 'orig', URLARG] = process.argv;
const vw = +VW, vh = +VH;
const URL = URLARG || (SITE === 'orig' ? 'https://theartofdocumentary.com/about' : 'http://localhost:4660/');
const OUT = path.join(SP, 'shots', 'metrics');
fs.mkdirSync(OUT, { recursive: true });

const SELS = {
  orig: {
    nav: '#nav', logo: '#nav a[class*="logo"]', navBtns: '#nav [class*="nav_buttons"] button',
    h1: 'header h1', h2: 'header h2', scrollHint: '[class*="flyingImages_scroll"]',
    stTag: '[class*="scrollText_tag"]', stPara: '[class*="scrollText_paragraph"]',
    numSection: '[class*="numberedTextBlocks_section"]', numTag: '[class*="numberedTextBlocks_tag"]', numH3: '[class*="numberedTextBlocks_section"] h3',
    numBlocks: '[class*="numberedTextBlocks_grid"] > div',
    foTags: '[class*="slideoverImage_tag"]', foH3: '[class*="slideoverImage_infoInner"] h3', foBody: '[class*="slideoverImage_body"]', foGrid: '[class*="slideoverImage_imageGrid"]',
    foSmallWrap: '[class*="slideoverImage_smallImageWrap"]', foSmall: '[class*="slideoverImage_smallInner"]', foSpacer: '[class*="slideoverImage_spacer"]', foSection: '[class*="slideoverImage_section"]', foOuter: '[class*="slideoverImage_outerWrap"]',
    footer: 'footer', fLogo: 'footer a[class*="logo"]', fHeading: '[class*="footer_heading"]', fBtn: '[class*="footer_buttonWrap"] button', fLinksL: '[class*="footer_linksLeft"]', fLinksR: '[class*="footer_linksRight"]', fMeta: '[class*="footer_meta"]',
    cookie: '[class*="cookie_banner"]',
  },
  replica: {
    nav: '#nav', logo: '#nav .nav__logo', navBtns: '#nav .nav__buttons .btn',
    h1: '.hero h1', h2: '.hero h2', scrollHint: '.hero__scroll',
    stTag: '.scroll-text__tag', stPara: '.scroll-text__paragraph',
    numSection: '.numbered', numTag: '.numbered__tag', numH3: '.numbered h3', numBlocks: '.numbered__grid > div',
    foTags: '.founders__tag', foH3: '.founders__info-inner h3', foBody: '.founders__body', foGrid: '.founders__grid',
    foSmallWrap: '.founders__small-wrap', foSmall: '.founders__small-inner', foSpacer: '.founders__spacer', foSection: '.founders', foOuter: '.founders__outer',
    footer: 'footer', fLogo: 'footer .footer__logo', fHeading: '.footer__heading', fBtn: '.footer__button-wrap .btn', fLinksL: '.footer__links-left', fLinksR: '.footer__links-right', fMeta: '.footer__meta',
    cookie: '.cookie',
  },
};

(async () => {
  const browser = await launch();
  const page = await openPage(browser, { vw, vh, url: URL, blockThird: true, suppressPopup: true, mobile: vw <= 480 });
  await waitReady(page);
  await sleep(3800);
  const metrics = await page.evaluate((S) => {
    const out = [];
    const q = (s) => document.querySelector(s);
    const qa = (s) => [...document.querySelectorAll(s)];
    const pick = (label, el) => {
      if (!el) { out.push({ label, missing: true }); return; }
      const cs = getComputedStyle(el); const b = el.getBoundingClientRect();
      const lh = parseFloat(cs.lineHeight) || 0;
      const txt = el.textContent.replace(/\s+/g, ' ').trim();
      out.push({ label, x: +b.x.toFixed(1), y: +(b.y + scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), fs: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing, color: cs.color, ff: cs.fontFamily.split(',')[0], lines: lh ? Math.round(b.height / lh) : null, chars: txt.length });
    };
    pick('nav', q(S.nav)); pick('logo', q(S.logo));
    qa(S.navBtns).forEach((e, i) => pick('navBtn' + i, e));
    pick('h1', q(S.h1)); pick('h2', q(S.h2)); pick('scrollHint', q(S.scrollHint));
    pick('st.tag', q(S.stTag)); pick('st.para', q(S.stPara));
    pick('num.section', q(S.numSection)); pick('num.tag', q(S.numTag)); pick('num.h3', q(S.numH3));
    qa(S.numBlocks).forEach((e, i) => { pick('num.block' + i, e); pick('num.n' + i, e.children[0]); pick('num.h4_' + i, e.children[1]); pick('num.body' + i, e.children[2]); });
    qa(S.foTags).forEach((e, i) => pick('fo.tag' + i, e));
    qa(S.foH3).forEach((e, i) => pick('fo.h3_' + i, e));
    qa(S.foBody).forEach((e, i) => pick('fo.body' + i, e));
    qa(S.foGrid).forEach((e, i) => pick('fo.grid' + i, e));
    pick('fo.smallWrap', q(S.foSmallWrap)); pick('fo.small', q(S.foSmall)); pick('fo.spacer', q(S.foSpacer)); pick('fo.section', q(S.foSection));
    qa(S.foOuter).forEach((e, i) => pick('fo.outer' + i, e));
    pick('footer', q(S.footer)); pick('f.logo', q(S.fLogo)); pick('f.heading', q(S.fHeading)); pick('f.btn', q(S.fBtn));
    pick('f.linksL', q(S.fLinksL)); pick('f.linksR', q(S.fLinksR)); pick('f.meta', q(S.fMeta)); pick('cookie', q(S.cookie));
    return out;
  }, SELS[SITE]);
  fs.writeFileSync(path.join(OUT, `${SITE}-${vw}.json`), JSON.stringify(metrics, null, 1));
  console.log(metrics.map((m) => m.missing ? `${m.label.padEnd(14)} MISSING` : `${m.label.padEnd(14)} x${m.x} y${m.y} ${m.w}x${m.h} fs:${m.fs} lh:${m.lh} ls:${m.ls} L${m.lines} c${m.chars}`).join('\n'));
  console.log('scrollHeight', await page.evaluate(() => document.documentElement.scrollHeight));
  await browser.close();
})().catch((e) => { console.error('ERR', e); process.exit(1); });
