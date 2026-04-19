'use client';

import { FileText, Github, Linkedin, Twitter, Mail, Globe, ShieldCheck, ArrowRight, Zap, Target } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#E0E5EC] pt-32 pb-12 text-[#3D4852] overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full shadow-extruded" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full shadow-inset" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full shadow-extruded-sm" />
      </div>

      <div className="max-w-[1400px] mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Block */}
          <div className="space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="bg-[#E0E5EC] p-3 rounded-2xl shadow-extruded group-hover:shadow-inset transition-all duration-300">
                <FileText className="h-6 w-6 text-[#6C63FF]" />
              </div>
              <span className="text-2xl font-display font-extrabold tracking-tight uppercase text-[#3D4852]">HIREREADY</span>
            </Link>
            <p className="text-[#6B7280] font-medium leading-relaxed max-w-xs text-base font-body">
              The tactile, intelligent way to optimize your resume for any job. Get hired faster with Soft UI clarity.
            </p>
            <div className="flex gap-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-[#E0E5EC] rounded-xl shadow-extruded-sm hover:shadow-inset-sm transition-all duration-300 text-[#3D4852] hover:text-[#6C63FF]">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-[#6C63FF] mb-10">Quick Links</h4>
            <ul className="space-y-5">
              <li><Link href="/" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">Home</Link></li>
              <li><Link href="/dashboard" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">Dashboard</Link></li>
              <li><Link href="/docs#how-it-works" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">How It Works</Link></li>
              <li><Link href="/pricing" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-[#6C63FF] mb-10">Resources</h4>
            <ul className="space-y-5">
              <li><Link href="/docs" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">Documentation</Link></li>
              <li><Link href="/docs#resume-tips" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">Resume Tips</Link></li>
              <li><Link href="/docs#success-stories" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">Success Stories</Link></li>
              <li><Link href="/docs#job-trends" className="text-[#6B7280] hover:text-[#3D4852] transition-all font-bold text-sm uppercase tracking-widest font-display">2026 Job Trends</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-[#E0E5EC] p-8 rounded-[32px] shadow-extruded border border-white/20">
            <h4 className="text-sm font-display font-black mb-4 uppercase tracking-widest text-[#3D4852] flex items-center gap-3">
              <Zap className="h-4 w-4 text-[#6C63FF]" /> Stay Updated
            </h4>
            <p className="text-xs text-[#6B7280] mb-8 font-medium leading-relaxed font-body">Get weekly tips to improve your resume and land more interviews.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="your@email.com" 
                className="w-full bg-[#E0E5EC] shadow-inset rounded-2xl py-4 pl-5 pr-14 outline-none focus:shadow-inset-deep transition-all text-xs font-bold text-[#3D4852] placeholder-[#A0AEC0]"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#6C63FF] rounded-xl hover:bg-[#8B84FF] transition-all shadow-lg shadow-[#6C63FF]/30 active:scale-95">
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-[#A3B1C6]/30 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8 text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.2em]">
            <span>© 2026 HireReady</span>
            <span className="h-1 w-1 bg-[#A3B1C6] rounded-full" />
            <Link href="/privacy" className="hover:text-[#3D4852] transition-colors">Privacy</Link>
            <span className="h-1 w-1 bg-[#A3B1C6] rounded-full" />
            <Link href="/terms" className="hover:text-[#3D4852] transition-colors">Terms</Link>
          </div>
          <div className="flex items-center gap-4 px-6 py-3 bg-[#E0E5EC] rounded-2xl shadow-inset-sm">
            <ShieldCheck className="h-4 w-4 text-[#38B2AC]" />
            <span className="text-[10px] font-display font-black uppercase tracking-widest text-[#6B7280]">Your data is encrypted & secure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
