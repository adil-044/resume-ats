'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Check, Zap, Rocket, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Particles } from '@/components/ui/Particles';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <Particles className="absolute inset-0 opacity-20" />
      
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32 relative z-10">
        <div className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-md"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Investment Tiers</span>
          </motion.div>
          <h1 className="text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9]">
            Scale Your <span className="text-indigo-500 italic">Influence.</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Premium semantic engineering for high-stakes career transitions. Choose the architecture that matches your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Explorer Tier */}
          <motion.div whileHover={{ y: -10 }} className="glass-executive p-12 rounded-[3.5rem] flex flex-col h-full transition-all duration-500 hover:bg-white/5">
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Explorer</span>
              <h3 className="text-4xl font-black text-white mt-4">$0 <span className="text-sm font-bold text-slate-500">/ Free</span></h3>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              {[
                "1 Executive Scan per Month",
                "Standard Semantic Match Score",
                "Markdown Code Workspace",
                "Basic Single-Pass PDF Export",
                "Community Node Access"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-400">
                  <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-indigo-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="w-full py-5 bg-white/5 border border-white/10 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-white hover:text-black transition-all active:scale-95">Initialize Account</Link>
          </motion.div>

          {/* Professional Tier */}
          <motion.div whileHover={{ y: -10 }} className="bg-indigo-600 p-12 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(79,70,229,0.4)] flex flex-col h-full relative overflow-hidden ring-1 ring-white/20">
            <div className="absolute top-0 right-0 p-10 opacity-20"><Zap className="h-40 w-40 text-white rotate-12" /></div>
            <div className="mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[9px] font-black uppercase tracking-widest mb-4 backdrop-blur-md">Tactical Priority</div>
              <h3 className="text-4xl font-black text-white mt-2">$19 <span className="text-sm font-bold text-indigo-200">/ Monthly</span></h3>
            </div>
            <ul className="space-y-5 mb-12 flex-1 relative z-10">
              {[
                "Unlimited Executive Scans",
                "AI 'Bridge the Gap' Technology",
                "Deep Contextual Re-engineering",
                "Priority Gemini 2.0 Processing",
                "Infinite Strategic History",
                "Zero-Latency Interface"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-indigo-50">
                  <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-lg">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-[#020617] hover:text-white transition-all shadow-xl relative z-10 active:scale-95">Upgrade to Pro</Link>
          </motion.div>

          {/* Enterprise Tier */}
          <motion.div whileHover={{ y: -10 }} className="glass-executive p-12 rounded-[3.5rem] flex flex-col h-full transition-all duration-500 hover:bg-white/5">
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Organization</span>
              <h3 className="text-4xl font-black text-white mt-4">Custom</h3>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              {[
                "Everything in Professional",
                "Bulk Portfolio Analytics",
                "Team Identity Management",
                "Custom ATS Logic Mapping",
                "Dedicated Success Partner",
                "ISO 27001 Security Standard"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-400">
                  <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-indigo-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <a href="mailto:sales@hireready.com" className="w-full py-5 bg-white text-black rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95">Contact Sales</a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
