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
import SvgHeroScene from '@/components/assets/SvgHeroScene';
import MatchArtifact from './MatchArtifact';

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 -z-10 bg-[#0C0C0B]" />,
});

const LINE_1 = ['Stop', 'getting'];
const LINE_2 = ['ghosted', 'by', 'ATS.'];

/**
 * Scene: anxious job seeker, night laptop — graphite + copper restrained + paper artifact.
 * Hero budget: brand · one headline · one support · CTA group · one dominant visual.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useHeroTimeline(root);
  const [media, setMedia] = useState<MediaSources>({});
  const [prefer3d, setPrefer3d] = useState(false);

  useEffect(() => {
    resolveHeroMedia().then(setMedia);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefer3d(
      new URLSearchParams(window.location.search).get('hero') === '3d' && !mq.matches
    );
  }, []);

  const hasFilm = Boolean(media.video || media.poster);

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] flex items-center overflow-hidden copper-spotlight px-5 md:px-8 pt-28 pb-16 md:pb-24"
    >
      {hasFilm ? (
        <div className="absolute inset-0 -z-10 opacity-40">
          <CinematicMedia sources={media} intensity={0.9} />
        </div>
      ) : prefer3d ? (
        <HeroCanvas />
      ) : (
        <div className="absolute inset-0 -z-10 opacity-[0.35] hidden lg:block">
          <SvgHeroScene />
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        <div className="lg:col-span-6 xl:col-span-7">
          <p
            data-hero="brand"
            className="font-display text-3xl sm:text-4xl md:text-5xl text-[#F2EFE8] mb-8 tracking-[-0.02em] opacity-0"
          >
            HireReady
          </p>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] text-[#F2EFE8] leading-[0.98] tracking-[-0.03em] mb-6">
            <span className="block">
              {LINE_1.map((word) => (
                <span
                  key={word}
                  data-hero="word"
                  className="inline-block mr-[0.28em] opacity-0 last:mr-0"
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="block text-[#C4A574]">
              {LINE_2.map((word) => (
                <span
                  key={word}
                  data-hero="word"
                  className="inline-block mr-[0.28em] opacity-0 last:mr-0"
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          <p
            data-hero="sub"
            className="font-body text-base md:text-lg text-[#A39E93] max-w-md leading-relaxed mb-10 opacity-0 prose-landing"
          >
            Paste resume + job description. See the match score, keyword gaps, and a rewrite the
            filter can read — before a human never sees you.
          </p>

          <div data-hero="cta" className="flex flex-wrap items-center gap-5 opacity-0">
            <Link
              href="/auth/login"
              className="btn-signal inline-flex items-center px-8 py-4 rounded-md text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574]"
            >
              Get ATS-ready
            </Link>
            <a
              href="#how-it-works"
              className="font-body text-sm text-[#A39E93] hover:text-[#F2EFE8] transition-colors underline underline-offset-4 decoration-[#2A2824] hover:decoration-[#C4A574]"
            >
              How it works
            </a>
          </div>
        </div>

        <div
          data-hero="visual"
          className="lg:col-span-6 xl:col-span-5 opacity-0 lg:justify-self-end"
        >
          <MatchArtifact />
        </div>
      </div>
    </section>
  );
}
