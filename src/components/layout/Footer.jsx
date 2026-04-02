import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-background pt-24 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-sora font-bold text-transparent bg-clip-text bg-gradient-primary inline-block mb-4">
              QuickHire AI
            </Link>
            <p className="text-text-muted max-w-sm">
              Elite AI-powered career branding platform. Build resumes that get noticed and portfolios that impress, in seconds.
            </p>
          </div>
          <div>
            <h4 className="text-white font-sora font-bold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-text-muted hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-text-muted hover:text-white transition-colors">How it works</a></li>
              <li><Link to="/build" className="text-text-muted hover:text-white transition-colors">Resume Builder</Link></li>
              <li><a href="#pricing" className="text-text-muted hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-sora font-bold mb-4">Templates</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Modern Pro</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Corporate Edge</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Minimal Black</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Creative Studio</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-sora font-bold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-text-muted hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© {new Date().getFullYear()} QuickHire AI. All rights reserved.</p>
          <p>Made with &hearts; for job seekers</p>
        </div>
      </div>
    </footer>
  );
}
