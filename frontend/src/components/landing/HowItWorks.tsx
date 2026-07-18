'use client';

import { useCallback, useRef, useState } from 'react';
import { useHowItWorksScroll, useSectionReveal } from './useLandingGsap';
import SvgAsset from '@/components/assets/SvgAsset';

const STEPS = [
  {
    num: '01',
    title: 'Upload your resume',
    desc: 'PDF or DOCX. We read skills, titles, and experience as the ATS would.',
  },
  {
    num: '02',
    title: 'Paste the job description',
    desc: 'The posting you want. We map keywords and requirements line by line.',
  },
  {
    num: '03',
    title: 'Get the match — and the fix',
    desc: 'Score, gaps, and an AI rewrite you can edit. Under thirty seconds.',
  },
];

export default function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const onProgress = useCallback((step: number) => setActive(step), []);
  useHowItWorksScroll(section, onProgress);
  useSectionReveal(section);

  return (
    <section
      id="how-it-works"
      ref={section}
      className="py-28 md:py-36 px-6 border-t border-[#2A2824]"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 md:mb-20">
          <div className="lg:col-span-7 max-w-2xl">
            <p
              data-reveal
              className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A574] mb-6 opacity-0"
            >
              How it works
            </p>
            <h2
              data-reveal
              className="font-display text-4xl md:text-6xl text-[#F2EFE8] leading-[1.05] tracking-tight opacity-0 text-balance"
            >
              Three steps. Thirty seconds.
            </h2>
          </div>
          <div data-reveal className="lg:col-span-5 opacity-0">
            <SvgAsset src="/media/svg/resume-stack.svg" className="w-full max-w-sm mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((s, i) => {
            const on = active === i;
            return (
              <div
                key={s.num}
                data-how-step
                data-reveal
                className={`surface-panel p-8 md:p-10 transition-colors duration-500 opacity-0 ${
                  on ? 'border-[#C4A574]/50' : 'border-[#2A2824]'
                }`}
              >
                <span
                  className={`font-mono text-sm tracking-widest mb-8 block ${
                    on ? 'text-[#C4A574]' : 'text-[#6B675F]'
                  }`}
                >
                  {s.num}
                </span>
                <h3 className="font-display text-2xl text-[#F2EFE8] mb-4">{s.title}</h3>
                <p className="font-body text-sm text-[#A39E93] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
