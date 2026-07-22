'use client';

import { useEffect, useRef, useState } from 'react';
import { useSectionReveal } from '@/components/landing/useLandingGsap';
import { useScrollScrubImages, mediaExists } from '@/components/cinematic/CinematicMedia';

const CANDIDATES = [
  '/media/ambient/scene-01.jpg',
  '/media/ambient/scene-02.jpg',
  '/media/ambient/scene-03.jpg',
];

/** Scroll-scrub plate when ambient media exists; else compact craft band. */
export default function AmbientScrub() {
  const root = useRef<HTMLElement>(null);
  const [images, setImages] = useState<string[]>([]);
  useSectionReveal(root);
  useScrollScrubImages(root);

  useEffect(() => {
    (async () => {
      const found: string[] = [];
      for (const path of CANDIDATES) {
        if (await mediaExists(path)) found.push(path);
      }
      setImages(found);
    })();
  }, []);

  if (images.length === 0) {
    return (
      <section
        ref={root}
        className="border-t border-[#2A2824] px-5 md:px-8 py-16 md:py-20"
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <p
            data-reveal
            className="md:col-span-4 font-mono text-xs tracking-[0.18em] text-[#6B675F] opacity-0"
          >
            Night desk · filter first
          </p>
          <p
            data-reveal
            className="md:col-span-8 font-display text-2xl md:text-3xl text-[#F2EFE8] leading-snug tracking-[-0.02em] opacity-0"
          >
            Built for the anxious apply session — not a career-coach landing with fake hire rates.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={root}
      className="relative h-[140vh] border-t border-[#2A2824] overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-end md:items-center px-5 md:px-8 py-20">
        <div className="absolute inset-0">
          {images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              data-scrub-img
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-0"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C0C0B] via-[#0C0C0B]/55 to-transparent" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h2
            data-reveal
            className="font-display text-4xl md:text-6xl text-[#F2EFE8] leading-[1.05] tracking-[-0.02em] opacity-0"
          >
            Built for the night apply session.
          </h2>
        </div>
      </div>
    </section>
  );
}
