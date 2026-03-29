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
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-4">Core Foundations</h4>
                <nav className="flex flex-col gap-1">
                  {["Machine Readability", "Semantic Matching", "Executive Formatting"].map((item, i) => (
                    <a key={i} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">{item}</a>
                  ))}
                </nav>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 px-4">The Protocol</h4>
                <nav className="flex flex-col gap-1">
                  {["Data Extraction", "Bridge the Gap", "Final PDF Export"].map((item, i) => (
                    <a key={i} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block px-4 py-2.5 text-sm font-bold text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl transition-all">{item}</a>
                  ))}
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
                
                <section id="machine-readability" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Cpu className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Module 01</span>
                  </div>
                  <h2 className="text-white">The Machine Readability Standard</h2>
                  <p>Applicant Tracking Systems (ATS) do not read resumes like humans. They use Optical Character Recognition (OCR) and Natural Language Processing (NLP) to parse text into structured entities. HireReady's "Single-Pass" format ensures 100% entity-recognition by:</p>
                  <ul className="space-y-2">
                    <li><strong className="text-indigo-400">Eliminating OCR Errors:</strong> No tables, text boxes, or images that confuse parsers.</li>
                    <li><strong className="text-indigo-400">Standard Header Semantics:</strong> Using universal section titles (EXPERIENCE, EDUCATION).</li>
                    <li><strong className="text-indigo-400">Single-Column Logic:</strong> Preventing "read-order" errors common in two-column layouts.</li>
                  </ul>
                </section>

                <section id="semantic-matching" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Target className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Module 02</span>
                  </div>
                  <h2 className="text-white">Optimizing for Semantic Parsers</h2>
                  <p>Modern engines like Workday and Greenhouse use semantic matching—meaning they look for the *intent* behind your words, not just exact keywords. HireReady's AI re-engineers your experience to use high-signal terminology specific to your target JD.</p>
                  <p>Our scoring algorithm weights three distinct layers:</p>
                  <ul className="space-y-2">
                    <li><strong className="text-indigo-400">Hard Keyword Salience (50%):</strong> Verification of critical technical skills.</li>
                    <li><strong className="text-indigo-400">Semantic Alignment (30%):</strong> Role and responsibility matching.</li>
                    <li><strong className="text-indigo-400">Structural Integrity (20%):</strong> Technical "cleanliness" of formatting.</li>
                  </ul>
                </section>

                <section id="bridge-the-gap" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><BrainCircuit className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Module 03</span>
                  </div>
                  <h2 className="text-white">The Bridge the Gap Protocol</h2>
                  <p>When the engine identifies a "Signal Gap" (a skill mentioned in the JD but missing from your resume), it generates a series of targeted interview questions.</p>
                  <p>Your responses are processed through our <strong>Gemini 2.0 Flash</strong> pipeline to woven those details naturally into your professional experience, ensuring you hit the 95% match threshold.</p>
                </section>

                <section id="protocol-api" className="scroll-mt-32 glass-executive p-10 rounded-[3rem] border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-900/20"><Terminal className="h-4 w-4" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Module 04</span>
                  </div>
                  <h2 className="text-white">Protocol API Integration</h2>
                  <p>Our underlying semantic engine is accessible via REST API for enterprise partners. This allows for bulk resume processing and automated portfolio analysis within existing HR tech stacks.</p>
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
