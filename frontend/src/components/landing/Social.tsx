'use client';

import { HoverEffect } from '@/components/ui/card-hover-effect';

/**
 * Aceternity Card Hover Effect — product outcomes (not fake testimonials).
 * Source: @aceternity/card-hover-effect
 */
export default function Social() {
  return (
    <section
      id="what-you-get"
      className="border-t border-[#2A2824] px-5 py-20 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display max-w-xl text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#F2EFE8]">
          What you actually leave with.
        </h2>
        <p className="font-body prose-landing mt-4 max-w-lg text-[#A39E93]">
          No invented hire rates. The product is the proof.
        </p>

        <HoverEffect
          className="lg:grid-cols-4"
          items={[
            {
              title: 'Match score',
              description:
                'A clear percentage against the job you pasted — not a mystery optimize score.',
              link: '/#analyzer',
            },
            {
              title: 'Keyword gaps',
              description:
                'The language the ATS expects, listed so you decide what is true for you.',
              link: '/#analyzer',
            },
            {
              title: 'Editable rewrite',
              description:
                'Bullets remapped to the JD. You keep the facts; the robot gets the phrasing.',
              link: '/auth/login',
            },
            {
              title: 'Export PDF',
              description: 'Clean export. Core toolkit stays free — no card required.',
              link: '/auth/login',
            },
          ]}
        />
      </div>
    </section>
  );
}
