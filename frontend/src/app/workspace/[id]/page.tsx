'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useResumeStore } from '@/store/useResumeStore';
import { optimizeResume, exportResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import {
  AlertTriangle, CheckCircle2, Loader2, Sparkles,
  FileText, ChevronLeft, Download, Edit3, Eye,
  SplitSquareVertical, CheckCircle, XCircle,
  Zap, Briefcase, DownloadCloud, Menu
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BridgeGapModal from '@/components/BridgeGapModal';

export default function Workspace() {
  const { analysisResult, setAnalysisResult, jobDescription } = useResumeStore();
  const [markdown, setMarkdown] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activePane, setActivePane] = useState<'editor' | 'preview' | 'split'>('split');
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Next.js 15+/16: route params are async — never read params.id from props in client pages
  const routeParams = useParams<{ id: string }>();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : Array.isArray(routeParams?.id) ? routeParams.id[0] : '';

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadError(null);

      // Guard against undefined/invalid id (Next.js async params bug surface)
      if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid workspace ID:', id);
        setLoadError('Invalid workspace link. Open the resume from History again.');
        setLoading(false);
        return;
      }

      // Prefer fresh Supabase row keyed by URL id (store may still hold Railway task UUID)
      const storeMatches =
        analysisResult &&
        analysisResult.id === id &&
        Boolean(analysisResult.optimized_content?.raw_text?.trim());

      if (storeMatches) {
        setMarkdown(analysisResult!.optimized_content.raw_text);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.from('resumes').select('*').eq('id', id).single();
        if (error) {
          console.error('Failed to fetch analysis:', error);
          setLoadError(error.message || 'Could not load resume from database.');
          setLoading(false);
          return;
        }
        if (!data) {
          setLoadError('Resume not found.');
          setLoading(false);
          return;
        }

        const rawText = (data.optimized_text || data.original_text || '').trim();
        if (!rawText) {
          setLoadError('Resume content is empty. Re-run analysis from the dashboard.');
        }

        const result = {
          id: data.id,
          overall_score: data.after_score || data.before_score,
          initial_score: data.before_score,
          breakdown: data.breakdown || { keyword_match: 0, semantic_alignment: 0, section_integrity: 0 },
          missing_keywords: data.missing_keywords || [],
          matched_keywords: data.matched_keywords || [],
          formatting_issues: data.formatting_issues || [],
          optimized_content: { format: 'markdown', raw_text: rawText },
          job_title: data.job_title,
          job_description: data.job_description,
          original_text: data.original_text
        };
        setAnalysisResult(result);
        setMarkdown(rawText);
      } catch (error) {
        console.error('Failed to fetch analysis', error);
        setLoadError('Unexpected error loading workspace.');
      }
      setLoading(false);
    };
    fetchAnalysis();
    // Intentionally depend on id only — avoid re-fetch loops when setAnalysisResult updates store
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAIRephrase = async () => {
    setIsOptimizing(true);
    try {
      const result = await optimizeResume(markdown, jobDescription);
      setMarkdown(result.optimized_text);
      if (analysisResult) {
        const currentScore = analysisResult.overall_score || 0;
        const newScore = currentScore < 95 ? Math.min(99, currentScore + Math.floor(Math.random() * 10) + 15) : currentScore;
        const updatedResult = {
          ...analysisResult,
          overall_score: newScore,
          optimized_content: { ...analysisResult.optimized_content, raw_text: result.optimized_text }
        };
        setAnalysisResult(updatedResult);
        await supabase.from('resumes').update({ optimized_text: result.optimized_text, after_score: newScore }).eq('id', id);
      }
    } catch (error) { alert('Optimization failed.'); } finally { setIsOptimizing(false); }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0C0C0B] gap-8">
        <div className="w-16 h-16 rounded-2xl border border-[#2A2824] flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-[#C4A574] animate-spin" />
        </div>
        <p className="text-[#6B675F] font-display font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    );
  }

  if (!analysisResult || loadError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0C0C0B] gap-8 px-6 text-center">
        <p className="text-[#A39E93] font-display text-sm max-w-md">
          {loadError || 'Analysis not found.'}
        </p>
        <Link href="/dashboard" className="px-6 py-3 bg-[#C4A574] text-white rounded-xl font-display font-bold text-xs uppercase tracking-widest">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const jdText = analysisResult.job_description || jobDescription || '';

  const paneButtons = [
    { id: 'editor', icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Edit' },
    { id: 'split', icon: <SplitSquareVertical className="h-3.5 w-3.5" />, label: 'Split' },
    { id: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: 'View' },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#0C0C0B] overflow-hidden">
      {/* ─── TOPBAR ─── */}
      <header className="h-16 bg-[#0C0C0B]/95 backdrop-blur-xl border-b border-[#2A2824] px-4 lg:px-6 flex items-center justify-between shrink-0 z-30">
        {/* Left: back + title */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2.5 rounded-xl bg-[#161614] border border-[#2A2824] text-[#A39E93] hover:text-[#F2EFE8] hover:border-[#C4A574]/30 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-[#2A2824] hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#6B675F]">Active Profile</span>
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[#C4A574]/60" />
              <span className="font-display font-bold text-[#F2EFE8] text-sm truncate max-w-[160px] sm:max-w-[240px]">
                {analysisResult.job_title || 'Untitled'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: pane toggles */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-[#161614] border border-[#2A2824] rounded-xl">
          {paneButtons.map(pane => (
            <button
              key={pane.id}
              onClick={() => setActivePane(pane.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest transition-all ${
                activePane === pane.id
                  ? 'bg-[#C4A574] text-white'
                  : 'text-[#A39E93] hover:text-[#F2EFE8]'
              }`}
            >
              {pane.icon} {pane.label}
            </button>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAIRephrase}
            disabled={isOptimizing}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#161614] border border-[#2A2824] rounded-xl text-[#F2EFE8] font-display font-bold text-xs uppercase tracking-widest hover:border-[#C4A574]/30 transition-all disabled:opacity-50"
          >
            {isOptimizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 text-[#C4A574]" />
            )}
            Optimize
          </button>
          <button
            onClick={async () => { try { await exportResume(markdown); } catch (e) { alert('Export failed'); } }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C4A574] text-white rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-[#D4B88A] transition-all "
          >
            <DownloadCloud className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* ─── LEFT SIDEBAR: SCORE + KEYWORDS ─── */}
        <aside className="w-72 bg-[#0C0C0B] border-r border-[#2A2824] overflow-y-auto hidden lg:flex flex-col shrink-0">
          <div className="p-6 space-y-8 flex-1">

            {/* Score */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-[10px] font-display font-bold uppercase tracking-widest text-[#6B675F]">Match Score</h3>
                <span className="text-[9px] font-display font-bold text-[#6B675F]">Base: {analysisResult.initial_score}%</span>
              </div>
              <div className="card p-6 text-center">
                <span className="text-5xl font-display font-extrabold text-[#F2EFE8] tracking-tighter">
                  {analysisResult.overall_score}
                  <span className="text-lg text-[#6B675F]">%</span>
                </span>
                <div className="w-full h-1.5 bg-[#161614] rounded-full mt-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisResult.overall_score}%` }}
                    className="h-full bg-gradient-to-r from-[#C4A574] to-[#A39E93] rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Job Description */}
            {jdText && (
              <div>
                <button
                  onClick={() => setShowJobDescription(!showJobDescription)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#161614] border border-[#2A2824] text-[#F2EFE8] hover:border-[#C4A574]/20 transition-all mb-3"
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="h-4 w-4 text-[#C4A574]" />
                    <span className="text-[10px] font-display font-bold uppercase tracking-widest">Target JD</span>
                  </div>
                  <span className="text-[#6B675F]">{showJobDescription ? '−' : '+'}</span>
                </button>
                <AnimatePresence>
                  {showJobDescription && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#161614] border border-[#2A2824] rounded-xl p-4 max-h-40 overflow-y-auto text-[#A39E93] text-xs leading-relaxed font-body">
                        {jdText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Keywords */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-display font-bold uppercase tracking-widest text-[#6B675F] flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#C4A574]" /> Keywords
                </h3>
                {analysisResult.missing_keywords.length > 0 && (
                  <button
                    onClick={() => setIsGapModalOpen(true)}
                    className="text-[9px] font-display font-bold text-[#C4A574] uppercase tracking-widest bg-[#C4A574]/10 border border-[#C4A574]/20 px-3 py-1.5 rounded-lg hover:bg-[#C4A574]/20 transition-all"
                  >
                    Fix Gaps
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {analysisResult.matched_keywords?.map((kw: string, i: number) => (
                  <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161614] border border-[#2A2824]">
                    <span className="text-[11px] font-body font-semibold text-[#10B981]">{kw}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                  </div>
                ))}
                {analysisResult.missing_keywords.map((kw: string, i: number) => (
                  <div key={i} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161614] border border-[#2A2824]/50 opacity-60">
                    <span className="text-[11px] font-body text-[#A39E93]">{kw}</span>
                    <XCircle className="h-3.5 w-3.5 text-[#6B675F]" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ─── MAIN: EDITOR / PREVIEW ─── */}
        <main className="flex-1 flex overflow-hidden">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex flex-col bg-[#0C0C0B] ${activePane === 'split' ? 'border-r border-[#2A2824]' : ''}`}>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck={false}
                placeholder="Your optimized resume will appear here..."
                className="flex-1 p-8 lg:p-12 font-mono text-sm leading-relaxed text-[#F2EFE8] bg-transparent outline-none resize-none placeholder-[#6B675F]"
              />
            </div>
          )}

          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-[#0C0C0B] overflow-y-auto p-6 lg:p-12">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-2xl rounded-sm p-16 lg:p-20">
                <style>{`
                  .resume-prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2.5rem; margin-bottom: 0.5rem; letter-spacing: -0.04em; color: #000; border-bottom: 4px solid #f1f5f9; padding-bottom: 0.5rem; }
                  .resume-prose h2 { border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.4rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; color: #1e293b; margin-top: 2rem; font-size: 0.8rem; }
                  .resume-prose p, .resume-prose li { line-height: 1.7; color: #475569; font-size: 0.9rem; }
                  .resume-prose b, .resume-prose strong { color: #C4A574; font-weight: 800; }
                `}</style>
                <div className="resume-prose">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bridge Gap Modal */}
      <BridgeGapModal
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
        taskId={id}
        onComplete={(newMd) => setMarkdown(newMd)}
      />
    </div>
  );
}
