// Film grid: hover shows the (stand-in) preview, click opens the video lightbox, phones get a "Load More" button.
import { qs, qsa, isPhone } from '../dom.js';
import { openVideoModal } from './video-modal.js';

export function initFilmGrids() {
  qsa('[data-film-grid]').forEach((root) => {
    const cards = qsa('.film-grid__card', root);
    cards.forEach((card) => {
      const visuals = qs('.film-grid__visuals', card);
      const on = () => { if (!isPhone()) visuals.classList.add('is-show'); };
      const off = () => visuals.classList.remove('is-show');
      card.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') on(); });
      card.addEventListener('pointerleave', off);
      card.addEventListener('focus', on);
      card.addEventListener('blur', off);
      card.addEventListener('click', () => openVideoModal({ poster: card.dataset.poster, title: card.dataset.title, award: card.dataset.award || '' }));
    });
    const more = qs('.film-grid__button', root);
    if (more) more.addEventListener('click', () => { root.classList.add('is-all'); more.remove(); });
  });
}
