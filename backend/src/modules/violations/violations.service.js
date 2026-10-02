import prisma from '../../common/prisma.js';
import { sendViolationEmailAlert } from '../../common/email.service.js';
import { logAuditAction } from '../../common/audit.service.js';

export const getAllViolations = async ({ driverId, tripId, status }) => {
  const where = {};
  if (driverId) where.driverId = parseInt(driverId, 10);
  if (tripId) where.tripId = parseInt(tripId, 10);
  if (status) where.trangThai = status;

  return prisma.violation.findMany({
    where,
    include: {
      driver: { include: { user: true } },
      trip: { include: { vehicle: true, route: true } },
      reviewer: true,
    },
    orderBy: { thoiGianViPham: 'desc' },
  });
};

export const createViolationRecord = async ({ driverId, tripId, loaiViPham, diemTru, videoUrl, videoDuration, aiConfidenceScore, moTa }) => {
  const parsedDriverId = parseInt(driverId, 10);
  const parsedTripId = parseInt(tripId, 10);
  const ptsToDeduct = parseInt(diemTru || 5, 10);
  const confidence = aiConfidenceScore !== undefined ? parseFloat(aiConfidenceScore) : 0.90;

  let initialStatus = 'PENDING_VERIFICATION';
  if (confidence >= 0.85) {
    initialStatus = 'CONFIRMED';
  } else if (confidence < 0.60) {
    initialStatus = 'REJECTED';
  } else {
    initialStatus = 'PENDING_MANUAL_REVIEW';
  }

  // Fetch trip route rest stops
  const tripData = await prisma.trip.findUnique({
    where: { id: parsedTripId },
    include: { route: true },
  });

  let restStopGuidance = null;
  if (tripData?.route?.danhSachTramDungChan) {
    try {
      const restStops = JSON.parse(tripData.route.danhSachTramDungChan);
      if (restStops && restStops.length > 0) {
        const nextStop = restStops[0];
        restStopGuidance = {
          tenTram: nextStop.ten,
          kmConLai: 4.2,
          phutConLai: 5,
          thongBaoGiongNoi: `Cảnh báo an toàn! Còn khoảng 4.2 km (5 phút) nữa sẽ đến ${nextStop.ten}. Vui lòng giảm tốc độ và dừng xe nghỉ ngơi hoặc đổi ca lái!`,
        };
      }
    } catch (e) {
      console.error('Error parsing rest stops:', e);
    }
  }

  if (!restStopGuidance) {
    restStopGuidance = {
      tenTram: 'Trạm Dừng Chân Nam Hải Vân (Km 25)',
      kmConLai: 4.2,
      phutConLai: 5,
      thongBaoGiongNoi: 'Cảnh báo buồn ngủ! Còn 4.2 km (khoảng 5 phút) nữa sẽ đến Trạm Dừng Chân Nam Hải Vân. Vui lòng giảm tốc độ để dừng xe nghỉ ngơi hoặc đổi ca lái!',
    };
  }

  // Insert Violation Record
  const violation = await prisma.violation.create({
    data: {
      driverId: parsedDriverId,
      tripId: parsedTripId,
      loaiViPham,
      diemTru: ptsToDeduct,
      videoUrl: videoUrl || null,
      videoDuration: videoDuration ? parseInt(videoDuration, 10) : null,
      trangThai: initialStatus,
      aiConfidenceScore: confidence,
      tramDungChanGoiY: JSON.stringify(restStopGuidance),
      thoiGianBatDauTheoDoi: new Date(Date.now() - 30 * 1000),
      thoiGianChotViPham: new Date(),
      thoiGianViPham: new Date(),
      moTa: moTa || `Khởi tạo vi phạm (AI Confidence: ${(confidence * 100).toFixed(0)}%).`,
    },
    include: {
      driver: { include: { user: true } },
      trip: { include: { vehicle: true, route: true } },
    },
  });


  // ONLY DEDUCT POINTS IF STATUS IS CONFIRMED! (Section 3.2 Rule)
  let updatedDriver = violation.driver;
  if (initialStatus === 'CONFIRMED') {
    const currentUyTin = violation.driver.uyTin;
    const newUyTin = Math.max(0, currentUyTin - ptsToDeduct);

    updatedDriver = await prisma.driver.update({
      where: { userId: parsedDriverId },
      data: { uyTin: newUyTin },
    });

    // Record Driver Score Log
    await prisma.driverScoreLog.create({
      data: {
        driverId: parsedDriverId,
        loaiThayDoi: 'TRU_DIEM',
        soDiemThayDoi: ptsToDeduct,
        diemTruoc: currentUyTin,
        diemSau: newUyTin,
        lyDo: `Xác thực vi phạm: ${loaiViPham}`,
        violationId: violation.id,
        tripId: parsedTripId,
      },
    });

    // Send Email Alert
    sendViolationEmailAlert({
      driverName: violation.driver.user.hoTen,
      driverEmail: violation.driver.user.username + '@gmail.com',
      bienSo: violation.trip.vehicle.bienSo,
      loaiViPham: violation.loaiViPham,
      diemTru: ptsToDeduct,
      uyTinConLai: updatedDriver.uyTin,
      tocDo: 'N/A',
      videoUrl: violation.videoUrl,
    }).catch((e) => console.error(e));
  }

  return { violation, updatedDriver };
};

export const reviewViolationManual = async (violationId, { action, lyDo, reviewerId }) => {
  const id = parseInt(violationId, 10);
  const pReviewerId = parseInt(reviewerId, 10);

  const violation = await prisma.violation.findUnique({
    where: { id },
    include: {
      driver: { include: { user: true } },
      trip: { include: { vehicle: true } },
    },
  });

  if (!violation) throw new Error('Bản ghi vi phạm không tồn tại.');

  if (violation.trangThai === 'CONFIRMED' || violation.trangThai === 'MANUALLY_CONFIRMED') {
    throw new Error('Vi phạm này đã được xác nhận trước đó.');
  }

  let newStatus = action === 'CONFIRM' ? 'MANUALLY_CONFIRMED' : 'MANUALLY_REJECTED';
  let updatedDriver = violation.driver;

  if (action === 'CONFIRM') {
    const currentUyTin = violation.driver.uyTin;
    const newUyTin = Math.max(0, currentUyTin - violation.diemTru);

    updatedDriver = await prisma.driver.update({
      where: { userId: violation.driverId },
      data: { uyTin: newUyTin },
    });

    // Record Driver Score Log
    await prisma.driverScoreLog.create({
      data: {
        driverId: violation.driverId,
        loaiThayDoi: 'TRU_DIEM',
        soDiemThayDoi: violation.diemTru,
        diemTruoc: currentUyTin,
        diemSau: newUyTin,
        lyDo: `Xác thực thủ công bởi Quản lý: ${violation.loaiViPham}. ${lyDo || ''}`,
        violationId: violation.id,
        tripId: violation.tripId,
      },
    });

    // Send Email Alert
    sendViolationEmailAlert({
      driverName: violation.driver.user.hoTen,
      driverEmail: violation.driver.user.username + '@gmail.com',
      bienSo: violation.trip.vehicle.bienSo,
      loaiViPham: violation.loaiViPham,
      diemTru: violation.diemTru,
      uyTinConLai: updatedDriver.uyTin,
      tocDo: 'N/A',
      videoUrl: violation.videoUrl,
    }).catch((e) => console.error(e));
  }

  const updatedViolation = await prisma.violation.update({
    where: { id },
    data: {
      trangThai: newStatus,
      reviewedBy: pReviewerId,
      reviewedAt: new Date(),
      moTa: (violation.moTa || '') + ` | Xét duyệt thủ công: ${newStatus}. Lý do: ${lyDo || 'N/A'}`,
    },
    include: { driver: { include: { user: true } }, reviewer: true },
  });

  // Audit Log Entry
  logAuditAction({
    userId: pReviewerId,
    hanhDong: 'MANUAL_REVIEW_VIOLATION',
    doiTuongLoai: 'VIOLATION',
    doiTuongId: id,
    giaTriTruoc: { trangThai: violation.trangThai },
    giaTriSau: { trangThai: newStatus },
    lyDo: lyDo || `Duyệt thủ công: ${newStatus}`,
  });

  return { violation: updatedViolation, updatedDriver };
};

export const getDriverRankings = async () => {
  return prisma.driver.findMany({
    include: {
      user: true,
      violations: {
        where: { trangThai: { in: ['CONFIRMED', 'MANUALLY_CONFIRMED'] } },
        orderBy: { thoiGianViPham: 'desc' },
      },
      scoreLogs: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
    orderBy: { uyTin: 'desc' },
  });
};
