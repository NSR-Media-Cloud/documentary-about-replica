// Named easing curves used across the site (cubic-bezier families: in/out/inOut × 1..6).
// Values are the standard "easings.net" set; the source registers the same names with GSAP's CustomEase.
export const EASES = {
  quartIn: '0.5, 0, 0.75, 0', quartOut: '0.25, 1, 0.5, 1', quartInOut: '0.75, 0, 0.25, 1',
  in1: '0.33, 0, 0.68, 0', out1: '0.33, 1, 0.68, 1', inOut1: '0.65, 0, 0.35, 1',
  in2: '0.8, 0, 0.6, 0.6', out2: '0.4, 0.4, 0.1, 1', inOut2: '0.8, 0, 0.2, 1',
  i1: '0.47, 0, 0.745, 0.715', o1: '0.39, 0.575, 0.565, 1', io1: '0.445, 0.05, 0.55, 0.95',
  i2: '0.55, 0.085, 0.68, 0.53', o2: '0.25, 0.46, 0.45, 0.94', io2: '0.455, 0.03, 0.515, 0.955',
  i3: '0.55, 0.055, 0.675, 0.19', o3: '0.215, 0.61, 0.355, 1', io3: '0.645, 0.045, 0.355, 1',
  i4: '0.895, 0.03, 0.685, 0.22', o4: '0.165, 0.84, 0.44, 1', io4: '0.77, 0, 0.175, 1',
  i5: '0.755, 0.05, 0.855, 0.06', o5: '0.23, 1, 0.32, 1', io5: '0.86, 0, 0.07, 1',
  i6: '0.95, 0.05, 0.795, 0.035', o6: '0.19, 1, 0.22, 1', io6: '1, 0, 0, 1',
};

export function registerEases(CustomEase) {
  Object.entries(EASES).forEach(([name, bezier]) => CustomEase.create(name, bezier));
}
