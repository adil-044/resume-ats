'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Book, Cpu, Search, FileText } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
          {/* Sticky Nav */}
          <aside className="lg:col-span-1 hidden lg:block sticky top-32 h-fit space-y-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">Core Concepts</h4>
              <ul className="space-y-2">
                {["Machine Readability", "Semantic Matching", "Executive Formatting"].map((item, i) => (
                  <li key={i}><a href="#" className="block px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all rounded-xl hover:bg-slate-50">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">The Workflow</h4>
              <ul className="space-y-2">
                {["Data Extraction", "Bridge the Gap", "Final PDF Export"].map((item, i) => (
                  <li key={i}><a href="#" className="block px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-all rounded-xl hover:bg-slate-50">{item}</a></li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
              <section>
                <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200">
                  <Book className="h-6 w-6" />
                </div>
                <h1 className="text-6xl font-black text-slate-900 tracking-tight uppercase mb-6">The HireReady Standard</h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  Learn how to leverage our semantic architecture to bypass legacy Applicant Tracking Systems and speak directly to hiring algorithms.
                </p>
              </section>

              <div className="prose prose-slate max-w-none prose-headings:uppercase prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed">
                <section>
                  <h2>1. Understanding Machine Readability</h2>
                  <p>Modern ATS systems do not "read" resumes like humans. They parse raw text and categorize it into entities. HireReady's engine is designed to maximize this entity-recognition rate by using single-column layouts and standard header semantics.</p>
                </section>

                <section>
                  <h2>2. The Bridge the Gap Protocol</h2>
                  <p>Our unique "Bridge the Gap" flow uses AI to identify the delta between your resume and the target JD. By answering targeted questions, you provide the engine with the specific "keystrings" it needs to generate a high-signal match score.</p>
                </section>

                <section>
                  <h2>3. Executive Formatting Standards</h2>
                  <p>We enforce a strict Markdown-to-PDF pipeline. This ensures that no hidden tables, images, or non-standard symbols interfere with the ATS parser. The result is a clean, professional, and 100% accessible document.</p>
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
