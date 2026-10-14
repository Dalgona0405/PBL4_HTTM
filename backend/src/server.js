import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import { setSocketIO } from './modules/iot/iot.service.js';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const envOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = [
  ...new Set([
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
    ...envOrigins,
  ]),
];

// Initialize Socket.io Server for Real-time Telemetry & Live Map Updates
const io = new SocketIOServer(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setSocketIO(io);

io.on('connection', (socket) => {
  console.log(`🔌 Client Socket Connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`❌ Client Socket Disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 PBL4 FLEET BACKEND SERVER RUNNING ON PORT ${PORT}`);
  console.log(`📡 WebSocket / Socket.io Live Tracking Ready`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log('==================================================');
});
