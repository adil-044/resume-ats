'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import {
  prefersReducedMotion,
  splitWords,
  useCampaignMotion,
} from './useCampaignMotion';

const WORKS = [
  {
    title: 'Match score',
    line: 'See the gap before the ghost.',
    img: '/media/campaign/focus.jpg',
    alt: 'Hands typing on a laptop in low light',
  },
  {
    title: 'Keyword gaps',
    line: 'What the ATS looks for — and you missed.',
    img: '/media/campaign/paper.jpg',
    alt: 'Resume pages and documents on a desk',
  },
  {
    title: 'Duty rewrite',
    line: 'XYZ bullets aligned to the posting.',
    img: '/media/campaign/city.jpg',
    alt: 'City lights through an office window at night',
  },
];

export default function CampaignLanding() {
  const root = useRef<HTMLDivElement>(null);
  const heroWordsRef = useRef<HTMLHeadingElement>(null);
  const rotatorRef = useRef<HTMLSpanElement>(null);

  useCampaignMotion(root);

  // Split hero words before entrance timeline runs
  useEffect(() => {
    if (heroWordsRef.current) splitWords(heroWordsRef.current);
  }, []);

  // Word rotator (owned here so cleanup is correct)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const node = rotatorRef.current;
    if (!node) return;
    const words = ['Filtered.', 'Ghosted.', 'Invisible.', 'Ignored.', 'Ready.'];
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % words.length;
      gsap.to(node, {
        yPercent: -35,
        opacity: 0,
        duration: 0.32,
        ease: 'power2.in',
        onComplete: () => {
          node.textContent = words[i];
          gsap.fromTo(
            node,
            { yPercent: 45, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }
          );
        },
      });
    }, 2500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      ref={root}
      className="campaign-root bg-[#0C0C0B] text-[#F2EFE8] overflow-x-hidden"
    >
      <style jsx global>{`
        .campaign-root .c-word {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.08em;
          margin-bottom: -0.08em;
        }
        .campaign-root .c-word-inner {
          display: inline-block;
          will-change: transform;
        }
        .campaign-plate {
          border: 1px solid rgba(242, 239, 232, 0.14);
          transition:
            border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .campaign-plate:hover {
          border-color: rgba(196, 165, 116, 0.55);
        }
        .campaign-plate img {
          transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .campaign-plate:hover img {
          transform: scale(1.06);
        }
        @media (prefers-reduced-motion: reduce) {
          .campaign-plate,
          .campaign-plate img {
            transition: none;
          }
        }
      `}</style>

      {/* ── Nav ── */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 sm:px-8 py-5 mix-blend-difference">
        <Link
          href="/"
          className="font-display text-xl sm:text-2xl tracking-tight text-[#F2EFE8]"
        >
          HireReady
        </Link>
        <Link
          href="/auth/login"
          className="font-body text-[11px] uppercase tracking-[0.18em] text-[#F2EFE8]/80 hover:text-[#F2EFE8] transition-colors"
        >
          Open app
        </Link>
      </header>

      {/* ── Hero: brand + one line + CTA + full-bleed media ── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-end">
        <div
          data-hero-media
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        >
          <Image
            src="/media/campaign/hero.jpg"
            alt="Laptop on a desk in low light — late-night job search"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0B] via-[#0C0C0B]/55 to-[#0C0C0B]/25" />
        </div>

        <div className="relative z-10 px-5 sm:px-8 pb-16 sm:pb-20 pt-32 max-w-[1200px]">
          <p
            data-hero-brand
            className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-[#F2EFE8] mb-8"
          >
            HireReady
          </p>

          <h1 className="max-w-[18ch]">
            <span
              ref={heroWordsRef}
              data-hero-words
              className="block font-display text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.1] tracking-[-0.025em] text-[#F2EFE8]"
            >
              Stop getting
            </span>
            <span className="block font-display text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.1] tracking-[-0.025em] text-[#C4A574] mt-1 h-[1.15em] overflow-hidden">
              <span ref={rotatorRef} className="inline-block">
                Filtered.
              </span>
            </span>
          </h1>

          <p
            data-hero-support
            className="mt-6 max-w-[36ch] font-body text-base sm:text-lg text-[#A39E93] leading-relaxed"
          >
            Paste resume + job. Get the match, the gaps, and a rewrite that frames real work — not AI resume sludge.
          </p>

          <div data-hero-cta className="mt-10">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#C4A574] text-[#0C0C0B] font-body font-semibold text-sm tracking-wide hover:bg-[#D4B88A] transition-colors"
            >
              Get ATS-ready — free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Tension ── */}
      <section className="relative px-5 sm:px-8 py-28 sm:py-36 max-w-[1200px] mx-auto">
        <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[#C4A574] mb-8" data-reveal>
          The filter
        </p>
        <h2
          data-line
          className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] tracking-[-0.03em] max-w-[16ch] text-[#F2EFE8]"
        >
          ATS does not reject you. It never sees you.
        </h2>
        <p
          data-reveal
          className="mt-10 max-w-[42ch] font-body text-lg text-[#A39E93] leading-relaxed"
        >
          Workday, Greenhouse, Lever — parse first, rank second, human last. HireReady shows the score against the posting you care about, then rewrites duties in XYZ form so the machine and the recruiter both get a usable document.
        </p>
      </section>

      {/* ── Horizontal works strip (pinned scrub) ── */}
      <section data-strip className="relative h-screen overflow-hidden border-y border-[#2A2824]">
        <div className="absolute top-8 left-5 sm:left-8 z-10">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[#C4A574]">
            What ships
          </p>
        </div>
        <div
          data-strip-track
          className="flex h-full items-center gap-6 sm:gap-10 px-5 sm:px-8 will-change-transform"
        >
          {WORKS.map((w) => (
            <article
              key={w.title}
              className="campaign-plate relative shrink-0 w-[min(78vw,520px)] h-[min(62vh,560px)] overflow-hidden bg-[#161614]"
            >
              <div className="absolute inset-0">
                <Image
                  src={w.img}
                  alt={w.alt}
                  fill
                  className="object-cover"
                  sizes="520px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0B] via-[#0C0C0B]/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <h3 className="font-display text-3xl sm:text-4xl tracking-tight text-[#F2EFE8]">
                  {w.title}
                </h3>
                <p className="mt-3 font-body text-sm sm:text-base text-[#A39E93] max-w-[28ch]">
                  {w.line}
                </p>
              </div>
            </article>
          ))}
          <div className="shrink-0 w-[12vw]" aria-hidden />
        </div>
      </section>

      {/* ── Artifact: paper + ambient video ── */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 px-5 sm:px-8 py-28 sm:py-36 max-w-[1200px] mx-auto items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <p className="font-body text-[11px] uppercase tracking-[0.22em] text-[#C4A574] mb-6" data-reveal>
            The rewrite
          </p>
          <h2
            data-line
            className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.1] tracking-[-0.03em] text-[#F2EFE8]"
          >
            Duties rewritten. Metrics kept honest.
          </h2>
          <p data-reveal className="mt-8 font-body text-[#A39E93] text-base sm:text-lg leading-relaxed max-w-[38ch]">
            Not a skills dump. Every bullet moves toward the posting — Accomplished X, measured by Y, by doing Z — without inventing employers or percentages you never earned.
          </p>
          <Link
            href="/auth/login"
            data-reveal
            className="inline-flex mt-10 font-body text-sm tracking-wide text-[#C4A574] border-b border-[#C4A574]/40 pb-1 hover:border-[#C4A574] transition-colors"
          >
            Try the analyzer →
          </Link>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 relative">
          <div
            data-mask
            className="relative aspect-[4/3] overflow-hidden border border-[#2A2824] bg-[#161614]"
          >
            <video
              data-ambient
              className="absolute inset-0 h-[120%] w-full object-cover top-[-10%]"
              src="/media/campaign/ambient.mp4"
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              aria-label="Ambient footage of typing on a laptop"
            />
            <div className="absolute inset-0 bg-[#0C0C0B]/35" />
          </div>
          <div
            data-reveal
            className="absolute -bottom-6 left-4 right-4 sm:left-8 sm:right-auto sm:w-[70%] bg-[#EDE6D9] text-[#1A1814] p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <p className="font-display text-xl sm:text-2xl tracking-tight leading-snug">
              “Stop getting ghosted by ATS.”
            </p>
            <p className="mt-3 font-body text-sm text-[#1A1814]/65">
              Graphite stage. Paper artifact. Copper signal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Proof strip ── */}
      <section className="border-t border-[#2A2824] px-5 sm:px-8 py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            { k: 'Free core', v: 'Score, gaps, rewrite, cover letter — no card.' },
            { k: 'Real stack', v: 'Next.js · Supabase · FastAPI · OpenRouter.' },
            { k: 'Live now', v: 'hire-ready.app — open the analyzer tonight.' },
          ].map((item) => (
            <div key={item.k} data-reveal>
              <p className="font-display text-2xl text-[#F2EFE8] tracking-tight">{item.k}</p>
              <p className="mt-3 font-body text-[#A39E93] leading-relaxed max-w-[28ch]">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/media/campaign/city.jpg"
            alt="Night city view from an office"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#0C0C0B]/70" />
        </div>
        <div className="relative z-10 w-full px-5 sm:px-8 pb-20 sm:pb-28 max-w-[1200px]">
          <h2
            data-line
            className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em] max-w-[14ch] text-[#F2EFE8]"
          >
            Changing the application? Start here.
          </h2>
          <div data-reveal className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/auth/login"
              className="inline-flex px-8 py-4 bg-[#C4A574] text-[#0C0C0B] font-body font-semibold text-sm tracking-wide hover:bg-[#D4B88A] transition-colors"
            >
              Get ATS-ready — free
            </Link>
            <Link
              href="/"
              className="font-body text-sm text-[#A39E93] hover:text-[#F2EFE8] transition-colors"
            >
              Or see the main site
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 sm:px-8 py-10 border-t border-[#2A2824] flex flex-col sm:flex-row gap-4 justify-between text-[#6B675F] font-body text-xs">
        <p>© {new Date().getFullYear()} HireReady</p>
        <p>
          Photos &amp; video via{' '}
          <a
            href="https://www.pexels.com"
            className="underline hover:text-[#A39E93]"
            target="_blank"
            rel="noreferrer"
          >
            Pexels
          </a>
          . Credits in /media/campaign/credits.json
        </p>
      </footer>
    </div>
  );
}
