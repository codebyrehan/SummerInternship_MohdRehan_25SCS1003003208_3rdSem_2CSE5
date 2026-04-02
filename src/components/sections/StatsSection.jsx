import React, { useRef, useState, useEffect } from 'react';
import { Card, SectionHeading } from '../ui/PremiumUI';

const stats = [
  { value: 10000, suffix: '+', label: 'Resumes Built' },
  { value: 94, suffix: '%', label: 'ATS Pass Rate' },
  { value: 6, suffix: '', label: 'Premium Templates' },
  { value: 3, suffix: ' min', label: 'Average Build Time' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    quote: "QuickHire AI transformed my resume in minutes. I got 3 interview calls in the first week after using it.",
    initials: 'PS'
  },
  {
    name: 'Arjun Mehta',
    role: 'Product Manager @ Razorpay',
    quote: "The AI bullet enhancer is insane. It turned my bland job descriptions into compelling impact statements.",
    initials: 'AM'
  },
  {
    name: 'Sana Khan',
    role: 'UX Designer @ Flipkart',
    quote: "Got my portfolio live in under 5 minutes. The templates are gorgeous and completely ATS-safe.",
    initials: 'SK'
  }
];

function CountUpStat({ stat }) {
  const [count, setCount] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Use a polling approach that works with Lenis virtual scroll
    const checkVisibility = () => {
      if (!ref.current || triggered) return;
      const rect = ref.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
      if (inView) {
        setTriggered(true);
      }
    };

    // Poll on both real scroll and Lenis tick
    window.addEventListener('scroll', checkVisibility, { passive: true });
    // Also check on a timer for Lenis (which doesn't fire real scroll events always)
    const interval = setInterval(checkVisibility, 100);

    checkVisibility(); // check once on mount

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      clearInterval(interval);
    };
  }, [triggered]);

  useEffect(() => {
    if (!triggered) return;

    const duration = 2000;
    const startTime = performance.now();
    const target = stat.value;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [triggered, stat.value]);

  return (
    <Card hover={false} className="text-center py-10">
      <div ref={ref} className="text-5xl font-sora font-extrabold text-transparent bg-clip-text bg-gradient-primary mb-3">
        {count.toLocaleString()}{stat.suffix}
      </div>
      <p className="text-text-muted font-medium text-sm">{stat.label}</p>
    </Card>
  );
}

export default function StatsSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <CountUpStat key={i} stat={stat} />
          ))}
        </div>

        {/* Testimonials */}
        <SectionHeading title="Loved by Job Seekers" />
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={i} className="flex flex-col gap-4">
              <p className="text-text-muted leading-relaxed italic flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center font-sora font-bold text-white flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-bold font-sora text-sm">{t.name}</p>
                  <p className="text-text-muted text-xs">{t.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
