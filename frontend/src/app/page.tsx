'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import {
  Upload, FileText, ArrowRight, Loader2, ShieldCheck, Zap,
  BrainCircuit, Rocket, Target, Lock, HelpCircle, ChevronDown,
  Mail, User, MessageSquare, CheckCircle2, Star, Quote,
  TrendingUp, Search, Check, Briefcase, X, Heart,
  Sparkles, ChevronRight, BarChart2, Users, Award
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { analyzeResume } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════════════ */
const easeOut = 'easeOut' as const;
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.5, ease: easeOut } },
};

/* ═══════════════════════════════════════════════════════════════
   REUSABLE SCROLL-TRIGGERED ANIMATION WRAPPER
═══════════════════════════════════════════════════════════════ */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATS DATA
═══════════════════════════════════════════════════════════════ */
const stats = [
  { value: '73%', label: 'Resumes filtered before human review', color: '#F97316' },
  { value: '200+', label: 'Applications sent per interview', color: '#7C3AED' },
  { value: '0', label: 'Credit card ever required', color: '#10B981' },
  { value: '100%', label: 'Free, forever', color: '#22D3EE' },
];

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — 3 STEPS
═══════════════════════════════════════════════════════════════ */
const steps = [
  {
    num: '01',
    title: 'Upload Your Resume',
    desc: 'Drop your PDF or DOCX. Our AI reads every word — skills, experience, job titles, everything.',
    icon: <Upload className="h-6 w-6" />,
    color: '#7C3AED',
  },
  {
    num: '02',
    title: 'Paste the Job Description',
    desc: 'Copy the job posting you\'re targeting. Our engine maps it against your resume line by line.',
    icon: <Search className="h-6 w-6" />,
    color: '#22D3EE',
  },
  {
    num: '03',
    title: 'Get Your Match Score',
    desc: 'See exactly what\'s missing, what\'s matched, and how to fix it — in under 30 seconds.',
    icon: <BarChart2 className="h-6 w-6" />,
    color: '#10B981',
  },
];

/* ═══════════════════════════════════════════════════════════════
   LIVE DEMO STEPS
═══════════════════════════════════════════════════════════════ */
const demoSteps = [
  {
    label: 'Upload',
    sublabel: 'PDF or DOCX',
    color: '#7C3AED',
    icon: <Upload className="h-5 w-5" />,
    screen: (
      <div className="flex flex-col items-center justify-center gap-6 h-full text-center px-8">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl bg-[#1C1C2A] border border-[#7C3AED]/30 flex items-center justify-center">
          <FileText className="h-10 w-10 text-[#7C3AED]" />
        </motion.div>
        <div>
          <p className="text-[#F1F0F5] font-syne font-bold text-base">resume_2024.pdf</p>
          <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-1.5 rounded-full bg-[#7C3AED] mt-3 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
          <p className="text-[#52525E] text-xs font-dm-sans font-medium mt-2 uppercase tracking-widest">Uploading...</p>
        </div>
      </div>
    ),
  },
  {
    label: 'Analyze',
    sublabel: 'Job description',
    color: '#22D3EE',
    screen: (
      <div className="flex flex-col gap-5 h-full px-8 justify-center">
        <div className="p-5 rounded-2xl bg-[#1C1C2A] border border-[#22D3EE]/20">
          <p className="text-[#52525E] text-[10px] font-syne font-bold uppercase tracking-widest mb-3">Job Keywords</p>
          {['Senior Software Engineer', 'React · TypeScript · Node', '5+ years experience', 'AWS · Docker · K8s', 'CI/CD · REST APIs'].map((kw, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
              <span className="text-[#9090A8] text-xs font-dm-sans font-medium">{kw}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1C1C2A] border border-[#22D3EE]/20">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22D3EE]" />
          </div>
          <p className="text-[#22D3EE] text-[10px] font-syne font-bold uppercase tracking-widest">Analyzing keywords...</p>
        </div>
      </div>
    ),
  },
  {
    label: 'Score',
    sublabel: 'Instant results',
    color: '#F97316',
    screen: (
      <div className="flex flex-col items-center gap-8 h-full justify-center px-8">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="#1C1C2A" strokeWidth="10" />
            <motion.circle
              cx="70" cy="70" r="58" fill="none"
              stroke="#F97316" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 58}
              initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - 0.38) }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-4xl font-syne font-extrabold text-[#F97316]">38</motion.span>
            <span className="text-[#52525E] text-[9px] font-syne font-bold uppercase tracking-widest">Match</span>
          </div>
        </div>
        <div className="w-full space-y-2">
          {[['Missing', '22', '#EF4444'], ['Matched', '14', '#10B981'], ['Format', '4', '#F97316']].map(([l, v, c]) => (
            <div key={l} className="flex justify-between items-center px-4 py-2.5 rounded-xl bg-[#1C1C2A] border border-[#1E1E30]">
              <span className="text-[#9090A8] text-xs font-dm-sans font-medium">{l}</span>
              <span className="text-xs font-syne font-bold" style={{ color: c }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    label: 'Optimize',
    sublabel: '95%+ match',
    color: '#10B981',
    screen: (
      <div className="flex flex-col items-center gap-8 h-full justify-center px-8">
        <div className="relative">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute w-36 h-36 rounded-full border-2 border-dashed border-[#10B981]/20" />
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="#1C1C2A" strokeWidth="10" />
            <motion.circle
              cx="70" cy="70" r="58" fill="none"
              stroke="#10B981" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 58}
              initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - 0.95) }}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
              className="text-4xl font-syne font-extrabold text-[#10B981]">95</motion.span>
            <span className="text-[#52525E] text-[9px] font-syne font-bold uppercase tracking-widest">Match</span>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
          <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
          <span className="text-xs font-syne font-bold text-[#F1F0F5] uppercase tracking-wider">Resume Optimized</span>
        </motion.div>
        <p className="text-[#52525E] text-[10px] font-syne font-bold uppercase tracking-widest text-center">
          100% Free · No Credit Card
        </p>
      </div>
    ),
  },
];

/* ═══════════════════════════════════════════════════════════════
   FEATURES — 6 CARDS
═══════════════════════════════════════════════════════════════ */
const features = [
  { title: 'ATS Match Score', desc: 'Know your exact compatibility score before you apply. No more guessing.', icon: <Target className="h-5 w-5" />, color: '#7C3AED' },
  { title: 'Gap Analysis', desc: 'See precisely which keywords and skills are missing from your resume.', icon: <BrainCircuit className="h-5 w-5" />, color: '#22D3EE' },
  { title: 'AI Rewrite', desc: 'Our AI rewrites your bullet points to match the job — without sounding robotic.', icon: <Sparkles className="h-5 w-5" />, color: '#F97316' },
  { title: 'Format Scanner', desc: 'Catch formatting issues that trigger ATS rejections — invisible characters, bad encoding.', icon: <FileText className="h-5 w-5" />, color: '#10B981' },
  { title: 'Cover Letters', desc: 'Generate a targeted cover letter from your resume in one click.', icon: <Mail className="h-5 w-5" />, color: '#EC4899' },
  { title: 'Job Pipeline', desc: 'Track every application from submission to offer in a clean dashboard.', icon: <Briefcase className="h-5 w-5" />, color: '#F59E0B' },
];

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════ */
const testimonials = [
  {
    name: 'Marcus Chen',
    title: 'Backend Engineer',
    company: 'Hired at Stripe',
    avatar: 'MC',
    avatarColor: '#7C3AED',
    score: 94,
    quote: 'I applied to 40 jobs with a generic resume — zero callbacks. Used HireReady, fixed the gaps in 20 minutes, landed 6 interviews in two weeks.',
  },
  {
    name: 'Priya Nair',
    title: 'Product Manager',
    company: 'Hired at Shopify',
    avatar: 'PN',
    avatarColor: '#22D3EE',
    score: 91,
    quote: 'The gap analysis was brutal but honest. It showed me exactly what I was missing. The AI rewrite suggestions actually made my experience sound more relevant.',
  },
  {
    name: 'James Okonkwo',
    title: 'DevOps Engineer',
    company: 'Hired at Shopify',
    avatar: 'JO',
    avatarColor: '#10B981',
    score: 97,
    quote: 'My resume kept getting filtered by Workday. HireReady showed me the formatting issues I never would have caught. First real interview came in 5 days.',
  },
];

/* ═══════════════════════════════════════════════════════════════
   FAQ
═══════════════════════════════════════════════════════════════ */
const faqItems = [
  {
    q: 'How is this different from Jobscan or Resumatic?',
    a: 'Most tools give you a keyword checklist and leave you to figure out the rest. HireReady actually rewrites your bullet points to incorporate those keywords credibly — and flags formatting issues that cause silent rejections.',
  },
  {
    q: 'Is it really free? What\'s the catch?',
    a: 'No catch. The job market is brutal right now. We built HireReady because every job seeker deserves a fair shot at the ATS filter, regardless of their budget. All features are free, forever.',
  },
  {
    q: 'Will this actually help me get hired?',
    a: 'It will help you get your resume in front of a human recruiter. After that, your interview skills and experience take over. We fix the ATS problem — the rest is on you.',
  },
  {
    q: 'Is my resume data safe?',
    a: 'Yes. Your data is encrypted at rest and in transit. We never sell or share your personal information. You can request deletion of all your data at any time.',
  },
  {
    q: 'How accurate is the ATS scoring?',
    a: 'Our scoring is based on the same keyword-matching logic used by major ATS platforms (Workday, Greenhouse, Lever). It\'s an approximation, not a guarantee — but it\'s the closest you can get without buying enterprise software.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1E1E30] rounded-2xl overflow-hidden bg-[#12121C] transition-all duration-200 hover:border-[#7C3AED]/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
      >
        <span className="text-sm font-syne font-bold text-[#F1F0F5]">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#1C1C2A] border border-[#1E1E30] flex items-center justify-center">
          <ChevronDown className="h-4 w-4 text-[#9090A8]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-[#9090A8] leading-relaxed font-dm-sans border-t border-[#1E1E30] pt-5">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIVE DEMO SECTION
═══════════════════════════════════════════════════════════════ */
function LiveDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setActiveStep(p => (p + 1) % demoSteps.length), 3200);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <section ref={ref} className="py-32 px-6 border-t border-[#1E1E30] relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full orb bg-[#7C3AED]/5" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full orb bg-[#22D3EE]/5" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <Reveal className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#7C3AED] text-xs font-syne font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]" />
            </span>
            Live Demo
          </div>
          <h2 className="text-4xl md:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9]">
            Watch it<br /><span className="text-gradient-violet">work in 30 seconds.</span>
          </h2>
          <p className="text-[#9090A8] text-base mt-6 max-w-lg mx-auto font-dm-sans leading-relaxed">
            From raw resume to ATS-optimized document. Every step, completely free.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Step nav */}
          <div className="lg:col-span-4 space-y-3">
            {demoSteps.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                  activeStep === i
                    ? 'bg-[#12121C] border-[#7C3AED]/40 shadow-[0_0_20px_rgba(124,58,237,0.1)]'
                    : 'bg-transparent border-[#1E1E30] hover:border-[#1E1E30]/80'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  activeStep === i ? 'text-white shadow-lg' : 'text-[#52525E]'
                }`} style={activeStep === i ? { background: s.color } : {}}>
                  {activeStep === i ? <Check className="h-5 w-5" /> : s.icon}
                </div>
                <div>
                  <p className={`text-sm font-syne font-bold transition-colors ${activeStep === i ? 'text-[#F1F0F5]' : 'text-[#52525E]'}`}>
                    {s.label}
                  </p>
                  <p className="text-[10px] text-[#52525E] font-dm-sans uppercase tracking-widest mt-0.5">{s.sublabel}</p>
                </div>
                {activeStep === i && (
                  <motion.div layoutId="demo-indicator" className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                )}
              </button>
            ))}
          </div>

          {/* Screen */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-[#0B0B12] rounded-[28px] border border-[#1E1E30] overflow-hidden"
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1E1E30] bg-[#12121C]">
                <div className="flex gap-2">
                  {['#EF4444', '#F97316', '#10B981'].map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 mx-4 h-8 rounded-lg bg-[#1C1C2A] flex items-center px-4 gap-2 border border-[#1E1E30]">
                  <div className="w-2 h-2 rounded-full" style={{ background: demoSteps[activeStep].color }} />
                  <span className="text-[10px] font-mono text-[#52525E]">hireready.app/workspace</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                  <Heart className="h-3 w-3 text-[#10B981] fill-[#10B981]" />
                  <span className="text-[9px] font-syne font-bold text-[#10B981] uppercase tracking-widest">Free</span>
                </div>
              </div>
              {/* Screen content */}
              <div className="bg-[#0B0B12] min-h-[320px] relative overflow-hidden">
                {demoSteps[activeStep].screen}
                <span className="absolute bottom-4 right-8 text-[6rem] font-syne font-extrabold text-[#1C1C2A] select-none leading-none">
                  {String(activeStep + 1).padStart(2, '0')}
                </span>
              </div>
              {/* Bottom bar */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#1E1E30] bg-[#12121C]">
                <span className="text-[#52525E] text-[10px] font-syne font-bold uppercase tracking-widest">Auto-playing demo</span>
                <div className="flex gap-2">
                  {demoSteps.map((_, i) => (
                    <button key={i} onClick={() => setActiveStep(i)}
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ width: activeStep === i ? 20 : 8, background: activeStep === i ? demoSteps[i].color : '#1E1E30' }}
                    />
                  ))}
                </div>
                <Link href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white text-[10px] font-syne font-bold uppercase tracking-widest rounded-lg hover:bg-[#9D6FFF] transition-all">
                  Try Free <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARQUEE FEATURES
═══════════════════════════════════════════════════════════════ */
const marqueeItems = [
  'AI Keyword Optimization', 'ATS Bypass Engine', 'Semantic Gap Analysis',
  'Format-Perfect PDF Export', 'Cover Letter Generator', 'Job Pipeline Tracker',
  'Real-time Scoring', '100% Machine Readable', 'Zero Data Selling',
  'AI Keyword Optimization', 'ATS Bypass Engine', 'Semantic Gap Analysis',
];

/* ═══════════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════════ */
function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  if (sent) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="card p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
      </div>
      <h3 className="text-2xl font-syne font-extrabold text-[#F1F0F5] mb-3">Message received.</h3>
      <p className="text-[#9090A8] font-dm-sans">We typically reply within 24 hours.</p>
    </motion.div>
  );

  return (
    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}
      className="card p-10 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-widest">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525E]" />
            <input required value={name} onChange={e => setName(e.target.value)} type="text"
              placeholder="Alex Johnson"
              className="w-full bg-[#1C1C2A] border border-[#1E1E30] rounded-xl py-4 pl-12 pr-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/50 transition-colors" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-widest">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52525E]" />
            <input required value={email} onChange={e => setEmail(e.target.value)} type="email"
              placeholder="alex@company.com"
              className="w-full bg-[#1C1C2A] border border-[#1E1E30] rounded-xl py-4 pl-12 pr-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/50 transition-colors" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-widest">Message</label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-5 h-4 w-4 text-[#52525E]" />
          <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5}
            placeholder="How can we help?"
            className="w-full bg-[#1C1C2A] border border-[#1E1E30] rounded-xl py-4 pl-12 pr-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/50 transition-colors resize-none" />
        </div>
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-4 bg-[#7C3AED] text-white rounded-xl font-syne font-bold text-sm uppercase tracking-widest hover:bg-[#9D6FFF] transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-60 flex items-center justify-center gap-3">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
        {loading ? 'Sending...' : 'Send Message'}
        {!loading && <ArrowRight className="h-4 w-4 opacity-50" />}
      </button>
    </motion.form>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Home() {
  const { setAnalysisResult, setResumeFile, setJobDescription } = useResumeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localJD, setLocalJD] = useState('');
  const [teaserScore, setTeaserScore] = useState<number | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);

  const handleAnalyze = async () => {
    if (!localFile || !localJD) return;
    setIsAnalyzing(true);
    setProgress(5);
    try {
      const result = await analyzeResume(localFile, localJD);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 95) { clearInterval(interval); setTeaserScore(result.initial_score); setIsAnalyzing(false); setShowUpsell(true); return 100; }
          return p + Math.random() * 15;
        });
      }, 200);
      setAnalysisResult(result);
      setResumeFile(localFile);
      setJobDescription(localJD);
    } catch { setIsAnalyzing(false); }
  };

  return (
    <div className="bg-[#0B0B12] text-[#F1F0F5] overflow-x-hidden">

      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden bg-mesh">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        {/* Orbs */}
        <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] rounded-full orb bg-[#7C3AED]/8" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full orb bg-[#22D3EE]/5" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full orb bg-[#F97316]/3" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Label */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#7C3AED] text-xs font-syne font-bold uppercase tracking-widest mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C3AED] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]" />
            </span>
            100% Free — No Credit Card Required
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-syne font-extrabold text-[#F1F0F5] leading-[0.88] tracking-tighter mb-10">
            Stop Getting<br />
            <span className="text-gradient-violet">Ghosted by ATS.</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-lg text-[#9090A8] max-w-2xl mx-auto leading-relaxed font-dm-sans mb-12">
            73% of resumes never reach a human. HireReady analyzes yours against any job description
            and tells you <span className="text-[#F1F0F5] font-semibold">exactly why you're being filtered out</span> — then fixes it.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#analyzer"
              className="px-10 py-5 bg-[#7C3AED] text-white rounded-2xl font-syne font-bold text-sm uppercase tracking-widest hover:bg-[#9D6FFF] transition-all duration-200 shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] flex items-center gap-3 active:scale-[0.98]">
              <Rocket className="h-5 w-5" />
              Analyze My Resume — Free
            </a>
            <a href="#how-it-works"
              className="px-10 py-5 text-[#9090A8] rounded-2xl font-syne font-bold text-sm uppercase tracking-widest border border-[#1E1E30] hover:border-[#7C3AED]/30 hover:text-[#F1F0F5] transition-all duration-200 flex items-center gap-3">
              <BarChart2 className="h-5 w-5" />
              See How It Works
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-8 text-xs text-[#52525E] font-dm-sans flex items-center justify-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
            Encrypted · No account required · Takes 30 seconds
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[9px] font-syne font-bold uppercase tracking-[0.3em] text-[#52525E]">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-[#52525E] to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════════ STATS ═══════════════════════════ */}
      <section className="py-20 px-6 border-y border-[#1E1E30] bg-[#0B0B12]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.07} className="text-center">
                <p className="text-3xl md:text-4xl font-syne font-extrabold tracking-tight mb-2" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-[#9090A8] font-dm-sans leading-relaxed max-w-[160px] mx-auto">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ MARQUEE ═══════════════════════════ */}
      <div className="py-8 border-b border-[#1E1E30] bg-[#0B0B12] overflow-hidden">
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0B0B12] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0B0B12] to-transparent z-10 pointer-events-none" />
          <div className="marquee-track py-2">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-xs font-syne font-bold text-[#52525E] uppercase tracking-widest whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ PROBLEM ═══════════════════════════ */}
      <section className="py-32 px-6 bg-[#0B0B12]">
        <div className="max-w-[900px] mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F97316]/10 border border-[#F97316]/20 text-[#F97316] text-xs font-syne font-bold uppercase tracking-widest mb-8">
              <X className="h-3.5 w-3.5" />
              The Problem
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-8">
              Your resume is losing to<br />
              <span className="text-gradient-coral">an algorithm.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#9090A8] text-base md:text-lg leading-relaxed font-dm-sans max-w-2xl mx-auto">
              Most companies use Applicant Tracking Systems to filter out 70-80% of applications before a human recruiter ever reads a single word. It's not about how good you are — it's about whether your resume speaks the ATS's language.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-[#9090A8] text-base md:text-lg leading-relaxed font-dm-sans max-w-2xl mx-auto mt-6">
              Keyword mismatches, formatting errors, and invisible encoding issues are silently disqualifying qualified candidates every day. <span className="text-[#F1F0F5] font-semibold">HireReady fixes that.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section id="how-it-works" className="py-32 px-6 border-t border-[#1E1E30] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/20 to-transparent" />

        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#22D3EE] text-xs font-syne font-bold uppercase tracking-widest mb-8">
              <Zap className="h-3.5 w-3.5" />
              The Protocol
            </div>
            <h2 className="text-4xl md:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9]">
              Three steps.<br /><span className="text-gradient-violet">Thirty seconds.</span>
            </h2>
          </Reveal>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp}
                className="card p-10 relative overflow-hidden group hover:border-[#7C3AED]/30 transition-all duration-300">
                <span className="absolute top-6 right-8 text-7xl font-syne font-extrabold text-[#1C1C2A] select-none leading-none group-hover:text-[#7C3AED]/5 transition-colors">
                  {s.num}
                </span>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                  <div style={{ color: s.color }}>{s.icon}</div>
                </div>
                <h3 className="text-lg font-syne font-bold text-[#F1F0F5] mb-3">{s.title}</h3>
                <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════ LIVE DEMO ═══════════════════════════ */}
      <LiveDemo />

      {/* ═══════════════════════════ INLINE ANALYZER ═══════════════════════════ */}
      <section id="analyzer" className="py-32 px-6 border-t border-[#1E1E30] relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-15%] w-[700px] h-[700px] rounded-full orb bg-[#7C3AED]/6 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-xs font-syne font-bold uppercase tracking-widest mb-8">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Try It Now — Free
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-6">
                Find out why<br />you're <span className="text-gradient-violet">getting rejected.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-[#9090A8] text-base leading-relaxed font-dm-sans mb-10">
                Upload your resume, paste the job description, and get your ATS match score instantly.
                No account. No credit card. Just answers.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Zap className="h-4 w-4" />, label: '30-second scan' },
                  { icon: <Lock className="h-4 w-4" />, label: 'Encrypted upload' },
                  { icon: <BrainCircuit className="h-4 w-4" />, label: 'AI gap analysis' },
                  { icon: <TrendingUp className="h-4 w-4" />, label: '95%+ match goal' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#12121C] border border-[#1E1E30] flex items-center justify-center text-[#7C3AED]">
                      {f.icon}
                    </div>
                    <span className="text-sm font-dm-sans font-medium text-[#9090A8]">{f.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Analyzer card */}
          <Reveal delay={0.15}>
            <div className="card p-8 space-y-6">
              {/* File upload */}
              <div>
                <label className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-widest mb-3 block">Resume</label>
                <div
                  className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden min-h-[140px] flex items-center justify-center ${
                    localFile ? 'border-[#7C3AED]/40 bg-[#7C3AED]/5' : 'border-[#1E1E30] hover:border-[#7C3AED]/30 bg-[#12121C]'
                  }`}
                >
                  <input type="file" accept=".pdf,.docx" onChange={e => setLocalFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {localFile ? (
                    <div className="flex flex-col items-center gap-3 text-center p-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-[#7C3AED]" />
                      </div>
                      <p className="text-sm font-syne font-bold text-[#F1F0F5]">{localFile.name}</p>
                      <span className="text-xs font-dm-sans text-[#10B981]">Ready for analysis</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center p-8">
                      <div className="w-14 h-14 rounded-2xl bg-[#1C1C2A] border border-[#1E1E30] flex items-center justify-center text-[#52525E]">
                        <Upload className="h-7 w-7" />
                      </div>
                      <p className="text-sm font-syne font-bold text-[#9090A8]">Drop resume here or click to upload</p>
                      <span className="text-xs font-dm-sans text-[#52525E]">PDF or DOCX · Max 10MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job description */}
              <div>
                <label className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-widest mb-3 block">Job Description</label>
                <textarea value={localJD} onChange={e => setLocalJD(e.target.value)}
                  placeholder="Paste the job posting you're applying to..."
                  rows={5}
                  className="w-full bg-[#12121C] border border-[#1E1E30] rounded-2xl p-5 text-sm text-[#F1F0F5] font-dm-sans placeholder-[#52525E] outline-none focus:border-[#7C3AED]/40 transition-colors resize-none" />
              </div>

              {/* Submit */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !localFile || !localJD}
                className={`w-full py-4 rounded-2xl font-syne font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] ${
                  !localFile || !localJD || isAnalyzing
                    ? 'bg-[#12121C] text-[#52525E] border border-[#1E1E30] cursor-not-allowed'
                    : 'bg-[#7C3AED] text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_50px_rgba(124,58,237,0.6)] hover:bg-[#9D6FFF]'
                }`}
              >
                {isAnalyzing ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /><span>Analyzing... {Math.round(progress)}%</span></>
                ) : (
                  <><BarChart2 className="h-5 w-5" /><span>Analyze Match Score</span><ArrowRight className="h-5 w-5 opacity-50" /></>
                )}
              </button>

              <p className="text-center text-xs text-[#52525E] font-dm-sans flex items-center justify-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                100% Free · No account required · Results in 30 seconds
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURES ═══════════════════════════ */}
      <section id="features" className="py-32 px-6 border-t border-[#1E1E30]">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#7C3AED] text-xs font-syne font-bold uppercase tracking-widest mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              The Toolkit
            </div>
            <h2 className="text-4xl md:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9]">
              Everything you need.<br /><span className="text-gradient-violet">Nothing you don't.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="card p-8 group hover:border-[#7C3AED]/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `${f.color}15`, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-syne font-bold text-[#F1F0F5] mb-3">{f.title}</h3>
                  <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */}
      <section id="testimonials" className="py-32 px-6 border-t border-[#1E1E30] relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full orb bg-[#22D3EE]/4 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <Reveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#F97316] text-xs font-syne font-bold uppercase tracking-widest mb-8">
              <Star className="h-3.5 w-3.5 fill-[#F97316] text-[#F97316]" />
              Real Results
            </div>
            <h2 className="text-4xl md:text-6xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9]">
              People who<br /><span className="text-gradient-violet">stopped getting ghosted.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="card p-8 flex flex-col gap-6">
                  {/* Score badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, si) => (
                        <Star key={si} className="h-3.5 w-3.5 fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                      <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" />
                      <span className="text-xs font-syne font-bold text-[#10B981]">{t.score}% Match</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative flex-1">
                    <Quote className="absolute -top-1 -left-1 h-5 w-5 text-[#7C3AED]/20" />
                    <p className="text-sm text-[#9090A8] leading-relaxed font-dm-sans italic pl-5">"{t.quote}"</p>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-[#1E1E30]">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-syne font-extrabold text-white flex-shrink-0"
                      style={{ background: t.avatarColor }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-syne font-bold text-[#F1F0F5]">{t.name}</p>
                      <p className="text-xs text-[#9090A8] font-dm-sans">{t.title} · <span style={{ color: t.avatarColor }}>{t.company}</span></p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FAQ ═══════════════════════════ */}
      <section className="py-32 px-6 border-t border-[#1E1E30]">
        <div className="max-w-[720px] mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#9090A8] text-xs font-syne font-bold uppercase tracking-widest mb-8">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9]">
              Questions worth <span className="text-gradient-violet">asking.</span>
            </h2>
          </Reveal>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <FAQItem q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CONTACT ═══════════════════════════ */}
      <section className="py-32 px-6 border-t border-[#1E1E30]">
        <div className="max-w-[720px] mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12121C] border border-[#1E1E30] text-[#7C3AED] text-xs font-syne font-bold uppercase tracking-widest mb-8">
              <Mail className="h-3.5 w-3.5" />
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9]">
              Something to <span className="text-gradient-violet">say?</span>
            </h2>
            <p className="text-[#9090A8] font-dm-sans mt-4 text-base">We read every message and reply within 24 hours.</p>
          </Reveal>
          <ContactForm />
        </div>
      </section>

      {/* ═══════════════════════════ FINAL CTA ═══════════════════════════ */}
      <section className="py-32 px-6 border-t border-[#1E1E30] relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full orb bg-[#7C3AED]/8 pointer-events-none" />

        <div className="max-w-[800px] mx-auto text-center relative z-10">
          <Reveal>
            <h2 className="text-5xl md:text-7xl font-syne font-extrabold text-[#F1F0F5] tracking-tighter leading-[0.9] mb-8">
              Your resume is<br /><span className="text-gradient-violet">one fix away.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[#9090A8] text-base md:text-lg leading-relaxed font-dm-sans max-w-xl mx-auto mb-12">
              Stop letting ATS algorithms decide your fate. Find out what's holding you back — and fix it in under a minute.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#analyzer"
                className="px-12 py-5 bg-[#7C3AED] text-white rounded-2xl font-syne font-bold text-sm uppercase tracking-widest hover:bg-[#9D6FFF] transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] flex items-center justify-center gap-3">
                <Rocket className="h-5 w-5" />
                Analyze My Resume — Free
              </a>
            </div>
            <p className="mt-6 text-xs text-[#52525E] font-dm-sans">No credit card. No account. No catch.</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <Footer />

      {/* ═══════════════════════════ UPSELL MODAL ═══════════════════════════ */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0B0B12]/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="card p-12 max-w-lg w-full text-center space-y-6"
            >
              <button onClick={() => setShowUpsell(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-[#1C1C2A] border border-[#1E1E30] flex items-center justify-center text-[#9090A8] hover:text-[#F1F0F5] transition-colors">
                <X className="h-4 w-4" />
              </button>

              {/* Score reveal */}
              <div className="relative inline-flex items-center justify-center">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="66" fill="none" stroke="#1C1C2A" strokeWidth="10" />
                  <motion.circle
                    cx="80" cy="80" r="66" fill="none"
                    stroke="#7C3AED" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 66}
                    initial={{ strokeDashoffset: 2 * Math.PI * 66 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 66 * (1 - (teaserScore ?? 0) / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    className="text-5xl font-syne font-extrabold text-[#7C3AED]">{teaserScore ?? 0}</motion.span>
                  <span className="text-[10px] font-syne font-bold text-[#52525E] uppercase tracking-widest">Match Score</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-syne font-extrabold text-[#F1F0F5] mb-3">
                  Your baseline is set.
                </h3>
                <p className="text-[#9090A8] font-dm-sans text-sm leading-relaxed">
                  Now see exactly where the gaps are — and let our AI fix them. Full analysis, gap breakdown, and optimized resume: all free.
                </p>
              </div>

              <Link href="/auth/login"
                className="block w-full py-4 bg-[#7C3AED] text-white rounded-2xl font-syne font-bold text-sm uppercase tracking-widest hover:bg-[#9D6FFF] transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)]">
                See My Full Analysis — Free
              </Link>

              <p className="text-xs text-[#52525E] font-dm-sans flex items-center justify-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                No credit card required · Instant access
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
