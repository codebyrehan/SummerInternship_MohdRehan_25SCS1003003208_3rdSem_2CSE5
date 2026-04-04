import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading, Card } from '../ui/PremiumUI';

const features = [
  { 
    id: 'doc', 
    title: 'ATS Resume Builder', 
    desc: 'Craft optimized resumes that sail through screening systems easily.',
    path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    color: '#6366f1' 
  },
  { 
    id: 'globe', 
    title: 'Portfolio Generator', 
    desc: 'Turn your resume into a stunning hosted 1-page web portfolio.',
    path: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
    color: '#06b6d4'
  },
  { 
    id: 'icosahedron', 
    title: 'AI Bullet Enhancer', 
    desc: 'Rewrite weak work experience into strong impact-driven statements.',
    path: "M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83",
    color: '#6366f1'
  },
  { 
    id: 'torus', 
    title: 'Job Matcher', 
    desc: 'Match your resume to specific Job Descriptions instantly.',
    path: "M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z M12 18a6 6 0 1 0-6-6 6 6 0 0 0 6 6z M12 14a2 2 0 1 0-2-2 2 2 0 0 0 2 2z",
    color: '#06b6d4'
  },
  { 
    id: 'score', 
    title: 'Resume Checker', 
    desc: 'Get an actionable score and improvement tips for your resume.',
    path: "M12 20V10 M18 20V4 M6 20v-4",
    color: '#6366f1'
  },
  { 
    id: 'box', 
    title: 'Cover Letters', 
    desc: 'Generate personalized cover letters tailored to each job.',
    path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    color: '#06b6d4'
  },
  { 
    id: 'pill', 
    title: 'LinkedIn Bio Gen', 
    desc: 'Optimize your LinkedIn headline and About section with AI.',
    path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z",
    color: '#6366f1'
  },
  { 
    id: 'arrow', 
    title: '1-Click Export', 
    desc: 'Download pixel-perfect, highly formatted PDFs reliably.',
    path: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    color: '#06b6d4'
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="section-padding bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <SectionHeading 
        badge="EVERYTHING YOU NEED"
        title={<span>Powerful Tools. <br className="md:hidden" />Zero Complexity.</span>}
      />
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Card 
        className={`flex flex-col items-center text-center transition-all duration-500 overflow-hidden group h-full ${
          isHovered ? 'border-primary/50 shadow-glow-primary' : 'border-white/5 shadow-none'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-16 h-16 mb-8 relative flex justify-center items-center">
          <div 
            className={`absolute inset-0 rounded-full transition-opacity duration-500 blur-xl opacity-20 ${
              isHovered ? 'opacity-40 scale-125' : 'opacity-10 scale-100'
            }`}
            style={{ backgroundColor: feature.color }}
          />
          
          <div className={`
            w-full h-full rounded-2xl border transition-all duration-500 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10
            ${isHovered ? 'border-primary/40 rotate-[360deg] scale-110' : 'border-white/10 rotate-0 scale-100'}
          `}>
             <svg 
               width="32" 
               height="32" 
               viewBox="0 0 24 24" 
               fill="none" 
               stroke="currentColor" 
               strokeWidth="2" 
               strokeLinecap="round" 
               strokeLinejoin="round" 
               className={`transition-colors duration-500 ${isHovered ? 'text-white' : 'text-text-muted'}`}
               style={isHovered ? { filter: `drop-shadow(0 0 8px ${feature.color})` } : {}}
             >
               <path d={feature.path} />
             </svg>
          </div>
        </div>

        <h3 className="text-xl font-sora font-bold text-white mb-3 group-hover:text-primary transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed group-hover:text-text-primary transition-colors duration-300">
          {feature.desc}
        </p>

        <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 bg-gradient-primary ${isHovered ? 'w-full' : 'w-0'}`} />
      </Card>
    </motion.div>
  );
}
