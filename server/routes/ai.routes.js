import express from 'express';
const router = express.Router();

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set. Add it in Render environment variables.');
  const res = await fetch(GEMINI_URL + '?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2048 } })
  });
  if (!res.ok) { const e = await res.text(); throw new Error('Gemini error: ' + e); }
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// Resume summary
router.post('/resume-summary', async (req, res) => {
  try {
    const { name, skills, projects, targetRole } = req.body;
    const p = `Write a powerful 3-4 sentence professional resume summary.\nName: ${name}\nTarget: ${targetRole || 'Software Engineer'}\nSkills: ${Array.isArray(skills) ? skills.join(', ') : skills}\nProjects: ${JSON.stringify((projects || []).slice(0, 3))}\nReturn ONLY the summary text.`;
    res.json({ success: true, data: await callGemini(p) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Improve bullet
router.post('/improve-bullet', async (req, res) => {
  try {
    const { bullet, context } = req.body;
    const p = `Rewrite this resume bullet using STAR method with quantified impact (max 20 words).\nOriginal: "${bullet}"\nContext: ${context || 'student project'}\nReturn ONLY the improved bullet.`;
    res.json({ success: true, data: (await callGemini(p)).trim() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Cover letter
router.post('/cover-letter', async (req, res) => {
  try {
    const { profile, jobDescription, companyName, tone } = req.body;
    const name = profile?.personalInfo?.name || 'the candidate';
    const skills = (profile?.skills || []).join(', ');
    const projects = (profile?.projects || []).map(p => p.title).join(', ');
    const p = `Write a compelling 4-paragraph cover letter for ${name} applying to ${companyName || 'this company'}.\nSkills: ${skills}\nProjects: ${projects}\nJob:\n${jobDescription || ''}\nTone: ${tone || 'professional'}\nReturn ONLY the cover letter text.`;
    res.json({ success: true, data: await callGemini(p) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Skill gap
router.post('/skill-gap', async (req, res) => {
  try {
    const { profile, jobDescription } = req.body;
    const p = `Analyze skill gap. Return ONLY valid JSON no markdown.\nStudent Skills: ${(profile?.skills || []).join(', ')}\nJob: ${(jobDescription || '').substring(0, 800)}\nJSON format: {"atsScore":75,"matchedSkills":["React"],"missingSkills":["Docker"],"recommendations":["Learn Docker"],"summary":"brief"}`;
    const text = await callGemini(p);
    let parsed;
    try { parsed = JSON.parse(text.replace(/```json|```/g, '').trim()); }
    catch { parsed = { atsScore: 65, matchedSkills: [], missingSkills: [], recommendations: ['Tailor your resume to the JD'], summary: text }; }
    res.json({ success: true, data: parsed });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Interview prep
router.post('/interview-prep', async (req, res) => {
  try {
    const { role, skills, level } = req.body;
    const p = `Generate 6 interview Q&As for ${level || 'entry-level'} ${role} role.\nSkills: ${Array.isArray(skills) ? skills.join(', ') : skills}\nReturn ONLY valid JSON array: [{"type":"technical","question":"...","answer":"...","tip":"..."}]`;
    const text = await callGemini(p);
    let parsed;
    try { parsed = JSON.parse(text.replace(/```json|```/g, '').trim()); }
    catch { parsed = [{ type: 'general', question: 'Tell me about your ' + role + ' background', answer: text, tip: 'Be specific' }]; }
    res.json({ success: true, data: parsed });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// Portfolio bio
router.post('/portfolio-bio', async (req, res) => {
  try {
    const { profile } = req.body;
    const name = profile?.personalInfo?.name || 'a developer';
    const skills = (profile?.skills || []).join(', ');
    const p = `Write a 2-sentence developer portfolio bio for ${name}.\nSkills: ${skills}\nReturn ONLY the bio.`;
    res.json({ success: true, data: (await callGemini(p)).trim() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;