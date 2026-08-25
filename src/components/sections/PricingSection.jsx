import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingPlans = [
  {
    id: 'starter',
    name: 'Student Starter',
    badge: '100% Free Forever',
    description: 'Perfect for students crafting their first internships and technical resumes.',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Up to 3 AI-Tailored Resumes',
      'Basic ATS Compliance Scanner',
      '2 Standard Professional Templates',
      'Dynamic Web Portfolio with custom link',
      '1-Click PDF & Markdown Export',
      'GitHub Profile Importer'
    ],
    ctaText: 'Get Started Free',
    ctaLink: '/register',
    popular: false,
    highlight: false
  },
  {
    id: 'pro',
    name: 'Pro Career Accelerator',
    badge: 'Most Popular',
    description: 'For students and grads targeting top tech companies, startups, and competitive roles.',
    priceMonthly: 9,
    priceYearly: 7,
    features: [
      'Unlimited AI Resumes & Cover Letters',
      'Deep ATS Optimization & Missing Keyword Injector',
      'All 8+ Modern Tech & Academic Templates',
      'Live Job Description Semantic Matcher (100+ scans/mo)',
      'STAR Metric & Impact Quantifier Assistant',
      'Tailored AI Interview Questions & STAR Answers',
      'Custom Domain Support for Web Portfolio',
      'Priority Cloud PDF Generation Engine'
    ],
    ctaText: 'Start 7-Day Free Trial',
    ctaLink: '/register?plan=pro',
    popular: true,
    highlight: true
  },
  {
    id: 'campus',
    name: 'University & Bootcamp',
    badge: 'Campus License',
    description: 'Equip your university cohort or bootcamp batch with automated career placement tooling.',
    priceMonthly: 29,
    priceYearly: 24,
    features: [
      'Everything in Pro for entire cohort',
      'Cohort Placement & ATS Performance Analytics',
      'Custom University Branding & Theme',
      'Bulk Student Portfolio Showcase Directory',
      'Dedicated API for Student Transcripts & LMS',
      'Dedicated Account Manager & Placement Support'
    ],
    ctaText: 'Contact Campus Placement',
    ctaLink: 'mailto:campus@quickhire.ai',
    popular: false,
    highlight: false
  }
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-background">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Zap size={14} className="text-primary" /> Transparent Pricing
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-sora font-extrabold text-text-primary tracking-tight mb-4"
          >
            Invest in Your Career,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              Not Just a Template
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-base sm:text-lg"
          >
            Simple, student-friendly plans with everything you need to land competitive internships and full-time offers.
          </motion.p>

          {/* Billing Switcher */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={'text-sm font-medium ' + (!isYearly ? 'text-text-primary' : 'text-text-muted')}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-8 bg-surface border border-primary/30 rounded-full p-1 transition-colors relative flex items-center"
              aria-label="Toggle Billing Interval"
            >
              <div
                className={'w-6 h-6 bg-gradient-primary rounded-full transition-transform transform shadow-md ' + (isYearly ? 'translate-x-6' : 'translate-x-0')}
              />
            </button>
            <span className={'text-sm font-medium flex items-center gap-2 ' + (isYearly ? 'text-text-primary' : 'text-text-muted')}>
              Annual
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                Save 25%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, i) => {
            const price = isYearly ? plan.priceYearly : plan.priceMonthly;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={'relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ' + (
                  plan.highlight
                    ? 'bg-gradient-to-b from-[#181938] to-[#0d0e1f] border-2 border-primary shadow-2xl shadow-primary/20 scale-105 z-20'
                    : 'glass-card bg-surface/40 hover:border-primary/40'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-primary text-white text-xs font-bold tracking-wide shadow-lg flex items-center gap-1.5">
                    <Sparkles size={13} /> {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-sora font-bold text-text-primary">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface text-text-muted border border-primary/10">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-text-muted mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-4xl sm:text-5xl font-sora font-extrabold text-text-primary">
                      {'$' + price}
                    </span>
                    <span className="text-text-muted text-sm font-medium">
                      {price === 0 ? 'forever' : isYearly ? '/month, billed annually' : '/month'}
                    </span>
                  </div>

                  <div className="w-full h-px bg-primary/10 mb-8" />

                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs uppercase tracking-wider text-text-muted font-bold">Includes:</p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-text-primary">
                        <div className="p-0.5 rounded-full bg-primary/20 text-primary mt-0.5 shrink-0">
                          <Check size={14} />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={plan.ctaLink}
                  className={'w-full py-3.5 rounded-xl font-semibold text-center flex items-center justify-center gap-2 transition-all ' + (
                    plan.highlight
                      ? 'btn-primary shadow-glow-primary'
                      : 'bg-surface hover:bg-primary/20 text-text-primary border border-primary/20'
                  )}
                >
                  {plan.ctaText} <ArrowRight size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center flex items-center justify-center gap-2 text-text-muted text-sm"
        >
          <Shield size={16} className="text-green-400" />
          <span>7-day money-back guarantee. No questions asked. Cancel anytime.</span>
        </motion.div>
      </div>
    </section>
  );
}
