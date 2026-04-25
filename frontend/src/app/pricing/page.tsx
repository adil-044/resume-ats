'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, Variants } from 'framer-motion';
import { Check, Zap, Key, Sparkles, Crown, ShieldCheck, FileText, Briefcase, BarChart2, Mail, Clock, Download, Brain, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const starterFeatures = [
  { label: "AI Resume Optimization", icon: <Brain className="h-3.5 w-3.5" /> },
  { label: "AI Cover Letter Generator", icon: <Mail className="h-3.5 w-3.5" /> },
  { label: "Job Application Pipeline", icon: <Briefcase className="h-3.5 w-3.5" /> },
  { label: "Real-time ATS Scoring", icon: <BarChart2 className="h-3.5 w-3.5" /> },
  { label: "ATS Bypass Engine", icon: <Zap className="h-3.5 w-3.5" /> },
  { label: "Format-Perfect PDF Export", icon: <Download className="h-3.5 w-3.5" /> },
  { label: "History & Saved Files", icon: <Clock className="h-3.5 w-3.5" /> },
  { label: "Secure Data Encryption", icon: <Lock className="h-3.5 w-3.5" /> },
];

const proFeatures = [
  { label: "Everything in Starter", icon: <Check className="h-3.5 w-3.5" /> },
  { label: "Unlimited AI Generations", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { label: "Managed AI Infrastructure", icon: <Brain className="h-3.5 w-3.5" /> },
  { label: "No API Key Setup Required", icon: <Key className="h-3.5 w-3.5" /> },
  { label: "AI Cover Letter Generator", icon: <Mail className="h-3.5 w-3.5" /> },
  { label: "Job Application Pipeline", icon: <Briefcase className="h-3.5 w-3.5" /> },
  { label: "Format-Perfect PDF Export", icon: <Download className="h-3.5 w-3.5" /> },
  { label: "Priority Support", icon: <Crown className="h-3.5 w-3.5" /> },
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubscribe = async (planType: 'starter' | 'pro') => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(planType);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planType }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(null);
    }
  };
  return (
    <div className="min-h-screen bg-[#E0E5EC] font-body selection:bg-[#6C63FF]/20 selection:text-[#6C63FF]">
      <Navbar />
      
      <main className="max-w-[1200px] mx-auto px-6 lg:px-12 py-32 relative z-10">
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[-5%] w-64 h-64 rounded-full shadow-extruded opacity-50" />
          <div className="absolute bottom-[20%] right-[-10%] w-96 h-96 rounded-full shadow-inset opacity-40" />
          <div className="absolute top-[40%] right-[15%] w-24 h-24 rounded-full shadow-extruded-sm opacity-60" />
        </div>

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="text-center space-y-6 mb-24 relative z-10"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.3em] mb-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Simple Pricing</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter leading-[1.1]">
            Choose Your <br /><span className="text-[#6C63FF]">Career Engine.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-[#6B7280] font-medium max-w-2xl mx-auto leading-relaxed">
            Two plans. Full access to every feature. Pick the one that fits your workflow — bring your own keys, or let us handle everything.
          </motion.p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto relative z-10"
        >
          {/* Starter — $2/mo BYOK */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="bg-[#E0E5EC] p-12 rounded-[32px] shadow-extruded flex flex-col h-full transition-all duration-500 relative overflow-hidden group border border-white/20"
          >
            <div className="mb-10 mt-2">
              <div className="inline-block p-4 rounded-2xl shadow-inset-deep mb-6">
                <Key className="h-8 w-8 text-[#6C63FF]" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-[#6C63FF] block">Bring Your Own Keys</span>
              <h3 className="text-5xl font-display font-extrabold text-[#3D4852] mt-4">
                $2 <span className="text-sm font-bold text-[#6B7280]">/ month</span>
              </h3>
            </div>

            <p className="text-[#6B7280] mb-8 leading-relaxed font-body">
              Use your own Gemini API key and get full access to every feature at a fraction of the cost. Perfect for developers and power users.
            </p>

            <ul className="space-y-4 mb-12 flex-1">
              {starterFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-[#3D4852]">
                  <div className="h-7 w-7 rounded-full shadow-inset-sm flex items-center justify-center shrink-0 text-[#6C63FF]">
                    {f.icon}
                  </div>
                  {f.label}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe('starter')}
              disabled={loading !== null}
              className="w-full py-5 bg-[#E0E5EC] shadow-extruded hover:shadow-inset text-[#6C63FF] rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] text-center transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading === 'starter' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Start for $2/mo'}
            </button>
          </motion.div>

          {/* Pro — $7/mo Unlimited */}
          <motion.div
            variants={fadeUp}
            whileHover={{ y: -8 }}
            className="bg-[#E0E5EC] p-12 rounded-[32px] shadow-extruded flex flex-col h-full transition-all duration-500 relative overflow-hidden group border border-[#6C63FF]/20"
          >
            <div className="absolute top-0 right-0 bg-[#6C63FF] text-white text-[9px] font-display font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg">Most Popular</div>

            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Crown className="h-48 w-48 text-[#6C63FF]" />
            </div>

            <div className="mb-10 mt-2 relative z-10">
              <div className="inline-block p-4 rounded-2xl shadow-inset-deep mb-6">
                <Zap className="h-8 w-8 text-[#38B2AC]" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-[#38B2AC] block">Unlimited & Managed</span>
              <h3 className="text-5xl font-display font-extrabold text-[#3D4852] mt-4">
                $7 <span className="text-sm font-bold text-[#6B7280]">/ month</span>
              </h3>
            </div>

            <p className="text-[#6B7280] mb-8 leading-relaxed font-body relative z-10">
              Unlimited AI generations with zero setup. We handle the infrastructure — you focus on landing interviews. No API key needed.
            </p>

            <ul className="space-y-4 mb-12 flex-1 relative z-10">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-[#3D4852]">
                  <div className="h-7 w-7 rounded-full shadow-inset-sm flex items-center justify-center shrink-0 text-[#38B2AC]">
                    {f.icon}
                  </div>
                  {f.label}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleSubscribe('pro')}
              disabled={loading !== null}
              className="w-full py-5 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] text-center hover:bg-[#8B84FF] transition-all shadow-[8px_8px_16px_rgba(108,99,255,0.3),-8px_-8px_16px_rgba(255,255,255,0.3)] active:scale-95 flex items-center justify-center gap-2 relative z-10"
            >
              {loading === 'pro' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Go Unlimited — $7/mo'}
            </button>
          </motion.div>
        </motion.div>

        {/* Comparison strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="bg-[#E0E5EC] rounded-[32px] shadow-inset p-10">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest mb-3">Feature</p>
              </div>
              <div>
                <p className="text-[10px] font-display font-black text-[#6C63FF] uppercase tracking-widest mb-3">Starter $2</p>
              </div>
              <div>
                <p className="text-[10px] font-display font-black text-[#38B2AC] uppercase tracking-widest mb-3">Pro $7</p>
              </div>
              {[
                ["AI Generations", "Your API Key", "Unlimited"],
                ["Resume Optimizer", "✓", "✓"],
                ["Cover Letters", "✓", "✓"],
                ["Job Pipeline", "✓", "✓"],
                ["PDF Export", "✓", "✓"],
                ["API Key Required", "Yes", "No"],
                ["Priority Support", "—", "✓"],
              ].map(([feature, starter, pro], i) => (
                <div key={i} className="contents">
                  <div className={`py-3 text-sm font-bold text-[#3D4852] text-left ${i > 0 ? 'border-t border-[#A3B1C6]/20' : ''}`}>{feature}</div>
                  <div className={`py-3 text-sm font-medium text-[#6B7280] ${i > 0 ? 'border-t border-[#A3B1C6]/20' : ''}`}>{starter}</div>
                  <div className={`py-3 text-sm font-bold text-[#38B2AC] ${i > 0 ? 'border-t border-[#A3B1C6]/20' : ''}`}>{pro}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ mini */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 max-w-3xl mx-auto text-center"
        >
          <div className="bg-[#E0E5EC] rounded-[40px] shadow-extruded p-16 border border-white/20">
            <div className="p-5 rounded-2xl shadow-inset-deep inline-block mb-8">
              <ShieldCheck className="h-8 w-8 text-[#38B2AC]" />
            </div>
            <h2 className="text-2xl font-display font-black text-[#3D4852] uppercase tracking-tight mb-4">Cancel Anytime. No Contracts.</h2>
            <p className="text-[#6B7280] leading-relaxed font-body text-lg max-w-xl mx-auto mb-10">
              Both plans are month-to-month with no commitments. Your data stays encrypted and private. Switch plans or cancel whenever you want.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => handleSubscribe('pro')}
                disabled={loading !== null}
                className="px-10 py-5 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#8B84FF] transition-all shadow-[6px_6px_15px_rgba(108,99,255,0.3)] active:scale-95 flex items-center justify-center gap-3"
              >
                {loading === 'pro' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Get Started Now</>}
              </button>
              <Link href="/" className="px-10 py-5 bg-[#E0E5EC] text-[#3D4852] shadow-extruded hover:shadow-inset rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
