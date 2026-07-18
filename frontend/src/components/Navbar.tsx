'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/workspace');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAuthPage || isDashboard) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0C0C0B]/92 backdrop-blur-md border-b border-[#2A2824]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between py-5">
            <Link href="/" className="flex items-center gap-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/svg/mark.svg" alt="" className="w-9 h-9 rounded-[10px]" />
              <span className="font-display text-xl text-[#F2EFE8] tracking-tight">
                HireReady
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/auth/login"
                className="font-body text-sm text-[#A39E93] hover:text-[#F2EFE8] transition-colors"
              >
                Log in
              </Link>
              <Link
                href="#analyzer"
                className="btn-signal px-5 py-2.5 rounded-md text-sm"
              >
                Analyze free
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-[#A39E93] hover:text-[#F2EFE8]"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileOpen && (
        <div className="fixed inset-0 z-[99] bg-[#0C0C0B] flex flex-col items-center justify-center gap-8 md:hidden">
          <button
            type="button"
            className="absolute top-6 right-6 p-2 text-[#A39E93]"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
          <Link
            href="/auth/login"
            onClick={() => setIsMobileOpen(false)}
            className="font-body text-lg text-[#A39E93]"
          >
            Log in
          </Link>
          <Link
            href="#analyzer"
            onClick={() => setIsMobileOpen(false)}
            className="btn-signal px-8 py-3.5 rounded-md text-sm"
          >
            Analyze free
          </Link>
        </div>
      )}
    </>
  );
}
