import express from 'express';
import { getAuditLogs } from './audit.controller.js';
import { requireAuth, requireRole } from '../../common/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', requireRole('ADMIN', 'MANAGER'), getAuditLogs);

export default router;
