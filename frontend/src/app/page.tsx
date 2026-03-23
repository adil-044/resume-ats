'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Scene3D from '@/components/Scene3D';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [fileName, setResumeFileName] = useState<string | null>(null);

  const simulateScan = () => {
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
    <div className="min-h-screen bg-white relative overflow-hidden font-sans">
      <Navbar />
      <Scene3D />

      <main className="relative z-10">
        {/* Hero & Funnel Section */}
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-20 pb-32 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10 shadow-sm">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>Semantic Architecture V10.0</span>
            </div>
            
            <h1 className="text-7xl xl:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-10">
              Win the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient uppercase">HIREREADY.</span>
            </h1>
            
            <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed mb-12">
              Bypass legacy Applicant Tracking Systems with a high-signal, machine-readable resume engineered for <span className="text-slate-900 font-bold underline decoration-indigo-500 underline-offset-8 decoration-4 text-2xl">90%+ match rates.</span>
            </p>

            <div className="flex flex-wrap gap-8 items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Instant Match
                </div>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">Real-time keyword salience scoring.</p>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden sm:block" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Executive Logic
                </div>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">Single-column logic for all ATS.</p>
              </div>
            </div>
          </motion.div>

          {/* Funnel Upload Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/70 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                <motion.div 
                  className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Test Your Strength</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Executive Scan</p>
                </div>

                <div className="space-y-6">
                  <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center group hover:border-indigo-400 transition-all duration-500 bg-slate-50/50 hover:bg-white shadow-inner">
                    <input 
                      type="file" 
                      onChange={(e) => setResumeFileName(e.target.files?.[0]?.name || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    {fileName ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-indigo-600 p-5 rounded-3xl mb-4 shadow-2xl shadow-indigo-300 active:scale-95 transition-transform">
                          <FileText className="h-10 w-10 text-white" />
                        </div>
                        <p className="text-slate-900 font-black text-lg">{fileName}</p>
                        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2">Ready for Extraction</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-5 rounded-3xl mb-4 shadow-xl group-hover:scale-110 transition-transform duration-500 border border-slate-100 text-slate-400">
                          <Upload className="h-10 w-10" />
                        </div>
                        <p className="text-slate-900 font-black text-lg tracking-tight uppercase">Drop Executive Resume</p>
                        <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">PDF / DOCX (Inc. Headers)</p>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <textarea 
                      placeholder="Paste Target Job Description Requirements..."
                      className="w-full h-40 bg-white border border-slate-200 rounded-[2.5rem] p-8 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-medium resize-none shadow-sm"
                    />
                    <div className="absolute top-6 right-8 opacity-20 pointer-events-none group-focus-within:opacity-100 transition-opacity">
                      <LayoutGrid className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>

                  <button 
                    onClick={simulateScan}
                    disabled={isUploading}
                    className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-900/10 group active:scale-[0.98]"
                  >
                    {isUploading ? (
                      <><Loader2 className="h-6 w-6 animate-spin" /> MAPPING SEMANTICS...</>
                    ) : (
                      <><Rocket className="h-6 w-6 text-indigo-400" /> INITIALIZE ANALYTICS <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -z-10 -bottom-20 -right-20 w-96 h-96 bg-indigo-50 rounded-full blur-[120px] opacity-60" />
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-40 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-5xl font-black text-slate-900 mb-24 tracking-tight uppercase">High-Stakes Architecture.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              {[
                {
                  icon: <Bot className="h-8 w-8 text-indigo-600" />,
                  title: "Deduplication Engine",
                  desc: "Automatically strips repetitive headers and contact info artifacts from messy DOCX files."
                },
                {
                  icon: <Target className="h-8 w-8 text-purple-600" />,
                  title: "Iterative Scoring",
                  desc: "The only platform that bridges the gap with targeted interview questions to reach 95% match."
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
                  title: "Executive Styling",
                  desc: "Horizontal rules and executive spacing designed specifically for machine-readability."
                }
              ].map((f, i) => (
                <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-transparent transition-all duration-700 group">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter leading-tight">{f.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                </div>
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
              className="relative w-full max-w-[550px] bg-white rounded-[3.5rem] p-16 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShieldCheck className="h-60 w-60 text-indigo-600" />
              </div>
              
              <div className="text-center relative z-10">
                <div className="bg-green-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100 border border-green-200">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Signals Mapped</h2>
                <p className="text-slate-500 font-medium mb-12 leading-relaxed text-lg">
                  We've identified <span className="text-indigo-600 font-black underline underline-offset-8 decoration-4 text-2xl tracking-tighter">12 Technical Gaps</span> in your resume architecture.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    href="/auth/login"
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-2xl shadow-indigo-300"
                  >
                    Unlock Executive Vault <Lock className="h-4 w-4 text-indigo-300" />
                  </Link>
                  <button 
                    onClick={() => setShowUpsell(false)}
                    className="w-full py-6 rounded-[2.5rem] font-black text-slate-400 hover:text-slate-600 transition-all text-[10px] uppercase tracking-[0.3em]"
                  >
                    Discard Analysis & Continue
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
