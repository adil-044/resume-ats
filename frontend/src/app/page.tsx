'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket, MousePointer2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
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
    <div className="min-h-screen bg-white relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="indigo" />
        <Particles className="absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="relative z-10">
        {/* Hero & Funnel Section */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-24 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm backdrop-blur-sm">
                <BrainCircuit className="h-3.5 w-3.5 animate-pulse" />
                <span>Next-Gen Semantic Architecture</span>
              </div>
              
              <h1 className="text-7xl xl:text-9xl font-black text-slate-900 leading-[0.85] tracking-tighter mb-10">
                Fix Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient uppercase">HIREREADY.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed mb-12">
                Bypass legacy Applicant Tracking Systems with a high-signal, machine-readable resume engineered for <span className="text-slate-900 font-bold underline decoration-indigo-500 underline-offset-8 decoration-4 text-2xl">90%+ match rates.</span>
              </p>

              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shadow-sm"><Zap className="h-4 w-4" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Instant Scan</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-tighter">Real-time keyword mapping.</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-100 hidden sm:block" />
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-xl text-green-600 shadow-sm"><ShieldCheck className="h-4 w-4" /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Safe Export</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-tighter">100% Machine-Readable PDF.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Funnel Upload Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/40 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] relative overflow-hidden group hover:shadow-[0_48px_80px_-12px_rgba(79,70,229,0.15)] transition-all duration-700">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100/50">
                <motion.div 
                  className="h-full bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.8)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Test Match Strength</h3>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Executive Analytics</p>
                  </div>
                  <div className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Free</div>
                </div>

                <div className="space-y-6">
                  {/* Custom Upload Dropzone */}
                  <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center group/drop transition-all duration-500 bg-white/50 hover:bg-white hover:border-indigo-400 shadow-sm">
                    <input 
                      type="file" 
                      onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="relative z-0">
                      {fileName ? (
                        <div className="flex flex-col items-center">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-indigo-600 p-5 rounded-3xl mb-6 shadow-2xl shadow-indigo-300"
                          >
                            <FileText className="h-10 w-10 text-white" />
                          </motion.div>
                          <p className="text-slate-900 font-black text-lg">{fileName}</p>
                          <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3" /> Source Extracted
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-slate-50 p-5 rounded-3xl mb-6 border border-slate-100 group-hover/drop:scale-110 group-hover/drop:bg-indigo-50 transition-all duration-500 shadow-sm text-slate-400 group-hover/drop:text-indigo-600">
                            <Upload className="h-10 w-10" />
                          </div>
                          <p className="text-slate-900 font-black text-xl tracking-tight uppercase">Upload Resume</p>
                          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">PDF / DOCX (Inc. Headers)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Requirements Textbox */}
                  <div className="relative group/input">
                    <textarea 
                      placeholder="Paste Target Job Requirements..."
                      className="w-full h-44 bg-white/80 border border-slate-200 rounded-[2.5rem] p-8 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium resize-none shadow-sm placeholder:text-slate-400"
                    />
                    <div className="absolute top-8 right-8 opacity-20 group-focus-within/input:opacity-100 group-focus-within/input:text-indigo-600 transition-all">
                      <MousePointer2 className="h-5 w-5" />
                    </div>
                  </div>

                  <button 
                    onClick={simulateScan}
                    disabled={isUploading || !fileName}
                    className={`w-full py-8 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl group active:scale-[0.98] ${
                      !fileName || isUploading 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-900/20'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                        <span className="tracking-tighter">SEMANTIC MAPPING IN PROGRESS...</span>
                      </div>
                    ) : (
                      <>
                        <Rocket className="h-6 w-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        <span className="tracking-tight uppercase">Analyze Match Strength</span>
                        <ArrowRight className="h-6 w-6 text-white/30 group-hover:translate-x-2 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -bottom-20 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] opacity-60" />
          </motion.div>
        </section>

        {/* Intelligence Grid */}
        <section id="features" className="py-40 relative">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tight uppercase">High-Stakes Resume Architecture.</h2>
              <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">Engineered to speak the language of modern hiring algorithms.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Bot className="h-8 w-8" />,
                  title: "Deduplication Engine",
                  desc: "Automatically strips repetitive headers and contact info artifacts from messy DOCX files."
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Iterative Optimization",
                  desc: "The only platform that bridges the gap with targeted AI questions to reach 95% match."
                },
                {
                  icon: <ShieldCheck className="h-8 w-8" />,
                  title: "Single-Pass Format",
                  desc: "Horizontal rules and executive spacing designed specifically for flawless machine-parsing."
                }
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 group"
                >
                  <div className="bg-slate-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 shadow-sm border border-slate-100/50">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter leading-tight">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg">{f.desc}</p>
                </motion.div>
              ))}
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
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl"
              onClick={() => setShowUpsell(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[550px] bg-white rounded-[4rem] p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="h-64 w-64 text-indigo-600" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-200 border border-indigo-400">
                  <Sparkles className="h-10 w-10 text-white animate-pulse" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Signals Mapped</h2>
                <p className="text-slate-500 font-medium mb-12 leading-relaxed text-lg">
                  We've identified <span className="text-indigo-600 font-black underline underline-offset-8 decoration-4 text-2xl tracking-tighter">12 Critical Delta Points</span> in your professional architecture.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    href="/auth/login"
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-300 active:scale-95"
                  >
                    Authorize Executive Vault <Lock className="h-4 w-4 text-indigo-300 opacity-50" />
                  </Link>
                  <button 
                    onClick={() => {
                      setShowUpsell(false);
                      router.push('/auth/login');
                    }}
                    className="w-full py-6 rounded-[2rem] font-black text-slate-400 hover:text-slate-600 transition-all text-[10px] uppercase tracking-[0.3em]"
                  >
                    Continue to Dashboard
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
