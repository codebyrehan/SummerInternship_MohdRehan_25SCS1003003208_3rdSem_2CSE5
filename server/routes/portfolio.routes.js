import { Router } from 'express';
import { createPortfolio, getPortfolios, getPublicPortfolio, updatePortfolio, deletePortfolio, fetchGithubRepos } from '../controllers/portfolio.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public route - view portfolio by slug
router.get('/public/:slug', getPublicPortfolio);

// Protected routes
router.post('/', authMiddleware, createPortfolio);
router.get('/', authMiddleware, getPortfolios);
router.put('/:id', authMiddleware, updatePortfolio);
router.delete('/:id', authMiddleware, deletePortfolio);
router.post('/github-repos', authMiddleware, fetchGithubRepos);

export default router;
