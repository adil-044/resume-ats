'use client';

import Link from 'next/link';
import { BackgroundBeams } from '@/components/ui/background-beams';

/**
 * Aceternity Background Beams CTA — copper remapped.
 * Source: @aceternity/background-beams
 */
export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-[#2A2824] px-5 py-24 md:px-8 md:py-32">
      <BackgroundBeams className="opacity-70" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-[#F2EFE8]">
          Make the robot let you through.
        </h2>
        <p className="font-body prose-landing mx-auto mt-6 max-w-lg text-base text-[#A39E93] md:text-lg">
          Free core forever. No card. Upload, paste a job, leave with a resume that speaks ATS.
        </p>
        <div className="mt-10">
          <Link
            href="/auth/login"
            className="btn-signal inline-flex items-center rounded-md px-10 py-4 text-sm tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574]"
          >
            Get ATS-ready
          </Link>
        </div>
      </div>
    </section>
  );
}
