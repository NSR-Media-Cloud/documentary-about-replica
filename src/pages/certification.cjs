'use strict';
// /certification — stand-in copy.
module.exports = {
  path: '/certification',
  title: 'Certification',
  description: 'Earn a certificate of completion for every course you finish',
  active: '/certification',
  blocks: [
    {
      block: 'hero:textImage', tag: 'Certification', heading: 'Get Certified with RTA',
      image: { src: '/assets/img/hero-6.jpg', w: 1792, h: 1008, sm: { src: '/assets/img/founder-1-sm.jpg', w: 1000, h: 1810 } },
    },
    {
      block: 'stepsStack', tag: 'Requirements', heading: 'Earn a certificate of completion in four easy steps',
      steps: ['Complete the course you are enrolled in', 'Finish all of the assignments', 'Submit', 'Collect certificate'],
    },
    {
      block: 'certificates', tag: 'Certificates', heading: 'Finish a course and its final project and receive a certificate that you can share with anyone who asks',
      badges: ['laurel-1', 'laurel-2', 'laurel-3', 'laurel-4', 'laurel-5'],
      items: [
        { title: 'Foundations', requirements: ['Complete Chapter', 'Pass every quiz in the course'] },
        { title: 'Advanced Storytelling', requirements: ['Complete Chapter', 'Pass every quiz in the course', 'Submit your final project and receive notes from a mentor'] },
        { title: 'Make and Sell', requirements: ['Complete Chapter', 'Pass every quiz and submit a final project to get written feedback from a mentor.'] },
        { title: 'The Final Cut', requirements: ['Complete Chapter', 'Pass every quiz and submit a final project to receive written feedback from a mentor'] },
        { title: 'The Roving Eye', requirements: ['Complete Chapter', 'Pass every quiz, submit a final project and receive written feedback from a mentor.'] },
      ],
    },
  ],
};
