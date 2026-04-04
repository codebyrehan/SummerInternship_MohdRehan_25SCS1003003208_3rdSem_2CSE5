import { Router } from 'express';
import { improveBullet, checkAtsScore, matchJob, generateSummary, generateCoverLetter, generateLinkedin, suggestSkills, improveProject, getCoverLetters, getAtsHistory } from '../controllers/ai.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// All AI routes require auth + rate limiting
router.use(authMiddleware);
router.use(aiLimiter);

router.post('/improve-bullet', improveBullet);
router.post('/ats-score', checkAtsScore);
router.post('/match-job', matchJob);
router.post('/generate-summary', generateSummary);
router.post('/cover-letter', generateCoverLetter);
router.post('/linkedin', generateLinkedin);
router.post('/suggest-skills', suggestSkills);
router.post('/improve-project', improveProject);

// Data retrieval
router.get('/cover-letters', getCoverLetters);
router.get('/ats-history', getAtsHistory);

export default router;
