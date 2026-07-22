'use client';

import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from '@tabler/icons-react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

const Skeleton = ({ className = '' }: { className?: string }) => (
  <div
    className={`flex h-full min-h-[6rem] w-full flex-1 rounded-xl bg-gradient-to-br from-[#1E1C19] to-[#0C0C0B] border border-[#2A2824] ${className}`}
  />
);

const ScoreSkeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 flex-col justify-end rounded-xl border border-[#2A2824] bg-[#0C0C0B] p-4">
    <span className="font-mono text-4xl text-[#C4785A]">47%</span>
    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#2A2824]">
      <div className="h-full w-[47%] rounded-full bg-[#C4785A]" />
    </div>
  </div>
);

const GapsSkeleton = () => (
  <div className="flex h-full min-h-[6rem] w-full flex-1 flex-wrap content-end gap-2 rounded-xl border border-[#2A2824] bg-[#0C0C0B] p-4">
    {['Kubernetes', 'CI/CD', 'OKRs'].map((k) => (
      <span
        key={k}
        className="font-mono rounded border border-[#C4A574]/30 px-2 py-1 text-[0.65rem] text-[#C4A574]"
      >
        {k}
      </span>
    ))}
  </div>
);

/**
 * Aceternity BentoGrid demo structure — HireReady product cells.
 * Source: @aceternity/bento-grid (+ demo layout pattern)
 */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-[#2A2824] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto mb-12 max-w-7xl md:mb-16">
        <h2 className="font-display max-w-xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-[#F2EFE8]">
          Three steps. Under thirty seconds.
        </h2>
        <p className="font-body prose-landing mt-4 max-w-lg text-[#A39E93]">
          Upload, paste the posting, leave with a score, gaps, and a rewrite you can edit.
        </p>
      </div>

      <BentoGrid className="max-w-7xl mx-auto">
        <BentoGridItem
          title="Upload your resume"
          description="PDF or DOCX. We read skills, titles, and experience the way an ATS parser would."
          header={<Skeleton />}
          icon={<IconClipboardCopy className="h-4 w-4 text-[#C4A574]" />}
          className="md:col-span-2"
        />
        <BentoGridItem
          title="Paste the JD"
          description="The posting you want. Keywords and requirements mapped line by line."
          header={<Skeleton />}
          icon={<IconFileBroken className="h-4 w-4 text-[#C4A574]" />}
        />
        <BentoGridItem
          title="Match score"
          description="Mono % you can trust. Coral when you fail the filter."
          header={<ScoreSkeleton />}
          icon={<IconTableColumn className="h-4 w-4 text-[#C4A574]" />}
        />
        <BentoGridItem
          title="Gaps + rewrite"
          description="Missing language as chips. AI rewrite maps your real experience — no invented jobs."
          header={<GapsSkeleton />}
          icon={<IconSignature className="h-4 w-4 text-[#C4A574]" />}
          className="md:col-span-2"
        />
      </BentoGrid>
    </section>
  );
}
