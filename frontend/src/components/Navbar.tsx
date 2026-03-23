'use client';

import { FileText, Github, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
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
    <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-[100]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-900 p-2.5 rounded-2xl group-hover:scale-110 transition-all duration-500 shadow-xl shadow-slate-200">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">
                HIRE<span className="text-indigo-600">READY</span>
              </span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Executive Systems</span>
            </div>
          </Link>

          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-10">
              <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Link href="/" className={`hover:text-slate-900 transition-colors ${pathname === '/' ? 'text-indigo-600' : ''}`}>Home</Link>
                <a href="#features" className="hover:text-slate-900 transition-colors">Intelligence</a>
                <a href="#logic" className="hover:text-slate-900 transition-colors">The Logic</a>
                {user && <Link href="/dashboard" className={`hover:text-slate-900 transition-colors ${isDashboard ? 'text-indigo-600' : ''}`}>Vault</Link>}
              </div>

              <div className="h-6 w-px bg-slate-200" />

              {user ? (
                <Link href="/dashboard" className="flex items-center gap-3 group">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest flex items-center justify-end gap-1">
                      <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" /> Live
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
                    <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-200">
                      {(user.user_metadata?.full_name?.[0] || user.email?.[0]).toUpperCase()}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/auth/login" 
                    className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 px-4 py-2 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="bg-slate-900 text-white px-7 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 active:scale-95"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <Link href="/" className="block text-[11px] font-black uppercase tracking-widest text-slate-600">Home</Link>
              <a href="#features" className="block text-[11px] font-black uppercase tracking-widest text-slate-600">Intelligence</a>
              {user && <Link href="/dashboard" className="block text-[11px] font-black uppercase tracking-widest text-slate-600">Vault</Link>}
              {!user && <Link href="/auth/login" className="block text-[11px] font-black uppercase tracking-widest text-indigo-600">Get Started</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
