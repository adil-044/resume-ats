'use client';

import { useEffect, useState, use } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { getAnalysis, optimizeResume, exportResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  AlertTriangle, CheckCircle, Download, Loader2, Sparkles, 
  FileText, ChevronLeft, Save, Eye, Edit3, SplitSquareVertical,
  CheckCircle2, XCircle, Info, Search, LayoutGrid, Zap, ShieldCheck, Plus
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
          // Fetch from Supabase directly
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
      
      // Persist to Supabase
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

  // Add auto-save for manual edits
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (markdown && analysisResult && markdown !== analysisResult.optimized_content.raw_text) {
        await supabase
          .from('resumes')
          .update({ optimized_text: markdown })
          .eq('id', id);
      }
    }, 2000); // Auto-save after 2s of inactivity
    
    return () => clearTimeout(timer);
  }, [markdown, id, analysisResult]);

  if (!analysisResult) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white gap-6">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <ShieldCheck className="h-5 w-5 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-slate-900 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Executive Workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      <Navbar />
      
      <BridgeGapModal 
        isOpen={isGapModalOpen} 
        onClose={() => setIsGapModalOpen(false)} 
        taskId={id} 
        onComplete={(newMd) => setMarkdown(newMd)} 
      />
      
      {/* Executive Workspace Toolbar */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-4 flex items-center justify-between z-30 shadow-xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="h-8 w-px bg-slate-800" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Optimization Stream</span>
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-bold text-white text-sm tracking-tight">RESUME_EXECUTIVE_V1.MD</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-[1rem]">
          <button onClick={() => setActivePane('editor')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activePane === 'editor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <Edit3 className="h-3.5 w-3.5" /> Editor
          </button>
          <button onClick={() => setActivePane('split')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activePane === 'split' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <SplitSquareVertical className="h-3.5 w-3.5" /> Split
          </button>
          <button onClick={() => setActivePane('preview')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activePane === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}>
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleAIRephrase}
            disabled={isOptimizing}
            className="group flex items-center gap-2 px-6 py-2.5 bg-white text-slate-900 rounded-[1rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl disabled:opacity-50"
          >
            {isOptimizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />}
            AI Restructure
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-[1rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20"
          >
            <Download className="h-3.5 w-3.5" /> Export Executive PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Intelligence Sidebar */}
        <aside className="w-80 bg-slate-50 border-r border-slate-200 overflow-y-auto flex flex-col intelligence-scrollbar">
          <div className="p-8 space-y-10">
            {/* Real-time Match Meter */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Initial Score</h3>
                <span className="text-xs font-bold text-slate-400 underline decoration-slate-200 underline-offset-4">{analysisResult.initial_score}%</span>
              </div>
              <div className="flex justify-between items-end">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Optimized Match</h3>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">{analysisResult.overall_score}%</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5 border border-white">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisResult.overall_score}%` }}
                  className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(analysisResult.breakdown).map(([key, val]) => (
                  <div key={key} className="bg-white border border-slate-200/60 px-4 py-2.5 rounded-xl flex justify-between items-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase truncate tracking-widest">{key.replace('_', ' ')}</p>
                    <p className="text-xs font-black text-slate-900">{val}%</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Inventory */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <LayoutGrid className="h-3.5 w-3.5 text-indigo-600" /> Inventory
                </h3>
                {analysisResult.missing_keywords.length > 0 && (
                  <button 
                    onClick={() => setIsGapModalOpen(true)}
                    className="flex items-center gap-1 text-[10px] font-black text-indigo-600 uppercase tracking-tighter bg-white border border-indigo-100 px-2 py-1 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Plus className="h-2.5 w-2.5" /> Bridge
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {analysisResult.matched_keywords?.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200/60 rounded-2xl group hover:border-green-200 transition-colors shadow-sm">
                    <span className="text-[11px] font-bold text-slate-700">{kw}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                ))}
                {analysisResult.missing_keywords.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-200/60 rounded-2xl group hover:border-red-200 transition-all shadow-sm">
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-red-600">{kw}</span>
                    <XCircle className="h-4 w-4 text-slate-200 group-hover:text-red-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Alerts */}
            <div className="space-y-6 pb-12">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Compliance
              </h3>
              <div className="space-y-2">
                {analysisResult.formatting_issues.map((issue, i) => (
                  <div key={i} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 text-[11px] text-amber-800 font-bold leading-relaxed flex gap-3">
                    <Info className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center/Right: Executive Multi-Pane Workspace */}
        <main className="flex-1 flex overflow-hidden">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex-1 flex flex-col bg-white ${activePane === 'split' ? 'border-r border-slate-200 shadow-[10px_0_15px_-10px_rgba(0,0,0,0.05)]' : ''} z-10`}>
              <textarea 
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 p-16 font-mono text-[14px] leading-[2] outline-none resize-none text-slate-800 selection:bg-indigo-100 placeholder:text-slate-300"
                spellCheck={false}
                placeholder="# EXEC_NAME..."
              />
            </div>
          )}
          
          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-slate-100 overflow-y-auto p-16 intelligence-scrollbar">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-2xl shadow-slate-400/50 rounded-lg p-20 prose prose-slate prose-sm prose-indigo max-w-none">
                <style jsx global>{`
                  .prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2.5rem; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
                  .prose h2 { border-bottom: 1px solid #E2E8F0; padding-bottom: 0.5rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; color: #1E293B; margin-top: 2rem; font-size: 0.9rem; }
                  .prose hr { margin: 1.5rem 0; border-top-color: #E2E8F0; }
                  .prose p { line-height: 1.8; color: #334155; }
                  .prose li { margin: 0.2rem 0; }
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
