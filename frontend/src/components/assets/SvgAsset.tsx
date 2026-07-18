'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

type Props = {
  src: string;
  alt?: string;
  className?: string;
  float?: boolean;
};

/** Inline-friendly animated SVG asset plate. */
export default function SvgAsset({ src, alt = '', className = '', float = true }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!float || !root.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const img = root.current.querySelector('img');
    if (!img) return;
    const ctx = gsap.context(() => {
      gsap.to(img, {
        y: -8,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, root);
    return () => ctx.revert();
  }, [float]);

  return (
    <div ref={root} className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-auto select-none" draggable={false} />
    </div>
  );
}
