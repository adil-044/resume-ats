'use client';

import { useLayoutEffect, useRef, useState, useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type MediaSources = {
  video?: string;
  poster?: string;
  overlay?: string;
};

export async function mediaExists(path: string): Promise<boolean> {
  try {
    const res = await fetch(path, { method: 'HEAD', cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function resolveHeroMedia(): Promise<MediaSources> {
  const video = '/media/hero/loop.mp4';
  const poster = '/media/hero/poster.jpg';
  const overlay = '/media/hero/overlay.png';
  const [hasVideo, hasPoster, hasOverlay] = await Promise.all([
    mediaExists(video),
    mediaExists(poster),
    mediaExists(overlay),
  ]);
  return {
    video: hasVideo ? video : undefined,
    poster: hasPoster ? poster : undefined,
    overlay: hasOverlay ? overlay : undefined,
  };
}

export function CinematicMedia({
  sources,
  className = '',
  parallax = true,
  intensity = 1,
}: {
  sources: MediaSources;
  className?: string;
  parallax?: boolean;
  intensity?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(Boolean(sources.video || sources.poster));
  }, [sources]);

  useLayoutEffect(() => {
    const el = root.current;
    const media = sources.video ? videoRef.current : imgRef.current;
    if (!el || !media || !ready || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { scale: 1.08, opacity: 0 },
        { scale: 1.02, opacity: 1, duration: 1.4, ease: 'power2.out' }
      );

      if (parallax) {
        gsap.to(media, {
          yPercent: 8 * intensity,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [ready, parallax, intensity, sources.video]);

  if (!ready) return null;

  return (
    <div ref={root} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden>
      {sources.video ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={sources.video}
          poster={sources.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : sources.poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={sources.poster}
          alt=""
        />
      ) : null}
      {sources.overlay && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={sources.overlay} alt="" className="absolute inset-0 h-full w-full object-cover mix-blend-soft-light opacity-60" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0C0C0B]/50 via-[#0C0C0B]/20 to-[#0C0C0B]" />
    </div>
  );
}

export function useScrollScrubImages(
  section: RefObject<HTMLElement | null>,
  imageSelector = '[data-scrub-img]'
) {
  useLayoutEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;

    const imgs = el.querySelectorAll(imageSelector);
    if (!imgs.length) return;

    const ctx = gsap.context(() => {
      gsap.set(imgs, { opacity: 0, scale: 1.1 });
      gsap.set(imgs[0], { opacity: 1, scale: 1 });

      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        scrub: 0.6,
        onUpdate: (self) => {
          const i = Math.min(imgs.length - 1, Math.floor(self.progress * imgs.length));
          imgs.forEach((node, idx) => {
            gsap.to(node, {
              opacity: idx === i ? 1 : 0,
              scale: idx === i ? 1 : 1.08,
              duration: 0.35,
              overwrite: true,
            });
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [section, imageSelector]);
}

export function useChromeEntrance(root: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) {
      if (el) gsap.set(el.querySelectorAll('[data-chrome]'), { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-chrome]'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out' }
      );
    }, el);
    return () => ctx.revert();
  }, [root]);
}
