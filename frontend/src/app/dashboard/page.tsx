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
  Rocket, Activity, Fingerprint, Globe, Shield, Menu, X,
  ChevronRight, CheckCircle, Mail, Key, Eye, EyeOff, Settings
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
  const [activeTab, setActiveTab] = useState<'scan' | 'history' | 'coverletter' | 'pipeline'>('scan');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('Getting ready...');
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
    setAnalysisStep('Mapping semantic delta...');
    try {
      const result = await analyzeResume(resumeFile, jobDescription);
      const { data } = await supabase.from('resumes').insert({
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
      }).select().single();
      setAnalysisResult(result);
      router.push(`/workspace/${data.id}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] flex flex-col font-body selection:bg-[#6C63FF]/20 text-[#3D4852]">
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
          fixed lg:relative inset-y-0 left-0 w-72 bg-[#E0E5EC] border-r border-[#A3B1C6]/30 z-[90] 
          flex flex-col p-6 transition-transform duration-500
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex-1 space-y-3 pt-10 lg:pt-0">
            <p className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.4em] mb-8 px-4">Workspace</p>
            {[
              { id: 'scan', label: 'New Analysis', icon: <LayoutGrid className="h-4 w-4" /> },
              { id: 'history', label: 'My Resumes', icon: <FileText className="h-4 w-4" /> },
              { id: 'coverletter', label: 'Cover Letter', icon: <Mail className="h-4 w-4" /> },
              { id: 'pipeline', label: 'Job Pipeline', icon: <Briefcase className="h-4 w-4" /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-display font-bold text-[11px] uppercase tracking-widest transition-all duration-300 ${activeTab === tab.id ? 'bg-[#E0E5EC] shadow-inset-sm text-[#6C63FF]' : 'text-[#6B7280] hover:text-[#3D4852] shadow-extruded-sm hover:shadow-inset-sm'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pt-8 border-t border-[#A3B1C6]/30">
            <div className="bg-[#E0E5EC] shadow-inset-sm p-5 rounded-2xl mb-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-[#6C63FF] shadow-lg flex items-center justify-center text-white text-xs font-display font-black">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-display font-black text-[#3D4852] truncate uppercase">{user?.email?.split('@')[0]}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-1.5 bg-[#38B2AC] rounded-full animate-pulse shadow-[0_0_8px_rgba(56,178,172,1)]" />
                  <span className="text-[9px] font-display font-bold text-[#6B7280] uppercase tracking-widest">Active</span>
                </div>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-xl font-display font-bold text-[10px] text-red-500/70 hover:text-red-600 hover:shadow-inset-sm transition-all uppercase tracking-widest">
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-16 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' && (
              <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto relative z-10">
                <div className="mb-16">
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                    <Zap className="h-3 w-3" /> System Ready
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-none italic mb-6">Resume Analyzer.</h1>
                  <p className="text-[#6B7280] font-medium text-xl font-body">Optimize your profile with tactile AI precision.</p>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-8 space-y-10">
                    <div className="bg-[#E0E5EC] p-10 rounded-[40px] shadow-extruded border border-white/20">
                      <label className="block text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.4em] mb-8">01. Source Material</label>
                      <div className={`relative border-2 border-dashed rounded-[32px] p-16 text-center transition-all duration-700 bg-[#E0E5EC] shadow-inset ${dragActive ? 'shadow-inset-deep' : ''}`}>
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.docx" />
                        {resumeFile ? (
                          <div className="flex flex-col items-center">
                            <div className="bg-[#6C63FF] p-6 rounded-2xl mb-6 shadow-lg"><FileText className="h-10 w-10 text-white" /></div>
                            <p className="text-[#3D4852] font-display font-black text-2xl mb-2 tracking-tighter uppercase italic">{resumeFile.name}</p>
                            <span className="text-[#38B2AC] text-[10px] font-display font-black uppercase tracking-[0.4em]">Ready ✓</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-[#A3B1C6]">
                            <Upload className="h-12 w-12 mb-6" />
                            <p className="text-[#3D4852] font-display font-black text-xl uppercase tracking-tighter">Upload Resume</p>
                            <p className="text-[#6B7280] text-[9px] font-display font-black uppercase mt-2">PDF / DOCX Required</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze} 
                      disabled={!resumeFile || !jobDescription || isAnalyzing}
                      className={`w-full py-8 rounded-[32px] font-display font-black text-2xl flex items-center justify-center gap-6 transition-all duration-500 shadow-extruded active:scale-[0.98] uppercase tracking-tighter italic ${!resumeFile || !jobDescription || isAnalyzing ? 'text-[#A3B1C6] cursor-not-allowed' : 'bg-[#6C63FF] text-white hover:bg-[#8B84FF]'}`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-4">
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="text-xl">Processing...</span>
                        </div>
                      ) : (
                        <><Rocket className="h-8 w-8" /><span>Analyze Profile</span><ChevronRight className="h-8 w-8 opacity-40" /></>
                      )}
                    </button>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="bg-[#E0E5EC] p-10 rounded-[40px] shadow-extruded border border-white/20 h-full flex flex-col">
                      <label className="block text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.4em] mb-8">02. Target Pattern</label>
                      <textarea 
                        value={jobDescription} 
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description..."
                        className="flex-1 w-full bg-[#E0E5EC] shadow-inset rounded-3xl p-8 text-[#3D4852] text-lg font-medium outline-none focus:shadow-inset-deep transition-all resize-none font-body placeholder-[#A3B1C6]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                  <div>
                    <h1 className="text-6xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase italic leading-none">History.</h1>
                    <p className="text-[#6B7280] font-medium text-xl mt-4 font-body">Tactile archive of previous optimizations.</p>
                  </div>
                  <button onClick={() => setActiveTab('scan')} className="bg-[#E0E5EC] text-[#3D4852] shadow-extruded px-10 py-5 rounded-[2rem] font-display font-black text-[11px] uppercase tracking-widest hover:shadow-inset transition-all active:scale-95 flex items-center gap-3">
                    <Plus className="h-4 w-4" /> New Analysis
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1,2,3,4].map(i => <div key={i} className="h-80 bg-[#E0E5EC] rounded-[40px] shadow-extruded animate-pulse" />)}
                  </div>
                ) : history.length === 0 ? (
                  <div className="bg-[#E0E5EC] shadow-inset rounded-[4rem] p-32 text-center flex flex-col items-center">
                    <Search className="h-16 w-16 text-[#A3B1C6] opacity-30 mb-8" />
                    <h3 className="text-3xl font-display font-black text-[#3D4852] uppercase opacity-40 tracking-tighter">No History Detected</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {history.map((item) => (
                      <motion.div 
                        key={item.id} 
                        whileHover={{ y: -6 }}
                        className="bg-[#E0E5EC] p-8 rounded-[40px] shadow-extruded border border-white/20 group cursor-pointer flex flex-col relative transition-all duration-500"
                        onClick={() => { setAnalysisResult(item); router.push(`/workspace/${item.id}`); }}
                      >
                        <div className="flex justify-between items-start mb-10">
                          <div className="p-4 rounded-2xl shadow-inset-sm text-[#6B7280] group-hover:text-[#6C63FF] transition-all"><Briefcase className="h-6 w-6" /></div>
                          <div className="text-right">
                            <p className="text-[9px] font-display font-black text-[#6B7280] uppercase tracking-widest mb-1">Score</p>
                            <p className="text-3xl font-display font-black text-[#3D4852] group-hover:text-[#6C63FF] transition-colors">{item.overall_score}%</p>
                          </div>
                        </div>
                        <h3 className="text-xl font-display font-extrabold text-[#3D4852] mb-4 truncate uppercase italic leading-tight">{item.job_title || 'Untitled'}</h3>
                        <div className="flex items-center gap-4 text-[#6B7280] font-display font-bold text-[9px] uppercase tracking-widest mb-10">
                          <div className="flex items-center gap-2"><Clock className="h-3 w-3" /> {new Date(item.created_at || Date.now()).toLocaleDateString()}</div>
                          <div className="h-1.5 w-1.5 bg-[#6C63FF]/30 rounded-full" />
                          <div className="text-[#6C63FF]">Analyzed</div>
                        </div>
                        <div className="mt-auto pt-6 border-t border-[#A3B1C6]/20 flex items-center justify-between text-[10px] font-display font-black uppercase tracking-widest">
                          <span className="text-[#6B7280]">Initial: {item.initial_score}%</span>
                          <span className="text-[#6C63FF] opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">View <ChevronRight className="h-3 w-3" /></span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}



            {activeTab === 'coverletter' && (
              <motion.div key="coverletter" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto relative z-10">
                <div className="mb-16">
                   <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-extruded-sm text-[#fb7185] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                    <Mail className="h-3 w-3" /> Synthesis
                  </div>
                  <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-none italic mb-6">Cover Letters.</h1>
                </div>

                <div className="space-y-12">
                   <div className="bg-[#E0E5EC] p-12 rounded-[40px] shadow-extruded border border-white/20">
                    <label className="block text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.4em] mb-8">01. Identity Context</label>
                    <div className="relative h-48 rounded-[32px] shadow-inset flex flex-col items-center justify-center p-10 text-center group">
                      <input type="file" onChange={(e) => setClFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      {clFile ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-[#fb7185] p-5 rounded-2xl mb-4 shadow-lg text-white"><FileText className="h-8 w-8" /></div>
                          <p className="text-[#3D4852] font-display font-black text-xl">{clFile.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-[#A3B1C6]">
                          <Upload className="h-10 w-10 mb-4" />
                          <p className="text-[#3D4852] font-display font-black text-lg">Upload Resume Profile</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#E0E5EC] p-12 rounded-[40px] shadow-extruded border border-white/20">
                    <label className="block text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.4em] mb-8">02. Opportunity Vector</label>
                    <textarea
                      value={clJobDescription}
                      onChange={(e) => setClJobDescription(e.target.value)}
                      className="w-full h-48 bg-[#E0E5EC] shadow-inset rounded-3xl p-8 text-[#3D4852] text-lg font-medium outline-none focus:shadow-inset-deep transition-all resize-none font-body placeholder-[#A3B1C6]"
                      placeholder="Paste target job description..."
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
                    className={`w-full py-8 rounded-[32px] font-display font-black text-xl uppercase tracking-widest transition-all active:scale-[0.98] shadow-extruded flex items-center justify-center gap-4 ${isGeneratingCL ? 'text-[#A3B1C6]' : 'bg-[#fb7185] text-white hover:bg-[#ff8a9a]'}`}
                  >
                    {isGeneratingCL ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                    {isGeneratingCL ? 'Generating...' : 'Generate Cover Letter'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'pipeline' && (
              <motion.div key="pipeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto relative z-10">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-10">
                  <div>
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full shadow-extruded-sm text-[#38B2AC] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                      <Briefcase className="h-3 w-3" /> Log
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-none italic mb-6">Job Pipeline.</h1>
                    <p className="text-[#6B7280] font-medium text-xl font-body">Map your career trajectory with tactile precision.</p>
                  </div>
                  <button
                    onClick={() => setShowAddJob(true)}
                    className="flex items-center gap-3 px-10 py-5 bg-[#E0E5EC] text-[#3D4852] shadow-extruded rounded-[2rem] font-display font-black text-[11px] uppercase tracking-widest hover:shadow-inset transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" /> Add Record
                  </button>
                </div>

                <AnimatePresence>
                  {showAddJob && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-16 overflow-hidden">
                      <div className="bg-[#E0E5EC] p-12 rounded-[40px] shadow-extruded border border-white/20 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-display font-black text-[#6B7280] uppercase">Company</label>
                             <input value={newJob.company} onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))} className="w-full bg-[#E0E5EC] shadow-inset rounded-2xl px-6 py-4 outline-none text-[#3D4852] font-medium font-body" placeholder="e.g. Google" />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-display font-black text-[#6B7280] uppercase">Job Title</label>
                             <input value={newJob.job_title} onChange={(e) => setNewJob(prev => ({ ...prev, job_title: e.target.value }))} className="w-full bg-[#E0E5EC] shadow-inset rounded-2xl px-6 py-4 outline-none text-[#3D4852] font-medium font-body" placeholder="e.g. Senior Architect" />
                          </div>
                        </div>
                        <div className="flex gap-6 pt-4">
                          <button onClick={async () => {
                            if (!newJob.company.trim() || !newJob.job_title.trim()) return;
                            const { data } = await supabase.from('job_pipeline').insert({ user_id: user.id, ...newJob, status: 'saved' }).select().single();
                            if (data) { setPipelineJobs(prev => [data, ...prev]); setShowAddJob(false); setNewJob({ company: '', job_title: '', job_url: '', notes: '' }); }
                          }} className="px-10 py-4 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-widest shadow-lg hover:bg-[#8B84FF]">Record Job</button>
                          <button onClick={() => setShowAddJob(false)} className="px-10 py-4 bg-[#E0E5EC] text-[#6B7280] shadow-extruded-sm rounded-2xl font-display font-black text-[11px] uppercase tracking-widest hover:shadow-inset-sm transition-all">Cancel</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {['saved', 'applied', 'interview', 'offer', 'rejected'].map((status) => {
                    const statusLabels: Record<string, string> = { saved: 'Saved', applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' };
                    const jobs = pipelineJobs.filter(j => j.status === status);
                    return (
                      <div key={status} className="bg-[#E0E5EC] p-6 rounded-[32px] shadow-inset min-h-[400px]">
                        <div className="flex items-center justify-between mb-8 px-2">
                          <span className="text-[10px] font-display font-black text-[#3D4852] uppercase tracking-[0.2em]">{statusLabels[status]}</span>
                          <span className="text-[10px] font-display font-black text-[#6B7280] bg-[#E0E5EC] shadow-extruded-sm px-3 py-1 rounded-full">{jobs.length}</span>
                        </div>
                        <div className="space-y-4">
                          {jobs.map((job) => (
                            <motion.div key={job.id} layout className="bg-[#E0E5EC] p-5 rounded-2xl shadow-extruded border border-white/20">
                              <p className="text-[#3D4852] font-display font-extrabold text-sm truncate uppercase">{job.company}</p>
                              <p className="text-[#6B7280] text-[11px] font-body truncate mt-1">{job.job_title}</p>
                            </motion.div>
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
