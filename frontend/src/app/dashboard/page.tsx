'use client';

import { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { analyzeResume, generateCoverLetter } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { 
  Upload, FileText, ArrowRight, Loader2, Sparkles, 
  History, LogOut, LayoutDashboard, Plus, Search,
  TrendingUp, Clock, CheckCircle2, ShieldCheck, Briefcase,
  Zap, AlertTriangle, FileUp, Cpu, Terminal, Command, LayoutGrid,
  Rocket, Activity, Fingerprint, Globe, Shield, Menu, X, Coins,
  CreditCard, Star, ChevronRight, CheckCircle, Mail
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
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'credits' | 'coverletter'>('scan');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('Getting ready...');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [credits, setCredits] = useState(4);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clResumeText, setClResumeText] = useState('');
  const [clJobDescription, setClJobDescription] = useState('');
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      if (params.get('success') === 'true' && sessionId) {
        setShowSuccess(true);
        // Verify the purchase server-side and grant tokens
        fetch('/api/stripe/verify-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.tokens !== undefined) {
              setCredits(data.tokens);
              setShowSuccess(false);
              router.replace('/dashboard');
            } else {
              console.error('Verify purchase failed:', data.error);
              alert('Token sync issue: ' + (data.error || 'Unknown error. Please contact support.'));
              setShowSuccess(false);
            }
          })
          .catch(err => {
            console.error('Verify purchase error:', err);
            setShowSuccess(false);
          });
      }
    }
  }, [router]);



  const handlePurchase = async (amount: number, tokens: number, id: string) => {
    if (!user?.id) {
      alert("Please wait while we sync your secure session...");
      return;
    }
    
    setIsPurchasing(id);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, tokens, amount }),
      });
      
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = `Server Error (${response.status}): ${text.slice(0, 100)}...`;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Non-JSON server error:', text);
        }
        throw new Error(errorMessage);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Failed to parse server response. The server may have crashed.");
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create Stripe session. Check your server logs.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(`Error initiating checkout: ${err.message}`);
    } finally {
      setIsPurchasing(null);
    }
  };



  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
        fetchHistory(user.id);
        
        // Try fetching secure credits from DB
        const { data: profile } = await supabase.from('profiles').select('tokens').eq('id', user.id).single();
        if (profile && profile.tokens !== undefined && profile.tokens !== null) {
          setCredits(profile.tokens);
        }
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
    
    if (credits <= 0) {
      alert("You have 0 credits left. Please purchase more credits to continue analyzing resumes.");
      setActiveTab('credits');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('Reading your resume...');
    
    try {
      // 1. Fetch current tokens from DB to ensure we have the latest
      const { data: profile, error: fetchError } = await supabase.from('profiles').select('tokens').eq('id', user?.id).single();
      
      if (fetchError || !profile) {
        throw new Error("Could not verify your token balance. Please try again.");
      }

      if (profile.tokens <= 0) {
        alert("You have 0 credits left. Please purchase more credits to continue analyzing resumes.");
        setActiveTab('credits');
        setIsAnalyzing(false);
        return;
      }

      // 2. Decrement in DB securely
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ tokens: profile.tokens - 1 })
        .eq('id', user?.id);

      if (updateError) {
        throw new Error("Failed to use token. Please check your connection.");
      }

      // Update local state for immediate feedback
      setCredits(profile.tokens - 1);


      const result = await analyzeResume(resumeFile, jobDescription);
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          job_title: result.optimized_content.raw_text.split('\n')[0].replace('# ', '').slice(0, 50) || 'Untitled',
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
    } catch (error: any) {
      console.error(error);
      alert(`Error Analyzing Resume: ${error.message || 'Something went wrong. Please try again.'}`);
      
      // Refresh credits to get the correct state after failure
      const { data: currentProfile } = await supabase.from('profiles').select('tokens').eq('id', user?.id).single();
      if (currentProfile) setCredits(currentProfile.tokens);
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
        {/* Mobile Toggle */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-[100] bg-white text-black p-5 rounded-full shadow-2xl active:scale-90 transition-transform"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 w-72 bg-black border-r border-white/5 z-[90] 
          flex flex-col p-6 backdrop-blur-3xl transition-transform duration-500
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex-1 space-y-2 pt-10 lg:pt-0">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mb-8 px-4">Navigation</p>
            {[
              { id: 'scan', label: 'New Analysis', icon: <LayoutGrid className="h-4 w-4" /> },
              { id: 'history', label: 'My Resumes', icon: <FileText className="h-4 w-4" /> },
              { id: 'coverletter', label: 'Cover Letter', icon: <Mail className="h-4 w-4" /> },
              { id: 'credits', label: 'Buy Credits', icon: <Coins className="h-4 w-4" /> }
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
            {/* Credits Badge */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl mb-4 flex items-center gap-3">
              <Coins className="h-5 w-5 text-indigo-400 flex-shrink-0" />
              <div>
                <p className="text-white font-black text-sm">{credits} credits left</p>
                <p className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest">1 credit = 1 analysis</p>
              </div>
            </div>

            <div className="bg-white/5 p-5 rounded-3xl border border-white/5 mb-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white truncate uppercase">{user?.email?.split('@')[0]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[9px] text-red-500/60 hover:text-red-400 hover:bg-red-500/5 transition-all uppercase tracking-[0.4em]">
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-black p-6 lg:p-16 intelligence-scrollbar relative">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none scale-75">
            <NexusCore />
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'scan' && (
              <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto relative z-10">
                <div className="mb-16 pb-8 border-b border-white/5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-[0.4em] mb-6">
                    <Zap className="h-3 w-3 animate-pulse" /> AI Ready
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Resume Analyzer</h1>
                  <p className="text-slate-600 font-medium text-lg">Upload your resume and paste a job description to get your match score.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-8">
                    <div className="glass-executive p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden group">
                      <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.5em] mb-8">Step 1: Your Resume</label>
                      <div className={`relative border-2 border-dashed rounded-[2rem] p-16 text-center transition-all duration-700 bg-black/40 ${dragActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/10'}`}>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <div className="flex flex-col items-center">
                            <div className="bg-indigo-600 p-6 rounded-2xl mb-6 shadow-2xl"><FileText className="h-10 w-10 text-white" /></div>
                            <p className="text-white font-black text-2xl mb-2 tracking-tighter uppercase italic truncate max-w-full px-4">{resumeFile.name}</p>
                            <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] bg-indigo-500/10 px-4 py-1.5 rounded-full border border-indigo-500/20">File Ready</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center opacity-40 group-hover:opacity-100 transition-opacity">
                            <Upload className="h-12 w-12 text-white mb-6" />
                            <p className="text-white font-black text-xl uppercase italic tracking-tighter">Upload Your Resume</p>
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
                          <div className="flex flex-col items-start leading-none">
                            <span className="text-xl">Analyzing...</span>
                            <span className="text-[9px] opacity-60 uppercase tracking-[0.4em] mt-1">{analysisStep}</span>
                          </div>
                        </div>
                      ) : (
                        <><Rocket className="h-8 w-8 text-indigo-400 group-hover:rotate-12 transition-transform" /><span>Analyze My Resume</span><ArrowRight className="h-8 w-8 opacity-30 group-hover:translate-x-4 transition-transform" /></>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-white/5 h-full backdrop-blur-3xl flex flex-col">
                      <label className="block text-[9px] font-black text-indigo-500/60 uppercase tracking-[0.5em] mb-8">Step 2: Job Description</label>
                      <textarea 
                        value={jobDescription} 
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the full job description here..."
                        className="flex-1 w-full bg-black/60 border-2 border-white/5 rounded-3xl p-8 text-white text-lg font-medium outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-900 shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto pb-32 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 pb-8 border-b border-white/5">
                  <div>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">My Resumes</h1>
                    <p className="text-slate-600 font-medium text-xl mt-4">All your previous resume analyses</p>
                  </div>
                  <button onClick={() => setActiveTab('scan')} className="bg-white text-black px-10 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                    <Plus className="h-4 w-4" /> New Analysis
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-80 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />)}
                  </div>
                ) : history.length === 0 ? (
                  <div className="glass-executive rounded-[4rem] p-32 border border-dashed border-white/5 text-center flex flex-col items-center">
                    <Search className="h-16 w-16 text-white/5 mb-8" />
                    <h3 className="text-3xl font-black text-white uppercase opacity-20 tracking-tighter">No resumes yet</h3>
                    <p className="text-slate-600 mt-4 font-medium">Run your first analysis to get started</p>
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
                            <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mb-1">Match Score</p>
                            <p className="text-3xl font-black text-white tracking-tighter group-hover:text-indigo-500 transition-colors">{item.overall_score}%</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-white mb-4 truncate uppercase tracking-tighter italic group-hover:text-indigo-400 transition-all">{item.job_title || 'Untitled'}</h3>
                        <div className="flex items-center gap-4 text-slate-600 font-bold text-[8px] uppercase tracking-[0.3em] mb-10">
                          <div className="flex items-center gap-2"><Clock className="h-3 w-3 opacity-30" /> {new Date(item.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          <div className="h-1 w-1 bg-indigo-500/20 rounded-full" />
                          <div className="text-indigo-500/40 font-black">Analyzed</div>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.4em]">
                          <span className="text-slate-700 group-hover:text-slate-500 transition-all">Original Score: {item.initial_score}%</span>
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2 flex items-center gap-2">Open <ArrowRight className="h-3 w-3" /></span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'credits' && (
              <motion.div key="credits" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto relative z-10">
                <div className="mb-12 pb-8 border-b border-white/5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-[0.4em] mb-6">
                    <Coins className="h-3 w-3" /> Credits
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Buy Credits</h1>
                  <p className="text-slate-500 font-medium text-lg">Credits are used to run resume analyses. 1 credit = 1 analysis.</p>
                </div>

                {/* Current Balance */}
                <div className="glass-executive p-10 rounded-[2.5rem] border border-indigo-500/20 shadow-[0_0_60px_rgba(99,102,241,0.1)] mb-10">
                  <div className="flex items-center gap-6">
                    <div className="bg-indigo-600 p-5 rounded-2xl shadow-2xl">
                      <Coins className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Your Balance</p>
                      <p className="text-6xl font-black text-white tracking-tighter">{credits} <span className="text-2xl text-slate-500">credits</span></p>
                    </div>
                  </div>
                  <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm font-medium">
                      <span className="text-white font-black">1 credit</span> lets you run one full resume analysis with keyword matching and optimization suggestions.
                    </p>
                  </div>
                </div>

                {/* Pricing Options */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Single Credit */}
                  <motion.div
                    style={{ perspective: 1200 }}
                    whileHover={{ rotateX: -4, rotateY: 4, z: 30, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col cursor-pointer shadow-2xl border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="bg-white/10 p-3 rounded-2xl">
                        <Coins className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">1 Credit</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">Need one quick optimization? Buy a single token.</p>
                    <div className="mt-auto">
                      <div className="flex items-end gap-2 mb-6">
                        <span className="text-5xl font-black text-white">$1</span>
                        <span className="text-slate-500 font-bold mb-2">for 1 token</span>
                      </div>
                      <button 
                        onClick={() => handlePurchase(1, 1, 'tier1')} 
                        disabled={isPurchasing !== null}
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${isPurchasing === 'tier1' ? 'bg-indigo-400 text-white' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'}`}
                      >
                        {isPurchasing === 'tier1' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isPurchasing === 'tier1' ? 'Preparing...' : 'Buy 1 Token'}
                      </button>
                    </div>
                  </motion.div>

                  {/* 5 Credits */}
                  <motion.div
                    style={{ perspective: 1200 }}
                    whileHover={{ rotateX: -4, rotateY: 4, z: 30, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-white rounded-[2.5rem] p-10 flex flex-col cursor-pointer shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="bg-indigo-100 p-3 rounded-2xl">
                        <Star className="h-7 w-7 text-indigo-600" />
                      </div>
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Popular</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">5 Credits</h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">Applying to a few jobs? Grab a handful of tokens.</p>
                    <div className="mt-auto">
                      <div className="flex items-end gap-2 mb-6">
                        <span className="text-5xl font-black text-slate-900">$5</span>
                        <span className="text-slate-400 font-bold mb-2">for 5 tokens</span>
                      </div>
                      <button 
                        onClick={() => handlePurchase(5, 5, 'tier5')} 
                        disabled={isPurchasing !== null}
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${isPurchasing === 'tier5' ? 'bg-indigo-400 text-white' : 'bg-indigo-600 text-white hover:bg-black'}`}
                      >
                        {isPurchasing === 'tier5' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isPurchasing === 'tier5' ? 'Preparing...' : 'Buy 5 Tokens'}
                      </button>
                    </div>
                  </motion.div>

                  {/* 10 Credits */}
                  <motion.div
                    style={{ perspective: 1200 }}
                    whileHover={{ rotateX: -4, rotateY: 4, z: 30, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-slate-900 rounded-[2.5rem] p-10 flex flex-col cursor-pointer shadow-2xl border border-indigo-500/30"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="bg-indigo-500/20 p-3 rounded-2xl">
                        <Zap className="h-7 w-7 text-indigo-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2">10 Credits</h3>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">Going on an application spree? Stock up on tokens.</p>
                    <div className="mt-auto">
                      <div className="flex items-end gap-2 mb-6">
                        <span className="text-5xl font-black text-white">$10</span>
                        <span className="text-slate-500 font-bold mb-2">for 10 tokens</span>
                      </div>
                      <button 
                        onClick={() => handlePurchase(10, 10, 'tier10')} 
                        disabled={isPurchasing !== null}
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${isPurchasing === 'tier10' ? 'bg-indigo-400 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
                      >
                        {isPurchasing === 'tier10' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isPurchasing === 'tier10' ? 'Preparing...' : 'Buy 10 Tokens'}
                      </button>
                    </div>
                  </motion.div>
                </div>



                {/* Pricing explanation */}
                <div className="mt-10 p-8 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <span className="text-white font-black">How it works:</span> New users get 4 analyses for $1 to start. After that, each analysis costs $1. There are no monthly fees or subscriptions — you only pay when you need it.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'coverletter' && (
              <motion.div key="coverletter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto relative z-10">
                <div className="mb-12 pb-8 border-b border-white/5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-[0.4em] mb-6">
                    <Mail className="h-3 w-3" /> Cover Letter
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none italic mb-4">Generate Cover Letter</h1>
                  <p className="text-slate-500 font-medium text-lg">Paste your resume and job description to get a personalized, AI-powered cover letter. Costs 1 credit.</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3">Your Resume (paste text)</label>
                    <textarea
                      value={clResumeText}
                      onChange={(e) => setClResumeText(e.target.value)}
                      className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm font-medium resize-none outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-700 intelligence-scrollbar"
                      placeholder="Paste your resume content here..."
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3">Job Description</label>
                    <textarea
                      value={clJobDescription}
                      onChange={(e) => setClJobDescription(e.target.value)}
                      className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-sm font-medium resize-none outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-700 intelligence-scrollbar"
                      placeholder="Paste the job description here..."
                    />
                  </div>

                  <button
                    onClick={async () => {
                      if (!clResumeText.trim() || !clJobDescription.trim()) {
                        alert('Please paste both your resume and the job description.');
                        return;
                      }
                      if (credits <= 0) {
                        alert('You need at least 1 credit to generate a cover letter.');
                        setActiveTab('credits');
                        return;
                      }
                      setIsGeneratingCL(true);
                      try {
                        // Decrement token
                        const { data: profile } = await supabase.from('profiles').select('tokens').eq('id', user?.id).single();
                        if (profile && profile.tokens > 0) {
                          await supabase.from('profiles').update({ tokens: profile.tokens - 1 }).eq('id', user?.id);
                          setCredits(profile.tokens - 1);
                        }

                        const result = await generateCoverLetter(clResumeText, clJobDescription);

                        // Save to Supabase
                        const jobTitle = clJobDescription.split('\n')[0].slice(0, 60) || 'Untitled';
                        const { data, error } = await supabase.from('cover_letters').insert({
                          user_id: user.id,
                          job_title: jobTitle,
                          content: result.cover_letter,
                          resume_text: clResumeText,
                          job_description: clJobDescription,
                        }).select().single();

                        if (error) throw error;
                        router.push(`/cover-letter/${data.id}`);
                      } catch (err: any) {
                        console.error(err);
                        alert(`Error generating cover letter: ${err.message}`);
                        // Refresh credits
                        const { data: p } = await supabase.from('profiles').select('tokens').eq('id', user?.id).single();
                        if (p) setCredits(p.tokens);
                      } finally {
                        setIsGeneratingCL(false);
                      }
                    }}
                    disabled={isGeneratingCL || !clResumeText.trim() || !clJobDescription.trim()}
                    className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${
                      isGeneratingCL ? 'bg-indigo-400 text-white' : 'bg-white text-black hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isGeneratingCL ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                    {isGeneratingCL ? 'Generating Your Cover Letter...' : 'Generate Cover Letter (1 Credit)'}
                  </button>

                  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                    <p className="text-slate-400 text-sm leading-relaxed">
                      <span className="text-white font-black">AI-Powered:</span> Your cover letter is personalized using your actual resume experience and tailored to the specific job requirements. Edit and export as PDF from the workspace.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Toast */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-xl"
              >
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>Payment Successful! Syncing tokens...</span>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
