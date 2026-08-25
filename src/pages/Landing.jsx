import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, Mail, Globe, Target, ChevronRight,
  ArrowRight, Zap, Shield, TrendingUp, BookOpen, Award,
  Brain, Cpu, Layers, CheckCircle2, Play, RefreshCw, Copy,
  Check, Terminal, Compass, Flame, Star, MousePointerClick
} from 'lucide-react';

// ── Interactive Cursor Follower Spotlight Card ─────────────────
function SpotlightCard({ children, className = '', color = 'rgba(139,92,246,0.15)' }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${color}, transparent 60%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── Interactive Live AI Sandbox / Playground ────────────────────
function LiveAiPlayground() {
  const [activeTab, setActiveTab] = useState('bullet');
  const [bulletInput, setBulletInput] = useState('Worked on React frontend and fixed bugs for website');
  const [bulletOutput, setBulletOutput] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [atsSkill, setAtsSkill] = useState('React, TypeScript, Node.js, Docker');
  const [atsScore, setAtsScore] = useState(88);
  const [copied, setCopied] = useState(false);

  const handleEnhanceBullet = () => {
    setIsEnhancing(true);
    setBulletOutput('');
    setTimeout(() => {
      setBulletOutput('Architected responsive React/TypeScript interfaces, resolving 40+ critical UI bugs and accelerating page load speed by 35%.');
      setIsEnhancing(false);
    }, 600);
  };

  const sampleBullets = [
    'Made a full stack web app for university project',
    'Helped with database queries and backend APIs',
    'Built a machine learning model for data analysis'
  ];

  return (
    <SpotlightCard className="p-6 md:p-8" color="rgba(168,85,247,0.18)">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Interactive Live AI Demo
          </div>
          <h3 className="text-xl md:text-2xl font-black">Test the AI Intelligence</h3>
          <p className="text-sm text-white/50">Experience real-time AI resume transformation without logging in</p>
        </div>

        {/* Demo switcher tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: 'bullet', label: 'STAR Bullet Enhancer' },
            { id: 'ats', label: 'Live ATS Simulator' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t.id ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30' : 'text-white/50 hover:text-white'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'bullet' ? (
          <motion.div
            key="bullet"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Input Side */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Before (Draft Bullet)</span>
                <span className="text-[11px] text-white/40">Try sample presets below</span>
              </div>
              <textarea
                value={bulletInput}
                onChange={(e) => setBulletInput(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/60 transition-colors resize-none"
                placeholder="Type any simple resume bullet point..."
              />
              <div className="flex flex-wrap gap-2">
                {sampleBullets.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setBulletInput(sample); setBulletOutput(''); }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-violet-500/40 transition-colors"
                  >
                    Sample {idx + 1}
                  </button>
                ))}
              </div>
              <motion.button
                onClick={handleEnhanceBullet}
                disabled={isEnhancing || !bulletInput}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-all"
              >
                {isEnhancing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isEnhancing ? 'Gemini AI is Enhancing...' : 'Enhance with STAR Method'}
              </motion.button>
            </div>

            {/* Output Side */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> After (ATS Optimized)
                </span>
                {bulletOutput && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bulletOutput);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[11px] text-white/50 hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 min-h-[140px] flex flex-col justify-center">
                {bulletOutput ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                    <p className="text-sm font-medium text-emerald-200 leading-relaxed">
                      "{bulletOutput}"
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400">
                      <Zap className="w-3 h-3" /> Quantified Impact + Action Verb + ATS Match
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-white/30 text-xs py-6">
                    Click "Enhance with STAR Method" to preview instant AI rewrite
                  </div>
                )}
              </div>
              <Link to="/build" className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-medium">
                Build full resume with this AI power <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="ats"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
          >
            <div className="md:col-span-2 space-y-4">
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider">Candidate Skills / Tech Stack</label>
              <input
                type="text"
                value={atsSkill}
                onChange={(e) => setAtsSkill(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-violet-500/60"
              />
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40">Adjust Match Level:</span>
                <input
                  type="range"
                  min="40"
                  max="98"
                  value={atsScore}
                  onChange={(e) => setAtsScore(Number(e.target.value))}
                  className="flex-1 accent-violet-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] text-center">
              <span className="text-[11px] text-white/40 uppercase tracking-widest">Simulated ATS Score</span>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 my-2">
                {atsScore}%
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 rounded-full"
                  animate={{ width: `${atsScore}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-[11px] text-emerald-400 font-medium mt-2 inline-block">High Interview Probability</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SpotlightCard>
  );
}

// ── Interactive Resume Template Live Switcher ───────────────────
function LiveTemplateShowcase() {
  const [selectedTheme, setSelectedTheme] = useState('modern');

  const themes = {
    modern: {
      name: 'Modern Violet',
      accentBg: 'bg-violet-600',
      tagColor: 'bg-violet-100 text-violet-800 border-violet-200',
      roleColor: 'text-violet-600',
      headingBorder: 'border-violet-200 text-violet-900',
      headerBg: 'bg-white',
      badge: 'bg-violet-100 text-violet-700 border-violet-200',
      borderStyle: 'border-violet-500/40',
      fontStyle: 'font-sans'
    },
    slate: {
      name: 'Tech Emerald',
      accentBg: 'bg-emerald-600',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      roleColor: 'text-emerald-600',
      headingBorder: 'border-emerald-200 text-emerald-900',
      headerBg: 'bg-emerald-50/40',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      borderStyle: 'border-emerald-500/40',
      fontStyle: 'font-mono'
    },
    cyber: {
      name: 'Cyber Blue',
      accentBg: 'bg-cyan-600',
      tagColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      roleColor: 'text-cyan-600 font-mono',
      headingBorder: 'border-cyan-200 text-cyan-900 font-mono',
      headerBg: 'bg-cyan-50/40',
      badge: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      borderStyle: 'border-cyan-500/40',
      fontStyle: 'font-sans'
    },
    minimal: {
      name: 'Executive Dark',
      accentBg: 'bg-zinc-900',
      tagColor: 'bg-zinc-100 text-zinc-800 border-zinc-300',
      roleColor: 'text-zinc-700 font-serif italic',
      headingBorder: 'border-zinc-300 text-zinc-900 font-serif',
      headerBg: 'bg-zinc-100/60',
      badge: 'bg-zinc-200 text-zinc-800 border-zinc-300',
      borderStyle: 'border-zinc-400/40',
      fontStyle: 'font-serif'
    }
  };

  const current = themes[selectedTheme];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-violet-400" /> Live Resume Customizer
          </div>
          <h3 className="text-2xl font-black">Select Your Professional Aesthetic</h3>
          <p className="text-sm text-white/50">Click any theme below to preview instant styling updates</p>
        </div>

        {/* Theme pills */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(themes).map(([key, t]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedTheme(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${selectedTheme === key ? `${t.borderStyle} bg-white/15 text-white shadow-xl shadow-violet-500/10 ring-2 ring-violet-500/50` : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${t.accentBg}`} />
              {t.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mini Mock Resume Preview Card */}
      <SpotlightCard className="p-6 md:p-8" color="rgba(99,102,241,0.15)">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTheme}
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.25 }}
            className={`max-w-2xl mx-auto bg-white text-[#111827] rounded-2xl shadow-2xl overflow-hidden text-left border ${current.borderStyle} ${current.fontStyle}`}
          >
            {/* Top Accent Strip */}
            <div className={`h-2.5 w-full ${current.accentBg}`} />

            <div className={`p-6 md:p-8 ${current.headerBg} border-b border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4`}>
              <div>
                <h4 className="text-2xl font-bold tracking-tight text-gray-900">Mohd Rehan</h4>
                <p className={`text-sm font-semibold mt-0.5 ${current.roleColor}`}>
                  Full-Stack Software Engineer & Student Developer
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
                  <span>rehan@example.com</span> • <span>linkedin.com/in/rehan</span> • <span>github.com/rehan</span>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border ${current.badge}`}>
                ATS Score: 98%
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Experience / Projects */}
              <div>
                <h5 className={`text-xs font-bold uppercase tracking-wider border-b pb-1.5 mb-3 flex items-center justify-between ${current.headingBorder}`}>
                  <span>Key Technical Projects</span>
                  <span className="text-[10px] font-normal text-gray-400 lowercase">2024 — Present</span>
                </h5>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-gray-900">QuickHire AI — Career Development Suite</span>
                      <span className="text-gray-500 font-medium text-[11px]">React, Express, Gemini AI</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      • Engineered an automated ATS resume generator with Google Gemini 1.5 Flash API proxy, cutting draft generation time by 80%.
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      • Implemented dynamic skill-gap analyzer and client-side vector PDF compilation with 0-dependency latency.
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h5 className={`text-xs font-bold uppercase tracking-wider border-b pb-1.5 mb-3 ${current.headingBorder}`}>
                  Technical Proficiencies
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {['React.js', 'Node.js', 'Express.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Google Gemini AI', 'REST APIs', 'Git'].map((s) => (
                    <span key={s} className={`px-2.5 py-1 text-[11px] rounded-lg font-medium border ${current.tagColor}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-8">
          <Link to="/build">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-violet-500/25 transition-all"
            >
              <Sparkles className="w-4 h-4" /> Build with "{current.name}" Template Free
            </motion.button>
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}

// ── Interactive Feature Cards Grid ──────────────────────────────
const FEATURES = [
  { icon: FileText, title: 'AI Resume Builder', desc: 'Gemini AI crafts ATS-optimized resumes with quantified impact bullets tailored to your target job roles.', color: '#8b5cf6', badge: 'Core', link: '/build' },
  { icon: Mail, title: 'Cover Letter Studio', desc: 'Paste any job description and get a customized, high-converting cover letter in under 5 seconds.', color: '#3b82f6', badge: 'Instant', link: '/dashboard?tab=cover-letter' },
  { icon: Target, title: 'Skill Gap Analyzer', desc: 'Evaluate your profile against job descriptions to discover missing keywords and learning recommendations.', color: '#10b981', badge: 'Analytics', link: '/dashboard?tab=skill-gap' },
  { icon: Globe, title: 'Portfolio Generator', desc: 'Transform your projects into an attractive live developer web portfolio ready to share with recruiters.', color: '#f59e0b', badge: 'Live Showcase', link: '/dashboard?tab=portfolio' },
  { icon: Brain, title: 'AI Interview Coach', desc: 'Practice with tailored interview questions, STAR method model answers, and strategic insider tips.', color: '#ec4899', badge: 'Practice', link: '/dashboard?tab=interview' },
  { icon: TrendingUp, title: 'Career Acceleration', desc: 'Access comprehensive toolsets for internships, tech placements, and entry-level engineering roles.', color: '#06b6d4', badge: 'Growth', link: '/dashboard?tab=resumes' },
];

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Background Grid */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* ── Navbar ──────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-black text-lg tracking-tight">QuickHire <span className="text-violet-400">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#demo" className="hover:text-white transition-colors">Live Demo</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-semibold text-white/70 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/build" className="text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 flex items-center gap-1.5">
              Launch Suite <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-16 px-6 text-center">
        {/* Floating Glowing Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        <motion.div style={{ y: heroY }} className="max-w-4xl mx-auto relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Google Gemini 1.5 Flash Integrated
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.08]"
          >
            Your Complete AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Career Development Suite
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-white/55 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Build ATS-optimized resumes, generate role-tailored cover letters, evaluate skill-gaps, and launch live developer portfolios in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/build">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-2xl shadow-violet-500/30 transition-all"
              >
                <Sparkles className="w-4 h-4" /> Start Building for Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>

            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-4 bg-white/5 border border-white/10 text-white/80 hover:text-white rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all"
              >
                <Layers className="w-4 h-4" /> Open Suite Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Interactive Live AI Sandbox ─────────────────────── */}
      <section id="demo" className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        <LiveAiPlayground />
      </section>

      {/* ── Features Grid ───────────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Complete Career Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">Engineered for Student Success</h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto">Everything you need to go from university coursework to top engineering placements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Link key={i} to={f.link} className="block h-full group">
              <SpotlightCard className="p-7 flex flex-col justify-between h-full cursor-pointer hover:border-violet-500/40 transition-colors" color={f.color + '25'}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ background: f.color + '20', border: `1px solid ${f.color}40` }}
                    >
                      <f.icon className="w-6 h-6" style={{ color: f.color }} />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
                <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-semibold group-hover:translate-x-1 transition-transform" style={{ color: f.color }}>
                  Launch {f.title} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Interactive Live Template Showcase ──────────────── */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <LiveTemplateShowcase />
      </section>

      {/* ── Final Call to Action ────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <SpotlightCard className="p-12 md:p-16 text-center" color="rgba(139,92,246,0.25)">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Ready to stand out to employers?</h2>
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base mb-8">
            Create ATS-vetted resumes and launch your professional career assets in under 3 minutes.
          </p>
          <Link to="/build">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-white text-[#0a0a0f] rounded-2xl font-extrabold text-sm shadow-2xl hover:bg-white/90 transition-all flex items-center gap-2 mx-auto"
            >
              Get Started Now — It's Free <ArrowRight className="w-4 h-4 text-violet-600" />
            </motion.button>
          </Link>
        </SpotlightCard>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white/70">QuickHire AI Career Development Suite</span>
        </div>
        <div>Built with React, TailwindCSS & Google Gemini AI</div>
        <div>© 2026 QuickHire AI · All rights reserved</div>
      </footer>
    </div>
  );
}
