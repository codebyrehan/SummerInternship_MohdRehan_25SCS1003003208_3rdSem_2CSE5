import React, { useState, useEffect } from 'react';
import { SectionHeading, Button, Card } from '../ui/PremiumUI';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIEnhancerSection() {
  const [enhanced, setEnhanced] = useState(false);
  const [displayText, setDisplayText] = useState("Worked on a website project alongside backend team");
  const targetText = "Engineered a responsive SaaS platform serving 5K+ users, reducing page load time by 40% through code splitting.";

  const handleEnhance = () => {
    setEnhanced(true);
    setDisplayText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(targetText.substring(0, i + 1));
      i++;
      if (i >= targetText.length) clearInterval(interval);
    }, 20);
  };

  return (
    <section className="section-padding bg-background overflow-hidden relative">
      <SectionHeading title="Watch AI Transform Your Resume" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-8 justify-center">
        
        {/* Before Card */}
        <Card className={`flex-1 transition-all duration-500 w-full ${!enhanced ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'opacity-50 blur-[2px] grayscale'}`} hover={false}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-red-400 font-bold text-sm tracking-uppercase">Before</span>
            <span className="text-xs text-text-muted bg-white/5 py-1 px-2 rounded">Weak Bullet</span>
          </div>
          <p className="text-text-primary text-lg font-inter min-h-[80px]">
            Worked on a website project alongside backend team
          </p>
        </Card>

        {/* Enhance CTA / Arrow */}
        <div className="flex flex-col items-center">
          {!enhanced ? (
            <Button onClick={handleEnhance} className="!rounded-full w-16 h-16 !p-0 flex items-center justify-center animate-pulse">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
          ) : (
            <div className="w-16 h-16 flex items-center justify-center text-primary">
              <span className="text-2xl">✨</span>
            </div>
          )}
        </div>

        {/* After Card */}
        <Card className={`flex-1 transition-all duration-500 w-full ${enhanced ? 'border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)] bg-green-500/5' : 'opacity-30'}`} hover={false}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-green-400 font-bold text-sm tracking-uppercase">After (AI Enhanced)</span>
            {enhanced && <span className="text-xs text-green-400 bg-green-400/10 py-1 px-2 rounded animate-pulse">Optimum Impact</span>}
          </div>
          <p className="text-white text-lg font-inter min-h-[80px]">
            {enhanced ? displayText : ""}
            {enhanced && displayText.length < targetText.length && <span className="animate-ping border-r-2 border-white ml-1 h-5 inline-block" />}
          </p>
        </Card>
      </div>
{/* Reset button for demo purposes */}
      {enhanced && (
        <div className="text-center mt-8">
           <button onClick={() => {setEnhanced(false); setDisplayText("Worked on a website project alongside backend team");}} className="text-text-muted underline text-sm">Reset Demo</button>
        </div>
      )}
    </section>
  );
}
