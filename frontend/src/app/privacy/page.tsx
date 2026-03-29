'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, ShieldAlert } from 'lucide-react';
import { Particles } from '@/components/ui/Particles';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <Particles className="absolute inset-0 opacity-20" />
      
      <main className="max-w-4xl mx-auto px-6 py-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
          <div className="text-center space-y-6">
            <div className="bg-indigo-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-900/40">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none">Privacy Protocol</h1>
            <p className="text-slate-500 font-black tracking-[0.4em] text-[10px] uppercase">Encrypted Executive Records</p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed">
            <section className="glass-executive p-10 rounded-[3rem] border-white/10">
              <h2 className="text-white flex items-center gap-3">
                <Lock className="h-5 w-5 text-indigo-500" /> Executive Commitment
              </h2>
              <p>HireReady is engineered with a "Privacy by Design" philosophy. We recognize that your resume contains your most sensitive professional data. Our protocols ensure that your data is used exclusively for semantic analysis and never sold to third-party aggregators.</p>
            </section>

            <section className="glass-executive p-10 rounded-[3rem] border-white/10 mt-8">
              <h2 className="text-white flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-indigo-500" /> Data Extraction
              </h2>
              <p>All source documents (PDF/DOCX) are parsed via encrypted streams. We utilize industry-standard TLS 1.3 encryption for data in transit and AES-256 for data at rest within our Executive Vault.</p>
            </section>

            <section className="glass-executive p-10 rounded-[3rem] border-white/10 mt-8">
              <h2 className="text-white flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-500" /> AI Processing
              </h2>
              <p>Your data is processed using Google Gemini's professional APIs. Under our current configuration, your inputs are not used to train global foundation models, ensuring your unique career narrative remains yours alone.</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
