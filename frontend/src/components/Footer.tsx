'use client';

import { FileText, Github, Linkedin, Twitter, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#0B0B12] border-t border-[#1E1E30] overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-syne font-extrabold text-[#F1F0F5]">
                HIRE<span className="text-[#7C3AED]">READY</span>
              </span>
            </Link>
            <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans max-w-xs">
              The ATS-optimization tool built for the modern job market. Every feature, completely free.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Github, href: '#' },
                { Icon: Linkedin, href: '#' },
                { Icon: Twitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl bg-[#12121C] border border-[#1E1E30] flex items-center justify-center text-[#9090A8] hover:text-[#7C3AED] hover:border-[#7C3AED]/30 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-syne font-bold uppercase tracking-widest text-[#52525E] mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#analyzer" className="text-sm text-[#9090A8] hover:text-[#F1F0F5] transition-colors font-dm-sans">Analyze Resume</Link></li>
                <li><Link href="#features" className="text-sm text-[#9090A8] hover:text-[#F1F0F5] transition-colors font-dm-sans">Features</Link></li>
                <li><Link href="#testimonials" className="text-sm text-[#9090A8] hover:text-[#F1F0F5] transition-colors font-dm-sans">Success Stories</Link></li>
                <li><Link href="/auth/login" className="text-sm text-[#9090A8] hover:text-[#F1F0F5] transition-colors font-dm-sans">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-syne font-bold uppercase tracking-widest text-[#52525E] mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="/privacy" className="text-sm text-[#9090A8] hover:text-[#F1F0F5] transition-colors font-dm-sans">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-[#9090A8] hover:text-[#F1F0F5] transition-colors font-dm-sans">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Trust signal */}
          <div className="card p-8 flex flex-col gap-6 self-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-sm font-syne font-bold text-[#F1F0F5]">Your data stays yours</p>
                <p className="text-xs text-[#9090A8] font-dm-sans">Bank-level encryption. Always.</p>
              </div>
            </div>
            <p className="text-xs text-[#9090A8] leading-relaxed font-dm-sans">
              We never sell, share, or leak your resume data. You own it, you can delete it anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#1E1E30] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#52525E] font-dm-sans">
            © 2026 HireReady. Built for job seekers, not corporations.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#52525E] font-dm-sans">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
