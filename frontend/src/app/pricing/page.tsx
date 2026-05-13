'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, Variants } from 'framer-motion';
import {
  Heart, Sparkles, Zap, Brain, Mail, Briefcase, BarChart2,
  Download, Clock, Lock, Check, ShieldCheck, Users, TrendingDown,
  Globe, Rocket, Target, FileText, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } }
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

const allFeatures = [
  { label: 'AI Resume Optimization', icon: <Brain className="h-4 w-4" />, color: '#6C63FF' },
  { label: 'AI Cover Letter Generator', icon: <Mail className="h-4 w-4" />, color: '#fb7185' },
  { label: 'Job Application Pipeline', icon: <Briefcase className="h-4 w-4" />, color: '#4f46e5' },
  { label: 'Real-time ATS Scoring', icon: <BarChart2 className="h-4 w-4" />, color: '#38B2AC' },
  { label: 'ATS Bypass Engine', icon: <Zap className="h-4 w-4" />, color: '#fbbf24' },
  { label: 'Format-Perfect PDF Export', icon: <Download className="h-4 w-4" />, color: '#6C63FF' },
  { label: 'History & Saved Files', icon: <Clock className="h-4 w-4" />, color: '#38B2AC' },
  { label: 'Secure Data Encryption', icon: <Lock className="h-4 w-4" />, color: '#4ade80' },
  { label: 'Bridge The Gap AI Tool', icon: <Target className="h-4 w-4" />, color: '#6C63FF' },
  { label: 'Unlimited Optimizations', icon: <Sparkles className="h-4 w-4" />, color: '#fb7185' },
];

const stats = [
  { value: '1 in 4', label: 'Workers face layoffs', icon: <TrendingDown className="h-6 w-6" /> },
  { value: '75%', label: 'Resumes filtered by ATS', icon: <FileText className="h-6 w-6" /> },
  { value: '250+', label: 'Applicants per job post', icon: <Users className="h-6 w-6" /> },
  { value: '100%', label: 'Free — forever', icon: <Heart className="h-6 w-6" /> },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#E0E5EC] font-body selection:bg-[#6C63FF]/20 selection:text-[#6C63FF] overflow-x-hidden">
      <Navbar />

      <main className="relative">
        {/* ── HERO ── */}
        <section className="relative py-32 px-6 text-center overflow-hidden">
          {/* Ambient orbs */}
          <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full shadow-extruded opacity-30 pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full shadow-inset opacity-20 pointer-events-none" />

          <motion.div
            initial="hidden" animate="show"
            variants={stagger}
            className="max-w-5xl mx-auto relative z-10"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C63FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C63FF]" />
              </span>
              Mission: Free for Everyone
            </motion.div>

            {/* Giant Free Forever pill */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-4 px-10 py-5 rounded-[2rem] shadow-inset bg-[#E0E5EC] mb-10 mx-auto"
            >
              <Heart className="h-8 w-8 text-[#fb7185] fill-[#fb7185]" />
              <span className="text-4xl md:text-5xl font-display font-black text-[#3D4852] tracking-tighter uppercase">
                FREE. Forever.
              </span>
              <Heart className="h-8 w-8 text-[#fb7185] fill-[#fb7185]" />
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter leading-[0.85] uppercase italic mb-8">
              No Plans. No Paywalls.<br />
              <span className="text-[#6C63FF] not-italic">No Credit Card.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed mb-12 font-body">
              Every feature. Every tool. Completely free — not a trial, not a freemium trick.
              This is our commitment to every job seeker.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/login" className="px-12 py-6 bg-[#6C63FF] text-white rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[8px_8px_20px_rgba(108,99,255,0.3)] active:scale-95 flex items-center gap-3 justify-center">
                <Rocket className="h-5 w-5" />
                Start Optimizing — Free
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── WHY FREE ── */}
        <section className="py-32 px-6 lg:px-12 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#fb7185] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <Heart className="h-4 w-4" />
                Our Reason
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                The Job Market<br /><span className="text-[#6C63FF] not-italic">Is Brutal Right Now.</span>
              </motion.h2>
            </motion.div>

            {/* Stat strip */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-[#E0E5EC] rounded-[28px] p-8 shadow-extruded text-center flex flex-col items-center gap-4"
                >
                  <div className="p-4 rounded-2xl shadow-inset-sm text-[#6C63FF]">{s.icon}</div>
                  <p className="text-3xl font-display font-extrabold text-[#3D4852]">{s.value}</p>
                  <p className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Long-form why */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#E0E5EC] rounded-[40px] p-12 md:p-16 shadow-inset border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-8 right-8 opacity-5">
                <Globe className="h-64 w-64 text-[#6C63FF]" />
              </div>

              <div className="flex items-start gap-6 mb-10">
                <div className="p-5 rounded-2xl shadow-extruded-sm flex-shrink-0">
                  <Heart className="h-8 w-8 text-[#fb7185] fill-[#fb7185]" />
                </div>
                <div>
                  <h3 className="text-3xl font-display font-extrabold text-[#3D4852] tracking-tight uppercase mb-3">
                    We See You. We Built This for You.
                  </h3>
                  <div className="space-y-5 text-[#6B7280] leading-relaxed font-body text-lg">
                    <p>
                      The job market right now is one of the hardest in a generation. Layoffs are sweeping every industry — tech, finance, healthcare, marketing. Companies that were hiring aggressively two years ago are now posting hiring freezes. Good people are sending hundreds of applications and hearing nothing back.
                    </p>
                    <p>
                      It's not because they aren't qualified. It's because <strong className="text-[#3D4852]">75% of resumes never reach a human</strong> — they're filtered out by Applicant Tracking Systems (ATS) before a recruiter even sees them. Your resume gets rejected by a robot for missing three keywords. That's the reality.
                    </p>
                    <p>
                      We built HireReady to fix exactly this problem. And then we asked ourselves: <em className="text-[#3D4852] font-semibold">should we charge people who are already struggling to find a job?</em>
                    </p>
                    <p className="text-xl text-[#3D4852] font-display font-bold">
                      The answer was simple: No.
                    </p>
                    <p>
                      Until the job market stabilizes and people have real opportunities again, <strong className="text-[#3D4852]">HireReady is completely free</strong>. Every feature. Every AI optimization. Every cover letter. Every tool we build. Zero paywalls. Zero subscriptions. Zero credit cards.
                    </p>
                    <p>
                      Our mission is straightforward: <strong className="text-[#6C63FF]">help every single person achieve a 100% ATS match score</strong> so they have the best possible chance at getting the job they deserve.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#A3B1C6]/20">
                <p className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest text-center">
                  — The HireReady Team &nbsp;·&nbsp; Because your career shouldn't cost you money when you don't have any.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── EVERYTHING FREE ── */}
        <section className="py-32 px-6 lg:px-12 relative">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#38B2AC] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <Sparkles className="h-4 w-4" />
                What's Included
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                Everything.<br /><span className="text-[#6C63FF] not-italic">Yours. Free.</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-16"
            >
              {allFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-[#E0E5EC] rounded-[24px] p-7 shadow-extruded flex flex-col gap-4 border border-white/20 group"
                >
                  <div className="p-3 rounded-xl shadow-inset-sm w-fit" style={{ color: f.color }}>
                    {f.icon}
                  </div>
                  <p className="text-sm font-display font-black text-[#3D4852] leading-tight">{f.label}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="h-5 w-5 rounded-full bg-[#4ade80]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-[#4ade80]" />
                    </div>
                    <span className="text-[9px] font-display font-black uppercase tracking-widest text-[#4ade80]">Free Forever</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Single "Free" CTA card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto bg-[#E0E5EC] rounded-[40px] shadow-extruded p-14 text-center border border-[#6C63FF]/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12">
                <Heart className="h-48 w-48 text-[#fb7185]" />
              </div>

              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-inset mb-8">
                <ShieldCheck className="h-5 w-5 text-[#38B2AC]" />
                <span className="text-[10px] font-display font-black uppercase tracking-widest text-[#38B2AC]">No payment info required · Ever</span>
              </div>

              <div className="text-7xl font-display font-black text-[#6C63FF] mb-2">$0</div>
              <div className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest mb-8">/ month · forever</div>

              <p className="text-[#6B7280] mb-10 leading-relaxed font-body text-lg">
                Sign up with your email. Get instant access to every feature. No credit card, no trial, no expiry.
              </p>

              <Link
                href="/auth/login"
                className="block w-full py-6 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[6px_6px_15px_rgba(108,99,255,0.3)] active:scale-95"
              >
                Get Full Access — Free
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── FINAL MESSAGE ── */}
        <section className="py-32 px-6 relative overflow-hidden border-t border-[#A3B1C6]/20">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-3 mb-10 px-6 py-2 rounded-full shadow-extruded-sm text-[#fb7185] text-[10px] font-display font-black uppercase tracking-[0.4em]">
                <Heart className="h-4 w-4 fill-[#fb7185]" />
                From us, to you
              </div>
              <h2 className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic mb-10">
                You Deserve a<br /><span className="text-[#6C63FF] not-italic">Fighting Chance.</span>
              </h2>
              <p className="text-xl text-[#6B7280] mb-12 max-w-2xl mx-auto leading-relaxed font-body">
                The system is already stacked against job seekers. We're not going to be another barrier.
                Use every tool, optimize every application, and land the role you deserve.
              </p>
              <Link href="/auth/login" className="inline-flex items-center gap-3 px-12 py-6 bg-[#6C63FF] text-white rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[8px_8px_20px_rgba(108,99,255,0.3)] active:scale-95">
                <Rocket className="h-5 w-5" />
                Start Your Free Journey
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
