import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Sparkles, FileText, Mail, Globe, Target, BookOpen,
  Plus, Download, Trash2, Eye, ChevronRight, Loader2,
  LogOut, ArrowLeft, Copy, CheckCircle,
  BarChart3, Brain, Award, Zap, TrendingUp, User
} from 'lucide-react';
import { generateCoverLetter, analyzeSkillGap, generateInterviewPrep } from '../services/gemini';
import { getResumes, deleteResume, getCoverLetters, saveCoverLetter, getDraft } from '../services/storage';
import useAuthStore from '../stores/authStore';

// ── Animation Configs ─────────────────────────────────────
const TAB_TRANSITION = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };
const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: (i) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const TABS = [
  { id: 'home', label: 'Home', icon: Sparkles, color: '#8b5cf6' },
  { id: 'resumes', label: 'Resumes', icon: FileText, color: '#3b82f6' },
  { id: 'cover-letter', label: 'Cover Letters', icon: Mail, color: '#06b6d4' },
  { id: 'skill-gap', label: 'Skill Gap', icon: Target, color: '#10b981' },
  { id: 'interview', label: 'Interview', icon: BookOpen, color: '#f59e0b' },
  { id: 'portfolio', label: 'Portfolio', icon: Globe, color: '#ec4899' },
];

function Spinner() { return <Loader2 className="w-4 h-4 animate-spin" />; }

// ── Animated Action Card ───────────────────────────────────
function ActionCard({ icon: Icon, label, sub, color, gradient, onClick, index }) {
  return (
    <motion.button
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="show"
      onClick={onClick}
      className="group relative p-6 rounded-2xl border border-white/8 bg-white/[0.02] text-left overflow-hidden transition-all duration-300 hover:border-white/20"
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Hover glow bg */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 30% 50%, ${color}12 0%, transparent 65%)` }}
      />
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
      />

      <motion.div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 relative z-10"
        style={{ background: gradient }}
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.15 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div className="font-bold text-sm mb-1 relative z-10">{label}</div>
      <div className="text-xs text-white/45 relative z-10">{sub}</div>
      <motion.div
        className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color }}
      >
        Open <ChevronRight className="w-3 h-3" />
      </motion.div>
    </motion.button>
  );
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ label, val, icon: Icon, color, index }) {
  return (
    <motion.div
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="show"
      className="relative p-5 rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden group"
      whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.15)' }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 80% 20%, ${color}15 0%, transparent 60%)` }}
      />
      <Icon className="w-4 h-4 mb-3 relative z-10" style={{ color }} />
      <div className="text-2xl font-black relative z-10">{val}</div>
      <div className="text-xs text-white/40 mt-0.5 relative z-10">{label}</div>
    </motion.div>
  );
}

// ── Home Tab ──────────────────────────────────────────────
function HomeTab({ setActiveTab }) {
  const navigate = useNavigate();
  const resumes = getResumes();
  const cls = getCoverLetters();
  const draft = getDraft();

  const ACTIONS = [
    { icon: FileText, label: 'Build Resume', sub: 'AI-powered, ATS-optimized', color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(168,85,247,0.2))', onClick: () => navigate('/build') },
    { icon: Mail, label: 'Cover Letter', sub: 'Paste JD → instant letter', color: '#06b6d4', gradient: 'linear-gradient(135deg, rgba(6,182,212,0.4), rgba(59,130,246,0.2))', onClick: () => setActiveTab('cover-letter') },
    { icon: Target, label: 'Skill Gap Check', sub: 'ATS score + roadmap', color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(20,184,166,0.2))', onClick: () => setActiveTab('skill-gap') },
    { icon: BookOpen, label: 'Interview Prep', sub: 'AI mock Q&A', color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(239,68,68,0.2))', onClick: () => setActiveTab('interview') },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-black mb-1">
          Welcome back <motion.span animate={{ rotate: [0, 20, -10, 20, 0] }} transition={{ duration: 1, delay: 0.5 }}>👋</motion.span>
        </h1>
        <p className="text-white/45">Your AI career suite is ready. What are we building today?</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Resumes', val: resumes.length, icon: FileText, color: '#8b5cf6' },
          { label: 'Cover Letters', val: cls.length, icon: Mail, color: '#06b6d4' },
          { label: 'AI Assists', val: '∞', icon: Sparkles, color: '#f59e0b' },
          { label: 'Status', val: draft ? 'Draft ✓' : 'Ready', icon: CheckCircle, color: '#10b981' },
        ].map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Action cards */}
      <div>
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Quick Actions</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACTIONS.map((a, i) => <ActionCard key={a.label} {...a} index={i} />)}
        </div>
      </div>

      {/* Recent resumes */}
      {resumes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Recent Resumes</h2>
          <div className="space-y-3">
            {resumes.slice(0, 3).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="group flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{r.personalInfo?.name || 'Untitled'}</div>
                    <div className="text-xs text-white/35">{r.personalInfo?.targetRole || 'General'} · {new Date(r.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <Link to="/build" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit <ChevronRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Resumes Tab ───────────────────────────────────────────
function ResumesTab() {
  const [resumes, setResumes] = useState(getResumes());
  const navigate = useNavigate();

  const handleDelete = (id) => {
    deleteResume(id);
    setResumes(getResumes());
    toast.success('Resume deleted');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">My Resumes</h2>
          <p className="text-white/45 text-sm mt-1">{resumes.length} saved</p>
        </div>
        <motion.button
          onClick={() => navigate('/build')}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-4 h-4" /> New
        </motion.button>
      </motion.div>

      {resumes.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="float">
            <FileText className="w-16 h-16 text-white/10 mx-auto mb-4" />
          </motion.div>
          <p className="text-white/35 mb-6">No resumes yet. Let AI build your first one!</p>
          <motion.button onClick={() => navigate('/build')} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium" whileHover={{ scale: 1.05 }}>
            Build Resume
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {resumes.map((r, i) => (
            <motion.div
              key={r.id}
              custom={i}
              variants={CARD_VARIANTS}
              initial="hidden"
              animate="show"
              className="group flex items-center justify-between p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-violet-500/25 hover:bg-violet-500/4 transition-all duration-300"
              whileHover={{ x: 4 }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                >
                  <FileText className="w-5 h-5 text-violet-400" />
                </motion.div>
                <div>
                  <div className="font-semibold">{r.personalInfo?.name || 'Untitled Resume'}</div>
                  <div className="text-xs text-white/40 mt-0.5">{r.personalInfo?.targetRole || 'General'} · {new Date(r.updatedAt).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to="/build" className="p-2 rounded-lg border border-white/10 hover:bg-violet-500/15 hover:border-violet-500/30 transition-colors text-white/50 hover:text-violet-400 block">
                    <Eye className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg border border-white/10 hover:bg-red-500/15 hover:border-red-500/25 transition-colors text-white/50 hover:text-red-400"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Cover Letter Tab ──────────────────────────────────────
function CoverLetterTab() {
  const resumes = getResumes();
  const [selectedResume, setSelectedResume] = useState(resumes[0] || null);
  const [jobDesc, setJobDesc] = useState('');
  const [company, setCompany] = useState('');
  const [tone, setTone] = useState('professional');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!jobDesc.trim()) { toast.error('Paste a job description first'); return; }
    if (!selectedResume) { toast.error('Build a resume first'); return; }
    setLoading(true);
    try {
      const text = await generateCoverLetter(selectedResume, jobDesc, company, tone);
      setResult(text);
      saveCoverLetter({ content: text, company, jobDesc: jobDesc.substring(0, 200) });
      toast.success('Cover letter generated!');
    } catch (err) { toast.error(err.message || 'AI failed — check GEMINI_API_KEY on Render'); }
    finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied!');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">Cover Letter Studio</h2>
        <p className="text-white/45 text-sm mt-1">Paste job description → Gemini writes a personalized letter</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Company Name</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Google, Microsoft..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 text-sm transition-all" />
          </div>

          {resumes.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Profile</label>
              <select value={selectedResume?.id || ''} onChange={e => setSelectedResume(resumes.find(r => r.id === e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 text-sm">
                {resumes.map(r => <option key={r.id} value={r.id} className="bg-[#1a1a2e]">{r.personalInfo?.name} — {r.personalInfo?.targetRole}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Tone</label>
            <div className="flex gap-2">
              {['professional', 'enthusiastic', 'concise'].map(t => (
                <motion.button key={t} onClick={() => setTone(t)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${tone === t ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/10'}`}>
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Job Description *</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste the full job description..." rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 text-sm resize-none transition-all" />
          </div>

          <motion.button onClick={generate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-violet-500/20"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(139,92,246,0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? <><Spinner /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate with Gemini AI</>}
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-white/50">Generated Cover Letter</span>
                  <motion.button onClick={copy} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white" whileHover={{ scale: 1.05 }}>
                    {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </motion.button>
                </div>
                <div className="p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 h-[480px] overflow-y-auto">
                  <p className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap">{result}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-[560px] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4">
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <Mail className="w-12 h-12 text-white/10" />
                </motion.div>
                <p className="text-sm text-white/25">Your cover letter will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// ── Skill Gap Tab ─────────────────────────────────────────
function SkillGapTab() {
  const resumes = getResumes();
  const [selectedResume, setSelectedResume] = useState(resumes[0] || null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!jobDesc.trim()) { toast.error('Paste a job description'); return; }
    if (!selectedResume) { toast.error('Build a resume first'); return; }
    setLoading(true);
    try {
      const data = await analyzeSkillGap(selectedResume, jobDesc);
      setResult(data);
    } catch (err) { toast.error(err.message || 'Analysis failed — check GEMINI_API_KEY'); }
    finally { setLoading(false); }
  };

  const scoreColor = (s) => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
  const scoreBg = (s) => s >= 75 ? 'from-emerald-500 to-teal-500' : s >= 50 ? 'from-amber-500 to-orange-500' : 'from-red-500 to-rose-500';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">Skill Gap Analyzer</h2>
        <p className="text-white/45 text-sm mt-1">Get your ATS match score and missing skills roadmap</p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          {resumes.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Your Profile</label>
              <select value={selectedResume?.id || ''} onChange={e => setSelectedResume(resumes.find(r => r.id === e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none text-sm">
                {resumes.map(r => <option key={r.id} value={r.id} className="bg-[#1a1a2e]">{r.personalInfo?.name} — {r.personalInfo?.targetRole}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Job Description *</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Paste job description..." rows={10}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-emerald-500/50 text-sm resize-none transition-all" />
          </div>
          <motion.button onClick={analyze} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? <><Spinner /> Analyzing...</> : <><Target className="w-4 h-4" /> Analyze with AI</>}
          </motion.button>
        </motion.div>

        <div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* ATS Score */}
                <motion.div className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] text-center" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
                  <div className="text-xs text-white/40 mb-2 uppercase tracking-widest">ATS Match Score</div>
                  <motion.div className="text-6xl font-black mb-3" style={{ color: scoreColor(result.atsScore) }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    {result.atsScore}%
                  </motion.div>
                  <div className="w-full bg-white/8 rounded-full h-2 overflow-hidden">
                    <motion.div className={`h-2 rounded-full bg-gradient-to-r ${scoreBg(result.atsScore)}`}
                      initial={{ width: 0 }} animate={{ width: result.atsScore + '%' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }} />
                  </div>
                  <p className="text-xs text-white/45 mt-3">{result.summary}</p>
                </motion.div>

                {/* Matched */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <div className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> Matched ({result.matchedSkills?.length || 0})</div>
                  <div className="flex flex-wrap gap-2">
                    {(result.matchedSkills || []).map((s, i) => (
                      <motion.span key={s} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 + i * 0.04 }}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">{s}</motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Missing */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
                  className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="text-xs font-semibold text-red-400 mb-3">Missing ({result.missingSkills?.length || 0})</div>
                  <div className="flex flex-wrap gap-2">
                    {(result.missingSkills || []).map((s, i) => (
                      <motion.span key={s} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 + i * 0.04 }}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">{s}</motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Action plan */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                  className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                  <div className="text-xs font-semibold text-blue-400 mb-3">Action Plan</div>
                  <ul className="space-y-2">
                    {(result.recommendations || []).map((r, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.85 + i * 0.06 }}
                        className="flex items-start gap-2 text-xs text-white/65">
                        <span className="text-blue-400 font-bold mt-0.5">{i + 1}.</span>{r}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div key="empty" className="h-full min-h-[400px] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
                  <BarChart3 className="w-12 h-12 text-white/10" />
                </motion.div>
                <p className="text-sm text-white/25">Results will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Interview Tab ─────────────────────────────────────────
function InterviewTab() {
  const resumes = getResumes();
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('entry-level');
  const [skills, setSkills] = useState(resumes[0]?.skills?.join(', ') || '');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const generate = async () => {
    if (!role.trim()) { toast.error('Enter a job role'); return; }
    setLoading(true);
    try {
      const data = await generateInterviewPrep(role, skills, level);
      setQuestions(Array.isArray(data) ? data : []);
      toast.success('Interview questions ready!');
    } catch (err) { toast.error(err.message || 'Generation failed — check GEMINI_API_KEY'); }
    finally { setLoading(false); }
  };

  const typeColors = { technical: '#8b5cf6', behavioral: '#f59e0b', project: '#3b82f6', situational: '#10b981', general: '#6b7280' };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">Interview Coach</h2>
        <p className="text-white/45 text-sm mt-1">AI-generated questions with STAR-method answers</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Job Role *</label>
          <input value={role} onChange={e => setRole(e.target.value)} placeholder="Frontend Developer..." onKeyDown={e => e.key === 'Enter' && generate()}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm transition-all" />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none text-sm">
            {['intern', 'entry-level', 'mid-level'].map(l => <option key={l} value={l} className="bg-[#1a1a2e] capitalize">{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Your Skills</label>
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Python, SQL..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-amber-500/50 text-sm transition-all" />
        </div>
      </motion.div>

      <motion.button onClick={generate} disabled={loading}
        className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-amber-500/20"
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {loading ? <><Spinner /> Generating...</> : <><Brain className="w-4 h-4" /> Generate 6 Questions</>}
      </motion.button>

      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const color = typeColors[q.type] || '#6b7280';
            return (
              <motion.div key={i} custom={i} variants={CARD_VARIANTS} initial="hidden" animate="show"
                className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
                <motion.button onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/[0.02] transition-colors"
                  whileTap={{ scale: 0.99 }}>
                  <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: color + '15', color, border: '1px solid ' + color + '30' }}>
                    {q.type}
                  </span>
                  <span className="text-sm font-medium flex-1">{q.question}</span>
                  <motion.div animate={{ rotate: expanded === i ? 90 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight className="w-4 h-4 text-white/25 shrink-0" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                        <div>
                          <div className="text-xs font-semibold text-white/35 mb-2 uppercase tracking-wider">Model Answer</div>
                          <p className="text-sm text-white/65 leading-relaxed">{q.answer}</p>
                        </div>
                        {q.tip && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
                            <div className="text-xs font-semibold text-amber-400 mb-1">💡 Pro Tip</div>
                            <p className="text-xs text-amber-300/70">{q.tip}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Portfolio Tab ─────────────────────────────────────────
function PortfolioTab() {
  const resumes = getResumes();
  const r = resumes[0];
  if (!r) return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center">
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <Globe className="w-16 h-16 text-white/10 mx-auto mb-4" />
      </motion.div>
      <p className="text-white/35 mb-2">Build a resume first to generate your portfolio</p>
      <Link to="/build" className="text-violet-400 hover:text-violet-300 text-sm transition-colors">Build Resume →</Link>
    </motion.div>
  );

  const skills = r.skills || [];
  const projects = r.projects || [];
  const info = r.personalInfo || {};

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Portfolio Preview</h2>
          <p className="text-white/45 text-sm mt-1">Auto-generated from your resume</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f0f1a, #0a0a14)' }}>
        {/* Portfolio header */}
        <div className="p-8 border-b border-white/5 relative overflow-hidden">
          <motion.div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(139,92,246,0.08), transparent)' }}
            animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />
          <div className="flex items-center gap-5 relative z-10">
            <motion.div
              className="w-18 h-18 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-3xl font-black shadow-xl shadow-violet-500/30"
              style={{ width: 72, height: 72 }}
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
              animate={{ boxShadow: ['0 20px 40px rgba(139,92,246,0.3)', '0 20px 60px rgba(139,92,246,0.5)', '0 20px 40px rgba(139,92,246,0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {(info.name || 'S').charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <h3 className="text-2xl font-black">{info.name || 'Your Name'}</h3>
              <p className="text-white/50 mt-0.5">{info.targetRole || 'Software Engineer'}</p>
              {info.email && <p className="text-violet-400 text-sm mt-1">{info.email}</p>}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 10).map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }}
                  className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/35 uppercase tracking-widest mb-3">Projects</h4>
            <div className="space-y-2">
              {projects.slice(0, 4).map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-2 text-sm text-white/60 group">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-violet-400" whileHover={{ scale: 2 }} />
                  {p.title}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const tabContent = {
    home: <HomeTab setActiveTab={setActiveTab} />,
    resumes: <ResumesTab />,
    'cover-letter': <CoverLetterTab />,
    'skill-gap': <SkillGapTab />,
    interview: <InterviewTab />,
    portfolio: <PortfolioTab />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/5">
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-sm">QuickHire <span className="text-violet-400">AI</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((t, i) => (
            <motion.button key={t.id} onClick={() => setActiveTab(t.id)}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${activeTab === t.id ? 'text-white' : 'text-white/45 hover:text-white hover:bg-white/5'}`}
              whileHover={{ x: activeTab === t.id ? 0 : 4 }}>
              {activeTab === t.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 rounded-xl" style={{ background: t.color + '15', border: '1px solid ' + t.color + '30' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <t.icon className="w-4 h-4 relative z-10" style={activeTab === t.id ? { color: t.color } : {}} />
              <span className="relative z-10">{t.label}</span>
            </motion.button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <Link to="/build" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/45 hover:text-white hover:bg-white/5 transition-all">
            <Plus className="w-4 h-4" /> New Resume
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/45 hover:text-white hover:bg-white/5 transition-all">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </motion.div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 flex">
        {TABS.slice(0, 5).map(t => (
          <motion.button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-colors ${activeTab === t.id ? 'text-white' : 'text-white/35'}`}
            whileTap={{ scale: 0.9 }}>
            <t.icon className="w-4 h-4" style={activeTab === t.id ? { color: t.color } : {}} />
            <span>{t.label}</span>
            {activeTab === t.id && <motion.span layoutId="mobileTab" className="absolute bottom-0 h-0.5 w-8 rounded-full" style={{ backgroundColor: t.color }} />}
          </motion.button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 16, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16, scale: 0.99 }} transition={TAB_TRANSITION}>
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
