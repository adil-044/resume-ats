'use client';

import { useEffect, useState, use } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getAnalysis, optimizeResume, exportResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  AlertTriangle, CheckCircle, Download, Loader2, Sparkles, 
  FileText, ChevronLeft, Save, Eye, Edit3, SplitSquareVertical,
  CheckCircle2, XCircle, Info, Search, LayoutGrid, Zap, ShieldCheck, Plus,
  Activity, Terminal, Command, Lock, ChevronRight, Fingerprint, XCircle
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

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!analysisResult || analysisResult.id !== id) {
        try {
          const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          const result = {
            id: data.id,
            overall_score: data.after_score || data.before_score,
            initial_score: data.before_score,
            breakdown: data.breakdown || { keyword_match: 0, semantic_alignment: 0, section_integrity: 0 },
            missing_keywords: data.missing_keywords || [],
            matched_keywords: data.matched_keywords || [],
            formatting_issues: data.formatting_issues || [],
            optimized_content: {
              format: 'markdown',
              raw_text: data.optimized_text || data.original_text
            },
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

  const handleExport = async () => {
    try {
      await exportResume(markdown);
    } catch (error) {
      console.error(error);
      alert('Export failed');
    }
  };

  const handleAIRephrase = async () => {
    // Check for "Pro" status (simulated)
    const { data: profile } = await supabase.from('profiles').select('subscribed').single();
    if (!profile?.subscribed) {
      setShowPaywall(true);
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await optimizeResume(markdown, jobDescription);
      setMarkdown(result.optimized_text);
      
      if (analysisResult) {
        await supabase
          .from('resumes')
          .update({ optimized_text: result.optimized_text, after_score: analysisResult.overall_score })
          .eq('id', id);
      }
    } catch (error) {
      console.error(error);
      alert('Optimization failed.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const triggerBridge = () => {
    setShowPaywall(true);
  };

  if (!analysisResult) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-12">
        <div className="relative">
          <Loader2 className="h-24 w-24 animate-spin text-indigo-500 opacity-10" />
          <Fingerprint className="h-10 w-10 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-white font-black uppercase tracking-[0.8em] text-[10px] animate-pulse italic">Initializing Strategy Suite...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#020617] overflow-hidden font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-10" />
      <Navbar />
      
      <BridgeGapModal 
        isOpen={isGapModalOpen} 
        onClose={() => setIsGapModalOpen(false)} 
        taskId={id} 
        onComplete={(newMd) => setMarkdown(newMd)} 
      />

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowPaywall(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-slate-900 border border-white/10 rounded-[4rem] p-20 max-w-2xl text-center shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-indigo-500"><Zap className="h-64 w-64 rotate-12" /></div>
              <div className="bg-indigo-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl"><Lock className="h-10 w-10 text-white" /></div>
              <h2 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-8 italic">Professional <br /> Tier Required.</h2>
              <p className="text-2xl text-slate-400 font-medium mb-16 leading-relaxed uppercase tracking-tighter">AI Re-engineering and Bridge Protocol are reserved for Professional Identities.</p>
              <div className="space-y-6">
                <button className="w-full py-8 bg-white text-black rounded-[2.5rem] font-black text-xl uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95">Upgrade to Pro Identity</button>
                <button onClick={() => setShowPaywall(false)} className="w-full py-6 text-slate-500 font-black text-xs uppercase tracking-[0.4em] hover:text-white transition-colors">Discard & Continue Free</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Dark Executive Workspace Toolbar */}
      <header className="bg-slate-900/80 backdrop-blur-3xl border-b border-white/5 px-10 py-6 flex items-center justify-between z-30 shadow-2xl relative">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="p-4 hover:bg-white/5 rounded-2xl transition-all text-slate-600 hover:text-white border border-transparent hover:border-white/10">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <div className="h-10 w-px bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] leading-none mb-3 italic">Identity_Source</span>
            <div className="flex items-center gap-4">
              <Terminal className="h-5 w-5 text-indigo-500 opacity-50" />
              <span className="font-black text-white text-lg tracking-tighter italic uppercase">{analysisResult.job_title || 'Untitled_Strategy'}.MD</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/60 p-2 rounded-[1.5rem] border border-white/5 shadow-inner">
          {[
            { id: 'editor', icon: <Edit3 className="h-4 w-4" />, label: 'Write' },
            { id: 'split', icon: <SplitSquareVertical className="h-4 w-4" />, label: 'Quantum' },
            { id: 'preview', icon: <Eye className="h-4 w-4" />, label: 'Visual' }
          ].map((pane) => (
            <button 
              key={pane.id}
              onClick={() => setActivePane(pane.id as any)} 
              className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-700 ${activePane === pane.id ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              {pane.icon} {pane.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={handleAIRephrase}
            disabled={isOptimizing}
            className="group flex items-center gap-4 px-10 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-500 transition-all shadow-xl active:scale-95"
          >
            {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-indigo-400 group-hover:rotate-12 transition-transform" />}
            AI Optimize
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-4 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black hover:shadow-white/10 transition-all shadow-2xl shadow-indigo-900/40 active:scale-95"
          >
            <Download className="h-4 w-4" /> Export Protocol
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Intelligence Sidebar */}
        <aside className="w-96 bg-slate-900/40 border-r border-white/5 overflow-y-auto flex flex-col intelligence-scrollbar backdrop-blur-3xl z-20">
          <div className="p-10 space-y-16">
            {/* Real-time Match Meter */}
            <div className="space-y-10">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] italic">Extraction_Match</h3>
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Base: {analysisResult.initial_score}%</span>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2 italic">Optimized_Signal</span>
                    <span className="text-7xl font-black text-white tracking-[0.1em] drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">{analysisResult.overall_score}<span className="text-2xl opacity-20">%</span></span>
                  </div>
                  <Activity className="h-8 w-8 text-indigo-500 animate-pulse mb-2 opacity-20" />
                </div>
                <div className="h-3 w-full bg-black/60 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisResult.overall_score}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600 bg-size-200 animate-gradient rounded-full shadow-[0_0_20px_rgba(79,70,229,0.8)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(analysisResult.breakdown).map(([key, val]) => (
                  <div key={key} className="bg-white/5 border border-white/5 px-6 py-4 rounded-2xl flex justify-between items-center group hover:bg-indigo-600/10 transition-all">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-indigo-400 transition-colors italic">{key.replace('_', ' ')}</p>
                    <p className="text-sm font-black text-white">{val}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Inventory */}
            <div className="space-y-10">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 italic">
                  <Terminal className="h-5 w-5 text-indigo-500" /> Delta_Registry
                </h3>
                {analysisResult.missing_keywords.length > 0 && (
                  <button 
                    onClick={triggerBridge}
                    className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-white hover:text-black transition-all shadow-xl active:scale-95"
                  >
                    <Zap className="h-3.5 w-3.5" /> Execute Bridge
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {analysisResult.matched_keywords?.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-green-500/5 border border-green-500/10 rounded-2xl group hover:bg-green-500/10 transition-all">
                    <span className="text-[12px] font-black text-green-400 uppercase tracking-tighter">{kw}</span>
                    <CheckCircle2 className="h-5 w-5 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                  </div>
                ))}
                <div className="relative group">
                  <div className="space-y-4 filter blur-[2px] opacity-40 select-none">
                    {analysisResult.missing_keywords.slice(0, 3).map((kw, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl">
                        <span className="text-[12px] font-black text-slate-600 uppercase tracking-tighter">{kw}</span>
                        <XCircle className="h-5 w-5 text-slate-800" />
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <button onClick={triggerBridge} className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform flex items-center gap-3">
                      <Lock className="h-3.5 w-3.5" /> Unlock Delta Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Alerts */}
            <div className="space-y-10 pb-24">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4 px-4 italic">
                <ShieldCheck className="h-5 w-5 text-indigo-500" /> Protocol_Logs
              </h3>
              <div className="space-y-4">
                {analysisResult.formatting_issues.map((issue, i) => (
                  <div key={i} className="p-6 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[11px] text-amber-500 font-black leading-relaxed flex gap-5 shadow-inner italic">
                    <Info className="h-5 w-5 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 flex overflow-hidden relative z-10">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex-1 flex flex-col bg-black/40 ${activePane === 'split' ? 'border-r border-white/5 shadow-2xl' : ''} z-10`}>
              <textarea 
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 p-20 font-mono text-[16px] leading-[2.4] outline-none resize-none text-slate-400 selection:bg-indigo-500/40 placeholder:text-slate-900 bg-transparent intelligence-scrollbar"
                spellCheck={false}
                placeholder="// PROTOCOL_INITIALIZED. READY_FOR_INPUT..."
              />
            </div>
          )}
          
          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-[#020617] overflow-y-auto p-20 intelligence-scrollbar shadow-inner relative">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-[0_100px_200px_-20px_rgba(0,0,0,0.8)] rounded-sm p-24 prose prose-slate prose-sm prose-indigo max-w-none animate-in fade-in zoom-in-95 duration-1000 relative z-10">
                <style jsx global>{`
                  .prose h1 { font-weight: 900; text-transform: uppercase; font-size: 3.2rem; margin-bottom: 0.8rem; letter-spacing: -0.04em; color: #0f172a; border-bottom: 8px solid #f1f5f9; padding-bottom: 1rem; }
                  .prose h2 { border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.2em; color: #1e293b; margin-top: 3.5rem; font-size: 1rem; }
                  .prose hr { margin: 3rem 0; border-top: 2px solid #f1f5f9; }
                  .prose p { line-height: 2; color: #334155; font-size: 1.1rem; font-weight: 500; }
                  .prose li { margin: 0.6rem 0; color: #334155; font-size: 1.1rem; font-weight: 500; }
                  .prose b, .prose strong { color: #4f46e5; font-weight: 800; }
                `}</style>
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_100%)] pointer-events-none" />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
