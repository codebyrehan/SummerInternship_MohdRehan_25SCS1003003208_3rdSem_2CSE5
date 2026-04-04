import { callAI, streamAI } from '../services/openai.service.js';
import AtsScore from '../models/AtsScore.js';
import CoverLetter from '../models/CoverLetter.js';
import User from '../models/User.js';

// Helper to check and increment AI usage
const checkAIUsage = async (userId) => {
  const user = await User.findById(userId);
  const now = new Date();
  const resetAt = new Date(user.aiCallsResetAt);
  
  // Reset counter if hour has passed
  if (now - resetAt > 3600000) {
    user.aiCallsUsed = 0;
    user.aiCallsResetAt = now;
  }
  
  if (user.aiCallsUsed >= 20 && user.subscription === 'free') {
    throw { statusCode: 429, message: 'AI rate limit reached. Upgrade to Pro for unlimited access.' };
  }
  
  user.aiCallsUsed += 1;
  await user.save();
};

// 1. Bullet Point Improver
export const improveBullet = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required.' });

    const result = await callAI(
      'You are an elite resume writer. Rewrite this bullet point to be achievement-based, quantified, and ATS-optimized. Use strong action verbs. Return only the improved bullet.',
      text,
      { type: 'improve-bullet' }
    );

    res.json({ success: true, data: { original: text, improved: result } });
  } catch (error) {
    next(error);
  }
};

// 2. ATS Score Checker
export const checkAtsScore = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { resumeText, resumeId } = req.body;
    if (!resumeText) return res.status(400).json({ success: false, message: 'Resume text is required.' });

    const result = await callAI(
      'Analyze this resume for ATS compatibility. Return a JSON object with: score (0-100), strengths (array of strings), weaknesses (array of strings), suggestions (array of strings). Return ONLY valid JSON.',
      resumeText,
      { type: 'ats-score' }
    );

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { score: 65, strengths: ['Formatted correctly'], weaknesses: ['Could not fully parse'], suggestions: ['Try again'] };
    }

    // Save to DB
    if (resumeId) {
      await AtsScore.create({
        user: req.userId,
        resume: resumeId,
        score: parsed.score,
        strengths: parsed.strengths,
        weaknesses: parsed.weaknesses,
        suggestions: parsed.suggestions,
      });
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

// 3. Job Description Matcher
export const matchJob = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ success: false, message: 'Resume text and job description are required.' });
    }

    const result = await callAI(
      'Compare this resume with the job description. Return JSON: matchScore (0-100), missingKeywords (array), strongMatches (array), tailoredSuggestions (array). Return ONLY valid JSON.',
      `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}`,
      { type: 'match-job' }
    );

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { matchScore: 60, missingKeywords: [], strongMatches: [], tailoredSuggestions: ['Unable to parse. Try again.'] };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

// 4. AI Summary Generator
export const generateSummary = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { name, role, skills, experience } = req.body;

    const result = await callAI(
      'Write a 3-sentence professional resume summary for this person. Make it confident, ATS-friendly, and tailored to their field. Return only the summary.',
      `Name: ${name}\nRole: ${role}\nSkills: ${skills?.join(', ')}\nExperience: ${experience}`,
      { type: 'generate-summary', name, role }
    );

    res.json({ success: true, data: { summary: result } });
  } catch (error) {
    next(error);
  }
};

// 5. Cover Letter Generator
export const generateCoverLetter = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { resumeData, jobTitle, companyName, jobDescription, resumeId } = req.body;
    if (!jobTitle || !companyName) {
      return res.status(400).json({ success: false, message: 'Job title and company name are required.' });
    }

    const resumeContext = resumeData ?
      `Name: ${resumeData.personalInfo?.name}\nRole: ${resumeData.personalInfo?.jobTitle}\nSkills: ${[...(resumeData.technicalSkills||[]), ...(resumeData.softSkills||[])].join(', ')}\nExperience: ${resumeData.experience?.map(e => `${e.title} at ${e.company}`).join(', ')}` :
      'A qualified professional';

    const result = await callAI(
      'Write a professional, personalized cover letter for this candidate applying to this role. 3 paragraphs. Confident and specific. Return only the cover letter text.',
      `${resumeContext}\n\nApplying for: ${jobTitle} at ${companyName}\n${jobDescription ? `Job Description: ${jobDescription}` : ''}`,
      { type: 'cover-letter', name: resumeData?.personalInfo?.name, jobTitle, company: companyName }
    );

    // Save cover letter
    const coverLetter = await CoverLetter.create({
      user: req.userId,
      resume: resumeId || undefined,
      jobTitle,
      companyName,
      jobDescription: jobDescription || '',
      content: result,
    });

    res.json({ success: true, data: { coverLetter: coverLetter.toObject(), content: result } });
  } catch (error) {
    next(error);
  }
};

// 6. LinkedIn Headline & Bio Generator
export const generateLinkedin = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { role, skills, experienceSummary } = req.body;

    const result = await callAI(
      'Generate 3 LinkedIn headline options and 1 LinkedIn About section for this professional. Return JSON: headlines (array of 3 strings), about (string). Return ONLY valid JSON.',
      `Role: ${role}\nSkills: ${skills?.join(', ')}\nExperience: ${experienceSummary}`,
      { type: 'linkedin' }
    );

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = {
        headlines: [
          `${role} | Driving Innovation & Results`,
          `Experienced ${role} | Technology Leader`,
          `${role} | Problem Solver | Team Player`,
        ],
        about: `Passionate ${role} with proven expertise in delivering impactful solutions.`
      };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

// 7. Skills Suggestions
export const suggestSkills = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { role, existingSkills } = req.body;

    const result = await callAI(
      `Suggest 10 relevant technical and soft skills for a ${role || 'professional'} that are high-demand in 2025. Exclude any skills already listed. Return JSON: technicalSkills (array), softSkills (array). Return ONLY valid JSON.`,
      `Role: ${role}\nExisting Skills: ${existingSkills?.join(', ')}`,
      { type: 'suggest-skills', role }
    );

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      parsed = { technicalSkills: ['React.js', 'TypeScript', 'Python', 'AWS', 'Docker'], softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Adaptability'] };
    }

    res.json({ success: true, data: parsed });
  } catch (error) {
    next(error);
  }
};

// 8. Project Description Improver
export const improveProject = async (req, res, next) => {
  try {
    await checkAIUsage(req.userId);
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Text is required.' });

    const result = await callAI(
      'Improve this project description for a resume. Make it sound impressive, technical, and impactful. Mention tech stack impact. Return only the improved description.',
      text,
      { type: 'improve-project' }
    );

    res.json({ success: true, data: { original: text, improved: result } });
  } catch (error) {
    next(error);
  }
};

// Get cover letters
export const getCoverLetters = async (req, res, next) => {
  try {
    const coverLetters = await CoverLetter.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: { coverLetters } });
  } catch (error) {
    next(error);
  }
};

// Get ATS score history
export const getAtsHistory = async (req, res, next) => {
  try {
    const scores = await AtsScore.find({ user: req.userId }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: { scores } });
  } catch (error) {
    next(error);
  }
};
