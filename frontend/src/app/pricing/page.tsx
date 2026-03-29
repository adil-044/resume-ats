'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, ShieldCheck, Cpu, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32">
        <div className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Investment Tiers</span>
          </motion.div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Scale Your <span className="text-indigo-600">Influence.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Premium semantic engineering for high-stakes career transitions. Choose the architecture that matches your ambition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Explorer Tier */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col h-full transition-all duration-500 hover:bg-white hover:shadow-2xl">
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Explorer</span>
              <h3 className="text-4xl font-black text-slate-900 mt-4">$0 <span className="text-sm font-bold text-slate-400">/ Free</span></h3>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              {[
                "1 Executive Scan per Month",
                "Standard Semantic Match Score",
                "Markdown Code Workspace",
                "Basic Single-Column PDF Export",
                "Community Support"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-600">
                  <div className="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="w-full py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95">Initialize Account</Link>
          </motion.div>

          {/* Professional Tier */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-900 p-12 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(79,70,229,0.3)] flex flex-col h-full relative overflow-hidden ring-4 ring-indigo-600/20">
            <div className="absolute top-0 right-0 p-10 opacity-10"><Zap className="h-40 w-40 text-indigo-400 rotate-12" /></div>
            <div className="mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest mb-4">Most Popular</div>
              <h3 className="text-4xl font-black text-white mt-2">$19 <span className="text-sm font-bold text-slate-500">/ Monthly</span></h3>
            </div>
            <ul className="space-y-5 mb-12 flex-1 relative z-10">
              {[
                "Unlimited Executive Scans",
                "AI 'Bridge the Gap' Technology",
                "Deep Contextual Bullet Rewriting",
                "Priority Gemini 2.0 Processing",
                "Infinite Executive Vault History",
                "Ad-Free Professional Interface"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-300">
                  <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-900/40 relative z-10 active:scale-95">Upgrade to Professional</Link>
          </motion.div>

          {/* Enterprise Tier */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col h-full transition-all duration-500 hover:bg-white hover:shadow-2xl">
            <div className="mb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Enterprise</span>
              <h3 className="text-4xl font-black text-slate-900 mt-4">Custom</h3>
            </div>
            <ul className="space-y-5 mb-12 flex-1">
              {[
                "Everything in Professional",
                "Bulk Resume Portfolio Analytics",
                "Team Collaboration & Workspace",
                "Custom ATS Logic Mapping",
                "Dedicated Success Manager",
                "SSO & Advanced Security"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-slate-600">
                  <div className="h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-green-500" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <a href="mailto:sales@hireready.com" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-black transition-all shadow-lg active:scale-95">Contact Sales</a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
