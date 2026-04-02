import React, { useEffect, useRef } from 'react';
import { SectionHeading } from '../ui/PremiumUI';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "01", title: "Add Your Details", desc: "Fill in your info in plain English, no formatting needed." },
  { num: "02", title: "Choose a Template", desc: "Pick from 6 premium, ATS-optimized designs." },
  { num: "03", title: "Let AI Optimize", desc: "AI rewrites your bullet points and perfects your phrasing." },
  { num: "04", title: "Export or Publish", desc: "Download the PDF or share your live portfolio link." }
];

export default function HowItWorksSection() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const stepRefs = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Line drawing animation
    gsap.fromTo(lineRef.current, 
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: true
        }
      }
    );

    // Steps fade in stagger
    stepRefs.current.forEach((step, i) => {
      gsap.fromTo(step,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, []);

  return (
    <section id="how-it-works" className="section-padding bg-background relative overflow-hidden" ref={containerRef}>
      <SectionHeading title="From Zero to Hired in 4 Steps" />

      <div className="max-w-7xl mx-auto px-6 relative mt-24">
        {/* Background dotted line path */}
        <div className="hidden md:block absolute top-[40px] left-0 right-0 h-[2px] bg-white/5 border-t-2 border-dotted border-white/10 z-0"></div>
        {/* Active line drawn on scroll */}
        <div ref={lineRef} className="hidden md:block absolute top-[40px] left-0 right-0 h-[2px] bg-gradient-primary origin-left z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          {steps.map((step, i) => (
            <div key={i} ref={el => stepRefs.current[i] = el} className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center text-2xl font-sora font-bold text-white border-primary/40 shadow-glow-primary mb-6 bg-surface">
                {step.num}
              </div>
              <h3 className="text-xl font-bold font-sora text-white mb-3">{step.title}</h3>
              <p className="text-text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
