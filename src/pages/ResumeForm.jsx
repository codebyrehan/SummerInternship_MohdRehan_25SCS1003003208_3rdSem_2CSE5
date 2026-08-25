import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ChevronRight, ChevronLeft, Sparkles, Plus, Trash2,
  Download, Save, Eye, EyeOff, Loader2, ArrowLeft,
  CheckCircle, User, BookOpen, Code, Briefcase, Star
} from 'lucide-react';
import { generateResumeSummary, improveBullet } from '../services/gemini';
import { saveResume, getDraft, setDraft } from '../services/storage';

const STEPS = ['Personal Info', 'Education', 'Skills', 'Projects', 'Experience', 'Preview & Export'];

const INITIAL = {
  id: null,
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', targetRole: '', summary: '' },
  education: [{ institution: '', degree: '', field: '', gpa: '', startYear: '', endYear: '', achievements: '' }],
  skills: [],
  projects: [{ title: '', description: '', tech: '', link: '', bullets: [''] }],
  experience: [],
  template: 'modern',
};

function Spinner() { return <Loader2 className="w-4 h-4 animate-spin" />; }

function Input({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>}
      <input
        {...props}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm transition-colors"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-white/60 mb-1.5">{label}</label>}
      <textarea
        {...props}
        className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm resize-none transition-colors"
      />
    </div>
  );
}

// ── TEMPLATES ──────────────────────────────────────────────
function ModernTemplate({ data }) {
  const { personalInfo: p, education, skills, projects, experience } = data;
  return (
    <div className="font-['Inter',sans-serif] text-[#1a1a2e] bg-white text-[11px] leading-snug">
      {/* Header */}
      <div className="bg-[#1a1a2e] text-white px-8 py-6">
        <h1 className="text-[22px] font-bold tracking-tight">{p.name || 'Your Name'}</h1>
        <div className="text-purple-300 font-medium mt-0.5">{p.targetRole || 'Software Engineer'}</div>
        <div className="mt-2 flex flex-wrap gap-3 text-white/70 text-[10px]">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>· {p.phone}</span>}
          {p.location && <span>· {p.location}</span>}
          {p.github && <span>· github.com/{p.github}</span>}
          {p.linkedin && <span>· linkedin.com/in/{p.linkedin}</span>}
        </div>
      </div>
      <div className="px-8 py-5 space-y-4">
        {/* Summary */}
        {p.summary && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 border-b border-purple-200 pb-1 mb-2">Profile</div>
            <p className="text-[10px] text-gray-700 leading-relaxed">{p.summary}</p>
          </div>
        )}
        {/* Education */}
        {education?.length > 0 && education[0].institution && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 border-b border-purple-200 pb-1 mb-2">Education</div>
            {education.map((e, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between"><span className="font-semibold">{e.institution}</span><span className="text-gray-500">{e.startYear}{e.endYear ? ' – ' + e.endYear : ''}</span></div>
                <div className="text-gray-600">{e.degree}{e.field ? ', ' + e.field : ''}{e.gpa ? ' · GPA: ' + e.gpa : ''}</div>
                {e.achievements && <div className="text-gray-500 text-[10px] mt-0.5">{e.achievements}</div>}
              </div>
            ))}
          </div>
        )}
        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 border-b border-purple-200 pb-1 mb-2">Technical Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => <span key={s} className="px-2 py-0.5 bg-purple-50 border border-purple-200 rounded text-purple-700 text-[9px]">{s}</span>)}
            </div>
          </div>
        )}
        {/* Projects */}
        {projects?.length > 0 && projects[0].title && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 border-b border-purple-200 pb-1 mb-2">Projects</div>
            {projects.map((pr, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <span className="font-semibold">{pr.title}</span>
                  {pr.tech && <span className="text-gray-500 text-[9px]">{pr.tech}</span>}
                </div>
                <p className="text-gray-600 mt-0.5">{pr.description}</p>
                {pr.bullets?.filter(Boolean).map((b, j) => b && <div key={j} className="text-gray-600 mt-0.5">• {b}</div>)}
              </div>
            ))}
          </div>
        )}
        {/* Experience */}
        {experience?.length > 0 && experience[0].company && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 border-b border-purple-200 pb-1 mb-2">Experience</div>
            {experience.map((ex, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between"><span className="font-semibold">{ex.role}</span><span className="text-gray-500">{ex.startDate}{ex.endDate ? ' – ' + ex.endDate : ''}</span></div>
                <div className="text-gray-600">{ex.company}{ex.location ? ' · ' + ex.location : ''}</div>
                {ex.bullets?.filter(Boolean).map((b, j) => b && <div key={j} className="text-gray-600 mt-0.5">• {b}</div>)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── STEP COMPONENTS ────────────────────────────────────────
function StepPersonal({ data, onChange, onAI }) {
  const [loading, setLoading] = useState(false);
  const p = data.personalInfo;

  const generateSummary = async () => {
    setLoading(true);
    try {
      const summary = await generateResumeSummary({ ...p, skills: data.skills, projects: data.projects });
      onChange({ ...data, personalInfo: { ...p, summary } });
      toast.success('AI summary generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const set = (field, val) => onChange({ ...data, personalInfo: { ...p, [field]: val } });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name *" value={p.name} onChange={e => set('name', e.target.value)} placeholder="Arjun Sharma" />
        <Input label="Target Role *" value={p.targetRole} onChange={e => set('targetRole', e.target.value)} placeholder="Software Engineer" />
        <Input label="Email" type="email" value={p.email} onChange={e => set('email', e.target.value)} placeholder="arjun@email.com" />
        <Input label="Phone" value={p.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        <Input label="Location" value={p.location} onChange={e => set('location', e.target.value)} placeholder="Bangalore, India" />
        <Input label="LinkedIn Username" value={p.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="arjun-sharma" />
        <Input label="GitHub Username" value={p.github} onChange={e => set('github', e.target.value)} placeholder="arjun-dev" />
        <Input label="Portfolio/Website" value={p.website} onChange={e => set('website', e.target.value)} placeholder="arjun.dev" />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-white/60">Professional Summary</label>
          <button
            onClick={generateSummary} disabled={loading || !p.name}
            className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 disabled:opacity-40 transition-colors"
          >
            {loading ? <Spinner /> : <Sparkles className="w-3.5 h-3.5" />}
            {loading ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        <textarea
          value={p.summary} onChange={e => set('summary', e.target.value)}
          placeholder="Write a compelling summary or click Generate with AI..."
          rows={4}
          className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm resize-none"
        />
      </div>
    </div>
  );
}

function StepEducation({ data, onChange }) {
  const edu = data.education;
  const set = (i, field, val) => {
    const arr = [...edu];
    arr[i] = { ...arr[i], [field]: val };
    onChange({ ...data, education: arr });
  };
  const add = () => onChange({ ...data, education: [...edu, { institution: '', degree: '', field: '', gpa: '', startYear: '', endYear: '', achievements: '' }] });
  const remove = (i) => onChange({ ...data, education: edu.filter((_, j) => j !== i) });

  return (
    <div className="space-y-5">
      {edu.map((e, i) => (
        <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Education {i + 1}</span>
            {edu.length > 1 && <button onClick={() => remove(i)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Institution *" value={e.institution} onChange={ev => set(i, 'institution', ev.target.value)} placeholder="IIT Delhi" />
            <Input label="Degree *" value={e.degree} onChange={ev => set(i, 'degree', ev.target.value)} placeholder="B.Tech" />
            <Input label="Field of Study" value={e.field} onChange={ev => set(i, 'field', ev.target.value)} placeholder="Computer Science" />
            <Input label="GPA / Percentage" value={e.gpa} onChange={ev => set(i, 'gpa', ev.target.value)} placeholder="8.5 / 10" />
            <Input label="Start Year" value={e.startYear} onChange={ev => set(i, 'startYear', ev.target.value)} placeholder="2021" />
            <Input label="End Year" value={e.endYear} onChange={ev => set(i, 'endYear', ev.target.value)} placeholder="2025 (or Expected)" />
          </div>
          <Input label="Relevant Coursework / Achievements" value={e.achievements} onChange={ev => set(i, 'achievements', ev.target.value)} placeholder="Data Structures, OS, DBMS, Algorithms, Hackathon Winner..." />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </div>
  );
}

function StepSkills({ data, onChange }) {
  const [input, setInput] = useState('');
  const skills = data.skills || [];

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) { setInput(''); return; }
    onChange({ ...data, skills: [...skills, trimmed] });
    setInput('');
  };

  const PRESETS = [
    ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB'],
    ['Java', 'C++', 'Docker', 'AWS', 'Git', 'Linux'],
    ['Machine Learning', 'TensorFlow', 'Data Analysis', 'Tableau', 'Pandas'],
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSkill()}
          placeholder="Type a skill and press Enter..."
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm"
        />
        <button onClick={addSkill} className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm transition-colors">Add</button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm">
              {s}
              <button onClick={() => onChange({ ...data, skills: skills.filter(x => x !== s) })} className="hover:text-red-300 transition-colors">×</button>
            </span>
          ))}
        </div>
      )}

      <div>
        <div className="text-xs text-white/40 mb-2">Quick add popular skills:</div>
        <div className="space-y-2">
          {PRESETS.map((group, i) => (
            <div key={i} className="flex flex-wrap gap-2">
              {group.map(s => (
                <button
                  key={s} onClick={() => !skills.includes(s) && onChange({ ...data, skills: [...skills, s] })}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${skills.includes(s) ? 'bg-violet-600 border-violet-500 text-white' : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepProjects({ data, onChange }) {
  const projects = data.projects;
  const [improving, setImproving] = useState({});

  const set = (i, field, val) => {
    const arr = [...projects];
    arr[i] = { ...arr[i], [field]: val };
    onChange({ ...data, projects: arr });
  };
  const setBullet = (pi, bi, val) => {
    const arr = [...projects];
    const bullets = [...(arr[pi].bullets || [])];
    bullets[bi] = val;
    arr[pi] = { ...arr[pi], bullets };
    onChange({ ...data, projects: arr });
  };
  const addBullet = (pi) => {
    const arr = [...projects];
    arr[pi] = { ...arr[pi], bullets: [...(arr[pi].bullets || []), ''] };
    onChange({ ...data, projects: arr });
  };
  const improveBulletPoint = async (pi, bi) => {
    const bullet = projects[pi].bullets[bi];
    if (!bullet) return;
    const key = `${pi}-${bi}`;
    setImproving(prev => ({ ...prev, [key]: true }));
    try {
      const improved = await improveBullet(bullet, projects[pi].title + ' - ' + projects[pi].description);
      setBullet(pi, bi, improved);
      toast.success('Bullet improved!');
    } catch (err) { toast.error(err.message); }
    finally { setImproving(prev => ({ ...prev, [key]: false })); }
  };
  const add = () => onChange({ ...data, projects: [...projects, { title: '', description: '', tech: '', link: '', bullets: [''] }] });
  const remove = (i) => onChange({ ...data, projects: projects.filter((_, j) => j !== i) });

  return (
    <div className="space-y-5">
      {projects.map((pr, i) => (
        <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Project {i + 1}</span>
            {projects.length > 1 && <button onClick={() => remove(i)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Project Title *" value={pr.title} onChange={e => set(i, 'title', e.target.value)} placeholder="AI Resume Builder" />
            <Input label="Tech Stack" value={pr.tech} onChange={e => set(i, 'tech', e.target.value)} placeholder="React, Node.js, MongoDB" />
          </div>
          <Textarea label="Description" value={pr.description} onChange={e => set(i, 'description', e.target.value)} rows={2} placeholder="Brief description of what the project does..." />
          <Input label="Project Link / GitHub" value={pr.link} onChange={e => set(i, 'link', e.target.value)} placeholder="https://github.com/..." />
          <div>
            <label className="text-xs font-medium text-white/60 block mb-2">Bullet Points (AI can improve these)</label>
            <div className="space-y-2">
              {(pr.bullets || ['']).map((b, bi) => (
                <div key={bi} className="flex gap-2">
                  <input
                    value={b} onChange={e => setBullet(i, bi, e.target.value)}
                    placeholder="Developed feature that improved performance by X%..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm"
                  />
                  <button
                    onClick={() => improveBulletPoint(i, bi)} disabled={!b || improving[`${i}-${bi}`]}
                    className="px-2.5 py-2 rounded-lg bg-violet-500/15 border border-violet-500/20 text-violet-400 hover:bg-violet-500/25 disabled:opacity-40 text-xs transition-colors flex items-center gap-1"
                    title="Improve with AI"
                  >
                    {improving[`${i}-${bi}`] ? <Spinner /> : <Sparkles className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => addBullet(i)} className="mt-2 text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> Add bullet
            </button>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>
  );
}

function StepExperience({ data, onChange }) {
  const exp = data.experience || [];
  const set = (i, field, val) => {
    const arr = [...exp];
    arr[i] = { ...arr[i], [field]: val };
    onChange({ ...data, experience: arr });
  };
  const setBullet = (ei, bi, val) => {
    const arr = [...exp];
    const bullets = [...(arr[ei].bullets || [])];
    bullets[bi] = val;
    arr[ei] = { ...arr[ei], bullets };
    onChange({ ...data, experience: arr });
  };
  const add = () => onChange({ ...data, experience: [...exp, { company: '', role: '', location: '', startDate: '', endDate: '', bullets: [''] }] });
  const remove = (i) => onChange({ ...data, experience: exp.filter((_, j) => j !== i) });

  return (
    <div className="space-y-5">
      {exp.length === 0 && (
        <p className="text-white/40 text-sm">No experience yet? Internships, freelance, part-time roles all count!</p>
      )}
      {exp.map((ex, i) => (
        <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Experience {i + 1}</span>
            <button onClick={() => remove(i)} className="text-white/30 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Company *" value={ex.company} onChange={e => set(i, 'company', e.target.value)} placeholder="Google" />
            <Input label="Role *" value={ex.role} onChange={e => set(i, 'role', e.target.value)} placeholder="Software Intern" />
            <Input label="Location" value={ex.location} onChange={e => set(i, 'location', e.target.value)} placeholder="Remote / Bangalore" />
            <Input label="Start Date" value={ex.startDate} onChange={e => set(i, 'startDate', e.target.value)} placeholder="May 2024" />
            <Input label="End Date" value={ex.endDate} onChange={e => set(i, 'endDate', e.target.value)} placeholder="Aug 2024 / Present" />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 block mb-2">Responsibilities & Achievements</label>
            <div className="space-y-2">
              {(ex.bullets || ['']).map((b, bi) => (
                <input key={bi} value={b} onChange={e => setBullet(i, bi, e.target.value)}
                  placeholder="Built feature X resulting in Y% improvement..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 text-sm" />
              ))}
            </div>
            <button onClick={() => { const arr=[...exp]; arr[i]={...arr[i],bullets:[...(arr[i].bullets||[]),'']};onChange({...data,experience:arr}); }} className="mt-2 text-xs text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3" /> Add bullet
            </button>
          </div>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
        <Plus className="w-4 h-4" /> Add Experience
      </button>
    </div>
  );
}

function StepPreview({ data }) {
  const previewRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const element = previewRef.current;
      await html2pdf().set({
        margin: 0,
        filename: `${data.personalInfo.name || 'resume'}_resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(element).save();
      toast.success('Resume downloaded!');
    } catch (err) { toast.error('Download failed: ' + err.message); }
    finally { setDownloading(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Resume Preview</h3>
          <p className="text-sm text-white/50">Looks good? Download as PDF.</p>
        </div>
        <button
          onClick={downloadPDF} disabled={downloading}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {downloading ? <><Spinner /> Exporting...</> : <><Download className="w-4 h-4" /> Download PDF</>}
        </button>
      </div>
      <div className="rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div ref={previewRef} className="bg-white" style={{ minHeight: '297mm' }}>
          <ModernTemplate data={data} />
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ─────────────────────────────────────────
export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(() => getDraft() || { ...INITIAL });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Auto-save draft
  useEffect(() => {
    setDraft(data);
  }, [data]);

  const save = () => {
    const saved = saveResume(data);
    setData(prev => ({ ...prev, id: saved.id }));
    toast.success('Resume saved!');
  };

  const STEP_COMPONENTS = [
    <StepPersonal data={data} onChange={setData} />,
    <StepEducation data={data} onChange={setData} />,
    <StepSkills data={data} onChange={setData} />,
    <StepProjects data={data} onChange={setData} />,
    <StepExperience data={data} onChange={setData} />,
    <StepPreview data={data} />,
  ];

  const STEP_ICONS = [User, BookOpen, Star, Code, Briefcase, Eye];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">Resume Builder</span>
          </div>
        </div>
        <button
          onClick={save}
          className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      {/* Stepper */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <button key={s} onClick={() => setStep(i)} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${i === step ? 'bg-violet-600 text-white' : i < step ? 'text-emerald-400 hover:bg-white/5' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                  {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">{s}</span>
                </div>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-white/20" />}
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold mb-1">{STEPS[step]}</h2>
            <p className="text-white/50 text-sm mb-6">
              {['Tell us about yourself', 'Your academic background', 'What tools and technologies you know', 'Showcase your best work', 'Relevant work experience', 'Review and download your resume'][step]}
            </p>
            {STEP_COMPONENTS[step]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { save(); navigate('/dashboard'); }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Save & Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
