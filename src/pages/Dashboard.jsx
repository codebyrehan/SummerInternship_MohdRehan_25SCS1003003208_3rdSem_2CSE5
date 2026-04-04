import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Eye, Download, Trash2, Edit3, ExternalLink,
  BarChart3, Globe, Sparkles, Clock, TrendingUp, User, Settings,
  LogOut, ChevronRight, Award, Loader2
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useResumeStore from '../stores/resumeStore';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/layout/Navbar';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const [activeTab, setActiveTab] = useState('resumes');
  const [showSettings, setShowSettings] = useState(false);

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

  // Stats
  const totalResumes = resumes.length;
  const latestScore = resumes.find(r => r.atsScore)?.atsScore || null;

  return (
    <motion.div className="min-h-screen bg-background text-text-primary" {...fadeUp}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-sora font-extrabold mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-primary">{user?.name?.split(' ')[0] || 'there'}</span>
            </h1>
            <p className="text-text-muted">Manage your resumes, portfolios, and career assets.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/build')}
              className="btn-primary px-6 py-3 flex items-center gap-2 font-semibold"
              id="create-resume-btn"
            >
              <Plus size={18} /> New Resume
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Resumes', value: totalResumes, icon: FileText, color: 'text-primary' },
            { label: 'ATS Best Score', value: latestScore ? `${latestScore}/100` : '—', icon: TrendingUp, color: 'text-green-400' },
            { label: 'AI Calls Used', value: user?.aiCallsUsed || 0, icon: Sparkles, color: 'text-secondary' },
            { label: 'Subscription', value: user?.subscription === 'pro' ? 'Pro' : 'Free', icon: Award, color: 'text-yellow-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-5 flex items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`p-3 rounded-xl bg-surface ${stat.color}`}>
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-text-muted text-sm">{stat.label}</p>
                <p className="text-xl font-sora font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-surface/50 p-1 rounded-xl w-fit">
          {['resumes', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'resumes' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : resumes.length === 0 ? (
              <motion.div
                className="glass-card p-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FileText size={48} className="mx-auto mb-4 text-text-muted" />
                <h3 className="text-xl font-sora font-bold mb-2">No Resumes Yet</h3>
                <p className="text-text-muted mb-6">Create your first AI-powered resume in minutes.</p>
                <button
                  onClick={() => navigate('/build')}
                  className="btn-primary px-8 py-3 font-semibold inline-flex items-center gap-2"
                >
                  <Plus size={18} /> Create Resume
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume, i) => (
                  <motion.div
                    key={resume._id}
                    className="glass-card p-6 flex flex-col hover:border-primary/40 transition-all group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="font-sora font-bold text-lg truncate">
                          {resume.title || resume.personalInfo?.name || 'Untitled'}
                        </h3>
                        <p className="text-text-muted text-sm mt-1">
                          {resume.personalInfo?.jobTitle || 'No title set'}
                        </p>
                      </div>
                      {resume.atsScore && (
                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          resume.atsScore >= 80 ? 'bg-green-500/20 text-green-400' :
                          resume.atsScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          ATS: {resume.atsScore}
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-text-muted text-xs mb-6">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </span>
                      <span className="glass-pill !py-0.5 !px-2 !text-xs">
                        {resume.template || 'modern-pro'}
                      </span>
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(resume.technicalSkills || []).slice(0, 4).map((s, j) => (
                        <span key={j} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">{s}</span>
                      ))}
                      {(resume.technicalSkills || []).length > 4 && (
                        <span className="px-2 py-0.5 bg-surface text-text-muted text-xs rounded-full">
                          +{resume.technicalSkills.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex gap-2 pt-4 border-t border-primary/10">
                      <button
                        onClick={() => navigate(`/build?id=${resume._id}`)}
                        className="flex-1 py-2 rounded-lg text-sm font-medium bg-surface hover:bg-primary/20 text-text-primary transition-colors flex items-center justify-center gap-1"
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
                        className="flex-1 py-2 rounded-lg text-sm font-medium bg-surface hover:bg-primary/20 text-text-primary transition-colors flex items-center justify-center gap-1"
                      >
                        <Eye size={14} /> Preview
                      </button>
                      <button
                        onClick={() => handleDelete(resume._id, resume.title)}
                        className="py-2 px-3 rounded-lg text-sm bg-surface hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {/* Create New Card */}
                <motion.div
                  className="glass-card p-6 flex flex-col items-center justify-center min-h-[250px] border-dashed cursor-pointer hover:border-primary/40 transition-all"
                  onClick={() => navigate('/build')}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: resumes.length * 0.05 }}
                >
                  <Plus size={32} className="text-text-muted mb-3" />
                  <p className="text-text-muted font-medium">Create New Resume</p>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <motion.div className="glass-card p-8 max-w-2xl" {...fadeUp}>
            <h2 className="text-xl font-sora font-bold mb-6">Account Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-xl text-text-primary focus:outline-none focus:border-primary/50"
                  id="settings-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  className="w-full px-4 py-3 bg-surface border border-primary/15 rounded-xl text-text-primary focus:outline-none focus:border-primary/50"
                  id="settings-email"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button className="btn-primary px-6 py-3 font-semibold">Save Changes</button>
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
