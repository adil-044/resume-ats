'use client';

import { FileText, Github, Linkedin, Twitter, Mail, Globe, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-24 pb-12 text-white overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Block */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-xl shadow-indigo-900/40">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-white">HIREREADY</span>
            </Link>
            <p className="text-slate-400 font-medium leading-relaxed max-w-xs">
              The world's most advanced AI-driven resume engine. Engineered for executives, built for machine readability.
            </p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-indigo-600 transition-all">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">System</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Semantic Engine</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Executive Vault</Link></li>
              <li><Link href="/docs" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">ATS Logic API</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Pricing Strategy</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-8">Intelligence</h4>
            <ul className="space-y-4">
              <li><Link href="/docs" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Documentation</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">ATS Whitepaper</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Success Stories</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-sm">Hiring Trends 2026</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-black mb-4 uppercase tracking-tight">Executive Newsletter</h4>
            <p className="text-xs text-slate-400 mb-6 font-medium">Get high-signal career insights delivered weekly.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="email@vault.com" 
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-12 outline-none focus:border-indigo-500 transition-all text-xs font-bold"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <span>© 2026 HireReady Systems</span>
            <span className="h-1 w-1 bg-slate-700 rounded-full" />
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="h-1 w-1 bg-slate-700 rounded-full" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">ISO 27001 Certified Data Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
