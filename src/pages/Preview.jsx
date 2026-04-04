import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import html2pdf from 'html2pdf.js';
import {
  Download, LayoutTemplate, Sparkles, Loader2, Check, X, ExternalLink,
  FileText, Target, Brain, Lightbulb, PenTool, Copy,
  ChevronDown, ChevronRight, Palette, FolderOpen
} from 'lucide-react';
import { FiLinkedin as Linkedin } from 'react-icons/fi';
import { TEMPLATES, ACCENT_PRESETS } from '../components/templates/ResumeTemplates';
import {
  improveBullet, improveProject, checkAtsScore, matchJob,
  generateSummary, generateCoverLetter, generateLinkedin, suggestSkills
} from '../services/aiService';
import toast from 'react-hot-toast';
import useResumeStore from '../stores/resumeStore';
import api from '../services/api';

export default function Preview() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage('resume_data', null);
  const [template, setTemplate] = useState('modern-pro');
  const [accentColor, setAccentColor] = useState('#6366f1');
  const resumeRef = useRef();
  const [activePanel, setActivePanel] = useState('templates'); // templates, ai-tools
  const { currentResume } = useResumeStore();
  
  // AI States
  const [aiLoading, setAiLoading] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [atsResult, setAtsResult] = useState(null);
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [coverLetterResult, setCoverLetterResult] = useState(null);
  const [linkedinResult, setLinkedinResult] = useState(null);
  const [skillSuggestions, setSkillSuggestions] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetterForm, setCoverLetterForm] = useState({ jobTitle: '', companyName: '', jobDescription: '' });
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showJobMatchModal, setShowJobMatchModal] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [showSkillsModal, setShowSkillsModal] = useState(false);

  if (!data) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-text-primary">
        <FileText size={48} className="mx-auto mb-4 text-text-muted" />
        <h2 className="text-2xl font-sora font-bold mb-2">No Resume Data</h2>
        <p className="text-text-muted mb-6">Create a resume first to preview it.</p>
        <button onClick={() => navigate('/build')} className="btn-primary px-6 py-3">Build Resume</button>
      </div>
    </div>
  );

  const handleDownload = () => {
    const element = resumeRef.current;
    toast.loading('Generating PDF...', { id: 'pdf' });
    html2pdf().from(element).set({
      margin: [0, 0, 0, 0],
      filename: `${(data.personalInfo?.name || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save().then(() => {
      toast.success('PDF downloaded!', { id: 'pdf' });
    });
  };

  const handleServerDownload = async () => {
    if (!currentResume?._id) {
      return toast.error('Please save your resume first before cloud export.');
    }
    const element = resumeRef.current;
    if (!element) return;
    
    setAiLoading('pdf-server');
    toast.loading('Generating HD PDF via Cloud...', { id: 'hd-pdf' });
    try {
      const html = element.outerHTML;
      const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map(el => el.outerHTML)
        .join('\n');
        
      const styledHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Resume</title>
            ${styleTags}
            <style>
              body { margin: 0; padding: 0; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 0; size: A4; }
            </style>
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;
      
      const { data: responseData } = await api.post(`/resumes/${currentResume._id}/export`, { html: styledHtml });
      if (responseData?.data?.pdfUrl) {
         window.open(responseData.data.pdfUrl, '_blank');
         toast.success('HD PDF Generated!', { id: 'hd-pdf' });
      }
    } catch (err) {
      console.error(err);
      toast.error('HD PDF generation failed', { id: 'hd-pdf' });
    }
    setAiLoading(null);
  };

  const username = data.personalInfo?.name ? data.personalInfo.name.toLowerCase().replace(/\s+/g, '') : 'demo';

  // AI Handlers
  const handleImproveBullet = async (key, index, field, text) => {
    if (!text) return;
    setAiLoading(`${key}-${index}`);
    try {
      const result = key === 'projects' ? await improveProject(text) : await improveBullet(text);
      setAiSuggestion({ key, index, field, original: text, text: result.improved });
    } catch (e) {
      toast.error('AI service unavailable');
    }
    setAiLoading(null);
  };

  const acceptAiSuggestion = () => {
    if (!aiSuggestion) return;
    const updated = [...data[aiSuggestion.key]];
    updated[aiSuggestion.index][aiSuggestion.field] = aiSuggestion.text;
    setData({ ...data, [aiSuggestion.key]: updated });
    setAiSuggestion(null);
    toast.success('AI suggestion accepted!');
  };

  const getResumeText = () => {
    const sections = [
      data.personalInfo?.name,
      data.personalInfo?.jobTitle,
      data.personalInfo?.summary,
      ...(data.skills || []),
      ...(data.experience || []).map(e => `${e.title} at ${e.company}: ${e.description}`),
      ...(data.projects || []).map(p => `${p.name} (${p.tech}): ${p.description}`),
      ...(data.education || []).map(e => `${e.degree} from ${e.institution}`),
      typeof data.certifications === 'string' ? data.certifications : '',
    ];
    return sections.filter(Boolean).join('\n');
  };

  const handleAtsCheck = async () => {
    setAiLoading('ats');
    try {
      const result = await checkAtsScore(getResumeText());
      setAtsResult(result);
      setShowAtsModal(true);
    } catch (e) {
      toast.error('ATS check failed');
    }
    setAiLoading(null);
  };

  const handleJobMatch = async () => {
    if (!jobDescription.trim()) return toast.error('Please paste a job description');
    setAiLoading('job-match');
    try {
      const result = await matchJob(getResumeText(), jobDescription);
      setJobMatchResult(result);
      setShowJobMatchModal(true);
    } catch (e) {
      toast.error('Job matching failed');
    }
    setAiLoading(null);
  };

  const handleGenerateSummary = async () => {
    setAiLoading('summary');
    try {
      const result = await generateSummary(
        data.personalInfo?.name,
        data.personalInfo?.jobTitle || data.experience?.[0]?.title,
        data.skills,
        data.experience?.map(e => `${e.title} at ${e.company}`).join(', ')
      );
      setData({ ...data, personalInfo: { ...data.personalInfo, summary: result.summary } });
      toast.success('Summary generated!');
    } catch (e) {
      toast.error('Summary generation failed');
    }
    setAiLoading(null);
  };

  const handleCoverLetter = async () => {
    if (!coverLetterForm.jobTitle || !coverLetterForm.companyName) return toast.error('Fill in job title and company');
    setAiLoading('cover-letter');
    try {
      const result = await generateCoverLetter(
        data, coverLetterForm.jobTitle, coverLetterForm.companyName, coverLetterForm.jobDescription
      );
      setCoverLetterResult(result.content);
      setShowCoverLetterModal(true);
    } catch (e) {
      toast.error('Cover letter generation failed');
    }
    setAiLoading(null);
  };

  const handleLinkedin = async () => {
    setAiLoading('linkedin');
    try {
      const result = await generateLinkedin(
        data.personalInfo?.jobTitle || data.experience?.[0]?.title,
        data.skills,
        data.experience?.map(e => `${e.title} at ${e.company}`).join(', ')
      );
      setLinkedinResult(result);
      setShowLinkedinModal(true);
    } catch (e) {
      toast.error('LinkedIn generation failed');
    }
    setAiLoading(null);
  };

  const handleSuggestSkills = async () => {
    setAiLoading('skills');
    try {
      const result = await suggestSkills(
        data.personalInfo?.jobTitle || data.experience?.[0]?.title,
        data.skills
      );
      setSkillSuggestions(result);
      setShowSkillsModal(true);
    } catch (e) {
      toast.error('Skill suggestions failed');
    }
    setAiLoading(null);
  };

  const handleReviseAll = async (section) => {
    setAiLoading(`revise-${section}`);
    const items = data[section] || [];
    if (items.length === 0) {
      setAiLoading(null);
      return toast.error(`No ${section} to revise!`);
    }

    toast.loading(`Revising all ${section}...`, { id: 'revise' });
    try {
      const updated = await Promise.all(items.map(async (item) => {
        const text = item.description;
        if (!text) return item;
        const result = section === 'projects' ? await improveProject(text) : await improveBullet(text);
        return { ...item, description: result.improved };
      }));
      setData({ ...data, [section]: updated });
      toast.success(`${section === 'projects' ? 'Projects' : 'Experiences'} optimized!`, { id: 'revise' });
    } catch (e) {
      toast.error('Revision failed', { id: 'revise' });
    }
    setAiLoading(null);
  };

  const addSkillFromSuggestion = (skill) => {
    if (!data.skills?.includes(skill)) {
      setData({ ...data, skills: [...(data.skills || []), skill] });
      toast.success(`Added "${skill}"`);
    }
  };

  const TemplateComponent = TEMPLATES[template]?.component;

  // Score ring for ATS
  const ScoreRing = ({ score, size = 100 }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
    return (
      <svg width={size} height={size} className="mx-auto">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#1e293b" strokeWidth="8" fill="none" />
        <circle
          cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth="8" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold" fill={color}>{score}</text>
      </svg>
    );
  };

  const handleGeneratePortfolio = async () => {
    if (!currentResume?._id) return toast.error('Please save your resume first.');
    setAiLoading('portfolio');
    try {
      await api.post('/portfolios', {
        resumeId: currentResume._id,
        slug: username,
        theme: 'dark-navy',
        resumeData: data
      });
      toast.success('Portfolio published!');
      navigate(`/portfolio/${username}`);
    } catch (err) {
      toast.error('Failed to generate portfolio');
    }
    setAiLoading(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-surface p-5 border-r border-primary/10 flex flex-col gap-4 flex-shrink-0 z-10 overflow-y-auto max-h-screen">
        <h2 className="text-lg font-sora font-bold text-text-primary flex items-center gap-2">
          <LayoutTemplate size={20} className="text-primary" /> Resume Preview
        </h2>

        {/* Panel Tabs */}
        <div className="flex gap-1 bg-background p-1 rounded-lg">
          <button onClick={() => setActivePanel('templates')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${activePanel === 'templates' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}>
            Templates
          </button>
          <button onClick={() => setActivePanel('ai-tools')} className={`flex-1 py-2 rounded-md text-xs font-medium transition-all ${activePanel === 'ai-tools' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}>
            AI Tools
          </button>
        </div>

        {activePanel === 'templates' && (
          <>
            {/* Template Selection */}
            <div className="space-y-2">
              {Object.entries(TEMPLATES).map(([key, tmpl]) => (
                <button
                  key={key}
                  className={`w-full py-2.5 px-3 rounded-lg text-left text-sm transition-all ${template === key ? 'bg-primary text-white shadow-glow-primary' : 'bg-background text-text-muted hover:text-text-primary hover:bg-card'}`}
                  onClick={() => setTemplate(key)}
                >
                  <span className="font-medium block">{tmpl.label}</span>
                  <span className="text-[10px] opacity-70">{tmpl.description}</span>
                </button>
              ))}
            </div>

            {/* Color Picker */}
            <div>
              <p className="text-xs text-text-muted mb-2 font-medium flex items-center gap-1"><Palette size={12} /> Accent Color</p>
              <div className="flex gap-2">
                {ACCENT_PRESETS.map(color => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activePanel === 'ai-tools' && (
          <div className="space-y-2">
            {[
              { label: 'ATS Score Check', icon: Target, handler: handleAtsCheck, loading: aiLoading === 'ats', desc: 'Analyze ATS compatibility' },
              { label: 'Generate Summary', icon: Brain, handler: handleGenerateSummary, loading: aiLoading === 'summary', desc: 'AI-written professional summary' },
              { label: 'Optimize Experiences', icon: Sparkles, handler: () => handleReviseAll('experience'), loading: aiLoading === 'revise-experience', desc: 'Rewrite work history with action verbs' },
              { label: 'Optimize Projects', icon: FolderOpen, handler: () => handleReviseAll('projects'), loading: aiLoading === 'revise-projects', desc: 'Enhance technical project impact' },
              { label: 'Cover Letter', icon: FileText, handler: () => setShowCoverLetterModal(true), loading: false, desc: 'Generate personalized cover letter' },
              { label: 'LinkedIn Generator', icon: Linkedin, handler: handleLinkedin, loading: aiLoading === 'linkedin', desc: 'Headlines & About section' },
              { label: 'Skill Suggestions', icon: Lightbulb, handler: handleSuggestSkills, loading: aiLoading === 'skills', desc: 'AI-suggested trending skills' },
            ].map((tool) => (
              <button
                key={tool.label}
                onClick={tool.handler}
                disabled={tool.loading}
                className="w-full py-3 px-3 rounded-lg bg-background text-left hover:bg-card transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  {tool.loading ? <Loader2 size={16} className="text-primary animate-spin" /> : <tool.icon size={16} className="text-primary" />}
                  <span className="text-sm font-medium text-text-primary">{tool.label}</span>
                </div>
                <p className="text-[10px] text-text-muted mt-0.5 ml-6">{tool.desc}</p>
              </button>
            ))}

            {/* Job Match with textarea */}
            <div className="bg-background rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">Job Match</span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full p-2 text-xs bg-surface border border-primary/15 rounded-lg text-text-primary placeholder:text-text-muted/50 resize-none h-20 focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={handleJobMatch}
                disabled={aiLoading === 'job-match'}
                className="w-full mt-2 py-2 bg-primary/20 text-primary rounded-lg text-xs font-medium hover:bg-primary/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {aiLoading === 'job-match' ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
                Analyze Match
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto space-y-2 pt-4 border-t border-primary/10">
          <button onClick={handleDownload} className="w-full py-2 bg-gradient-primary text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-glow-primary transition-all text-sm">
            <Download size={16} /> Save Local PDF
          </button>
          <button onClick={handleServerDownload} disabled={aiLoading === 'pdf-server'} className="w-full py-2 border border-primary/30 bg-primary/10 text-primary rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-primary/20 transition-all text-sm disabled:opacity-50">
            {aiLoading === 'pdf-server' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
            HD Cloud PDF
          </button>
          <button onClick={handleGeneratePortfolio} disabled={aiLoading === 'portfolio'} className="w-full py-2 border border-primary/30 text-text-primary rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-surface transition-all text-sm disabled:opacity-50">
            {aiLoading === 'portfolio' ? <Loader2 size={14} className="animate-spin" /> : 'Generate Portfolio'} <ExternalLink size={14} />
          </button>
          <button onClick={() => navigate('/build')} className="w-full py-2 text-text-muted text-sm hover:text-text-primary transition-colors">
            ← Edit Resume
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto flex items-start justify-center bg-background">
        {/* AI Suggestion Modal */}
        {aiSuggestion && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setAiSuggestion(null)}>
            <div className="glass-card w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-sora font-bold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> AI Suggestion
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-surface rounded-lg border border-primary/10">
                  <p className="text-[10px] text-text-muted font-bold mb-2 uppercase">Original</p>
                  <p className="text-sm text-text-muted">{aiSuggestion.original}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-[10px] text-primary font-bold mb-2 uppercase flex items-center gap-1"><Sparkles size={10} /> AI Improved</p>
                  <p className="text-sm text-text-primary">{aiSuggestion.text}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setAiSuggestion(null)} className="px-5 py-2 rounded-lg border border-primary/20 text-text-muted hover:text-text-primary text-sm">Keep Original</button>
                <button onClick={acceptAiSuggestion} className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 text-sm font-medium">Accept AI Version</button>
              </div>
            </div>
          </div>
        )}

        {/* ATS Score Modal */}
        {showAtsModal && atsResult && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowAtsModal(false)}>
            <div className="glass-card w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-sora font-bold text-text-primary mb-4">ATS Score Analysis</h3>
              <ScoreRing score={atsResult.score} />
              <p className="text-center text-text-muted text-sm mt-2 mb-6">ATS Compatibility Score</p>
              
              {atsResult.strengths?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">✅ Strengths</h4>
                  {atsResult.strengths.map((s, i) => <p key={i} className="text-xs text-text-muted pl-4 mb-1">• {s}</p>)}
                </div>
              )}
              {atsResult.weaknesses?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-2">❌ Weaknesses</h4>
                  {atsResult.weaknesses.map((w, i) => <p key={i} className="text-xs text-text-muted pl-4 mb-1">• {w}</p>)}
                </div>
              )}
              {atsResult.suggestions?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">💡 Suggestions</h4>
                  {atsResult.suggestions.map((s, i) => <p key={i} className="text-xs text-text-muted pl-4 mb-1">• {s}</p>)}
                </div>
              )}
              <button onClick={() => setShowAtsModal(false)} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg font-medium">Close</button>
            </div>
          </div>
        )}

        {/* Job Match Modal */}
        {showJobMatchModal && jobMatchResult && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowJobMatchModal(false)}>
            <div className="glass-card w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-sora font-bold text-text-primary mb-4">Job Match Analysis</h3>
              <ScoreRing score={jobMatchResult.matchScore} />
              <p className="text-center text-text-muted text-sm mt-2 mb-6">Match Score</p>
              
              {jobMatchResult.strongMatches?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">Strong Matches</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatchResult.strongMatches.map((k, i) => <span key={i} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">{k}</span>)}
                  </div>
                </div>
              )}
              {jobMatchResult.missingKeywords?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-red-400 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {jobMatchResult.missingKeywords.map((k, i) => <span key={i} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">{k}</span>)}
                  </div>
                </div>
              )}
              {jobMatchResult.tailoredSuggestions?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">Tailored Suggestions</h4>
                  {jobMatchResult.tailoredSuggestions.map((s, i) => <p key={i} className="text-xs text-text-muted pl-4 mb-1">• {s}</p>)}
                </div>
              )}
              <button onClick={() => setShowJobMatchModal(false)} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg font-medium">Close</button>
            </div>
          </div>
        )}

        {/* Cover Letter Modal */}
        {showCoverLetterModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCoverLetterModal(false)}>
            <div className="glass-card w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-sora font-bold text-text-primary mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Cover Letter Generator
              </h3>
              {!coverLetterResult ? (
                <div className="space-y-3">
                  <input
                    type="text" placeholder="Job Title *" value={coverLetterForm.jobTitle}
                    onChange={e => setCoverLetterForm({ ...coverLetterForm, jobTitle: e.target.value })}
                    className="w-full p-3 bg-surface border border-primary/15 rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50"
                  />
                  <input
                    type="text" placeholder="Company Name *" value={coverLetterForm.companyName}
                    onChange={e => setCoverLetterForm({ ...coverLetterForm, companyName: e.target.value })}
                    className="w-full p-3 bg-surface border border-primary/15 rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-primary/50"
                  />
                  <textarea
                    placeholder="Job Description (optional)" value={coverLetterForm.jobDescription}
                    onChange={e => setCoverLetterForm({ ...coverLetterForm, jobDescription: e.target.value })}
                    className="w-full p-3 bg-surface border border-primary/15 rounded-lg text-sm text-text-primary placeholder:text-text-muted/50 resize-none h-24 focus:outline-none focus:border-primary/50"
                  />
                  <button
                    onClick={handleCoverLetter}
                    disabled={aiLoading === 'cover-letter'}
                    className="w-full py-3 bg-gradient-primary text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {aiLoading === 'cover-letter' ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    Generate Cover Letter
                  </button>
                </div>
              ) : (
                <div>
                  <div className="bg-surface p-4 rounded-lg border border-primary/10 mb-4">
                    <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{coverLetterResult}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(coverLetterResult); toast.success('Copied!'); }}
                      className="flex-1 py-2.5 bg-surface border border-primary/20 rounded-lg text-sm text-text-primary flex items-center justify-center gap-1 hover:bg-card"
                    >
                      <Copy size={14} /> Copy
                    </button>
                    <button
                      onClick={() => { setCoverLetterResult(null); setCoverLetterForm({ jobTitle: '', companyName: '', jobDescription: '' }); }}
                      className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>
              )}
              <button onClick={() => { setShowCoverLetterModal(false); setCoverLetterResult(null); }} className="w-full mt-3 py-2 text-text-muted text-sm hover:text-text-primary">Close</button>
            </div>
          </div>
        )}

        {/* LinkedIn Modal */}
        {showLinkedinModal && linkedinResult && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowLinkedinModal(false)}>
            <div className="glass-card w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-sora font-bold text-text-primary mb-4 flex items-center gap-2">
                <Linkedin size={18} className="text-primary" /> LinkedIn Content
              </h3>
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-text-primary mb-2">Headlines (choose one)</h4>
                {linkedinResult.headlines?.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <p className="flex-1 text-xs text-text-muted bg-surface p-2.5 rounded-lg border border-primary/10">{h}</p>
                    <button onClick={() => { navigator.clipboard.writeText(h); toast.success('Copied!'); }} className="p-2 hover:bg-card rounded-lg"><Copy size={14} className="text-primary" /></button>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-2">About Section</h4>
                <textarea
                  defaultValue={linkedinResult.about}
                  className="w-full p-3 bg-surface border border-primary/15 rounded-lg text-sm text-text-primary resize-none h-32"
                />
                <button
                  onClick={() => { navigator.clipboard.writeText(linkedinResult.about); toast.success('Copied!'); }}
                  className="mt-2 px-4 py-2 bg-surface border border-primary/20 rounded-lg text-xs text-text-primary flex items-center gap-1 hover:bg-card"
                >
                  <Copy size={12} /> Copy About
                </button>
              </div>
              <button onClick={() => setShowLinkedinModal(false)} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg font-medium">Close</button>
            </div>
          </div>
        )}

        {/* Skills Suggestions Modal */}
        {showSkillsModal && skillSuggestions && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSkillsModal(false)}>
            <div className="glass-card w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-sora font-bold text-text-primary mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-primary" /> Suggested Skills for 2025
              </h3>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-primary mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.technicalSkills?.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => addSkillFromSuggestion(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${data.skills?.includes(s) ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white cursor-pointer'}`}
                    >
                      {data.skills?.includes(s) ? '✓ ' : '+ '}{s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-secondary mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skillSuggestions.softSkills?.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => addSkillFromSuggestion(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${data.skills?.includes(s) ? 'bg-green-500/20 text-green-400 cursor-default' : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white cursor-pointer'}`}
                    >
                      {data.skills?.includes(s) ? '✓ ' : '+ '}{s}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowSkillsModal(false)} className="w-full mt-4 py-2.5 bg-primary text-white rounded-lg font-medium">Done</button>
            </div>
          </div>
        )}

        {/* Resume Render */}
        <div className="bg-white shadow-2xl mx-auto" style={{ width: '210mm', minHeight: '297mm' }}>
          <div ref={resumeRef} className="w-full h-full bg-white relative">
            {TemplateComponent && (
              <TemplateComponent data={data} accentColor={accentColor} />
            )}
          </div>
        </div>

        {/* Inline AI improve buttons overlay */}
        <div className="fixed bottom-6 right-6 z-40 no-print">
          <div className="bg-surface/90 backdrop-blur-xl border border-primary/20 rounded-2xl p-2 flex gap-2 shadow-2xl">
            <button
              onClick={handleAtsCheck}
              disabled={aiLoading === 'ats'}
              className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              title="Check ATS Score"
            >
              {aiLoading === 'ats' ? <Loader2 size={18} className="animate-spin" /> : <Target size={18} />}
            </button>
            <button
              onClick={handleGenerateSummary}
              disabled={aiLoading === 'summary'}
              className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
              title="Generate Summary"
            >
              {aiLoading === 'summary' ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
            </button>
            <button onClick={handleDownload} className="p-3 rounded-xl bg-gradient-primary text-white" title="Download PDF">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      <style>{`@media print { .no-print { display: none !important; } }`}</style>
    </div>
  );
}
