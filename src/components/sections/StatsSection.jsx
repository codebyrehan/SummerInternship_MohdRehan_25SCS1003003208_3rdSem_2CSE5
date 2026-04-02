import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Card, SectionHeading } from '../ui/PremiumUI';

gsap.registerPlugin(ScrollTrigger);

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

export default function StatsSection() {
  const statRefs = useRef([]);

  useEffect(() => {
    statRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = stats[i].value;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo({ val: 0 }, 
            { val: target, duration: 2.5, ease: 'power2.out',
              onUpdate: function() {
                el.textContent = Math.round(this.targets()[0].val).toLocaleString() + stats[i].suffix;
              }
            }
          );
        }
      });
    });
  }, []);

  return (
    <section className="section-padding bg-surface">
      {/* Stats Row */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <Card key={i} hover={false} className="text-center py-10">
              <div
                ref={el => statRefs.current[i] = el}
                className="text-5xl font-sora font-extrabold text-transparent bg-clip-text bg-gradient-primary mb-3"
              >
                0{stat.suffix}
              </div>
              <p className="text-text-muted font-medium text-sm">{stat.label}</p>
            </Card>
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
