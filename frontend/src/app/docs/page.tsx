'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Book, Cpu, Search, FileText, Zap, ShieldCheck, Target, BrainCircuit, Terminal, Activity } from 'lucide-react';
import { Particles } from '@/components/ui/Particles';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <Particles className="absolute inset-0 opacity-20" />
      
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Executive Table of Contents */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-32 h-fit">
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-4">Platform</h4>
                <nav className="flex flex-col gap-1">
                  <a href="#how-it-works" className="block px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">How It Works</a>
                  <a href="#resume-tips" className="block px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">Resume Tips</a>
                  <a href="#success-stories" className="block px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">Success Stories</a>
                  <a href="#job-trends" className="block px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">2026 Job Trends</a>
                </nav>
              </div>
            </div>
          </aside>

          {/* Intelligence Content */}
          <div className="lg:col-span-9 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-24">
              <section id="introduction">
                <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-10 shadow-xl shadow-indigo-900/20">
                  <Book className="h-7 w-7" />
                </div>
                <h1 className="text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-8">The <span className="text-indigo-600 italic">HireReady</span> Standard.</h1>
                <p className="text-2xl text-slate-400 font-medium leading-relaxed">
                  Technical guide for the world's most advanced resume architecture. Engineered to speak the language of modern hiring algorithms.
                </p>
              </section>

              <div className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed prose-li:text-slate-400 prose-li:font-medium">
                
                <section id="how-it-works" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Cpu className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">How It Works</span>
                  </div>
                  <h2 className="text-white">The Analysis Pipeline</h2>
                  <p>Our process breaks your resume down to the semantic level to understand not just what you wrote, but what you mean. Here is our executive standard flow:</p>
                  <ul className="space-y-2 mt-4">
                    <li><strong className="text-indigo-400">1. Data Ingestion:</strong> We map your PDF or DOCX file using advanced OCR and structural parsing, avoiding common format corruption.</li>
                    <li><strong className="text-indigo-400">2. Semantic Diffing:</strong> We compare your exact phrasing against the hard requirements of the targeted job description using Google Gemini models.</li>
                    <li><strong className="text-indigo-400">3. The Bridge The Gap Protocol:</strong> We highlight the "Signal Gaps" (missing skills) and suggest organic ways to weave them into your listed experience.</li>
                    <li><strong className="text-indigo-400">4. Clean Export:</strong> Your final resume is exported into a pristine, single-column ATS-friendly format.</li>
                  </ul>
                </section>

                <section id="resume-tips" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10 mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Search className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Best Practices</span>
                  </div>
                  <h2 className="text-white">Expert Resume Tips</h2>
                  <p>The difference between a rejection and an interview often comes down to format and keyword context. Use these tried-and-tested strategies to optimize your success rate.</p>
                  <ul className="space-y-2 mt-4">
                    <li><strong className="text-indigo-400">Quantify Everything:</strong> "Increased sales by 30%" beats "Helped with sales". Always back up claims with metrics.</li>
                    <li><strong className="text-indigo-400">Toss the Fancy Graphics:</strong> Headshots, complex tables, and column layouts confuse Applicant Tracking Systems. Keep it linear and simple.</li>
                    <li><strong className="text-indigo-400">Match the Vocabulary:</strong> If a job asks for "Client Relationship Management," do not write "Talking to Customers." Echo their terminology precisely.</li>
                  </ul>
                </section>

                <section id="success-stories" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10 mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Target className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Case Studies</span>
                  </div>
                  <h2 className="text-white">Success Stories</h2>
                  <p>HireReady has enabled thousands of candidates to land top-tier jobs across the tech, finance, and marketing sectors.</p>
                  <p className="mt-4"><strong>Marcus J. (Google)</strong> — Transitioned from a regional firm to a FAANG company simply by unearthing and highlighting the specific distributed systems keywords that his generic resume lacked.</p>
                  <p className="mt-4"><strong>Priya S. (Stripe)</strong> — Bumped her resume score from 42% to 91% in a single day. Her customized bullet points perfectly addressed Stripe's unique product-led culture, leading to an offer in three weeks.</p>
                </section>

                <section id="job-trends" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10 mt-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Activity className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Market Insights</span>
                  </div>
                  <h2 className="text-white">2026 Job Trends</h2>
                  <p>The job market continues to shift towards hyper-automated screening. Understanding these macro trends is vital for your job hunt.</p>
                  <ul className="space-y-2 mt-4">
                    <li><strong className="text-indigo-400">Hyper-Automated First Rounds:</strong> AI and automated screeners reject up to 75% of resumes before human eyes ever see them.</li>
                    <li><strong className="text-indigo-400">Niche Skill Prioritization:</strong> Companies are increasingly filtering for specific, modern tooling rather than generic degrees. Mentioning exact software suites is critical.</li>
                    <li><strong className="text-indigo-400">Return to Office Signals:</strong> Geographic matching has become stricter in enterprise ATS filters. Ensure your location signals align with remote or hybrid expectations.</li>
                  </ul>
                </section>

              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
