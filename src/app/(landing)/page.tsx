import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { StickyShowcase } from '@/components/landing/StickyShowcase';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { ScrollReveal } from '@/components/landing/ScrollReveal';

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <Hero />
      <ScrollReveal>
        <Features />
      </ScrollReveal>
      <StickyShowcase />
      <LandingFooter />
    </>
  );
}
