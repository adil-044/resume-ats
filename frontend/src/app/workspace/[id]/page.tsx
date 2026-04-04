'use client';

import { useEffect, useState, use } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getAnalysis, optimizeResume, exportResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  AlertTriangle, CheckCircle, Download, Loader2, Sparkles, 
  FileText, ChevronLeft, Save, Eye, Edit3, SplitSquareVertical,
  CheckCircle2, XCircle, Info, Search, LayoutGrid, Zap, ShieldCheck, Plus,
  Activity, Terminal, Command, Lock, ChevronRight, Fingerprint,
  ChevronDown, ChevronUp, Briefcase
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import BridgeGapModal from '@/components/BridgeGapModal';

export default function Workspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { analysisResult, setAnalysisResult, jobDescription } = useResumeStore();
  const [markdown, setMarkdown] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activePane, setActivePane] = useState<'editor' | 'preview' | 'split'>('split');
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const isAdmin = user?.email === 'khatriadil044@gmail.com';
      const { data: profile } = await supabase.from('profiles').select('subscribed').single();
      if (isAdmin || profile?.subscribed) {
        setHasAccess(true);
      }
    };
    checkAccess();
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisResult || analysisResult.id !== id) {
        try {
          const { data, error } = await supabase.from('resumes').select('*').eq('id', id).single();
          if (error) throw error;

          const result = {
            id: data.id,
            overall_score: data.after_score || data.before_score,
            initial_score: data.before_score,
            breakdown: data.breakdown || { keyword_match: 0, semantic_alignment: 0, section_integrity: 0 },
            missing_keywords: data.missing_keywords || [],
            matched_keywords: data.matched_keywords || [],
            formatting_issues: data.formatting_issues || [],
            optimized_content: { format: 'markdown', raw_text: data.optimized_text || data.original_text },
            job_title: data.job_title,
            job_description: data.job_description,
            original_text: data.original_text
          };

          setAnalysisResult(result);
          setMarkdown(result.optimized_content.raw_text);
        } catch (error) {
          console.error('Failed to fetch analysis', error);
        }
      } else {
        setMarkdown(analysisResult.optimized_content.raw_text);
      }
    };
    fetchAnalysis();
  }, [id, analysisResult, setAnalysisResult]);

  const handleAIRephrase = async () => {
    if (!hasAccess) {
      setShowPaywall(true);
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await optimizeResume(markdown, jobDescription);
      setMarkdown(result.optimized_text);
      if (analysisResult) {
        await supabase.from('resumes').update({ optimized_text: result.optimized_text }).eq('id', id);
      }
    } catch (error) {
      console.error(error);
      alert('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!analysisResult) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black gap-10">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 opacity-20" />
        <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Loading your resume...</p>
      </div>
    );
  }

  const jdText = analysisResult.job_description || jobDescription || '';

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-[0.02]" />
      <Navbar />
      
      <BridgeGapModal isOpen={isGapModalOpen} onClose={() => setIsGapModalOpen(false)} taskId={id} onComplete={(newMd) => setMarkdown(newMd)} />

      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setShowPaywall(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-black border border-white/10 rounded-[3rem] p-16 max-w-xl text-center shadow-2xl overflow-hidden border-beam">
              <div className="bg-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-2xl"><Lock className="h-8 w-8 text-white" /></div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none mb-6 italic">Upgrade to See More</h2>
              <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">This feature requires credits. Buy credits to get the full keyword breakdown and AI improvements.</p>
              <div className="space-y-4">
                <Link href="/dashboard" onClick={() => setShowPaywall(false)} className="block w-full py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-2xl text-center">Buy Credits</Link>
                <button onClick={() => setShowPaywall(false)} className="w-full py-4 text-slate-600 font-black text-[9px] uppercase tracking-[0.4em] hover:text-white transition-colors">Go Back</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <header className="bg-black border-b border-white/5 px-8 py-4 flex items-center justify-between z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-600 hover:text-white border border-transparent hover:border-white/10"><ChevronLeft className="h-5 w-5" /></Link>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] leading-none mb-2">Resume</span>
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-indigo-500/50" />
              <span className="font-black text-white text-sm tracking-tight italic uppercase truncate max-w-[200px]">{analysisResult.job_title || 'Untitled'}</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          {[{ id: 'editor', icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Edit' }, { id: 'split', icon: <SplitSquareVertical className="h-3.5 w-3.5" />, label: 'Split View' }, { id: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: 'Preview' }].map((pane) => (
            <button key={pane.id} onClick={() => setActivePane(pane.id as any)} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${activePane === pane.id ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>{pane.icon} {pane.label}</button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleAIRephrase} disabled={isOptimizing} className="group flex items-center gap-3 px-8 py-3 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95">
            {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-indigo-400 group-hover:rotate-12 transition-transform" />} AI Improve
          </button>
          <button onClick={async () => { try { await exportResume(markdown); } catch (e) { alert('Export failed'); } }} className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95">
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <aside className="w-80 bg-black border-r border-white/5 overflow-y-auto flex flex-col intelligence-scrollbar z-20 hidden lg:flex">
          <div className="p-8 space-y-12">
            {/* Score Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em]">Your Score</h3>
                <span className="text-[8px] font-black text-slate-800 uppercase">Original: {analysisResult.initial_score}%</span>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-[0.4em] mb-2">Match Score</span>
                  <span className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">{analysisResult.overall_score}<span className="text-xl opacity-20">%</span></span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${analysisResult.overall_score}%` }} className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,1)]" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(analysisResult.breakdown).map(([key, val]) => (
                  <div key={key} className="bg-white/5 border border-white/5 px-5 py-3 rounded-2xl flex justify-between items-center hover:bg-indigo-600/5 transition-all">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{key.replace('_', ' ')}</p>
                    <p className="text-[10px] font-black text-white">{val}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Description Panel */}
            {jdText && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowJobDescription(!showJobDescription)}
                  className="w-full flex items-center justify-between px-2 group"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-[8px] font-black text-white uppercase tracking-[0.5em]">Job Description</h3>
                  </div>
                  {showJobDescription
                    ? <ChevronUp className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                    : <ChevronDown className="h-4 w-4 text-slate-600 group-hover:text-white transition-colors" />
                  }
                </button>
                <AnimatePresence>
                  {showJobDescription && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-5 max-h-64 overflow-y-auto intelligence-scrollbar">
                        <p className="text-slate-400 text-xs font-medium leading-relaxed whitespace-pre-wrap">{jdText}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Keywords Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[8px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-indigo-500" /> Keywords
                </h3>
                {analysisResult.missing_keywords.length > 0 && (
                  <button onClick={() => hasAccess ? setIsGapModalOpen(true) : setShowPaywall(true)} className="text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-xl hover:bg-white hover:text-black transition-all shadow-xl active:scale-95">
                    <Zap className="h-3 w-3 inline mr-1" />Fix
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {analysisResult.matched_keywords?.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">{kw}</span>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  </div>
                ))}
                {hasAccess ? (
                  <div className="space-y-2">
                    {analysisResult.missing_keywords.map((kw, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{kw}</span>
                        <XCircle className="h-3 w-3 text-slate-800" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="space-y-2 filter blur-[2px] opacity-20 select-none">
                      {analysisResult.missing_keywords.slice(0, 2).map((kw, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{kw}</span>
                          <XCircle className="h-3 w-3 text-slate-800" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <button onClick={() => setShowPaywall(true)} className="px-4 py-2 bg-white text-black rounded-xl font-black text-[8px] uppercase tracking-[0.3em] shadow-2xl">Unlock All</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex overflow-hidden relative z-10">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex-1 flex flex-col bg-black ${activePane === 'split' ? 'border-r border-white/5' : ''} z-10`}>
              <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="flex-1 p-12 font-mono text-[14px] leading-[2.2] outline-none resize-none text-slate-400 selection:bg-indigo-500/40 placeholder:text-slate-900 bg-transparent intelligence-scrollbar" spellCheck={false} placeholder="Start writing your resume here..." />
            </div>
          )}
          
          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-black overflow-y-auto p-12 intelligence-scrollbar shadow-inner relative">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm p-20 prose prose-slate prose-sm prose-indigo max-w-none relative z-10 animate-in fade-in duration-700">
                <style jsx global>{`
                  .prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2.8rem; margin-bottom: 0.5rem; letter-spacing: -0.04em; color: #000; border-bottom: 6px solid #f1f5f9; padding-bottom: 0.5rem; }
                  .prose h2 { border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.15em; color: #1e293b; margin-top: 2.5rem; font-size: 0.9rem; }
                  .prose p { line-height: 1.8; color: #334155; font-size: 1rem; }
                  .prose li { margin: 0.4rem 0; color: #334155; font-size: 1rem; }
                  .prose b, .prose strong { color: #4f46e5; font-weight: 800; }
                `}</style>
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0,transparent_100%)] pointer-events-none" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
