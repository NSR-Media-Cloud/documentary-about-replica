// Video slider — a draggable, snapping row of 920rem slides; the centred one is "active" (full opacity, smaller frame),
// its name rises into the ticker above and its number lights up on the ruler below.
import { qs, qsa } from '../dom.js';
import { openVideoModal } from './video-modal.js';

export function initVideoSliders() {
  qsa('.video-slider').forEach((root) => {
    const vp = qs('.video-slider__viewport', root);
    const slides = qsa('.video-slider__slide', root);
    const videos = qsa('.video-slider__video', root);
    const names = qsa('.video-slider__name', root);
    const ruler = qs('.video-slider__ticks', root);
    const nums = ruler ? qsa('span:nth-child(even)', ruler) : [];
    let active = -1;

    const setActive = (i) => {
      if (i === active) return;
      active = i;
      videos.forEach((v, k) => v.classList.toggle('is-active', k === i));
      names.forEach((n, k) => n.classList.toggle('is-active', k === i));
      nums.forEach((n, k) => n.classList.toggle('is-active', k === i));
      if (ruler && nums[i]) {
        const rect = ruler.getBoundingClientRect();
        const c = nums[i].getBoundingClientRect();
        const shift = (c.left + c.width / 2) - (rect.left);                 // distance from the ticks' left edge (which sits at the ruler centre)
        ruler.style.transform = `translateX(${-shift + (parseFloat(ruler.style.transform.replace(/[^-\d.]/g, '')) || 0) * 0}px)`;
      }
    };
    const current = () => {
      const centre = vp.scrollLeft + vp.clientWidth / 2;
      let best = 0, d = Infinity;
      slides.forEach((s, i) => { const m = s.offsetLeft + s.offsetWidth / 2; if (Math.abs(m - centre) < d) { d = Math.abs(m - centre); best = i; } });
      return best;
    };
    vp.addEventListener('scroll', () => setActive(current()), { passive: true });

    // mouse drag (touch uses the native scroll + snap)
    let down = null;
    vp.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, left: vp.scrollLeft, moved: false }; });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (Math.abs(dx) > 4) { down.moved = true; vp.classList.add('is-dragging'); }
      if (down.moved) vp.scrollLeft = down.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      const moved = down.moved;
      down = null;
      vp.classList.remove('is-dragging');
      if (moved) slides[current()].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      vp.dataset.dragged = moved ? '1' : '';
      setTimeout(() => { vp.dataset.dragged = ''; }, 0);
    });

    videos.forEach((v, i) => v.addEventListener('click', () => {
      if (vp.dataset.dragged) return;
      if (i !== active) { slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); return; }
      const img = qs('img', v);
      openVideoModal({ poster: img ? img.currentSrc || img.src : '', title: names[i] ? names[i].textContent : 'Story' });
    }));

    // start centred on the first slide
    vp.scrollLeft = 0;
    requestAnimationFrame(() => { active = -1; setActive(0); });
  });
}
