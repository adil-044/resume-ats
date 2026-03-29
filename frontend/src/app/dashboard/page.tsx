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
  Rocket, Activity, Fingerprint, Globe, Shield, Menu, X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) return;
    setIsAnalyzing(true);
    setAnalysisStep('Quantum Extraction...');
    
    try {
      const result = await analyzeResume(resumeFile, jobDescription);
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          job_title: result.optimized_content.raw_text.split('\n')[0].replace('# ', '').slice(0, 50) || 'Untitled Strategy',
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
      setAnalysisResult(result);
      router.push(`/workspace/${data.id}`);
    } catch (error) {
      console.error(error);
      alert('Strategic link error.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-indigo-500/30">
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
        {/* Responsive Mobile Toggle */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-[100] bg-white text-black p-5 rounded-full shadow-2xl active:scale-90 transition-transform"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Elite Sidebar (Responsive) */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 w-72 bg-black border-r border-white/5 z-[90] 
          flex flex-col p-6 backdrop-blur-3xl transition-transform duration-500
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex-1 space-y-2 pt-10 lg:pt-0">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mb-8 px-4 italic">Command_Chain</p>
            {[
              { id: 'scan', label: 'Intelligence hub', icon: <LayoutGrid className="h-4 w-4" /> },
              { id: 'history', label: 'Strategic vault', icon: <Terminal className="h-4 w-4" /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === tab.id ? 'bg-white text-black shadow-2xl' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white truncate uppercase italic">{user?.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Quantum_Node</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[9px] text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all uppercase tracking-[0.4em]">
              <LogOut className="h-4 w-4" />
              Terminate_Session
            </button>
          </div>
        </aside>

        {/* Command Center Content */}
        <main className="flex-1 overflow-y-auto bg-black p-6 lg:p-16 intelligence-scrollbar relative">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none scale-75">
            <NexusCore />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'scan' ? (
              <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto relative z-10">
                <div className="mb-16 pb-8 border-b border-white/5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-[0.4em] mb-6">
                    <Cpu className="h-3 w-3 animate-pulse" /> Protocol_15.0
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Command Center</h1>
                  <p className="text-slate-600 font-medium text-lg uppercase tracking-tighter italic">Initialize extraction to map match delta.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-8">
                    <div className="glass-executive p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
                      <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mb-8 italic">01. Source_Input</label>
                      <div className={`relative border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-700 bg-black/40 ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/10'}`}>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <div className="flex flex-col items-center">
                            <div className="bg-indigo-600 p-6 rounded-2xl mb-6 shadow-2xl"><FileText className="h-10 w-10 text-white" /></div>
                            <p className="text-white font-black text-2xl mb-2 tracking-tighter uppercase italic truncate max-w-full px-4">{resumeFile.name}</p>
                            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">Data_Locked</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-12 w-12 text-white mb-6" />
                            <p className="text-white font-black text-xl uppercase italic tracking-tighter">Upload Identity Source</p>
                            <p className="text-slate-600 text-[8px] font-black uppercase mt-2">PDF / DOCX Required</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze} 
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`w-full py-10 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-6 transition-all duration-700 shadow-2xl uppercase tracking-tighter italic border border-white/10 ${!resumeFile || !jobDescription || isAnalyzing ? 'bg-white/5 text-slate-800 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-white hover:text-black'}`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-4">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <div className="flex flex-col items-start leading-none"><span className="text-xl">Executing...</span><span className="text-[9px] opacity-60 uppercase tracking-[0.4em] mt-1">{analysisStep}</span></div>
                        </div>
                      ) : (
                        <><Rocket className="h-8 w-8 text-indigo-400 group-hover:rotate-12 transition-transform" /><span>Initialize Analysis</span><ArrowRight className="h-8 w-8 opacity-30 group-hover:translate-x-4 transition-transform" /></>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 h-full backdrop-blur-3xl flex flex-col">
                      <label className="block text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.5em] mb-8 italic">02. Requirements_Pool</label>
                      <textarea 
                        value={jobDescription} 
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste target requirements..."
                        className="flex-1 w-full bg-black/60 border-2 border-white/5 rounded-3xl p-8 text-white text-lg font-medium outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto pb-32 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 pb-8 border-b border-white/5">
                  <div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">The Vault</h1>
                    <p className="text-slate-600 font-medium text-xl mt-4 uppercase tracking-tighter italic">High-signal career architectures.</p>
                  </div>
                  <button onClick={() => setActiveTab('scan')} className="bg-white text-black px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                    <Plus className="h-4 w-4" /> New_Strategy
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />)}
                  </div>
                ) : history.length === 0 ? (
                  <div className="glass-executive rounded-[4rem] p-32 border border-dashed border-white/5 text-center flex flex-col items-center">
                    <Search className="h-16 w-16 text-white/5 mb-8" />
                    <h3 className="text-3xl font-black text-white uppercase italic opacity-20 tracking-tighter">Vault_Offline</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id} 
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 shadow-xl group cursor-pointer flex flex-col relative overflow-hidden transition-all duration-700 hover:border-indigo-500/30 hover:bg-black/60 border-beam"
                        onClick={() => { setAnalysisResult(item); router.push(`/workspace/${item.id}`); }}
                      >
                        <div className="flex justify-between items-start mb-10 relative z-10">
                          <div className="bg-white/5 p-4 rounded-2xl text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 border border-white/5"><Briefcase className="h-6 w-6" /></div>
                          <div className="text-right">
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1 italic">Signal</p>
                            <p className="text-3xl font-black text-white tracking-tighter group-hover:text-indigo-500 transition-colors">{item.overall_score}%</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-white mb-4 truncate uppercase tracking-tighter italic group-hover:text-indigo-400 transition-all">{item.job_title || 'Untitled_Strategy'}</h3>
                        <div className="flex items-center gap-4 text-slate-600 font-bold text-[8px] uppercase tracking-[0.3em] mb-10 italic">
                          <div className="flex items-center gap-2"><Clock className="h-3 w-3 opacity-30" /> {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="h-1 w-1 bg-indigo-500/20 rounded-full" />
                          <div className="text-indigo-500/40 font-black">Strategic</div>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em]">
                          <span className="text-slate-700 group-hover:text-slate-500 transition-all italic">Base: {item.initial_score}%</span>
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 flex items-center gap-2">EXEC <ArrowRight className="h-3 w-3" /></span>
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
