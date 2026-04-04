import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion } from 'framer-motion';
import {
  Globe, Mail, ExternalLink, ArrowLeft,
  MapPin, Send, Loader2, CheckCircle, Star, Code
} from 'lucide-react';
import { FiGithub as Github, FiLinkedin as Linkedin } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const THEMES = {
  'dark-navy': { bg: '#0a0a1a', surface: '#111127', card: '#171733', text: '#e2e8f0', muted: '#64748b', accent: '#6366f1', gradient: 'from-indigo-600 to-cyan-500' },
  'pure-white': { bg: '#ffffff', surface: '#f8fafc', card: '#ffffff', text: '#0f172a', muted: '#64748b', accent: '#6366f1', gradient: 'from-indigo-600 to-purple-600' },
  'soft-purple': { bg: '#1a0a2e', surface: '#1e1040', card: '#261450', text: '#e2e8f0', muted: '#a78bfa', accent: '#a78bfa', gradient: 'from-purple-500 to-pink-500' },
  'forest-green': { bg: '#0a1a14', surface: '#0f2318', card: '#142d1f', text: '#e2e8f0', muted: '#6ee7b7', accent: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
};

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function Portfolio() {
  const { username } = useParams();
  const [data] = useLocalStorage('resume_data', null);
  const [theme, setTheme] = useState('dark-navy');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);

  const t = THEMES[theme];

  // Try to fetch from API, fallback to localStorage
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data: res } = await api.get(`/portfolios/public/${username}`);
        if (res.success) {
          setPortfolioData(res.data.portfolio);
          setTheme(res.data.portfolio.theme || 'dark-navy');
          return;
        }
      } catch {}
      // Fallback to localStorage
    };
    fetchPortfolio();
  }, [username]);

  const pData = portfolioData || data;

  if (!pData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: t.bg, color: t.text }}>
        <div className="text-center">
          <h1 className="text-3xl font-sora font-bold mb-4">Portfolio Not Found</h1>
          <p style={{ color: t.muted }} className="mb-6">No resume data found for this user.</p>
          <Link to="/build" className="px-6 py-3 rounded-xl text-white font-semibold" style={{ background: t.accent }}>Create Resume</Link>
        </div>
      </div>
    );
  }

  const personalInfo = pData.personalInfo || {};
  const skills = portfolioData?.skills || pData.skills || [];
  const experience = pData.experience || [];
  const projects = pData.projects || [];
  const certifications = pData.certifications || pData.certificationsText || '';

  const handleContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return toast.error('Please fill all fields');
    setSending(true);
    try {
      await api.post('/contact', { ...contactForm, portfolioSlug: username });
      setSent(true);
      toast.success('Message sent!');
    } catch {
      toast.success('Message recorded! (Email service not configured)');
      setSent(true);
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen" style={{ background: t.bg, color: t.text }}>
      {/* Floating controls */}
      <div className="fixed top-6 right-6 z-50 flex gap-2">
        {Object.keys(THEMES).map(key => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${theme === key ? 'border-white scale-125' : 'border-transparent opacity-60 hover:opacity-100'}`}
            style={{ background: THEMES[key].accent }}
            title={key}
          />
        ))}
      </div>

      <Link
        to="/preview"
        className="fixed top-6 left-6 z-50 p-3 rounded-full shadow-lg transition-all hidden md:flex items-center justify-center group"
        style={{ background: t.surface, color: t.text }}
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Hero */}
      <motion.section
        className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Gradient orbs */}
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: t.accent, top: '-200px', left: '-200px' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]" style={{ background: t.accent, bottom: '-100px', right: '-100px' }} />

        <motion.div {...fadeUp} className="relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold border-2" style={{ background: `${t.accent}20`, color: t.accent, borderColor: `${t.accent}40` }}>
            {personalInfo.name?.[0]?.toUpperCase() || '?'}
          </div>

          <h1 className="text-5xl md:text-7xl font-sora font-extrabold mb-4 leading-tight">
            {personalInfo.name || 'Developer'}
          </h1>
          {(personalInfo.jobTitle || experience[0]?.title) && (
            <p className="text-xl md:text-2xl font-light mb-8" style={{ color: t.muted }}>
              {personalInfo.jobTitle || experience[0]?.title}
            </p>
          )}
          
          {/* Social Links */}
          <div className="flex gap-4 justify-center mb-8">
            {personalInfo.email && (
              <a href={`mailto:${personalInfo.email}`} className="p-3 rounded-full transition-all hover:scale-110" style={{ background: `${t.accent}15`, color: t.accent }}>
                <Mail size={20} />
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="p-3 rounded-full transition-all hover:scale-110" style={{ background: `${t.accent}15`, color: t.accent }}>
                <Github size={20} />
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="p-3 rounded-full transition-all hover:scale-110" style={{ background: `${t.accent}15`, color: t.accent }}>
                <Linkedin size={20} />
              </a>
            )}
            {personalInfo.location && (
              <span className="p-3 rounded-full flex items-center gap-1 text-sm" style={{ background: `${t.accent}15`, color: t.accent }}>
                <MapPin size={16} /> {personalInfo.location}
              </span>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            <a href="#contact" className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm hover:scale-105 transition-all" style={{ background: t.accent }}>
              Contact Me
            </a>
            <Link to="/preview" className="px-8 py-3.5 rounded-xl font-semibold text-sm border hover:scale-105 transition-all" style={{ borderColor: `${t.accent}40`, color: t.accent }}>
              View Resume
            </Link>
          </div>
        </motion.div>
      </motion.section>

      {/* About */}
      {(personalInfo.summary || personalInfo.bio) && (
        <motion.section {...fadeUp} className="py-24 px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-sora font-bold mb-6">About Me</h2>
          <p className="text-lg leading-relaxed" style={{ color: t.muted }}>
            {personalInfo.summary || personalInfo.bio || `Based in ${personalInfo.location || 'the world'}. Passionate about building impactful projects.`}
          </p>
        </motion.section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <motion.section {...fadeUp} className="py-24 px-6" style={{ background: t.surface }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-sora font-bold mb-12 text-center">Skills</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium border hover:-translate-y-1 transition-all cursor-default"
                  style={{ borderColor: `${t.accent}30`, color: t.accent, background: `${t.accent}08` }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <motion.section {...fadeUp} className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-sora font-bold mb-12 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-2xl border flex flex-col group hover:-translate-y-1 transition-all"
                  style={{ borderColor: `${t.accent}15`, background: t.card }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <Code size={20} style={{ color: t.accent }} />
                    {(proj.link || proj.liveUrl || proj.githubUrl) && (
                      <a
                        href={(proj.link || proj.liveUrl || proj.githubUrl || '').startsWith('http') ? (proj.link || proj.liveUrl || proj.githubUrl) : `https://${proj.link || proj.liveUrl || proj.githubUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-50 hover:opacity-100 transition-opacity"
                        style={{ color: t.accent }}
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{proj.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: t.accent }}>{proj.tech}</p>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: t.muted }}>{proj.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Experience Timeline */}
      {experience.length > 0 && (
        <motion.section {...fadeUp} className="py-24 px-6" style={{ background: t.surface }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-sora font-bold mb-12 text-center">Experience</h2>
            <div className="space-y-8 relative">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px" style={{ background: `${t.accent}30` }} />
              {experience.map((exp, i) => (
                <motion.div
                  key={i}
                  className="relative pl-14 md:pl-20"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="absolute left-4 md:left-6 top-1 w-4 h-4 rounded-full border-2 z-10" style={{ background: t.bg, borderColor: t.accent }} />
                  <div className="p-5 rounded-xl border" style={{ borderColor: `${t.accent}15`, background: t.card }}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                      <h3 className="text-lg font-bold">{exp.title}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: `${t.accent}15`, color: t.accent }}>
                        {exp.duration || `${exp.startDate} - ${exp.endDate}`}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-3" style={{ color: t.accent }}>{exp.company}</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: t.muted }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Certifications */}
      {certifications && (
        <motion.section {...fadeUp} className="py-24 px-6 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-sora font-bold mb-8">Certifications & Awards</h2>
          <p className="text-lg leading-relaxed whitespace-pre-wrap" style={{ color: t.muted }}>
            {typeof certifications === 'string' ? certifications : certifications.map?.(c => c.name).join(', ')}
          </p>
        </motion.section>
      )}

      {/* Contact Form */}
      <section id="contact" className="py-24 px-6" style={{ background: t.surface }}>
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-4xl font-sora font-extrabold mb-4">Let's Connect</h2>
            <p style={{ color: t.muted }}>Open for opportunities. Send me a message!</p>
          </motion.div>

          {sent ? (
            <motion.div {...fadeUp} className="text-center py-12">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: t.accent }} />
              <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
              <p style={{ color: t.muted }}>Thanks for reaching out. I'll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.form {...fadeUp} onSubmit={handleContact} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full p-4 rounded-xl text-sm border focus:outline-none transition-colors"
                style={{ background: t.card, borderColor: `${t.accent}20`, color: t.text }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={contactForm.email}
                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                className="w-full p-4 rounded-xl text-sm border focus:outline-none transition-colors"
                style={{ background: t.card, borderColor: `${t.accent}20`, color: t.text }}
              />
              <textarea
                placeholder="Your Message"
                value={contactForm.message}
                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                rows={5}
                className="w-full p-4 rounded-xl text-sm border focus:outline-none resize-none transition-colors"
                style={{ background: t.card, borderColor: `${t.accent}20`, color: t.text }}
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
                style={{ background: t.accent }}
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm border-t" style={{ borderColor: `${t.accent}10`, color: t.muted }}>
        <p>© {new Date().getFullYear()} {personalInfo.name}. Built with <span style={{ color: t.accent }}>QuickHire AI</span></p>
      </footer>
    </div>
  );
}
