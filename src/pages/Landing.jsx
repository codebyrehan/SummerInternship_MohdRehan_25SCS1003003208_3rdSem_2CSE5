import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, FileText, Mail, Globe, Target, ChevronRight,
  CheckCircle, ArrowRight, Zap, Shield, Users,
  TrendingUp, BookOpen, Award, Brain, Cpu, Layers, Code, CheckCircle2
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
};

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-40 right-1/4 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
        animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
}

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) { setStarted(true); }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FeatureCard({ icon: Icon, title, desc, color, gradient, delay }) {
  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="h-full"
    >
      <div className="relative group h-full p-6 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden cursor-default transition-colors hover:border-white/20">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 70%)` }}
        />

        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative z-10"
          style={{ background: `linear-gradient(135deg, ${color}30, ${color}15)`, border: `1px solid ${color}30` }}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </motion.div>

        <h3 className="font-bold text-base mb-2 relative z-10">{title}</h3>
        <p className="text-sm text-white/50 leading-relaxed relative z-10">{desc}</p>
      </div>
    </motion.div>
  );
}

function StatCard({ value, suffix, label, color }) {
  return (
    <motion.div
      className="text-center p-6 rounded-2xl border border-white/8 bg-white/[0.02]"
      whileHover={{ scale: 1.05, borderColor: 'rgba(139,92,246,0.3)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-3xl md:text-4xl font-black mb-1" style={{ color }}>
        <Counter target={value} suffix={suffix} />
      </div>
      <div className="text-sm text-white/50">{label}</div>
    </motion.div>
  );
}

function StepCard({ num, title, desc, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] h-full transition-all hover:border-violet-500/30 hover:bg-violet-500/5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center font-black text-lg text-white">
            {num}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-violet-400" />
              <h3 className="font-bold">{title}</h3>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const FEATURES = [
  { icon: FileText, title: 'AI Resume Builder', desc: 'Gemini AI crafts ATS-optimized resumes with quantified impact bullets tailored to your exact target role.', color: '#8b5cf6' },
  { icon: Mail, title: 'Cover Letter Studio', desc: 'Paste any job description and get a compelling, personalized cover letter in under 10 seconds.', color: '#3b82f6' },
  { icon: Target, title: 'Skill Gap Analyzer', desc: 'Get your ATS match score, identify missing skills, and receive a personalized learning roadmap.', color: '#10b981' },
  { icon: Globe, title: 'Portfolio Generator', desc: 'Auto-generate a stunning developer portfolio with live project showcases from your resume data.', color: '#f59e0b' },
  { icon: Brain, title: 'Interview Coach', desc: 'AI-powered mock interview with role-specific questions, STAR-method answers, and coaching tips.', color: '#ec4899' },
  { icon: TrendingUp, title: 'Career Analytics', desc: 'Track resume performance, identify strengths, and get proactive AI suggestions to stay competitive.', color: '#06b6d4' },
];

const STEPS = [
  { num: '01', icon: Users, title: 'Enter Your Student Details', desc: 'Fill in your academic background, coursework, projects, and tech stack.' },
  { num: '02', icon: Sparkles, title: 'AI Enhances & Formats', desc: 'Google Gemini rewrites bullets using the STAR method and tailors content to ATS keywords.' },
  { num: '03', icon: Award, title: 'Export & Apply with Confidence', desc: 'Download standard PDF resumes, customized cover letters, and live developer portfolios.' },
];

const COMPARISON = [
  { feature: 'ATS Optimization Score', quickhire: 'Real-time 0-100% Score', traditional: 'Manual Guesswork' },
  { feature: 'Bullet Point Rewriter', quickhire: 'STAR Method AI Generator', traditional: 'Generic Templates' },
  { feature: 'Job Description Matching', quickhire: 'Automatic Skill Gap Analysis', traditional: 'Not Supported' },
  { feature: 'Cover Letter Generator', quickhire: 'Tailored in 5 seconds', traditional: '30-45 mins manual effort' },
  { feature: 'Developer Portfolio', quickhire: 'Instant Live Web Showcase', traditional: 'Requires separate coding' },
];

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div className="flex items-center gap-2.5" whileHover={{ scale: 1.03 }}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">QuickHire <span className="text-violet-400">AI</span></span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            {['Features', 'How it works', 'Comparison'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">Sign in</Link>
            <Link to="/build" className="group text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 shadow-lg shadow-violet-500/20">
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6 overflow-hidden">
        <GridBackground />
        <FloatingOrbs />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          >
            Your Career,
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              Supercharged by AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            ATS-optimized resumes, personalized cover letters, live student portfolios,
            and AI interview prep — all in one modern suite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link to="/build">
              <motion.button
                className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors shadow-2xl shadow-violet-500/30"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="w-4 h-4" />
                Build My Resume Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button
                className="flex items-center gap-2 text-white/70 hover:text-white px-6 py-4 rounded-xl border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-sm font-medium"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Layers className="w-4 h-4" />
                View Dashboard
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
          >
            {[
              { value: 100, suffix: '%', label: 'ATS Optimized', color: '#8b5cf6' },
              { value: 6, suffix: ' in 1', label: 'Career Tools', color: '#10b981' },
              { value: 100, suffix: '%', label: 'Free to Use', color: '#f59e0b' },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Section ────────────────────────────────── */}
      <section id="features" className="py-28 px-6 relative">
        <GridBackground />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Comprehensive AI Toolkit
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              One suite for your entire
              <br />
              <span className="text-white/30">career development</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">From first draft to recruiter interviews — every tool you need, powered by Gemini AI.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => <FeatureCard key={f.title} {...f} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">How it works</h2>
            <p className="text-white/50 text-lg">From zero to interview-ready in 3 simple steps</p>
          </motion.div>

          <div className="space-y-4">
            {STEPS.map((s, i) => <StepCard key={s.num} {...s} delay={i * 0.15} />)}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ────────────────────────────────── */}
      <section id="comparison" className="py-28 px-6 border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-4">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              The QuickHire AI Advantage
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-3">Why choose QuickHire AI?</h2>
            <p className="text-white/50">Built specifically for students entering the modern tech industry</p>
          </motion.div>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="p-4 font-semibold text-white/70">Capability</th>
                  <th className="p-4 font-bold text-violet-400">QuickHire AI</th>
                  <th className="p-4 font-semibold text-white/40">Traditional Methods</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium text-white/80">{row.feature}</td>
                    <td className="p-4 text-emerald-400 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> {row.quickhire}
                    </td>
                    <td className="p-4 text-white/40">{row.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────── */}
      <section className="py-28 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-12 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Ready to land your dream role?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Build your AI-powered career assets today. Free forever for students.
            </p>

            <Link to="/build">
              <motion.button
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl shadow-violet-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="w-5 h-5" />
                Start Building Now Free
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white/60">QuickHire <span className="text-violet-400">AI</span></span>
          </div>
          <p className="text-white/30 text-sm">© 2026 QuickHire AI Career Suite · Built for students 🎓</p>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <Cpu className="w-3 h-3" /> Powered by Gemini 1.5 Flash
          </div>
        </div>
      </footer>
    </div>
  );
}
