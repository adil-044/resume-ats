'use client';

import { useEffect, useRef, useState } from 'react';
import { useSectionReveal } from '@/components/landing/useLandingGsap';
import { useScrollScrubImages, mediaExists } from '@/components/cinematic/CinematicMedia';

const CANDIDATES = [
  '/media/ambient/scene-01.jpg',
  '/media/ambient/scene-02.jpg',
  '/media/ambient/scene-03.jpg',
];

/** Scroll-scrub cinematic plate — activates when you drop scene-0N.jpg into /media/ambient/ */
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

  if (images.length === 0) return null;

  return (
    <section
      ref={root}
      className="relative h-[140vh] border-t border-[#2A2824] overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-end md:items-center px-6 py-20">
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
          <p data-reveal className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A574] mb-4 opacity-0">
            Atmosphere
          </p>
          <h2 data-reveal className="font-display text-4xl md:text-6xl text-[#F2EFE8] leading-[1.05] opacity-0">
            Cinematic proof, scroll-locked.
          </h2>
        </div>
      </div>
    </section>
  );
}
