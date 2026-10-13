import prisma from '../../common/prisma.js';
import { sendViolationEmailAlert } from '../../common/email.service.js';
import { logAuditAction } from '../../common/audit.service.js';
import { getSystemConfig } from '../auth/auth.service.js';
import {
  VIOLATION_TYPES,
  getViolationTypeById,
  getViolationTypeByCode,
  getAllViolationTypes,
} from '../../common/constants/violationTypes.js';

export { getAllViolationTypes };

const enrichViolationRecord = (v) => {
  const type = getViolationTypeByCode(v.loaiViPham);
  return {
    ...v,
    violationTypeId: type ? type.id : null,
    typeCode: type ? type.code : v.loaiViPham,
    typeName: type ? type.name : v.loaiViPham,
    typeIcon: type ? type.icon : '⚠️',
  };
};

export const getAllViolations = async ({ driverId, tripId, status }) => {
  const where = {};
  if (driverId) where.driverId = parseInt(driverId, 10);
  if (tripId) where.tripId = parseInt(tripId, 10);
  if (status) where.trangThai = status;

  const violations = await prisma.violation.findMany({
    where,
    include: {
      driver: { include: { user: true } },
      trip: { include: { vehicle: true, route: true } },
      reviewer: true,
    },
    orderBy: { thoiGianViPham: 'desc' },
  });

  return violations.map(enrichViolationRecord);
};

export const createViolationRecord = async ({
  driverId,
  tripId,
  loaiViPham,
  violationTypeId,
  diemTru,
  videoUrl,
  videoDuration,
  aiConfidenceScore,
  moTa,
}) => {
  const parsedDriverId = parseInt(driverId, 10);
  const parsedTripId = parseInt(tripId, 10);

  // Chuẩn hóa loại vi phạm theo từ điển constants (ID & Code)
  const resolvedType = getViolationTypeById(violationTypeId) || getViolationTypeByCode(loaiViPham);
  const standardCode = resolvedType ? resolvedType.code : (loaiViPham || 'BUON_NGU');
  const ptsToDeduct = parseInt(
    diemTru !== undefined ? diemTru : (resolvedType?.defaultPoints ?? 5),
    10
  );
  const confidence = aiConfidenceScore !== undefined ? parseFloat(aiConfidenceScore) : 0.90;

  // Lấy ngưỡng tự động từ Cấu hình hệ thống (Dynamic Configuration)
  const config = await getSystemConfig();
  const confirmThreshold = config.aiConfidenceConfirmThreshold ?? 0.85;
  const rejectThreshold = config.aiConfidenceRejectThreshold ?? 0.60;

  let initialStatus = 'PENDING_VERIFICATION';
  if (confidence >= confirmThreshold) {
    initialStatus = 'CONFIRMED';
  } else if (confidence < rejectThreshold) {
    initialStatus = 'REJECTED';
  } else {
    initialStatus = 'PENDING_MANUAL_REVIEW';
  }

  // Fetch trip route rest stops
  const tripData = await prisma.trip.findUnique({
    where: { id: parsedTripId },
    include: { route: true, vehicle: true, driver: { include: { user: true } } },
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

  // Dùng prisma.$transaction đảm bảo tính toàn vẹn (Atomic Database Transaction)
  const result = await prisma.$transaction(async (tx) => {
    const violation = await tx.violation.create({
      data: {
        driverId: parsedDriverId,
        tripId: parsedTripId,
        loaiViPham: standardCode,
        diemTru: ptsToDeduct,
        videoUrl: videoUrl || null,
        videoDuration: videoDuration ? parseInt(videoDuration, 10) : null,
        trangThai: initialStatus,
        aiConfidenceScore: confidence,
        tramDungChanGoiY: JSON.stringify(restStopGuidance),
        thoiGianBatDauTheoDoi: new Date(Date.now() - 30 * 1000),
        thoiGianChotViPham: new Date(),
        thoiGianViPham: new Date(),
        moTa: moTa || `Khởi tạo vi phạm ${standardCode} (AI Confidence: ${(confidence * 100).toFixed(0)}%).`,
      },
      include: {
        driver: { include: { user: true } },
        trip: { include: { vehicle: true, route: true } },
      },
    });

    let updatedDriver = violation.driver;
    // CHỈ trừ điểm khi trạng thái là CONFIRMED và có điểm trừ
    if (initialStatus === 'CONFIRMED' && ptsToDeduct > 0) {
      const currentUyTin = violation.driver.uyTin;
      const newUyTin = Math.max(0, currentUyTin - ptsToDeduct);

      updatedDriver = await tx.driver.update({
        where: { userId: parsedDriverId },
        data: { uyTin: newUyTin },
        include: { user: true },
      });

      // Ghi nhận lịch sử biến động điểm
      await tx.driverScoreLog.create({
        data: {
          driverId: parsedDriverId,
          loaiThayDoi: 'TRU_DIEM',
          soDiemThayDoi: ptsToDeduct,
          diemTruoc: currentUyTin,
          diemSau: newUyTin,
          lyDo: `Xác thực vi phạm tự động: ${resolvedType ? resolvedType.name : standardCode}`,
          violationId: violation.id,
          tripId: parsedTripId,
        },
      });
    }

    return { violation: enrichViolationRecord(violation), updatedDriver };
  });

  // Gửi Email Alert nếu vi phạm được xác nhận
  if (initialStatus === 'CONFIRMED') {
    sendViolationEmailAlert({
      driverName: result.violation.driver.user.hoTen,
      driverEmail: result.violation.driver.user.username + '@gmail.com',
      bienSo: result.violation.trip.vehicle.bienSo,
      loaiViPham: result.violation.loaiViPham,
      diemTru: ptsToDeduct,
      uyTinConLai: result.updatedDriver.uyTin,
      tocDo: 'N/A',
      videoUrl: result.violation.videoUrl,
      tramDungChanGoiY: restStopGuidance,
    }).catch((e) => console.error('Error sending violation email:', e));
  }

  return result;
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

  if (action === 'CONFIRM') {
    if (violation.trangThai === 'CONFIRMED' || violation.trangThai === 'MANUALLY_CONFIRMED') {
      throw new Error('Vi phạm này đã được xác nhận trước đó.');
    }
  } else if (action === 'REJECT') {
    if (violation.trangThai === 'REJECTED' || violation.trangThai === 'MANUALLY_REJECTED') {
      throw new Error('Vi phạm này đã bị từ chối trước đó.');
    }
  }

  const newStatus = action === 'CONFIRM' ? 'MANUALLY_CONFIRMED' : 'MANUALLY_REJECTED';

  // Chạy toàn bộ xử lý duyệt vi phạm và hoàn/trừ điểm trong Transaction
  const { updatedViolation, updatedDriver } = await prisma.$transaction(async (tx) => {
    let currentDriver = await tx.driver.findUnique({
      where: { userId: violation.driverId },
      include: { user: true },
    });

    if (action === 'CONFIRM') {
      // Trừ điểm chỉ khi trước đó CHƯA bị trừ (tức chưa CONFIRMED)
      const currentUyTin = currentDriver.uyTin;
      const newUyTin = Math.max(0, currentUyTin - violation.diemTru);

      currentDriver = await tx.driver.update({
        where: { userId: violation.driverId },
        data: { uyTin: newUyTin },
        include: { user: true },
      });

      await tx.driverScoreLog.create({
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
        driverName: currentDriver.user.hoTen,
        driverEmail: currentDriver.user.username + '@gmail.com',
        bienSo: violation.trip.vehicle.bienSo,
        loaiViPham: violation.loaiViPham,
        diemTru: violation.diemTru,
        uyTinConLai: currentDriver.uyTin,
        tocDo: 'N/A',
        videoUrl: violation.videoUrl,
      }).catch((e) => console.error(e));
    } else if (action === 'REJECT') {
      // Nếu trước đó đã bị auto-confirm trừ điểm -> HOÀN LẠI ĐIỂM (False Alarm Refund)
      if (violation.trangThai === 'CONFIRMED' && violation.diemTru > 0) {
        const currentUyTin = currentDriver.uyTin;
        const refundedUyTin = Math.min(100, currentUyTin + violation.diemTru);

        currentDriver = await tx.driver.update({
          where: { userId: violation.driverId },
          data: { uyTin: refundedUyTin },
          include: { user: true },
        });

        await tx.driverScoreLog.create({
          data: {
            driverId: violation.driverId,
            loaiThayDoi: 'CONG_DIEM',
            soDiemThayDoi: violation.diemTru,
            diemTruoc: currentUyTin,
            diemSau: refundedUyTin,
            lyDo: `Hoàn điểm do Quản lý bác bỏ vi phạm (False Alarm): ${violation.loaiViPham}. ${lyDo || ''}`,
            violationId: violation.id,
            tripId: violation.tripId,
          },
        });
      }
    }

    const updatedV = await tx.violation.update({
      where: { id },
      data: {
        trangThai: newStatus,
        reviewedBy: pReviewerId,
        reviewedAt: new Date(),
        moTa: (violation.moTa || '') + ` | Xét duyệt thủ công: ${newStatus}. Lý do: ${lyDo || 'N/A'}`,
      },
      include: { driver: { include: { user: true } }, reviewer: true },
    });

    return { updatedViolation: updatedV, updatedDriver: currentDriver };
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

  return { violation: enrichViolationRecord(updatedViolation), updatedDriver };
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
