'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useHeroTimeline } from './useLandingGsap';
import {
  CinematicMedia,
  resolveHeroMedia,
  type MediaSources,
} from '@/components/cinematic/CinematicMedia';

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-[#0C0C0B]" />,
});

const HEADLINE = ['Stop getting', 'ghosted by ATS.'];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useHeroTimeline(root);
  const [media, setMedia] = useState<MediaSources>({});

  useEffect(() => {
    resolveHeroMedia().then(setMedia);
  }, []);

  const hasFilm = Boolean(media.video || media.poster);

  return (
    <section
      ref={root}
      className="relative min-h-screen flex flex-col justify-end md:justify-center px-6 pt-28 pb-20 overflow-hidden"
    >
      {hasFilm ? (
        <div className="absolute inset-0 -z-10">
          <CinematicMedia sources={media} intensity={1.1} />
        </div>
      ) : (
        <HeroCanvas />
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto w-full">
        <p
          data-hero="brand"
          className="font-display text-4xl md:text-5xl text-[#F2EFE8] mb-8 md:mb-12 tracking-tight opacity-0"
        >
          HireReady
        </p>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#F2EFE8] leading-[0.95] tracking-tight max-w-4xl mb-8">
          {HEADLINE.map((line, li) => (
            <span key={li} className="block">
              {line.split(' ').map((word, wi) => (
                <span
                  key={`${li}-${wi}`}
                  data-hero="word"
                  className="inline-block mr-[0.28em] opacity-0 last:mr-0"
                  style={li === 1 ? { color: '#C4A574' } : undefined}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          data-hero="sub"
          className="font-body text-base md:text-lg text-[#A39E93] max-w-xl leading-relaxed mb-10 opacity-0"
        >
          73% of resumes never reach a human. Match yours to the job, see the gaps, fix them —
          before the algorithm decides.
        </p>

        <div data-hero="cta" className="flex flex-wrap items-center gap-6 opacity-0">
          <Link
            href="/auth/login"
            className="btn-signal inline-flex items-center px-8 py-4 rounded-md text-sm tracking-wide"
          >
            Analyze free
          </Link>
          <a
            href="#how-it-works"
            className="font-body text-sm text-[#A39E93] hover:text-[#F2EFE8] transition-colors underline underline-offset-4 decoration-[#2A2824] hover:decoration-[#C4A574]"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
