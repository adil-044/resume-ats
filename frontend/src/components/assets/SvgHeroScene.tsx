'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Full-bleed isometric SVG hero plate (geometric — Impeccable-safe, not sketchy). */
export default function SvgHeroScene() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const img = el.querySelector('img');
    if (!img) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { opacity: 0, y: 28, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out' }
      );
      gsap.to(img, {
        y: -12,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(img, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      className="absolute inset-0 -z-10 flex items-center justify-end pointer-events-none"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#0C0C0B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0B] via-[#0C0C0B]/80 to-transparent z-[1]" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/svg/hero-scene.svg"
        alt=""
        className="relative z-[2] w-[min(92vw,720px)] h-auto mr-[-4%] md:mr-[4%] mt-16 md:mt-0 opacity-90"
      />
    </div>
  );
}
