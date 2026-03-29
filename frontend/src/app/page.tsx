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
import { analyzeResume } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';
import { Variants } from 'framer-motion';

const kineticContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  }
};

const kineticItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
};

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
    setProgress(5);
    
    try {
      const result = await analyzeResume(localFile, localJD);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            setTeaserScore(result.initial_score);
            setIsAnalyzing(false);
            setShowUpsell(true);
            return 100;
          }
          return prev + (Math.random() * 15);
        });
      }, 200);

      setAnalysisResult(result);
      setResumeFile(localFile);
      setJobDescription(localJD);
    } catch (error) {
      console.error(error);
      alert('Analysis node offline.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-[0.02]" />
      <Navbar />
      
      <main className="relative">
        {/* 3D Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
          <Scene3D />
          
          <motion.div
            variants={kineticContainer}
            initial="hidden"
            animate="show"
            className="max-w-5xl z-10"
          >
            <motion.div variants={kineticItem} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-10 backdrop-blur-md">
              <Fingerprint className="h-3 w-3" />
              <span>Quantum Protocol V15.0</span>
            </motion.div>
            
            <motion.h1 variants={kineticItem} className="text-6xl md:text-8xl lg:text-[9rem] font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase italic">
              Win the <br />
              <span className="text-kinetic not-italic underline decoration-indigo-600 decoration-4 underline-offset-[12px] md:underline-offset-[20px]">Algorithm.</span>
            </motion.h1>
            
            <motion.p variants={kineticItem} className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12 uppercase tracking-tighter">
              Bypass legacy Applicant Tracking Systems with high-fidelity, machine-readable resume architecture engineered for <span className="text-white font-bold">95%+ match rates.</span>
            </motion.p>

            <motion.div variants={kineticItem} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/login" className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95">
                Access Identity Vault
              </Link>
              <a href="#analyzer" className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                Initialize Live Scan
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-slate-600"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll to Decode</span>
            <div className="w-px h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
          </motion.div>
        </section>

        {/* Live Analyzer Section */}
        <section id="analyzer" className="py-32 px-6 lg:px-12 relative border-t border-white/5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                  Instant <br />
                  <span className="text-indigo-500">Validation.</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-xl">
                  Upload your raw career signals. Our semantic engine will reveal your "Match Delta" before you ever submit to a human.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { icon: <Zap className="h-5 w-5 text-amber-500" />, label: "Quantum Scan", desc: "Real-time mapping." },
                    { icon: <ShieldCheck className="h-5 w-5 text-green-500" />, label: "Vault Security", desc: "AES-256 encrypted." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest">
                        {item.icon} {item.label}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold tracking-tight uppercase leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="glass-executive p-10 rounded-[3rem] border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.1)] border-beam"
              >
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none">Identity Input</h3>
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mt-2">External Protocol</p>
                    </div>
                    <Terminal className="h-5 w-5 text-indigo-500/50" />
                  </div>

                  <div className="space-y-5">
                    <div className="relative border-2 border-dashed border-white/5 rounded-[2rem] p-16 text-center group/drop transition-all duration-700 hover:border-indigo-500/30 hover:bg-indigo-500/5 cursor-pointer bg-black/40">
                      <input 
                        type="file" 
                        onChange={(e) => setLocalFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {localFile ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-indigo-600 p-5 rounded-2xl mb-4 shadow-2xl">
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-white font-black text-sm truncate max-w-full px-4 italic">{localFile.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-white/5 p-6 rounded-2xl mb-5 border border-white/10 group-hover/drop:bg-indigo-600 transition-all duration-700">
                            <Upload className="h-8 w-8 text-white/20 group-hover/drop:text-white" />
                          </div>
                          <p className="text-white font-black text-lg tracking-tight uppercase italic">Upload Source</p>
                          <p className="text-slate-600 text-[9px] mt-2 font-black uppercase tracking-[0.2em]">PDF / DOCX Required</p>
                        </div>
                      )}
                    </div>

                    <textarea 
                      value={localJD}
                      onChange={(e) => setLocalJD(e.target.value)}
                      placeholder="Paste target job requirements architecture..."
                      className="w-full h-28 bg-black/60 border-2 border-white/5 rounded-[2rem] p-6 outline-none focus:border-indigo-500/50 transition-all text-white text-sm font-medium resize-none placeholder:text-slate-800 shadow-inner"
                    />

                    <button 
                      onClick={handleInitialScan}
                      disabled={isAnalyzing || !localFile || !localJD}
                      className={`w-full py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl relative overflow-hidden group active:scale-[0.98] uppercase tracking-tighter italic ${
                        !localFile || !localJD || isAnalyzing 
                        ? 'bg-white/5 text-slate-800 cursor-not-allowed border border-white/5 shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="tracking-tighter italic">Mapping... {Math.round(progress)}%</span>
                        </div>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                          <span>Get Match Score</span>
                          <ArrowRight className="h-5 w-5 opacity-30 group-hover:translate-x-2 transition-transform" />
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
        <section className="py-48 bg-white relative selection:bg-black selection:text-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-7xl lg:text-[8rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] mb-32 italic">
              Executive <br />
              <span className="text-indigo-600 not-italic">Systems.</span>
            </h2>
            
            <BentoGrid className="lg:grid-rows-3 h-[1200px] gap-8">
              <BentoGridItem
                title="Deduplication Engine"
                description="Automatically strips repetitive headers and contact artifacts."
                header={<div className="h-full w-full bg-slate-50 rounded-[2.5rem] flex items-center justify-center"><Bot className="h-16 w-16 text-indigo-600" /></div>}
                icon={<BrainCircuit className="h-5 w-5 text-indigo-500" />}
                className="md:col-span-2 md:row-span-2 p-12 border-slate-100"
              />
              <BentoGridItem
                title="95% Match Target"
                description="Iterative optimization until signal-locked."
                header={<div className="h-full w-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center"><Target className="h-16 w-16 text-white" /></div>}
                icon={<Rocket className="h-5 w-5 text-indigo-500" />}
                className="p-12 border-slate-100"
              />
              <BentoGridItem
                title="Secure Vault"
                description="Encrypted identity storage."
                header={<div className="h-full w-full bg-indigo-600 rounded-[2.5rem] flex items-center justify-center"><ShieldCheck className="h-16 w-16 text-white" /></div>}
                icon={<Lock className="h-5 w-5 text-white" />}
                className="md:col-span-1 md:row-span-2 p-12 border-slate-100"
              />
              <BentoGridItem
                title="Single-Pass Format"
                description="Machine-readability standard."
                header={<div className="h-full w-full bg-slate-50 rounded-[2.5rem] flex items-center justify-center"><Terminal className="h-16 w-16 text-slate-400" /></div>}
                icon={<Activity className="h-5 w-5 text-indigo-500" />}
                className="md:col-span-2 md:row-span-1 p-12 border-slate-100"
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
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
              onClick={() => setShowUpsell(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[650px] glass-executive rounded-[4rem] p-16 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden border border-white/10 border-beam"
            >
              <div className="text-center relative z-10">
                <div className="space-y-4 mb-12">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 italic">Extraction Successful</p>
                  <div className="text-9xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                    {teaserScore}<span className="text-indigo-600 text-5xl">%</span>
                  </div>
                  <div className="h-1.5 w-40 bg-white/5 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${teaserScore}%` }} />
                  </div>
                </div>

                <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase leading-tight italic">Identity Mapped.</h2>
                <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed max-w-md mx-auto uppercase tracking-tighter">
                  We've identified critical signal gaps in your architecture. Authorize vault access to execute bridge protocols.
                </p>
                <div className="space-y-6">
                  <Link href="/auth/login" className="w-full bg-white text-black py-6 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group shadow-2xl">
                    Unlock Strategy Protocol <Lock className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-all" />
                  </Link>
                  <button onClick={() => { setShowUpsell(false); router.push('/auth/login'); }} className="w-full py-4 text-slate-600 font-black text-[9px] uppercase tracking-[0.4em] hover:text-white transition-colors">
                    Discard Scan & Continue
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
