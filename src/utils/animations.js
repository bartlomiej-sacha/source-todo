import gsap from 'gsap';
import {CSSPlugin} from 'gsap/CSSPlugin';

gsap.registerPlugin(CSSPlugin);

export function makeItFade(el) {
  const tl = gsap.timeline({paused: true, defaults: {ease: 'power3.inOut'}});
  tl.set(el, {
    autoAlpha: 0,
    transformX: 0,
  });
  return tl
    .to(el, {
      autoAlpha: 1,
      duration: 1,
    })
    .play();
}
