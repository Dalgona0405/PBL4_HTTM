import express from 'express';
import { getViolations, createViolation, getDriversScore, reviewViolation } from './violations.controller.js';
import { requireAuth, requireRole } from '../../common/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getViolations);
router.get('/drivers-score', requireRole('MANAGER', 'ADMIN'), getDriversScore);
router.post('/', requireRole('MANAGER', 'ADMIN'), createViolation);
router.post('/:id/review', requireRole('MANAGER', 'ADMIN'), reviewViolation);

export default router;

