'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, MapPin, ArrowRight, 
  Github, Chrome, Loader2, ChevronRight, AlertCircle 
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 p-10 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
                {mode === 'login' ? 'System Access' : 'Initialize Vault'}
              </h1>
              <p className="text-slate-400 font-medium">
                {mode === 'login' ? 'Enter your executive credentials' : 'Build your high-signal identity'}
              </p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
          </div>

          <div className="p-10 space-y-8">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 text-red-600 text-sm font-bold"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
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
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Full Name"
                        required={mode === 'signup'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-900"
                      />
                    </div>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input 
                        type="text"
                        placeholder="Location (e.g. London, UK)"
                        required={mode === 'signup'}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-900"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="email"
                  placeholder="Professional Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-900"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="password"
                  placeholder="Security Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all font-medium text-slate-900"
                />
              </div>

              {mode === 'signup' && (
                <div className="flex items-center gap-3 px-2 py-2">
                  <input 
                    type="checkbox"
                    id="subscribe"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                  />
                  <label htmlFor="subscribe" className="text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer">
                    Subscribe to Executive Career Insights
                  </label>
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    {mode === 'login' ? 'Authorize Session' : 'Create Identity'}
                    <ChevronRight className="h-5 w-5 opacity-50" />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]"><span className="bg-white px-4">Social Gateway</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center gap-3 px-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest"
              >
                <Chrome className="h-4 w-4 text-red-500" /> Google
              </button>
              <button 
                onClick={() => handleOAuth('github')}
                className="flex items-center justify-center gap-3 px-4 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest"
              >
                <Github className="h-4 w-4 text-slate-900" /> GitHub
              </button>
            </div>

            <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              {mode === 'login' ? "Identity missing?" : "Known subject?"}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-indigo-600 hover:underline"
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
