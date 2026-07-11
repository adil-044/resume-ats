'use client';

import { FileText, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0B0B12]/90 backdrop-blur-xl border-b border-[#1E1E30] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all duration-300">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#22D3EE] animate-pulse" />
              </div>
              <span className="text-lg font-syne font-extrabold text-[#F1F0F5] tracking-tight">
                HIRE<span className="text-[#7C3AED]">READY</span>
              </span>
            </Link>

            {/* Desktop: only Login + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-sm font-dm-sans font-medium text-[#9090A8] hover:text-[#F1F0F5] transition-colors px-4 py-2"
              >
                Log In
              </Link>
              <Link
                href="#analyzer"
                className="px-5 py-2.5 bg-[#7C3AED] text-white text-sm font-dm-sans font-semibold rounded-xl hover:bg-[#9D6FFF] transition-all duration-200 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
              >
                Analyze Free
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#12121C] border border-[#1E1E30] text-[#9090A8] hover:text-[#F1F0F5] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-[#0B0B12]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden"
          >
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="text-[#9090A8] hover:text-[#F1F0F5] text-sm font-dm-sans font-medium transition-colors py-3"
            >
              Home
            </Link>
            <Link
              href="/auth/login"
              onClick={() => setIsMobileOpen(false)}
              className="text-[#9090A8] hover:text-[#F1F0F5] text-sm font-dm-sans font-medium transition-colors py-3"
            >
              Log In
            </Link>
            <Link
              href="#analyzer"
              onClick={() => setIsMobileOpen(false)}
              className="mt-2 px-8 py-4 bg-[#7C3AED] text-white text-sm font-dm-sans font-semibold rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            >
              Analyze Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
