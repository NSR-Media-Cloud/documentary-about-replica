'use strict';
// Not-found page (served by server.cjs with status 404 for unknown URLs).
module.exports = {
  path: '/404',
  title: 'Page not found',
  description: '',
  bodyClass: 'no-footer',
  blocks: [{ block: 'notFound', image: '/assets/img/hero-3.jpg' }],
};
