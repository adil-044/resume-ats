'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { analyzeResume } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';
import { useSectionReveal } from './useLandingGsap';

export default function Proof() {
  const root = useRef<HTMLElement>(null);
  useSectionReveal(root);
  const { setAnalysisResult, setResumeFile, setJobDescription } = useResumeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localJD, setLocalJD] = useState('');
  const [teaserScore, setTeaserScore] = useState<number | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!localFile || !localJD) return;
    setIsAnalyzing(true);
    setProgress(5);
    setError(null);
    try {
      const result = await analyzeResume(localFile, localJD);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 95) {
            clearInterval(interval);
            setTeaserScore(result.initial_score);
            setIsAnalyzing(false);
            setShowUpsell(true);
            return 100;
          }
          return p + Math.random() * 15;
        });
      }, 200);
      setAnalysisResult(result);
      setResumeFile(localFile);
      setJobDescription(localJD);
    } catch (e: unknown) {
      setIsAnalyzing(false);
      setError(e instanceof Error ? e.message : 'Analysis failed');
    }
  };

  return (
    <section
      id="analyzer"
      ref={root}
      className="py-28 md:py-36 px-6 border-t border-[#2A2824]"
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-14 max-w-2xl">
          <p
            data-reveal
            className="font-body text-xs uppercase tracking-[0.2em] text-[#C4A574] mb-6 opacity-0"
          >
            Try it
          </p>
          <h2
            data-reveal
            className="font-display text-4xl md:text-5xl text-[#F2EFE8] leading-[1.05] tracking-tight opacity-0"
          >
            Score a resume against a real job.
          </h2>
        </div>

        <div
          data-reveal
          className="surface-panel p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 opacity-0"
        >
          <div>
            <label className="font-body text-xs uppercase tracking-widest text-[#6B675F] block mb-3">
              Resume
            </label>
            <label className="flex flex-col items-center justify-center border border-dashed border-[#2A2824] rounded-md p-10 cursor-pointer hover:border-[#C4A574]/40 transition-colors bg-[#0C0C0B]">
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setLocalFile(e.target.files?.[0] || null)}
              />
              <span className="font-body text-sm text-[#F2EFE8]">
                {localFile ? localFile.name : 'Drop PDF or DOCX'}
              </span>
              <span className="font-body text-xs text-[#6B675F] mt-2">Click to browse</span>
            </label>
          </div>

          <div className="flex flex-col">
            <label className="font-body text-xs uppercase tracking-widest text-[#6B675F] block mb-3">
              Job description
            </label>
            <textarea
              value={localJD}
              onChange={(e) => setLocalJD(e.target.value)}
              placeholder="Paste the posting…"
              className="flex-1 min-h-[160px] w-full bg-[#0C0C0B] border border-[#2A2824] rounded-md p-4 font-body text-sm text-[#F2EFE8] outline-none focus:border-[#C4A574]/50 resize-none placeholder:text-[#6B675F]"
            />
          </div>

          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!localFile || !localJD || isAnalyzing}
              className="btn-signal px-8 py-3.5 rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? `Analyzing… ${Math.round(progress)}%` : 'Run free scan'}
            </button>
            {error && <p className="font-body text-sm text-[#C45C5C]">{error}</p>}
          </div>

          {showUpsell && teaserScore !== null && (
            <div className="lg:col-span-2 paper-panel p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/svg/match-gauge.svg" alt="" className="w-20 h-20 shrink-0" />
                <div>
                  <p className="font-body text-xs uppercase tracking-widest text-[#1A1814]/50 mb-2">
                    Teaser match
                  </p>
                  <p className="font-display text-5xl text-[#1A1814]">{Math.round(teaserScore)}</p>
                  <p className="font-body text-sm text-[#1A1814]/70 mt-2">
                    Sign in to unlock the full rewrite and workspace.
                  </p>
                </div>
              </div>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#1A1814] text-[#EDE6D9] rounded-md text-sm font-body font-semibold hover:opacity-90 transition-opacity"
              >
                Continue free
              </Link>
            </div>
          )}
        </div>

        <p className="mt-8 font-body text-xs text-[#6B675F] max-w-xl">
          <sup>1</sup> Jobiwa ATS Industry Report 2024 · Core features permanently free. No card required.
        </p>
      </div>
    </section>
  );
}
