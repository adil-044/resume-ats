'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  Upload, FileText, ArrowRight, Loader2, Sparkles, 
  History, LogOut, LayoutDashboard, Plus, Search,
  TrendingUp, Clock, CheckCircle2, ShieldCheck, Briefcase,
  Zap, AlertTriangle, FileUp, Cpu, Terminal, Command, LayoutGrid,
  Rocket, Activity, Fingerprint, Globe, Shield
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BridgeGapModal from '@/components/BridgeGapModal';
import NexusCore from '@/components/NexusCore';

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
        original_text: item.original_text
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
    setAnalysisStep('Protocol Extraction...');
    
    try {
      setTimeout(() => setAnalysisStep('Mapping Semantic Delta...'), 2000);
      setTimeout(() => setAnalysisStep('Analyzing Match Floor...'), 4000);
      setTimeout(() => setAnalysisStep('Generating Executive Strategy...'), 6000);

      const result = await analyzeResume(resumeFile, jobDescription);
      
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          job_title: result.optimized_content.raw_text.split('\n')[0].replace('# ', '') || 'Untitled Strategy',
          original_text: result.original_text || '',
          optimized_text: result.optimized_content.raw_text,
          before_score: result.initial_score,
          after_score: result.overall_score,
          job_description: jobDescription,
          missing_keywords: result.missing_keywords,
          matched_keywords: result.matched_keywords,
          breakdown: result.breakdown,
          formatting_issues: result.formatting_issues
        })
        .select()
        .single();

      if (error) throw error;

      result.id = data.id;
      setAnalysisResult(result);
      router.push(`/workspace/${data.id}`);
    } catch (error) {
      console.error(error);
      alert('Analysis system offline. Check secure connection.');
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
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-indigo-500/30">
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

      <div className="flex-1 flex overflow-hidden relative">
        {/* Elite Sidebar */}
        <aside className="w-80 bg-slate-900/40 border-r border-white/5 hidden lg:flex flex-col p-8 backdrop-blur-3xl z-20">
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 px-4">Management</p>
            <button 
              onClick={() => setActiveTab('scan')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-700 ${activeTab === 'scan' ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutGrid className="h-4 w-4" />
              Intelligence Hub
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all duration-700 ${activeTab === 'history' ? 'bg-white text-black shadow-[0_0_40px_rgba(255,255,255,0.1)]' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
            >
              <Terminal className="h-4 w-4" />
              Strategic Vault
            </button>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-2xl">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{user?.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Node</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] font-black text-[10px] text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-[0.4em]"
            >
              <LogOut className="h-4 w-4" />
              Exit System
            </button>
          </div>
        </aside>

        {/* Command Center Content */}
        <main className="flex-1 overflow-y-auto bg-[#020617] p-12 lg:p-24 intelligence-scrollbar relative z-10">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <NexusCore />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'scan' ? (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto relative z-10"
              >
                <div className="mb-20 pb-12 border-b border-white/5 flex justify-between items-end">
                  <div>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 backdrop-blur-md">
                      <Fingerprint className="h-4 w-4" />
                      <span>Protocol: Executive Mapping 14.0</span>
                    </div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Command Center</h1>
                    <p className="text-slate-500 font-medium text-2xl uppercase tracking-tighter">Initialize document extraction to reveal match delta.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left: Input Areas */}
                  <div className="lg:col-span-8 space-y-12">
                    <div className="glass-executive p-16 rounded-[4rem] relative overflow-hidden group border-white/10 shadow-2xl">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12 italic">
                        01. Source Identity Input
                      </label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-[3rem] p-24 transition-all duration-700 text-center flex flex-col items-center bg-black/60 shadow-inner ${
                          dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <>
                            <div className="bg-indigo-600 p-10 rounded-[3rem] mb-8 shadow-2xl shadow-indigo-900/40 animate-in zoom-in-95"><FileText className="h-16 w-16 text-white" /></div>
                            <p className="text-white font-black text-4xl mb-4 truncate max-w-full px-8 tracking-tighter uppercase italic">{resumeFile.name}</p>
                            <p className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.4em] bg-indigo-500/10 px-8 py-3 rounded-full border border-indigo-500/20">Extraction Ready</p>
                          </>
                        ) : (
                          <>
                            <div className="bg-white/5 p-10 rounded-[3rem] mb-8 border border-white/10 group-hover:scale-110 transition-all duration-700 shadow-2xl text-white/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500"><Plus className="h-16 w-16" /></div>
                            <p className="text-white font-black text-3xl mb-4 uppercase tracking-tighter italic">Upload Identity Source</p>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em]">PDF / DOCX Required</p>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze}
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`w-full py-12 rounded-[4rem] font-black text-4xl flex items-center justify-center gap-10 transition-all duration-700 shadow-[0_0_100px_-20px_rgba(99,102,241,0.5)] relative overflow-hidden group active:scale-[0.98] border border-white/10 uppercase tracking-tighter italic ${
                        !resumeFile || !jobDescription || isAnalyzing
                        ? 'bg-white/5 text-slate-800 cursor-not-allowed border border-white/5 shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-8">
                          <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
                          <div className="flex flex-col items-start leading-none text-left">
                            <span className="text-2xl">EXECUTING...</span>
                            <span className="text-[11px] opacity-60 uppercase tracking-[0.5em] mt-3 italic font-black text-indigo-200">{analysisStep}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Rocket className="h-12 w-12 text-indigo-400 group-hover:rotate-12 transition-transform duration-700" />
                          <span>Initialize Analysis</span>
                          <ArrowRight className="h-12 w-12 opacity-30 group-hover:translate-x-6 transition-transform duration-700" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: JD Area */}
                  <div className="lg:col-span-4 h-full">
                    <div className="bg-slate-900/80 p-12 rounded-[4rem] shadow-2xl h-full flex flex-col relative overflow-hidden group border border-white/5 backdrop-blur-3xl">
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
                      <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.5em] mb-12 italic">
                        02. Requirements Pool
                      </label>
                      <div className="flex-1 flex flex-col relative z-10">
                        <textarea 
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste the target requirements architecture..."
                          className="flex-1 w-full bg-black/60 border-2 border-white/5 rounded-[3rem] p-12 text-white text-2xl font-medium leading-relaxed outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-900 shadow-inner"
                        />
                        <div className="mt-10 flex items-center justify-between text-slate-700 px-4">
                          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Input Context</span>
                          <Shield className="h-6 w-6 opacity-20" />
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
                className="max-w-[1600px] mx-auto pb-48 relative z-10"
              >
                <div className="flex justify-between items-center mb-24 pb-12 border-b border-white/5">
                  <div>
                    <h1 className="text-8xl font-black text-white tracking-[0.1em] uppercase leading-none italic">The Vault</h1>
                    <p className="text-slate-500 font-medium text-3xl mt-6 uppercase tracking-tighter">High-signal career architectures, secured.</p>
                  </div>
                  <button onClick={() => setActiveTab('scan')} className="bg-white text-black px-16 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all shadow-[0_0_100px_rgba(255,255,255,0.1)] active:scale-95 border border-white/10">
                    <Plus className="h-6 w-6" /> New Strategy
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-[500px] bg-white/5 rounded-[4rem] animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="glass-executive rounded-[6rem] p-64 border border-dashed border-white/5 text-center space-y-12">
                    <div className="h-40 w-40 bg-white/5 rounded-[4rem] mx-auto flex items-center justify-center shadow-inner text-white/5">
                      <Search className="h-20 w-20" />
                    </div>
                    <div>
                      <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none opacity-20">Vault is Offline</h3>
                      <p className="text-slate-600 font-medium mt-6 text-2xl max-w-lg mx-auto uppercase tracking-tighter">Initialize your first strategic scan to populate your executive vault.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -16, scale: 1.03 }}
                        className="bg-slate-900/40 p-12 rounded-[4rem] border border-white/5 shadow-2xl group cursor-pointer flex flex-col relative overflow-hidden transition-all duration-1000 hover:border-indigo-500/40 hover:bg-black/60 border-beam"
                        onClick={() => {
                          setAnalysisResult(item);
                          router.push(`/workspace/${item.id}`);
                        }}
                      >
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000 text-white">
                          <ShieldCheck className="h-64 w-64" />
                        </div>
                        
                        <div className="flex justify-between items-start mb-16 relative z-10">
                          <div className="bg-white/5 p-6 rounded-[2rem] text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 border border-white/5 shadow-inner">
                            <Briefcase className="h-10 w-10" />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-3 group-hover:text-indigo-400 italic">Match_Score</p>
                            <p className="text-5xl font-black text-white tracking-tighter group-hover:text-indigo-500 transition-all duration-700">{item.overall_score}<span className="text-xl opacity-20">%</span></p>
                          </div>
                        </div>

                        <h3 className="text-3xl font-black text-white mb-6 truncate uppercase tracking-tighter group-hover:text-indigo-400 transition-all duration-700 relative z-10 italic leading-none">
                          {item.job_title || 'Untitled_Node'}
                        </h3>
                        
                        <div className="flex items-center gap-5 text-slate-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-16 relative z-10 italic">
                          <div className="flex items-center gap-3"><Clock className="h-4 w-4 opacity-30" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="h-2 w-2 bg-indigo-500/20 rounded-full" />
                          <div className="flex items-center gap-3 text-indigo-500/40 font-black"><Zap className="h-4 w-4" /> Strategic</div>
                        </div>
                        
                        <div className="mt-auto space-y-6 pt-12 border-t border-white/5 relative z-10">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.5em]">
                            <span className="text-slate-700 group-hover:text-slate-500 transition-all italic">Base: {item.initial_score}%</span>
                            <span className="text-white flex items-center gap-3 group-hover:translate-x-4 transition-all duration-1000 opacity-20 group-hover:opacity-100">
                              EXEC <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                          {item.overall_score < 90 && (
                            <button 
                              onClick={(e) => openBridgeGap(e, item.id)}
                              className="w-full py-6 bg-white/5 text-slate-500 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all border border-white/5 hover:border-indigo-500 shadow-2xl active:scale-95"
                            >
                              <Plus className="h-4 w-4" /> Bridge Protocol
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
