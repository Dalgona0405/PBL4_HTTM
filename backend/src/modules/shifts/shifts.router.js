import express from 'express';
import { getShifts, createShift, respondToShift } from './shifts.controller.js';
import { requireAuth, requireRole } from '../../common/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', getShifts);
router.post('/', requireRole('ADMIN', 'MANAGER'), createShift);
router.patch('/:id/respond', respondToShift);

export default router;
