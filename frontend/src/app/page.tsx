'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket, MousePointer2,
  Fingerprint, Command, Activity, Terminal, ChevronRight, BarChart3
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Scene3D from '@/components/Scene3D';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Spotlight } from '@/components/ui/Spotlight';
import { Particles } from '@/components/ui/Particles';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { analyzeResume } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';

export default function Home() {
  const router = useRouter();
  const { setAnalysisResult, setResumeFile, setJobDescription } = useResumeStore();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localJD, setLocalJD] = useState('');
  const [teaserScore, setTeaserScore] = useState<number | null>(null);

  const handleInitialScan = async () => {
    if (!localFile || !localJD) return;
    
    setIsAnalyzing(true);
    setProgress(10);
    
    try {
      // Step 1: Real upload to get real initial score
      const result = await analyzeResume(localFile, localJD);
      
      // Step 2: Animate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            setTeaserScore(result.initial_score);
            setIsAnalyzing(false);
            setShowUpsell(true);
            return 100;
          }
          return prev + 10;
        });
      }, 150);

      // Store in global state for post-login
      setAnalysisResult(result);
      setResumeFile(localFile);
      setJobDescription(localJD);

    } catch (error) {
      console.error(error);
      alert('Teaser scan offline. Please try again later.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50" />
      <Navbar />
      
      <main className="relative">
        {/* Cinematic Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
          <Scene3D />
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-10 backdrop-blur-md">
                  <Fingerprint className="h-4 w-4" />
                  <span>The Quantum Protocol V14.0</span>
                </div>
                
                <h1 className="text-7xl lg:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-12 executive-gradient uppercase italic">
                  Win the <br />
                  <span className="text-white not-italic underline decoration-indigo-600 decoration-8 underline-offset-[20px]">Algorithm.</span>
                </h1>
                
                <p className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-16">
                  Bypass legacy Applicant Tracking Systems with high-fidelity, machine-readable resume architecture engineered for <span className="text-white font-bold underline decoration-indigo-500 decoration-4 underline-offset-8">90%+ match rates.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-8">
                  <Link href="/auth/login" className="px-12 py-7 bg-white text-black rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] active:scale-95 text-center">
                    Enter Executive Vault
                  </Link>
                  <a href="#teaser" className="px-12 py-7 bg-white/5 text-white border border-white/10 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md text-center">
                    Run Teaser Scan
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Live Teaser Widget */}
            <div id="teaser" className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-executive p-12 rounded-[4rem] relative overflow-hidden border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.3)] border-beam"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                  <motion.div 
                    className="h-full bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,1)]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>

                <div className="space-y-10 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">Live Analyzer</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">No Registration Required</p>
                    </div>
                    <Activity className="h-6 w-6 text-indigo-500 animate-pulse" />
                  </div>

                  <div className="space-y-6">
                    <div className="relative border-2 border-dashed border-white/10 rounded-[3rem] p-16 text-center group/drop transition-all duration-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer bg-black/40 shadow-inner">
                      <input 
                        type="file" 
                        onChange={(e) => setLocalFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {localFile ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-indigo-600 p-6 rounded-[2rem] mb-4 shadow-2xl shadow-indigo-500/40">
                            <FileText className="h-10 w-10 text-white" />
                          </div>
                          <p className="text-white font-black text-lg truncate max-w-full px-4">{localFile.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-white/5 p-6 rounded-[2.5rem] mb-6 border border-white/10 group-hover/drop:scale-110 group-hover/drop:bg-indigo-500 group-hover/drop:text-white transition-all duration-700 text-white/20">
                            <Upload className="h-10 w-10" />
                          </div>
                          <p className="text-white font-black text-xl tracking-tight uppercase">Upload Identity</p>
                          <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">PDF / DOCX Only</p>
                        </div>
                      )}
                    </div>

                    <textarea 
                      value={localJD}
                      onChange={(e) => setLocalJD(e.target.value)}
                      placeholder="Paste Target Architecture..."
                      className="w-full h-32 bg-black/40 border-2 border-white/5 rounded-[2.5rem] p-8 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white text-base leading-relaxed resize-none placeholder:text-slate-800 shadow-inner"
                    />

                    <button 
                      onClick={handleInitialScan}
                      disabled={isAnalyzing || !localFile || !localJD}
                      className={`w-full py-8 rounded-[3rem] font-black text-xl flex items-center justify-center gap-5 transition-all duration-700 shadow-2xl relative overflow-hidden group active:scale-[0.98] uppercase tracking-tighter ${
                        !localFile || !localJD || isAnalyzing 
                        ? 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black shadow-indigo-500/20'
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-4">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="tracking-tighter italic">Mapping Signals...</span>
                        </div>
                      ) : (
                        <>
                          <Zap className="h-6 w-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                          <span>Get Instant Match Score</span>
                          <ArrowRight className="h-6 w-6 opacity-30 group-hover:translate-x-4 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-64 bg-white relative selection:bg-black selection:text-white">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-40 space-y-10">
              <h2 className="text-8xl lg:text-[10rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] mb-8">
                Executive <br />
                <span className="text-indigo-600 italic">Command.</span>
              </h2>
              <p className="text-3xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-tighter">Engineered to speak the language of modern hiring algorithms.</p>
            </div>
            
            <BentoGrid className="lg:grid-rows-3 h-[1400px] gap-10">
              <BentoGridItem
                title="Deduplication Engine"
                description="Automatically strips repetitive headers, contact info artifacts, and page-break noise."
                header={<div className="h-full w-full bg-slate-50 rounded-[3rem] flex items-center justify-center"><Bot className="h-24 w-24 text-indigo-600" /></div>}
                icon={<BrainCircuit className="h-6 w-6 text-indigo-500" />}
                className="md:col-span-2 md:row-span-2 p-16 border-slate-100"
              />
              <BentoGridItem
                title="95% Match Target"
                description="Iteratively optimize your content until you hit the threshold."
                header={<div className="h-full w-full bg-slate-900 rounded-[3rem] flex items-center justify-center"><Target className="h-24 w-24 text-white" /></div>}
                icon={<Rocket className="h-6 w-6 text-indigo-500" />}
                className="p-16 border-slate-100"
              />
              <BentoGridItem
                title="Secure Vault"
                description="Bank-grade encryption for your professional history."
                header={<div className="h-full w-full bg-indigo-600 rounded-[3rem] flex items-center justify-center"><ShieldCheck className="h-24 w-24 text-white" /></div>}
                icon={<Lock className="h-6 w-6 text-white" />}
                className="md:col-span-1 md:row-span-2 p-16 border-slate-100"
              />
              <BentoGridItem
                title="Single-Pass Formatting"
                description="Designed for perfect machine-readability."
                header={<div className="h-full w-full bg-slate-50 rounded-[3rem] flex items-center justify-center"><Terminal className="h-24 w-24 text-slate-400" /></div>}
                icon={<Activity className="h-6 w-6 text-indigo-500" />}
                className="md:col-span-2 md:row-span-1 p-16 border-slate-100"
              />
            </BentoGrid>
          </div>
        </section>
      </main>

      {/* Conversion Modal */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/98 backdrop-blur-3xl"
              onClick={() => setShowUpsell(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[750px] glass-executive rounded-[4rem] p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 border-beam"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500">
                <ShieldCheck className="h-96 w-96" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="space-y-4 mb-16">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 italic">Extraction Successful</p>
                  <div className="text-[10rem] font-black text-white leading-none tracking-tighter drop-shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                    {teaserScore}<span className="text-indigo-500 text-6xl">%</span>
                  </div>
                  <div className="h-2 w-48 bg-white/5 rounded-full mx-auto overflow-hidden p-0.5 border border-white/5">
                    <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,1)]" style={{ width: `${teaserScore}%` }} />
                  </div>
                </div>

                <h2 className="text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-tight italic">Identity Mapped.</h2>
                <p className="text-2xl text-slate-400 font-medium mb-16 leading-relaxed max-w-md mx-auto uppercase tracking-tighter">
                  We've identified <span className="text-indigo-500 font-black underline underline-offset-[16px] decoration-8 decoration-indigo-500/20 text-4xl tracking-tighter italic">12 Critical Gaps</span> in your resume architecture.
                </p>
                <div className="space-y-8">
                  <Link href="/auth/login" className="w-full bg-white text-black py-10 rounded-[3rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-6 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group shadow-2xl">
                    Unlock Executive Strategy <Lock className="h-8 w-8 text-indigo-400 opacity-50 group-hover:opacity-100 transition-all" />
                  </Link>
                  <button onClick={() => { setShowUpsell(false); router.push('/auth/login'); }} className="w-full py-8 rounded-[2.5rem] font-black text-slate-500 hover:text-white transition-all text-xs uppercase tracking-[0.5em]">
                    Bypass Scan & Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
