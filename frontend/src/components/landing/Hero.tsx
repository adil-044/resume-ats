'use client';

import Link from 'next/link';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { Spotlight } from '@/components/ui/spotlight-new';
import MatchArtifact from './MatchArtifact';

/**
 * Built on Aceternity free blocks:
 * - @aceternity/hero-highlight
 * - @aceternity/spotlight-new
 * Remapped to HireReady graphite/paper/copper.
 */
export default function Hero() {
  return (
    <HeroHighlight
      containerClassName="min-h-[100svh] h-auto py-28 md:py-32"
      className="mx-auto w-full max-w-[1200px] px-5 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Spotlight />
      </div>

      <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 xl:col-span-7">
          <p className="font-display mb-6 text-3xl tracking-[-0.02em] text-[#F2EFE8] sm:text-4xl">
            HireReady
          </p>

          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] tracking-[-0.03em] text-[#F2EFE8]">
            <span className="block">Stop getting</span>
            <span className="mt-1 block">
              <Highlight className="text-[#0C0C0B]">ghosted by ATS.</Highlight>
            </span>
          </h1>

          <p className="font-body prose-landing mt-8 max-w-md text-base leading-relaxed text-[#A39E93] md:text-lg">
            Paste resume + job description. See the match score, keyword gaps, and a rewrite the
            filter can read — before a human never sees you.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/auth/login"
              className="btn-signal inline-flex items-center rounded-md px-8 py-4 text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574]"
            >
              Get ATS-ready
            </Link>
            <a
              href="#how-it-works"
              className="font-body text-sm text-[#A39E93] underline decoration-[#2A2824] underline-offset-4 transition-colors hover:text-[#F2EFE8] hover:decoration-[#C4A574]"
            >
              How it works
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-5 lg:justify-self-end">
          <MatchArtifact />
        </div>
      </div>
    </HeroHighlight>
  );
}
