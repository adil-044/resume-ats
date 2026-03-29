'use client';

import { useEffect, useState, use } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getAnalysis, optimizeResume, exportResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  AlertTriangle, CheckCircle, Download, Loader2, Sparkles, 
  FileText, ChevronLeft, Save, Eye, Edit3, SplitSquareVertical,
  CheckCircle2, XCircle, Info, Search, LayoutGrid, Zap, ShieldCheck, Plus,
  Activity, Terminal, Command
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

  if (!analysisResult) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#020617] gap-8">
        <div className="relative">
          <Loader2 className="h-16 w-16 animate-spin text-indigo-500 opacity-20" />
          <ShieldCheck className="h-6 w-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Initializing Strategy Room...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#020617] overflow-hidden font-sans selection:bg-indigo-500/30">
      <Navbar />
      
      <BridgeGapModal 
        isOpen={isGapModalOpen} 
        onClose={() => setIsGapModalOpen(false)} 
        taskId={id} 
        onComplete={(newMd) => setMarkdown(newMd)} 
      />
      
      {/* Dark Executive Workspace Toolbar */}
      <header className="bg-slate-900 border-b border-white/5 px-8 py-4 flex items-center justify-between z-30 shadow-2xl">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-500 hover:text-white border border-transparent hover:border-white/10">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none mb-2">Operational Stream</span>
            <div className="flex items-center gap-3">
              <Activity className="h-4 w-4 text-indigo-500" />
              <span className="font-bold text-white text-sm tracking-tight italic uppercase">{analysisResult.job_title || 'Untitled_Project'}.MD</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-[1.2rem] border border-white/5 shadow-inner">
          {[
            { id: 'editor', icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Editor' },
            { id: 'split', icon: <SplitSquareVertical className="h-3.5 w-3.5" />, label: 'Split' },
            { id: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: 'Preview' }
          ].map((pane) => (
            <button 
              key={pane.id}
              onClick={() => setActivePane(pane.id as any)} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activePane === pane.id ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'text-slate-500 hover:text-slate-200'}`}
            >
              {pane.icon} {pane.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleAIRephrase}
            disabled={isOptimizing}
            className="group flex items-center gap-3 px-8 py-3 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl disabled:opacity-50 active:scale-95"
          >
            {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-indigo-600 group-hover:rotate-12 transition-transform" />}
            AI Optimize
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-900/40 active:scale-95"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Intelligence Sidebar */}
        <aside className="w-80 bg-slate-900/50 border-r border-white/5 overflow-y-auto flex flex-col intelligence-scrollbar backdrop-blur-xl">
          <div className="p-8 space-y-12">
            {/* Real-time Match Meter */}
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Initial Strength</h3>
                <span className="text-xs font-bold text-slate-600">{analysisResult.initial_score}%</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Optimized Match</h3>
                  <span className="text-4xl font-black text-indigo-500 tracking-tighter drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]">{analysisResult.overall_score}%</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysisResult.overall_score}%` }}
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.6)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(analysisResult.breakdown).map(([key, val]) => (
                  <div key={key} className="bg-white/5 border border-white/5 px-5 py-3 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <p className="text-[9px] font-black text-slate-500 uppercase truncate tracking-widest group-hover:text-slate-300 transition-colors">{key.replace('_', ' ')}</p>
                    <p className="text-xs font-black text-white">{val}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Inventory */}
            <div className="space-y-8">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-indigo-500" /> Inventory
                </h3>
                {analysisResult.missing_keywords.length > 0 && (
                  <button 
                    onClick={() => setIsGapModalOpen(true)}
                    className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95"
                  >
                    <Plus className="h-3 w-3" /> Bridge
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {analysisResult.matched_keywords?.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/10 rounded-2xl group hover:bg-green-500/10 transition-colors">
                    <span className="text-[11px] font-bold text-green-400">{kw}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                  </div>
                ))}
                {analysisResult.missing_keywords.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-red-500/20 hover:bg-red-500/5 transition-all">
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-red-400 transition-colors">{kw}</span>
                    <XCircle className="h-4 w-4 text-slate-700 group-hover:text-red-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Alerts */}
            <div className="space-y-8 pb-20">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 px-2">
                <ShieldCheck className="h-4 w-4 text-indigo-500" /> Logs
              </h3>
              <div className="space-y-3">
                {analysisResult.formatting_issues.map((issue, i) => (
                  <div key={i} className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 text-[11px] text-amber-500 font-bold leading-relaxed flex gap-4 shadow-inner">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 flex overflow-hidden">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex-1 flex flex-col bg-black/20 ${activePane === 'split' ? 'border-r border-white/5 shadow-2xl' : ''} z-10`}>
              <textarea 
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 p-16 font-mono text-[15px] leading-[2.2] outline-none resize-none text-slate-300 selection:bg-indigo-500/40 placeholder:text-slate-800 bg-transparent"
                spellCheck={false}
                placeholder="// SYSTEM_INTAKE_INITIATED..."
              />
            </div>
          )}
          
          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-[#020617] overflow-y-auto p-16 intelligence-scrollbar shadow-inner">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-sm p-24 prose prose-slate prose-sm prose-indigo max-w-none animate-in fade-in duration-1000">
                <style jsx global>{`
                  .prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2.8rem; margin-bottom: 0.5rem; letter-spacing: -0.02em; color: #0f172a; }
                  .prose h2 { border-bottom: 2px solid #f1f5f9; padding-bottom: 0.8rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.15em; color: #1e293b; margin-top: 2.5rem; font-size: 0.9rem; }
                  .prose hr { margin: 2rem 0; border-top: 1px solid #f1f5f9; }
                  .prose p { line-height: 1.8; color: #334155; font-size: 1rem; }
                  .prose li { margin: 0.4rem 0; color: #334155; font-size: 1rem; }
                  .prose b, .prose strong { color: #4f46e5; font-weight: 700; }
                `}</style>
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
