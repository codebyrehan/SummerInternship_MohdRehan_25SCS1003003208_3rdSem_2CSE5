import React from 'react';

// ========================
// Template 1: Modern Pro
// ========================
export function ModernPro({ data, accentColor = '#6366f1' }) {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications } = data;
  return (
    <div className="flex min-h-full font-sans" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
      <div className="w-[32%] p-7 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="text-2xl font-extrabold mb-1 leading-tight">{personalInfo.name}</h1>
        {personalInfo.jobTitle && <p className="text-sm opacity-80 mb-5 font-medium">{personalInfo.jobTitle}</p>}
        <div className="w-10 h-0.5 bg-white/40 mb-5" />
        <div className="mb-6 space-y-1.5 text-xs opacity-90">
          {personalInfo.email && <p>✉ {personalInfo.email}</p>}
          {personalInfo.phone && <p>📱 {personalInfo.phone}</p>}
          {personalInfo.location && <p>📍 {personalInfo.location}</p>}
          {personalInfo.linkedin && <p className="break-all">🔗 {personalInfo.linkedin}</p>}
          {personalInfo.github && <p className="break-all">💻 {personalInfo.github}</p>}
        </div>
        {skills.length > 0 && (
          <>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-3 opacity-70">Skills</h2>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {skills.map((s, i) => (
                <span key={i} className="bg-white/15 px-2.5 py-1 rounded text-[10px] font-medium">{s}</span>
              ))}
            </div>
          </>
        )}
        {education.length > 0 && (
          <>
            <h2 className="text-xs font-bold tracking-widest uppercase mb-3 opacity-70">Education</h2>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs opacity-70">{edu.institution}</p>
                  <p className="text-[10px] opacity-60">{edu.year}{edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ''}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="w-[68%] p-7 bg-white text-gray-800">
        {personalInfo.summary && (
          <section className="mb-5">
            <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor + '30' }}>Summary</h2>
            <p className="text-xs text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )}
        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor + '30' }}>Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm text-gray-900">{exp.title}</h3>
                  <span className="text-[10px] font-semibold" style={{ color: accentColor }}>{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">{exp.company}</p>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </section>
        )}
        {projects.length > 0 && (
          <section className="mb-5">
            <h2 className="text-lg font-bold mb-3 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor + '30' }}>Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm text-gray-900">{proj.name}</h3>
                  {(proj.link || proj.liveUrl) && <span className="text-[10px]" style={{ color: accentColor }}>{proj.link || proj.liveUrl}</span>}
                </div>
                <p className="text-[10px] font-semibold mb-1" style={{ color: accentColor }}>{proj.tech}</p>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </section>
        )}
        {certifications && (
          <section>
            <h2 className="text-lg font-bold mb-2 pb-1 border-b-2" style={{ color: accentColor, borderColor: accentColor + '30' }}>Certifications & Awards</h2>
            <p className="text-xs text-gray-600 whitespace-pre-wrap">{typeof certifications === 'string' ? certifications : certifications.map(c => c.name).join(', ')}</p>
          </section>
        )}
      </div>
    </div>
  );
}

// ========================
// Template 2: Corporate Edge
// ========================
export function CorporateEdge({ data, accentColor = '#1e293b' }) {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications } = data;
  return (
    <div className="p-8 font-sans text-gray-800 bg-white" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
      <header className="pb-4 mb-5 border-b-4" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accentColor }}>{personalInfo.name}</h1>
        {personalInfo.jobTitle && <p className="text-sm font-medium text-gray-500 mt-1">{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
        </div>
      </header>
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Professional Summary</h2>
          <p className="text-xs text-gray-600 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor }}>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{exp.title} <span className="font-normal text-gray-500">at {exp.company}</span></h3>
                <span className="text-[10px] font-semibold text-gray-400">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      <div className="grid grid-cols-2 gap-6">
        {education.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor }}>Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-xs">{edu.degree}</p>
                <p className="text-[10px] text-gray-500">{edu.institution} • {edu.year}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded" style={{ backgroundColor: accentColor + '15', color: accentColor }}>{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>
      {projects.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ color: accentColor }}>Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-bold text-xs">{p.name} <span className="font-normal text-gray-400 text-[10px]">{p.tech}</span></h3>
              <p className="text-xs text-gray-600 whitespace-pre-wrap">{p.description}</p>
            </div>
          ))}
        </section>
      )}
      {certifications && (
        <section className="mt-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-1 border-b" style={{ color: accentColor }}>Certifications</h2>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{typeof certifications === 'string' ? certifications : certifications.map(c => c.name).join(', ')}</p>
        </section>
      )}
    </div>
  );
}

// ========================
// Template 3: Minimal Black
// ========================
export function MinimalBlack({ data, accentColor = '#000000' }) {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications } = data;
  return (
    <div className="p-10 font-sans text-gray-800 bg-white" style={{ fontSize: '11pt', lineHeight: '1.6' }}>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase mb-2">{personalInfo.name}</h1>
        {personalInfo.jobTitle && <p className="text-xs tracking-widest uppercase text-gray-400 mb-3">{personalInfo.jobTitle}</p>}
        <p className="text-xs text-gray-400">
          {[personalInfo.location, personalInfo.email, personalInfo.phone].filter(Boolean).join(' • ')}
        </p>
        {(personalInfo.linkedin || personalInfo.github) && (
          <p className="text-xs text-gray-400 mt-1">{[personalInfo.linkedin, personalInfo.github].filter(Boolean).join(' • ')}</p>
        )}
      </header>
      {personalInfo.summary && (
        <section className="mb-6 text-center max-w-lg mx-auto">
          <p className="text-xs text-gray-500 italic leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b pb-1 mb-4 font-bold">Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-sm">{exp.title} <span className="text-gray-400 font-normal">— {exp.company}</span></h3>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b pb-1 mb-4 font-bold">Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <h3 className="font-semibold text-xs">{p.name} <span className="text-gray-400 font-normal">| {p.tech}</span></h3>
              <p className="text-xs text-gray-600 whitespace-pre-wrap">{p.description}</p>
            </div>
          ))}
        </section>
      )}
      <div className="grid grid-cols-2 gap-8">
        {education.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b pb-1 mb-3 font-bold">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold text-xs">{edu.degree}</p>
                <p className="text-[10px] text-gray-400">{edu.institution}, {edu.year}</p>
              </div>
            ))}
          </section>
        )}
        {skills.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b pb-1 mb-3 font-bold">Skills</h2>
            <p className="text-xs text-gray-600">{skills.join(' • ')}</p>
          </section>
        )}
      </div>
      {certifications && (
        <section className="mt-5">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 border-b pb-1 mb-3 font-bold">Certifications</h2>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{typeof certifications === 'string' ? certifications : certifications.map(c => c.name).join(', ')}</p>
        </section>
      )}
    </div>
  );
}

// ========================
// Template 4: Creative Studio
// ========================
export function CreativeStudio({ data, accentColor = '#ec4899' }) {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications } = data;
  return (
    <div className="p-8 font-sans bg-white text-gray-800" style={{ fontSize: '11pt', lineHeight: '1.5' }}>
      <header className="mb-6 relative pl-5" style={{ borderLeft: `4px solid ${accentColor}` }}>
        <h1 className="text-3xl font-extrabold">{personalInfo.name}</h1>
        {personalInfo.jobTitle && <p className="text-sm font-medium mt-1" style={{ color: accentColor }}>{personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>
      {personalInfo.summary && (
        <section className="mb-5 p-4 rounded-lg" style={{ backgroundColor: accentColor + '08' }}>
          <p className="text-xs text-gray-600 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: accentColor }}>★</span>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-[10px] font-semibold border" style={{ borderColor: accentColor + '40', color: accentColor }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold mb-3">💼 Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4 pl-4" style={{ borderLeft: `2px solid ${accentColor}30` }}>
              <h3 className="font-bold text-sm">{exp.title}</h3>
              <p className="text-xs font-medium" style={{ color: accentColor }}>{exp.company} • {exp.duration || `${exp.startDate} - ${exp.endDate}`}</p>
              <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold mb-3">🚀 Projects</h2>
          <div className="grid grid-cols-2 gap-3">
            {projects.map((p, i) => (
              <div key={i} className="p-3 rounded-lg border" style={{ borderColor: accentColor + '20' }}>
                <h3 className="font-bold text-xs mb-1">{p.name}</h3>
                <p className="text-[10px] font-medium mb-1" style={{ color: accentColor }}>{p.tech}</p>
                <p className="text-[10px] text-gray-500 leading-relaxed">{p.description?.substring(0, 120)}{p.description?.length > 120 ? '...' : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold mb-3">🎓 Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-2">
              <p className="text-xs font-semibold">{edu.degree} — {edu.institution}</p>
              <p className="text-[10px] text-gray-400">{edu.year}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</p>
            </div>
          ))}
        </section>
      )}
      {certifications && (
        <section>
          <h2 className="text-sm font-bold mb-2">🏆 Certifications</h2>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{typeof certifications === 'string' ? certifications : certifications.map(c => c.name).join(', ')}</p>
        </section>
      )}
    </div>
  );
}

// ========================
// Template 5: Developer Grid
// ========================
export function DeveloperGrid({ data, accentColor = '#10b981' }) {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications } = data;
  return (
    <div className="p-7 bg-[#0f172a] text-gray-200 font-mono" style={{ fontSize: '10.5pt', lineHeight: '1.6' }}>
      <header className="mb-6 pb-4 border-b border-gray-700">
        <p className="text-[10px] text-gray-500 mb-1">// developer profile</p>
        <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{personalInfo.name}</h1>
        {personalInfo.jobTitle && <p className="text-sm text-gray-400">{'>'} {personalInfo.jobTitle}</p>}
        <div className="flex flex-wrap gap-3 mt-3 text-[10px] text-gray-500">
          {personalInfo.email && <span className="px-2 py-0.5 bg-gray-800 rounded">{personalInfo.email}</span>}
          {personalInfo.phone && <span className="px-2 py-0.5 bg-gray-800 rounded">{personalInfo.phone}</span>}
          {personalInfo.location && <span className="px-2 py-0.5 bg-gray-800 rounded">{personalInfo.location}</span>}
          {personalInfo.github && <span className="px-2 py-0.5 bg-gray-800 rounded">{personalInfo.github}</span>}
        </div>
      </header>
      {personalInfo.summary && (
        <section className="mb-5 p-3 bg-gray-800/50 rounded border-l-2" style={{ borderColor: accentColor }}>
          <p className="text-[10px] text-gray-500 mb-1">/* summary */</p>
          <p className="text-xs text-gray-300">{personalInfo.summary}</p>
        </section>
      )}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold mb-3" style={{ color: accentColor }}>{'<'}Skills{'/>'}</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-gray-800 border border-gray-700" style={{ color: accentColor }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold mb-3" style={{ color: accentColor }}>{'<'}Experience{'/>'}</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4 pl-3 border-l border-gray-700">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-white">{exp.title}</h3>
                <span className="text-[10px] text-gray-500">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
              </div>
              <p className="text-[10px] text-gray-500 mb-1">@ {exp.company}</p>
              <p className="text-xs text-gray-400 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold mb-3" style={{ color: accentColor }}>{'<'}Projects{'/>'}</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3 p-3 bg-gray-800/30 rounded border border-gray-800">
              <h3 className="text-xs font-bold text-white">{p.name}</h3>
              <p className="text-[10px] mb-1" style={{ color: accentColor }}>[{p.tech}]</p>
              <p className="text-[10px] text-gray-400 whitespace-pre-wrap">{p.description}</p>
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold mb-2" style={{ color: accentColor }}>{'<'}Education{'/>'}</h2>
          {education.map((edu, i) => (
            <p key={i} className="text-xs text-gray-400">{edu.degree} — {edu.institution} ({edu.year})</p>
          ))}
        </section>
      )}
      {certifications && (
        <section>
          <h2 className="text-xs font-bold mb-2" style={{ color: accentColor }}>{'<'}Certifications{'/>'}</h2>
          <p className="text-xs text-gray-400 whitespace-pre-wrap">{typeof certifications === 'string' ? certifications : certifications.map(c => c.name).join(', ')}</p>
        </section>
      )}
    </div>
  );
}

// ========================
// Template 6: Fresher First
// ========================
export function FresherFirst({ data, accentColor = '#3b82f6' }) {
  const { personalInfo = {}, education = [], skills = [], experience = [], projects = [], certifications } = data;
  return (
    <div className="p-9 font-sans bg-white text-gray-800" style={{ fontSize: '11pt', lineHeight: '1.6' }}>
      <header className="text-center mb-8 pb-5 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-extrabold mb-1" style={{ color: accentColor }}>{personalInfo.name}</h1>
        {personalInfo.jobTitle && <p className="text-sm text-gray-500 font-medium mb-3">{personalInfo.jobTitle}</p>}
        <div className="flex justify-center flex-wrap gap-3 text-xs text-gray-400">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedin || personalInfo.github) && (
          <div className="flex justify-center gap-3 mt-1 text-xs text-gray-400">
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
          </div>
        )}
      </header>
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>About Me</h2>
          <p className="text-xs text-gray-600 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} className="mb-3 flex justify-between items-baseline">
              <div>
                <p className="font-semibold text-sm">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>{edu.year}</p>
                {edu.cgpa && <p className="font-medium" style={{ color: accentColor }}>CGPA: {edu.cgpa}</p>}
              </div>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ backgroundColor: accentColor + '15', color: accentColor }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-bold text-sm">{p.name}</h3>
              <p className="text-[10px] font-medium mb-1" style={{ color: accentColor }}>{p.tech}</p>
              <p className="text-xs text-gray-600 whitespace-pre-wrap">{p.description}</p>
            </div>
          ))}
        </section>
      )}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: accentColor }}>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm">{exp.title}</h3>
                <span className="text-[10px] text-gray-400">{exp.duration || `${exp.startDate} - ${exp.endDate}`}</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">{exp.company}</p>
              <p className="text-xs text-gray-600 whitespace-pre-wrap">{exp.description}</p>
            </div>
          ))}
        </section>
      )}
      {certifications && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>Certifications & Achievements</h2>
          <p className="text-xs text-gray-600 whitespace-pre-wrap">{typeof certifications === 'string' ? certifications : certifications.map(c => c.name).join(', ')}</p>
        </section>
      )}
    </div>
  );
}

// Template map for easy switching
export const TEMPLATES = {
  'modern-pro': { component: ModernPro, label: 'Modern Pro', description: 'Two-column with sidebar' },
  'corporate-edge': { component: CorporateEdge, label: 'Corporate Edge', description: 'Clean corporate layout' },
  'minimal-black': { component: MinimalBlack, label: 'Minimal Black', description: 'Pure typography, B&W' },
  'creative-studio': { component: CreativeStudio, label: 'Creative Studio', description: 'Colorful creative design' },
  'developer-grid': { component: DeveloperGrid, label: 'Developer Grid', description: 'Dark code aesthetic' },
  'fresher-first': { component: FresherFirst, label: 'Fresher First', description: 'Clean, beginner-friendly' },
};

export const ACCENT_PRESETS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
];
