import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Globe, Link as LinkIcon, Mail, ExternalLink, ArrowLeft } from 'lucide-react';

export default function Portfolio() {
  const [data] = useLocalStorage('resume_data', null);

  // If no data, or if username doesn't match the current user roughly, we could show a 404.
  // We'll just show the local data.
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center">
          <h1 className="text-3xl font-syne mb-4 text-dark">Portfolio Not Found</h1>
          <p className="text-body mb-6">Looks like no resume data was saved locally.</p>
          <Link to="/build" className="px-6 py-3 bg-primary text-white rounded-lg inline-block">Create Resume</Link>
        </div>
      </div>
    );
  }

  const { personalInfo, skills, experience, projects, certifications } = data;

  return (
    <div className="min-h-screen bg-light text-dark font-sans selection:bg-primary/20">
      
      {/* Floating Back Button */}
      <Link to="/preview" className="fixed top-6 left-6 z-50 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg text-dark transition-all hidden md:flex items-center justify-center group">
        <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
      </Link>

      {/* Hero Section */}
      <section className="bg-white min-h-[70vh] flex flex-col items-center justify-center text-center px-6 border-b border-gray-100">
        <h1 className="text-5xl md:text-7xl font-syne font-extrabold mb-6 tracking-tight text-dark">
          Hi, I'm <span className="text-primary">{personalInfo.name || 'Anonymous'}</span>
        </h1>
        {experience[0]?.title && (
          <p className="text-2xl md:text-3xl text-gray-400 mb-8 font-light">
            I'm a <span className="text-dark font-medium">{experience[0].title}</span>
          </p>
        )}
        <div className="flex gap-4">
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="p-3 bg-light rounded-full text-primary hover:bg-primary hover:text-white transition-all">
              <Mail />
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="p-3 bg-light rounded-full text-primary hover:bg-primary hover:text-white transition-all">
              <Globe />
            </a>
          )}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="p-3 bg-light rounded-full text-primary hover:bg-primary hover:text-white transition-all">
              <LinkIcon />
            </a>
          )}
        </div>
      </section>

      {/* About / Location */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center border-b border-gray-200">
         <h2 className="text-3xl font-syne font-bold mb-6">About Me</h2>
         <p className="text-xl text-body leading-relaxed">
           Based in <span className="text-dark font-medium">{personalInfo.location || 'Unknown'}</span>. 
           Passionate about building impactful projects and delivering exceptional solutions.
         </p>
      </section>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="py-24 px-6 bg-white border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-syne font-bold mb-12 text-center text-dark">Skills</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill, i) => (
                <span key={i} className="px-6 py-3 bg-light text-dark rounded-xl font-medium text-lg border border-gray-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="py-24 px-6 max-w-6xl mx-auto border-b border-gray-200">
          <h2 className="text-4xl font-syne font-bold mb-16 text-center text-dark">Selected Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold font-syne text-dark">{proj.name}</h3>
                  {proj.link && (
                    <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                      <ExternalLink size={24} className="group-hover:scale-110" />
                    </a>
                  )}
                </div>
                <p className="font-semibold text-secondary text-sm mb-4 tracking-wider uppercase">{proj.tech}</p>
                <p className="text-body leading-relaxed flex-1 whitespace-pre-wrap">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience Timeline */}
      {experience && experience.length > 0 && (
        <section className="py-24 px-6 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-syne font-bold mb-16 text-center text-dark">Experience</h2>
            <div className="space-y-12 pl-6 relative">
              <div className="absolute left-6 top-2 bottom-2 w-px bg-gray-200 -ml-px"></div>
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-8 md:pl-12">
                  <div className="absolute left-[-24px] top-1 w-12 h-12 bg-light rounded-full border-4 border-white flex items-center justify-center text-primary shadow-sm z-10">
                    <span className="w-3 h-3 bg-primary rounded-full"></span>
                  </div>
                  <div className="flex flex-col md:flex-row md:justify-between items-start md:items-baseline mb-2">
                    <h3 className="text-2xl font-bold text-dark font-syne">{exp.title}</h3>
                    <span className="bg-dark text-white px-3 py-1 rounded-full text-xs font-semibold">{exp.duration}</span>
                  </div>
                  <h4 className="text-lg text-primary font-medium mb-4">{exp.company}</h4>
                  <p className="text-body leading-relaxed whitespace-pre-wrap bg-gray-50 border border-gray-100 p-6 rounded-xl">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && (
        <section className="py-24 px-6 max-w-4xl mx-auto text-center border-b border-gray-200">
         <h2 className="text-3xl font-syne font-bold mb-8">Certifications & Achievements</h2>
         <p className="text-lg text-body leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto">
           {certifications}
         </p>
      </section>
      )}

      {/* Contact Banner */}
      <section className="py-32 px-6 bg-primary text-white text-center flex flex-col items-center">
        <h2 className="text-5xl font-syne font-bold mb-6 text-white leading-tight">Let's work together.</h2>
        <p className="text-lg text-primary-200 mb-10 max-w-md opacity-90">I'm currently open for new opportunities. Feel free to reach out to me.</p>
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} className="px-10 py-5 bg-white text-dark font-bold rounded-xl text-lg hover:scale-105 shadow-xl transition-all inline-flex items-center gap-3">
            Say Hello <Mail size={20} className="text-primary"/>
          </a>
        )}
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-dark text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} {personalInfo.name}. Auto-generated by Quick Hire AI.</p>
      </footer>
    </div>
  );
}
