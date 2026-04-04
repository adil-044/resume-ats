'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Upload, FileText, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, Lock,
  BrainCircuit, Rocket, Fingerprint, Activity, Terminal,
  HelpCircle, ChevronDown, Mail, User, MessageSquare, Coins,
  CheckCircle2, Star, Quote, TrendingUp, Users, Award, Sparkles,
  Play, ChevronRight, BarChart2, Search, Check
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Scene3D from '@/components/Scene3D';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { analyzeResume } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';
import { Variants } from 'framer-motion';

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
};
const kineticItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.9, ease: "easeOut" } }
};

/* ─── Animated Counter ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 18 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) motionVal.set(to); }, [inView, to, motionVal]);
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

/* ─── Star Rating ─── */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

/* ─── Testimonials Data ─── */
const testimonials = [
  {
    name: "Marcus Johnson",
    title: "Software Engineer",
    company: "Hired at Google",
    avatar: "MJ",
    color: "#4f46e5",
    score: 94,
    text: "I was struggling to get callbacks. After using HireReady to tailor my resume, the difference was night and day. It genuinely helped me understand what I was missing.",
    tags: ["Tech", "FAANG"]
  },
  {
    name: "Priya Sharma",
    title: "Product Manager",
    company: "Hired at Stripe",
    avatar: "PS",
    color: "#7c3aed",
    score: 91,
    text: "The AI suggestions were so specific — it knew exactly what hiring managers at fintech companies look for. I finally started getting the interviews I wanted.",
    tags: ["Product", "FinTech"]
  },
  {
    name: "Alex Thompson",
    title: "Marketing Manager",
    company: "Hired at Shopify",
    avatar: "AT",
    color: "#16a34a",
    score: 89,
    text: "Used to spend hours tweaking my resume for every job. The job description analysis is brilliant and saves me so much time while applying.",
    tags: ["Marketing", "eCommerce"]
  }
];

/* ─── Companies where users got hired ─── */
const companies = [
  "Google", "Stripe", "Netflix", "Airbnb", "Shopify", "JPMorgan",
  "Meta", "Amazon", "Apple", "Microsoft", "Nvidia", "OpenAI",
  "Salesforce", "Uber", "LinkedIn", "Notion", "Figma", "Vercel"
];

/* ─── How It Works Steps ─── */
const howItWorks = [
  {
    step: "01",
    title: "Upload Your Resume",
    desc: "Upload your existing resume in PDF or DOCX format. We read every word to understand your skills and experience.",
    icon: <Upload className="h-7 w-7" />
  },
  {
    step: "02",
    title: "Paste the Job Description",
    desc: "Copy-paste the job posting you're applying to. Our AI compares it against your resume to find the gaps.",
    icon: <Search className="h-7 w-7" />
  },
  {
    step: "03",
    title: "Get Your Match Score",
    desc: "See exactly how well your resume matches the job — with a detailed breakdown of matched and missing keywords.",
    icon: <BarChart2 className="h-7 w-7" />
  },
  {
    step: "04",
    title: "Optimize & Apply",
    desc: "Use our AI to rewrite your resume with the right keywords. Download the polished version and apply with confidence.",
    icon: <Rocket className="h-7 w-7" />
  }
];

/* ─── FAQ Data ─── */
const faqData = [
  { question: "Will this actually improve my chances?", answer: "Yes. Most applicant tracking systems filter out resumes that don't match the job description. By adding the exact skills they are looking for in the right context, you bypass the filter and get your resume in front of a human recruiter." },
  { question: "How is this different from Jobscan?", answer: "Competitors just give you a raw list of missing keywords and leave you to figure out how to add them. HireReady's AI actually analyzes your experience and shows you exactly how to incorporate those missing skills credibly and naturally into your bullet points." },
  { question: "How much does it cost?", answer: "Your first 4 resume analyses cost just $1 total. After that, it's $1 per analysis — pay as you go. No subscriptions, no hidden fees." },
  { question: "What if I upload my resume and it doesn't help?", answer: "If your resume is already perfectly optimized for the job, our system will tell you that you have a 95%+ match score and you're good to apply! You only pay per scan, so there are no wasted subscriptions if you don't need us right now." },
  { question: "Is my resume data safe?", answer: "Yes. Your data is encrypted and stored securely. We never share or sell your personal information. You can delete your data at any time." }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-[1.5rem] overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className={`glass-card transition-all duration-300 rounded-[1.5rem] ${open ? 'border-indigo-500/30' : 'border-white/5 hover:border-white/10'}`}>
        <div className="flex items-center justify-between p-7">
          <div className="flex items-center gap-5">
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${open ? 'bg-indigo-600' : 'bg-white/5'}`}>
              <HelpCircle className={`h-4 w-4 ${open ? 'text-white' : 'text-indigo-400'}`} />
            </div>
            <p className="text-base font-semibold text-white">{question}</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0 ml-4" />
          </motion.div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-7 pb-7 text-slate-400 leading-relaxed text-sm border-t border-white/5 pt-5 ml-[60px]">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Testimonial Card ─── */
function TestimonialCard({ t, delay = 0 }: { t: typeof testimonials[0]; delay?: number }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="glass-card rounded-[2rem] p-8 flex flex-col gap-6 border border-white/8 relative overflow-hidden group cursor-default"
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"
        style={{ background: `radial-gradient(circle at 30% 20%, ${t.color}12 0%, transparent 70%)` }} />

      {/* Top: stars + score */}
      <div className="flex items-center justify-between">
        <Stars />
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
          <span style={{ color: t.color }} className="font-black">{t.score}%</span>
          <span>match</span>
        </div>
      </div>

      {/* Quote */}
      <div className="relative">
        <Quote className="absolute -top-1 -left-1 h-6 w-6 text-indigo-500/20" />
        <p className="text-slate-300 leading-relaxed text-sm pl-5">"{t.text}"</p>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap">
        {t.tags.map(tag => (
          <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/5 text-slate-500">
            {tag}
          </span>
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
        <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-lg"
          style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}>
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-black text-white">{t.name}</p>
          <p className="text-xs text-slate-500">{t.title} · <span className="text-green-400 font-semibold">{t.company}</span></p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function Home() {
  const router = useRouter();
  const { setAnalysisResult, setResumeFile, setJobDescription } = useResumeStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [localJD, setLocalJD] = useState('');
  const [teaserScore, setTeaserScore] = useState<number | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleInitialScan = async () => {
    if (!localFile || !localJD) return;
    setIsAnalyzing(true);
    setProgress(5);
    try {
      const result = await analyzeResume(localFile, localJD);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            setTeaserScore(result.initial_score);
            setIsAnalyzing(false);
            setShowUpsell(true);
            return 100;
          }
          return prev + (Math.random() * 15);
        });
      }, 200);
      setAnalysisResult(result);
      setResumeFile(localFile);
      setJobDescription(localJD);
    } catch { alert('Analysis failed. Please try again.'); setIsAnalyzing(false); }
  };

  const handleContactSubmit = (e: React.FormEvent) => { e.preventDefault(); setContactSent(true); };

  // doubled for seamless marquee
  const marqueeCompanies = [...companies, ...companies];

  return (
    <div className="min-h-screen bg-black selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-[0.02]" />
      <Navbar />

      <main className="relative">
        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          <Scene3D />

          {/* Ambient glows */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-cyan-600/8 rounded-full blur-[80px] pointer-events-none" />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl z-10 relative"
          >
            {/* Badge */}
            <motion.div variants={kineticItem} className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-10 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Trusted by early adopters
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={kineticItem} className="text-6xl md:text-8xl lg:text-[9rem] font-black text-white leading-[0.85] tracking-tighter mb-8 uppercase">
              Land the Job <br />
              <span className="text-gradient-purple not-italic">You Deserve.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p variants={kineticItem} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
              Our AI analyzes your resume against any job posting and rewrites it to score{' '}
              <span className="text-white font-semibold">95%+ match rate</span> — so you get more interview calls, not more rejections.
              <span className="text-xs text-slate-500 font-normal mt-2 block">(Match rate = how many of the job's required keywords your resume includes)</span>
            </motion.p>

            {/* Social proof micro-text */}
            <motion.div variants={kineticItem} className="flex items-center justify-center gap-3 mb-12 text-sm text-slate-500">
              <div className="flex -space-x-2">
                {['MJ','PS','AT'].map((a,i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-black text-white" style={{ background: ['#4f46e5','#7c3aed','#16a34a'][i] }}>{a}</div>
                ))}
              </div>
              <span><strong className="text-white">5.0/5</strong> from 3 reviews</span>
              <span className="hidden sm:inline text-slate-700">·</span>
              <span className="hidden sm:inline"><strong className="text-amber-400">Launch Special:</strong> $1 for 4 Lifetime Tokens</span>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={kineticItem} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#analyzer" className="group relative px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95 flex items-center gap-3 justify-center overflow-hidden">
                <span className="absolute inset-0 shimmer" />
                <Rocket className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Claim Launch Special ($1)
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-slate-600"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll Down</span>
            <div className="w-px h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
          </motion.div>
        </section>

        {/* ═══════════════════ STATS BAR ═══════════════════ */}
        <section className="py-16 border-y border-white/5 relative bg-black">
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {[
                { value: 30, suffix: '+', label: 'Resumes Optimized', color: 'text-indigo-400' },
                { value: 95,    suffix: '%', label: 'Average Match Rate', color: 'text-cyan-400' },
                { value: 3,  suffix: '', label: '5-Star Reviews',     color: 'text-amber-400' },
                { value: 1,     suffix: '$', label: 'First 4 Scans',     color: 'text-green-400', prefix: true },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2">
                  <p className={`text-4xl md:text-5xl font-black tracking-tighter ${s.color}`}>
                    {s.prefix && '$'}<Counter to={s.value} suffix={s.prefix ? '' : s.suffix} />
                  </p>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ COMPANY LOGOS MARQUEE ═══════════════════ */}
        <section className="py-16 border-b border-white/5 overflow-hidden">
          <div className="text-center mb-10">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">Users have landed jobs at</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #000 0%, transparent 100%)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #000 0%, transparent 100%)' }} />
            <div className="marquee-track">
              {marqueeCompanies.map((company, i) => (
                <div key={i} className="flex items-center gap-3 mx-10 flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-indigo-600/60" />
                  <span className="text-slate-500 font-black text-sm uppercase tracking-widest whitespace-nowrap hover:text-white transition-colors cursor-default">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
        <section className="py-32 px-6 lg:px-12 relative">
          <div className="absolute inset-0 mesh-bg pointer-events-none" />
          <div className="max-w-[1200px] mx-auto relative z-10">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-24"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <Activity className="h-3 w-3" />
                Simple Process
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                How It <span className="text-gradient-purple not-italic">Works.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
                Go from rejected to interview-ready in 4 simple steps.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.02 }}
                  style={{ transformStyle: 'preserve-3d', perspective: 1000 } as any}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="glass-card rounded-[2rem] p-8 relative overflow-hidden group border border-white/5 hover:border-indigo-500/20 transition-all duration-500"
                >
                  {/* Step number watermark */}
                  <span className="absolute top-6 right-6 text-7xl font-black text-white/3 leading-none select-none">{step.step}</span>
                  
                  <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl inline-flex mb-6 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-500">
                    <span className="text-indigo-400 group-hover:text-white transition-colors duration-500">{step.icon}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-3 leading-tight">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                  
                  {i < 3 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ChevronRight className="h-6 w-6 text-indigo-500/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ LIVE ANALYZER ═══════════════════ */}
        <section id="analyzer" className="py-32 px-6 lg:px-12 relative border-t border-white/5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={stagger}
                className="space-y-8"
              >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em]">
                  <Zap className="h-3 w-3 text-amber-400 animate-pulse" />
                  Try It Now — Free
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                  Instant<br /><span className="text-indigo-500">Results.</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-xl text-slate-400 leading-relaxed max-w-xl">
                  Upload your resume and paste a job description. We'll show you exactly how well you match — and how to improve — in seconds.
                </motion.p>
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-6">
                  {[
                    { icon: <Zap className="h-4 w-4 text-amber-400" />, label: 'Fast Scan', desc: 'Results in seconds' },
                    { icon: <ShieldCheck className="h-4 w-4 text-green-400" />, label: 'Secure & Private', desc: 'AES-256 encrypted' },
                    { icon: <BrainCircuit className="h-4 w-4 text-indigo-400" />, label: 'AI-Powered', desc: 'Gemini Pro analysis' },
                    { icon: <Award className="h-4 w-4 text-cyan-400" />, label: '95%+ Match Rate', desc: 'Proven accuracy' }
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-white/5 p-2 rounded-xl mt-0.5 flex-shrink-0">{f.icon}</div>
                      <div>
                        <p className="text-white font-black text-xs uppercase tracking-widest">{f.label}</p>
                        <p className="text-slate-600 text-[10px] mt-1">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass-card p-10 rounded-[3rem] shadow-[0_0_80px_rgba(99,102,241,0.12)] border-beam border border-white/8"
              >
                <div className="space-y-7 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Resume Checker</h3>
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Upload & Get Your Score</p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-indigo-400" />
                    </div>
                  </div>

                  {/* Upload zone */}
                  <div className="relative border-2 border-dashed border-white/5 rounded-[2rem] p-14 text-center group/drop transition-all duration-500 hover:border-indigo-500/40 hover:bg-indigo-500/5 cursor-pointer bg-black/40">
                    <input type="file" onChange={(e) => setLocalFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {localFile ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-indigo-600 p-5 rounded-2xl mb-4 shadow-[0_0_30px_rgba(99,102,241,0.5)] glow-indigo">
                          <FileText className="h-7 w-7 text-white" />
                        </div>
                        <p className="text-white font-black text-sm truncate max-w-full px-4">{localFile.name}</p>
                        <span className="mt-2 text-indigo-400 text-[9px] font-black uppercase tracking-[0.4em] bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Ready ✓</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="bg-white/5 p-5 rounded-2xl mb-4 border border-white/10 group-hover/drop:bg-indigo-600 group-hover/drop:border-indigo-600 transition-all duration-500">
                          <Upload className="h-7 w-7 text-white/30 group-hover/drop:text-white transition-colors duration-500" />
                        </div>
                        <p className="text-white font-bold text-base">Drop your resume here</p>
                        <p className="text-slate-600 text-[9px] mt-1.5 font-black uppercase tracking-[0.2em]">PDF or DOCX</p>
                      </div>
                    )}
                  </div>

                  {/* Job description */}
                  <textarea
                    value={localJD}
                    onChange={(e) => setLocalJD(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-28 bg-black/60 border-2 border-white/5 rounded-[2rem] p-6 outline-none focus:border-indigo-500/40 transition-all text-white text-sm font-medium resize-none placeholder:text-slate-800"
                  />

                  {/* CTA */}
                  <button
                    onClick={handleInitialScan}
                    disabled={isAnalyzing || !localFile || !localJD}
                    className={`relative w-full py-6 rounded-[2rem] font-black text-base flex items-center justify-center gap-4 transition-all duration-500 overflow-hidden group active:scale-[0.98] ${
                      !localFile || !localJD || isAnalyzing
                        ? 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.35)] glow-indigo'
                    }`}
                  >
                    {(!localFile || !localJD || isAnalyzing) ? null : <span className="absolute inset-0 shimmer" />}
                    {isAnalyzing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /><span>Analyzing your resume... {Math.round(progress)}%</span></>
                    ) : (
                      <><Zap className="h-5 w-5 text-indigo-200 group-hover:scale-110 transition-transform" /><span>Get My Match Score</span><ArrowRight className="h-5 w-5 opacity-60 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                  <p className="text-center text-slate-500 text-[11px] font-medium">Start with 4 free scans. After that, $1 per scan. No credit card required.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════ FEATURES 3D GRID ═══════════════════ */}
        <section className="py-32 bg-white relative selection:bg-black selection:text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="max-w-[1300px] mx-auto px-6 lg:px-12">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-24"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-indigo-600 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <Sparkles className="h-3 w-3" />
                Why HireReady
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-6xl lg:text-[7rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] italic">
                Executive<br /><span className="text-indigo-600 not-italic">Systems.</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                { title: "Bridge The Gap", desc: "Competitors just show you keywords. We show you exactly which skills are missing and how to add them credibly to your experience.", icon: <BrainCircuit className="h-8 w-8 text-indigo-400" />, bg: "glass-card border border-white/5", icon_bg: "bg-white/5", text: "text-white", sub: "text-slate-400", accent: "#6366f1" },
                { title: "95% Match Rate", desc: "We keep improving your resume until it fits the job perfectly. Our AI adds the right keywords for each role with full context.", icon: <Target className="h-8 w-8 text-cyan-400" />, bg: "glass-card border border-white/5", icon_bg: "bg-white/5", text: "text-white", sub: "text-slate-400", accent: "#06b6d4" },
                { title: "Safe & Private", desc: "Your data is bank-level encrypted and never shared. Full control over your information, always.", icon: <ShieldCheck className="h-8 w-8 text-green-400" />, bg: "glass-card border border-white/5", icon_bg: "bg-white/5", text: "text-white", sub: "text-slate-400", accent: "#4ade80" },
                { title: "Clean, ATS-Ready Format", desc: "Formatted so ANY applicant tracking system can read your resume — no more getting filtered out for bad formatting.", icon: <FileText className="h-8 w-8 text-slate-300" />, bg: "glass-card border border-white/5", icon_bg: "bg-white/5", text: "text-white", sub: "text-slate-400", accent: "#cbd5e1" },
                { title: "Instant AI Analysis", desc: "Get your keyword match score and AI recommendations in under 30 seconds. No waiting, no guessing.", icon: <Zap className="h-8 w-8 text-amber-400" />, bg: "glass-card border border-white/5", icon_bg: "bg-white/5", text: "text-white", sub: "text-slate-400", accent: "#fbbf24" },
                { title: "Pay As You Go", desc: "Start with 4 free scans. After that, $1 per scan. No subscription trap. Only pay when you need it.", icon: <Coins className="h-8 w-8 text-indigo-400" />, bg: "glass-card border border-white/5", icon_bg: "bg-white/5", text: "text-white", sub: "text-slate-400", accent: "#6366f1" }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ rotateX: -5, rotateY: 5, z: 40, scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                  className={`${card.bg} rounded-[2.5rem] p-10 flex flex-col gap-6 cursor-pointer`}
                  style={{ transformStyle: 'preserve-3d', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' } as any}
                >
                  <div className={`${card.icon_bg} p-4 rounded-2xl inline-flex shadow-lg w-fit`} style={{ boxShadow: `0 8px 30px ${card.accent}30` }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-black tracking-tight mb-2 ${card.text}`}>{card.title}</h3>
                    <p className={`text-sm leading-relaxed ${card.sub}`}>{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
        <section className="py-32 px-6 lg:px-12 relative border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-600/6 rounded-full blur-[80px]" />
          </div>

          <div className="max-w-[1400px] mx-auto relative z-10">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                Real Stories
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                They Got <br /><span className="text-gradient-purple not-italic">Hired.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                Join thousands of job seekers who landed their dream jobs using HireReady.
              </motion.p>

              {/* Overall rating bar */}
              <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mt-8">
                <Stars />
                <span className="text-white font-black text-lg">5.0</span>
                <span className="text-slate-600 text-sm">/ 5 · based on 3 reviews</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} t={t} delay={i * 0.1} />
              ))}
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mt-16"
            >
              <Link href="/auth/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-2xl active:scale-95 group">
                Join Them Today <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-slate-600 text-xs mt-4 font-medium">First 4 analyses for $1 · No subscription</p>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════ FAQ ═══════════════════ */}
        <section className="py-32 px-6 lg:px-12 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <HelpCircle className="h-3 w-3" />
                Common Questions
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                Got <span className="text-gradient-purple not-italic">Questions?</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
                Everything you need to know about HireReady.
              </motion.p>
            </motion.div>
            <div className="space-y-3">
              {faqData.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CONTACT ═══════════════════ */}
        <section className="py-32 px-6 lg:px-12 border-t border-white/5 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-[80px]" />
          </div>
          <div className="max-w-2xl mx-auto relative z-10">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <Mail className="h-3 w-3" />
                Get In Touch
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                Contact <span className="text-gradient-purple not-italic">Us.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-xl text-slate-400 mt-6 max-w-xl mx-auto leading-relaxed">
                Have a question? We're here to help. Send us a message and we'll respond within 24 hours.
              </motion.p>
            </motion.div>

            {contactSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card rounded-[3rem] p-16 text-center border border-green-500/20">
                <div className="bg-green-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Message Sent!</h3>
                <p className="text-slate-400 text-lg">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                onSubmit={handleContactSubmit}
                className="glass-card rounded-[3rem] p-12 border border-white/8 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: 'Your Name', val: contactName, set: setContactName, placeholder: 'John Smith', type: 'text', icon: <User className="h-4 w-4 text-slate-600" /> },
                    { label: 'Email Address', val: contactEmail, set: setContactEmail, placeholder: 'you@example.com', type: 'email', icon: <Mail className="h-4 w-4 text-slate-600" /> }
                  ].map((f) => (
                    <div key={f.label} className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">{f.label}</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2">{f.icon}</span>
                        <input type={f.type} required value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                          className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white text-sm font-medium outline-none focus:border-indigo-500/40 transition-all placeholder:text-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Your Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-5 h-4 w-4 text-slate-600" />
                    <textarea required value={contactMessage} onChange={e => setContactMessage(e.target.value)}
                      placeholder="Tell us how we can help..." rows={5}
                      className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white text-sm font-medium outline-none focus:border-indigo-500/40 transition-all resize-none placeholder:text-slate-800" />
                  </div>
                </div>
                <button type="submit" className="relative w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)] active:scale-95 flex items-center justify-center gap-3 overflow-hidden group">
                  <span className="absolute inset-0 shimmer" />
                  <Mail className="h-4 w-4" />
                  Send Message
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            )}
          </div>
        </section>

        {/* ═══════════════════ FINAL CTA BAND ═══════════════════ */}
        <section className="py-24 px-6 relative overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none" />
          <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic mb-8">
                Ready to <span className="text-gradient-purple not-italic">Get Hired?</span>
              </h2>
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                <span className="text-amber-400 font-black block mb-2 tracking-widest uppercase text-sm">🚀 Launch Special</span>
                For the first 100 users: Get 4 lifetime resume tokens for just $1. Normally $1 per resume scan. Claim your tokens before the launch offer ends!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/login" className="relative group px-12 py-6 bg-amber-400 text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-amber-300 hover:text-black transition-all shadow-[0_0_60px_rgba(251,191,36,0.2)] active:scale-95 flex items-center gap-3 overflow-hidden">
                  Claim Launch Special ($1) <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-3 text-slate-500 text-sm">
                  <Check className="h-4 w-4 text-green-500" /> 4 Lifetime Tokens · No subscription
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ═══════════════════ UPSELL MODAL ═══════════════════ */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setShowUpsell(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-[600px] glass-card rounded-[3rem] p-14 border border-white/10 border-beam overflow-hidden"
            >
              <div className="text-center relative z-10">
                <div className="space-y-4 mb-10">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400">Results Ready</p>
                  <div className="relative inline-block">
                    <p className="text-[120px] font-black text-white leading-none tracking-tighter">{teaserScore}<span className="text-indigo-600 text-5xl">%</span></p>
                    <div className="absolute -inset-4 bg-indigo-600/10 rounded-full blur-2xl -z-10" />
                  </div>
                  <div className="h-2 w-48 bg-white/5 rounded-full mx-auto overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${teaserScore}%` }} transition={{ duration: 1, delay: 0.3, ease: "easeOut" }} className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full" />
                  </div>
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Your Resume Score</h2>
                <p className="text-slate-400 mb-10 leading-relaxed max-w-sm mx-auto">
                  We found areas you can improve to better match this job. Sign in to see your full results and get an optimized resume.
                </p>
                <div className="space-y-3">
                  <Link href="/auth/login" className="relative group w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-[0_0_40px_rgba(99,102,241,0.4)] active:scale-95 overflow-hidden">
                    <span className="absolute inset-0 shimmer" />
                    <Sparkles className="h-4 w-4" />
                    Sign In to See Full Results
                  </Link>
                  <button onClick={() => { setShowUpsell(false); router.push('/auth/login'); }} className="w-full py-3.5 text-slate-600 font-black text-[9px] uppercase tracking-[0.4em] hover:text-white transition-colors">
                    Skip for Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
