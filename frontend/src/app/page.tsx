'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { 
  Upload, FileText, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, Lock,
  BrainCircuit, Rocket, Fingerprint, Activity, Terminal,
  HelpCircle, ChevronDown, Mail, User, MessageSquare, Coins,
  CheckCircle2, Star, Quote, TrendingUp, Users, Award, Sparkles,
  Play, ChevronRight, BarChart2, Search, Check, Briefcase, X
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
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};
const kineticItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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
        <Star key={i} className="h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
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
    color: "#6C63FF",
    score: 94,
    text: "I was struggling to get callbacks. After using HireReady to tailor my resume, the difference was night and day. It genuinely helped me understand what I was missing.",
    tags: ["Tech", "FAANG"]
  },
  {
    name: "Priya Sharma",
    title: "Product Manager",
    company: "Hired at Stripe",
    avatar: "PS",
    color: "#6C63FF",
    score: 91,
    text: "The AI suggestions were so specific — it knew exactly what hiring managers at fintech companies look for. I finally started getting the interviews I wanted.",
    tags: ["Product", "FinTech"]
  },
  {
    name: "Alex Thompson",
    title: "Marketing Manager",
    company: "Hired at Shopify",
    avatar: "AT",
    color: "#38B2AC",
    score: 89,
    text: "Used to spend hours tweaking my resume for every job. The job description analysis is brilliant and saves me so much time while applying.",
    tags: ["Marketing", "eCommerce"]
  }
];

/* ─── Core Features Marquee ─── */
const scrollingFeatures = [
  "AI Keyword Optimization", "ATS Bypass Engine", "Semantic Profile Diffing", 
  "Format-Perfect PDF Export", "Gemini 2.0 Flash Powered", "Military-Grade Encryption",
  "100% Machine Readable", "Targeted Gap Analysis", "Real-time Scoring"
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
  { question: "How much does it cost?", answer: "We offer two simple plans: $2/month if you bring your own API key (Gemini), or $7/month for unlimited AI generations with zero setup. Cancel anytime — no contracts, no hidden fees." },
  { question: "What if I upload my resume and it doesn't help?", answer: "If your resume is already perfectly optimized for the job, our system will tell you that you have a 95%+ match score and you're good to apply! You only pay per scan, so there are no wasted subscriptions if you don't need us right now." },
  { question: "Is my resume data safe?", answer: "Yes. Your data is encrypted and stored securely. We never share or sell your personal information. You can delete your data at any time." }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`rounded-[2rem] overflow-hidden cursor-pointer bg-[#E0E5EC] shadow-extruded transition-all duration-300 ${open ? 'shadow-inset-sm' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className={`p-3 rounded-xl shadow-inset-sm transition-all duration-300 ${open ? 'bg-[#6C63FF] shadow-none' : ''}`}>
              <HelpCircle className={`h-4 w-4 ${open ? 'text-white' : 'text-[#6C63FF]'}`} />
            </div>
            <p className="text-base font-display font-bold text-[#3D4852]">{question}</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-5 w-5 text-[#6B7280] flex-shrink-0 ml-4" />
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
              <div className="mt-6 pl-[64px] text-[#6B7280] leading-relaxed text-sm font-body">
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
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="bg-[#E0E5EC] rounded-[32px] p-8 flex flex-col gap-6 shadow-extruded border border-white/20 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <Stars />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full shadow-inset-sm text-[10px] font-display font-black">
          <span style={{ color: t.color }}>{t.score}%</span>
          <span className="text-[#6B7280]">MATCH</span>
        </div>
      </div>

      <div className="relative">
        <Quote className="absolute -top-1 -left-1 h-6 w-6 text-[#6C63FF]/10" />
        <p className="text-[#3D4852] leading-relaxed text-sm font-body pl-6 italic">"{t.text}"</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {t.tags.map(tag => (
          <span key={tag} className="text-[9px] font-display font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-inset-sm text-[#6B7280]">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-[#A3B1C6]/20 mt-auto">
        <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xs font-display font-black flex-shrink-0 shadow-lg"
          style={{ background: t.color }}>
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-display font-extrabold text-[#3D4852]">{t.name}</p>
          <p className="text-[10px] font-display font-bold text-[#6B7280] uppercase tracking-widest">{t.title} · <span className="text-[#38B2AC]">{t.company}</span></p>
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

  const marqueeFeatures = [...scrollingFeatures, ...scrollingFeatures, ...scrollingFeatures];

  return (
    <div className="min-h-screen bg-[#E0E5EC] font-body selection:bg-[#6C63FF]/20 selection:text-[#6C63FF] overflow-x-hidden">
      <Navbar />

      <main className="relative">
        {/* HERO */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden py-32">
          {/* Ambient shapes */}
          <div className="absolute top-[10%] left-[-5%] w-96 h-96 rounded-full shadow-extruded opacity-40 pointer-events-none" />
          <div className="absolute bottom-[15%] right-[-5%] w-[500px] h-[500px] rounded-full shadow-inset opacity-30 pointer-events-none" />

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl z-10 relative"
          >
            <motion.div variants={kineticItem} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-12">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C63FF] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C63FF]"></span>
              </span>
              AI-Powered Career Engine
            </motion.div>

            <motion.h1 variants={kineticItem} className="text-6xl md:text-8xl lg:text-[10rem] font-display font-extrabold text-[#3D4852] leading-[0.8] tracking-tighter mb-10 uppercase italic">
              Stop Getting <br />
              <span className="text-[#6C63FF] not-italic">Ghosted by ATS.</span>
            </motion.h1>

            <motion.p variants={kineticItem} className="text-xl md:text-2xl text-[#6B7280] max-w-2xl mx-auto leading-relaxed mb-12 font-body font-medium">
              Your resume gets rejected by robots before a human ever sees it. Our AI rewrites it to score{' '}
              <span className="text-[#3D4852] font-black underline decoration-[#6C63FF]/30">95%+ ATS match</span> — so you get interviews, not silence.
            </motion.p>

            <motion.div variants={kineticItem} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/login" className="px-12 py-6 bg-[#6C63FF] text-white rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[8px_8px_20px_rgba(108,99,255,0.3)] active:scale-95 flex items-center gap-3 justify-center">
                <Rocket className="h-5 w-5" />
                Optimize Your Resume Free
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Link>
              <Link href="/pricing" className="px-12 py-6 bg-[#E0E5EC] text-[#3D4852] rounded-[2rem] font-display font-black text-sm uppercase tracking-widest shadow-extruded hover:shadow-inset transition-all flex items-center justify-center">
                See Plans from $2/mo
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-[#6B7280]"
          >
            <span className="text-[9px] font-display font-black uppercase tracking-[0.4em]">Scroll Explore</span>
            <div className="w-1 h-12 bg-[#6C63FF]/20 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ y: [0, 48, 0] }} 
                 transition={{ duration: 2, repeat: Infinity }}
                 className="w-full h-1/3 bg-[#6C63FF]" 
               />
            </div>
          </motion.div>
        </section>

        {/* STATS BAR */}
        <section className="py-20 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-4 gap-12 p-12 rounded-[40px] shadow-inset bg-[#E0E5EC]"
            >
              {[
                { value: 30, suffix: '+', label: 'Optimized', color: 'text-[#6C63FF]' },
                { value: 95,    suffix: '%', label: 'Match Rate', color: 'text-[#38B2AC]' },
                { value: 3,  suffix: '', label: 'Reviews',     color: 'text-[#fbbf24]' },
                { value: 2,     suffix: '$', label: 'Starting At',     color: 'text-[#3D4852]', prefix: true },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="flex flex-col items-center gap-2">
                  <p className={`text-5xl font-display font-extrabold tracking-tight ${s.color}`}>
                    {s.prefix && '$'}<Counter to={s.value} suffix={s.prefix ? '' : s.suffix} />
                  </p>
                  <p className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-[0.3em]">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-32 px-6 lg:px-12 relative">
          <div className="max-w-[1200px] mx-auto relative z-10">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-24"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <Activity className="h-4 w-4" />
                Workflow Physics
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-8xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                The Protocol.
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {howItWorks.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="bg-[#E0E5EC] rounded-[32px] p-10 shadow-extruded group relative flex flex-col items-start text-left border border-white/20"
                >
                  <span className="absolute top-6 right-8 text-6xl font-display font-black text-[#A3B1C6]/20 select-none">{step.step}</span>
                  <div className="p-5 rounded-2xl shadow-inset-deep text-[#6C63FF] mb-8">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-display font-black text-[#3D4852] mb-4 leading-tight">{step.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed font-body">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* LIVE ANALYZER */}
        <section id="analyzer" className="py-32 px-6 lg:px-12 relative overflow-hidden">
           <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] rounded-full shadow-inset opacity-20 pointer-events-none" />
           <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5">
              <motion.div
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={stagger}
                className="space-y-10"
              >
                <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#38B2AC] text-[10px] font-display font-black uppercase tracking-[0.4em]">
                  <Zap className="h-4 w-4" />
                  Live Optimization Scan
                </motion.div>
                <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-none italic">
                  Instant<br /><span className="text-[#6C63FF]">Results.</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-xl text-[#6B7280] leading-relaxed max-w-xl font-body">
                  Experience the depth of our AI. Upload your resume and paste a job description to get a tactile match analysis in seconds.
                </motion.p>
                <motion.div variants={fadeUp} className="grid grid-cols-2 gap-8">
                  {[
                    { icon: <Zap className="h-4 w-4 text-[#fbbf24]" />, label: 'Fast Scan' },
                    { icon: <ShieldCheck className="h-4 w-4 text-[#38B2AC]" />, label: 'Secure AES' },
                    { icon: <BrainCircuit className="h-4 w-4 text-[#6C63FF]" />, label: 'AI Engine' },
                    { icon: <Award className="h-4 w-4 text-[#3D4852]" />, label: '95% match' }
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="p-3 rounded-xl shadow-inset-sm">{f.icon}</div>
                      <p className="text-[#3D4852] font-display font-black text-[10px] uppercase tracking-widest">{f.label}</p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-[#E0E5EC] p-12 rounded-[40px] shadow-extruded border border-white/30"
              >
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-center pb-6 border-b border-[#A3B1C6]/30">
                    <h3 className="text-2xl font-display font-black text-[#3D4852] tracking-tight uppercase italic">Resume Checker</h3>
                    <div className="h-12 w-12 rounded-2xl shadow-inset-sm flex items-center justify-center">
                      <FileText className="h-6 w-6 text-[#6C63FF]" />
                    </div>
                  </div>

                  <div className="relative h-64 rounded-[32px] shadow-inset-deep flex flex-col items-center justify-center p-10 text-center group transition-all duration-500 hover:shadow-inset overflow-hidden">
                    <input type="file" onChange={(e) => setLocalFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    {localFile ? (
                      <div className="flex flex-col items-center">
                        <div className="bg-[#6C63FF] p-5 rounded-2xl mb-4 shadow-lg text-white">
                          <FileText className="h-8 w-8" />
                        </div>
                        <p className="text-[#3D4852] font-display font-black text-sm truncate max-w-[300px]">{localFile.name}</p>
                        <span className="mt-2 text-[#38B2AC] text-[10px] font-display font-black uppercase tracking-widest">Ready for analysis ✓</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="p-6 rounded-2xl shadow-extruded-sm mb-6 text-[#6B7280] group-hover:text-[#6C63FF] transition-colors">
                          <Upload className="h-8 w-8" />
                        </div>
                        <p className="text-[#3D4852] font-display font-extrabold text-lg">Drop your resume here</p>
                        <p className="text-[#6B7280] text-[10px] mt-2 font-display font-bold uppercase tracking-widest">PDF or DOCX accepted</p>
                      </div>
                    )}
                  </div>

                  <div className="p-2 bg-[#E0E5EC] rounded-[2rem] shadow-inset">
                    <textarea
                      value={localJD}
                      onChange={(e) => setLocalJD(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full h-32 bg-transparent p-6 outline-none text-[#3D4852] text-sm font-medium font-body resize-none placeholder:text-[#A3B1C6]"
                    />
                  </div>

                  <button
                    onClick={handleInitialScan}
                    disabled={isAnalyzing || !localFile || !localJD}
                    className={`w-full py-6 rounded-2xl font-display font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-500 active:scale-[0.98] ${
                      !localFile || !localJD || isAnalyzing
                        ? 'bg-[#E0E5EC] text-[#A3B1C6] shadow-inset-sm cursor-not-allowed'
                        : 'bg-[#6C63FF] text-white shadow-[6px_6px_15px_rgba(108,99,255,0.3)] hover:bg-[#8B84FF]'
                    }`}
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /><span>Scanning Profile... {Math.round(progress)}%</span></>
                    ) : (
                      <><Zap className="h-5 w-5" /><span>Analyze Match Score</span><ChevronRight className="h-5 w-5 opacity-50" /></>
                    )}
                  </button>
                  <p className="text-center text-[#6B7280] text-[10px] font-display font-bold uppercase tracking-widest">Plans from $2/mo · Try your first scan free</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-32 px-6 lg:px-12 relative">
          <div className="max-w-[1400px] mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-24"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <Sparkles className="h-4 w-4" />
                Advanced Systems
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-6xl md:text-8xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                The Architect<br /><span className="text-[#6C63FF] not-italic">Toolkit.</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { title: "Bridge The Gap", desc: "Show exactly which skills are missing and incorporate them naturally into your bullet points.", icon: <BrainCircuit className="h-7 w-7" />, accent: "#6C63FF" },
                { title: "95% Match Rate", desc: "Optimize until you reach a perfect match floor for every specific role.", icon: <Target className="h-7 w-7" />, accent: "#38B2AC" },
                { title: "AI Cover Letters", desc: "Generate job-targeted cover letters from your resume in one tactile click.", icon: <Mail className="h-7 w-7" />, accent: "#fb7185" },
                { title: "Job Pipeline", desc: "Track every application from saved to offer in a physically organized dashboard.", icon: <Briefcase className="h-7 w-7" />, accent: "#4f46e5" },
                { title: "Safe & Private", desc: "Your data is bank-level encrypted and never shared. You own your profile.", icon: <ShieldCheck className="h-7 w-7" />, accent: "#4ade80" },
                { title: "ATS-Ready Format", desc: "Clean, machine-readable formatting that passes any ATS filter with ease.", icon: <FileText className="h-7 w-7" />, accent: "#A3B1C6" },
                { title: "Instant Analysis", desc: "Get keyword match scores and AI recommendations in under 30 seconds.", icon: <Zap className="h-7 w-7" />, accent: "#fbbf24" },
                { title: "Plans from $2/mo", desc: "Bring your own API key for $2/mo, or go unlimited at $7/mo. Cancel anytime.", icon: <Coins className="h-7 w-7" />, accent: "#6C63FF" }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  className="bg-[#E0E5EC] rounded-[32px] p-8 flex flex-col gap-6 shadow-extruded border border-white/20 transition-all duration-300"
                >
                  <div className="p-4 rounded-xl shadow-inset-sm w-fit" style={{ color: card.accent }}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-black text-[#3D4852] mb-2 tracking-tight">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-[#6B7280] font-body">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 px-6 lg:px-12 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto relative z-10">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#fbbf24] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <Star className="h-4 w-4 fill-[#fbbf24]" />
                User Validation
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-8xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                They Got <br /><span className="text-[#6C63FF] not-italic">Hired.</span>
              </motion.h2>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32 px-6 lg:px-12 relative border-t border-[#A3B1C6]/20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-20"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <HelpCircle className="h-4 w-4" />
                Knowledge Base
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-8xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                Common <span className="text-[#6C63FF] not-italic">Signals.</span>
              </motion.h2>
            </motion.div>
            <div className="space-y-6">
              {faqData.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="py-32 px-6 lg:px-12 relative border-t border-[#A3B1C6]/20">
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={stagger}
              className="text-center mb-16"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-6 py-2 rounded-full shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.4em] mb-8">
                <Mail className="h-4 w-4" />
                Connectivity
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-8xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic">
                Contact <span className="text-[#6C63FF] not-italic">Us.</span>
              </motion.h2>
            </motion.div>

            {contactSent ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#E0E5EC] rounded-[40px] shadow-inset p-16 text-center">
                <div className="bg-[#38B2AC] w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg text-white">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-display font-black text-[#3D4852] tracking-tight mb-4">Message Synchronized</h3>
                <p className="text-[#6B7280] text-lg font-body">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                onSubmit={handleContactSubmit}
                className="bg-[#E0E5EC] rounded-[40px] p-12 shadow-extruded border border-white/20 space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { label: 'Full Name', val: contactName, set: setContactName, placeholder: 'John Smith', type: 'text', icon: <User className="h-4 w-4" /> },
                    { label: 'Email', val: contactEmail, set: setContactEmail, placeholder: 'you@example.com', type: 'email', icon: <Mail className="h-4 w-4" /> }
                  ].map((f) => (
                    <div key={f.label} className="space-y-3">
                      <label className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest">{f.label}</label>
                      <div className="relative p-1 bg-[#E0E5EC] rounded-2xl shadow-inset">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3B1C6]">{f.icon}</span>
                        <input type={f.type} required value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                          className="w-full bg-transparent py-4 pl-12 pr-5 text-[#3D4852] text-sm font-medium font-body outline-none placeholder:text-[#A3B1C6]" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest">Your Message</label>
                  <div className="relative p-1 bg-[#E0E5EC] rounded-2xl shadow-inset">
                    <MessageSquare className="absolute left-5 top-5 h-4 w-4 text-[#A3B1C6]" />
                    <textarea required value={contactMessage} onChange={e => setContactMessage(e.target.value)}
                      placeholder="How can we help?" rows={5}
                      className="w-full bg-transparent py-4 pl-12 pr-5 text-[#3D4852] text-sm font-medium font-body outline-none resize-none placeholder:text-[#A3B1C6]" />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[6px_6px_15px_rgba(108,99,255,0.3)] active:scale-95 flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5" />
                  Send Transmission
                  <ArrowRight className="h-5 w-5 opacity-50" />
                </button>
              </motion.form>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-32 px-6 relative overflow-hidden bg-[#E0E5EC]">
           <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full shadow-extruded opacity-30 pointer-events-none" />
           <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="text-5xl md:text-8xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase leading-[0.8] italic mb-10">
                Ready to <span className="text-[#6C63FF] not-italic">Get Hired?</span>
              </h2>
              <p className="text-xl text-[#6B7280] mb-12 max-w-2xl mx-auto leading-relaxed font-body">
                Start optimizing your resume today. Plans from <strong className="text-[#3D4852]">$2/month</strong> — or go unlimited at <strong className="text-[#3D4852]">$7/month</strong> with zero setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/auth/login" className="px-12 py-6 bg-[#6C63FF] text-white rounded-[2rem] font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[8px_8px_20px_rgba(108,99,255,0.3)] active:scale-95 flex items-center gap-3">
                  Get Started Now <ArrowRight className="h-5 w-5 opacity-50" />
                </Link>
                <div className="flex items-center gap-3 text-[#6B7280] text-[10px] font-display font-black uppercase tracking-widest">
                  <div className="h-4 w-4 rounded-full bg-[#38B2AC] flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  Cancel Anytime · No Contracts
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* UPSELL MODAL */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-[#E0E5EC]/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl bg-[#E0E5EC] rounded-[40px] shadow-extruded p-12 text-center relative border border-white/20"
            >
              <button onClick={() => setShowUpsell(false)} className="absolute top-8 right-8 p-3 shadow-extruded-sm rounded-xl text-[#6B7280] hover:text-[#3D4852] transition-all">
                <X className="h-5 w-5" />
              </button>

              <div className="p-8 rounded-[32px] shadow-inset-deep inline-block mb-10">
                <div className="text-6xl font-display font-black text-[#6C63FF] leading-none">{teaserScore}</div>
                <div className="text-[10px] font-display font-black text-[#6B7280] uppercase tracking-widest mt-2">Match Score</div>
              </div>

              <h2 className="text-4xl font-display font-extrabold text-[#3D4852] tracking-tighter uppercase mb-6 leading-tight">
                Unlock Your <br />Full Profile Analysis
              </h2>
              <p className="text-[#6B7280] mb-10 font-body leading-relaxed">
                You've got a baseline. Now see exactly where the gaps are and let our AI optimize your resume for a <strong className="text-[#3D4852]">95%+ match.</strong>
              </p>

              <Link href="/auth/login" className="block w-full py-5 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest hover:bg-[#8B84FF] transition-all shadow-[6px_6px_15px_rgba(108,99,255,0.3)] active:scale-95">
                Start Optimizing Now
              </Link>
              <p className="text-[10px] font-display font-bold text-[#6B7280] mt-6 uppercase tracking-widest">Plans from $2/mo · Cancel anytime</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
