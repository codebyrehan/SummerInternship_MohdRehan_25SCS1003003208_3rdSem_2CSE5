import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/PremiumUI';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Features', path: '#features' },
    { name: 'Templates', path: '#templates' },
    { name: 'How It Works', path: '#how-it-works' },
    { name: 'Portfolio', path: '/portfolio/demo' },
    { name: 'FAQ', path: '#faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-[24px] border-b border-primary/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-sora font-bold text-transparent bg-clip-text bg-gradient-primary">
          QuickHire AI
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.name} href={link.path} className="text-text-muted hover:text-white transition-colors text-sm font-medium relative group">
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="!px-4 !py-2 text-sm">Sign In</Button>
          <Link to="/build">
            <Button className="!px-4 !py-2 text-sm">Start Free &rarr;</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-surface border-b border-primary/20 p-6 flex flex-col gap-4 md:hidden"
          >
            {links.map((link) => (
              <a key={link.name} href={link.path} onClick={() => setMobileMenuOpen(false)} className="text-white text-lg font-medium p-2 hover:bg-white/5 rounded-lg">
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
              <Button variant="ghost" className="w-full">Sign In</Button>
              <Link to="/build" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Start Free &rarr;</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
