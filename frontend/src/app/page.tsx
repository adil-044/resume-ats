'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, Sparkles, ArrowRight, Loader2, 
  ShieldCheck, Zap, Bot, Target, X, CheckCircle2, Lock,
  Globe, LayoutGrid, BrainCircuit, Rocket, MousePointer2,
  Fingerprint, Command, Activity, Terminal, ChevronRight, BarChart3,
  HelpCircle, ChevronDown, Mail, User, MessageSquare, Coins
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Scene3D from '@/components/Scene3D';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import { Spotlight } from '@/components/ui/Spotlight';
import { Particles } from '@/components/ui/Particles';
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import { analyzeResume } from '@/lib/api';
import { useResumeStore } from '@/store/useResumeStore';
import { Variants } from 'framer-motion';

const kineticContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  }
};

const kineticItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } }
};

const faqData = [
  {
    question: "How does the resume scanner work?",
    answer: "You upload your resume and paste a job description. Our AI reads both and gives you a match score showing how well your resume fits the job. It also tells you which keywords are missing and how to improve."
  },
  {
    question: "How much does it cost?",
    answer: "Your first 4 resume analyses cost just $1 total — that's a great way to try everything out. After that, it's $1 per analysis, pay as you go. No subscriptions, no hidden fees."
  },
  {
    question: "What file types can I upload?",
    answer: "We support PDF and DOCX (Microsoft Word) files. PDF is recommended for best results."
  },
  {
    question: "Is my resume data safe?",
    answer: "Yes. Your data is encrypted and stored securely. We never share or sell your personal information. You can delete your data at any time."
  },
  {
    question: "How do I get the best match score?",
    answer: "After scanning, we show you which keywords are missing from your resume compared to the job description. Use our AI rewrite tool to automatically add those keywords in a natural way."
  },
  {
    question: "What are credits and how do I buy them?",
    answer: "Credits are used to run resume analyses. 1 credit = 1 analysis. Your first 4 analyses are bundled for $1. After that, you buy credits at $1 each from your dashboard whenever you need them."
  },
  {
    question: "Do I need to create an account?",
    answer: "You can try a free scan without an account. To save your results and access the full optimized resume, you'll need to create a free account."
  },
  {
    question: "Can I use this for any job type?",
    answer: "Yes! HireReady works for any industry and job level — from entry-level to executive positions. Just paste the job description and we'll tailor the analysis to that specific role."
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      style={{ perspective: 1000 }}
      whileHover={{ rotateX: -2, rotateY: 2, z: 20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="rounded-[2rem] overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className={`bg-white border border-slate-100 shadow-lg transition-all duration-500 rounded-[2rem] ${open ? 'shadow-xl shadow-indigo-100' : 'hover:shadow-xl hover:shadow-indigo-50'}`}>
        <div className="flex items-center justify-between p-8">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-2 rounded-xl">
              <HelpCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-lg font-bold text-slate-900">{question}</p>
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
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
              <div className="px-8 pb-8 text-slate-600 leading-relaxed text-base border-t border-slate-100 pt-6 ml-[64px]">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

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
    } catch (error) {
      console.error(error);
      alert('Analysis failed. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="min-h-screen bg-black selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      <div className="fixed inset-0 noise-overlay pointer-events-none z-50 opacity-[0.02]" />
      <Navbar />
      
      <main className="relative">
        {/* 3D Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center px-6 text-center">
          <Scene3D />
          
          <motion.div
            variants={kineticContainer}
            initial="hidden"
            animate="show"
            className="max-w-5xl z-10"
          >
            <motion.div variants={kineticItem} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-10 backdrop-blur-md">
              <Zap className="h-3 w-3" />
              <span>AI-Powered Resume Optimizer</span>
            </motion.div>
            
            <motion.h1 variants={kineticItem} className="text-6xl md:text-8xl lg:text-[9rem] font-black text-white leading-[0.85] tracking-tighter mb-10 uppercase italic">
              Win the <br />
              <span className="text-kinetic not-italic underline decoration-indigo-600 decoration-4 underline-offset-[12px] md:underline-offset-[20px]">Algorithm.</span>
            </motion.h1>
            
            <motion.p variants={kineticItem} className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              Beat job application filters with our AI that rewrites your resume to match each job posting — giving you a{' '}
              <span className="text-white font-bold">95%+ match score.</span>
            </motion.p>

            <motion.div variants={kineticItem} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/login" className="px-10 py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95">
                Go to Dashboard
              </Link>
              <a href="#analyzer" className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                Try It Free
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-slate-600"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll Down</span>
            <div className="w-px h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
          </motion.div>
        </section>

        {/* Live Analyzer Section */}
        <section id="analyzer" className="py-32 px-6 lg:px-12 relative border-t border-white/5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none italic">
                  Instant <br />
                  <span className="text-indigo-500">Validation.</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-xl">
                  Upload your resume and paste a job description. We'll instantly show you how well your resume matches the job.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { icon: <Zap className="h-5 w-5 text-amber-500" />, label: "Fast Scan", desc: "Results in seconds." },
                    { icon: <ShieldCheck className="h-5 w-5 text-green-500" />, label: "Secure & Private", desc: "AES-256 encrypted." }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex items-center gap-3 text-white font-black text-[10px] uppercase tracking-widest">
                        {item.icon} {item.label}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold tracking-tight uppercase leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="glass-executive p-10 rounded-[3rem] border-white/10 shadow-[0_0_80px_rgba(99,102,241,0.1)] border-beam"
              >
                <div className="space-y-8 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase italic leading-none">Resume Checker</h3>
                      <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Upload & Analyze</p>
                    </div>
                    <FileText className="h-5 w-5 text-indigo-500/50" />
                  </div>

                  <div className="space-y-5">
                    <div className="relative border-2 border-dashed border-white/5 rounded-[2rem] p-16 text-center group/drop transition-all duration-700 hover:border-indigo-500/30 hover:bg-indigo-500/5 cursor-pointer bg-black/40">
                      <input 
                        type="file" 
                        onChange={(e) => setLocalFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      />
                      {localFile ? (
                        <div className="flex flex-col items-center">
                          <div className="bg-indigo-600 p-5 rounded-2xl mb-4 shadow-2xl">
                            <FileText className="h-8 w-8 text-white" />
                          </div>
                          <p className="text-white font-black text-sm truncate max-w-full px-4 italic">{localFile.name}</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="bg-white/5 p-6 rounded-2xl mb-5 border border-white/10 group-hover/drop:bg-indigo-600 transition-all duration-700">
                            <Upload className="h-8 w-8 text-white/20 group-hover/drop:text-white" />
                          </div>
                          <p className="text-white font-black text-lg tracking-tight uppercase italic">Upload Your Resume</p>
                          <p className="text-slate-600 text-[9px] mt-2 font-black uppercase tracking-[0.2em]">PDF / DOCX Required</p>
                        </div>
                      )}
                    </div>

                    <textarea 
                      value={localJD}
                      onChange={(e) => setLocalJD(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="w-full h-28 bg-black/60 border-2 border-white/5 rounded-[2rem] p-6 outline-none focus:border-indigo-500/50 transition-all text-white text-sm font-medium resize-none placeholder:text-slate-800 shadow-inner"
                    />

                    <button 
                      onClick={handleInitialScan}
                      disabled={isAnalyzing || !localFile || !localJD}
                      className={`w-full py-6 rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 transition-all duration-700 shadow-2xl relative overflow-hidden group active:scale-[0.98] uppercase tracking-tighter italic ${
                        !localFile || !localJD || isAnalyzing 
                        ? 'bg-white/5 text-slate-800 cursor-not-allowed border border-white/5 shadow-none'
                        : 'bg-indigo-600 text-white hover:bg-white hover:text-black'
                      }`}
                    >
                      {isAnalyzing ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="tracking-tighter italic">Analyzing... {Math.round(progress)}%</span>
                        </div>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                          <span>Get Match Score</span>
                          <ArrowRight className="h-5 w-5 opacity-30 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Grid – Executive Systems with 3D cards */}
        <section className="py-48 bg-white relative selection:bg-black selection:text-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="text-7xl lg:text-[8rem] font-black text-slate-950 tracking-tighter uppercase leading-[0.8] mb-32 italic">
              Executive <br />
              <span className="text-indigo-600 not-italic">Systems.</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Duplicate Removal",
                  description: "Automatically cleans up repeated information and formatting issues — so your resume looks polished every time.",
                  icon: <Bot className="h-16 w-16 text-indigo-600" />,
                  bg: "bg-slate-50",
                  iconBg: "bg-white"
                },
                {
                  title: "95% Match Rate",
                  description: "We keep improving your resume until it fits the job perfectly. Our AI finds and adds the right keywords for each role.",
                  icon: <Target className="h-16 w-16 text-white" />,
                  bg: "bg-slate-900",
                  iconBg: "bg-white/10",
                  dark: true
                },
                {
                  title: "Safe & Private",
                  description: "Your data is encrypted and never shared. We protect your personal information with bank-level security.",
                  icon: <ShieldCheck className="h-16 w-16 text-white" />,
                  bg: "bg-indigo-600",
                  iconBg: "bg-white/20",
                  dark: true
                },
                {
                  title: "Clean, Readable Format",
                  description: "Your resume is formatted in a way that any applicant tracking system can read it — no more getting filtered out for bad formatting.",
                  icon: <FileText className="h-16 w-16 text-slate-400" />,
                  bg: "bg-slate-50",
                  iconBg: "bg-white"
                },
                {
                  title: "Instant Results",
                  description: "Get your match score and keyword analysis in seconds. No waiting, no complicated setup.",
                  icon: <Zap className="h-16 w-16 text-amber-500" />,
                  bg: "bg-amber-50",
                  iconBg: "bg-white"
                },
                {
                  title: "Pay As You Go",
                  description: "Try it with $1 for your first 4 analyses. After that, just $1 per resume — no subscription required.",
                  icon: <Coins className="h-16 w-16 text-indigo-600" />,
                  bg: "bg-indigo-50",
                  iconBg: "bg-white"
                }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  whileHover={{ 
                    rotateX: -6, 
                    rotateY: 6, 
                    z: 40,
                    scale: 1.04
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`${card.bg} rounded-[2.5rem] p-12 border border-slate-100 shadow-xl cursor-pointer flex flex-col items-start gap-6 text-left`}
                  style={{ 
                    perspective: 1200,
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)'
                  } as any}
                >
                  <div className={`${card.iconBg} p-5 rounded-2xl shadow-lg`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight mb-3 ${card.dark ? 'text-white' : 'text-slate-900'}`}>{card.title}</h3>
                    <p className={`leading-relaxed text-base ${card.dark ? 'text-white/70' : 'text-slate-500'}`}>{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-6 lg:px-12 bg-slate-50 border-t border-slate-100">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <HelpCircle className="h-3 w-3" />
                <span>Common Questions</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] italic">
                Got <br /><span className="text-indigo-600 not-italic">Questions?</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium mt-6 max-w-xl mx-auto leading-relaxed">
                Everything you need to know about HireReady and how it works.
              </p>
            </div>
            <div className="space-y-4">
              {faqData.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="py-32 px-6 lg:px-12 bg-black border-t border-white/5">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mb-8">
                <Mail className="h-3 w-3" />
                <span>Get In Touch</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                Contact <br /><span className="text-indigo-500 not-italic">Us.</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium mt-6 max-w-xl mx-auto leading-relaxed">
                Have a question or need help? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>
            </div>

            {contactSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-executive rounded-[3rem] p-16 text-center border border-white/10"
              >
                <div className="bg-green-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Message Sent!</h3>
                <p className="text-slate-400 text-lg">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                onSubmit={handleContactSubmit}
                className="glass-executive rounded-[3rem] p-12 border border-white/10 space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Smith"
                        className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white text-sm font-medium outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white text-sm font-medium outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-800"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Your Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-5 top-5 h-4 w-4 text-slate-600" />
                    <textarea
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="w-full bg-black/60 border-2 border-white/5 rounded-2xl py-4 pl-12 pr-5 text-white text-sm font-medium outline-none focus:border-indigo-500/50 transition-all resize-none placeholder:text-slate-800"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  <Mail className="h-4 w-4" />
                  Send Message
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.form>
            )}
          </div>
        </section>
      </main>

      {/* Conversion Modal */}
      <AnimatePresence>
        {showUpsell && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
              onClick={() => setShowUpsell(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[650px] glass-executive rounded-[4rem] p-16 shadow-[0_0_100px_rgba(99,102,241,0.2)] overflow-hidden border border-white/10 border-beam"
            >
              <div className="text-center relative z-10">
                <div className="space-y-4 mb-12">
                  <p className="text-[9px] font-black uppercase tracking-[0.5em] text-indigo-400 italic">Results Ready</p>
                  <div className="text-9xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
                    {teaserScore}<span className="text-indigo-600 text-5xl">%</span>
                  </div>
                  <div className="h-1.5 w-40 bg-white/5 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${teaserScore}%` }} />
                  </div>
                </div>

                <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase leading-tight italic">Your Resume Score</h2>
                <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed max-w-md mx-auto">
                  We found areas you can improve to better match this job. Sign in to see your full results and get an optimized resume.
                </p>
                <div className="space-y-6">
                  <Link href="/auth/login" className="w-full bg-white text-black py-6 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 group shadow-2xl">
                    Sign In to See Full Results <Lock className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-all" />
                  </Link>
                  <button onClick={() => { setShowUpsell(false); router.push('/auth/login'); }} className="w-full py-4 text-slate-600 font-black text-[9px] uppercase tracking-[0.4em] hover:text-white transition-colors">
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
