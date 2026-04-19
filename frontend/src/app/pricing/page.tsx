'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Check, Zap, Coins, Calculator, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
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

        <div className="text-center space-y-6 mb-24 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#E0E5EC] shadow-extruded-sm text-[#6C63FF] text-[10px] font-display font-black uppercase tracking-[0.3em] mb-4"
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Pay As You Go</span>
          </motion.div>
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-[#3D4852] tracking-tighter leading-[1.1]">
            Simple, Tactile <br /><span className="text-[#6C63FF]">Pricing System.</span>
          </h1>
          <p className="text-xl text-[#6B7280] font-medium max-w-2xl mx-auto leading-relaxed">
            No subscriptions. No hidden fees. Experience premium AI optimization with a physical touch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto relative z-10">
          {/* Starter Pack / Launch Special */}
          <motion.div 
            whileHover={{ y: -8 }} 
            className="bg-[#E0E5EC] p-12 rounded-[32px] shadow-extruded flex flex-col h-full transition-all duration-500 relative overflow-hidden group border border-white/20"
          >
            <div className="absolute top-0 right-0 bg-[#38B2AC] text-white text-[9px] font-display font-black uppercase tracking-widest px-6 py-2 rounded-bl-3xl shadow-lg">Most Popular</div>
            
            <div className="mb-10 mt-2">
              <div className="inline-block p-4 rounded-2xl shadow-inset-deep mb-6">
                <Sparkles className="h-8 w-8 text-[#38B2AC]" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-[#38B2AC] block">First 100 Users Only</span>
              <h3 className="text-5xl font-display font-extrabold text-[#3D4852] mt-4">$1 <span className="text-sm font-bold text-[#6B7280]">/ 4 lifetime tokens</span></h3>
            </div>

            <p className="text-[#6B7280] mb-8 leading-relaxed font-body">
              Our initial launch special. Get your first 4 resume optimizations for the price of one. Limited to the first 100 users.
            </p>

            <ul className="space-y-5 mb-12 flex-1">
              {[
                "4 Credits Included",
                "AI Resume Optimization",
                "AI Cover Letter Generator",
                "Job Application Pipeline",
                "Format-Perfect PDF Export"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-[#3D4852]">
                  <div className="h-6 w-6 rounded-full shadow-inset-sm flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-[#38B2AC]" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/dashboard" className="w-full py-5 bg-[#E0E5EC] shadow-extruded hover:shadow-inset text-[#38B2AC] rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] text-center transition-all active:scale-95">Claim For $1</Link>
          </motion.div>

          {/* Flexible Pack */}
          <motion.div 
            whileHover={{ y: -8 }} 
            className="bg-[#E0E5EC] p-12 rounded-[32px] shadow-extruded flex flex-col h-full transition-all duration-500 relative overflow-hidden group border border-[#6C63FF]/10"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Zap className="h-48 w-48 text-[#6C63FF]" />
            </div>

            <div className="mb-8 relative z-10">
              <div className="inline-block p-4 rounded-2xl shadow-inset-deep mb-6">
                <TrendingUp className="h-8 w-8 text-[#6C63FF]" />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full shadow-inset-sm text-[#6C63FF] text-[9px] font-display font-black uppercase tracking-widest mb-4">Pay When You Want</div>
              <h3 className="text-3xl lg:text-4xl font-display font-extrabold text-[#3D4852] mt-2 leading-tight">
                "I don't mind paying <br />$1 for 1 resume"
              </h3>
              <span className="text-[11px] font-display font-black text-[#6B7280] block mt-3 uppercase tracking-widest">No Subscriptions required</span>
            </div>

            <p className="text-[#6B7280] mb-8 leading-relaxed relative z-10 text-sm font-body">
              Buy a token precisely when you need to land that interview. 1 token = 1 Resume or Cover Letter optimization.
            </p>

            <ul className="space-y-5 mb-12 flex-1 relative z-10">
              {[
                "1 Credit = 1 AI Task",
                "Job Application Pipeline Included",
                "Advanced Resume & Cover Letters",
                "History & Saved Files",
                "No Expiry on Credits"
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-4 text-sm font-bold text-[#3D4852]">
                  <div className="h-6 w-6 rounded-full shadow-inset-sm flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-[#6C63FF]" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/dashboard" className="w-full py-5 bg-[#6C63FF] text-white rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] text-center hover:bg-[#8B84FF] transition-all shadow-[8px_8px_16px_rgba(108,99,255,0.3),-8px_-8px_16px_rgba(255,255,255,0.3)] active:scale-95">Buy Tokens</Link>
          </motion.div>
        </div>

        {/* Enterprise/Coach section */}
        <div className="mt-32 max-w-3xl mx-auto text-center p-16 rounded-[40px] shadow-inset">
          <div className="p-6 rounded-full shadow-extruded-sm inline-block mb-8">
            <Calculator className="h-10 w-10 text-[#6B7280]" />
          </div>
          <h2 className="text-3xl font-display font-black text-[#3D4852] uppercase tracking-tight mb-6">Career Coaches & Universities</h2>
          <p className="text-[#6B7280] leading-relaxed mb-10 font-body text-lg">
            We offer specialized enterprise packages with bulk credits and custom branding for organizations helping multiple candidates land their dream roles.
          </p>
          <a href="mailto:sales@hireready.com" className="inline-flex py-5 px-10 bg-[#E0E5EC] shadow-extruded hover:shadow-inset text-[#3D4852] rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95">
            Contact Sales Team
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
