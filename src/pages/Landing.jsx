import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, FileText, Mail, Globe, Target, ChevronRight,
  Star, CheckCircle, ArrowRight, Zap, Shield, Users,
  TrendingUp, BookOpen, Award
} from 'lucide-react';

const FEATURES = [
  { icon: FileText, title: 'AI Resume Builder', desc: 'Generate ATS-optimized resumes with quantified bullet points tailored to your target role.', color: 'from-violet-500 to-purple-600' },
  { icon: Mail, title: 'Cover Letter Studio', desc: 'Paste a job description and get a personalized, compelling cover letter in seconds.', color: 'from-blue-500 to-cyan-600' },
  { icon: Target, title: 'Skill Gap Analyzer', desc: 'Compare your profile to any job description and get an ATS score + learning roadmap.', color: 'from-emerald-500 to-teal-600' },
  { icon: Globe, title: 'Portfolio Generator', desc: 'Build a stunning developer portfolio with live project showcases and bio.', color: 'from-orange-500 to-rose-600' },
  { icon: BookOpen, title: 'Interview Coach', desc: 'Practice with AI-generated role-specific questions and model STAR answers.', color: 'from-pink-500 to-purple-600' },
  { icon: TrendingUp, title: 'Career Analytics', desc: 'Track your resume performance and get proactive suggestions to stay competitive.', color: 'from-amber-500 to-orange-600' },
];

const STEPS = [
  { n: '01', title: 'Build Your Profile', desc: 'Enter your education, projects, skills and experience using our smart guided form.' },
  { n: '02', title: 'Let AI Enhance', desc: 'Gemini AI rewrites bullets, crafts summaries, and tailors content to your target roles.' },
  { n: '03', title: 'Export & Apply', desc: 'Download your polished resume as PDF, generate cover letters, and launch your portfolio.' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma', role: 'SWE Intern @ Google', text: 'Got 3 interviews in a week after using the AI resume builder. The skill gap analyzer was a game changer!', avatar: 'AS' },
  { name: 'Priya Patel', role: 'CS Student, BITS Pilani', text: 'The cover letter studio saved me hours. It reads the job description and writes something genuinely personal.', avatar: 'PP' },
  { name: 'Rahul Verma', role: 'Full Stack Dev Intern', text: 'My portfolio went from a basic page to something I am actually proud to share with recruiters.', avatar: 'RV' },
];

const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">QuickHire AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">Sign in</Link>
            <Link to="/build" className="text-sm bg-violet-600 hover:bg-violet-500 transition-colors text-white px-4 py-2 rounded-lg font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your Career,
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Supercharged by AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Generate ATS-optimized resumes, personalized cover letters, stunning portfolios,
            and interview prep — all powered by Gemini AI. Built specifically for students.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/build"
              className="group flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              Build My Resume Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-white/70 hover:text-white px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm font-medium"
            >
              View Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-white/40"
          >
            {[['10K+', 'Resumes Created'], ['95%', 'Interview Rate'], ['Free', 'No Credit Card']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white/80">{val}</div>
                <div className="text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-4">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Everything you need
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              One suite for your entire
              <br />
              <span className="text-white/40">career journey</span>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <div className="group p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-default">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-white/50 text-lg">From blank slate to job-ready in minutes</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.1}>
                <div className="relative">
                  <div className="text-6xl font-black text-white/5 mb-4 leading-none">{s.n}</div>
                  <h3 className="text-lg font-semibold mb-2 -mt-6">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-white/20">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Loved by students</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-white/50">Join thousands of students landing their dream internships</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.03]">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-white/40">{t.role}</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="p-12 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-500/10 to-transparent">
              <Award className="w-12 h-12 text-violet-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Ready to stand out?
              </h2>
              <p className="text-white/60 mb-8 text-lg">
                Build your AI-powered resume for free. No signup required to get started.
              </p>
              <Link
                to="/build"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50"
              >
                Start Building Now <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/40">
                {['No credit card', 'Free forever', 'AI-powered'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-white/30 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="font-semibold text-white/50">QuickHire AI</span>
        </div>
        <p>© 2026 QuickHire AI Career Suite. Built with ❤️ for students.</p>
      </footer>
    </div>
  );
}
