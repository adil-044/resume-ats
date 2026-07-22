'use client';

import { useRef } from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { useSectionReveal } from './useLandingGsap';

/** Bento how-it-works — Aceternity structure, HireReady tokens. Real sequence = numbers OK. */
export default function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  useSectionReveal(section);

  return (
    <section
      id="how-it-works"
      ref={section}
      className="py-20 md:py-28 px-5 md:px-8 border-t border-[#2A2824]"
    >
      <div className="max-w-[1200px] mx-auto mb-12 md:mb-16">
        <h2
          data-reveal
          className="font-display text-[clamp(2rem,4vw,3.25rem)] text-[#F2EFE8] leading-[1.05] tracking-[-0.02em] max-w-xl opacity-0"
        >
          Three steps. Under thirty seconds.
        </h2>
        <p
          data-reveal
          className="font-body mt-4 max-w-lg text-[#A39E93] leading-relaxed opacity-0 prose-landing"
        >
          Upload, paste the posting, leave with a score, gaps, and a rewrite you can edit.
        </p>
      </div>

      <div data-reveal className="opacity-0">
        <BentoGrid>
          <BentoGridItem
            className="md:col-span-2 md:row-span-1"
            title="Upload your resume"
            description="PDF or DOCX. We read skills, titles, and experience the way an ATS parser would — not the way a designer would."
            header={
              <span className="font-mono text-xs tracking-widest text-[#C4A574]">01 · Resume</span>
            }
          >
            <div className="mt-4 flex items-center gap-3 rounded-md border border-[#2A2824] bg-[#0C0C0B] px-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/svg/resume-single.svg" alt="" className="h-10 w-10 opacity-80" />
              <span className="font-mono text-xs text-[#A39E93]">resume_v3.pdf</span>
            </div>
          </BentoGridItem>

          <BentoGridItem
            className="md:col-span-1"
            title="Paste the JD"
            description="The posting you want. Keywords and requirements mapped line by line."
            header={
              <span className="font-mono text-xs tracking-widest text-[#6B675F]">02 · Job</span>
            }
          />

          <BentoGridItem
            className="md:col-span-1"
            title="Match score"
            description="Mono % you can trust. Coral when you fail the filter — success when you clear it."
            header={
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl text-[#C4785A]">47</span>
                <span className="font-mono text-sm text-[#6B675F]">%</span>
              </div>
            }
          />

          <BentoGridItem
            className="md:col-span-2"
            title="Gaps + rewrite"
            description="Missing language as chips. AI rewrite maps your real experience to the JD — no invented jobs."
            header={
              <span className="font-mono text-xs tracking-widest text-[#C4A574]">03 · Fix</span>
            }
          >
            <div className="mt-3 flex flex-wrap gap-2">
              {['Kubernetes', 'CI/CD', 'OKRs'].map((k) => (
                <span
                  key={k}
                  className="font-mono text-[0.7rem] rounded border border-[#C4A574]/30 px-2 py-1 text-[#C4A574]"
                >
                  {k}
                </span>
              ))}
            </div>
          </BentoGridItem>
        </BentoGrid>
      </div>
    </section>
  );
}
