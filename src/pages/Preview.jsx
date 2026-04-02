import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import html2pdf from 'html2pdf.js';
import { Download, LayoutTemplate, Sparkles, Loader2, Check, X, ExternalLink } from 'lucide-react';
import { improveTextWithAI } from '../services/aiService';

export default function Preview() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage('resume_data', null);
  const [template, setTemplate] = useState('modern'); // classic, modern, minimal
  const resumeRef = useRef();

  // AI State
  const [aiLoading, setAiLoading] = useState(null); // 'experience-0', 'projects-1'
  const [aiSuggestion, setAiSuggestion] = useState(null); // { key, index, field, text }

  if (!data) return <div className="p-8 text-center">No data found. <button onClick={() => navigate('/build')}>Go back to builder</button></div>;

  const handleDownload = () => {
    const element = resumeRef.current;
    html2pdf().from(element).set({
      margin: [10, 10, 10, 10],
      filename: `${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
  };

  const username = data.personalInfo.name ? data.personalInfo.name.toLowerCase().replace(/\s+/g, '') : 'demo';

  const improveWithAI = async (key, index, field, text) => {
    if (!text) return;
    const aiKeyId = `${key}-${index}`;
    setAiLoading(aiKeyId);
    const improvedText = await improveTextWithAI(text, key);
    setAiSuggestion({ key, index, field, original: text, text: improvedText });
    setAiLoading(null);
  };

  const acceptAiSuggestion = () => {
    if(!aiSuggestion) return;
    const updated = [...data[aiSuggestion.key]];
    updated[aiSuggestion.index][aiSuggestion.field] = aiSuggestion.text;
    setData({ ...data, [aiSuggestion.key]: updated });
    setAiSuggestion(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 bg-white p-6 border-r border-gray-200 flex flex-col gap-8 flex-shrink-0 z-10 shadow-lg">
        <div>
          <h2 className="text-xl font-syne font-bold mb-4 flex items-center gap-2"><LayoutTemplate size={20}/> Templates</h2>
          <div className="flex flex-col gap-3">
            {['modern', 'classic', 'minimal'].map((tpl) => (
              <button 
                key={tpl} 
                className={`py-3 px-4 rounded-lg font-medium border text-left capitalize transition-all ${template === tpl ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-body hover:bg-gray-50'}`}
                onClick={() => setTemplate(tpl)}
              >
                {tpl} Resume
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button onClick={handleDownload} className="w-full py-4 bg-dark text-white rounded-lg flex items-center justify-center gap-2 hover:bg-black font-semibold shadow-md transition-all">
            <Download size={20} /> Download PDF
          </button>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button onClick={() => navigate(`/portfolio/${username}`)} className="w-full py-4 bg-primary text-white rounded-lg flex items-center justify-center gap-2 hover:scale-105 font-semibold shadow-lg transition-all">
            View My Portfolio <ExternalLink size={20} />
          </button>
        </div>

        <div className="mt-auto">
          <button onClick={() => navigate('/build')} className="text-body text-sm hover:text-dark">← Edit details</button>
        </div>
      </div>

      {/* Resume Preview Area */}
      <div className="flex-1 p-8 overflow-y-auto flex items-start justify-center relative">
        
        {/* AI Suggestion Modal */}
        {aiSuggestion && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-fade-in">
              <h3 className="text-xl font-syne font-bold mb-4">AI Suggestion</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <p className="text-xs text-gray-500 font-bold mb-2 uppercase">Original</p>
                  <p className="text-sm text-body line-clamp-6">{aiSuggestion.original}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary font-bold mb-2 uppercase flex items-center gap-1"><Sparkles size={12}/> AI Improved</p>
                  <p className="text-sm text-dark">{aiSuggestion.text}</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setAiSuggestion(null)} className="px-6 py-2 rounded border hover:bg-gray-50">Keep Original</button>
                <button onClick={acceptAiSuggestion} className="px-6 py-2 rounded bg-primary text-white hover:bg-dark shadow">Accept AI Version</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-2xl mx-auto printable-resume" style={{ width: '210mm', minHeight: '297mm' }}>
          <div ref={resumeRef} className={`w-full h-full tpl-${template} relative bg-white`}>
            {/* Minimal Template CSS */}
            {template === 'minimal' && (
              <div className="p-12 font-sans text-gray-800">
                <header className="mb-10 text-center">
                  <h1 className="text-4xl font-light tracking-wide mb-2 uppercase">{data.personalInfo.name}</h1>
                  <p className="text-gray-500 text-sm">{data.personalInfo.location} • {data.personalInfo.email} • {data.personalInfo.phone}</p>
                  <p className="text-gray-500 text-sm mt-1">{data.personalInfo.linkedin} • {data.personalInfo.github}</p>
                </header>
                
                {data.experience.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-md uppercase tracking-widest text-gray-400 border-b pb-1 mb-4 font-bold">Experience</h2>
                    {data.experience.map((exp, i) => (
                      <div key={i} className="mb-6 group relative">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-semibold text-lg">{exp.title} <span className="text-gray-500 font-normal">at {exp.company}</span></h3>
                          <span className="text-sm text-gray-500 whitespace-nowrap">{exp.duration}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed max-w-[90%]">{exp.description}</p>
                        
                        {/* AI Button - Hidden in Print */}
                        <div className="absolute right-0 top-6 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                           <button onClick={() => improveWithAI('experience', i, 'description', exp.description)} className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white" title="Improve with AI">
                             {aiLoading === `experience-${i}` ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                           </button>
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* Other sections similarly for minimal... we'll build out Modern as the primary focus */}
              </div>
            )}

            {/* Modern Template (Sidebar Layout) */}
            {template === 'modern' && (
              <div className="flex min-h-full font-sans shadow-sm bg-white">
                <div className="w-[30%] bg-[#0a0a0f] text-white p-8">
                  <h1 className="text-4xl font-syne font-bold mb-2 text-white">{data.personalInfo.name}</h1>
                  <div className="w-12 h-1 bg-primary mb-8"></div>
                  
                  <div className="mb-8 space-y-2 text-sm text-gray-300">
                    <p>{data.personalInfo.email}</p>
                    <p>{data.personalInfo.phone}</p>
                    <p>{data.personalInfo.location}</p>
                    <p className="text-secondary">{data.personalInfo.linkedin}</p>
                    <p className="text-secondary">{data.personalInfo.github}</p>
                  </div>

                  <h2 className="text-lg font-bold mb-4 tracking-wider uppercase text-gray-400">Skills</h2>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {data.skills.map((s,i) => (
                      <span key={i} className="bg-white/10 px-3 py-1 rounded text-xs">{s}</span>
                    ))}
                  </div>

                  {data.education.length > 0 && (
                    <>
                      <h2 className="text-lg font-bold mb-4 tracking-wider uppercase text-gray-400">Education</h2>
                      <div className="space-y-4">
                        {data.education.map((edu, i) => (
                          <div key={i}>
                            <h3 className="font-semibold text-white">{edu.degree}</h3>
                            <p className="text-sm text-gray-400">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.year} • {edu.cgpa && `CGPA: ${edu.cgpa}`}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="w-[70%] bg-white p-8">
                  {data.experience.length > 0 && (
                    <section className="mb-8">
                      <h2 className="text-2xl font-bold font-syne mb-2 text-primary border-b-2 border-gray-100 pb-2">Experience</h2>
                      {data.experience.map((exp, i) => (
                        <div key={i} className="mb-6 group relative">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-lg font-bold text-dark">{exp.title}</h3>
                            <span className="text-sm font-semibold text-primary">{exp.duration}</span>
                          </div>
                          <p className="text-body font-medium mb-2">{exp.company}</p>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                          
                          {/* AI Button - Hidden in Print */}
                          <div className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                             <button onClick={() => improveWithAI('experience', i, 'description', exp.description)} className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white" title="Improve with AI">
                               {aiLoading === `experience-${i}` ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                             </button>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {data.projects.length > 0 && (
                    <section className="mb-8">
                      <h2 className="text-2xl font-bold font-syne mb-2 text-primary border-b-2 border-gray-100 pb-2">Projects</h2>
                      {data.projects.map((proj, i) => (
                        <div key={i} className="mb-5 group relative">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-lg font-bold text-dark flex items-center gap-2">
                              {proj.name}
                            </h3>
                            {proj.link && <span className="text-xs text-blue-500">{proj.link}</span>}
                          </div>
                          <p className="text-xs font-semibold text-secondary mb-2">{proj.tech}</p>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
                          
                          <div className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                             <button onClick={() => improveWithAI('projects', i, 'description', proj.description)} className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white" title="Improve with AI">
                               {aiLoading === `projects-${i}` ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                             </button>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {data.certifications && (
                    <section>
                      <h2 className="text-2xl font-bold font-syne mb-2 text-primary border-b-2 border-gray-100 pb-2">Certifications & Awards</h2>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.certifications}</p>
                    </section>
                  )}
                </div>
              </div>
            )}

            {/* Classic Template */}
            {template === 'classic' && (
              <div className="p-12 font-serif text-black leading-snug">
                <header className="text-center mb-6 border-b-2 border-black pb-4">
                  <h1 className="text-3xl font-bold mb-2 uppercase">{data.personalInfo.name}</h1>
                  <p className="text-sm">{data.personalInfo.location} | {data.personalInfo.email} | {data.personalInfo.phone}</p>
                  <p className="text-sm">{data.personalInfo.linkedin} | {data.personalInfo.github}</p>
                </header>
                
                {data.experience.length > 0 && (
                  <section className="mb-6">
                    <h2 className="text-lg font-bold border-b border-black uppercase mb-3">Professional Experience</h2>
                    {data.experience.map((exp, i) => (
                      <div key={i} className="mb-4 group relative">
                        <div className="flex justify-between items-baseline font-bold">
                          <h3>{exp.title}, {exp.company}</h3>
                          <span>{exp.duration}</span>
                        </div>
                        <p className="text-sm mt-1">{exp.description}</p>
                        <div className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity no-print">
                             <button onClick={() => improveWithAI('experience', i, 'description', exp.description)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Improve with AI">
                               {aiLoading === `experience-${i}` ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16}/>}
                             </button>
                        </div>
                      </div>
                    ))}
                  </section>
                )}

                {/* Other standard sections ... */}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .printable-resume { margin: 0; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
