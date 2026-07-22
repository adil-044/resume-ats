'use client';

import { useRef } from 'react';
import { useSectionReveal } from './useLandingGsap';

/** One purpose: ATS ghosting pain. Paper = document metaphor. No section eyebrow. */
export default function Problem() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section ref={root} className="py-20 md:py-28 px-5 md:px-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <h2
            data-reveal
            className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#F2EFE8] leading-[1.05] tracking-[-0.02em] opacity-0"
          >
            Your resume is losing to an algorithm.
          </h2>
        </div>

        <div data-reveal className="lg:col-span-7 opacity-0">
          <div className="paper-panel p-8 md:p-12">
            <p className="font-display text-2xl md:text-3xl text-[#1A1814] leading-snug mb-6">
              Keyword mismatches and silent formatting errors disqualify good people every day —
              before a recruiter reads a word.
            </p>
            <p className="font-body text-base text-[#1A1814]/75 leading-relaxed max-w-[65ch] prose-landing">
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
