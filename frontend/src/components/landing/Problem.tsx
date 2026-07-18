'use client';

import { useRef } from 'react';
import { useSectionReveal } from './useLandingGsap';

export default function Problem() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section ref={root} className="py-28 md:py-36 px-6 border-t border-[#2A2824]">
      <div className="max-w-[900px] mx-auto">
        <p
          data-reveal
          className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A574] mb-8 opacity-0"
        >
          The filter
        </p>
        <h2
          data-reveal
          className="font-display text-4xl md:text-6xl text-[#F2EFE8] leading-[1.05] tracking-tight mb-10 opacity-0"
        >
          Your resume is losing to an algorithm.
        </h2>
        <div
          data-reveal
          className="paper-panel p-8 md:p-12 opacity-0"
        >
          <p className="font-display text-2xl md:text-3xl text-[#1A1814] leading-snug mb-6">
            Keyword mismatches and silent formatting errors disqualify good people every day —
            before a recruiter reads a word.
          </p>
          <p className="font-body text-base text-[#1A1814]/75 leading-relaxed">
            Applicant Tracking Systems discard most applications automatically. HireReady shows
            the match score, the missing language, and rewrites what the robots need to see —
            without inventing experience you don&apos;t have.
          </p>
        </div>
      </div>
    </section>
  );
}
