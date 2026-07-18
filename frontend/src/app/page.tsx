'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import HowItWorks from '@/components/landing/HowItWorks';
import AmbientScrub from '@/components/landing/AmbientScrub';
import Proof from '@/components/landing/Proof';
import Social from '@/components/landing/Social';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';

export default function Home() {
  return (
    <div className="bg-[#0C0C0B] text-[#F2EFE8] overflow-x-hidden landing-grain">
      <Navbar />
      <main className="relative z-[2]">
        <Hero />
        <Problem />
        <HowItWorks />
        <AmbientScrub />
        <Proof />
        <Social />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
