import express from 'express';
import { 
  handleRegister, 
  handleLogin, 
  handleGetMe,
  handleGetUsers,
  handleUpdateUser,
  handleGetConfig,
  handleUpdateConfig 
} from './auth.controller.js';
import { requireAuth, requireRole } from '../../common/auth.middleware.js';

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);

router.use(requireAuth);

router.get('/me', handleGetMe);
router.get('/users', requireRole('ADMIN'), handleGetUsers);
router.patch('/users/:userId', requireRole('ADMIN'), handleUpdateUser);
router.get('/config', requireRole('ADMIN', 'MANAGER'), handleGetConfig);
router.put('/config', requireRole('ADMIN'), handleUpdateConfig);

export default router;

