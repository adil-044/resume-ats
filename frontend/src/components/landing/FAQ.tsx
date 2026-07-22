'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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

/** shadcn Accordion — FAQ chrome. */
export default function FAQ() {
  return (
    <section id="faq" className="border-t border-[#2A2824] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[800px]">
        <h2 className="font-display mb-10 text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#F2EFE8]">
          Straight answers.
        </h2>

        <Accordion>
          {ITEMS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`item-${i}`}
              className="border-[#2A2824]"
            >
              <AccordionTrigger className="font-display py-5 text-left text-xl text-[#F2EFE8] hover:no-underline md:text-2xl">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="font-body pb-5 text-sm leading-relaxed text-[#A39E93]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
