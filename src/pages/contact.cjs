'use strict';
// /contact — stand-in copy. The address is on the reserved ".test" domain so it can never reach a real inbox.
module.exports = {
  path: '/contact',
  title: 'Contact',
  description: 'Get in touch with the Reel Truth Academy team',
  active: '/contact',
  blocks: [
    {
      block: 'hero:textImage',
      tag: 'Contact Us',
      heading: 'Let’s talk',
      link: { href: 'mailto:hello@rta.test', label: 'hello@rta.test' },
      image: { src: '/assets/img/founder-2-lg.jpg', w: 2400, h: 1350, sm: { src: '/assets/img/founder-2-sm.jpg', w: 1000, h: 1810 } },
    },
    {
      block: 'contactForm',
      tag: 'Contact Form',
      heading: 'Drop us a message using the form or simply shoot us an email',
      links: [['LinkedIn', 'https://www.linkedin.com/'], ['Instagram', 'https://www.instagram.com/'], ['YouTube', 'https://www.youtube.com/'], ['Email', 'mailto:hello@rta.test']],
      topics: ['General Inquiry', 'Course Inquiry', 'Team Inquiry'],
      image: '/assets/img/small-1.jpg',
    },
  ],
};
