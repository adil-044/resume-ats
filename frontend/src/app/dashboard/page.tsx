'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  Upload, FileText, ArrowRight, Loader2, Sparkles, 
  History, LogOut, LayoutDashboard, Plus, Search,
  TrendingUp, Clock, CheckCircle2, ShieldCheck, Briefcase,
  Zap, AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
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
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
        
        // Sync profile data if it doesn't exist
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata.full_name || user.email?.split('@')[0],
            location: user.user_metadata.location || 'Unknown'
          });
        }
        
        fetchHistory(user.id);
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

    if (error) {
      console.error('History fetch error:', error);
    } else {
      setHistory(data.map((item: any) => ({
        id: item.id,
        overall_score: item.after_score || item.before_score,
        initial_score: item.before_score,
        breakdown: {
          keyword_match: 0,
          semantic_alignment: 0,
          section_integrity: 0
        },
        missing_keywords: [],
        matched_keywords: [],
        formatting_issues: [],
        optimized_content: {
          format: 'markdown',
          raw_text: item.optimized_text || item.original_text
        },
        job_title: item.job_title,
        job_description: item.job_description // Store the JD so we can re-optimize
      })));
    }
    setIsLoadingHistory(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeFile, jobDescription);
      
      // Save to Supabase History
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          job_title: result.optimized_content.raw_text.split('\n')[0].replace('# ', '') || 'New Optimization',
          original_text: result.original_text || '',
          optimized_text: result.optimized_content.raw_text,
          before_score: result.initial_score,
          after_score: result.overall_score,
          job_description: jobDescription
        })
        .select()
        .single();

      if (error) throw error;

      result.id = data.id;
      setAnalysisResult(result);
      router.push(`/workspace/${data.id}`);
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Check your API key and connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const openBridgeGap = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setSelectedTaskId(taskId);
    setIsGapModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <AnimatePresence>
        {isGapModalOpen && selectedTaskId && (
          <BridgeGapModal 
            isOpen={isGapModalOpen} 
            onClose={() => {
              setIsGapModalOpen(false);
              fetchHistory(user.id); // Refresh history after optimization
            }} 
            taskId={selectedTaskId} 
            onComplete={() => {}} 
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Executive Sidebar */}
        <aside className="w-72 bg-slate-50 border-r border-slate-200 hidden lg:flex flex-col p-8">
          <div className="flex-1 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Management</p>
            <button 
              onClick={() => setActiveTab('scan')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'scan' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Plus className="h-4 w-4" />
              New Executive Scan
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <History className="h-4 w-4" />
              Scan History
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tighter">{user?.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                    <span className="text-[10px] font-bold text-slate-400">Verified Professional</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Executive Content */}
        <main className="flex-1 overflow-y-auto bg-white p-12 intelligence-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' ? (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-12 border-b border-slate-100 pb-8 flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Executive Optimization Hub</h1>
                    <p className="text-slate-500 font-medium text-lg">Achieve a 90%+ ATS match score with semantic restructuring.</p>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                      <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        NLP Engine Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <FileText className="h-24 w-24 text-indigo-600" />
                      </div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
                        01. Source Document Extraction
                      </label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-[2rem] p-12 transition-all duration-300 text-center flex flex-col items-center bg-white ${
                          dragActive ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-400 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <>
                            <div className="bg-indigo-600 p-4 rounded-2xl mb-4 shadow-lg shadow-indigo-200"><FileText className="h-8 w-8 text-white" /></div>
                            <p className="text-slate-900 font-black text-xl mb-1 truncate max-w-full px-4">{resumeFile.name}</p>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Document Secured & Parsed</p>
                          </>
                        ) : (
                          <>
                            <div className="bg-slate-100 p-4 rounded-2xl mb-4"><Plus className="h-8 w-8 text-slate-400" /></div>
                            <p className="text-slate-900 font-black text-xl mb-1">Select Resume</p>
                            <p className="text-slate-400 font-medium">Supports Executive PDF & DOCX (Inc. Headers)</p>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze}
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl ${
                        !resumeFile || !jobDescription || isAnalyzing
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-slate-900 text-white hover:bg-black shadow-slate-200 hover:-translate-y-1'
                      }`}
                    >
                      {isAnalyzing ? (
                        <><Loader2 className="h-6 w-6 animate-spin" /> EXECUTING SEMANTIC ANALYSIS...</>
                      ) : (
                        <><Sparkles className="h-6 w-6" /> BEGIN EXECUTIVE OPTIMIZATION <ArrowRight className="h-6 w-6" /></>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
                        02. Target Requirements
                      </label>
                      <div className="flex-1 flex flex-col relative">
                        <textarea 
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste Job Description Requirements..."
                          className="flex-1 w-full bg-slate-800 border-none rounded-2xl p-6 text-white text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none placeholder:text-slate-500"
                        />
                        <div className="absolute bottom-4 right-4 bg-indigo-600/20 p-2 rounded-lg backdrop-blur-sm">
                          <Briefcase className="h-4 w-4 text-indigo-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
              >
                <div className="flex justify-between items-center mb-12 border-b border-slate-100 pb-8">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Vault</h1>
                  <button onClick={() => setActiveTab('scan')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-200">
                    <Plus className="h-4 w-4" /> New Optimization
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-64 bg-slate-50 rounded-[2rem] animate-pulse border border-slate-100" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="bg-slate-50 rounded-[3rem] p-32 border border-dashed border-slate-200 text-center space-y-6">
                    <div className="h-20 w-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-sm">
                      <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Vault is empty</h3>
                      <p className="text-slate-500 font-medium mt-2">Your high-signal optimizations will be archived here.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer flex flex-col"
                        onClick={() => {
                          setAnalysisResult(item);
                          router.push(`/workspace/${item.id}`);
                        }}
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Briefcase className="h-6 w-6" />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Match Score</p>
                            <p className="text-2xl font-black text-indigo-600">{item.overall_score}%</p>
                          </div>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2 truncate uppercase tracking-tight">
                          {item.job_title || 'Untitled Optimization'}
                        </h3>
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-6">
                          <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Recent</div>
                          <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-green-500" /> Verified</div>
                        </div>
                        
                        <div className="mt-auto space-y-3 pt-6 border-t border-slate-50">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-slate-300">Initial: {item.initial_score}%</span>
                            <span className="text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Workspace <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                          {item.overall_score < 90 && (
                            <button 
                              onClick={(e) => openBridgeGap(e, item.id)}
                              className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                            >
                              <Zap className="h-3 w-3" /> Bridge the Gap
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
