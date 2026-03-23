'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          <div className="text-center space-y-4">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight uppercase">Service Agreement</h1>
            <p className="text-slate-500 font-medium tracking-widest text-xs uppercase">March 2026 Edition</p>
          </div>

          <div className="prose prose-slate max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed">
            <section>
              <h2>Acceptance of Terms</h2>
              <p>By accessing the HireReady platform, you agree to be bound by these Terms of Service. Our engine provides semantic optimization tools for professional resumes. Use of this system constitutes acceptance of our executive standards.</p>
            </section>

            <section>
              <h2>Usage Integrity</h2>
              <p>You agree to provide accurate, truthful information from your professional history. HireReady is an optimization engine, not a fabrication tool. Misrepresenting your experience may lead to account suspension.</p>
            </section>

            <section>
              <h2>System Limitations</h2>
              <p>While our "ATS-Killer" logic is designed to achieve 90%+ match scores, we do not guarantee specific hiring outcomes. Final recruitment decisions are made by human hiring managers using tools beyond our control.</p>
            </section>

            <section>
              <h2>Account Security</h2>
              <p>You are responsible for maintaining the confidentiality of your Executive Vault credentials. Any data breaches resulting from compromised passwords are the responsibility of the user.</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
