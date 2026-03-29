'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket, MousePointer2,
  Fingerprint, Command, Activity, Terminal, ChevronRight
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
import { Meteors } from '@/components/ui/Meteors';
import RetroGrid from '@/components/ui/RetroGrid';

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
    <div className="min-h-screen bg-[#020617] selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      <Navbar />
      
      <main className="relative">
        {/* Cinematic Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
          <RetroGrid />
          <Meteors number={30} />
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          
          <div className="relative z-10 max-w-[1600px] mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-md mx-auto">
                <Fingerprint className="h-4 w-4" />
                <span>Executive Intelligence Standard</span>
              </div>
              
              <h1 className="text-7xl lg:text-[12rem] font-black text-white leading-[0.8] tracking-tighter mb-12 drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                Win the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 uppercase italic tracking-normal">Algorithm.</span>
              </h1>
              
              <p className="text-2xl text-slate-400 font-medium max-w-3xl leading-relaxed mb-16 mx-auto">
                Bypass legacy Applicant Tracking Systems with a high-fidelity, machine-readable resume engineered for <span className="text-white font-black underline decoration-indigo-500 decoration-8 underline-offset-[16px]">90%+ match rates.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Link href="/auth/login" className="px-16 py-8 bg-white text-black rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95">
                  Authorize Vault
                </Link>
                <Link href="/auth/login" className="px-16 py-8 bg-white/5 text-white border border-white/10 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md border-beam">
                  Start Analysis
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Funnel Section with Glass UI */}
        <section className="py-64 px-6 lg:px-12 relative bg-[#020617]">
          <Particles className="absolute inset-0 opacity-20" />
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-6 space-y-12">
              <h2 className="text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-none">
                Semantic <br />
                <span className="text-indigo-500">Extraction.</span>
              </h2>
              <p className="text-2xl text-slate-400 leading-relaxed max-w-xl font-medium">
                Our engine maps every signal against target requirements to reveal the "Match Delta" before you ever submit.
              </p>
              <div className="grid grid-cols-2 gap-10 pt-8">
                {[
                  { icon: <Zap className="h-6 w-6 text-amber-500" />, label: "Instant Map", desc: "Real-time entity extraction." },
                  { icon: <ShieldCheck className="h-6 w-6 text-green-500" />, label: "Privacy Core", desc: "AES-256 Vault Encryption." }
                ].map((item, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center gap-3 text-white font-black text-sm uppercase tracking-widest">
                      {item.icon} {item.label}
                    </div>
                    <p className="text-xs text-slate-500 font-bold tracking-tight uppercase leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="glass-executive p-16 rounded-[4rem] relative overflow-hidden group border-white/10 shadow-[0_0_100px_-20px_rgba(99,102,241,0.2)]"
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
                      <h3 className="text-4xl font-black mb-2 tracking-tight uppercase leading-none italic">MISSION CONTROL</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Confidential Protocol</p>
                    </div>
                    <Terminal className="h-8 w-8 opacity-20" />
                  </div>

                  <div className="space-y-8">
                    <div className="relative border-2 border-dashed border-white/10 rounded-[3rem] p-24 text-center group/drop transition-all duration-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer bg-black/20">
                      <input 
                        type="file" 
                        onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {fileName ? (
                        <div className="flex flex-col items-center">
                          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-indigo-600 p-10 rounded-[2.5rem] mb-8 shadow-2xl shadow-indigo-500/40">
                            <FileText className="h-16 w-14 text-white" />
                          </motion.div>
                          <p className="text-white font-black text-2xl tracking-tight uppercase">{fileName}</p>
                          <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                            <Activity className="h-4 w-4 animate-pulse" /> Extraction Ready
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-white/5 p-10 rounded-[2.5rem] mb-8 border border-white/10 group-hover/drop:scale-110 group-hover/drop:bg-indigo-500 transition-all duration-700">
                            <Upload className="h-16 w-16 text-white/20 group-hover/drop:text-white" />
                          </div>
                          <p className="text-white font-black text-2xl tracking-tight uppercase italic">Upload Identity Source</p>
                          <p className="text-slate-500 text-xs mt-4 font-black uppercase tracking-[0.2em]">PDF / DOCX Highly Recommended</p>
                        </div>
                      )}
                    </div>

                    <textarea 
                      placeholder="Paste Target Architecture Requirements..."
                      className="w-full h-48 bg-black/40 border-2 border-white/5 rounded-[3rem] p-10 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white text-xl font-medium leading-relaxed resize-none placeholder:text-slate-800 shadow-inner"
                    />

                    <button 
                      onClick={simulateScan}
                      disabled={isUploading || !fileName}
                      className={`w-full py-10 rounded-[3rem] font-black text-3xl flex items-center justify-center gap-8 transition-all duration-700 shadow-2xl relative overflow-hidden group active:scale-[0.98] uppercase tracking-tighter ${
                        !fileName || isUploading 
                        ? 'bg-white/5 text-slate-800 cursor-not-allowed border border-white/5'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black shadow-indigo-500/20'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-6">
                          <Loader2 className="h-10 w-10 animate-spin text-white" />
                          <span className="tracking-tighter">SEMANTIC MAPPING IN PROGRESS...</span>
                        </div>
                      ) : (
                        <>
                          <Rocket className="h-10 w-10 text-indigo-400 group-hover:rotate-12 transition-transform" />
                          <span>Initialize Analysis</span>
                          <ArrowRight className="h-10 w-10 opacity-30 group-hover:translate-x-4 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid with Bento Layout */}
        <section id="logic" className="py-64 bg-white selection:bg-black selection:text-white">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-40 space-y-10">
              <h2 className="text-8xl lg:text-[10rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] mb-8">
                Executive <br />
                <span className="text-indigo-600 italic">Systems.</span>
              </h2>
              <p className="text-3xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-tighter">Engineered to speak the language of modern hiring algorithms.</p>
            </div>
            
            <BentoGrid className="lg:grid-rows-3 h-[1400px] gap-10">
              <BentoGridItem
                title="Deduplication Engine"
                description="Automatically strips repetitive headers, contact info artifacts, and page-break noise from complex DOCX files."
                header={<div className="h-full w-full bg-slate-50 rounded-[3rem] flex items-center justify-center"><Bot className="h-20 w-20 text-indigo-600" /></div>}
                icon={<BrainCircuit className="h-6 w-6 text-indigo-500" />}
                className="md:col-span-2 md:row-span-2 p-16"
              />
              <BentoGridItem
                title="95% Match Target"
                description="Iteratively optimize your content until you hit the critical match threshold."
                header={<div className="h-full w-full bg-slate-900 rounded-[3rem] flex items-center justify-center"><Target className="h-20 w-20 text-white" /></div>}
                icon={<Rocket className="h-6 w-6 text-indigo-500" />}
                className="p-16"
              />
              <BentoGridItem
                title="Identity Sync"
                description="Your vault is secured via bank-grade encryption and accessible globally."
                header={<div className="h-full w-full bg-indigo-600 rounded-[3rem] flex items-center justify-center"><Globe className="h-20 w-20 text-white animate-spin-slow" /></div>}
                icon={<ShieldCheck className="h-6 w-6 text-white" />}
                className="md:col-span-1 md:row-span-2 p-16"
              />
              <BentoGridItem
                title="Single-Pass Pass"
                description="Designed specifically for flawless machine-parsing and human readability."
                header={<div className="h-full w-full bg-slate-50 rounded-[3rem] flex items-center justify-center"><FileText className="h-20 w-20 text-slate-400" /></div>}
                icon={<Zap className="h-6 w-6 text-indigo-500" />}
                className="md:col-span-2 md:row-span-1 p-16"
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
              className="relative w-full max-w-[700px] bg-white rounded-[4rem] p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
            >
              <div className="text-center relative z-10">
                <div className="bg-indigo-600 w-32 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-16 shadow-2xl ring-8 ring-indigo-50">
                  <Sparkles className="h-16 w-16 text-white animate-pulse" />
                </div>
                <h2 className="text-7xl font-black text-slate-900 mb-10 tracking-tighter uppercase leading-none italic">Logic Ready.</h2>
                <p className="text-3xl text-slate-500 font-medium mb-20 leading-relaxed max-w-lg mx-auto uppercase tracking-tighter">
                  We've mapped <span className="text-indigo-600 font-black underline underline-offset-[16px] decoration-8 decoration-indigo-500/20 text-6xl tracking-tighter italic">12 Critical Gaps</span> in your identity architecture.
                </p>
                <div className="space-y-8">
                  <Link href="/auth/login" className="w-full bg-slate-950 text-white py-10 rounded-[3rem] font-black text-xl uppercase tracking-widest flex items-center justify-center gap-6 hover:bg-indigo-600 transition-all active:scale-95 group">
                    Unlock Identity Vault <Lock className="h-8 w-8 text-indigo-400 opacity-50 group-hover:opacity-100 transition-all" />
                  </Link>
                  <button onClick={() => { setShowUpsell(false); router.push('/auth/login'); }} className="w-full py-8 rounded-[2.5rem] font-black text-slate-400 hover:text-slate-600 transition-all text-sm uppercase tracking-[0.5em]">
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
