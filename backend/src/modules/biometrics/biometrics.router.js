import express from 'express';
import { getBiometricProfile, getCalibrations, saveCalibration } from './biometrics.controller.js';
import { requireAuth } from '../../common/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/profile/:driverId', getBiometricProfile);
router.get('/calibration/:driverId', getCalibrations);
router.post('/calibration', saveCalibration);

export default router;
