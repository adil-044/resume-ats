'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <div className="text-center space-y-4">
            <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Privacy Protocol</h1>
            <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">Effective March 2026</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed">
            <section>
              <h2>Executive Commitment</h2>
              <p>HireReady is engineered with a "Privacy by Design" philosophy. We recognize that your resume contains your most sensitive professional data. Our protocols ensure that your data is used exclusively for semantic analysis and never sold to third-party aggregators.</p>
            </section>

            <section>
              <h2>Data Extraction & Encryption</h2>
              <p>All source documents (PDF/DOCX) are parsed via encrypted streams. We utilize industry-standard TLS 1.3 encryption for data in transit and AES-256 for data at rest within our Executive Vault (Supabase).</p>
            </section>

            <section>
              <h2>AI Processing</h2>
              <p>Your data is processed using Google Gemini's professional APIs. Under our current configuration, your inputs are not used to train global foundation models, ensuring your unique career narrative remains yours alone.</p>
            </section>

            <section>
              <h2>Your Rights</h2>
              <p>You maintain absolute ownership of your data. You may purge your entire Executive Vault history at any time through the Dashboard settings (Coming Soon).</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
