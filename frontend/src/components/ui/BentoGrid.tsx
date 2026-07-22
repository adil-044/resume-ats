'use client';

import { cn } from '@/lib/utils';
import React from 'react';

/** Aceternity-style bento — remapped to HireReady graphite/copper. */
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-[1200px] grid-cols-1 gap-4 md:auto-rows-[minmax(11rem,auto)] md:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  children,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        'group/bento flex flex-col justify-between space-y-4 rounded-xl border border-[#2A2824] bg-[#161614] p-6 transition-colors duration-300 hover:border-[#C4A574]/40 md:p-8',
        className
      )}
    >
      {header}
      <div>
        {title && (
          <h3 className="font-display mb-2 text-xl text-[#F2EFE8] md:text-2xl">{title}</h3>
        )}
        {description && (
          <p className="font-body text-sm leading-relaxed text-[#A39E93]">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
};
