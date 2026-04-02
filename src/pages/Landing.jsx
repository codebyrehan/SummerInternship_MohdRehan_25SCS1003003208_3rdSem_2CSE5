import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ScrollProgressBar from '../components/ui/ScrollProgressBar';

// Lazy load heavy sections
const HeroSection = lazy(() => import('../components/sections/HeroSection'));
const HighlightsStrip = lazy(() => import('../components/sections/HighlightsStrip'));
const FeaturesSection = lazy(() => import('../components/sections/FeaturesSection'));
const HowItWorksSection = lazy(() => import('../components/sections/HowItWorksSection'));
const TemplatesSection = lazy(() => import('../components/sections/TemplatesSection'));
const AIEnhancerSection = lazy(() => import('../components/sections/AIEnhancerSection'));
const StatsSection = lazy(() => import('../components/sections/StatsSection'));
const FAQSection = lazy(() => import('../components/sections/FAQSection'));
const CTASection = lazy(() => import('../components/sections/CTASection'));

const SectionLoader = () => (
  <div className="w-full py-24 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

export default function Landing() {
  return (
    <motion.div
      className="min-h-screen bg-background text-text-primary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* SEO Meta - handled in index.html, but page title set here */}
      <ScrollProgressBar />
      <Navbar />

      <main>
        <Suspense fallback={<SectionLoader />}>
          <HeroSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <HighlightsStrip />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FeaturesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <HowItWorksSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TemplatesSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <AIEnhancerSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <StatsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CTASection />
        </Suspense>
      </main>

      <Footer />
    </motion.div>
  );
}
