'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, ShieldCheck, Mail } from 'lucide-react';

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

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B12] text-[#F1F0F5]">
      <Navbar />

      <main className="max-w-[800px] mx-auto px-6 py-32 relative z-10">
        <Reveal className="text-center mb-20">
          <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mx-auto mb-8">
            <Shield className="h-8 w-8 text-[#7C3AED]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold text-[#F1F0F5] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#9090A8] font-dm-sans text-sm">Last updated: 2026</p>
        </Reveal>

        <div className="space-y-8">
          {[
            {
              icon: <Lock className="h-5 w-5" />,
              title: 'Data Encryption',
              body: 'All resume files are encrypted in transit using TLS 1.3 and at rest using AES-256. Your data is processed exclusively for ATS analysis and is never shared with third parties.',
            },
            {
              icon: <FileText className="h-5 w-5" />,
              title: 'AI Processing',
              body: 'Your resumes are processed using Google Gemini APIs. Your inputs are never used to train global AI models. Your career narrative remains yours alone.',
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: 'No Data Selling',
              body: 'We do not sell, share, or license your personal data to recruiters, employers, or any third party. Ever. Your data funds our servers, not our revenue.',
            },
            {
              icon: <Mail className="h-5 w-5" />,
              title: 'Your Rights',
              body: 'You can request deletion of all your data at any time by contacting us. We will delete your account and all associated data within 30 days, no questions asked.',
            },
          ].map((section, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="card p-8">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED]">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-syne font-bold text-[#F1F0F5]">{section.title}</h2>
                </div>
                <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans">{section.body}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <div className="card p-8">
              <h2 className="text-lg font-syne font-bold text-[#F1F0F5] mb-5">Contact Us</h2>
              <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans">
                If you have any questions about this policy or want to request data deletion, contact us at{' '}
                <span className="text-[#7C3AED]">privacy@hireready.app</span>. We respond within 48 hours.
              </p>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
