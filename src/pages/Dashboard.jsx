import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Sparkles, FileText, Mail, Globe, Target, BookOpen,
  Plus, Download, Trash2, Eye, ChevronRight, Loader2,
  User, LogOut, Settings, ArrowLeft, Copy, CheckCircle,
  BarChart3, TrendingUp, Brain, Award, Star, Zap
} from 'lucide-react';
import { generateCoverLetter, analyzeSkillGap, generateInterviewPrep } from '../services/gemini';
import { getResumes, deleteResume, getCoverLetters, saveCoverLetter, getDraft } from '../services/storage';
import useAuthStore from '../stores/authStore';

const TABS = [
  { id: 'home', label: 'Home', icon: Sparkles },
  { id: 'resumes', label: 'Resumes', icon: FileText },
  { id: 'cover-letter', label: 'Cover Letters', icon: Mail },
  { id: 'skill-gap', label: 'Skill Gap', icon: Target },
  { id: 'interview', label: 'Interview Prep', icon: BookOpen },
  { id: 'portfolio', label: 'Portfolio', icon: Globe },
];

function Spinner() { return <Loader2 className="w-5 h-5 animate-spin" />; }

// ─── Home Tab ─────────────────────────────────────────────
function HomeTab() {
  const navigate = useNavigate();
  const resumes = getResumes();
  const draft = getDraft();

  const cards = [
    { icon: FileText, label: 'Build Resume', sub: 'AI-powered, ATS-optimized', color: 'from-violet-500 to-purple-600', action: () => navigate('/build') },
    { icon: Mail, label: 'Cover Letter', sub: 'Paste JD → get cover letter', color: 'from-blue-500 to-cyan-500', action: () => {} },
    { icon: Target, label: 'Skill Gap Check', sub: 'ATS score + roadmap', color: 'from-emerald-500 to-teal-500', action: () => {} },
    { icon: BookOpen, label: 'Interview Prep', sub: 'AI mock Q&A session', color: 'from-amber-500 to-orange-500', action: () => {} },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Welcome back 👋</h1>
        <p className="text-white/50">Your AI career suite is ready. What are we building today?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Resumes', val: resumes.length, icon: FileText },
          { label: 'Cover Letters', val: getCoverLetters().length, icon: Mail },
          { label: 'AI Assists', val: '∞', icon: Sparkles },
          { label: 'Status', val: draft ? 'Draft saved' : 'Ready', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl border border-white/8 bg-white/[0.03]">
            <s.icon className="w-4 h-4 text-white/40 mb-2" />
            <div className="text-2xl font-bold">{s.val}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map(c => (
          <button
            key={c.label}
            onClick={c.action}
            className="group p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15 transition-all text-left"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4`}>
              <c.icon className="w-5 h-5 text-white" />
            </div>
            <div className="font-semibold text-base mb-1">{c.label}</div>
            <div className="text-sm text-white/50">{c.sub}</div>
            <ChevronRight className="w-4 h-4 text-white/30 mt-3 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      {/* Resume list preview */}
      {resumes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Resumes</h2>
          <div className="space-y-3">
            {resumes.slice(0, 3).map(r => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/[0.03]">
                <div>
                  <div className="font-medium text-sm">{r.personalInfo?.name || 'Untitled'} — {r.personalInfo?.targetRole || 'General'}</div>
                  <div className="text-xs text-white/40 mt-0.5">Updated {new Date(r.updatedAt).toLocaleDateString()}</div>
                </div>
                <Link to="/build" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                  Edit <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Resumes Tab ──────────────────────────────────────────
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Resumes</h2>
          <p className="text-white/50 text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button
          onClick={() => navigate('/build')}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="py-24 text-center">
          <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-6">No resumes yet. Build your first one!</p>
          <button onClick={() => navigate('/build')} className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Build Resume
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {resumes.map(r => (
            <div key={r.id} className="p-5 rounded-2xl border border-white/8 bg-white/[0.03] flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.personalInfo?.name || 'Untitled Resume'}</div>
                <div className="text-sm text-white/50 mt-0.5">{r.personalInfo?.targetRole || 'General'} · Updated {new Date(r.updatedAt).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/preview" className="p-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white/60 hover:text-white">
                  <Eye className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-colors text-white/60 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Cover Letter Tab ─────────────────────────────────────
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
    if (!jobDesc.trim()) { toast.error('Please paste a job description'); return; }
    if (!selectedResume) { toast.error('Please build a resume first so AI can personalize the letter'); return; }
    setLoading(true);
    try {
      const text = await generateCoverLetter(selectedResume, jobDesc, company, tone);
      setResult(text);
      saveCoverLetter({ content: text, company, jobDesc: jobDesc.substring(0, 200) });
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error(err.message || 'AI generation failed. Check GEMINI_API_KEY.');
    } finally { setLoading(false); }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cover Letter Studio</h2>
        <p className="text-white/50 text-sm mt-1">Paste a job description → AI writes a personalized cover letter</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Company Name</label>
            <input
              value={company} onChange={e => setCompany(e.target.value)}
              placeholder="Google, Microsoft, Startup..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm"
            />
          </div>

          {resumes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Use Resume Profile</label>
              <select
                value={selectedResume?.id || ''}
                onChange={e => setSelectedResume(resumes.find(r => r.id === e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 text-sm"
              >
                {resumes.map(r => <option key={r.id} value={r.id} className="bg-[#1a1a2e]">{r.personalInfo?.name} — {r.personalInfo?.targetRole}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Tone</label>
            <div className="flex gap-2">
              {['professional', 'enthusiastic', 'concise'].map(t => (
                <button
                  key={t} onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${tone === t ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Job Description *</label>
            <textarea
              value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm resize-none"
            />
          </div>

          <button
            onClick={generate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? <><Spinner /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Cover Letter</>}
          </button>
        </div>

        {/* Output panel */}
        <div className="relative">
          {result ? (
            <div className="h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">Generated Cover Letter</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                  {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] h-[480px] overflow-y-auto">
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{result}</p>
              </div>
            </div>
          ) : (
            <div className="h-[540px] rounded-xl border border-dashed border-white/10 flex items-center justify-center">
              <div className="text-center text-white/30">
                <Mail className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">Your cover letter will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Skill Gap Tab ─────────────────────────────────────────
function SkillGapTab() {
  const resumes = getResumes();
  const [selectedResume, setSelectedResume] = useState(resumes[0] || null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!jobDesc.trim()) { toast.error('Please paste a job description'); return; }
    if (!selectedResume) { toast.error('Build a resume first to analyze skill gap'); return; }
    setLoading(true);
    try {
      const data = await analyzeSkillGap(selectedResume, jobDesc);
      setResult(data);
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Check GEMINI_API_KEY.');
    } finally { setLoading(false); }
  };

  const scoreColor = (s) => s >= 75 ? 'text-emerald-400' : s >= 50 ? 'text-amber-400' : 'text-red-400';
  const scoreBg = (s) => s >= 75 ? 'bg-emerald-500' : s >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Skill Gap Analyzer</h2>
        <p className="text-white/50 text-sm mt-1">Compare your profile to any job description and get an ATS score</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {resumes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Your Resume Profile</label>
              <select
                value={selectedResume?.id || ''}
                onChange={e => setSelectedResume(resumes.find(r => r.id === e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 text-sm"
              >
                {resumes.map(r => <option key={r.id} value={r.id} className="bg-[#1a1a2e]">{r.personalInfo?.name} — {r.personalInfo?.targetRole}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Job Description *</label>
            <textarea
              value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder="Paste job description..."
              rows={10}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm resize-none"
            />
          </div>
          <button
            onClick={analyze} disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors"
          >
            {loading ? <><Spinner /> Analyzing...</> : <><Target className="w-4 h-4" /> Analyze Skill Gap</>}
          </button>
        </div>

        <div>
          {result ? (
            <div className="space-y-5">
              {/* ATS Score */}
              <div className="p-5 rounded-xl border border-white/10 bg-white/[0.03] text-center">
                <div className="text-xs text-white/40 mb-2 uppercase tracking-wider">ATS Match Score</div>
                <div className={`text-6xl font-black mb-2 ${scoreColor(result.atsScore)}`}>{result.atsScore}%</div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${scoreBg(result.atsScore)}`} style={{ width: result.atsScore + '%' }} />
                </div>
                <p className="text-sm text-white/50 mt-3">{result.summary}</p>
              </div>

              {/* Matched Skills */}
              <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <div className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Matched Skills ({result.matchedSkills?.length || 0})
                </div>
                <div className="flex flex-wrap gap-2">
                  {(result.matchedSkills || []).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                <div className="text-sm font-medium text-red-400 mb-3">Missing Skills ({result.missingSkills?.length || 0})</div>
                <div className="flex flex-wrap gap-2">
                  {(result.missingSkills || []).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">{s}</span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                <div className="text-sm font-medium text-blue-400 mb-3">Action Plan</div>
                <ul className="space-y-2">
                  {(result.recommendations || []).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-blue-400 font-bold text-xs mt-0.5">{i + 1}.</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] rounded-xl border border-dashed border-white/10 flex items-center justify-center">
              <div className="text-center text-white/30">
                <BarChart3 className="w-10 h-10 mx-auto mb-3" />
                <p className="text-sm">Results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Interview Prep Tab ────────────────────────────────────
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
    } catch (err) {
      toast.error(err.message || 'Generation failed. Check GEMINI_API_KEY.');
    } finally { setLoading(false); }
  };

  const typeColors = { technical: 'violet', behavioral: 'amber', project: 'blue', situational: 'emerald', general: 'gray' };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Interview Coach</h2>
        <p className="text-white/50 text-sm mt-1">Practice with AI-generated questions and model answers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Job Role *</label>
          <input
            value={role} onChange={e => setRole(e.target.value)}
            placeholder="Frontend Developer, Data Analyst..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none text-sm">
            {['intern', 'entry-level', 'mid-level'].map(l => <option key={l} value={l} className="bg-[#1a1a2e] capitalize">{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">Your Key Skills</label>
          <input
            value={skills} onChange={e => setSkills(e.target.value)}
            placeholder="React, Python, SQL..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 text-sm"
          />
        </div>
      </div>

      <button
        onClick={generate} disabled={loading}
        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors"
      >
        {loading ? <><Spinner /> Generating...</> : <><Brain className="w-4 h-4" /> Generate Questions</>}
      </button>

      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, i) => {
            const color = typeColors[q.type] || 'gray';
            return (
              <div key={i} className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/[0.03] transition-colors"
                >
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium bg-${color}-500/10 text-${color}-300 border border-${color}-500/20`}>
                    {q.type}
                  </span>
                  <span className="text-sm font-medium flex-1">{q.question}</span>
                  <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${expanded === i ? 'rotate-90' : ''}`} />
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                        <div>
                          <div className="text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">Model Answer</div>
                          <p className="text-sm text-white/70 leading-relaxed">{q.answer}</p>
                        </div>
                        {q.tip && (
                          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <div className="text-xs font-medium text-amber-400 mb-1">💡 Tip</div>
                            <p className="text-xs text-amber-300/80">{q.tip}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Portfolio Tab ─────────────────────────────────────────
function PortfolioTab() {
  const resumes = getResumes();
  const r = resumes[0];
  if (!r) return (
    <div className="py-24 text-center">
      <Globe className="w-12 h-12 text-white/20 mx-auto mb-4" />
      <p className="text-white/40 mb-2">Build a resume first to generate your portfolio</p>
      <Link to="/build" className="text-violet-400 hover:text-violet-300 text-sm">Build Resume →</Link>
    </div>
  );

  const skills = r.skills || [];
  const projects = r.projects || [];
  const info = r.personalInfo || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Preview</h2>
          <p className="text-white/50 text-sm mt-1">Based on your resume data</p>
        </div>
        <Link to={`/portfolio/${(info.name||'student').toLowerCase().replace(/\s+/g,'-')}`} className="flex items-center gap-2 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors">
          <Eye className="w-4 h-4" /> View Full Portfolio
        </Link>
      </div>

      {/* Mini portfolio preview */}
      <div className="rounded-2xl border border-white/10 overflow-hidden bg-gradient-to-br from-[#0f0f1a] to-[#0a0a14]">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
              {(info.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{info.name || 'Your Name'}</h3>
              <p className="text-white/50">{info.targetRole || 'Software Engineer'}</p>
              {info.email && <p className="text-violet-400 text-sm">{info.email}</p>}
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 8).map(s => (
                <span key={s} className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Projects</h4>
            <div className="space-y-2">
              {projects.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {p.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const tabContent = {
    home: <HomeTab />,
    resumes: <ResumesTab />,
    'cover-letter': <CoverLetterTab />,
    'skill-gap': <SkillGapTab />,
    interview: <InterviewTab />,
    portfolio: <PortfolioTab />,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-60 shrink-0 border-r border-white/5 bg-[#0a0a0f]">
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm">QuickHire AI</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === t.id ? 'bg-violet-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <Link to="/build" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <Plus className="w-4 h-4" /> New Resume
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f] border-t border-white/5 flex">
        {TABS.slice(0,5).map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs ${activeTab === t.id ? 'text-violet-400' : 'text-white/40'}`}>
            <t.icon className="w-4 h-4" />
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
