import express from 'express';
import { handleIngestTelemetry } from './iot.controller.js';

const router = express.Router();

// Middleware xác thực thiết bị IoT (ESP32 / Raspberry Pi)
const requireDeviceAuth = (req, res, next) => {
  const deviceToken = req.headers['x-device-token'];
  const expectedToken = process.env.IOT_DEVICE_SECRET;

  if (!expectedToken) {
    // Nếu chưa cấu hình token trong .env, cho phép trong môi trường dev
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'IoT device authentication not configured.' });
    }
    return next();
  }

  if (!deviceToken || deviceToken !== expectedToken) {
    return res.status(401).json({ message: 'Thiết bị IoT không được xác thực. Vui lòng cung cấp x-device-token hợp lệ.' });
  }

  next();
};

// Public / API Key protected endpoint for IoT Hardware & Simulator Telemetry packets
router.post('/telemetry', requireDeviceAuth, handleIngestTelemetry);

export default router;
