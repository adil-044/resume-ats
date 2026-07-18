'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative bg-[#0C0C0B] border-t border-[#2A2824]">
      <div className="max-w-[1200px] mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-14">
          <div>
            <Link href="/" className="font-display text-2xl text-[#F2EFE8] tracking-tight">
              HireReady
            </Link>
            <p className="mt-4 font-body text-sm text-[#A39E93] leading-relaxed max-w-xs">
              ATS matching and rewrites for people who are done guessing why they got filtered.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-body text-xs uppercase tracking-[0.15em] text-[#6B675F] mb-5">
                Product
              </h4>
              <ul className="space-y-3 font-body text-sm text-[#A39E93]">
                <li>
                  <Link href="#analyzer" className="hover:text-[#F2EFE8] transition-colors">
                    Analyze
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:text-[#F2EFE8] transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-[#F2EFE8] transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-body text-xs uppercase tracking-[0.15em] text-[#6B675F] mb-5">
                Legal
              </h4>
              <ul className="space-y-3 font-body text-sm text-[#A39E93]">
                <li>
                  <Link href="/privacy" className="hover:text-[#F2EFE8] transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#F2EFE8] transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="surface-panel p-6">
            <p className="font-display text-lg text-[#F2EFE8] mb-2">Your data stays yours</p>
            <p className="font-body text-xs text-[#A39E93] leading-relaxed">
              Encrypted in transit and at rest. Never sold. Delete anytime.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2824] flex flex-col sm:flex-row justify-between gap-3">
          <p className="font-body text-xs text-[#6B675F]">
            © 2026 HireReady. Built for job seekers.
          </p>
          <p className="font-body text-xs text-[#6B675F]">Core features permanently free</p>
        </div>
      </div>
    </footer>
  );
}
