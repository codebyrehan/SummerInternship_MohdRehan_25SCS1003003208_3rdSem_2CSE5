import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Plus, X, User, GraduationCap,
  Wrench, Briefcase, FolderOpen, Award, Sparkles, Save, Loader2,
  History, Zap, RefreshCw, Eye
} from 'lucide-react';
import { FiGithub as Github } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import useResumeStore from '../stores/resumeStore';
import { improveBullet, improveProject } from '../services/aiService';
import { STUDENT_PERSONAS } from '../data/studentPersonas';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';

const emptyResumeData = {
  personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', location: '', jobTitle: '', summary: '' },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: ''
};

const stepIcons = [User, GraduationCap, Wrench, Briefcase, FolderOpen, Award];
const stepLabels = ['Personal Info', 'Education', 'Skills', 'Experience', 'Projects', 'Certifications'];

export default function ResumeForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const { isAuthenticated } = useAuthStore();
  const { createResume, updateResume, fetchResume, isSaving } = useResumeStore();
  const [data, setData] = useLocalStorage('resume_data', emptyResumeData);
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [errors, setErrors] = useState({});
  const [isEnhancing, setIsEnhancing] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Load existing resume for editing
  useEffect(() => {
    if (editId && isAuthenticated) {
      fetchResume(editId).then(resume => {
        if (resume) {
          setData({
            personalInfo: resume.personalInfo || emptyResumeData.personalInfo,
            education: resume.education || [],
            skills: [...(resume.technicalSkills || []), ...(resume.softSkills || [])],
            experience: resume.experience || [],
            projects: resume.projects || [],
            certifications: resume.certificationsText || '',
          });
        }
      });
    }
  }, [editId]);

  const loadPersona = (persona) => {
    setData(persona.data);
    toast.success('Loaded preset: ' + persona.title);
  };

  const handleAiEnhanceBullet = async (text, setter) => {
    if (!text || text.trim().length < 5) {
      return toast.error('Please write a brief description first for AI to enhance');
    }
    setIsEnhancing(text);
    try {
      const res = await improveBullet(text);
      setter(res.improved || res);
      toast.success('Bullet enhanced with STAR metrics!');
    } catch {
      toast.error('Failed to enhance bullet');
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleAiEnhanceProject = async (text, setter) => {
    if (!text || text.trim().length < 5) {
      return toast.error('Please write a brief project description first');
    }
    setIsEnhancing(text);
    try {
      const res = await improveProject(text);
      setter(res.improved || res);
      toast.success('Project architecture & metrics enhanced!');
    } catch {
      toast.error('Failed to enhance project');
    } finally {
      setIsEnhancing(null);
    }
  };

  const addSkill = () => {
    if (!newSkillInput.trim()) return;
    if (data.skills && data.skills.includes(newSkillInput.trim())) {
      return toast.error('Skill already added');
    }
    setData({ ...data, skills: [...(data.skills || []), newSkillInput.trim()] });
    setNewSkillInput('');
  };

  const removeSkill = (index) => {
    const updated = [...(data.skills || [])];
    updated.splice(index, 1);
    setData({ ...data, skills: updated });
  };

  const handleSaveToCloud = async () => {
    if (!isAuthenticated) {
      toast('Saved locally! Sign in to sync across devices.', { icon: '💾' });
      navigate('/preview');
      return;
    }
    try {
      const payload = {
        title: data.personalInfo?.name ? (data.personalInfo.name + "'s Resume") : 'My Tech Resume',
        template: 'modern-pro',
        personalInfo: data.personalInfo,
        education: data.education,
        technicalSkills: data.skills,
        experience: data.experience,
        projects: data.projects,
        certificationsText: data.certifications,
        atsScore: 89
      };
      if (editId) {
        await updateResume(editId, payload);
        toast.success('Resume updated!');
      } else {
        await createResume(payload);
        toast.success('Resume saved to cloud!');
      }
      navigate('/preview');
    } catch {
      toast.error('Failed to save to cloud');
      navigate('/preview');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 pt-28">
        {/* Top Header & Presets Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-sora font-extrabold tracking-tight">
              AI Resume & Career Asset Builder
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Step {step} of {totalSteps}: <span className="text-primary font-semibold">{stepLabels[step - 1]}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/preview')}
              className="px-4 py-2.5 rounded-xl bg-surface border border-primary/20 text-text-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <Eye size={16} /> Live Preview
            </button>
            <button
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="btn-primary px-5 py-2.5 text-sm font-semibold flex items-center gap-2 shadow-glow-primary"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save & Preview
            </button>
          </div>
        </div>

        {/* Quick-Load Persona Presets Bar */}
        <div className="mb-8 p-4 rounded-2xl bg-surface/60 border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Zap size={15} /> 1-Click Student Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            {STUDENT_PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => loadPersona(p)}
                className="px-3 py-1.5 rounded-xl bg-surface hover:bg-primary/20 border border-primary/15 text-xs font-medium text-text-primary transition-all flex items-center gap-1.5"
              >
                <span>{p.icon}</span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stepper Navigation */}
        <div className="flex items-center justify-between mb-10 overflow-x-auto pb-2 gap-2">
          {stepLabels.map((label, idx) => {
            const Icon = stepIcons[idx];
            const isCompleted = step > idx + 1;
            const isCurrent = step === idx + 1;

            return (
              <button
                key={label}
                onClick={() => setStep(idx + 1)}
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ' +
                  (isCurrent
                    ? 'bg-primary text-white shadow-glow-primary'
                    : isCompleted
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'bg-surface/50 text-text-muted hover:text-text-primary')
                }
              >
                <Icon size={14} />
                <span>{label}</span>
                {isCompleted && <Check size={12} className="ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Form Steps */}
        <div className="glass-card p-8 rounded-3xl border border-primary/20 shadow-xl">
          {/* STEP 1: PERSONAL INFO */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-sora font-bold text-text-primary flex items-center gap-2">
                <User className="text-primary" /> Personal & Contact Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    value={data.personalInfo?.name || ''}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, name: e.target.value } })}
                    placeholder="Alex Rivera"
                    className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={data.personalInfo?.jobTitle || ''}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, jobTitle: e.target.value } })}
                    placeholder="AI / Machine Learning Engineer Intern"
                    className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Email</label>
                  <input
                    type="email"
                    value={data.personalInfo?.email || ''}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, email: e.target.value } })}
                    placeholder="alex@university.edu"
                    className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Phone</label>
                  <input
                    type="text"
                    value={data.personalInfo?.phone || ''}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, phone: e.target.value } })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Location</label>
                  <input
                    type="text"
                    value={data.personalInfo?.location || ''}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, location: e.target.value } })}
                    placeholder="San Francisco, CA"
                    className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={data.personalInfo?.github || ''}
                    onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, github: e.target.value } })}
                    placeholder="github.com/alexrivera"
                    className="w-full px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">Professional Summary</label>
                  <button
                    onClick={() => {
                      setData({
                        ...data,
                        personalInfo: {
                          ...data.personalInfo,
                          summary: 'High-impact ' + (data.personalInfo?.jobTitle || 'Software Engineer') + ' with hands-on experience building scalable applications, AI pipelines, and distributed systems. Proven track record of improving latency by 40%+ and shipping production-ready code with 90%+ test coverage.'
                        }
                      });
                      toast.success('AI Summary Generated!');
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Sparkles size={13} /> Auto-Generate with AI
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={data.personalInfo?.summary || ''}
                  onChange={(e) => setData({ ...data, personalInfo: { ...data.personalInfo, summary: e.target.value } })}
                  placeholder="Summarize your technical foundation and career focus..."
                  className="w-full p-4 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-sora font-bold text-text-primary flex items-center gap-2">
                  <GraduationCap className="text-primary" /> Academic History & Coursework
                </h3>
                <button
                  onClick={() => setData({
                    ...data,
                    education: [...(data.education || []), { institution: '', degree: '', year: '', cgpa: '' }]
                  })}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Add School
                </button>
              </div>

              {(data.education || []).map((edu, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-surface/50 border border-primary/15 space-y-4 relative">
                  <button
                    onClick={() => {
                      const updated = [...data.education];
                      updated.splice(idx, 1);
                      setData({ ...data, education: updated });
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].institution = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        placeholder="University of California, Berkeley"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Degree / Major</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].degree = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        placeholder="B.S. in Computer Science"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Years / Expected Grad</label>
                      <input
                        type="text"
                        value={edu.year || ''}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].year = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        placeholder="2023 - 2026"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">GPA / Honors</label>
                      <input
                        type="text"
                        value={edu.cgpa || ''}
                        onChange={(e) => {
                          const updated = [...data.education];
                          updated[idx].cgpa = e.target.value;
                          setData({ ...data, education: updated });
                        }}
                        placeholder="3.91 / 4.00"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-sora font-bold text-text-primary flex items-center gap-2">
                <Wrench className="text-primary" /> Technical & Core Skills
              </h3>
              <p className="text-xs text-text-muted">
                Add programming languages, frameworks, cloud services, and tools.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="e.g. PyTorch, TypeScript, Docker, PostgreSQL"
                  className="flex-1 px-4 py-2.5 bg-surface border border-primary/20 rounded-xl text-sm text-text-primary focus:outline-none focus:border-primary"
                />
                <button
                  onClick={addSkill}
                  className="btn-primary px-5 py-2.5 font-semibold text-xs flex items-center gap-1"
                >
                  <Plus size={15} /> Add Skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(data.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/25 text-primary text-xs font-semibold"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(idx)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: EXPERIENCE */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-sora font-bold text-text-primary flex items-center gap-2">
                  <Briefcase className="text-primary" /> Work & Internship Experience
                </h3>
                <button
                  onClick={() => setData({
                    ...data,
                    experience: [...(data.experience || []), { title: '', company: '', duration: '', description: '' }]
                  })}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>

              {(data.experience || []).map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-surface/50 border border-primary/15 space-y-4 relative">
                  <button
                    onClick={() => {
                      const updated = [...data.experience];
                      updated.splice(idx, 1);
                      setData({ ...data, experience: updated });
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.title || ''}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[idx].title = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        placeholder="Machine Learning Intern"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Company / Lab</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[idx].company = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        placeholder="Berkeley AI Research"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Duration</label>
                      <input
                        type="text"
                        value={exp.duration || ''}
                        onChange={(e) => {
                          const updated = [...data.experience];
                          updated[idx].duration = e.target.value;
                          setData({ ...data, experience: updated });
                        }}
                        placeholder="May 2025 - Aug 2025"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">Responsibilities & Quantified Achievements</label>
                      <button
                        onClick={() => handleAiEnhanceBullet(exp.description, (improved) => {
                          const updated = [...data.experience];
                          updated[idx].description = improved;
                          setData({ ...data, experience: updated });
                        })}
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Sparkles size={13} /> {isEnhancing === exp.description ? 'Enhancing...' : 'STAR Method Rewrite'}
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={exp.description || ''}
                      onChange={(e) => {
                        const updated = [...data.experience];
                        updated[idx].description = e.target.value;
                        setData({ ...data, experience: updated });
                      }}
                      placeholder="• Built and optimized..."
                      className="w-full p-4 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 5: PROJECTS */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-sora font-bold text-text-primary flex items-center gap-2">
                  <FolderOpen className="text-primary" /> Key Projects & Live Deployments
                </h3>
                <button
                  onClick={() => setData({
                    ...data,
                    projects: [...(data.projects || []), { name: '', tech: '', link: '', liveUrl: '', description: '' }]
                  })}
                  className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {(data.projects || []).map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-surface/50 border border-primary/15 space-y-4 relative">
                  <button
                    onClick={() => {
                      const updated = [...data.projects];
                      updated.splice(idx, 1);
                      setData({ ...data, projects: updated });
                    }}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].name = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="AgenticRAG Assistant"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Tech Stack</label>
                      <input
                        type="text"
                        value={proj.tech || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].tech = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="Python, LangGraph, FastAPI, ChromaDB"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">GitHub Repo</label>
                      <input
                        type="text"
                        value={proj.link || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].link = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="github.com/user/project"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Live Demo URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].liveUrl = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="project-demo.vercel.app"
                        className="w-full px-4 py-2 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">Architecture & Impact</label>
                      <button
                        onClick={() => handleAiEnhanceProject(proj.description, (improved) => {
                          const updated = [...data.projects];
                          updated[idx].description = improved;
                          setData({ ...data, projects: updated });
                        })}
                        className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Sparkles size={13} /> {isEnhancing === proj.description ? 'Enhancing...' : 'Architecture Polish'}
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={proj.description || ''}
                      onChange={(e) => {
                        const updated = [...data.projects];
                        updated[idx].description = e.target.value;
                        setData({ ...data, projects: updated });
                      }}
                      placeholder="• Built a distributed system handling..."
                      className="w-full p-4 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: CERTIFICATIONS */}
          {step === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-sora font-bold text-text-primary flex items-center gap-2">
                <Award className="text-primary" /> Certifications, Hackathons & Honors
              </h3>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
                  Certifications & Accolades (one per line)
                </label>
                <textarea
                  rows={6}
                  value={typeof data.certifications === 'string' ? data.certifications : ''}
                  onChange={(e) => setData({ ...data, certifications: e.target.value })}
                  placeholder={'• AWS Certified Solutions Architect\n• 1st Place - CalHacks AI Track 2025\n• Google Cloud Professional Data Engineer'}
                  className="w-full p-4 bg-surface border border-primary/20 rounded-xl text-xs text-text-primary focus:outline-none focus:border-primary resize-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-primary/10 mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="px-5 py-2.5 rounded-xl bg-surface border border-primary/20 text-xs font-semibold text-text-muted hover:text-text-primary disabled:opacity-40 flex items-center gap-1.5"
            >
              <ArrowLeft size={15} /> Previous
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep(Math.min(totalSteps, step + 1))}
                className="btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-glow-primary"
              >
                Next Step <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSaveToCloud}
                className="btn-primary px-7 py-3 text-xs font-bold flex items-center gap-2 shadow-glow-primary"
              >
                <Save size={16} /> Complete & Preview Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
