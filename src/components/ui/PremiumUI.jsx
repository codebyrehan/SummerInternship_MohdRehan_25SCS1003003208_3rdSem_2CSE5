import React from 'react';
import { motion } from 'framer-motion';

export const Badge = ({ children, className = "" }) => (
  <div className={`glass-pill inline-flex items-center gap-2 border-[rgba(99,102,241,0.15)] ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClass = "px-6 py-3 font-inter font-medium rounded-[10px] transition-all duration-300 inline-flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-primary text-white shadow-glow-primary hover:shadow-glow-primary-hover hover:scale-[1.03]",
    ghost: "bg-transparent text-text-primary border border-primary/30 hover:bg-primary/20",
  };
  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`${baseClass} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Card = ({ children, className = "", hover = true, ...props }) => {
  return (
    <div 
      className={`glass-card p-6 ${hover ? 'hover:-translate-y-1.5 hover:shadow-glow-primary transition-all duration-300' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionHeading = ({ badge, title, subtitle, className = "" }) => (
  <div className={`flex flex-col items-center text-center max-w-3xl mx-auto mb-16 ${className}`}>
    {badge && <div className="text-primary text-sm font-bold tracking-widest uppercase mb-4">{badge}</div>}
    <h2 className="text-4xl md:text-5xl mb-6 leading-tight">{title}</h2>
    {subtitle && <p className="text-text-muted text-lg">{subtitle}</p>}
  </div>
);
