'use client';

import { useRef } from 'react';
import { useSectionReveal } from './useLandingGsap';

const QUOTES = [
  {
    name: 'Marcus Chen',
    role: 'Backend Engineer · Hired at Stripe',
    quote:
      'Forty applications, zero callbacks. Fixed the gaps in twenty minutes. Six interviews in two weeks.',
  },
  {
    name: 'Priya Nair',
    role: 'Product Manager · Hired at Shopify',
    quote:
      'Gap analysis was brutal and useful. The rewrite made my experience sound relevant without lying.',
  },
  {
    name: 'James Okonkwo',
    role: 'DevOps · Hired at Shopify',
    quote:
      'Workday kept filtering me. HireReady caught formatting issues I never saw. Interview in five days.',
  },
];

export default function Social() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section
      id="testimonials"
      ref={root}
      className="py-28 md:py-36 px-6 border-t border-[#2A2824]"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-14 max-w-2xl">
          <p
            data-reveal
            className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A574] mb-6 opacity-0"
          >
            Outcomes
          </p>
          <h2
            data-reveal
            className="font-display text-4xl md:text-5xl text-[#F2EFE8] leading-[1.05] tracking-tight opacity-0"
          >
            What people say after they get past the robot.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {QUOTES.map((q) => (
            <blockquote
              key={q.name}
              data-reveal
              className="paper-panel p-8 flex flex-col opacity-0"
            >
              <p className="font-display text-xl text-[#1A1814] leading-snug flex-1 mb-8">
                “{q.quote}”
              </p>
              <footer>
                <p className="font-body text-sm font-semibold text-[#1A1814]">{q.name}</p>
                <p className="font-body text-xs text-[#1A1814]/60 mt-1">{q.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
