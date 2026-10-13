import prisma from '../../common/prisma.js';
import { createViolationRecord } from '../violations/violations.service.js';
import { getSystemConfig } from '../auth/auth.service.js';
import { resolveViolationFromFlag } from '../../common/constants/violationTypes.js';

let ioInstance = null;

export const setSocketIO = (io) => {
  ioInstance = io;
};

export const processIotDataPacket = async ({ tripId, deviceId, kinhDo, viDo, tocDo, co2Level, aiViolationFlag }) => {
  let parsedTripId = tripId ? parseInt(tripId, 10) : null;
  const parsedDeviceId = parseInt(deviceId, 10);
  const lat = parseFloat(viDo);
  const lng = parseFloat(kinhDo);
  const speed = parseFloat(tocDo);
  const co2 = co2Level !== undefined ? parseFloat(co2Level) : null;

  // 1. Auto-lookup active IN_PROGRESS trip if tripId is omitted by hardware
  if (!parsedTripId && parsedDeviceId) {
    const device = await prisma.iotDevice.findUnique({
      where: { id: parsedDeviceId },
      include: { vehicle: true },
    });
    if (device && device.vehicleId) {
      const activeTrip = await prisma.trip.findFirst({
        where: { vehicleId: device.vehicleId, trangThai: 'IN_PROGRESS' },
      });
      if (activeTrip) parsedTripId = activeTrip.id;
    }
  }

  // 2. Log Telemetry (GPS + MQ-135 CO2 Level) to Database
  const logEntry = await prisma.iotDataLog.create({
    data: {
      tripId: parsedTripId,
      deviceId: parsedDeviceId,
      kinhDo: lng,
      viDo: lat,
      tocDo: speed,
      co2Level: co2,
      thoiGianGhiNhan: new Date(),
    },
  });

  // 3. Fetch Trip & Driver info for live tracking and auto-trigger
  let tripInfo = null;
  if (parsedTripId) {
    tripInfo = await prisma.trip.findUnique({
      where: { id: parsedTripId },
      include: {
        driver: { include: { user: true } },
        vehicle: true,
        route: true,
      },
    });
  }

  // Broadcast Real-time Telemetry event (including CO2 & AI flags) via Socket.io
  if (ioInstance) {
    ioInstance.emit('gps_update', {
      logId: logEntry.id,
      tripId: parsedTripId,
      deviceId: parsedDeviceId,
      lat,
      lng,
      speed,
      co2Level: co2,
      aiViolationFlag: aiViolationFlag || null,
      timestamp: logEntry.thoiGianGhiNhan,
      vehicle: tripInfo?.vehicle || null,
      driver: tripInfo?.driver || null,
      route: tripInfo?.route || null,
    });
  }

  // 4. AUTO DEDUCT POINTS & AI SAFETY TRIGGER LOGIC
  if (tripInfo && tripInfo.driver) {
    const driverId = tripInfo.driverId;
    let loaiViPham = null;
    let diemTru = 0;
    let videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    let moTa = '';

    const config = await getSystemConfig();
    const co2Threshold = config.co2PpmThreshold || 1000;

    // Chuẩn hóa loại lỗi thông qua bộ từ điển VIOLATION_TYPES
    const detectedType = resolveViolationFromFlag({
      aiViolationFlag,
      co2,
      speed,
      co2Threshold,
    });

    // Process violation if triggered with anti-spam check window (45s)
    if (detectedType) {
      const recentViolation = await prisma.violation.findFirst({
        where: {
          driverId,
          tripId: parsedTripId,
          loaiViPham: detectedType.code,
          thoiGianViPham: {
            gte: new Date(Date.now() - 45 * 1000), // anti-spam window 45s
          },
        },
      });

      if (!recentViolation) {
        console.log(`🚨 [AI/IOT TRIGGER] [ID ${detectedType.id}] ${detectedType.code} (${detectedType.name}) - Vehicle ${tripInfo.vehicle.bienSo} - Driver ${tripInfo.driver.user.hoTen}`);

        // Gọi createViolationRecord chuẩn hóa (đã bao gồm ID, Code chuẩn, atomic transaction, trừ điểm uy tín, ghi score log, và gửi email)
        const { violation: newViolation, updatedDriver } = await createViolationRecord({
          driverId,
          tripId: parsedTripId,
          violationTypeId: detectedType.id,
          loaiViPham: detectedType.code,
          diemTru: detectedType.defaultPoints,
          videoUrl,
          videoDuration: 15,
          aiConfidenceScore: 0.95, // Hardware AI Edge triggers have high confidence
          moTa: `${detectedType.icon} ${detectedType.description}`,
        });

        // Broadcast violation alert event via Socket.io
        if (ioInstance) {
          ioInstance.emit('violation_detected', {
            violation: newViolation,
            driver: tripInfo.driver,
            vehicle: tripInfo.vehicle,
            updatedUyTin: updatedDriver.uyTin,
          });
        }
      }
    }
  }

  return { success: true, logEntry };
};
