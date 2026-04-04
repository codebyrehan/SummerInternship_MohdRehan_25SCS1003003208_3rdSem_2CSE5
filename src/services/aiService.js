import api from './api.js';

// Mock fallback for when backend is not connected
const mockDelay = () => new Promise(r => setTimeout(r, 1200));

const handleAICall = async (endpoint, payload) => {
  try {
    const { data } = await api.post(`/ai/${endpoint}`, payload);
    return data.data;
  } catch (err) {
    // If server unreachable, use client-side mock
    if (!err.response) {
      console.warn(`AI call to ${endpoint} failed, using mock`);
      return getMockResponse(endpoint, payload);
    }
    throw err;
  }
};

const getMockResponse = async (endpoint, payload) => {
  await mockDelay();
  const mocks = {
    'improve-bullet': { original: payload.text, improved: `• Spearheaded and optimized ${payload.text?.substring(0, 60)}..., achieving a 40% improvement in key metrics through data-driven strategies and cross-functional collaboration` },
    'improve-project': { original: payload.text, improved: `Engineered a high-performance ${payload.text?.substring(0, 50)}... leveraging modern architecture patterns. Achieved 95% test coverage with zero production incidents, delivering 2 weeks ahead of schedule.` },
    'ats-score': { score: 72, strengths: ['Good action verbs', 'Clear formatting', 'Relevant skills'], weaknesses: ['Missing quantified achievements', 'No job-specific keywords', 'Weak summary'], suggestions: ['Add measurable results', 'Include industry keywords', 'Strengthen professional summary', 'Use specific technical terms'] },
    'match-job': { matchScore: 68, missingKeywords: ['agile', 'CI/CD', 'microservices', 'cloud computing'], strongMatches: ['JavaScript', 'React', 'Node.js', 'problem-solving'], tailoredSuggestions: ['Add agile methodology experience', 'Highlight CI/CD pipeline work', 'Mention cloud platform experience'] },
    'generate-summary': { summary: `Results-driven ${payload.role || 'professional'} with proven expertise in delivering high-impact solutions. Combining strong technical skills with strategic thinking to drive innovation and efficiency. Passionate about leveraging technology to solve complex problems and create meaningful user experiences.` },
    'cover-letter': { content: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${payload.jobTitle || 'position'} at ${payload.companyName || 'your company'}. With my proven track record and passion for innovation, I am confident I would be a valuable addition to your team.\n\nThroughout my career, I have consistently demonstrated the ability to tackle complex challenges and drive meaningful outcomes. My technical expertise, combined with strong communication skills, positions me uniquely to contribute to ${payload.companyName || 'your organization'}'s continued success.\n\nI would welcome the opportunity to discuss how my skills align with your needs. Thank you for considering my application.\n\nSincerely,\n${payload.resumeData?.personalInfo?.name || 'Applicant'}`, coverLetter: { _id: 'mock-' + Date.now(), jobTitle: payload.jobTitle, companyName: payload.companyName } },
    'linkedin': { headlines: [`Senior ${payload.role || 'Professional'} | Building Scalable Solutions | Innovation Leader`, `${payload.role || 'Professional'} | AI Enthusiast | Turning Ideas into Products`, `Tech ${payload.role || 'Professional'} | Problem Solver | Growth Mindset`], about: `Passionate technology professional dedicated to building solutions that make a real difference. With deep expertise across modern technologies and commitment to continuous learning, I thrive in fast-paced environments where innovation drives impact.` },
    'suggest-skills': { technicalSkills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'Git', 'REST APIs'], softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Agile', 'Critical Thinking', 'Time Management', 'Adaptability', 'Collaboration', 'Mentoring', 'Strategic Planning'] },
  };
  return mocks[endpoint] || { message: 'Mock response' };
};

// 1. Improve bullet point
export const improveBullet = (text) => handleAICall('improve-bullet', { text });

// 2. Check ATS score
export const checkAtsScore = (resumeText, resumeId) => handleAICall('ats-score', { resumeText, resumeId });

// 3. Match job description
export const matchJob = (resumeText, jobDescription) => handleAICall('match-job', { resumeText, jobDescription });

// 4. Generate summary
export const generateSummary = (name, role, skills, experience) =>
  handleAICall('generate-summary', { name, role, skills, experience });

// 5. Generate cover letter
export const generateCoverLetter = (resumeData, jobTitle, companyName, jobDescription, resumeId) =>
  handleAICall('cover-letter', { resumeData, jobTitle, companyName, jobDescription, resumeId });

// 6. LinkedIn generator
export const generateLinkedin = (role, skills, experienceSummary) =>
  handleAICall('linkedin', { role, skills, experienceSummary });

// 7. Suggest skills
export const suggestSkills = (role, existingSkills) =>
  handleAICall('suggest-skills', { role, existingSkills });

// 8. Improve project description
export const improveProject = (text) => handleAICall('improve-project', { text });

// Get cover letters history
export const getCoverLetters = async () => {
  try {
    const { data } = await api.get('/ai/cover-letters');
    return data.data.coverLetters;
  } catch { return []; }
};

// Get ATS history
export const getAtsHistory = async () => {
  try {
    const { data } = await api.get('/ai/ats-history');
    return data.data.scores;
  } catch { return []; }
};

// Legacy support for existing improveTextWithAI
export const improveTextWithAI = async (text, section) => {
  try {
    const result = section === 'projects'
      ? await improveProject(text)
      : await improveBullet(text);
    return result.improved;
  } catch {
    await mockDelay();
    return `[Enhanced] ${text}\n\n• Achieved measurable improvements through strategic implementation\n• Leveraged cross-functional collaboration to deliver results ahead of schedule`;
  }
};
