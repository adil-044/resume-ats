'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket, MousePointer2,
  ChevronRight, Fingerprint, Command, Activity, Terminal
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Spotlight } from '@/components/ui/Spotlight';
import { Particles } from '@/components/ui/Particles';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { AuroraBackground } from '@/components/ui/AuroraBackground';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [fileName, setResumeFileName] = useState<string | null>(null);

  const simulateScan = () => {
    if (!fileName) return;
    setIsUploading(true);
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 15;
      if (current >= 85) {
        current = 85;
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setShowUpsell(true);
        }, 1000);
      }
      setProgress(current);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with Aurora */}
      <AuroraBackground className="h-auto py-32 lg:py-48 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 max-w-[1600px] mx-auto text-center z-10"
        >
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 backdrop-blur-md">
            <Fingerprint className="h-4 w-4" />
            <span>The Intelligence Standard V12.0</span>
          </div>
          
          <h1 className="text-7xl lg:text-[11rem] font-black text-white leading-[0.8] tracking-tighter mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Win the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 uppercase italic">Algorithm.</span>
          </h1>
          
          <p className="text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed mb-16 mx-auto">
            Bypass legacy Applicant Tracking Systems with a high-fidelity, machine-readable resume engineered for <span className="text-white font-black underline decoration-indigo-500 decoration-8 underline-offset-[12px]">90%+ match rates.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-8">
            <Link href="/auth/login" className="px-12 py-7 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] hover:shadow-indigo-500/50 hover:scale-105 active:scale-95">
              Enter Executive Vault
            </Link>
            <a href="#logic" className="px-12 py-7 bg-white/5 text-white border border-white/10 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md border-glow">
              Explore The Logic
            </a>
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Teaser Scan Funnel */}
      <section className="py-48 px-6 lg:px-12 relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-6 space-y-12">
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              High-Signal <br />
              <span className="text-indigo-500">Extraction.</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
              Upload your raw career data. Our semantic engine will map every signal against your target JD to reveal the "Match Delta" before you ever apply.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: <Zap className="h-5 w-5 text-amber-500" />, label: "Instant Analysis", desc: "Real-time entity extraction." },
                { icon: <ShieldCheck className="h-5 w-5 text-green-500" />, label: "Security First", desc: "Bank-grade encryption." }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest">
                    {item.icon} {item.label}
                  </div>
                  <p className="text-xs text-slate-500 font-bold tracking-tight">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="glass-executive p-12 rounded-[4rem] relative overflow-hidden group border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
                <motion.div 
                  className="h-full bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,1)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-12 relative z-10">
                <div className="flex justify-between items-start text-white">
                  <div>
                    <h3 className="text-3xl font-black mb-2 tracking-tight uppercase leading-none">Initialize Scan</h3>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Protocol</p>
                  </div>
                  <Terminal className="h-6 w-6 opacity-20" />
                </div>

                <div className="space-y-6">
                  <div className="relative border-2 border-dashed border-white/10 rounded-[3rem] p-24 text-center group/drop transition-all duration-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer">
                    <input 
                      type="file" 
                      onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    {fileName ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-indigo-600 p-8 rounded-[2.5rem] mb-6 shadow-2xl shadow-indigo-500/40 active:scale-95 transition-transform">
                          <FileText className="h-14 w-14 text-white" />
                        </div>
                        <p className="text-white font-black text-2xl tracking-tight">{fileName}</p>
                        <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                          <Activity className="h-4 w-4 animate-pulse" /> Extraction Ready
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-white/5 p-8 rounded-[2.5rem] mb-6 border border-white/10 group-hover/drop:scale-110 group-hover/drop:bg-indigo-500 group-hover/drop:text-white transition-all duration-700 text-white/20">
                          <Upload className="h-14 w-14" />
                        </div>
                        <p className="text-white font-black text-2xl tracking-tight uppercase">Upload Source</p>
                        <p className="text-slate-500 text-xs mt-3 font-black uppercase tracking-[0.2em]">PDF / DOCX Highly Recommended</p>
                      </div>
                    )}
                  </div>

                  <textarea 
                    placeholder="Paste Target Job Architecture Requirements..."
                    className="w-full h-44 bg-white/5 border-2 border-white/5 rounded-[3rem] p-10 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white text-lg leading-relaxed resize-none placeholder:text-slate-700 shadow-inner"
                  />

                  <button 
                    onClick={simulateScan}
                    disabled={isUploading || !fileName}
                    className={`w-full py-10 rounded-[3rem] font-black text-2xl flex items-center justify-center gap-6 transition-all duration-700 shadow-2xl relative overflow-hidden group active:scale-[0.98] ${
                      !fileName || isUploading 
                      ? 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                      : 'bg-indigo-600 text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-6">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                        <span className="tracking-tighter">SEMANTIC MAPPING IN PROGRESS...</span>
                      </div>
                    ) : (
                      <>
                        <Rocket className="h-8 w-8 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        <span className="tracking-tight uppercase">Analyze Match Strength</span>
                        <ArrowRight className="h-8 w-8 opacity-30 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="logic" className="py-64 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-32 space-y-8">
            <h2 className="text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] mb-8">
              Executive <br />
              <span className="text-indigo-600">Command Center.</span>
            </h2>
            <p className="text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-tighter">Engineered to speak the language of modern hiring algorithms.</p>
          </div>
          
          <BentoGrid className="lg:grid-rows-3 h-[1200px]">
            <BentoGridItem
              title="Deduplication Engine"
              description="Automatically strips repetitive headers, contact info artifacts, and page-break noise from complex DOCX files."
              header={<div className="h-full w-full bg-slate-50 rounded-2xl flex items-center justify-center"><Bot className="h-12 w-12 text-indigo-600" /></div>}
              icon={<BrainCircuit className="h-4 w-4 text-indigo-500" />}
              className="md:col-span-2 md:row-span-2"
            />
            <BentoGridItem
              title="95% Match Target"
              description="Iteratively optimize your content until you hit the critical match threshold."
              header={<div className="h-full w-full bg-slate-900 rounded-2xl flex items-center justify-center"><Target className="h-12 w-12 text-white" /></div>}
              icon={<Rocket className="h-4 w-4 text-indigo-500" />}
              className="md:col-span-1 md:row-span-1"
            />
            <BentoGridItem
              title="Global Identity Sync"
              description="Your vault is secured via bank-grade encryption and accessible anywhere."
              header={<div className="h-full w-full bg-indigo-600 rounded-2xl flex items-center justify-center"><Globe className="h-12 w-12 text-white animate-spin-slow" /></div>}
              icon={<ShieldCheck className="h-4 w-4 text-white" />}
              className="md:col-span-1 md:row-span-2"
            />
            <BentoGridItem
              title="Single-Pass Format"
              description="Designed specifically for flawless machine-parsing and human readability."
              header={<div className="h-full w-full bg-slate-50 rounded-2xl flex items-center justify-center"><FileText className="h-12 w-12 text-slate-400" /></div>}
              icon={<Zap className="h-4 w-4 text-indigo-500" />}
              className="md:col-span-2 md:row-span-1"
            />
          </BentoGrid>
        </div>
      </section>

      {/* Conversion Modal (The Hook) */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl"
              onClick={() => setShowUpsell(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[650px] bg-white rounded-[4rem] p-20 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
                <ShieldCheck className="h-96 w-96" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="bg-indigo-600 w-28 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 shadow-[0_20px_50px_rgba(79,70,229,0.4)] ring-8 ring-indigo-50">
                  <Sparkles className="h-14 w-14 text-white animate-pulse" />
                </div>
                <h2 className="text-6xl font-black text-slate-900 mb-8 tracking-tighter uppercase leading-none">Logic Ready.</h2>
                <p className="text-2xl text-slate-500 font-medium mb-16 leading-relaxed max-w-md mx-auto">
                  We've mapped <span className="text-indigo-600 font-black underline underline-offset-[14px] decoration-8 decoration-indigo-500/20 text-5xl tracking-tighter italic">12 Critical Gaps</span> in your career architecture.
                </p>
                
                <div className="space-y-6">
                  <Link 
                    href="/auth/login"
                    className="w-full bg-slate-900 text-white py-8 rounded-[2.5rem] font-black text-lg uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-900/20 active:scale-95 group"
                  >
                    Unlock Executive Vault <Lock className="h-6 w-6 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <button 
                    onClick={() => {
                      setShowUpsell(false);
                      router.push('/auth/login');
                    }}
                    className="w-full py-6 rounded-[2rem] font-black text-slate-400 hover:text-slate-600 transition-all text-sm uppercase tracking-[0.4em]"
                  >
                    Bypass Scan & Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
