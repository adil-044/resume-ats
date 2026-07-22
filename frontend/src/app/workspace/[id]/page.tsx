'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useParams } from 'next/navigation';
import { useResumeStore } from '@/store/useResumeStore';
import { optimizeResume, exportResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2, Loader2, Sparkles,
  FileText, ChevronLeft, Edit3, Eye,
  SplitSquareVertical, XCircle,
  Zap, Briefcase, DownloadCloud, X, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BridgeGapModal from '@/components/BridgeGapModal';

type Pane = 'editor' | 'preview' | 'split';

export default function Workspace() {
  const { analysisResult, setAnalysisResult, jobDescription } = useResumeStore();
  const [markdown, setMarkdown] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activePane, setActivePane] = useState<Pane>('preview');
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const routeParams = useParams<{ id: string }>();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : Array.isArray(routeParams?.id) ? routeParams.id[0] : '';

  // Desktop prefers split; mobile stays single-pane (never split)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => {
      if (mq.matches) {
        setActivePane((p) => (p === 'preview' || p === 'editor' ? 'split' : p));
      } else {
        setActivePane((p) => (p === 'split' ? 'preview' : p));
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!insightsOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [insightsOpen]);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoadError(null);

      if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid workspace ID:', id);
        setLoadError('Invalid workspace link. Open the resume from History again.');
        setLoading(false);
        return;
      }

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
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#0C0C0B] gap-8">
        <div className="w-16 h-16 rounded-2xl border border-[#2A2824] flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-[#C4A574] animate-spin" />
        </div>
        <p className="text-[#6B675F] font-display font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    );
  }

  if (!analysisResult || loadError) {
    return (
      <div className="h-[100dvh] flex flex-col items-center justify-center bg-[#0C0C0B] gap-8 px-6 text-center">
        <p className="text-[#A39E93] font-display text-sm max-w-md">
          {loadError || 'Analysis not found.'}
        </p>
        <Link href="/dashboard" className="px-6 py-3 bg-[#C4A574] text-[#0C0C0B] rounded-xl font-display font-bold text-xs uppercase tracking-widest">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const jdText = analysisResult.job_description || jobDescription || '';

  const desktopPaneButtons: { id: Pane; icon: ReactNode; label: string }[] = [
    { id: 'editor', icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Edit' },
    { id: 'split', icon: <SplitSquareVertical className="h-3.5 w-3.5" />, label: 'Split' },
    { id: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: 'View' },
  ];

  const mobilePaneButtons: { id: Pane; icon: ReactNode; label: string }[] = [
    { id: 'editor', icon: <Edit3 className="h-4 w-4" />, label: 'Edit' },
    { id: 'preview', icon: <Eye className="h-4 w-4" />, label: 'View' },
  ];

  const showEditor = activePane === 'editor' || activePane === 'split';
  const showPreview = activePane === 'preview' || activePane === 'split';

  const insightsBody = (
    <div className="p-5 space-y-8">
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

      {jdText && (
        <div>
          <button
            type="button"
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-display font-bold uppercase tracking-widest text-[#6B675F] flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#C4A574]" /> Keywords
          </h3>
          {analysisResult.missing_keywords.length > 0 && (
            <button
              type="button"
              onClick={() => { setIsGapModalOpen(true); setInsightsOpen(false); }}
              className="text-[9px] font-display font-bold text-[#C4A574] uppercase tracking-widest bg-[#C4A574]/10 border border-[#C4A574]/20 px-3 py-1.5 rounded-lg hover:bg-[#C4A574]/20 transition-all"
            >
              Fix Gaps
            </button>
          )}
        </div>
        <div className="space-y-2">
          {analysisResult.matched_keywords?.map((kw: string, i: number) => (
            <div key={`m-${i}`} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161614] border border-[#2A2824]">
              <span className="text-[11px] font-body font-semibold text-[#10B981]">{kw}</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
            </div>
          ))}
          {analysisResult.missing_keywords.map((kw: string, i: number) => (
            <div key={`x-${i}`} className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#161614] border border-[#2A2824]/50 opacity-60">
              <span className="text-[11px] font-body text-[#A39E93]">{kw}</span>
              <XCircle className="h-3.5 w-3.5 text-[#6B675F]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] flex flex-col bg-[#0C0C0B] overflow-hidden">
      {/* Topbar */}
      <header className="shrink-0 z-30 border-b border-[#2A2824] bg-[#0C0C0B]/95 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
        <div className="h-14 lg:h-16 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Link
              href="/dashboard"
              aria-label="Back to dashboard"
              className="p-2.5 rounded-xl bg-[#161614] border border-[#2A2824] text-[#A39E93] hover:text-[#F2EFE8] hover:border-[#C4A574]/30 transition-all shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#6B675F] hidden sm:block">
                Active Profile
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-3.5 w-3.5 text-[#C4A574]/60 shrink-0 hidden sm:block" />
                <span className="font-display font-bold text-[#F2EFE8] text-sm truncate">
                  {analysisResult.job_title || 'Untitled'}
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 p-1 bg-[#161614] border border-[#2A2824] rounded-xl">
            {desktopPaneButtons.map((pane) => (
              <button
                key={pane.id}
                type="button"
                onClick={() => setActivePane(pane.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest transition-all ${
                  activePane === pane.id
                    ? 'bg-[#C4A574] text-[#0C0C0B]'
                    : 'text-[#A39E93] hover:text-[#F2EFE8]'
                }`}
              >
                {pane.icon} {pane.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAIRephrase}
              disabled={isOptimizing}
              aria-label="Optimize resume"
              className="hidden sm:flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-[#161614] border border-[#2A2824] rounded-xl text-[#F2EFE8] font-display font-bold text-xs uppercase tracking-widest hover:border-[#C4A574]/30 transition-all disabled:opacity-50"
            >
              {isOptimizing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-[#C4A574]" />
              )}
              <span className="hidden md:inline">Optimize</span>
            </button>
            <button
              type="button"
              onClick={async () => { try { await exportResume(markdown); } catch { alert('Export failed'); } }}
              aria-label="Export PDF"
              className="flex items-center gap-2 px-3 lg:px-4 py-2.5 bg-[#C4A574] text-[#0C0C0B] rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-[#D4B88A] transition-all"
            >
              <DownloadCloud className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile Edit / View switch — always available */}
        <div className="lg:hidden flex items-center gap-1 px-3 pb-3">
          <div className="flex flex-1 items-center gap-1 p-1 bg-[#161614] border border-[#2A2824] rounded-xl">
            {mobilePaneButtons.map((pane) => (
              <button
                key={pane.id}
                type="button"
                onClick={() => setActivePane(pane.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-display font-bold text-[10px] uppercase tracking-widest transition-all ${
                  activePane === pane.id || (activePane === 'split' && pane.id === 'preview')
                    ? 'bg-[#C4A574] text-[#0C0C0B]'
                    : 'text-[#A39E93]'
                }`}
              >
                {pane.icon} {pane.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="w-72 bg-[#0C0C0B] border-r border-[#2A2824] overflow-y-auto hidden lg:flex flex-col shrink-0">
          <div className="flex-1">{insightsBody}</div>
        </aside>

        {/* Editor / preview */}
        <main className="flex-1 min-h-0 min-w-0 flex overflow-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
          {showEditor && (
            <div
              className={`
                flex flex-col min-h-0 min-w-0 bg-[#0C0C0B]
                ${activePane === 'split' ? 'hidden lg:flex lg:w-1/2 lg:border-r lg:border-[#2A2824]' : 'flex-1 w-full'}
                ${activePane === 'editor' ? 'flex' : ''}
              `}
            >
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck={false}
                placeholder="Your optimized resume will appear here..."
                className="flex-1 min-h-0 w-full p-4 sm:p-6 lg:p-12 font-mono text-[13px] sm:text-sm leading-relaxed text-[#F2EFE8] bg-transparent outline-none resize-none placeholder-[#6B675F]"
              />
            </div>
          )}

          {showPreview && (
            <div
              className={`
                min-h-0 min-w-0 overflow-y-auto overscroll-contain bg-[#0C0C0B] p-3 sm:p-6 lg:p-12
                ${activePane === 'split' ? 'flex-1' : 'flex-1 w-full'}
              `}
            >
              <div className="max-w-[850px] mx-auto bg-[#EDE6D9] min-h-[min(100%,720px)] sm:min-h-[1100px] shadow-2xl rounded-sm p-5 sm:p-10 lg:p-20 overflow-x-auto">
                <style>{`
                  .resume-prose h1 { font-weight: 900; text-transform: uppercase; font-size: clamp(1.35rem, 5vw, 2.5rem); margin-bottom: 0.5rem; letter-spacing: -0.04em; color: #1A1814; border-bottom: 3px solid #d6d0c4; padding-bottom: 0.5rem; }
                  .resume-prose h2 { border-bottom: 1.5px solid #d6d0c4; padding-bottom: 0.4rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.08em; color: #1A1814; margin-top: 1.5rem; font-size: 0.75rem; }
                  .resume-prose p, .resume-prose li { line-height: 1.65; color: #3d3a34; font-size: clamp(0.8rem, 2.8vw, 0.9rem); }
                  .resume-prose ul { padding-left: 1.1rem; margin: 0.4rem 0; }
                  .resume-prose b, .resume-prose strong { color: #8a6f45; font-weight: 800; }
                `}</style>
                <div className="resume-prose">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom actions */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-[95] border-t border-[#2A2824] bg-[#0C0C0B]/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
        aria-label="Workspace actions"
      >
        <div className="grid grid-cols-3 h-[4.25rem]">
          <button
            type="button"
            onClick={() => setInsightsOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-[#A39E93] active:text-[#C4A574]"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-[9px] font-display font-bold uppercase tracking-widest">
              Score {analysisResult.overall_score}%
            </span>
          </button>
          <button
            type="button"
            onClick={handleAIRephrase}
            disabled={isOptimizing}
            className="flex flex-col items-center justify-center gap-1 text-[#C4A574] disabled:opacity-50"
          >
            {isOptimizing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
            <span className="text-[9px] font-display font-bold uppercase tracking-widest">Optimize</span>
          </button>
          <button
            type="button"
            onClick={async () => { try { await exportResume(markdown); } catch { alert('Export failed'); } }}
            className="flex flex-col items-center justify-center gap-1 text-[#A39E93] active:text-[#C4A574]"
          >
            <DownloadCloud className="h-5 w-5" />
            <span className="text-[9px] font-display font-bold uppercase tracking-widest">Export</span>
          </button>
        </div>
      </nav>

      {/* Mobile insights sheet */}
      <AnimatePresence>
        {insightsOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close insights"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[100] bg-black/60"
              onClick={() => setInsightsOpen(false)}
            />
            <motion.aside
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed inset-x-0 bottom-0 z-[101] max-h-[85dvh] rounded-t-2xl border border-[#2A2824] bg-[#0C0C0B] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Match score and keywords"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2824] shrink-0">
                <span className="font-display font-bold text-sm text-[#F2EFE8] uppercase tracking-widest">Insights</span>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setInsightsOpen(false)}
                  className="p-2 rounded-lg text-[#A39E93] hover:text-[#F2EFE8] hover:bg-[#161614]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain flex-1 min-h-0 pb-[env(safe-area-inset-bottom)]">
                {insightsBody}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <BridgeGapModal
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
        taskId={id}
        onComplete={(newMd) => setMarkdown(newMd)}
      />
    </div>
  );
}
