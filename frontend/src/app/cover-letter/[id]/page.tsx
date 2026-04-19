'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { exportCoverLetter } from '@/lib/api';
import {
  Loader2, Download, ChevronLeft, FileText, Edit3,
  SplitSquareVertical, Eye, Mail, Sparkles, Copy, Check,
  Save, DownloadCloud
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCoverLetter = async () => {
      try {
        const { data, error } = await supabase.from('cover_letters').select('*').eq('id', id).single();
        if (error) throw error;
        setMarkdown(data.content || '');
        setJobTitle(data.job_title || 'Cover Letter');
      } catch (error) { console.error('Failed to fetch cover letter:', error); } finally { setLoading(false); }
    };
    fetchCoverLetter();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await supabase.from('cover_letters').update({ content: markdown }).eq('id', id);
    } catch (error) { console.error('Failed to save:', error); } finally { setSaving(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#E0E5EC] gap-8">
        <div className="p-8 rounded-[32px] shadow-extruded animate-spin"><Loader2 className="h-8 w-8 text-[#6C63FF]" /></div>
        <p className="text-[#6B7280] font-display font-black uppercase tracking-[0.4em] text-[10px]">Retrieving Synthesis...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#E0E5EC] overflow-hidden font-body selection:bg-[#6C63FF]/20 text-[#3D4852]">
      <Navbar />

      <header className="bg-[#E0E5EC] border-b border-[#A3B1C6]/30 px-8 py-4 flex items-center justify-between z-30 shadow-md">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-3 shadow-extruded-sm rounded-2xl transition-all text-[#6B7280] hover:text-[#6C63FF] hover:shadow-inset-sm"><ChevronLeft className="h-5 w-5" /></Link>
          <div className="h-8 w-px bg-[#A3B1C6]/30" />
          <div className="flex flex-col">
            <span className="text-[9px] font-display font-black text-[#6B7280] uppercase tracking-widest mb-1">Synthesized Asset</span>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#6C63FF]/60" />
              <span className="font-display font-extrabold text-[#3D4852] text-sm tracking-tight italic uppercase truncate max-w-[200px]">{jobTitle}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 p-1.5 bg-[#E0E5EC] shadow-inset rounded-2xl">
          {[{ id: 'editor', icon: <Edit3 className="h-3.5 w-3.5" />, label: 'Edit' }, { id: 'split', icon: <SplitSquareVertical className="h-3.5 w-3.5" />, label: 'Split' }, { id: 'preview', icon: <Eye className="h-3.5 w-3.5" />, label: 'View' }].map((pane) => (
            <button key={pane.id} onClick={() => setActivePane(pane.id as any)} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[9px] font-display font-black uppercase tracking-widest transition-all duration-300 ${activePane === pane.id ? 'bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF]' : 'text-[#6B7280] hover:text-[#3D4852]'}`}>{pane.icon} {pane.label}</button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleCopy} className="flex items-center gap-3 px-6 py-3 bg-[#E0E5EC] text-[#3D4852] shadow-extruded-sm rounded-2xl font-display font-black text-[10px] uppercase tracking-widest hover:shadow-inset-sm transition-all active:scale-95">
            {copied ? <Check className="h-4 w-4 text-[#38B2AC]" /> : <Copy className="h-4 w-4 text-[#6B7280]" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={handleSave} className="flex items-center gap-3 px-6 py-3 bg-[#E0E5EC] text-[#3D4852] shadow-extruded-sm rounded-2xl font-display font-black text-[10px] uppercase tracking-widest hover:shadow-inset-sm transition-all active:scale-95">
            {saving ? <Loader2 className="h-4 w-4 animate-spin text-[#6C63FF]" /> : <Save className="h-4 w-4 text-[#6C63FF]" />} Save
          </button>
          <button onClick={async () => { try { await exportCoverLetter(markdown); } catch (e) { alert('Export failed'); } }} className="flex items-center gap-3 px-8 py-3 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-[10px] uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-lg active:scale-95">
            <DownloadCloud className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex overflow-hidden">
          {(activePane === 'editor' || activePane === 'split') && (
            <div className={`flex-1 flex flex-col bg-[#E0E5EC] ${activePane === 'split' ? 'border-r border-[#A3B1C6]/30' : ''}`}>
              <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="flex-1 p-12 font-mono text-sm leading-relaxed outline-none resize-none text-[#3D4852] bg-transparent shadow-inset m-6 rounded-[32px] placeholder:text-[#A3B1C6]" spellCheck={false} placeholder="Source synthesis material..." />
            </div>
          )}

          {(activePane === 'preview' || activePane === 'split') && (
            <div className="flex-1 bg-[#E0E5EC] overflow-y-auto p-12 relative">
              <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-2xl rounded-sm p-20 prose prose-slate prose-sm prose-indigo max-w-none relative animate-in fade-in duration-700">
                <style jsx global>{`
                  .prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: -0.04em; color: #000; border-bottom: 4px solid #f1f5f9; padding-bottom: 0.5rem; }
                  .prose h2 { border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.4rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; color: #1e293b; margin-top: 1.5rem; font-size: 0.85rem; }
                  .prose p { line-height: 1.8; color: #475569; font-size: 0.95rem; }
                  .prose b, .prose strong { color: #6C63FF; font-weight: 800; }
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
