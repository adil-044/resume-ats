'use client';

/**
 * Campaign motion — WideEye-inspired:
 * clip/mask reveals, line splits, scroll scrub — not fade-everything-up.
 */
import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Wrap each word in a span for stagger reveals */
export function splitWords(el: HTMLElement | null) {
  if (!el || el.dataset.split === '1') return;
  const text = el.textContent || '';
  el.setAttribute('aria-label', text);
  el.innerHTML = text
    .split(/(\s+)/)
    .map((token) => {
      if (/^\s+$/.test(token)) return token;
      return `<span class="c-word"><span class="c-word-inner">${token}</span></span>`;
    })
    .join('');
  el.dataset.split = '1';
}

export function useCampaignMotion(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const heroWords = el.querySelectorAll<HTMLElement>('[data-hero-words] .c-word-inner');
      const heroSupport = el.querySelector<HTMLElement>('[data-hero-support]');
      const heroCta = el.querySelector<HTMLElement>('[data-hero-cta]');
      const heroMedia = el.querySelector<HTMLElement>('[data-hero-media]');
      const heroBrand = el.querySelector<HTMLElement>('[data-hero-brand]');

      if (reduced) {
        gsap.set([heroWords, heroSupport, heroCta, heroMedia, heroBrand], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          clipPath: 'none',
        });
      } else {
        gsap.set(heroMedia, { clipPath: 'inset(12% 8% 12% 8%)', scale: 1.08 });
        gsap.set(heroWords, { yPercent: 110 });
        gsap.set([heroSupport, heroCta, heroBrand], { opacity: 0, y: 24 });

        const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
        intro
          .to(heroMedia, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.35 }, 0)
          .to(heroBrand, { opacity: 1, y: 0, duration: 0.7 }, 0.35)
          .to(heroWords, { yPercent: 0, duration: 0.9, stagger: 0.045 }, 0.45)
          .to(heroSupport, { opacity: 1, y: 0, duration: 0.7 }, 0.85)
          .to(heroCta, { opacity: 1, y: 0, duration: 0.65 }, 1.0);
      }

      if (reduced) {
        gsap.set(el.querySelectorAll('[data-reveal], [data-mask], [data-line]'), {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          clipPath: 'none',
        });
        return;
      }

      el.querySelectorAll<HTMLElement>('[data-line]').forEach((node) => {
        splitWords(node);
        const inners = node.querySelectorAll('.c-word-inner');
        gsap.set(inners, { yPercent: 115 });
        ScrollTrigger.create({
          trigger: node,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.to(inners, {
              yPercent: 0,
              duration: 0.85,
              stagger: 0.03,
              ease: 'power4.out',
            });
          },
        });
      });

      el.querySelectorAll<HTMLElement>('[data-mask]').forEach((node) => {
        gsap.set(node, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.to(node, {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top 90%',
            end: 'top 35%',
            scrub: true,
          },
        });
      });

      el.querySelectorAll<HTMLElement>('[data-reveal]').forEach((node) => {
        gsap.from(node, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: node,
            start: 'top 85%',
            once: true,
          },
        });
      });

      const strip = el.querySelector<HTMLElement>('[data-strip]');
      const stripTrack = el.querySelector<HTMLElement>('[data-strip-track]');
      if (strip && stripTrack) {
        const getScroll = () => Math.max(0, stripTrack.scrollWidth - strip.clientWidth);
        gsap.to(stripTrack, {
          x: () => -getScroll(),
          ease: 'none',
          scrollTrigger: {
            trigger: strip,
            start: 'top top',
            end: () => `+=${getScroll() + window.innerHeight * 0.6}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });
      }

      const ambient = el.querySelector<HTMLElement>('[data-ambient]');
      if (ambient) {
        gsap.fromTo(
          ambient,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: ambient.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [root]);
}
