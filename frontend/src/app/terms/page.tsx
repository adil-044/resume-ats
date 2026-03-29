'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Particles } from '@/components/ui/Particles';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <Particles className="absolute inset-0 opacity-20" />
      
      <main className="max-w-4xl mx-auto px-6 py-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
          <div className="text-center space-y-6">
            <div className="bg-white/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-2xl">
              <Scale className="h-8 w-8 text-indigo-500" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Service Agreement</h1>
            <p className="text-slate-500 font-black tracking-[0.4em] text-[10px] uppercase">Legal Operational Standard</p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed">
            <section className="glass-executive p-10 rounded-[3rem] border-white/10">
              <h2 className="text-white flex items-center gap-3 italic">01. Acceptance</h2>
              <p>By accessing the HireReady platform, you agree to be bound by these Terms of Service. Our engine provides semantic optimization tools for professional resumes. Use of this system constitutes acceptance of our executive standards.</p>
            </section>

            <section className="glass-executive p-10 rounded-[3rem] border-white/10 mt-8 text-white">
              <h2 className="text-white flex items-center gap-3 italic">02. Usage Integrity</h2>
              <p>You agree to provide accurate, truthful information from your professional history. HireReady is an optimization engine, not a fabrication tool. Misrepresenting your experience may lead to account suspension.</p>
            </section>

            <section className="glass-executive p-10 rounded-[3rem] border-white/10 mt-8">
              <h2 className="text-white flex items-center gap-3 italic">03. System Scope</h2>
              <p>While our "ATS-Killer" logic is designed to achieve 90%+ match scores, we do not guarantee specific hiring outcomes. Final recruitment decisions are made by human hiring managers using tools beyond our control.</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
