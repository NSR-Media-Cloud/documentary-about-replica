// Shared helpers for driving headless Chrome against the original site (analysis only).
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SP = path.join(__dirname, 'out');   // screenshots + JSON are written under tools/qa/out

async function launch(opts = {}) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-first-run', '--disable-features=Translate', '--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
    defaultViewport: null,
    ...opts,
  });
  return browser;
}

async function openPage(browser, { vw = 1440, vh = 900, dpr = 1, mobile = false, url, blockThird = false, reducedMotion = false, suppressPopup = false, waitUntil = 'domcontentloaded' } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: vw, height: vh, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  if (suppressPopup) await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('popup', 'disabled'); } catch (e) {} });
  const requests = [];
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const u = req.url();
    requests.push({ url: u, type: req.resourceType(), t: Date.now() });
    if (blockThird && /klaviyo|hotjar|googletagmanager|google-analytics|doubleclick|facebook|clarity|kajabi\.com\/.*track|segment|sentry/i.test(u)) return req.abort();
    req.continue();
  });
  page._requests = requests;
  await page.goto(url, { waitUntil, timeout: 60000 });
  return page;
}

async function waitReady(page, { timeout = 40000 } = {}) {
  const t0 = Date.now();
  // preloader finished when #pre-wrapper is gone and html has the ready class
  await page.waitForFunction(() => /ani_ready|is-ready/.test(document.documentElement.className) && !document.querySelector('#pre-wrapper'), { timeout, polling: 100 }).catch(() => {});
  return Date.now() - t0;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

fs.mkdirSync(SP, { recursive: true });
module.exports = { puppeteer, launch, openPage, waitReady, sleep, fs, path, SP, CHROME };
