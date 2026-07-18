'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume, generateCoverLetter } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import {
  Upload, FileText, ArrowRight, Loader2, Sparkles,
  History, LogOut, Plus, Search,
  Clock, CheckCircle2, Briefcase,
  Zap, FileUp, Menu, X,
  ChevronRight, Mail, TrendingUp
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BridgeGapModal from '@/components/BridgeGapModal';

export default function Dashboard() {
  const router = useRouter();
  const {
    setResumeFile,
    setJobDescription,
    setAnalysisResult,
    setIsAnalyzing,
    isAnalyzing,
    resumeFile,
    jobDescription,
    history,
    setHistory
  } = useResumeStore();

  const [dragActive, setDragActive] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'coverletter' | 'pipeline'>('scan');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [clFile, setClFile] = useState<File | null>(null);
  const [clJobDescription, setClJobDescription] = useState('');
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [pipelineJobs, setPipelineJobs] = useState<any[]>([]);
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJob, setNewJob] = useState({ company: '', job_title: '', job_url: '', notes: '' });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
        fetchHistory(user.id);
        fetchPipeline(user.id);
      }
    };
    getUser();
  }, [router]);

  const fetchHistory = async (userId: string) => {
    setIsLoadingHistory(true);
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error) {
      setHistory(data.map((item: any) => ({
        id: item.id,
        overall_score: item.after_score || item.before_score,
        initial_score: item.before_score,
        breakdown: item.breakdown || { keyword_match: 0, semantic_alignment: 0, section_integrity: 0 },
        missing_keywords: item.missing_keywords || [],
        matched_keywords: item.matched_keywords || [],
        formatting_issues: item.formatting_issues || [],
        optimized_content: {
          format: 'markdown',
          raw_text: item.optimized_text || item.original_text
        },
        job_title: item.job_title,
        job_description: item.job_description,
        original_text: item.original_text,
        created_at: item.created_at
      })));
    }
    setIsLoadingHistory(false);
  };

  const fetchPipeline = async (userId: string) => {
    const { data } = await supabase.from('job_pipeline').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setPipelineJobs(data || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeFile, jobDescription);
      const optimizedText = (result.optimized_content?.raw_text || '').trim();

      if (!optimizedText) {
        alert('AI returned empty resume content. Try again in a moment.');
        setIsAnalyzing(false);
        return;
      }

      if (optimizedText.includes('AI OPTIMIZATION ERROR') || optimizedText.includes('AI KEY NOT FOUND')) {
        alert('AI optimization failed on the server. Check backend API key / model, then retry.');
        setIsAnalyzing(false);
        return;
      }

      const { data, error: insertError } = await supabase.from('resumes').insert({
        user_id: user.id,
        job_title: optimizedText.split('\n')[0].replace(/^#\s*/, '').slice(0, 50) || 'Untitled',
        original_text: result.original_text || '',
        optimized_text: optimizedText,
        before_score: result.initial_score,
        after_score: result.overall_score,
        job_description: jobDescription,
        missing_keywords: result.missing_keywords,
        matched_keywords: result.matched_keywords,
        breakdown: result.breakdown,
        formatting_issues: result.formatting_issues
      }).select().single();

      if (insertError || !data?.id) {
        console.error('Supabase insert error:', insertError, 'data:', data);
        alert(`Error saving result: ${insertError?.message || 'No data returned'}`);
        setIsAnalyzing(false);
        return;
      }

      // Store must use Supabase row id (not Railway task UUID) so workspace URL matches
      setAnalysisResult({
        ...result,
        id: data.id,
        optimized_content: { ...result.optimized_content, raw_text: optimizedText },
      });
      router.push(`/workspace/${data.id}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const navItems = [
    { id: 'scan', label: 'New Analysis', icon: <Zap className="h-4 w-4" /> },
    { id: 'history', label: 'My Resumes', icon: <FileText className="h-4 w-4" /> },
    { id: 'coverletter', label: 'Cover Letter', icon: <Mail className="h-4 w-4" /> },
    { id: 'pipeline', label: 'Job Pipeline', icon: <Briefcase className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B12] flex flex-col text-[#F1F0F5]">
      <Navbar />

      <AnimatePresence>
        {isGapModalOpen && selectedTaskId && (
          <BridgeGapModal
            isOpen={isGapModalOpen}
            onClose={() => { setIsGapModalOpen(false); fetchHistory(user.id); }}
            taskId={selectedTaskId}
            onComplete={() => {}}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 w-72 z-[90]
          flex flex-col
          bg-[#0B0B12]/95 backdrop-blur-xl border-r border-[#1E1E30]
          transition-transform duration-500
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Logo area */}
          <div className="px-6 py-6 border-b border-[#1E1E30]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-syne font-extrabold text-[#F1F0F5] tracking-tight">
                HIRE<span className="text-[#7C3AED]">READY</span>
              </span>
            </div>
          </div>

          {/* Nav items */}
          <div className="flex-1 p-4 space-y-1 overflow-y-auto pt-4">
            <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E] px-4 mb-4">
              Workspace
            </p>
            {navItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-syne font-bold text-xs uppercase tracking-widest transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED]'
                    : 'text-[#9090A8] hover:text-[#F1F0F5] hover:bg-[#12121C] border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* User section */}
          <div className="p-4 border-t border-[#1E1E30] space-y-3">
            <div className="card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white font-syne font-extrabold text-sm shrink-0">
                {user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-syne font-bold text-[#F1F0F5] truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-wider">Active</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-syne font-bold text-xs uppercase tracking-widest text-[#9090A8] hover:text-[#EF4444] hover:bg-[#EF4444]/5 border border-transparent hover:border-[#EF4444]/20 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[89] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 relative">
          {/* Mobile header */}
          <div className="flex lg:hidden items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-[#12121C] border border-[#1E1E30] text-[#9090A8]"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="font-syne font-extrabold text-[#F1F0F5] tracking-tight">
                HIRE<span className="text-[#7C3AED]">READY</span>
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* ─── SCAN TAB ─── */}
            {activeTab === 'scan' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] text-xs font-syne font-bold uppercase tracking-widest mb-6">
                    <Zap className="h-3.5 w-3.5" /> System Ready
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-4">
                    Resume Analyzer.
                  </h1>
                  <p className="text-[#9090A8] font-dm-sans text-lg">
                    Upload your resume and paste a job description. We'll score your match and fix the gaps.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: upload + button */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="card p-8">
                      <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E] mb-6">
                        01 — Source Material
                      </p>
                      <div
                        className={`
                          relative border-2 border-dashed rounded-2xl p-16 text-center
                          transition-all duration-300 cursor-pointer
                          ${dragActive
                            ? 'border-[#7C3AED] bg-[#7C3AED]/5'
                            : 'border-[#1E1E30] hover:border-[#7C3AED]/30 bg-[#0B0B12]'
                          }
                        `}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragActive(false);
                          const file = e.dataTransfer.files[0];
                          if (file) setResumeFile(file);
                        }}
                        onClick={() => document.getElementById('resume-upload')?.click()}
                      >
                        <input
                          id="resume-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.docx"
                        />
                        {resumeFile ? (
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mb-4">
                              <FileText className="h-8 w-8 text-[#7C3AED]" />
                            </div>
                            <p className="text-[#F1F0F5] font-syne font-bold text-lg mb-2">{resumeFile.name}</p>
                            <span className="text-[#10B981] text-xs font-syne font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-[#52525E]">
                            <Upload className="h-12 w-12 mb-4" />
                            <p className="text-[#F1F0F5] font-syne font-bold text-base mb-2">Drop your resume here</p>
                            <p className="text-[#52525E] text-xs font-syne uppercase tracking-widest">PDF or DOCX</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleAnalyze}
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`
                        w-full py-5 rounded-2xl font-syne font-bold text-sm uppercase tracking-widest
                        flex items-center justify-center gap-3 transition-all
                        ${!resumeFile || !jobDescription || isAnalyzing
                          ? 'bg-[#12121C] border border-[#1E1E30] text-[#52525E] cursor-not-allowed'
                          : 'bg-[#7C3AED] text-white hover:bg-[#9D6FFF] shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-[0.98]'
                        }
                      `}
                    >
                      {isAnalyzing ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                      ) : (
                        <><Sparkles className="h-5 w-5" /> Analyze Resume</>
                      )}
                    </button>
                  </div>

                  {/* Right: job description textarea */}
                  <div className="lg:col-span-5">
                    <div className="card p-8 h-full flex flex-col">
                      <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E] mb-6">
                        02 — Target Job Description
                      </p>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="flex-1 w-full bg-[#0B0B12] border border-[#1E1E30] rounded-2xl p-6 text-[#F1F0F5] font-dm-sans text-sm leading-relaxed outline-none focus:border-[#7C3AED]/50 transition-colors resize-none placeholder-[#52525E]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── HISTORY TAB ─── */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-[1400px] mx-auto"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-3">
                      History.
                    </h1>
                    <p className="text-[#9090A8] font-dm-sans text-lg">
                      Your past analyses and optimizations.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('scan')}
                    className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#9D6FFF] transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> New Analysis
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-56 rounded-2xl bg-[#12121C] border border-[#1E1E30] animate-pulse" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="card p-32 text-center">
                    <Search className="h-16 w-16 text-[#52525E] mx-auto mb-6" />
                    <h3 className="text-2xl font-syne font-extrabold text-[#52525E] mb-3">No analyses yet</h3>
                    <p className="text-[#52525E] font-dm-sans">Run your first analysis to see it here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.3)' }}
                        className="card p-6 cursor-pointer transition-all duration-200 flex flex-col gap-4"
                        onClick={() => { setAnalysisResult(item); router.push(`/workspace/${item.id}`); }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-[#7C3AED]" />
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-syne font-bold uppercase tracking-widest text-[#52525E] mb-1">Score</p>
                            <p className="text-2xl font-syne font-extrabold text-[#F1F0F5]">{item.overall_score}%</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-syne font-bold text-[#F1F0F5] text-sm truncate mb-2">
                            {item.job_title || 'Untitled'}
                          </h3>
                          <div className="flex items-center gap-2 text-[#52525E] text-[10px] font-dm-sans">
                            <Clock className="h-3 w-3" />
                            {new Date(item.created_at || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-syne font-bold uppercase tracking-widest border-t border-[#1E1E30] pt-4">
                          <span className="text-[#52525E]">Before: {item.initial_score}%</span>
                          <span className="text-[#7C3AED] flex items-center gap-1">
                            View <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── COVER LETTER TAB ─── */}
            {activeTab === 'coverletter' && (
              <motion.div
                key="coverletter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
              >
                <div className="mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-xs font-syne font-bold uppercase tracking-widest mb-6">
                    <Mail className="h-3.5 w-3.5" /> Synthesis
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-4">
                    Cover Letters.
                  </h1>
                  <p className="text-[#9090A8] font-dm-sans text-lg">
                    Generate a targeted cover letter for any job application.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="card p-8">
                    <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E] mb-6">
                      01 — Resume Profile
                    </p>
                    <div
                      className="relative border-2 border-dashed border-[#1E1E30] hover:border-[#22D3EE]/30 rounded-2xl p-12 text-center cursor-pointer transition-all bg-[#0B0B12]"
                      onClick={() => document.getElementById('cl-upload')?.click()}
                    >
                      <input
                        id="cl-upload"
                        type="file"
                        onChange={(e) => setClFile(e.target.files?.[0] || null)}
                        className="hidden"
                        accept=".pdf,.docx"
                      />
                      {clFile ? (
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 rounded-2xl bg-[#22D3EE]/10 border border-[#22D3EE]/20 flex items-center justify-center mb-4">
                            <FileText className="h-7 w-7 text-[#22D3EE]" />
                          </div>
                          <p className="font-syne font-bold text-[#F1F0F5] text-base">{clFile.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-[#52525E]">
                          <Upload className="h-10 w-10 mb-3" />
                          <p className="font-syne font-bold text-[#F1F0F5] text-sm mb-1">Upload your resume</p>
                          <p className="text-xs font-syne uppercase tracking-widest">PDF or DOCX</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card p-8">
                    <p className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E] mb-6">
                      02 — Target Job Description
                    </p>
                    <textarea
                      value={clJobDescription}
                      onChange={(e) => setClJobDescription(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full h-48 bg-[#0B0B12] border border-[#1E1E30] rounded-2xl p-6 text-[#F1F0F5] font-dm-sans text-sm leading-relaxed outline-none focus:border-[#22D3EE]/50 transition-colors resize-none placeholder-[#52525E]"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!clFile || !clJobDescription.trim()) return;
                      setIsGeneratingCL(true);
                      try {
                        const result = await generateCoverLetter(clFile, clJobDescription);
                        const jobTitle = clJobDescription.split('\n')[0].slice(0, 60) || 'Untitled';
                        const { data } = await supabase.from('cover_letters').insert({
                          user_id: user.id, job_title: jobTitle, content: result.cover_letter, job_description: clJobDescription,
                        }).select().single();
                        router.push(`/cover-letter/${data.id}`);
                      } catch (err: any) {
                        alert(`Error: ${err.message}`);
                      } finally {
                        setIsGeneratingCL(false);
                      }
                    }}
                    disabled={isGeneratingCL || !clFile || !clJobDescription.trim()}
                    className={`
                      w-full py-5 rounded-2xl font-syne font-bold text-sm uppercase tracking-widest
                      flex items-center justify-center gap-3 transition-all
                      ${isGeneratingCL || !clFile || !clJobDescription.trim()
                        ? 'bg-[#12121C] border border-[#1E1E30] text-[#52525E] cursor-not-allowed'
                        : 'bg-[#22D3EE] text-[#0B0B12] hover:bg-[#67E8F9] shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      }
                    `}
                  >
                    {isGeneratingCL ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="h-5 w-5" /> Generate Cover Letter</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ─── PIPELINE TAB ─── */}
            {activeTab === 'pipeline' && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-syne font-bold uppercase tracking-widest mb-5">
                      <Briefcase className="h-3.5 w-3.5" /> Job Tracker
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-3">
                      Pipeline.
                    </h1>
                    <p className="text-[#9090A8] font-dm-sans text-lg">
                      Track every job across your search.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddJob(true)}
                    className="px-6 py-3 bg-[#12121C] border border-[#1E1E30] text-[#F1F0F5] rounded-xl font-syne font-bold text-xs uppercase tracking-widest hover:border-[#7C3AED]/30 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Job
                  </button>
                </div>

                <AnimatePresence>
                  {showAddJob && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="card p-8 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E]">Company</label>
                            <input
                              value={newJob.company}
                              onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))}
                              className="w-full bg-[#0B0B12] border border-[#1E1E30] rounded-xl px-5 py-3 text-[#F1F0F5] font-dm-sans text-sm outline-none focus:border-[#7C3AED]/50 transition-colors"
                              placeholder="e.g. Shopify"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-syne font-bold uppercase tracking-widest text-[#52525E]">Job Title</label>
                            <input
                              value={newJob.job_title}
                              onChange={(e) => setNewJob(prev => ({ ...prev, job_title: e.target.value }))}
                              className="w-full bg-[#0B0B12] border border-[#1E1E30] rounded-xl px-5 py-3 text-[#F1F0F5] font-dm-sans text-sm outline-none focus:border-[#7C3AED]/50 transition-colors"
                              placeholder="e.g. Senior Engineer"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 pt-2">
                          <button
                            onClick={async () => {
                              if (!newJob.company.trim() || !newJob.job_title.trim()) return;
                              const { data } = await supabase.from('job_pipeline').insert({ user_id: user.id, ...newJob, status: 'saved' }).select().single();
                              if (data) { setPipelineJobs(prev => [data, ...prev]); setShowAddJob(false); setNewJob({ company: '', job_title: '', job_url: '', notes: '' }); }
                            }}
                            className="px-8 py-3 bg-[#7C3AED] text-white rounded-xl font-syne font-bold text-xs uppercase tracking-widest hover:bg-[#9D6FFF] transition-all"
                          >
                            Save Job
                          </button>
                          <button
                            onClick={() => setShowAddJob(false)}
                            className="px-8 py-3 bg-[#12121C] border border-[#1E1E30] text-[#9090A8] rounded-xl font-syne font-bold text-xs uppercase tracking-widest hover:text-[#F1F0F5] transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { key: 'saved', label: 'Saved', color: 'text-[#9090A8]', dot: 'bg-[#9090A8]' },
                    { key: 'applied', label: 'Applied', color: 'text-[#22D3EE]', dot: 'bg-[#22D3EE]' },
                    { key: 'interview', label: 'Interview', color: 'text-[#F97316]', dot: 'bg-[#F97316]' },
                    { key: 'offer', label: 'Offer', color: 'text-[#10B981]', dot: 'bg-[#10B981]' },
                    { key: 'rejected', label: 'Rejected', color: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
                  ].map(status => {
                    const jobs = pipelineJobs.filter(j => j.status === status.key);
                    return (
                      <div key={status.key}>
                        <div className={`flex items-center gap-2 mb-3 px-1 ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          <span className="text-[10px] font-syne font-bold uppercase tracking-widest">{status.label}</span>
                          <span className="ml-auto text-[10px] font-syne font-bold text-[#52525E] bg-[#12121C] border border-[#1E1E30] rounded-full px-2 py-0.5">
                            {jobs.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {jobs.map(job => (
                            <div key={job.id} className="card p-4 cursor-pointer hover:border-[#7C3AED]/20 transition-all">
                              <p className="font-syne font-bold text-[#F1F0F5] text-xs truncate mb-1">{job.company}</p>
                              <p className="text-[#52525E] text-[10px] font-dm-sans truncate">{job.job_title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
