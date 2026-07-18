'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Hero entrance: brand → headline words → sub → CTA */
export function useHeroTimeline(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      if (el) gsap.set(el.querySelectorAll('[data-hero]'), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        el.querySelectorAll('[data-hero="brand"]'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 }
      )
        .fromTo(
          el.querySelectorAll('[data-hero="word"]'),
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 },
          '-=0.35'
        )
        .fromTo(
          el.querySelectorAll('[data-hero="sub"]'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.2'
        )
        .fromTo(
          el.querySelectorAll('[data-hero="cta"]'),
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45 },
          '-=0.15'
        );
    }, el);

    return () => ctx.revert();
  }, [root]);
}

/** Scrubbed how-it-works step highlight */
export function useHowItWorksScroll(
  section: RefObject<HTMLElement | null>,
  onProgress: (step: number) => void
) {
  useLayoutEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 0.4,
        onUpdate: (self) => {
          const step = Math.min(2, Math.floor(self.progress * 3));
          onProgress(step);
        },
      });

      gsap.fromTo(
        el.querySelectorAll('[data-how-step]'),
        { opacity: 0.35, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.6,
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [section, onProgress]);
}

/** Generic section fade-up on enter */
export function useSectionReveal(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      if (el) gsap.set(el.querySelectorAll('[data-reveal]'), { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      el.querySelectorAll('[data-reveal]').forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [root]);
}

export function useLandingRootRef<T extends HTMLElement>() {
  return useRef<T>(null);
}
