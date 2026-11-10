'use strict';
// /enterprise — stand-in copy. The contact address is on the reserved ".test" domain, so a message can never reach a real inbox.
module.exports = {
  path: '/enterprise',
  title: 'Enterprise',
  description: 'Team plans for companies and organisations, cheaper for every seat you add',
  active: '/enterprise',
  blocks: [
    {
      block: 'hero:textImage', tag: 'Enterprise', heading: 'Team plans that get cheaper per seat',
      image: { src: '/assets/img/hero-3.jpg', w: 1792, h: 1008, sm: { src: '/assets/img/hero-1.jpg', w: 1200, h: 1363 } },
    },
    { block: 'logoMarquee', tag: 'Trusted By' },
    {
      block: 'textMediaStack',
      heading: 'What your company gets with a team plan',
      sections: [
        { heading: 'Purchase and save', body: 'Every extra seat lowers the price, so the bigger your team, the more you save.', demo: 'seats' },
        { heading: 'Follow every member’s progress', body: 'Every member has a personal login, so progress is tracked per person.', demo: 'progress' },
        {
          heading: 'Access to every RTA benefit', body: 'Each seat includes the full membership, nothing held back', demo: 'benefits',
          items: ['Monthly guest sessions', 'Template library', 'Seasonal screenings', 'Member funding calls', 'Peer feedback circles', 'Certificates of completion'],
        },
      ],
    },
    { block: 'centeredText', text: '*Team plans require a minimum of five seats' },
    {
      block: 'contactForm', center: true, tag: 'Contact Form',
      heading: 'If you want RTA for a team or a company, tell us a little about it below and we will send a quote',
      topics: ['Team Pricing', 'Seat Count', 'Invoicing', 'Something Else'],
    },
  ],
};
