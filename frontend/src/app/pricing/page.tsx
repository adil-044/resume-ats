'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Check, Zap, Coins, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-32 relative z-10">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="text-center space-y-6 mb-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-md"
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Pay As You Go</span>
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
            Simple, Transparent <br /><span className="text-gradient-purple not-italic">Pricing.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            No subscriptions. No hidden fees. Just pay for the resumes you optimize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto relative z-10">
          {/* Starter Pack / Launch Special */}
          <motion.div whileHover={{ y: -8 }} className="bg-[#0f172a] border-2 border-amber-500/20 p-12 rounded-[3.5rem] flex flex-col h-full transition-all duration-500 hover:border-amber-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-3xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">Most Popular</div>
            <div className="mb-10 mt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">First 100 Users Only</span>
              <h3 className="text-5xl font-black text-white mt-4">$1 <span className="text-sm font-bold text-slate-500">/ 4 lifetime tokens</span></h3>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Our initial launch special. Get your first 4 resume optimizations for the price of one. Limited to the first 100 users.
            </p>
            <ul className="space-y-5 mb-12 flex-1">
              {[
                "4 Full Resume Analyses",
                "Advanced AI Optimization",
                "Job Description Matching",
                "Format-Perfect PDF Export",
                "Lifetime tokens (no expiry)"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-amber-400" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="w-full py-5 bg-amber-400 text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-amber-300 transition-all active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.15)]">Claim For $1</Link>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="bg-gradient-to-b from-indigo-600 to-indigo-900 p-12 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(79,70,229,0.4)] flex flex-col h-full relative overflow-hidden ring-1 ring-white/20">
            <div className="absolute top-0 right-0 p-10 opacity-20"><Zap className="h-40 w-40 text-white rotate-12" /></div>
            <div className="mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[9px] font-black uppercase tracking-widest mb-4 backdrop-blur-md">Pay When You Want</div>
              <h3 className="text-3xl lg:text-4xl font-black text-white mt-2 leading-tight">
                "I don't mind paying <br />$1 for 1 resume"<span className="text-[11px] font-black text-indigo-200 block mt-3 uppercase tracking-widest">No Subscriptions required</span>
              </h3>
            </div>
            <p className="text-indigo-100 mb-8 leading-relaxed relative z-10 text-sm">
              Buy a token precisely when you need to land that interview. 1 token = 1 deeply optimized resume.
            </p>
            <ul className="space-y-5 mb-12 flex-1 relative z-10">
              {[
                "Unlimited Match Scores",
                "Keyword Gap Analysis",
                "AI Rewrite Suggestions",
                "History & Saved Resumes",
                "Volume Discounts Available"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-indigo-50">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-lg">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/dashboard" className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-[#020617] hover:text-white transition-all shadow-2xl relative z-10 active:scale-95">Buy Tokens</Link>
          </motion.div>
        </div>

        <div className="mt-32 max-w-3xl mx-auto text-center">
          <Calculator className="h-10 w-10 text-slate-600 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Are you a career coach or university?</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            We offer specialized enterprise packages with bulk credits and custom branding for organizations helping multiple candidates.
          </p>
          <a href="mailto:sales@hireready.com" className="inline-flex py-4 px-8 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
            Contact Sales
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
