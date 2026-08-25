import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, Mail, Globe, Target, ChevronRight,
  Star, CheckCircle, ArrowRight, Zap, Shield, Users,
  TrendingUp, BookOpen, Award, Brain, Cpu, Layers
} from 'lucide-react';

// ── Animation Variants ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };
const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
};

// ── Animated Grid Background ───────────────────────────────
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

// ── Floating Orbs ──────────────────────────────────────────
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
      <motion.div
        className="absolute bottom-40 left-1/3 w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' }}
        animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  );
}

// ── Animated Counter ───────────────────────────────────────
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

// ── Feature Card ───────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, color, gradient, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover="hover"
      animate="rest"
      variants={cardHover}
    >
      <motion.div
        className="relative group h-full p-6 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden cursor-default"
        whileHover={{ borderColor: 'rgba(139,92,246,0.3)' }}
        transition={{ duration: 0.3 }}
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 0%, ${color}15 0%, transparent 70%)` }}
        />

        {/* Animated border gradient on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(${gradient}, transparent) border-box`, WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'destination-out', maskComposite: 'exclude' }}
        />

        {/* Icon */}
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

        {/* Arrow */}
        <motion.div
          className="mt-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color }}
          initial={{ x: -8 }}
          whileHover={{ x: 0 }}
        >
          Learn more <ArrowRight className="w-3 h-3" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── Stat Card ──────────────────────────────────────────────
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

// ── Testimonial Card ───────────────────────────────────────
function TestimonialCard({ name, role, text, avatar, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="p-6 rounded-2xl border border-white/8 bg-white/[0.03] relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: delay + i * 0.05 }}>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </motion.div>
        ))}
      </div>
      <p className="text-white/70 text-sm leading-relaxed mb-5 relative z-10">"{text}"</p>
      <div className="flex items-center gap-3 relative z-10">
        <motion.div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          {avatar}
        </motion.div>
        <div>
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-white/40">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Step Card ──────────────────────────────────────────────
function StepCard({ num, title, desc, icon: Icon, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <motion.div
        className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] h-full"
        whileHover={{ borderColor: 'rgba(139,92,246,0.4)', backgroundColor: 'rgba(139,92,246,0.04)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start gap-4">
          <motion.div
            className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center font-black text-lg"
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {num}
          </motion.div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-violet-400" />
              <h3 className="font-bold">{title}</h3>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const FEATURES = [
  { icon: FileText, title: 'AI Resume Builder', desc: 'Gemini AI crafts ATS-optimized resumes with quantified impact bullets tailored to your exact target role.', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(168,85,247,0.2))', delay: 0 },
  { icon: Mail, title: 'Cover Letter Studio', desc: 'Paste any job description and get a compelling, personalized cover letter in under 10 seconds.', color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.4), rgba(6,182,212,0.2))', delay: 0.08 },
  { icon: Target, title: 'Skill Gap Analyzer', desc: 'Get your ATS match score, identify missing skills, and receive a personalized learning roadmap.', color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(20,184,166,0.2))', delay: 0.16 },
  { icon: Globe, title: 'Portfolio Generator', desc: 'Auto-generate a stunning developer portfolio with live project showcases from your resume data.', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(239,68,68,0.2))', delay: 0.24 },
  { icon: Brain, title: 'Interview Coach', desc: 'AI-powered mock interview with role-specific questions, STAR-method answers, and coaching tips.', color: '#ec4899', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.4), rgba(168,85,247,0.2))', delay: 0.32 },
  { icon: TrendingUp, title: 'Career Analytics', desc: 'Track resume performance, identify strengths, and get proactive AI suggestions to stay competitive.', color: '#06b6d4', gradient: 'linear-gradient(135deg, rgba(6,182,212,0.4), rgba(59,130,246,0.2))', delay: 0.4 },
];

const STEPS = [
  { num: '01', icon: Users, title: 'Build Your Profile', desc: 'Enter your education, projects, skills and experience using our smart guided form.' },
  { num: '02', icon: Sparkles, title: 'Let AI Enhance', desc: 'Gemini AI rewrites bullets, crafts summaries, and tailors everything to your target roles.' },
  { num: '03', icon: Award, title: 'Export & Apply', desc: 'Download PDF resume, generate cover letters, launch your portfolio, and land interviews.' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma', role: 'SWE Intern @ Google', text: 'Got 3 interviews in one week. The ATS score showed exactly what was missing from my resume — fixed it in minutes!', avatar: 'AS', delay: 0 },
  { name: 'Priya Patel', role: 'CS Student, BITS Pilani', text: 'The cover letter studio is unreal. Reads the full JD and writes something genuinely personal every time.', avatar: 'PP', delay: 0.1 },
  { name: 'Rahul Verma', role: 'Full Stack Intern @ Swiggy', text: 'My portfolio went from zero to something I am proud to share with recruiters. Built it in 10 minutes.', avatar: 'RV', delay: 0.2 },
];

export default function Landing() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
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
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg tracking-tight">QuickHire <span className="text-violet-400">AI</span></span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            {['Features', 'How it works', 'Testimonials'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="hover:text-white transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                {item}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">Sign in</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35 }}>
              <Link to="/build" className="group text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1.5 shadow-lg shadow-violet-500/20">
                Get Started
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 px-6 overflow-hidden">
        <GridBackground />
        <FloatingOrbs />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8"
          >
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className="w-3.5 h-3.5" />
            </motion.span>
            Powered by Google Gemini 1.5 Flash
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
          >
            Your Career,
            <br />
            <motion.span
              className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Supercharged by AI
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            ATS-optimized resumes, personalized cover letters, stunning portfolios,
            and AI interview coaching — all in one suite, built for students.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link to="/build">
              <motion.button
                className="group relative flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors shadow-2xl shadow-violet-500/30 overflow-hidden"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  animate={{ translateX: ['−100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
          >
            {[
              { value: 10, suffix: 'K+', label: 'Resumes Built', color: '#8b5cf6' },
              { value: 95, suffix: '%', label: 'Interview Rate', color: '#10b981' },
              { value: 100, suffix: '%', label: 'Free to Use', color: '#f59e0b' },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-white/30 tracking-widest uppercase">Scroll</span>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
            animate={{ scaleY: [1, 0.3, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
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
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Everything in one place
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              One suite for your entire
              <br />
              <span className="text-white/30">career journey</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">From first resume to dream offer — every tool you need, powered by Gemini AI.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">How it works</h2>
            <p className="text-white/50 text-lg">From blank profile to job-ready in under 5 minutes</p>
          </motion.div>

          <div className="space-y-4">
            {STEPS.map((s, i) => <StepCard key={s.num} {...s} delay={i * 0.15} />)}
          </div>

          {/* Animated connector */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <Link to="/build">
              <motion.button
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-violet-500/25"
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(139,92,246,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles className="w-5 h-5" />
                Start for Free — No Signup
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section id="testimonials" className="py-28 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <motion.div key={i} initial={{ opacity: 0, rotate: -30 }} whileInView={{ opacity: 1, rotate: 0 }} transition={{ delay: i * 0.05 }}>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </motion.div>
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Loved by students</h2>
            <p className="text-white/50">Join thousands landing their dream internships</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => <TestimonialCard key={t.name} {...t} />)}
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
            className="relative p-12 rounded-3xl border border-violet-500/20 overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, rgba(10,10,15,0.8) 70%)' }}
          >
            <motion.div
              className="absolute inset-0 rounded-3xl"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent, rgba(59,130,246,0.1))', borderRadius: '24px', border: '1px solid rgba(139,92,246,0.2)' }}
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center relative z-10"
            >
              <Award className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-black mb-4 relative z-10 tracking-tight">
              Ready to stand out?
            </h2>
            <p className="text-white/60 mb-8 text-lg relative z-10">
              Build your AI-powered career suite for free. No signup required.
            </p>

            <motion.div className="relative z-10">
              <Link to="/build">
                <motion.button
                  className="inline-flex items-center gap-2 bg-white text-[#0a0a0f] px-8 py-4 rounded-xl font-bold text-base transition-all"
                  whileHover={{ scale: 1.06, boxShadow: '0 25px 50px rgba(255,255,255,0.15)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles className="w-5 h-5 text-violet-600" />
                  Start Building Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/40 relative z-10">
              {['No credit card', 'Free forever', 'AI-powered'].map((t, i) => (
                <motion.div
                  key={t}
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {t}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.03 }}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white/60">QuickHire <span className="text-violet-400">AI</span></span>
          </motion.div>
          <p className="text-white/30 text-sm">© 2026 QuickHire AI Career Suite · Built for students 🎓</p>
          <div className="flex items-center gap-1 text-white/30 text-xs">
            <Cpu className="w-3 h-3" /> Powered by Gemini 1.5 Flash
          </div>
        </div>
      </footer>
    </div>
  );
}
