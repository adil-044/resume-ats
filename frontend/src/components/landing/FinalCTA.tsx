'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useSectionReveal } from './useLandingGsap';

export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section ref={root} className="py-28 md:py-40 px-6 border-t border-[#2A2824]">
      <div className="max-w-[900px] mx-auto text-center">
        <h2
          data-reveal
          className="font-display text-4xl md:text-6xl lg:text-7xl text-[#F2EFE8] leading-[1.05] tracking-tight mb-8 opacity-0"
        >
          Make the robot let you through.
        </h2>
        <p
          data-reveal
          className="font-body text-base md:text-lg text-[#A39E93] max-w-lg mx-auto mb-12 opacity-0"
        >
          Free core forever. No card. Upload, paste a job, leave with a resume that speaks ATS.
        </p>
        <div data-reveal className="opacity-0">
          <Link
            href="/auth/login"
            className="btn-signal inline-flex items-center px-10 py-4 rounded-md text-sm tracking-wide"
          >
            Start free
          </Link>
        </div>
      </div>
    </section>
  );
}
