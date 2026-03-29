'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket, MousePointer2,
  ChevronRight, Fingerprint, Command, Activity
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Scene3D from '@/components/Scene3D';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Spotlight } from '@/components/ui/Spotlight';
import { Particles } from '@/components/ui/Particles';

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
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      
      <main className="relative">
        {/* Cinematic Hero */}
        <section className="relative pt-32 pb-48 px-6 lg:px-12 overflow-hidden border-b border-white/5">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
          <Particles className="absolute inset-0 opacity-30" />
          
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
            <div className="lg:col-span-7 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 backdrop-blur-md">
                  <Fingerprint className="h-4 w-4" />
                  <span>The Intelligence Standard V12.0</span>
                </div>
                
                <h1 className="text-8xl xl:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-12">
                  Win the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 uppercase italic">Algorithm.</span>
                </h1>
                
                <p className="text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed mb-16">
                  Bypass legacy Applicant Tracking Systems with a high-fidelity, machine-readable resume engineered for <span className="text-white font-bold underline decoration-indigo-500 decoration-4 underline-offset-8">90%+ match rates.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                  <Link href="/auth/login" className="px-10 py-6 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-[0_0_40px_-15px_rgba(255,255,255,0.3)] text-center">
                    Enter Executive Vault
                  </Link>
                  <a href="#logic" className="px-10 py-6 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center backdrop-blur-md">
                    Explore The Logic
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Teaser Scan Widget */}
            <div className="lg:col-span-5 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="glass-executive p-12 rounded-[4rem] relative overflow-hidden group border-white/10"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white/5">
                  <motion.div 
                    className="h-full bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,1)]" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>

                <div className="space-y-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase leading-none">Test Delta</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Semantic Scan</p>
                    </div>
                    <div className="bg-white/10 text-white/50 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/5 font-mono">
                      FREE_ACCESS
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative border-2 border-dashed border-white/10 rounded-[3rem] p-20 text-center group/drop transition-all duration-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer">
                      <input 
                        type="file" 
                        onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {fileName ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-indigo-600 p-6 rounded-[2rem] mb-6 shadow-2xl shadow-indigo-500/40">
                            <FileText className="h-12 w-12 text-white" />
                          </div>
                          <p className="text-white font-black text-xl tracking-tight">{fileName}</p>
                          <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-3 animate-pulse">Extraction Ready</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-white/5 p-6 rounded-[2rem] mb-6 border border-white/10 group-hover/drop:scale-110 group-hover/drop:bg-indigo-500 group-hover/drop:text-white transition-all duration-700 text-white/20">
                            <Command className="h-12 w-12" />
                          </div>
                          <p className="text-white font-black text-xl tracking-tight uppercase">Upload Source</p>
                          <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">PDF / DOCX (Inc. Headers)</p>
                        </div>
                      )}
                    </div>

                    <textarea 
                      placeholder="Paste Target Job Architecture..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-[3rem] p-8 outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white text-base leading-relaxed resize-none placeholder:text-slate-600 shadow-inner"
                    />

                    <button 
                      onClick={simulateScan}
                      disabled={isUploading || !fileName}
                      className={`w-full py-8 rounded-[3rem] font-black text-xl flex items-center justify-center gap-5 transition-all duration-700 shadow-2xl relative overflow-hidden group active:scale-[0.98] ${
                        !fileName || isUploading 
                        ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black shadow-indigo-500/20'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-4">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                          <span className="tracking-tighter">MAPPING SEMANTICS...</span>
                        </div>
                      ) : (
                        <>
                          <Activity className="h-6 w-6" />
                          <span className="tracking-tight uppercase">Analyze Match Strength</span>
                          <ArrowRight className="h-6 w-6 opacity-30 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Executive Bento Grid */}
        <section id="logic" className="py-48 bg-white selection:bg-indigo-600 selection:text-white">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-32 space-y-6">
              <h2 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">
                Engineered for <br />
                <span className="text-indigo-600">The 1% Match.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-tighter">Speaks the language of modern hiring algorithms.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:h-[800px]">
              {/* Feature 1 */}
              <div className="md:col-span-8 bg-slate-50 rounded-[4rem] p-16 flex flex-col justify-between border border-slate-100 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
                  <BrainCircuit className="h-96 w-96 text-indigo-600" />
                </div>
                <div>
                  <div className="bg-indigo-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-10 shadow-xl shadow-indigo-200">
                    <Bot className="h-8 w-8" />
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Deduplication Engine</h3>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">Automatically strips repetitive headers, contact info artifacts, and page-break noise from complex DOCX files.</p>
                </div>
                <div className="flex gap-4">
                  {["Header Extraction", "Artifact Purge", "Identity Sync"].map((t, i) => (
                    <span key={i} className="px-4 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 shadow-sm">{t}</span>
                  ))}
                </div>
              </div>

              {/* Feature 2 */}
              <div className="md:col-span-4 bg-slate-900 rounded-[4rem] p-16 flex flex-col justify-between border border-white/5 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] transition-all duration-700 group relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                  <Target className="h-64 w-64 text-indigo-400" />
                </div>
                <div>
                  <div className="bg-white w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-slate-900 mb-10 shadow-xl shadow-white/10">
                    <Target className="h-8 w-8" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">95% Goal</h3>
                  <p className="text-xl text-slate-400 font-medium leading-relaxed">The only platform that bridges the gap with targeted AI questions to reach critical match thresholds.</p>
                </div>
                <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-indigo-500 group-hover:text-white transition-all">Start Bridge</button>
              </div>

              {/* Feature 3 */}
              <div className="md:col-span-4 bg-indigo-600 rounded-[4rem] p-16 flex flex-col justify-between border border-indigo-500 hover:shadow-2xl transition-all duration-700 group">
                <div>
                  <div className="bg-white/20 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-10 backdrop-blur-md">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Pro Export</h3>
                  <p className="text-xl text-indigo-100 font-medium leading-relaxed">Executive spacing designed specifically for flawless machine-parsing and human readability.</p>
                </div>
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-white" />
                </div>
              </div>

              {/* Feature 4 */}
              <div className="md:col-span-8 bg-slate-50 rounded-[4rem] p-16 flex flex-col justify-between border border-slate-100 hover:shadow-2xl transition-all duration-700">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-none">Global Sync</h3>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">Your professional identity is stored in our ultra-secure Executive Vault, accessible from any device, anywhere.</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <Globe className="h-32 w-32 text-slate-200 animate-spin-slow" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Standard: ISO 27001</span>
                  <Rocket className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Conversion Modal (The Hook) */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-3xl"
              onClick={() => setShowUpsell(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[600px] bg-white rounded-[4rem] p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-600">
                <ShieldCheck className="h-80 w-80" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="bg-indigo-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-indigo-300 ring-8 ring-indigo-50">
                  <Sparkles className="h-12 w-12 text-white animate-pulse" />
                </div>
                <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase leading-none">Architecture Mapped.</h2>
                <p className="text-2xl text-slate-500 font-medium mb-16 leading-relaxed">
                  We've identified <span className="text-indigo-600 font-black underline underline-offset-[12px] decoration-8 decoration-indigo-500/30 text-4xl tracking-tighter">12 Critical Gaps</span> in your executive signals.
                </p>
                
                <div className="space-y-6">
                  <Link 
                    href="/auth/login"
                    className="w-full bg-slate-900 text-white py-7 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-900/20 active:scale-95"
                  >
                    Authorize Executive Vault <Lock className="h-5 w-5 text-indigo-400 opacity-50" />
                  </Link>
                  <button 
                    onClick={() => {
                      setShowUpsell(false);
                      router.push('/auth/login');
                    }}
                    className="w-full py-6 rounded-[2rem] font-black text-slate-400 hover:text-slate-600 transition-all text-xs uppercase tracking-[0.3em]"
                  >
                    Discard Scan & Continue
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
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
