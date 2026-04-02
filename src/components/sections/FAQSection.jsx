import React, { useState } from 'react';
import { SectionHeading } from '../ui/PremiumUI';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const faqs = [
  {
    q: 'Is QuickHire AI ATS-friendly?',
    a: 'Yes! All our templates are rigorously tested against top ATS systems like Workday, Greenhouse, and iCIMS. We avoid tables, columns, and graphics that break parsing.'
  },
  {
    q: 'Can I export my resume as a PDF?',
    a: 'Absolutely. With one click, you can download a pixel-perfect, professionally formatted PDF. The export engine preserves all styling and layout precisely.'
  },
  {
    q: 'Can I build a portfolio too?',
    a: 'Yes! Once your resume is ready, QuickHire AI instantly generates a stunning 1-page web portfolio with a unique shareable link, no coding required.'
  },
  {
    q: 'Is it good for freshers with no work experience?',
    a: 'Definitely. Our Fresher First template and AI are specifically designed to help new graduates highlight projects, skills, and achievements powerfully.'
  },
  {
    q: 'Can I tailor my resume to a specific job description?',
    a: 'Yes! Our Job Description Matcher analyzes the job posting and automatically highlights the most relevant skills and rewrites your bullets to match the role.'
  },
  {
    q: 'Is my data saved securely?',
    a: 'Your data is stored entirely in your browser\'s localStorage — it never leaves your device unless you explicitly export or share it. Complete privacy by design.'
  }
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-6 flex justify-between items-center text-left text-white hover:text-text-muted transition-colors group"
      >
        <span className="text-lg font-sora font-bold pr-8">{faq.q}</span>
        <div className={`w-8 h-8 rounded-full glass-card flex items-center justify-center flex-shrink-0 transition-all duration-300 ${open ? 'bg-primary/20 border-primary/40' : ''}`}>
          {open ? <X size={16} className="text-primary" /> : <Plus size={16} className="text-primary" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-text-muted pb-6 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  return (
    <section id="faq" className="section-padding bg-background">
      <div className="max-w-3xl mx-auto px-6">
        <SectionHeading title="Questions? Answered." />
        <div className="mt-8 glass-card p-8 md:p-12">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
