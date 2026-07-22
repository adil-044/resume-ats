'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useSectionReveal } from './useLandingGsap';

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section ref={root} className="py-20 md:py-28 px-5 md:px-8">
      <div
        data-reveal
        className="max-w-[1200px] mx-auto paper-panel px-8 py-14 md:px-16 md:py-20 opacity-0"
      >
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] text-[#1A1814] leading-[1.05] tracking-[-0.02em] mb-5">
            Make the robot let you through.
          </h2>
          <p className="font-body text-base md:text-lg text-[#1A1814]/70 max-w-lg mb-10 prose-landing">
            Free core forever. No card. Upload, paste a job, leave with a resume that speaks ATS.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-10 py-4 rounded-md text-sm font-body font-semibold bg-[#1A1814] text-[#EDE6D9] hover:bg-[#0C0C0B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574]"
          >
            Get ATS-ready
          </Link>
        </div>
      </div>
    </section>
  );
}
