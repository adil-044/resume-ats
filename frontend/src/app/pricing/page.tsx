'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight uppercase">Executive Investment</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Choose the tier that matches your career velocity. Free semantic scans for everyone, elite engineering for leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Free Tier */}
          <motion.div whileHover={{ y: -10 }} className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Explorer</span>
              <h3 className="text-3xl font-black text-slate-900 mt-4">$0 <span className="text-sm font-bold text-slate-400">/ Free Forever</span></h3>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {["1 Executive Scan / Month", "Standard Semantic Match", "Markdown Preview", "Basic PDF Export"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Check className="h-4 w-4 text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-slate-200 transition-all">Start Scanning</Link>
          </motion.div>

          {/* Pro Tier */}
          <motion.div whileHover={{ y: -10 }} className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap className="h-32 w-32 text-indigo-400" /></div>
            <div className="mb-8 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">Professional</span>
              <h3 className="text-3xl font-black text-white mt-4">$19 <span className="text-sm font-bold text-slate-500">/ Monthly</span></h3>
            </div>
            <ul className="space-y-4 mb-12 flex-1 relative z-10">
              {["Unlimited Scans", "AI 'Bridge the Gap' Access", "Advanced Executive Layouts", "Prioritized GPT-4o Processing", "Unlimited Vault Storage"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                  <Check className="h-4 w-4 text-indigo-400" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/login" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 relative z-10">Upgrade to Pro</Link>
          </motion.div>

          {/* Enterprise */}
          <motion.div whileHover={{ y: -10 }} className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Organization</span>
              <h3 className="text-3xl font-black text-slate-900 mt-4">Custom <span className="text-sm font-bold text-slate-400">/ Tailored</span></h3>
            </div>
            <ul className="space-y-4 mb-12 flex-1">
              {["Bulk Resume Processing", "Custom ATS Parsers", "API Access (Coming Soon)", "Dedicated Success Manager"].map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                  <Check className="h-4 w-4 text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <a href="mailto:sales@hireready.com" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center hover:bg-slate-800 transition-all shadow-lg">Contact Sales</a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
