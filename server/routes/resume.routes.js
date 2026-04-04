import { Router } from 'express';
import { createResume, getResumes, getResume, updateResume, deleteResume, restoreVersion, getVersions, exportPdf } from '../controllers/resume.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All routes require auth
router.use(authMiddleware);

router.post('/', createResume);
router.get('/', getResumes);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.get('/:id/versions', getVersions);
router.post('/:id/restore', restoreVersion);
router.post('/:id/export', exportPdf);

export default router;
