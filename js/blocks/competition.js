// Competition page: every "video" (hero button, full-width frame, previous winners) opens the lightbox, and the ruled grid of
// award categories draws its grey lines from their centres while the section scrolls from "top top" to "bottom bottom".
import { qs, qsa } from '../dom.js';
import { openVideoModal } from './video-modal.js';

export function initCompetition() {
  qsa('[data-watch]').forEach((el) => {
    el.addEventListener('click', () => openVideoModal({ poster: el.dataset.poster, title: el.dataset.title }));
  });

  qsa('[data-image-blocks]').forEach((section) => {
    const lines = qs('.image-blocks__lines', section);
    if (!lines) return;
    ScrollTrigger.create({
      trigger: section, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => lines.style.setProperty('--scale', self.progress.toFixed(4)),
      onRefresh: (self) => lines.style.setProperty('--scale', self.progress.toFixed(4)),
    });
  });
}
