import React, { useRef } from 'react';
import { SectionHeading, Button } from '../ui/PremiumUI';

const templates = [
  { id: 'modern', name: 'Modern Pro', color: 'bg-blue-500/10' },
  { id: 'corporate', name: 'Corporate Edge', color: 'bg-slate-500/10' },
  { id: 'minimal', name: 'Minimal Black', color: 'bg-zinc-800/20' },
  { id: 'creative', name: 'Creative Studio', color: 'bg-purple-500/10' },
  { id: 'dev', name: 'Developer Grid', color: 'bg-emerald-500/10' },
  { id: 'fresher', name: 'Fresher First', color: 'bg-amber-500/10' }
];

function TemplateCard({ tmpl }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth tilt calculating
    const tiltX = (y / rect.height) * -15; // Max 15deg
    const tiltY = (x / rect.width) * 15;
    
    cardRef.current.style.transform = `scale(1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `scale(1) rotateX(0deg) rotateY(0deg)`;
  };

  return (
    <div 
      className="perspective-1000 group relative"
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`w-full aspect-[1/1.4] glass-card ${tmpl.color} overflow-hidden flex flex-col items-center justify-center relative transition-transform duration-200 ease-out`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Faux Resume Lines */}
        <div className="w-[70%] h-full py-8 flex flex-col gap-4 opacity-30 pointer-events-none">
           <div className="h-6 w-3/4 bg-white/40 rounded"></div>
           <div className="h-2 w-full bg-white/20 rounded"></div>
           <div className="h-2 w-5/6 bg-white/20 rounded"></div>
           
           <div className="mt-4 h-4 w-1/2 bg-white/30 rounded"></div>
           <div className="h-2 w-full bg-white/10 rounded"></div>
           <div className="h-2 w-full bg-white/10 rounded"></div>
           <div className="h-2 w-2/3 bg-white/10 rounded"></div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 z-10">
           <Button>Use Template</Button>
        </div>
      </div>
      
      {/* Label under it initially, but part of card */}
      <div className="mt-4 text-center">
         <span className="glass-pill">{tmpl.name}</span>
      </div>
    </div>
  );
}

export default function TemplatesSection() {
  return (
    <section id="templates" className="section-padding bg-surface">
      <SectionHeading title="Templates That Get Callbacks" />
      
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
         {templates.map(tmpl => (
           <TemplateCard key={tmpl.id} tmpl={tmpl} />
         ))}
      </div>
    </section>
  );
}
