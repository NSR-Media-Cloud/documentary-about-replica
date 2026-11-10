'use strict';
// Sixteen made-up organisation marks for the "Trusted by" strip. No real brand, logo or wordmark is reproduced:
// each is a simple geometric glyph plus a name in one of four type styles, drawn in white on black.

const ring = '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="currentColor"/>';
const dots = `<g fill="currentColor">${[4, 12, 20].flatMap((y) => [4, 12, 20].map((x) => `<circle cx="${x}" cy="${y}" r="2"/>`)).join('')}</g>`;
const MARKS = {
  ring,
  hex: '<path d="M12 1.5 21.5 7v10L12 22.5 2.5 17V7z" fill="none" stroke="currentColor" stroke-width="2"/>',
  chevron: '<path d="M2 18 12 6l10 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>',
  dots,
  diamond: '<path d="M12 1.5 22.5 12 12 22.5 1.5 12z" fill="currentColor"/>',
  square: '<rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 22 22 2" stroke="currentColor" stroke-width="2"/>',
  wave: '<path d="M1 12c3-6 5-6 8 0s5 6 8 0 4-5 6-2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  bars: '<g fill="currentColor"><rect x="3" y="12" width="4" height="10"/><rect x="10" y="6" width="4" height="16"/><rect x="17" y="1" width="4" height="21"/></g>',
  triangle: '<path d="M12 2.5 22 21H2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  cross: '<path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="3"/>',
  orbit: '<circle cx="12" cy="12" r="5" fill="currentColor"/><ellipse cx="12" cy="12" rx="11" ry="5" fill="none" stroke="currentColor" stroke-width="1.5" transform="rotate(-30 12 12)"/>',
  leaf: '<path d="M3 21C3 9 10 3 21 3c0 11-6 18-18 18z" fill="currentColor"/>',
  stack: '<g fill="currentColor"><rect x="2" y="4" width="20" height="3"/><rect x="2" y="10.5" width="14" height="3"/><rect x="2" y="17" width="8" height="3"/></g>',
  burst: '<path d="M12 1v5M12 18v5M1 12h5M18 12h5M4.2 4.2l3.5 3.5M16.3 16.3l3.5 3.5M19.8 4.2l-3.5 3.5M7.7 16.3l-3.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  arc: '<path d="M2 19a10 10 0 0 1 20 0z" fill="currentColor"/>',
};

/** style: caps | serif | mono | lower   ·   stack: mark above the name instead of beside it */
const LOGOS = [
  { mark: 'ring', name: 'Oriel', sub: 'Public Media', style: 'caps' },
  { mark: 'arc', name: 'Harbor Light', style: 'serif', stack: true },
  { mark: 'hex', name: 'Meridian', sub: 'University', style: 'caps' },
  { mark: 'chevron', name: 'kestrel', style: 'lower' },
  { mark: 'dots', name: 'Low Country', sub: 'Film Society', style: 'mono', stack: true },
  { mark: 'diamond', name: 'Riverbend', sub: 'Church', style: 'caps' },
  { mark: 'square', name: 'Open Frame', style: 'caps', stack: true },
  { mark: 'wave', name: 'Stillwater', style: 'serif' },
  { mark: 'bars', name: 'tidewell', style: 'lower' },
  { mark: 'triangle', name: 'Summit', sub: 'Learning', style: 'caps', stack: true },
  { mark: 'cross', name: 'Nova-9', sub: 'Broadcast', style: 'mono' },
  { mark: 'ring', name: 'The Lantern', sub: 'Foundation', style: 'serif' },
  { mark: 'stack', name: 'oakline', style: 'lower', stack: true },
  { mark: 'orbit', name: 'Orbit', sub: 'Collective', style: 'caps' },
  { mark: 'leaf', name: 'Fernhill', sub: 'Academy', style: 'serif' },
  { mark: 'burst', name: 'Clear Sky', sub: 'Television', style: 'mono', stack: true },
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function logoHtml(l, hidden = false) {
  const label = [l.name, l.sub].filter(Boolean).join(' ');
  return `<div class="lg lg--${l.style}${l.stack ? ' lg--s' : ''}"${hidden ? ' aria-hidden="true"' : ` role="img" aria-label="${esc(label)}"`}>`
    + `<svg viewBox="0 0 24 24" aria-hidden="true">${MARKS[l.mark]}</svg>`
    + `<span class="lg__t"><b>${esc(l.name)}</b>${l.sub ? `<i>${esc(l.sub)}</i>` : ''}</span></div>`;
}

module.exports = { LOGOS, logoHtml };
