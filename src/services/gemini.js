// Gemini AI Service — proxies through Express backend
const API_BASE = import.meta.env.PROD ? '/api/ai' : 'http://localhost:5000/api/ai';

async function callAI(endpoint, data) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'AI request failed');
  return json.data;
}

export const generateResumeSummary = (data) => callAI('resume-summary', data);
export const improveBullet = (bullet, context) => callAI('improve-bullet', { bullet, context });
export const generateCoverLetter = (profile, jobDescription, companyName, tone) =>
  callAI('cover-letter', { profile, jobDescription, companyName, tone });
export const analyzeSkillGap = (profile, jobDescription) =>
  callAI('skill-gap', { profile, jobDescription });
export const generateInterviewPrep = (role, skills, level) =>
  callAI('interview-prep', { role, skills, level });
export const generatePortfolioBio = (profile) => callAI('portfolio-bio', { profile });