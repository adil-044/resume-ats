'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { exportCoverLetter } from '@/lib/api';
import {
  Loader2, Download, ChevronLeft, FileText, Edit3,
  SplitSquareVertical, Eye, Mail, Sparkles, Copy, Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function CoverLetterWorkspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [markdown, setMarkdown] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [activePane, setActivePane] = useState<'editor' | 'preview' | 'split'>('split');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      try {
        const { data, error } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setMarkdown(data.content || '');
        setJobTitle(data.job_title || 'Cover Letter');
      } catch (error) {
        console.error('Failed to fetch cover letter:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoverLetter();
  }, [id]);

  const handleSave = async () => {
    try {
      await supabase
        .from('cover_letters')
        .update({ content: markdown })
        .eq('id', id);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black gap-10">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 opacity-20" />
        <p className="text-white font-black uppercase tracking-[0.5em] text-[10px] animate-pulse">Loading your cover letter...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden font-sans selection:bg-indigo-500/30">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-[0.02]" />
      <Navbar />

      <header className="bg-black border-b border-white/5 px-8 py-4 flex items-center justify-between z-30 shadow-2xl">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-600 hover:text-white border border-transparent hover:border-white/10"><ChevronLeft className="h-5 w-5" /></Link>
          <div className="h-8 w-px bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] leading-none mb-2">Cover Letter</span>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-indigo-500/50" />
              <span className="font-black text-white text-sm tracking-tight italic uppercase truncate max-w-[200px]">{jobTitle}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          {[{ id: 'editor', icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Edit' }, { id: 'split', icon: <SplitSquareVertical className="h-3.5 w-3.5" />, label: 'Split View' }, { id: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: 'Preview' }].map((pane) => (
            <button key={pane.id} onClick={() => setActivePane(pane.id as any)} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${activePane === pane.id ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}>{pane.icon} {pane.label}</button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
          >
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleSave}
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" /> Save
          </button>
          <button
            onClick={async () => { try { await exportCoverLetter(markdown); } catch (e) { alert('Export failed'); } }}
            className="flex items-center gap-3 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <main className="flex-1 flex overflow-hidden relative z-10">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex-1 flex flex-col bg-black ${activePane === 'split' ? 'border-r border-white/5' : ''} z-10`}>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="flex-1 p-12 font-mono text-[14px] leading-[2.2] outline-none resize-none text-slate-400 selection:bg-indigo-500/40 placeholder:text-slate-900 bg-transparent intelligence-scrollbar"
                spellCheck={false}
                placeholder="Your cover letter will appear here..."
              />
            </div>
          )}

          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-black overflow-y-auto p-12 intelligence-scrollbar shadow-inner relative">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm p-20 prose prose-slate prose-sm prose-indigo max-w-none relative z-10 animate-in fade-in duration-700">
                <style jsx global>{`
                  .prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: -0.04em; color: #000; border-bottom: 4px solid #f1f5f9; padding-bottom: 0.5rem; }
                  .prose h2 { border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.15em; color: #1e293b; margin-top: 2rem; font-size: 0.9rem; }
                  .prose p { line-height: 1.9; color: #334155; font-size: 1rem; }
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
