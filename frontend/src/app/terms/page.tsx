'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Scale, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#F1F0F5]">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-6 py-32 relative z-10">
        <Reveal className="text-center mb-20">
          <div className="w-16 h-16 rounded-2xl bg-[#C4A574]/10 border border-[#C4A574]/20 flex items-center justify-center mx-auto mb-8">
            <Scale className="h-8 w-8 text-[#C4A574]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#F1F0F5] tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-[#9090A8] font-dm-sans text-sm">Effective 2026</p>
        </Reveal>

        <div className="space-y-8">
          {[
            {
              num: '01',
              title: 'Acceptance',
              body: 'By using HireReady, you agree to these terms. HireReady provides ATS optimization tools for professional resumes. Using our platform constitutes acceptance of these terms.',
            },
            {
              num: '02',
              title: 'Accuracy',
              body: 'You agree to provide accurate, truthful information from your professional history. HireReady is an optimization tool, not a fabrication tool. Misrepresenting your experience may result in account suspension.',
            },
            {
              num: '03',
              title: 'No Guarantees',
              body: 'While our ATS optimization engine is designed to achieve 90%+ match scores, we do not guarantee specific hiring outcomes. Recruitment decisions are made by human hiring managers using factors beyond our platform.',
            },
            {
              num: '04',
              title: 'Data & Privacy',
              body: 'We do not sell or share your personal data. Your resumes are encrypted and processed for ATS analysis only. You retain full ownership of all data you upload.',
            },
            {
              num: '05',
              title: 'Fair Use',
              body: 'HireReady is free for individual job seekers. Automated mass scraping, bulk resume generation for commercial purposes, or any use that degrades service quality for others is prohibited.',
            },
          ].map((section, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="card p-8">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-xs font-display font-bold text-[#C4A574] bg-[#C4A574]/10 px-3 py-1.5 rounded-lg">{section.num}</span>
                  <h2 className="text-lg font-display font-bold text-[#F1F0F5]">{section.title}</h2>
                </div>
                <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans">{section.body}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.35}>
            <div className="card p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-display font-bold text-[#F1F0F5]">Our Commitment</h2>
              </div>
              <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans">
                We're building HireReady to help real people navigate an unfair job market. We will always be transparent about what the tool can and cannot do — and we'll never hide behind jargon to oversell it.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
