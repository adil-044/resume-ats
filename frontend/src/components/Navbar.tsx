'use client';

import { FileText, Github, User, LogOut, LayoutDashboard, Menu, X, ShieldCheck, Zap, Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/workspace');

  return (
    <nav className={`bg-[#E0E5EC] sticky top-0 z-[100] transition-all duration-300 ${isScrolled ? 'shadow-extruded py-2' : 'py-4'}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-[#E0E5EC] p-3 rounded-2xl shadow-extruded-sm group-hover:shadow-inset-sm transition-all duration-300">
              <FileText className="h-6 w-6 text-[#6C63FF]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-extrabold text-[#3D4852] tracking-tight leading-none uppercase">
                HIRE<span className="text-[#6C63FF]">READY</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="h-1 w-1 bg-[#6C63FF] rounded-full animate-pulse" />
                <span className="text-[8px] font-display font-bold text-[#6B7280] uppercase tracking-[0.3em]">AI Resume Optimizer</span>
              </div>
            </div>
          </Link>

          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6 p-2 bg-[#E0E5EC] rounded-full shadow-inset-sm">
                <Link href="/" className={`px-5 py-2 rounded-full text-[11px] font-display font-bold uppercase tracking-widest transition-all duration-300 ${pathname === '/' ? 'bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF]' : 'text-[#6B7280] hover:text-[#3D4852]'}`}>Home</Link>
                {!isDashboard && (
                  <Link href="/pricing" className={`px-5 py-2 rounded-full text-[11px] font-display font-bold uppercase tracking-widest transition-all duration-300 ${pathname === '/pricing' ? 'bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF]' : 'text-[#6B7280] hover:text-[#3D4852]'}`}>Pricing</Link>
                )}
                <Link href="/docs" className={`px-5 py-2 rounded-full text-[11px] font-display font-bold uppercase tracking-widest transition-all duration-300 ${pathname === '/docs' ? 'bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF]' : 'text-[#6B7280] hover:text-[#3D4852]'}`}>How It Works</Link>
                {user && <Link href="/dashboard" className={`px-5 py-2 rounded-full text-[11px] font-display font-bold uppercase tracking-widest transition-all duration-300 ${isDashboard ? 'bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF]' : 'text-[#6B7280] hover:text-[#3D4852]'}`}>Dashboard</Link>}
              </div>

              <div className="h-6 w-px bg-slate-300/30" />

              {user ? (
                <Link href="/dashboard" className="flex items-center gap-3 group bg-[#E0E5EC] pl-4 pr-2 py-2 rounded-2xl shadow-extruded-sm hover:shadow-inset-sm transition-all duration-300">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-display font-extrabold text-[#3D4852] uppercase tracking-tighter leading-none mb-1">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[8px] font-bold text-[#6C63FF] uppercase tracking-widest flex items-center justify-end gap-1.5">
                      <Fingerprint className="h-2 w-2" /> Logged In
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-[#E0E5EC] shadow-inset-sm flex items-center justify-center text-[11px] font-display font-black text-[#6C63FF]">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0]).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/auth/login" 
                    className="text-[11px] font-display font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#3D4852] transition-all px-4"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="bg-[#6C63FF] text-white px-6 py-3 rounded-xl text-[11px] font-display font-bold uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[6px_6px_12px_rgba(108,99,255,0.3),-6px_-6px_12px_rgba(255,255,255,0.3)] active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-3 bg-[#E0E5EC] text-[#3D4852] rounded-xl shadow-extruded-sm active:shadow-inset-sm transition-all">
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#E0E5EC] overflow-hidden shadow-inset"
          >
            <div className="p-8 space-y-4">
              <Link href="/" className="block p-4 rounded-xl shadow-extruded-sm text-[11px] font-display font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#3D4852] transition-colors">Home</Link>
              {!isDashboard && <Link href="/pricing" className="block p-4 rounded-xl shadow-extruded-sm text-[11px] font-display font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#3D4852] transition-colors">Pricing</Link>}
              <Link href="/docs" className="block p-4 rounded-xl shadow-extruded-sm text-[11px] font-display font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#3D4852] transition-colors">How It Works</Link>
              {user && <Link href="/dashboard" className="block p-4 rounded-xl shadow-extruded-sm text-[11px] font-display font-bold uppercase tracking-widest text-[#6C63FF]">Dashboard</Link>}
              {!user && <Link href="/auth/login" className="block p-4 rounded-xl shadow-extruded-sm text-[11px] font-display font-bold uppercase tracking-widest text-[#6C63FF]">Log In</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
