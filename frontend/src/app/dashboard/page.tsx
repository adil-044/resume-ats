'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  Upload, FileText, ArrowRight, Loader2, Sparkles, 
  History, LogOut, LayoutDashboard, Plus, Search,
  TrendingUp, Clock, CheckCircle2, ShieldCheck, Briefcase,
  Zap, AlertTriangle, FileUp, Cpu
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
  const [analysisStep, setAnalysisStep] = useState<string>('Initializing...');

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
        job_description: item.job_description
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
    setAnalysisStep('Extracting Raw Text...');
    
    try {
      setTimeout(() => setAnalysisStep('Semantic Mapping...'), 2000);
      setTimeout(() => setAnalysisStep('Gap Analysis...'), 4000);
      setTimeout(() => setAnalysisStep('Structuring Executive Markdown...'), 6000);

      const result = await analyzeResume(resumeFile, jobDescription);
      
      setAnalysisStep('Securing Vault Record...');
      
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
              fetchHistory(user.id);
            }} 
            taskId={selectedTaskId} 
            onComplete={() => {}} 
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Executive Sidebar */}
        <aside className="w-72 bg-slate-50 border-r border-slate-200/60 hidden lg:flex flex-col p-8">
          <div className="flex-1 space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4">Core Management</p>
            <button 
              onClick={() => setActiveTab('scan')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'scan' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900'}`}
            >
              <Plus className="h-4 w-4" />
              New Scan
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900'}`}
            >
              <History className="h-4 w-4" />
              The Vault
            </button>
          </div>

          <div className="pt-8 border-t border-slate-200/60">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-200">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-slate-900 truncate uppercase tracking-tighter">{user?.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-[10px] text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em]"
            >
              <LogOut className="h-4 w-4" />
              Exit System
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-white p-12 lg:p-20 intelligence-scrollbar relative">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' ? (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl mx-auto"
              >
                <div className="mb-16 pb-10 border-b border-slate-100 flex justify-between items-end">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                      <Cpu className="h-3 w-3" />
                      <span>AI Model: Gemini 2.0 Flash</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-3 uppercase">Optimization Hub</h1>
                    <p className="text-slate-500 font-medium text-xl">Upload your source documents to initialize semantic mapping.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left: Input Areas */}
                  <div className="lg:col-span-8 space-y-10">
                    {/* Resume Upload */}
                    <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-200/60 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-700">
                        <FileUp className="h-32 w-32 text-indigo-600" />
                      </div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
                        01. Executive Document Input
                      </label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all duration-500 text-center flex flex-col items-center bg-white shadow-inner ${
                          dragActive ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-400'
                        }`}
                      >
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <>
                            <div className="bg-indigo-600 p-5 rounded-3xl mb-6 shadow-2xl shadow-indigo-300 animate-in zoom-in-95"><FileText className="h-10 w-10 text-white" /></div>
                            <p className="text-slate-900 font-black text-2xl mb-2 truncate max-w-full px-6">{resumeFile.name}</p>
                            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] bg-indigo-50 px-4 py-1.5 rounded-full">System Ready</p>
                          </>
                        ) : (
                          <>
                            <div className="bg-slate-50 p-5 rounded-3xl mb-6 border border-slate-100 group-hover:scale-110 transition-all duration-500 shadow-sm"><Plus className="h-10 w-10 text-slate-300" /></div>
                            <p className="text-slate-900 font-black text-xl mb-2 uppercase tracking-tight">Select Executive Resume</p>
                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">PDF or DOCX (Inc. Headers)</p>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze}
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`w-full py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-5 transition-all duration-500 shadow-2xl relative overflow-hidden group ${
                        !resumeFile || !jobDescription || isAnalyzing
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:-translate-y-1 active:scale-[0.98]'
                      }`}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                          <div className="flex flex-col items-start leading-none">
                            <span className="text-lg">EXECUTING...</span>
                            <span className="text-[10px] opacity-60 uppercase tracking-widest mt-1">{analysisStep}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-8 w-8 text-indigo-400 group-hover:rotate-12 transition-transform" />
                          <span className="tracking-tight uppercase">Start Intelligence Scan</span>
                          <ArrowRight className="h-8 w-8 text-white/30 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: JD Area */}
                  <div className="lg:col-span-4 h-full">
                    <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl h-full flex flex-col relative overflow-hidden group">
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
                      <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-10">
                        02. Requirements Pool
                      </label>
                      <div className="flex-1 flex flex-col relative z-10">
                        <textarea 
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste the target JD here..."
                          className="flex-1 w-full bg-slate-800/50 border-2 border-slate-800 rounded-3xl p-8 text-white text-base leading-relaxed outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-600 shadow-inner"
                        />
                        <div className="mt-6 flex items-center justify-between text-slate-500">
                          <span className="text-[9px] font-black uppercase tracking-widest">Context Input</span>
                          <Briefcase className="h-4 w-4 opacity-30" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto pb-32"
              >
                <div className="flex justify-between items-center mb-16 pb-10 border-b border-slate-100">
                  <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Executive Vault</h1>
                    <p className="text-slate-500 font-medium text-lg mt-2">Archived high-signal resume architectures.</p>
                  </div>
                  <button onClick={() => setActiveTab('scan')} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl shadow-indigo-900/10 active:scale-95">
                    <Plus className="h-4 w-4" /> New Optimization
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-80 bg-slate-50 rounded-[3rem] animate-pulse border border-slate-100" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="bg-slate-50/50 rounded-[4rem] p-40 border border-dashed border-slate-200 text-center space-y-8">
                    <div className="h-24 w-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-xl shadow-slate-200/50">
                      <Search className="h-10 w-10 text-slate-200" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase">The Vault is empty</h3>
                      <p className="text-slate-500 font-medium mt-3 text-lg max-w-sm mx-auto">Your high-signal optimizations will be archived here for future retrieval.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -8 }}
                        className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 group cursor-pointer flex flex-col relative overflow-hidden"
                        onClick={() => {
                          setAnalysisResult(item);
                          router.push(`/workspace/${item.id}`);
                        }}
                      >
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                          <ShieldCheck className="h-32 w-32 text-indigo-600" />
                        </div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-200">
                            <Briefcase className="h-7 w-7" />
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Match Score</p>
                            <p className="text-3xl font-black text-indigo-600 tracking-tighter">{item.overall_score}%</p>
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-900 mb-3 truncate uppercase tracking-tight group-hover:text-indigo-600 transition-colors relative z-10">
                          {item.job_title || 'Untitled Optimization'}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-[9px] uppercase tracking-widest mb-10 relative z-10">
                          <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 opacity-50" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="h-1 w-1 bg-slate-200 rounded-full" />
                          <div className="flex items-center gap-1.5 text-green-600"><ShieldCheck className="h-3.5 w-3.5" /> Secured</div>
                        </div>
                        
                        <div className="mt-auto space-y-4 pt-8 border-t border-slate-50 relative z-10">
                          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-300 group-hover:text-slate-400">Initial: {item.initial_score}%</span>
                            <span className="text-indigo-600 flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                              Workspace <ArrowRight className="h-3.5 w-3.5 opacity-50" />
                            </span>
                          </div>
                          {item.overall_score < 90 && (
                            <button 
                              onClick={(e) => openBridgeGap(e, item.id)}
                              className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100/50 shadow-sm"
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
