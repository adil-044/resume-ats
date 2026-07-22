"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Aceternity Floating Navbar — remapped to HireReady graphite/copper. */
export const FloatingNav = ({
  navItems,
  className,
  ctaLabel = "Get ATS-ready",
  ctaHref = "/auth/login",
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious() ?? 0;
      const direction = current - previous;

      if (scrollYProgress.get() < 0.02) {
        setVisible(true);
      } else if (direction < 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "fixed inset-x-0 top-6 z-[5000] mx-auto flex max-w-fit items-center justify-center",
          className
        )}
      >
        <div className="flex items-center justify-center gap-2 rounded-full border border-[#2A2824] bg-[#0C0C0B]/85 px-2 py-1.5 shadow-lg shadow-black/40 backdrop-blur-md">
          <Link
            href="/"
            className="font-display px-3 text-sm text-[#F2EFE8] tracking-tight"
          >
            HireReady
          </Link>

          <div className="h-5 w-px bg-[#2A2824]" />

          <div className="flex items-center gap-1">
            {navItems.map((navItem, idx) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className="relative flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-[#A39E93] transition-colors hover:bg-[#161614] hover:text-[#F2EFE8]"
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          <div className="h-5 w-px bg-[#2A2824]" />

          <Link
            href={ctaHref}
            className="relative rounded-full bg-[#C4A574] px-4 py-2 text-sm font-semibold text-[#0C0C0B] transition-colors hover:bg-[#D4B88A]"
          >
            {ctaLabel}
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
