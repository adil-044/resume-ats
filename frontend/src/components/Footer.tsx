'use client';

import { FileText, Github, Linkedin, Twitter, Mail, Globe, ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#020617] pt-32 pb-12 text-white overflow-hidden relative border-t border-white/5">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          {/* Brand Block */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="bg-white p-2.5 rounded-2xl group-hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <FileText className="h-6 w-6 text-black" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic text-white">HIREREADY</span>
            </Link>
            <p className="text-slate-500 font-medium leading-relaxed max-w-xs text-lg">
              The intelligence standard for executive resume optimization. Engineered for the 1% match.
            </p>
            <div className="flex gap-6">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white/5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-white/5">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-10">System Map</h4>
            <ul className="space-y-5">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Semantic Engine</Link></li>
              <li><Link href="/dashboard" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Executive Vault</Link></li>
              <li><Link href="/docs" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Protocol API</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Investment</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-10">Intelligence</h4>
            <ul className="space-y-5">
              <li><Link href="/docs" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Documentation</Link></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Logic Analysis</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">Success Log</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-all font-bold text-sm uppercase tracking-widest">2026 Trends</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="glass-executive p-10 rounded-[2.5rem] border border-white/5">
            <h4 className="text-sm font-black mb-4 uppercase tracking-widest italic text-white flex items-center gap-3">
              <Zap className="h-4 w-4 text-indigo-500" /> Executive Feed
            </h4>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">Secure weekly intelligence on high-stakes career strategy.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="identity@vault.com" 
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-14 outline-none focus:border-indigo-500 transition-all text-xs font-bold text-white shadow-inner"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40">
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            <span>© 2026 HireReady Protocol</span>
            <span className="h-1 w-1 bg-slate-800 rounded-full" />
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span className="h-1 w-1 bg-slate-800 rounded-full" />
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/5">
            <ShieldCheck className="h-4 w-4 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Military-Grade Data Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
