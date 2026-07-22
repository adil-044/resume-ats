'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Heart, Sparkles, Brain, Mail, Briefcase, BarChart2,
  Download, Clock, Lock, Check, ShieldCheck, Users,
  Globe, Rocket, Target, FileText, ChevronRight, Zap, X
} from 'lucide-react';
import Link from 'next/link';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const allFeatures = [
  { label: 'AI Resume Optimization', icon: <Brain className="h-5 w-5" />, color: '#C4A574' },
  { label: 'AI Cover Letter Generator', icon: <Mail className="h-5 w-5" />, color: '#EC4899' },
  { label: 'Job Application Pipeline', icon: <Briefcase className="h-5 w-5" />, color: '#8B5CF6' },
  { label: 'Real-time ATS Scoring', icon: <BarChart2 className="h-5 w-5" />, color: '#A39E93' },
  { label: 'ATS Bypass Engine', icon: <Zap className="h-5 w-5" />, color: '#F97316' },
  { label: 'Format-Perfect PDF Export', icon: <Download className="h-5 w-5" />, color: '#C4A574' },
  { label: 'History & Saved Files', icon: <Clock className="h-5 w-5" />, color: '#A39E93' },
  { label: 'Secure Data Encryption', icon: <Lock className="h-5 w-5" />, color: '#10B981' },
  { label: 'Bridge The Gap AI Tool', icon: <Target className="h-5 w-5" />, color: '#C4A574' },
  { label: 'Unlimited Optimizations', icon: <Sparkles className="h-5 w-5" />, color: '#F97316' },
];

const stats = [
  { value: '1 in 4', label: 'Workers face layoffs', icon: <Users className="h-6 w-6" />, color: '#F97316' },
  { value: '73%', label: 'Resumes filtered by ATS', icon: <FileText className="h-6 w-6" />, color: '#C4A574' },
  { value: '200+', label: 'Applicants per job post', icon: <Globe className="h-6 w-6" />, color: '#A39E93' },
  { value: '100%', label: 'Free — forever', icon: <Heart className="h-6 w-6" />, color: '#10B981' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0C0C0B] text-[#F2EFE8] overflow-x-hidden">
      <Navbar />

      <main className="relative">
        {/* ── HERO ── */}
        <section className="relative py-32 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-mesh pointer-events-none" />
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full orb bg-[#C4A574]/6" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full orb bg-[#A39E93]/4" />

          <div className="max-w-4xl mx-auto relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161614] border border-[#2A2824] text-[#C4A574] text-xs font-display font-bold uppercase tracking-widest mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C4A574] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C4A574]" />
                </span>
                No Plans. No Paywalls. No Credit Card.
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-[#F2EFE8] tracking-tighter leading-[0.88] mb-8">
                Free.<br />
                <span className="text-signal">Forever.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-[#A39E93] text-base md:text-lg leading-relaxed font-body max-w-2xl mx-auto mb-12">
                Every feature. Every tool. Completely free — not a trial, not a freemium trick.
                This is our commitment to every job seeker.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login"
                  className="px-10 py-5 bg-[#C4A574] text-white rounded-2xl font-display font-bold text-sm uppercase tracking-widest hover:bg-[#D4B88A] transition-all  flex items-center gap-3 justify-center">
                  <Rocket className="h-5 w-5" />
                  Start Optimizing — Free
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── WHY FREE ── */}
        <section className="py-32 px-6 border-t border-[#2A2824]">
          <div className="max-w-[1000px] mx-auto">
            <Reveal className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-display font-bold uppercase tracking-widest mb-8">
                <Heart className="h-3.5 w-3.5 fill-[#F97316]" />
                Why We're Free
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-[#F2EFE8] tracking-tighter leading-[0.9]">
                The job market is brutal.<br />
                <span className="text-signal">We're not adding to it.</span>
              </h2>
            </Reveal>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {stats.map((s, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="card p-8 text-center flex flex-col items-center gap-4">
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <p className="text-3xl font-display font-extrabold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-[#A39E93] font-body leading-relaxed">{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Story card */}
            <Reveal>
              <div className="card p-10 md:p-16 relative overflow-hidden">
                <div className="absolute top-8 right-8 opacity-5">
                  <Globe className="h-40 w-40 text-[#C4A574]" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#F97316]/10 border border-[#F97316]/20 flex items-center justify-center">
                      <Heart className="h-7 w-7 text-[#F97316] fill-[#F97316]" />
                    </div>
                    <h3 className="text-2xl font-display font-extrabold text-[#F2EFE8]">
                      We See You. We Built This for You.
                    </h3>
                  </div>

                  <div className="space-y-6 text-[#A39E93] leading-relaxed font-body text-base">
                    <p>
                      The job market right now is one of the hardest in a generation. Layoffs are sweeping every industry — tech, finance, healthcare, marketing. Companies that were hiring aggressively two years ago are now posting hiring freezes. Good people are sending hundreds of applications and hearing nothing back.
                    </p>
                    <p>
                      It's not because they aren't qualified. It's because <strong className="text-[#F2EFE8]">73% of resumes never reach a human</strong> — they're filtered out by Applicant Tracking Systems (ATS) before a recruiter even sees them. Your resume gets rejected by a robot for missing three keywords. That's the reality.
                    </p>
                    <p>
                      We built HireReady to fix exactly this problem. And then we asked ourselves: <em className="text-[#F2EFE8] font-semibold">should we charge people who are already struggling to find a job?</em>
                    </p>
                    <p className="text-xl text-[#F2EFE8] font-display font-bold">
                      The answer was simple: No.
                    </p>
                    <p>
                      Until the job market stabilizes and people have real opportunities again, <strong className="text-[#F2EFE8]">HireReady is completely free</strong>. Every feature. Every AI optimization. Every cover letter. Every tool we build. Zero paywalls. Zero subscriptions. Zero credit cards.
                    </p>
                    <p>
                      Our mission is straightforward: <strong className="text-[#C4A574]">help every single person achieve a 100% ATS match score</strong> so they have the best possible chance at getting the job they deserve.
                    </p>
                  </div>

                  <div className="pt-8 border-t border-[#2A2824] mt-10">
                    <p className="text-xs text-[#6B675F] font-body text-center">
                      — The HireReady Team · Because your career shouldn't cost you money when you don't have any.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="py-32 px-6 border-t border-[#2A2824]">
          <div className="max-w-[1200px] mx-auto">
            <Reveal className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#161614] border border-[#2A2824] text-[#A39E93] text-xs font-display font-bold uppercase tracking-widest mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                What's Included
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold text-[#F2EFE8] tracking-tighter leading-[0.9]">
                Everything.<br />
                <span className="text-signal">Yours. Free.</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {allFeatures.map((f, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="card p-7 flex flex-col gap-4 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${f.color}15`, color: f.color }}>
                      {f.icon}
                    </div>
                    <p className="text-sm font-display font-bold text-[#F2EFE8] leading-tight">{f.label}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <Check className="h-3.5 w-3.5 text-[#10B981]" />
                      <span className="text-[10px] font-display font-bold text-[#10B981] uppercase tracking-widest">Free Forever</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Price card */}
            <Reveal className="max-w-lg mx-auto mt-16">
              <div className="card p-14 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
                  <Heart className="h-40 w-40 text-[#F97316] fill-[#F97316]" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-8">
                    <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                    <span className="text-xs font-display font-bold text-[#10B981] uppercase tracking-widest">No payment info required · Ever</span>
                  </div>

                  <div className="text-7xl font-display font-extrabold text-[#C4A574] mb-2">$0</div>
                  <div className="text-[10px] font-display font-bold text-[#6B675F] uppercase tracking-widest mb-8">/ month · forever</div>

                  <p className="text-[#A39E93] mb-10 leading-relaxed font-body text-base">
                    Sign up with your email. Get instant access to every feature. No credit card, no trial, no expiry.
                  </p>

                  <Link href="/auth/login"
                    className="block w-full py-5 bg-[#C4A574] text-white rounded-2xl font-display font-bold text-sm uppercase tracking-widest hover:bg-[#D4B88A] transition-all ">
                    Get Full Access — Free
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-32 px-6 border-t border-[#2A2824] relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full orb bg-[#C4A574]/6" />

          <div className="max-w-[700px] mx-auto text-center relative z-10">
            <Reveal>
              <h2 className="text-5xl md:text-7xl font-display font-extrabold text-[#F2EFE8] tracking-tighter leading-[0.9] mb-8">
                You deserve a<br /><span className="text-signal">fighting chance.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#A39E93] text-base leading-relaxed font-body max-w-xl mx-auto mb-12">
                The system is already stacked against job seekers. We're not going to be another barrier.
                Use every tool, optimize every application, and land the role you deserve.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/auth/login"
                className="inline-flex items-center gap-3 px-12 py-5 bg-[#C4A574] text-white rounded-2xl font-display font-bold text-sm uppercase tracking-widest hover:bg-[#D4B88A] transition-all ">
                <Rocket className="h-5 w-5" />
                Start Your Free Journey
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
