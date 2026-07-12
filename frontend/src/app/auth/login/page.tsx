'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, ArrowRight,
  Github, Chrome, Loader2, ChevronRight, AlertCircle, Fingerprint
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [subscribed, setSubscribed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.push('/dashboard');
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, location: location, subscribed: subscribed } }
        });
        if (error) throw error;
        alert('Verification email sent! Check your inbox.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '' }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full orb bg-[#7C3AED]/8 pointer-events-none" />
        <div className="absolute bottom-[15%] right-[-10%] w-[600px] h-[600px] rounded-full orb bg-[#22D3EE]/5 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px] relative z-10"
        >
          {/* Card */}
          <div className="card p-10 relative overflow-hidden">
            {/* Subtle large number watermark */}
            <span className="absolute top-6 right-8 text-8xl font-syne font-extrabold text-[#7C3AED]/5 select-none leading-none">
              {mode === 'login' ? '01' : '02'}
            </span>

            {/* Header */}
            <div className="text-center mb-10 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center mx-auto mb-6">
                <Fingerprint className="h-8 w-8 text-[#7C3AED]" />
              </div>
              <h1 className="text-4xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter mb-3">
                {mode === 'login' ? 'Welcome back.' : 'Get started.'}
              </h1>
              <p className="text-sm text-[#9090A8] font-dm-sans">
                {mode === 'login'
                  ? 'Sign in to access your dashboard'
                  : 'Create your free account — no credit card required'}
              </p>
            </div>

            <div className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4 flex gap-3 text-[#EF4444] text-sm font-dm-sans"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525E]" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-[#12121C] border border-[#1E1E30] rounded-xl py-3.5 pl-11 pr-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/50 transition-colors"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525E]" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#12121C] border border-[#1E1E30] rounded-xl py-3.5 pl-11 pr-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/50 transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525E]" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#12121C] border border-[#1E1E30] rounded-xl py-3.5 pl-11 pr-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/50 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#7C3AED] text-white rounded-xl font-syne font-bold text-sm uppercase tracking-widest hover:bg-[#9D6FFF] transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Sign In' : 'Create Account'}
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative py-3 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1E1E30]" />
                </div>
                <span className="relative bg-[#0B0B12] px-5 text-xs font-syne font-bold text-[#52525E] uppercase tracking-widest">
                  or continue with
                </span>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth('google')}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#12121C] border border-[#1E1E30] rounded-xl text-[#F1F0F5] font-dm-sans font-semibold text-sm hover:border-[#7C3AED]/30 transition-all"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button
                  onClick={() => handleOAuth('github')}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-[#12121C] border border-[#1E1E30] rounded-xl text-[#F1F0F5] font-dm-sans font-semibold text-sm hover:border-[#7C3AED]/30 transition-all"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </button>
              </div>

              {/* Toggle mode */}
              <p className="text-center text-sm text-[#9090A8] font-dm-sans pt-2">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="ml-2 text-[#7C3AED] font-semibold hover:underline underline-offset-2"
                >
                  {mode === 'login' ? 'Sign up free' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          {/* Trust line */}
          <p className="text-center text-xs text-[#52525E] font-dm-sans mt-6 flex items-center justify-center gap-2">
            <svg className="h-3.5 w-3.5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            Encrypted · No data selling · Free forever
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
