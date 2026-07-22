'use client';

import { useRef } from 'react';
import { useSectionReveal } from './useLandingGsap';

/** Problem band — paper document metaphor (no competing template chrome). */
export default function Problem() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section ref={root} className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2
            data-reveal
            className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-[#F2EFE8] opacity-0"
          >
            Your resume is losing to an algorithm.
          </h2>
        </div>

        <div data-reveal className="lg:col-span-7 opacity-0">
          <div className="paper-panel p-8 md:p-12">
            <p className="font-display mb-6 text-2xl leading-snug text-[#1A1814] md:text-3xl">
              Keyword mismatches and silent formatting errors disqualify good people every day —
              before a recruiter reads a word.
            </p>
            <p className="font-body prose-landing max-w-[65ch] text-base leading-relaxed text-[#1A1814]/75">
              Applicant Tracking Systems discard most applications automatically. HireReady shows
              the match score, the missing language, and rewrites what the robots need to see —
              without inventing experience you don&apos;t have.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
