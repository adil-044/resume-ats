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
  Rocket, Activity
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
      
      setAnalysisStep('Securing Vault Records...');
      
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

      <div className="flex-1 flex overflow-hidden">
        {/* Elite Sidebar */}
        <aside className="w-80 bg-slate-900/50 border-r border-white/5 hidden lg:flex flex-col p-8 backdrop-blur-xl">
          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 px-4">Executive Systems</p>
            <button 
              onClick={() => setActiveTab('scan')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${activeTab === 'scan' ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutGrid className="h-4 w-4" />
              Intelligence Hub
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all duration-500 ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] border border-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Terminal className="h-4 w-4" />
              Strategic Vault
            </button>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-inner mb-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-xl shadow-indigo-900/20">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{user?.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Secured Node</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-black text-[10px] text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-[0.3em] border border-transparent hover:border-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Terminate Session
            </button>
          </div>
        </aside>

        {/* Command Center Content */}
        <main className="flex-1 overflow-y-auto bg-[#020617] p-12 lg:p-24 intelligence-scrollbar relative">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' ? (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
              >
                <div className="mb-20 pb-12 border-b border-white/5 flex justify-between items-end">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                      <Cpu className="h-3.5 w-3.5 animate-pulse" />
                      <span>Protocol: Executive Mapping 12.0</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Command Center</h1>
                    <p className="text-slate-500 font-medium text-2xl">Initialize document extraction to reveal match delta.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left: Input Areas */}
                  <div className="lg:col-span-8 space-y-12">
                    <div className="glass-executive p-12 rounded-[4rem] relative overflow-hidden group border-white/10">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10">
                        01. Source Identity Input
                      </label>
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-[3rem] p-24 transition-all duration-700 text-center flex flex-col items-center bg-black/40 shadow-inner ${
                          dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <>
                            <div className="bg-indigo-600 p-8 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-900/40 animate-in zoom-in-95"><FileText className="h-14 w-14 text-white" /></div>
                            <p className="text-white font-black text-3xl mb-3 truncate max-w-full px-8">{resumeFile.name}</p>
                            <p className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.3em] bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20">Extraction Ready</p>
                          </>
                        ) : (
                          <>
                            <div className="bg-white/5 p-8 rounded-[2.5rem] mb-8 border border-white/10 group-hover:scale-110 transition-all duration-700 shadow-2xl text-white/20 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500"><Plus className="h-14 w-14" /></div>
                            <p className="text-white font-black text-2xl mb-3 uppercase tracking-tighter italic">Upload Identity Source</p>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">PDF / DOCX Required</p>
                          </>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze}
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`w-full py-10 rounded-[3.5rem] font-black text-3xl flex items-center justify-center gap-8 transition-all duration-700 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group active:scale-[0.98] border border-white/10 ${
                        !resumeFile || !jobDescription || isAnalyzing
                        ? 'bg-white/5 text-slate-700 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black hover:shadow-white/10'
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-6">
                          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
                          <div className="flex flex-col items-start leading-none">
                            <span className="text-xl">EXECUTING...</span>
                            <span className="text-[11px] opacity-60 uppercase tracking-[0.4em] mt-2 italic font-black">{analysisStep}</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Rocket className="h-10 w-10 text-indigo-400 group-hover:rotate-12 transition-transform duration-700" />
                          <span className="tracking-tight uppercase italic">Start Strategic Scan</span>
                          <ArrowRight className="h-10 w-10 opacity-30 group-hover:translate-x-4 transition-transform duration-700" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: JD Area */}
                  <div className="lg:col-span-4 h-full">
                    <div className="bg-slate-900/80 p-12 rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] h-full flex flex-col relative overflow-hidden group border border-white/5">
                      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px]" />
                      <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-12">
                        02. Requirements Pool
                      </label>
                      <div className="flex-1 flex flex-col relative z-10">
                        <textarea 
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste the target JD architecture..."
                          className="flex-1 w-full bg-black/40 border-2 border-white/5 rounded-[3rem] p-10 text-white text-xl font-medium leading-relaxed outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-800 shadow-inner"
                        />
                        <div className="mt-8 flex items-center justify-between text-slate-600">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Context Input</span>
                          <Command className="h-5 w-5 opacity-20" />
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
                className="max-w-[1600px] mx-auto pb-48"
              >
                <div className="flex justify-between items-center mb-24 pb-12 border-b border-white/5">
                  <div>
                    <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-none italic">The Vault</h1>
                    <p className="text-slate-500 font-medium text-2xl mt-4">High-signal career architectures, secured.</p>
                  </div>
                  <button onClick={() => setActiveTab('scan')} className="bg-white text-black px-12 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-4 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)] active:scale-95">
                    <Plus className="h-5 w-5" /> New Strategy
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-96 bg-white/5 rounded-[4rem] animate-pulse border border-white/5" />
                    ))}
                  </div>
                ) : history.length === 0 ? (
                  <div className="glass-executive rounded-[5rem] p-48 border border-dashed border-white/5 text-center space-y-10">
                    <div className="h-32 w-32 bg-white/5 rounded-[3rem] mx-auto flex items-center justify-center shadow-inner text-white/10">
                      <Search className="h-12 w-12" />
                    </div>
                    <div>
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Vault is Offline</h3>
                      <p className="text-slate-500 font-medium mt-4 text-xl max-w-sm mx-auto">Initialize your first strategic scan to populate your executive vault.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -12, scale: 1.02 }}
                        className="bg-slate-900/50 p-12 rounded-[4rem] border border-white/5 shadow-2xl group cursor-pointer flex flex-col relative overflow-hidden transition-all duration-700 hover:border-indigo-500/30 hover:bg-slate-900"
                        onClick={() => {
                          setAnalysisResult(item);
                          router.push(`/workspace/${item.id}`);
                        }}
                      >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-125 transition-transform duration-1000 text-white">
                          <ShieldCheck className="h-48 w-48" />
                        </div>
                        
                        <div className="flex justify-between items-start mb-12 relative z-10">
                          <div className="bg-white/5 p-5 rounded-3xl text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 border border-white/5 shadow-inner">
                            <Briefcase className="h-8 w-8" />
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 group-hover:text-indigo-400">Match</p>
                            <p className="text-4xl font-black text-white tracking-tighter group-hover:text-indigo-500 transition-colors">{item.overall_score}%</p>
                          </div>
                        </div>

                        <h3 className="text-2xl font-black text-white mb-4 truncate uppercase tracking-tighter group-hover:text-indigo-400 transition-colors relative z-10 italic">
                          {item.job_title || 'Untitled Strategy'}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-12 relative z-10">
                          <div className="flex items-center gap-2"><Clock className="h-4 w-4 opacity-30" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="h-1.5 w-1.5 bg-white/10 rounded-full" />
                          <div className="flex items-center gap-2 text-indigo-500/60 font-black"><Zap className="h-4 w-4" /> Strategic</div>
                        </div>
                        
                        <div className="mt-auto space-y-5 pt-10 border-t border-white/5 relative z-10">
                          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                            <span className="text-slate-600 group-hover:text-slate-400 transition-colors italic">Initial: {item.initial_score}%</span>
                            <span className="text-white flex items-center gap-2 group-hover:translate-x-3 transition-transform duration-700">
                              ENTER <ArrowRight className="h-4 w-4 opacity-30" />
                            </span>
                          </div>
                          {item.overall_score < 90 && (
                            <button 
                              onClick={(e) => openBridgeGap(e, item.id)}
                              className="w-full py-5 bg-white/5 text-slate-400 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white transition-all border border-white/5 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-900/20"
                            >
                              <Zap className="h-4 w-4 text-indigo-400" /> Bridge Strategy
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
