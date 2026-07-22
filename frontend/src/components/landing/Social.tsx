'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useSectionReveal } from './useLandingGsap';

/**
 * Honest product recognition — replaces fake Stripe/Shopify quotes.
 * SixArm: no fake testimonials.
 */
export default function Social() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);

  return (
    <section
      id="what-you-get"
      ref={root}
      className="py-20 md:py-28 px-5 md:px-8 border-t border-[#2A2824]"
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2
              data-reveal
              className="font-display text-[clamp(2rem,4vw,3rem)] text-[#F2EFE8] leading-[1.05] tracking-[-0.02em] opacity-0"
            >
              What you actually leave with.
            </h2>
            <p
              data-reveal
              className="font-body mt-5 text-[#A39E93] leading-relaxed opacity-0 prose-landing"
            >
              No invented hire rates. No fake names at Stripe. The product is the proof.
            </p>
            <div data-reveal className="mt-8 opacity-0">
              <Link
                href="/#analyzer"
                className="font-body text-sm text-[#C4A574] underline underline-offset-4 decoration-[#C4A574]/40 hover:decoration-[#C4A574]"
              >
                Run a free scan
              </Link>
            </div>
          </div>

          <ul data-reveal className="lg:col-span-8 space-y-0 opacity-0">
            {[
              {
                title: 'Match score',
                body: 'A clear percentage against the job you pasted — not a mystery “optimize” score.',
              },
              {
                title: 'Keyword gaps',
                body: 'The language the ATS expects, listed so you can decide what is true for you.',
              },
              {
                title: 'Editable rewrite',
                body: 'Bullets remapped to the JD. You keep the facts; the robot gets the phrasing.',
              },
              {
                title: 'Export',
                body: 'Take a clean PDF out. Core toolkit stays free — no card required.',
              },
            ].map((item, i) => (
              <li
                key={item.title}
                className="grid grid-cols-[3rem_1fr] gap-4 border-t border-[#2A2824] py-7 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-sm text-[#6B675F]">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-xl text-[#F2EFE8] mb-2">{item.title}</h3>
                  <p className="font-body text-sm text-[#A39E93] leading-relaxed max-w-xl">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
