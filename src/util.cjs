'use strict';
// Small HTML helpers for the page builder.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The little "→" inside every button. */
const arrow = (stroke = '#fff') =>
  `<svg class="btn__arrow" width="9" height="10" viewBox="0 0 9 10" fill="none" aria-hidden="true"><path d="m4 1 4 4m0 0-4 4m4-4h-8" stroke="${stroke}"/></svg>`;

/** The "[ ↗ ]" bracketed icon used by social links. */
const bracketIcon = `<div><div>[</div><svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true"><g><path d="M9.17163 1.17139H14.8285M14.8285 1.17139V6.82825M14.8285 1.17139L9.17163 6.82825" stroke="#fff" stroke-linejoin="round"/><path d="M1.17163 9.17139H6.82848M6.82848 9.17139V14.8282M6.82848 9.17139L1.17163 14.8282" stroke="#fff" stroke-linejoin="round"/></g></svg><div>]</div></div>`;

/**
 * <picture class="img"> wrapper used for every raster image (it fades in once decoded).
 * @param {{src:string,alt?:string,w:number,h:number,lazy?:boolean,priority?:boolean,cls?:string,style?:string,sm?:{src:string,w:number,h:number}}} o
 */
function pic({ src, alt = '', w, h, lazy = true, priority = false, cls = '', style = '', sm = null }) {
  const source = sm ? `<source media="(max-width: 480px)" srcset="${sm.src}" width="${sm.w}" height="${sm.h}">` : '';
  const img = `<img src="${src}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async"${priority ? ' fetchpriority="high"' : ''}>`;
  return `<picture class="${['img', cls].filter(Boolean).join(' ')}"${style ? ` style="${style}"` : ''}>${source}${img}</picture>`;
}

/** Button (anchor when `href` is given, otherwise <button>). */
function button({ label, href, variant = 'orange', arrowStroke, extra = '', attrs = '', cls = '' }) {
  const stroke = arrowStroke || (variant === 'orange-dark' ? '#000' : '#fff');
  const inner = `<span class="t-mono-s">${label}</span>${arrow(stroke)}`;
  const c = `btn btn--${variant}${cls ? ' ' + cls : ''}`;
  return href
    ? `<a class="${c}" href="${href}"${attrs ? ' ' + attrs : ''}>${inner}</a>`
    : `<button class="${c}" type="button"${attrs ? ' ' + attrs : ''}>${inner}</button>`;
}

module.exports = { esc, arrow, bracketIcon, pic, button };
