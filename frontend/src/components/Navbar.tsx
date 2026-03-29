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
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/workspace');

  return (
    <nav className="border-b border-white/5 bg-[#020617]/80 backdrop-blur-2xl sticky top-0 z-[100]">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-white p-3 rounded-2xl group-hover:scale-110 transition-all duration-700 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <FileText className="h-7 w-7 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-tighter leading-none italic uppercase">
                HIRE<span className="text-indigo-500">READY</span>
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="h-1 w-1 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Intelligence Systems</span>
              </div>
            </div>
          </Link>

          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-12">
              <div className="flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                <Link href="/" className={`hover:text-white transition-all duration-500 ${pathname === '/' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : ''}`}>Home</Link>
                <Link href="/pricing" className={`hover:text-white transition-all duration-500 ${pathname === '/pricing' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : ''}`}>Pricing</Link>
                <Link href="/docs" className={`hover:text-white transition-all duration-500 ${pathname === '/docs' ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : ''}`}>Docs</Link>
                {user && <Link href="/dashboard" className={`hover:text-white transition-all duration-500 ${isDashboard ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1' : ''}`}>Vault</Link>}
              </div>

              <div className="h-8 w-px bg-white/5" />

              {user ? (
                <Link href="/dashboard" className="flex items-center gap-4 group bg-white/5 px-5 py-2.5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all duration-500">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none mb-1">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-end gap-1.5">
                      <Fingerprint className="h-2.5 w-2.5" /> Identity Locked
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-[11px] font-black text-white shadow-xl shadow-indigo-900/40 border border-white/10">
                    {(user.user_metadata?.full_name?.[0] || user.email?.[0]).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-6">
                  <Link 
                    href="/auth/login" 
                    className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
                  >
                    Auth Access
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="bg-white text-black px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-3 text-white hover:bg-white/5 rounded-2xl transition-all border border-white/5">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-white/5 bg-[#020617] overflow-hidden"
          >
            <div className="p-8 space-y-6">
              <Link href="/" className="block text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Home</Link>
              <Link href="/pricing" className="block text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Pricing</Link>
              <Link href="/docs" className="block text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Documentation</Link>
              {user && <Link href="/dashboard" className="block text-[11px] font-black uppercase tracking-widest text-indigo-400">Executive Vault</Link>}
              {!user && <Link href="/auth/login" className="block text-[11px] font-black uppercase tracking-widest text-indigo-400">Initialize Identity</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
