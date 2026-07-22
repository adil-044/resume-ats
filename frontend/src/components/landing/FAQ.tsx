'use client';

import { useRef, useState } from 'react';
import { useSectionReveal } from './useLandingGsap';

const ITEMS = [
  {
    q: 'How is this different from Jobscan or Resumatic?',
    a: 'Those tools score keywords and leave you to rewrite. HireReady rewrites bullets to fit the job, flags formatting that kills ATS parses, and can generate a matching cover letter. Core toolkit stays free.',
  },
  {
    q: 'Is it really free? What’s the catch?',
    a: 'Core features — analysis, gap scoring, AI rewrite, cover letter — are permanently free. Optional premium may come later; the ATS toolkit will not be paywalled.',
  },
  {
    q: 'Will this actually help me get hired?',
    a: 'It helps your resume reach a human. Interviews and experience are still on you. We fix the filter problem.',
  },
  {
    q: 'Is my resume data safe?',
    a: 'Encrypted in transit and at rest. We don’t sell your data. You can request deletion anytime.',
  },
  {
    q: 'How accurate is the ATS scoring?',
    a: 'Based on keyword-matching logic used by major ATS platforms. It’s an approximation, not a live Workday hook. Methodology lives on the docs page.',
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#2A2824]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A574]"
      >
        <span className="font-display text-xl md:text-2xl text-[#F2EFE8] tracking-[-0.02em]">
          {q}
        </span>
        <span className="font-mono text-[#C4A574] text-lg shrink-0 mt-1" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p className="font-body text-sm text-[#A39E93] leading-relaxed pb-6 max-w-2xl prose-landing">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQ() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section ref={root} className="py-20 md:py-28 px-5 md:px-8 border-t border-[#2A2824]">
      <div className="max-w-[800px] mx-auto">
        <h2
          data-reveal
          className="font-display text-[clamp(2rem,4vw,3rem)] text-[#F2EFE8] leading-[1.05] tracking-[-0.02em] mb-10 opacity-0"
        >
          Straight answers.
        </h2>
        <div data-reveal className="opacity-0">
          {ITEMS.map((item) => (
            <Item key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
