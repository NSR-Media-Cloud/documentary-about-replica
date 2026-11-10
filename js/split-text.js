// Line splitter: measures where a paragraph wraps, then rebuilds it as one
// <div class="wrap"><div class="line">…</div></div> per visual line (masked, so a
// line can slide up from below its own box).  Re-splits on resize.
import { debounce } from './dom.js';

const instances = new Set();

function measure(el, words) {
  el.innerHTML = '';
  el.classList.add('split');
  const frag = document.createDocumentFragment();
  words.forEach((w, i) => {
    const d = document.createElement('div');
    d.className = 'word';
    d.textContent = i < words.length - 1 ? w + ' ' : w;
    frag.appendChild(d);
  });
  el.appendChild(frag);

  const lines = [];
  let cur = [];
  let top = null;
  [...el.children].forEach((c) => {
    const t = c.getBoundingClientRect().top;
    if (top === null) top = t;
    if (Math.abs(t - top) > 2) { lines.push(cur.join('').trim()); cur = []; top = t; }
    cur.push(c.textContent);
  });
  if (cur.length) lines.push(cur.join('').trim());
  return lines;
}

function build(inst) {
  const { el, words, lineClass, delayStart, wrap } = inst;
  const lines = measure(el, words);
  el.innerHTML = '';
  lines.forEach((txt, i) => {
    const line = document.createElement('div');
    line.className = 'line' + (lineClass ? ' ' + lineClass : '');
    line.textContent = txt;
    if (delayStart != null) line.style.setProperty('--delay', (delayStart + (i + 1) * 0.1).toFixed(2) + 's');
    if (wrap) {
      const w = document.createElement('div');
      w.className = 'wrap';
      w.appendChild(line);
      el.appendChild(w);
    } else el.appendChild(line);
  });
  el.classList.add('done');
  inst.lineCount = lines.length;
  if (inst.onSplit) inst.onSplit(el, lines);
}

/** Split an element's text into masked lines. */
export function splitLines(el, { lineClass = '', delayStart = null, wrap = true, onSplit = null } = {}) {
  const text = el.textContent.replace(/\s+/g, ' ').trim();
  const inst = { el, words: text.split(' '), lineClass, delayStart, wrap, onSplit, lineCount: 0 };
  instances.add(inst);
  build(inst);
  return inst;
}

let lastW = window.innerWidth;
window.addEventListener('resize', debounce(() => {
  if (window.innerWidth === lastW) return;           // ignore mobile URL-bar height changes
  lastW = window.innerWidth;
  instances.forEach(build);
}, 150));
