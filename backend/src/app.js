import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import jwt from 'jsonwebtoken';

import authRouter from './modules/auth/auth.router.js';
import assetsRouter from './modules/assets/assets.router.js';
import tripsRouter from './modules/trips/trips.router.js';
import iotRouter from './modules/iot/iot.router.js';
import violationsRouter from './modules/violations/violations.router.js';
import uploadRouter from './modules/upload/upload.router.js';
import shiftsRouter from './modules/shifts/shifts.router.js';
import biometricsRouter from './modules/biometrics/biometrics.router.js';
import auditRouter from './modules/audit/audit.router.js';

const app = express();

app.set('trust proxy', 1);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', system: 'PBL4 Fleet IoT Management', uptime: process.uptime() }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', system: 'PBL4 Fleet IoT Management', uptime: process.uptime() }));

// Helmet Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
        callback(new Error('CORS: Origin không được phép.'));
      }
    },
    credentials: true,
  })
);

// Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
});

app.use(globalLimiter);

// Body Parsing
app.use(express.json());
app.use(cookieParser());

// Static File Serving (Uploaded Videos) - Yêu cầu xác thực
app.use('/uploads', (req, res, next) => {
  const token = req.query.token || req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ message: 'Yêu cầu xác thực để truy cập video bằng chứng.' });
  }
  try {
    const secret = process.env.ACCESS_JWT_SECRET || 'pbl4_access_token_secret_key_2026_super_secure_node_jwt_auth_key';
    jwt.verify(token, secret);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}, express.static(path.join(process.cwd(), 'uploads')));

// Routes Registration
app.use('/api/auth', authRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/iot', iotRouter);
app.use('/api/violations', violationsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/biometrics', biometricsRouter);
app.use('/api/audit', auditRouter);


// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Lỗi hệ thống nội bộ.',
  });
});

export default app;
