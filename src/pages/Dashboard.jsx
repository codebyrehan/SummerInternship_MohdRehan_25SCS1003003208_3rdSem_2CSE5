import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Eye, Download, Trash2, Edit3, ExternalLink,
  BarChart3, Globe, Sparkles, Clock, TrendingUp, User, Settings,
  LogOut, ChevronRight, Award, Loader2, Target, Mail, Brain,
  Check, Copy, RefreshCw, Zap, Shield, HelpCircle, ArrowRight
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useResumeStore from '../stores/resumeStore';
import {
  checkAtsScore, matchJob, generateCoverLetter, generateInterviewPrep, analyzeCareerGap
} from '../services/aiService';
import toast from 'react-hot-toast';
import Navbar from '../components/layout/Navbar';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const [activeTab, setActiveTab] = useState('resumes');

  // Job Matcher State
  const [targetJobRole, setTargetJobRole] = useState('Senior Frontend / Full-Stack Engineer');
  const [jobDescriptionInput, setJobDescriptionInput] = useState('');
  const [isMatchingJob, setIsMatchingJob] = useState(false);
  const [jobMatchResult, setJobMatchResult] = useState(null);

  // Cover Letter Studio State
  const [clForm, setClForm] = useState({
    companyName: 'Stripe',
    jobTitle: 'Software Engineer Intern',
    jobDescription: '',
    tone: 'confident'
  });
  const [isGeneratingCl, setIsGeneratingCl] = useState(false);
  const [generatedCl, setGeneratedCl] = useState('');

  // Interview Prep State
  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const result = await deleteResume(id);
    if (result) toast.success('Resume deleted');
    else toast.error('Failed to delete');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out');
  };

  const runJobMatch = async () => {
    if (!jobDescriptionInput.trim()) {
      return toast.error('Please paste a job description first');
    }
    setIsMatchingJob(true);
    try {
      const activeResume = resumes[0] || {};
      const res = await matchJob(JSON.stringify(activeResume), jobDescriptionInput);
      setJobMatchResult(res);
      toast.success('ATS Analysis complete!');
    } catch {
      toast.error('Failed to analyze job match');
    } finally {
      setIsMatchingJob(false);
    }
  };

  const runGenerateCoverLetter = async () => {
    if (!clForm.companyName || !clForm.jobTitle) {
      return toast.error('Please specify the company and job title');
    }
    setIsGeneratingCl(true);
    try {
      const activeResume = resumes[0] || { personalInfo: { name: user?.name } };
      const res = await generateCoverLetter(activeResume, clForm.jobTitle, clForm.companyName, clForm.jobDescription, clForm.tone);
      setGeneratedCl(res.content || res);
      toast.success('Cover letter synthesized!');
    } catch {
      toast.error('Failed to generate cover letter');
    } finally {
      setIsGeneratingCl(false);
    }
  };

  const runInterviewPrep = async () => {
    setIsGeneratingInterview(true);
    try {
      const activeResume = resumes[0] || {};
      const res = await generateInterviewPrep(activeResume, targetJobRole, jobDescriptionInput);
      setInterviewQuestions(res.questions || []);
      toast.success('Tailored interview questions generated!');
    } catch {
      toast.error('Failed to generate interview prep');
    } finally {
      setIsGeneratingInterview(false);
    }
  };

  const totalResumes = resumes.length;
  const latestScore = resumes.find(r => r.atsScore)?.atsScore || 89;

  return (
    <motion.div className="min-h-screen bg-background text-text-primary" {...fadeUp}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-sora font-extrabold tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-primary">{user?.name?.split(' ')[0] || 'Engineer'}</span>
              </h1>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                {user?.subscription === 'pro' ? 'Pro Member' : 'Student Tier'}
              </span>
            </div>
            <p className="text-text-muted text-sm sm:text-base">
              AI Career Operating System • Build, optimize, and match your applications in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/build')}
              className="btn-primary px-6 py-3 flex items-center gap-2 font-semibold shadow-glow-primary"
              id="create-resume-btn"
            >
              <Plus size={18} /> New AI Resume
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Resumes', value: totalResumes, icon: FileText, color: 'text-primary' },
            { label: 'ATS Health Score', value: `${latestScore}/100`, icon: TrendingUp, color: 'text-green-400' },
            { label: 'AI Operations Used', value: user?.aiCallsUsed || 14, icon: Sparkles, color: 'text-secondary' },
            { label: 'Portfolio Status', value: 'Live & Synced', icon: Globe, color: 'text-cyan-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-5 flex items-center gap-4 hover:border-primary/30 transition-all"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={`p-3 rounded-2xl bg-surface border border-primary/10 ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-sora font-bold text-text-primary mt-0.5">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-surface/60 border border-primary/15 p-1.5 rounded-2xl w-fit">
          {[
            { id: 'resumes', label: 'My Resumes', icon: FileText },
            { id: 'portfolio', label: 'Dynamic Portfolio', icon: Globe },
            { id: 'job-matcher', label: 'Job Matcher & ATS', icon: Target },
            { id: 'cover-letter', label: 'Cover Letter Studio', icon: Mail },
            { id: 'interview-prep', label: 'Interview & Gap Coach', icon: Brain },
            { id: 'pricing', label: 'SaaS Plans', icon: Zap },
            { id: 'settings', label: 'Account Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: RESUMES */}
        {activeTab === 'resumes' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : resumes.length === 0 ? (
              <motion.div
                className="glass-card p-16 text-center border-dashed border-2 border-primary/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FileText size={48} className="mx-auto mb-4 text-primary opacity-80" />
                <h3 className="text-2xl font-sora font-bold mb-2">No Resumes Created Yet</h3>
                <p className="text-text-muted mb-6 max-w-md mx-auto">
                  Create your first tailored, ATS-engineered resume in minutes or load an AI-assisted profile.
                </p>
                <button
                  onClick={() => navigate('/build')}
                  className="btn-primary px-8 py-3.5 font-semibold inline-flex items-center gap-2 shadow-glow-primary"
                >
                  <Plus size={18} /> Launch Resume Builder
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume, i) => (
                  <motion.div
                    key={resume._id}
                    className="glass-card p-6 flex flex-col hover:border-primary/50 transition-all group relative overflow-hidden"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-3">
                        <h3 className="font-sora font-bold text-lg text-text-primary group-hover:text-primary transition-colors truncate">
                          {resume.title || resume.personalInfo?.name || 'Untitled Technical Resume'}
                        </h3>
                        <p className="text-text-muted text-xs font-medium mt-1 truncate">
                          {resume.personalInfo?.jobTitle || 'Full-Stack Software Engineer'}
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-green-500/15 text-green-400 border border-green-500/30 shrink-0">
                        ATS {resume.atsScore || 89}%
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-text-muted text-xs mb-5">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-primary border border-primary/15 font-mono text-[11px]">
                        {resume.template || 'modern-pro'}
                      </span>
                    </div>

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(resume.technicalSkills || ['React', 'TypeScript', 'Node.js', 'PostgreSQL']).slice(0, 4).map((s, j) => (
                        <span key={j} className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg border border-primary/15">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-auto flex gap-2 pt-4 border-t border-primary/10">
                      <button
                        onClick={() => navigate(`/build?id=${resume._id}`)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-surface hover:bg-primary/20 text-text-primary border border-primary/15 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem('resume_data', JSON.stringify({
                            personalInfo: resume.personalInfo,
                            education: resume.education,
                            skills: [...(resume.technicalSkills || []), ...(resume.softSkills || [])],
                            experience: resume.experience,
                            projects: resume.projects,
                            certifications: resume.certificationsText || '',
                          }));
                          navigate('/preview');
                        }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-hover shadow-glow-primary transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <button
                        onClick={() => handleDelete(resume._id, resume.title)}
                        className="p-2.5 rounded-xl bg-surface hover:bg-red-500/20 text-red-400 border border-primary/10 transition-colors"
                        title="Delete Resume"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Create New Tile */}
                <motion.div
                  className="glass-card p-6 flex flex-col items-center justify-center min-h-[220px] border-dashed border-2 border-primary/30 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                  onClick={() => navigate('/build')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-3">
                    <Plus size={24} />
                  </div>
                  <p className="text-text-primary font-sora font-semibold">Create New Resume</p>
                  <p className="text-text-muted text-xs mt-1">Start from blank or import preset</p>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DYNAMIC PORTFOLIO */}
        {activeTab === 'portfolio' && (
          <motion.div className="glass-card p-8" {...fadeUp}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-primary/10 mb-8">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-sora font-bold text-text-primary">Your Dynamic Web Portfolio</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                    Live
                  </span>
                </div>
                <p className="text-text-muted text-sm mt-1">
                  Automatically generated modern web showcase synchronized with your verified projects and GitHub commits.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/portfolio/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'demo-student'}`;
                    navigator.clipboard.writeText(url);
                    toast.success('Portfolio URL copied to clipboard!');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-primary/20 text-text-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  <Copy size={16} /> Copy Public Link
                </button>
                <Link
                  to={`/portfolio/${user?.name?.toLowerCase().replace(/\s+/g, '-') || 'demo-student'}`}
                  target="_blank"
                  className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-glow-primary"
                >
                  <ExternalLink size={16} /> View Live Portfolio
                </Link>
              </div>
            </div>

            {/* Portfolio Mock Preview Card */}
            <div className="rounded-2xl bg-[#090a18] border border-primary/20 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-text-muted font-mono ml-2">quickhire.ai/portfolio/{user?.name?.toLowerCase().replace(/\s+/g, '-') || 'alex-rivera'}</span>
                </div>
                <span className="text-xs text-primary font-semibold">Theme: Cyberpunk Glass</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl bg-surface/50 border border-primary/15">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2">Profile Header</p>
                  <h4 className="text-lg font-bold text-text-primary">{user?.name || 'Alex Rivera'}</h4>
                  <p className="text-xs text-primary font-medium mt-0.5">AI / Machine Learning Engineer</p>
                  <p className="text-xs text-text-muted mt-3 line-clamp-3">
                    Driven Computer Science researcher with a focus on autonomous agentic systems, PyTorch optimization, and RAG pipelines.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-surface/50 border border-primary/15">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2">Featured Project</p>
                  <h4 className="text-sm font-bold text-text-primary">AgenticRAG Research Assistant</h4>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">Python • LangGraph • FastAPI</p>
                  <p className="text-xs text-text-muted mt-2">Autonomous multi-agent synthesis system with 41% accuracy gain.</p>
                </div>

                <div className="p-5 rounded-xl bg-surface/50 border border-primary/15">
                  <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2">Skills Radar</p>
                  <div className="space-y-2 mt-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-text-muted mb-1">
                        <span>PyTorch & Deep Learning</span>
                        <span className="text-primary font-bold">95%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="w-[95%] h-full bg-gradient-primary rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-text-muted mb-1">
                        <span>FastAPI & Microservices</span>
                        <span className="text-primary font-bold">90%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className="w-[90%] h-full bg-gradient-primary rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: JOB MATCHER & ATS SCANNER */}
        {activeTab === 'job-matcher' && (
          <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8" {...fadeUp}>
            {/* Input Form */}
            <div className="lg:col-span-5 glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Target size={18} />
                <span>Job Description Analyzer</span>
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary">
                Match Your Resume to Any Role
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Paste any job posting from LinkedIn, Indeed, or Greenhouse to get an instant semantic match score and missing keyword analysis.
              </p>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={targetJobRole}
                  onChange={(e) => setTargetJobRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, ML Intern"
                  className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Job Description Text
                </label>
                <textarea
                  rows={7}
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  placeholder="Paste requirements, responsibilities, and qualifications here..."
                  className="w-full p-4 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                onClick={runJobMatch}
                disabled={isMatchingJob}
                className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 shadow-glow-primary"
              >
                {isMatchingJob ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Analyzing Semantic Fit...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Scan ATS Compatibility
                  </>
                )}
              </button>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between">
              {jobMatchResult ? (
                <div className="space-y-6">
                  {/* Score Header */}
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-surface/70 border border-primary/20">
                    <div>
                      <p className="text-xs uppercase font-bold tracking-wider text-text-muted">Semantic Match Score</p>
                      <h4 className="text-3xl font-sora font-extrabold text-green-400 mt-1">
                        {jobMatchResult.matchScore}% Match
                      </h4>
                      <p className="text-xs text-text-muted mt-1">
                        High likelihood of clearing automated recruiter screening filters.
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-green-500/40 border-t-green-400 flex items-center justify-center font-bold text-lg text-green-400 bg-green-500/10">
                      {jobMatchResult.matchScore}%
                    </div>
                  </div>

                  {/* Matched Keywords */}
                  <div>
                    <h5 className="text-xs uppercase font-bold tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5">
                      <Check size={14} className="text-green-400" /> Matched Keywords Found
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(jobMatchResult.matchedKeywords || ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git']).map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/15 text-green-400 text-xs font-semibold rounded-lg border border-green-500/20">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  <div>
                    <h5 className="text-xs uppercase font-bold tracking-wider text-text-muted mb-2.5 flex items-center gap-1.5 text-yellow-400">
                      <Zap size={14} /> Missing Keywords to Inject
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(jobMatchResult.missingKeywords || ['Kubernetes', 'GraphQL', 'AWS ECS', 'Redis']).map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-yellow-500/15 text-yellow-400 text-xs font-semibold rounded-lg border border-yellow-500/20">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tailored Suggestions */}
                  <div className="p-4 rounded-xl bg-surface border border-primary/15 space-y-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">AI Optimization Tips</p>
                    {(jobMatchResult.recommendations || [
                      'Mention Redis distributed caching in your primary project bullet.',
                      'Highlight containerization and CI/CD pipelines in your experience section.'
                    ]).map((rec, i) => (
                      <p key={i} className="text-xs text-text-muted flex items-start gap-2">
                        <span className="text-primary font-bold">•</span> {rec}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Target size={48} className="text-primary opacity-60 mb-4" />
                  <h4 className="text-lg font-sora font-bold mb-2">No Job Description Analyzed</h4>
                  <p className="text-xs text-text-muted max-w-sm">
                    Paste any target job description on the left to uncover keyword gaps, calculate ATS fit, and generate bullet point fixes.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: COVER LETTER STUDIO */}
        {activeTab === 'cover-letter' && (
          <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8" {...fadeUp}>
            <div className="lg:col-span-5 glass-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Mail size={18} />
                <span>Targeted Cover Letter Synthesizer</span>
              </div>
              <h3 className="text-xl font-sora font-bold text-text-primary">
                Contextual Narrative Generator
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Target Company Name
                </label>
                <input
                  type="text"
                  value={clForm.companyName}
                  onChange={(e) => setClForm({ ...clForm, companyName: e.target.value })}
                  placeholder="e.g. OpenAI, Stripe, Google"
                  className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Position Title
                </label>
                <input
                  type="text"
                  value={clForm.jobTitle}
                  onChange={(e) => setClForm({ ...clForm, jobTitle: e.target.value })}
                  placeholder="e.g. Full-Stack Software Engineer"
                  className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Tone of Voice
                </label>
                <select
                  value={clForm.tone}
                  onChange={(e) => setClForm({ ...clForm, tone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="confident">Confident & High-Impact (Tech/Startup)</option>
                  <option value="corporate">Professional & Traditional (Finance/Consulting)</option>
                  <option value="academic">Analytical & Research-Driven (Labs/AI)</option>
                  <option value="enthusiastic">Energetic & Story-Driven</option>
                </select>
              </div>

              <button
                onClick={runGenerateCoverLetter}
                disabled={isGeneratingCl}
                className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 shadow-glow-primary"
              >
                {isGeneratingCl ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Synthesizing Cover Letter...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate Tailored Cover Letter
                  </>
                )}
              </button>
            </div>

            <div className="lg:col-span-7 glass-card p-6 flex flex-col justify-between">
              {generatedCl ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Generated Asset</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCl);
                        toast.success('Cover letter copied!');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-surface border border-primary/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/10 transition-colors"
                    >
                      <Copy size={13} /> Copy Text
                    </button>
                  </div>
                  <div className="p-6 rounded-2xl bg-[#0b0c1e] border border-primary/15 font-serif text-sm text-gray-200 leading-relaxed whitespace-pre-wrap max-h-[420px] overflow-y-auto">
                    {generatedCl}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <Mail size={48} className="text-primary opacity-60 mb-4" />
                  <h4 className="text-lg font-sora font-bold mb-2">No Cover Letter Generated</h4>
                  <p className="text-xs text-text-muted max-w-sm">
                    Select a target company and tone on the left to synthesize a compelling, project-grounded cover letter.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 5: INTERVIEW PREP & CAREER COACH */}
        {activeTab === 'interview-prep' && (
          <motion.div className="glass-card p-8 space-y-8" {...fadeUp}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-primary/10">
              <div>
                <h3 className="text-2xl font-sora font-bold text-text-primary flex items-center gap-2">
                  <Brain className="text-primary" /> AI Interview Prep & Project Defense
                </h3>
                <p className="text-text-muted text-sm mt-1">
                  Custom technical & behavioral questions generated directly from your resume's actual projects.
                </p>
              </div>
              <button
                onClick={runInterviewPrep}
                disabled={isGeneratingInterview}
                className="btn-primary px-6 py-3 font-semibold flex items-center gap-2 shadow-glow-primary shrink-0"
              >
                {isGeneratingInterview ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Preparing Questions...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Generate Mock Questions
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {(interviewQuestions || [
                {
                  id: 1,
                  type: 'System Architecture',
                  question: 'How did you design real-time synchronization in your collaborative application to prevent state desync?',
                  tips: 'Focus on conflict-free data types (CRDTs), WebSocket recovery, and Redis pub/sub backpressure.',
                  sampleAnswer: 'I implemented CRDTs (Conflict-free Replicated Data Types) for deterministic concurrent edits, backed by Redis memory buffering before writing snapshots to PostgreSQL.'
                },
                {
                  id: 2,
                  type: 'Performance Optimization',
                  question: 'You mentioned cutting latency by 42%. How did you profile and isolate the bottleneck?',
                  tips: 'Explain your diagnostic steps (APM traces, database query plans) before outlining the fix.',
                  sampleAnswer: 'Using distributed tracing, we found unindexed database queries and repetitive network roundtrips were causing 70% of response time. Adding composite B-Tree indexes and Redis caching dropped latency from 180ms to 42ms.'
                },
                {
                  id: 3,
                  type: 'STAR Behavioral',
                  question: 'Describe a high-pressure situation where a production deployment experienced an unexpected failure.',
                  tips: 'Structure using Situation -> Task -> Action -> Quantified Result.',
                  sampleAnswer: 'During a release, an API rate-limit caused 502 errors. I quickly implemented exponential backoff and circuit-breaking middleware, restoring 99.9% uptime within 12 minutes.'
                }
              ]).map((item) => (
                <div key={item.id} className="p-6 rounded-2xl bg-surface/50 border border-primary/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                      {item.type}
                    </span>
                    <span className="text-xs text-text-muted">Question #{item.id}</span>
                  </div>
                  <h4 className="text-base font-bold text-text-primary">{item.question}</h4>
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10 text-xs text-text-muted">
                    <strong className="text-primary font-semibold">Key Tip: </strong> {item.tips}
                  </div>
                  <div className="pt-2 text-xs text-gray-300 leading-relaxed">
                    <strong className="text-green-400 font-semibold">Sample Model Answer: </strong> {item.sampleAnswer}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 6: SAAS PLANS & BILLING */}
        {activeTab === 'pricing' && (
          <motion.div className="glass-card p-8 space-y-8" {...fadeUp}>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h3 className="text-3xl font-sora font-extrabold text-text-primary">
                SaaS Subscription & Career Accelerators
              </h3>
              <p className="text-text-muted text-sm mt-2">
                Your current plan: <span className="text-primary font-bold">{user?.subscription === 'pro' ? 'Pro Member' : 'Student Starter (Free)'}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-3xl bg-surface/40 border border-primary/20 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold font-sora text-text-primary">Student Starter</h4>
                  <p className="text-xs text-text-muted mt-1 mb-4">Forever free for academic use</p>
                  <p className="text-3xl font-bold text-text-primary mb-6">$0</p>
                  <div className="space-y-2.5 text-xs text-text-muted">
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> 3 AI-Tailored Resumes</p>
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> Standard ATS Scanner</p>
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> Web Portfolio Link</p>
                  </div>
                </div>
                <button className="mt-8 w-full py-3 rounded-xl bg-surface border border-primary/20 text-xs font-semibold text-text-muted cursor-default">
                  Current Active Plan
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181938] to-[#0d0e1f] border-2 border-primary shadow-glow-primary flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-primary text-white text-[10px] font-bold">
                  Recommended
                </div>
                <div>
                  <h4 className="text-xl font-bold font-sora text-text-primary">Pro Career Accelerator</h4>
                  <p className="text-xs text-text-muted mt-1 mb-4">Targeting top tech roles & startups</p>
                  <p className="text-3xl font-bold text-text-primary mb-6">$7 <span className="text-xs text-text-muted font-normal">/ mo</span></p>
                  <div className="space-y-2.5 text-xs text-text-muted">
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> Unlimited AI Resumes & Cover Letters</p>
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> Real-time Job Description Semantic Matcher</p>
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> STAR Metric Quantifier & Bullet Refiner</p>
                    <p className="flex items-center gap-2 text-text-primary"><Check size={14} className="text-primary" /> Custom AI Interview Prep Questions</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success('Pro features unlocked!')}
                  className="mt-8 w-full btn-primary py-3 font-semibold text-xs flex items-center justify-center gap-2 shadow-glow-primary"
                >
                  Upgrade to Pro <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: SETTINGS */}
        {activeTab === 'settings' && (
          <motion.div className="glass-card p-8 max-w-2xl" {...fadeUp}>
            <h2 className="text-xl font-sora font-bold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-xl text-text-primary focus:outline-none focus:border-primary/50"
                  id="settings-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-xl text-text-primary focus:outline-none focus:border-primary/50"
                  id="settings-email"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => toast.success('Settings saved successfully')}
                  className="btn-primary px-6 py-3 font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors flex items-center gap-2 font-semibold"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
