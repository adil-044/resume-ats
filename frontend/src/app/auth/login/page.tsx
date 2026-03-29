'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, MapPin, ArrowRight, 
  Github, Chrome, Loader2, ChevronRight, AlertCircle, ShieldCheck, Fingerprint
} from 'lucide-react';
import { Particles } from '@/components/ui/Particles';

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
      if (session) {
        router.push('/dashboard');
      }
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
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              location: location,
              subscribed: subscribed,
            }
          }
        });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '',
      }
    });
    if (error) alert(error.message);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-5" />
      <Navbar />
      <Particles className="absolute inset-0 opacity-20" />
      
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[520px] glass-executive rounded-[4rem] border-white/10 overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)] border-beam"
        >
          {/* Header */}
          <div className="p-12 text-center relative border-b border-white/5">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-900/40">
              <Fingerprint className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">
              {mode === 'login' ? 'System Access' : 'Initialize Vault'}
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">
              {mode === 'login' ? 'Authorize Executive Session' : 'Create High-Signal Identity'}
            </p>
          </div>

          <div className="p-12 space-y-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex gap-4 text-red-400 text-sm font-bold shadow-inner"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Full Name"
                        required={mode === 'signup'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black/40 border-2 border-white/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-white shadow-inner"
                      />
                    </div>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Location"
                        required={mode === 'signup'}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-black/40 border-2 border-white/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-white shadow-inner"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email"
                  placeholder="Professional Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-white shadow-inner"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="password"
                  placeholder="Security Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-3xl py-5 pl-14 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-white shadow-inner"
                />
              </div>

              {mode === 'signup' && (
                <div className="flex items-center gap-4 px-2 py-2">
                  <input 
                    type="checkbox"
                    id="subscribe"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="h-5 w-5 rounded-lg border-white/10 bg-black/40 text-indigo-600 focus:ring-indigo-600 cursor-pointer transition-all"
                  />
                  <label htmlFor="subscribe" className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer hover:text-indigo-400 transition-colors">
                    Subscribe to Executive Insights
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 group"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    {mode === 'login' ? 'Authorize Session' : 'Create Identity'}
                    <ChevronRight className="h-5 w-5 opacity-30 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-600 tracking-[0.5em]"><span className="bg-[#020617] px-6">Quantum Gateway</span></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center gap-4 px-6 py-5 bg-white/5 border border-white/5 rounded-3xl font-black text-[10px] text-white hover:bg-white hover:text-black transition-all shadow-sm uppercase tracking-widest"
              >
                <Chrome className="h-4 w-4 text-red-500" /> Google
              </button>
              <button 
                onClick={() => handleOAuth('github')}
                className="flex items-center justify-center gap-4 px-6 py-5 bg-white/5 border border-white/5 rounded-3xl font-black text-[10px] text-white hover:bg-white hover:text-black transition-all shadow-sm uppercase tracking-widest"
              >
                <Github className="h-4 w-4 text-indigo-400" /> GitHub
              </button>
            </div>

            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
              {mode === 'login' ? "Identity missing?" : "Known subject?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-3 text-indigo-500 hover:text-white transition-colors underline underline-offset-8 decoration-indigo-500/30"
              >
                {mode === 'login' ? 'Initialize Here' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
