import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Plus, X, User, GraduationCap,
  Wrench, Briefcase, FolderOpen, Award, Sparkles, Save, Loader2, History
} from 'lucide-react';
import { FiGithub as Github } from 'react-icons/fi';
import useAuthStore from '../stores/authStore';
import useResumeStore from '../stores/resumeStore';
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
  const { createResume, updateResume, fetchResume, getVersions, restoreVersion, isSaving } = useResumeStore();
  const [data, setData] = useLocalStorage('resume_data', emptyResumeData);
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [errors, setErrors] = useState({});
  const [showVersions, setShowVersions] = useState(false);
  const [versionsList, setVersionsList] = useState([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);

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

  const handleFetchVersions = async () => {
    if (!editId) return;
    const v = await getVersions(editId);
    setVersionsList(v);
    setShowVersions(true);
  };

  const handleRestore = async (vIndex) => {
    if(!editId) return;
    setIsRestoring(true);
    const success = await restoreVersion(editId, vIndex);
    setIsRestoring(false);
    if(success) {
      toast.success('Version restored!');
      setShowVersions(false);
      // refetch
      fetchResume(editId).then(resume => {
         if(resume) {
           setData({
            personalInfo: resume.personalInfo || emptyResumeData.personalInfo,
            education: resume.education || [],
            skills: [...(resume.technicalSkills || []), ...(resume.softSkills || [])],
            experience: resume.experience || [],
            projects: resume.projects || [],
            certifications: resume.certificationsText || '',
          });
         }
      })
    } else {
      toast.error('Failed to restore version');
    }
  };

  const handleFetchGithub = async () => {
    const username = data.personalInfo?.github;
    if (!username) {
      return toast.error('Please add your GitHub username in Personal Info step first.');
    }
    
    let gitUser = username;
    if (gitUser.includes('github.com')) {
      const parts = gitUser.split('github.com/');
      gitUser = parts[1]?.split('/')[0];
    }
    if (!gitUser) return toast.error('Invalid GitHub username.');

    setIsFetchingGithub(true);
    toast.loading('Fetching public repos...', { id: 'github' });
    try {
      const res = await api.post('/portfolios/github-repos', { githubUsername: gitUser });
      if (res.data?.success && res.data.data?.repos) {
        const newProjects = res.data.data.repos.map(r => ({
          name: r.name,
          tech: r.language || 'Code',
          link: r.url,
          description: r.description || ''
        }));
        setData({ ...data, projects: [...data.projects, ...newProjects] });
        toast.success(`Imported ${newProjects.length} repos!`, { id: 'github' });
      }
    } catch (err) {
      toast.error('Failed to fetch from GitHub.', { id: 'github' });
    }
    setIsFetchingGithub(false);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('resume_data', JSON.stringify(data));
    }, 30000);
    return () => clearInterval(timer);
  }, [data]);

  // Validation
  const validate = () => {
    const errs = {};
    if (step === 1) {
      if (!data.personalInfo.name?.trim()) errs.name = 'Name is required';
      if (!data.personalInfo.email?.trim()) errs.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(data.personalInfo.email)) errs.email = 'Valid email required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePersonalChange = (e) => {
    setData({ ...data, personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value } });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // Skills
  const [skillInput, setSkillInput] = useState('');
  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      setData({ ...data, skills: [...data.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };
  const removeSkill = (skill) => setData({ ...data, skills: data.skills.filter(s => s !== skill) });

  // List handlers
  const addListItem = (key, emptyItem) => setData({ ...data, [key]: [...data[key], emptyItem] });
  const updateListItem = (key, index, field, value) => {
    const updated = [...data[key]];
    updated[index][field] = value;
    setData({ ...data, [key]: updated });
  };
  const removeListItem = (key, index) => setData({ ...data, [key]: data[key].filter((_, i) => i !== index) });

  const nextStep = () => {
    if (validate()) setStep(Math.min(step + 1, totalSteps));
  };
  const prevStep = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    if (!validate()) return;
    
    // Save to localStorage for preview
    localStorage.setItem('resume_data', JSON.stringify(data));
    
    // If authenticated, save to DB
    if (isAuthenticated) {
      try {
        const resumePayload = {
          title: `${data.personalInfo.name}'s Resume`,
          personalInfo: data.personalInfo,
          technicalSkills: data.skills,
          softSkills: [],
          education: data.education,
          experience: data.experience,
          projects: data.projects,
          certificationsText: data.certifications,
        };
        
        if (editId) {
          await updateResume(editId, resumePayload);
          toast.success('Resume updated!');
        } else {
          await createResume(resumePayload);
          toast.success('Resume saved!');
        }
      } catch (e) {
        toast.error('Failed to save resume');
      }
    }
    
    navigate('/preview');
  };

  const InputField = ({ label, name, type = 'text', placeholder, value, onChange, error, icon: Icon }) => (
    <div>
      <label className="block text-sm font-medium text-text-muted mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-3 bg-surface border rounded-xl text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500' : 'border-primary/15 focus:border-primary/50'}`}
          id={`field-${name}`}
        />
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <>
      <motion.div
        className="min-h-screen bg-background text-text-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
      <Navbar />

      <div className="max-w-4xl mx-auto pt-28 pb-20 px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-sora font-extrabold mb-2">
              {editId ? 'Edit Resume' : 'Build Your Resume'}
            </h1>
            <p className="text-text-muted">Fill in your details — our AI will help polish everything later.</p>
          </div>
          {editId && (
            <button
              onClick={handleFetchVersions}
              className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-primary/20 border border-primary/20 rounded-xl transition-colors font-medium text-sm"
            >
              <History size={16} /> Version History
            </button>
          )}
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {Array.from({ length: totalSteps }, (_, i) => {
            const StepIcon = stepIcons[i];
            const isActive = step === i + 1;
            const isDone = step > i + 1;
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => { if (isDone || isActive) setStep(i + 1); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive ? 'bg-primary text-white shadow-glow-primary' :
                    isDone ? 'bg-primary/20 text-primary' :
                    'bg-surface text-text-muted'
                  }`}
                >
                  <StepIcon size={14} />
                  <span className="hidden sm:inline">{stepLabels[i]}</span>
                </button>
                {i < totalSteps - 1 && (
                  <div className={`w-6 h-0.5 rounded-full ${isDone ? 'bg-primary' : 'bg-primary/15'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress */}
        <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden mb-8">
          <motion.div
            className="h-full bg-gradient-primary rounded-full"
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="min-h-[45vh]"
            >
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-sora font-bold mb-6 flex items-center gap-2">
                    <User size={22} className="text-primary" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Full Name *" name="name" value={data.personalInfo.name} onChange={handlePersonalChange} error={errors.name} placeholder="John Doe" />
                    <InputField label="Email *" name="email" type="email" value={data.personalInfo.email} onChange={handlePersonalChange} error={errors.email} placeholder="john@example.com" />
                    <InputField label="Phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalChange} placeholder="+1 234 567 8900" />
                    <InputField label="Location" name="location" value={data.personalInfo.location} onChange={handlePersonalChange} placeholder="New York, NY" />
                    <InputField label="Job Title" name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePersonalChange} placeholder="Full Stack Developer" />
                    <InputField label="LinkedIn URL" name="linkedin" value={data.personalInfo.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/johndoe" />
                    <InputField label="GitHub URL" name="github" value={data.personalInfo.github} onChange={handlePersonalChange} placeholder="github.com/johndoe" />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-text-muted mb-1.5">Professional Summary</label>
                    <textarea
                      name="summary"
                      value={data.personalInfo.summary || ''}
                      onChange={handlePersonalChange}
                      placeholder="A brief professional summary... (AI can generate this later)"
                      className="w-full p-4 bg-surface border border-primary/15 rounded-xl text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 resize-none h-24"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Education */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-sora font-bold mb-6 flex items-center gap-2">
                    <GraduationCap size={22} className="text-primary" /> Education
                  </h2>
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="mb-5 p-5 bg-surface/50 rounded-xl border border-primary/10 relative">
                      <button onClick={() => removeListItem('education', idx)} className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <X size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="text" placeholder="Degree (e.g. B.Tech in CS)" value={edu.degree} onChange={e => updateListItem('education', idx, 'degree', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="Institution" value={edu.institution} onChange={e => updateListItem('education', idx, 'institution', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="Year (e.g. 2020–2024)" value={edu.year} onChange={e => updateListItem('education', idx, 'year', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="CGPA (optional)" value={edu.cgpa} onChange={e => updateListItem('education', idx, 'cgpa', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem('education', { degree: '', institution: '', year: '', cgpa: '' })}
                    className="flex items-center gap-2 text-primary font-medium px-4 py-3 border-2 border-dashed border-primary/20 rounded-xl w-full justify-center hover:bg-primary/5 transition-colors"
                  >
                    <Plus size={18} /> Add Education
                  </button>
                </div>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-sora font-bold mb-6 flex items-center gap-2">
                    <Wrench size={22} className="text-primary" /> Skills
                  </h2>
                  <form onSubmit={addSkill} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="flex-1 p-3 bg-surface border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50"
                      placeholder="e.g. React, Python, Project Management"
                    />
                    <button type="submit" className="px-6 bg-primary text-white rounded-xl font-medium hover:bg-primary/80 transition-colors">Add</button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-primary/20">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                  {data.skills.length === 0 && (
                    <p className="text-text-muted text-sm text-center mt-8">Add your technical and soft skills above</p>
                  )}
                </div>
              )}

              {/* Step 4: Experience */}
              {step === 4 && (
                <div>
                  <h2 className="text-2xl font-sora font-bold mb-6 flex items-center gap-2">
                    <Briefcase size={22} className="text-primary" /> Experience
                  </h2>
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="mb-5 p-5 bg-surface/50 rounded-xl border border-primary/10 relative">
                      <button onClick={() => removeListItem('experience', idx)} className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <X size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <input type="text" placeholder="Job Title" value={exp.title} onChange={e => updateListItem('experience', idx, 'title', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="Company" value={exp.company} onChange={e => updateListItem('experience', idx, 'company', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="Duration (e.g. 2020–2023)" value={exp.duration} onChange={e => updateListItem('experience', idx, 'duration', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                      </div>
                      <textarea
                        placeholder="Describe responsibilities and achievements... (AI will polish this later!)"
                        value={exp.description}
                        onChange={e => updateListItem('experience', idx, 'description', e.target.value)}
                        className="w-full p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 resize-none h-24"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem('experience', { title: '', company: '', duration: '', description: '' })}
                    className="flex items-center gap-2 text-primary font-medium px-4 py-3 border-2 border-dashed border-primary/20 rounded-xl w-full justify-center hover:bg-primary/5 transition-colors"
                  >
                    <Plus size={18} /> Add Experience
                  </button>
                </div>
              )}

              {/* Step 5: Projects */}
              {step === 5 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-sora font-bold flex items-center gap-2">
                      <FolderOpen size={22} className="text-primary" /> Projects
                    </h2>
                    <button
                      onClick={handleFetchGithub}
                      disabled={isFetchingGithub}
                      className="px-4 py-2 bg-[#24292e] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#2c3137] transition-colors disabled:opacity-50"
                    >
                      {isFetchingGithub ? <Loader2 size={16} className="animate-spin" /> : <Github size={16} />}
                      Fetch from GitHub
                    </button>
                  </div>
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className="mb-5 p-5 bg-surface/50 rounded-xl border border-primary/10 relative">
                      <button onClick={() => removeListItem('projects', idx)} className="absolute top-3 right-3 p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <X size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input type="text" placeholder="Project Name" value={proj.name} onChange={e => updateListItem('projects', idx, 'name', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="Tech Stack" value={proj.tech} onChange={e => updateListItem('projects', idx, 'tech', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50" />
                        <input type="text" placeholder="Live URL" value={proj.link || proj.liveUrl || ''} onChange={e => updateListItem('projects', idx, 'link', e.target.value)} className="p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 md:col-span-2" />
                      </div>
                      <textarea
                        placeholder="Project description"
                        value={proj.description}
                        onChange={e => updateListItem('projects', idx, 'description', e.target.value)}
                        className="w-full p-3 bg-background border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 resize-none h-24"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem('projects', { name: '', tech: '', link: '', description: '' })}
                    className="flex items-center gap-2 text-primary font-medium px-4 py-3 border-2 border-dashed border-primary/20 rounded-xl w-full justify-center hover:bg-primary/5 transition-colors"
                  >
                    <Plus size={18} /> Add Project
                  </button>
                </div>
              )}

              {/* Step 6: Certifications */}
              {step === 6 && (
                <div>
                  <h2 className="text-2xl font-sora font-bold mb-6 flex items-center gap-2">
                    <Award size={22} className="text-primary" /> Certifications & Achievements
                  </h2>
                  <textarea
                    placeholder="List your certifications, awards, or relevant achievements... (one per line)"
                    value={data.certifications}
                    onChange={e => setData({ ...data, certifications: e.target.value })}
                    className="w-full p-5 bg-surface border border-primary/15 rounded-xl text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-primary/50 min-h-[200px] resize-none"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 pt-6 border-t border-primary/10 flex justify-between items-center">
            <button
              disabled={step === 1}
              onClick={prevStep}
              className="px-5 py-3 rounded-xl font-medium text-text-muted hover:text-text-primary hover:bg-surface disabled:opacity-30 flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={18} /> Back
            </button>

            <div className="flex gap-3">
              {step < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 rounded-xl font-medium text-white bg-primary hover:bg-primary/80 flex items-center gap-2 transition-all hover:shadow-glow-primary"
                >
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-primary hover:scale-[1.03] shadow-glow-primary flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Generate Resume
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
      
      {/* Versions Modal */}
      <AnimatePresence>
        {showVersions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card glass-card p-6 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col relative"
            >
              <button 
                onClick={() => setShowVersions(false)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-sora font-bold mb-4 flex items-center gap-2">
                <History className="text-primary" size={24} /> Version History
              </h2>
              {versionsList.length === 0 ? (
                <p className="text-text-muted text-center py-8">No saved versions found.</p>
              ) : (
                <div className="overflow-y-auto pr-2 space-y-3">
                  {[...versionsList].reverse().map((v, idx) => (
                    <div key={v.index} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-primary/10">
                      <div>
                        <div className="font-medium">{v.label || `Version ${versionsList.length - idx}`}</div>
                        <div className="text-xs text-text-muted mt-1">{new Date(v.savedAt).toLocaleString()}</div>
                      </div>
                      <button
                        onClick={() => handleRestore(v.index)}
                        disabled={isRestoring}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary/20 text-primary hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                      >
                        {isRestoring ? 'Restoring...' : 'Restore'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
