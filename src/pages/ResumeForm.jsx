import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ArrowLeft, ArrowRight, Check, Plus, X } from 'lucide-react';

const emptyResumeData = {
  personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', location: '' },
  education: [],
  skills: [],
  experience: [],
  projects: [],
  certifications: ''
};

export default function ResumeForm() {
  const navigate = useNavigate();
  const [data, setData] = useLocalStorage('resume_data', emptyResumeData);
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Handlers for personal info
  const handlePersonalChange = (e) => {
    setData({
      ...data,
      personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value }
    });
  };

  // Handlers for Skills
  const [skillInput, setSkillInput] = useState('');
  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
      setData({ ...data, skills: [...data.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };
  const removeSkill = (skillToRemove) => {
    setData({ ...data, skills: data.skills.filter(s => s !== skillToRemove) });
  };

  // Handlers for Arrays (Education, Experience, Projects)
  const addListItem = (key, emptyItem) => {
    setData({ ...data, [key]: [...data[key], emptyItem] });
  };
  const updateListItem = (key, index, field, value) => {
    const updated = [...data[key]];
    updated[index][field] = value;
    setData({ ...data, [key]: updated });
  };
  const removeListItem = (key, index) => {
    setData({ ...data, [key]: data[key].filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-light flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-semibold text-body">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[50vh]">
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-syne mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['name', 'email', 'phone', 'location', 'linkedin', 'github'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                    <input 
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={data.personalInfo[field]}
                      onChange={handlePersonalChange}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder={`Enter your ${field}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-syne mb-6">Education</h2>
              {data.education.map((edu, idx) => (
                <div key={idx} className="mb-6 p-4 border border-gray-100 rounded-xl relative bg-gray-50">
                  <button onClick={() => removeListItem('education', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateListItem('education', idx, 'degree', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateListItem('education', idx, 'institution', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateListItem('education', idx, 'year', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="CGPA" value={edu.cgpa} onChange={(e) => updateListItem('education', idx, 'cgpa', e.target.value)} className="p-3 border rounded-lg" />
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addListItem('education', { degree: '', institution: '', year: '', cgpa: '' })}
                className="flex items-center gap-2 text-primary font-medium hover:text-dark px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg w-full justify-center"
              >
                <Plus size={18} /> Add Education
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-syne mb-6">Skills</h2>
              <form onSubmit={addSkill} className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:border-primary outline-none"
                  placeholder="e.g. React, Python, Project Management"
                />
                <button type="submit" className="px-6 bg-primary text-white p-3 rounded-lg hover:bg-dark transition-colors">Add</button>
              </form>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span key={idx} className="bg-light px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-gray-200">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-dark"><X size={14}/></button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-syne mb-6">Experience</h2>
              {data.experience.map((exp, idx) => (
                <div key={idx} className="mb-6 p-4 border border-gray-100 rounded-xl relative bg-gray-50 flex flex-col gap-4">
                  <button onClick={() => removeListItem('experience', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => updateListItem('experience', idx, 'title', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateListItem('experience', idx, 'company', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Duration (e.g. 2020 - 2023)" value={exp.duration} onChange={(e) => updateListItem('experience', idx, 'duration', e.target.value)} className="p-3 border rounded-lg" />
                  </div>
                  <textarea 
                    placeholder="Describe your responsibilities and achievements (AI will polish this later in Preview)" 
                    value={exp.description} 
                    onChange={(e) => updateListItem('experience', idx, 'description', e.target.value)} 
                    className="p-3 border rounded-lg h-24 w-full"
                  />
                </div>
              ))}
              <button 
                onClick={() => addListItem('experience', { title: '', company: '', duration: '', description: '' })}
                className="flex items-center gap-2 text-primary font-medium hover:text-dark px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg w-full justify-center"
              >
                <Plus size={18} /> Add Experience
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-syne mb-6">Projects</h2>
              {data.projects.map((proj, idx) => (
                <div key={idx} className="mb-6 p-4 border border-gray-100 rounded-xl relative bg-gray-50 flex flex-col gap-4">
                  <button onClick={() => removeListItem('projects', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => updateListItem('projects', idx, 'name', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Tech Stack" value={proj.tech} onChange={(e) => updateListItem('projects', idx, 'tech', e.target.value)} className="p-3 border rounded-lg" />
                    <input type="text" placeholder="Link (Live/GitHub)" value={proj.link} onChange={(e) => updateListItem('projects', idx, 'link', e.target.value)} className="p-3 border rounded-lg md:col-span-2" />
                  </div>
                  <textarea 
                    placeholder="Project description" 
                    value={proj.description} 
                    onChange={(e) => updateListItem('projects', idx, 'description', e.target.value)} 
                    className="p-3 border rounded-lg h-24 w-full"
                  />
                </div>
              ))}
              <button 
                onClick={() => addListItem('projects', { name: '', tech: '', link: '', description: '' })}
                className="flex items-center gap-2 text-primary font-medium hover:text-dark px-4 py-2 border-2 border-dashed border-gray-200 rounded-lg w-full justify-center"
              >
                <Plus size={18} /> Add Project
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-syne mb-6">Certifications & Achievements</h2>
              <textarea 
                placeholder="List your certifications, awards, or relevant achievements..." 
                value={data.certifications} 
                onChange={(e) => setData({...data, certifications: e.target.value})} 
                className="w-full p-4 border border-gray-200 rounded-xl min-h-[200px] outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 rounded-lg font-medium text-body hover:bg-gray-100 disabled:opacity-50 flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Back
          </button>
          
          {step < totalSteps ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 rounded-lg font-medium text-white bg-dark hover:bg-black flex items-center gap-2 transition-all"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={() => navigate('/preview')}
              className="px-8 py-3 rounded-lg font-bold text-white bg-primary hover:scale-105 shadow-lg flex items-center gap-2 transition-all"
            >
              Generate Resume <Check size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
