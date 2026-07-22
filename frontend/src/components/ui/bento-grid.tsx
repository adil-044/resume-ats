import { cn } from "@/lib/utils";

/** Aceternity BentoGrid — remapped to HireReady graphite/copper. */
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
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
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
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-[#2A2824] bg-[#161614] p-4 transition duration-200 hover:border-[#C4A574]/40 hover:shadow-[0_4px_24px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="mt-2 mb-2 font-display text-lg text-[#F2EFE8]">{title}</div>
        <div className="font-body text-xs font-normal leading-relaxed text-[#A39E93]">
          {description}
        </div>
      </div>
    </div>
  );
};
