'use strict';
// /the-rta-accelerator — on the source this route renders only its hero (the programme is closed), so that is all this page has.
// Stand-in copy; the dates are invented.
module.exports = {
  path: '/the-rta-accelerator',
  title: 'RTA Accelerator',
  description: 'A twelve-week group programme with coaching for working filmmakers',
  active: '',
  blocks: [
    {
      block: 'hero:infoVideo', heading: 'RTA Accelerator',
      overview: 'Twelve weeks of group sessions and coaching to launch your film career',
      button: { label: 'Enrol Now', popup: true },
      info: [
        ['Starting', '9 March 2027'], ['Closing', '8 June 2027'], ['Spots Available', '12'],
        ['Spots Per Group', '12'], ['Group Sessions', '12 Weeks'], ['Coaching Calls', '2 Hours Per Week'],
      ],
      image: '/assets/img/hero-3.jpg',
    },
  ],
};
