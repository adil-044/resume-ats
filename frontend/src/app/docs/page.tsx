'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Book, Cpu, Search, FileText, Zap, ShieldCheck, Target, BrainCircuit, Activity } from 'lucide-react';

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

const sections = [
  {
    id: 'how-it-works',
    icon: <Cpu className="h-5 w-5" />,
    badge: 'Platform',
    title: 'How It Works',
    content: `Our process breaks your resume down to the semantic level to understand not just what you wrote, but what you mean.

**1. Data Ingestion:** We parse your PDF or DOCX using advanced structural parsing, avoiding common format corruption that triggers ATS errors.

**2. Semantic Diffing:** We compare your exact phrasing against the hard requirements of the targeted job description using Google Gemini models.

**3. Bridge The Gap Protocol:** We highlight missing skills and suggest organic ways to incorporate them into your listed experience — without fabricating.

**4. Clean Export:** Your final resume is exported as a pristine, single-column, ATS-friendly format.`,
  },
  {
    id: 'resume-tips',
    icon: <Search className="h-5 w-5" />,
    badge: 'Best Practices',
    title: 'Expert Resume Tips',
    content: `The difference between a rejection and an interview often comes down to format and keyword context.

**Quantify Everything:** "Increased sales by 30%" beats "Helped with sales." Always back up claims with concrete metrics.

**Drop the Fancy Graphics:** Headshots, complex tables, and multi-column layouts confuse ATS parsers. Keep it linear, clean, and machine-readable.

**Match the Vocabulary:** If a job asks for "Client Relationship Management," do not write "Talking to Customers." Echo the exact terminology from the job posting.

**One Page Isn't a Rule:** If you have 10+ years of experience, two pages is fine — as long as the format is clean.`,
  },
  {
    id: 'success-stories',
    icon: <Target className="h-5 w-5" />,
    badge: 'Case Studies',
    title: 'Success Stories',
    content: `HireReady has helped candidates land roles at top companies by fixing what the ATS was penalizing.

**Marcus C. (Google):** Transitioned from a regional firm to a FAANG company by unearthing and highlighting the specific distributed systems keywords his generic resume was missing.

**Priya N. (Stripe):** Bumped her resume score from 42% to 91% in a single session. Her customized bullet points addressed Stripe's product-led culture directly. Offer in three weeks.

**James O. (Shopify):** His resume was being silently rejected by Workday. HireReady flagged three formatting issues causing parse failures. First real interview came in 5 days.`,
  },
  {
    id: 'job-trends',
    icon: <Activity className="h-5 w-5" />,
    badge: 'Market Insights',
    title: '2026 Job Market Trends',
    content: `Understanding how hiring systems work is half the battle.

**Hyper-Automated First Rounds:** AI screeners reject up to 73% of resumes before human eyes see them. Keyword matching is still the primary filter mechanism.

**Niche Skill Prioritization:** Companies filter for specific tooling (React, Kubernetes, Python) rather than generic degrees. Mentioning exact software versions and packages is increasingly important.

**Format Consistency:** Single-column layouts consistently outperform two-column or creative layouts in ATS parsing. Simplicity is a competitive advantage.

**Cover Letters Still Matter:** For specialized roles, a targeted cover letter can push a borderline resume into the "review manually" pile.`,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#F2EFE8]">
      <Navbar />

      <main className="max-w-[900px] mx-auto px-6 py-32 relative z-10">
        <Reveal className="mb-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#C4A574]/10 border border-[#C4A574]/20 flex items-center justify-center text-[#C4A574]">
              <Book className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-[#F2EFE8] tracking-tight mb-6">
            Documentation
          </h1>
          <p className="text-[#A39E93] font-body text-base leading-relaxed max-w-xl">
            Technical guide for understanding how ATS works, how HireReady optimizes your resume, and how to use the platform effectively.
          </p>
        </Reveal>

        {/* TOC */}
        <Reveal className="mb-16">
          <div className="card p-6">
            <p className="text-[10px] font-display font-bold text-[#6B675F] uppercase tracking-widest mb-5">On this page</p>
            <div className="flex flex-wrap gap-3">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`}
                  className="px-4 py-2 rounded-xl bg-[#1E1C19] border border-[#2A2824] text-[#A39E93] text-xs font-display font-bold hover:border-[#C4A574]/30 hover:text-[#C4A574] transition-all">
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Sections */}
        <div className="space-y-16">
          {sections.map((section, i) => (
            <Reveal key={section.id} className="scroll-mt-32">
              <div id={section.id} className="card p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#C4A574]/10 border border-[#C4A574]/20 flex items-center justify-center text-[#C4A574]">
                    {section.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-display font-bold text-[#C4A574] uppercase tracking-widest mb-1">{section.badge}</p>
                    <h2 className="text-xl font-display font-bold text-[#F2EFE8]">{section.title}</h2>
                  </div>
                </div>
                <div className="space-y-4">
                  {section.content.split('\n\n').map((para, pi) => (
                    para.startsWith('**') ? (
                      <h3 key={pi} className="text-base font-display font-bold text-[#F2EFE8] mt-6 mb-2">{para}</h3>
                    ) : (
                      <p key={pi} className="text-sm text-[#A39E93] leading-relaxed font-body">{para}</p>
                    )
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="mt-20">
          <div className="card p-12 text-center">
            <h3 className="text-2xl font-display font-extrabold text-[#F2EFE8] mb-4">Ready to optimize?</h3>
            <p className="text-[#A39E93] font-body text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Upload your resume and see the ATS analysis in action. Takes 30 seconds.
            </p>
            <a href="/#analyzer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#C4A574] text-white rounded-xl font-display font-bold text-sm uppercase tracking-widest hover:bg-[#D4B88A] transition-all ">
              Try It Free
            </a>
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
