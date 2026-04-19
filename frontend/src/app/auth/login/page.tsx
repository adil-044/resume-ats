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
        alert('Verification email sent!');
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
    <div className="min-h-screen bg-[#E0E5EC] flex flex-col font-body selection:bg-[#6C63FF]/20 text-[#3D4852]">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-[10%] left-[-5%] w-96 h-96 rounded-full shadow-extruded opacity-40 pointer-events-none" />
        <div className="absolute bottom-[15%] right-[-5%] w-[500px] h-[500px] rounded-full shadow-inset opacity-30 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[500px] bg-[#E0E5EC] rounded-[48px] shadow-extruded p-12 relative z-10 border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="p-6 rounded-[2rem] shadow-inset-deep inline-block mb-8 text-[#6C63FF]">
              <Fingerprint className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase italic leading-none mb-4">
              {mode === 'login' ? 'Auth Portal.' : 'Initialize.'}
            </h1>
            <p className="text-[#6B7280] font-display font-bold text-[10px] uppercase tracking-[0.4em]">
              {mode === 'login' ? 'Authorize Secure Session' : 'Sync Identity Vector'}
            </p>
          </div>

          <div className="space-y-8">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#E0E5EC] shadow-inset p-5 rounded-2xl flex gap-4 text-red-500 text-xs font-display font-bold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-6">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                    <div className="relative group p-1 bg-[#E0E5EC] rounded-2xl shadow-inset">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3B1C6]" />
                      <input type="text" placeholder="Full Name" required={mode === 'signup'} value={fullName} onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-transparent py-4 pl-12 pr-5 outline-none text-[#3D4852] font-medium font-body placeholder-[#A3B1C6]" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group p-1 bg-[#E0E5EC] rounded-2xl shadow-inset">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3B1C6]" />
                <input type="email" placeholder="Professional Email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent py-4 pl-12 pr-5 outline-none text-[#3D4852] font-medium font-body placeholder-[#A3B1C6]" />
              </div>

              <div className="relative group p-1 bg-[#E0E5EC] rounded-2xl shadow-inset">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#A3B1C6]" />
                <input type="password" placeholder="Security Token" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-4 pl-12 pr-5 outline-none text-[#3D4852] font-medium font-body placeholder-[#A3B1C6]" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#6C63FF] text-white py-5 rounded-2xl font-display font-black text-xs uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>{mode === 'login' ? 'Authorize' : 'Initialize'} <ChevronRight className="h-5 w-5 opacity-40" /></>
                )}
              </button>
            </form>

            <div className="relative py-4 flex items-center justify-center">
              <div className="absolute w-full h-px bg-[#A3B1C6]/30" />
              <span className="relative bg-[#E0E5EC] px-6 text-[9px] font-display font-black text-[#6B7280] uppercase tracking-widest">Social Sync</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-4 px-6 py-4 bg-[#E0E5EC] shadow-extruded-sm hover:shadow-inset-sm rounded-2xl font-display font-black text-[10px] text-[#3D4852] transition-all uppercase tracking-widest">
                <Chrome className="h-4 w-4" /> Google
              </button>
              <button onClick={() => handleOAuth('github')} className="flex items-center justify-center gap-4 px-6 py-4 bg-[#E0E5EC] shadow-extruded-sm hover:shadow-inset-sm rounded-2xl font-display font-black text-[10px] text-[#3D4852] transition-all uppercase tracking-widest">
                <Github className="h-4 w-4" /> GitHub
              </button>
            </div>

            <p className="text-center text-[10px] font-display font-black uppercase tracking-widest text-[#6B7280] mt-8">
              {mode === 'login' ? "Identity missing?" : "Known subject?"}
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="ml-3 text-[#6C63FF] hover:underline underline-offset-4">
                {mode === 'login' ? 'Sync Here' : 'Log In'}
              </button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
