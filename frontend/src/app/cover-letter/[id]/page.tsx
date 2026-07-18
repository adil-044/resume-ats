'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { exportCoverLetter } from '@/lib/api';
import {
  Loader2, Download, ChevronLeft, FileText, Edit3,
  SplitSquareVertical, Eye, Copy, Check,
  Save, DownloadCloud
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function CoverLetterWorkspace() {
  const routeParams = useParams<{ id: string }>();
  const id = typeof routeParams?.id === 'string' ? routeParams.id : Array.isArray(routeParams?.id) ? routeParams.id[0] : '';
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#0C0C0B] gap-8">
        <div className="w-16 h-16 rounded-2xl border border-[#2A2824] flex items-center justify-center">
          <Loader2 className="h-7 w-7 text-[#C4A574] animate-spin" />
        </div>
        <p className="text-[#6B675F] font-display font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    );
  }

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
            <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#6B675F]">Cover Letter</span>
            <span className="font-display font-bold text-[#F2EFE8] text-sm truncate max-w-[160px] sm:max-w-[240px]">
              {jobTitle}
            </span>
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
            onClick={handleCopy}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#161614] border border-[#2A2824] rounded-xl text-[#F2EFE8] font-display font-bold text-xs uppercase tracking-widest hover:border-[#C4A574]/30 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleSave}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#161614] border border-[#2A2824] rounded-xl text-[#F2EFE8] font-display font-bold text-xs uppercase tracking-widest hover:border-[#C4A574]/30 transition-all"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#C4A574]" />
            ) : (
              <Save className="h-4 w-4 text-[#C4A574]" />
            )}
            Save
          </button>
          <button
            onClick={async () => { try { await exportCoverLetter(markdown); } catch (e) { alert('Export failed'); } }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#C4A574] text-white rounded-xl font-display font-bold text-xs uppercase tracking-widest hover:bg-[#D4B88A] transition-all "
          >
            <DownloadCloud className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {(activePane === 'editor' || activePane === 'split') && (
          <div className={`flex-1 flex flex-col bg-[#0C0C0B] ${activePane === 'split' ? 'border-r border-[#2A2824]' : ''}`}>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
              placeholder="Your cover letter will appear here..."
              className="flex-1 p-8 lg:p-12 font-mono text-sm leading-relaxed text-[#F2EFE8] bg-transparent outline-none resize-none placeholder-[#6B675F]"
            />
          </div>
        )}

        {/* Preview */}
        {(activePane === 'preview' || activePane === 'split') && (
          <div className="flex-1 bg-[#0C0C0B] overflow-y-auto p-6 lg:p-12">
            <div className="max-w-[850px] mx-auto bg-white min-h-[1100px] shadow-2xl rounded-sm p-16 lg:p-20">
              <style>{`
                .cl-prose h1 { font-weight: 900; text-transform: uppercase; font-size: 2rem; margin-bottom: 0.5rem; letter-spacing: -0.04em; color: #000; border-bottom: 4px solid #f1f5f9; padding-bottom: 0.5rem; }
                .cl-prose h2 { border-bottom: 1.5px solid #f1f5f9; padding-bottom: 0.4rem; text-transform: uppercase; font-weight: 900; letter-spacing: 0.1em; color: #1e293b; margin-top: 1.5rem; font-size: 0.8rem; }
                .cl-prose p { line-height: 1.8; color: #475569; font-size: 0.95rem; }
                .cl-prose b, .cl-prose strong { color: #C4A574; font-weight: 800; }
              `}</style>
              <div className="cl-prose">
                <ReactMarkdown>{markdown}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
