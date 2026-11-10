'use strict';
// The page shell: <head>, preloader, nav, full-screen menu, footer, cookie notice and the subscribe popup.
const fs = require('fs');
const path = require('path');
const site = require('./site.cjs');
const { esc, arrow, bracketIcon, pic } = require('./util.cjs');

const logo = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'assets', 'svg', 'logo.json'), 'utf8'));
const LOGO = `<svg width="66" height="24" viewBox="0 0 ${logo.w} ${logo.h}" fill="none" aria-hidden="true"><path d="${logo.d}"/></svg>`;

const BASE_CSS = ['base', 'type', 'components', 'sections'];

function menuPages(active) {
  return site.pages.map(([label, href]) => {
    const on = href === active;
    return `          <li><a class="menu__page-link${on ? ' menu__page-link--active' : ''} t-p" href="${href}"${on ? ' aria-current="page"' : ''}>${label}</a></li>`;
  }).join('\n');
}

function menuCourses(activeSlug) {
  return site.courses.map((c) => {
    const on = c.slug === activeSlug;
    return `        <li><a class="menu__page-link${on ? ' menu__page-link--active' : ''} t-mc" href="/courses/${c.slug}"${on ? ' aria-current="page"' : ''}>${esc(c.title)}${c.pill ? '<div class="menu__pill t-nct"><div>New</div></div>' : ''}</a></li>`;
  }).join('\n');
}

function menuCovers() {
  return site.courses.map((c) =>
    `      <div class="menu__image-container">${pic({ src: `/assets/img/course-${c.img}.jpg`, w: 660, h: 920, cls: 'menu__image' })}<span class="menu__cover-title">${esc(c.title)}</span>${c.ribbon ? `<div class="menu__ribbon t-mono"><div class="moveUpF" style="--delay:.4s">${c.ribbon}</div></div>` : ''}</div>`).join('\n');
}

const socialLinks = (cls) => site.socials.map(([label, href]) =>
  `          <li><a class="${cls}__social-link social-link ${cls === 'footer' ? 't-link ' : 't-p '}t-social" href="${href}" target="_blank" rel="noopener"><span>${label}</span>${bracketIcon}</a></li>`).join('\n');

const legalLinks = () => site.legals.map(([label, href]) => `        <li><a class="t-link" href="${href}"><span>${label}</span></a></li>`).join('\n');

function layout(page, body, blockCss = []) {
  const css = [...BASE_CSS.map((n) => `/css/${n}.css`), ...blockCss.map((n) => `/css/blocks/${n}.css`)];
  const title = page.title ? `${esc(page.title)} | ${site.NAME}` : site.NAME;
  const active = page.active || '';
  const coursePart = page.course || '';
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${esc(page.description || '')}">
  <meta name="theme-color" content="#000000">
  <meta name="robots" content="noindex">
  <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">

  <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/InstrumentSans-400-latin.woff2">
  <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/fonts/FragmentMono-400-latin.woff2">

${css.map((h) => `  <link rel="stylesheet" href="${h}">`).join('\n')}
  <script>document.documentElement.classList.replace('no-js', 'js');try{if(sessionStorage.getItem('rta-tr')){document.documentElement.classList.add('tr-cover');sessionStorage.removeItem('rta-tr');}}catch(e){}</script>
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
<a class="skip-link t-mono-s" href="#main">Skip to content</a>

<!-- ============ PRELOADER ============ -->
<div class="preloader" id="pre-wrapper" role="status" aria-live="polite">
  <div class="preloader__bg"></div>
  <div class="preloader__container padding">
    <div class="preloader__loading t-mono-s">
      <div class="preloader__text-wrap"><div>[ ${site.SHORT} ]</div></div>
      <div class="preloader__text-wrap"><div id="pre-percentage">[ 00 Percent ]</div></div>
    </div>
  </div>
</div>

<!-- ============ NAV ============ -->
<nav class="nav padding" id="nav" aria-label="Primary" style="--scrolled:0">
  <a class="nav__logo" href="/" aria-label="${site.SHORT} homepage">
    ${LOGO}
  </a>
  <div class="nav__buttons">
    <button class="btn btn--border nav__button nav__menu-button" type="button" aria-expanded="false" aria-controls="menu"><span class="t-mono-s">Menu</span></button>
    <button class="btn btn--border nav__button" type="button" data-open-subscribe><span class="t-mono-s">Join now</span>${arrow('#fff')}</button>
  </div>
</nav>

<!-- ============ MENU ============ -->
<div class="menu" id="menu" role="navigation" aria-label="Site menu" data-lenis-prevent inert aria-hidden="true">
  <div class="menu__bg"></div>
  <div class="menu__inner">
    <div class="menu__links-left">
      <div class="menu__list">
        <div class="menu__list-heading t-mono orange"><span class="menu__heading-span">Pages</span></div>
        <ul>
${menuPages(active)}
        </ul>
      </div>
      <div class="menu__list">
        <div class="menu__list-heading t-mono orange"><span class="menu__heading-span">Socials</span></div>
        <ul>
${socialLinks('menu')}
        </ul>
      </div>
    </div>

    <div class="menu__list menu__links-right">
      <div class="menu__list-heading t-mono orange"><span class="menu__heading-span">Courses</span></div>
      <ul>
${menuCourses(coursePart)}
      </ul>
      <div class="menu__btns-wrap">
        <a class="btn btn--orange menu__login" href="/contact"><span class="t-mono-s">Login</span>${arrow('#fff')}</a>
      </div>
    </div>

    <div class="menu__image-wrap desktop" aria-hidden="true">
${menuCovers()}
    </div>

    <div class="menu__meta t-mono-s">
      <ul class="menu__legals">
${legalLinks()}
      </ul>
      <div class="desktop">Practical documentary teaching, taught by makers</div>
    </div>
  </div>
</div>

<main id="main">
${body}
</main>

<!-- ============ FOOTER ============ -->
<footer class="footer padding">
  <div class="footer__grid">
    <div class="footer__inner">
      <a class="footer__logo" href="/" aria-label="${site.SHORT} homepage">
        ${LOGO}
      </a>
      <div class="footer__heading t-xs">Join the RTA community now</div>
      <div class="footer__button-wrap">
        <button class="btn btn--orange" type="button" data-open-subscribe><span class="t-mono-s">Join our email list</span>${arrow('#fff')}</button>
        <div class="t-mono-s" aria-hidden="true"></div>
      </div>
    </div>

    <div class="footer__list footer__links-left t-mono-s">
      <div class="footer__list-heading orange">Pages</div>
      <ul>
${site.pages.map(([label, href]) => `        <li><a class="t-link t-no-mobile-line" href="${href}">${label}</a></li>`).join('\n')}
      </ul>
    </div>

    <div class="footer__links-right">
      <div class="footer__list t-mono-s">
        <div class="footer__list-heading orange">Courses</div>
        <ul>
${site.courses.map((c) => `          <li><a class="t-link t-no-mobile-line" href="/courses/${c.slug}">${esc(c.title)}</a></li>`).join('\n')}
        </ul>
      </div>
      <div class="footer__list t-mono-s">
        <div class="footer__list-heading orange">Socials</div>
        <ul>
${socialLinks('footer')}
        </ul>
      </div>
    </div>
  </div>

  <div class="footer__meta t-mono-s">
    <span class="footer__copyright">© 2020-2026 Reel Truth Academy</span>
    <a class="t-link" href="https://github.com/NSR-Media-Cloud/documentary-about-replica" target="_blank" rel="noopener">Built as a design study</a>
    <ul class="footer__legals">
${legalLinks()}
    </ul>
  </div>
</footer>

<!-- ============ COOKIE NOTICE ============ -->
<div class="cookie" id="cookie" role="dialog" aria-label="Cookie notice" hidden>
  <div class="cookie__banner-view">
    <div class="cookie__description t-sp">This website uses cookies.</div>
    <div class="cookie__buttons t-mono-s">
      <div class="cookie__buttons-left">
        <button type="button" class="cookie__link cookie__manage-btn" data-cookie="manage">Manage</button>
        <button type="button" class="cookie__accept" data-cookie="accept">Accept</button>
      </div>
    </div>
  </div>
  <div class="cookie__manage-view" hidden>
    <h2 class="t-xs cookie__heading">Manage Cookies</h2>
    <p class="t-sp cookie__paragraph">We use cookies in order to improve your site experience and deliver personalised content. By continuing to use this site, you agree to our terms.</p>
    <div class="cookie__manage-inner">
      <div class="t-mono cookie__options-heading">Options</div>
      <div class="cookie__cookie">
        <div class="cookie__cookie-head t-mono-s"><span>Required</span><span class="cookie__always">Always active</span></div>
        <p class="t-sp">These cookies are essential for the basic functioning of our website. They enable you to navigate through the site and use its features. Without these cookies, certain services you request may not be possible.</p>
      </div>
      <div class="cookie__cookie">
        <div class="cookie__cookie-head t-mono-s"><span>Analytics</span><input class="cookie__toggle" id="cookie-analytics" type="checkbox" checked aria-label="Analytics cookies"></div>
        <p class="t-sp">These analytical cookies gather data on website usage, helping us improve performance and user experience by tracking page visits and identifying issues. This information is anonymous and aggregated.</p>
      </div>
    </div>
    <div class="cookie__buttons cookie__buttons--manage t-mono-s">
      <button type="button" class="cookie__link cookie__manage-btn" data-cookie="save">Save options</button>
      <button type="button" class="cookie__accept" data-cookie="accept-all">Accept all</button>
    </div>
  </div>
</div>

<!-- ============ SUBSCRIBE POPUP (scroll-triggered + Join buttons) ============ -->
<div class="popup" id="popup" role="dialog" aria-modal="true" aria-labelledby="popup-title" hidden>
  <div class="popup__overlay"></div>
  <div class="popup__container">
    <div class="popup__wrap" tabindex="-1">
      <div class="popup__close-btn"><button class="btn btn--light popup__close" type="button" data-popup-close><span class="t-mono-s">Close</span></button></div>
      <div class="popup__content">
        <form class="popup__form t-p" novalidate>
          <p class="popup__eyebrow t-xsp">Waitlist</p>
          <h2 class="popup__title t-s" id="popup-title">Get <span class="orange">early access</span> to our spring intake.</h2>
          <p class="popup__body t-p orange">Join the waitlist and be first to hear when the doors open.</p>
          <div class="popup__form-wrap">
            <div class="popup__names">
              <label class="field"><span class="field__label">First Name</span><input class="field__input" id="fn" name="firstName" type="text" autocomplete="given-name" required></label>
              <label class="field"><span class="field__label">Last Name</span><input class="field__input" id="ln" name="lastName" type="text" autocomplete="family-name" required></label>
            </div>
            <label class="field"><span class="field__label">Email Address</span><input class="field__input" id="em" name="email" type="email" autocomplete="email" required></label>
            <label class="field field--phone"><span class="field__cc" aria-hidden="true"><i class="field__flag"></i><span>· +1</span></span><span class="field__label">Phone Number (Optional)</span><input class="field__input" id="ph" name="phone" type="tel" autocomplete="tel"></label>
            <div class="popup__submit">
              <button class="btn btn--orange-dark" type="submit"><span class="t-mono-s">Subscribe</span>${arrow('#000')}</button>
              <p class="popup__error t-sp" role="alert" hidden>There were some errors in your submission.<br>Please check the highlighted fields.</p>
            </div>
            <div class="popup__success t-p" hidden>
              <div>Thank you for joining the Reel Truth community!<br>We'll be in touch soon.</div>
              <button class="btn btn--dark" type="button" data-popup-reset><span class="t-mono-s">Reset form</span>${arrow('#fff')}</button>
            </div>
          </div>
        </form>
        <div class="popup__image" aria-hidden="true">
          <div class="popup__boxes">
${[1, 2, 3, 4, 5, 6, 7].map((n) => `            ${pic({ src: `/assets/img/course-${n}.jpg`, w: 660, h: 920, cls: `popup__box popup__box--${n}` })}`).join('\n')}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="modal"></div>

<div class="transition" id="transition" aria-hidden="true">
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__col"></div>
  <div class="transition__corners-wrap"><div class="transition__corners corners"></div></div>
  <div class="transition__wipe"></div>
</div>

${site.vendor.map((f) => `<script src="/vendor/${f}"></script>`).join('\n')}
<script type="module" src="/js/app.js"></script>
</body>
</html>
`;
}

module.exports = { layout, LOGO };
