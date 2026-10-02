import prisma from '../../common/prisma.js';
import { logAuditAction } from '../../common/audit.service.js';

export const getAllShifts = async ({ driverId, status }) => {
  const where = {};
  if (driverId) where.driverId = parseInt(driverId, 10);
  if (status) where.trangThai = status;

  return prisma.shift.findMany({
    where,
    include: {
      driver: { include: { user: true } },
      vehicle: true,
      route: true,
      creator: true,
      trip: true,
    },
    orderBy: { thoiGianBatDauDuKien: 'desc' },
  });
};

export const createShift = async ({ driverId, vehicleId, routeId, thoiGianBatDauDuKien, thoiGianKetThucDuKien, createdBy }) => {
  const pDriverId = parseInt(driverId, 10);
  const pVehicleId = parseInt(vehicleId, 10);
  const pRouteId = parseInt(routeId, 10);
  const pCreatedBy = parseInt(createdBy, 10);
  const startTime = new Date(thoiGianBatDauDuKien);
  const endTime = new Date(thoiGianKetThucDuKien);

  const warnings = [];

  // FR_2.3.2 Constraint 1: Check minimum rest window between consecutive shifts (< 8 hours) -> BLOCK
  const lastShift = await prisma.shift.findFirst({
    where: {
      driverId: pDriverId,
      trangThai: { notIn: ['CANCELLED', 'DECLINED'] },
      thoiGianKetThucDuKien: { lte: startTime },
    },
    orderBy: { thoiGianKetThucDuKien: 'desc' },
  });

  if (lastShift) {
    const restHours = (startTime.getTime() - new Date(lastShift.thoiGianKetThucDuKien).getTime()) / (1000 * 3600);
    if (restHours < 8.0) {
      throw new Error(`CHẶN: Khoảng thời gian nghỉ giữa 2 ca của tài xế chỉ có ${restHours.toFixed(1)}h (< 8h tối thiểu theo quy định). Không thể tạo ca.`);
    }
  }

  // FR_2.3.2 Constraint 2: Check Biometric Profile
  const profile = await prisma.driverBiometricProfile.findFirst({
    where: { driverId: pDriverId },
    orderBy: { createdAt: 'desc' },
  });

  if (profile) {
    // Check total drive duration vs max recommended
    const shiftMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (shiftMinutes > profile.thoiGianLaiToiDaKhuyenNghi) {
      warnings.push(`CẢNH BÁO: Tổng thời gian lái ca dự kiến (${(shiftMinutes / 60).toFixed(1)}h) vượt mức khuyến nghị sinh học (${(profile.thoiGianLaiToiDaKhuyenNghi / 60).toFixed(1)}h).`);
    }

    // Check biological weak window
    const startHour = startTime.getHours();
    if ((startHour >= 13 && startHour <= 15) || (startHour >= 1 && startHour <= 4)) {
      warnings.push(`LƯU Ý: Ca rơi vào khung giờ yếu sinh học của tài xế (${startHour}:00h). Nhắc nhở tài xế nghỉ ngơi đầy đủ.`);
    }
  }

  const shift = await prisma.shift.create({
    data: {
      driverId: pDriverId,
      vehicleId: pVehicleId,
      routeId: pRouteId,
      thoiGianBatDauDuKien: startTime,
      thoiGianKetThucDuKien: endTime,
      trangThai: 'SCHEDULED',
      createdBy: pCreatedBy,
      canhBaoKhiTao: JSON.stringify(warnings),
    },
    include: {
      driver: { include: { user: true } },
      vehicle: true,
      route: true,
    },
  });

  // Log Audit Action
  logAuditAction({
    userId: pCreatedBy,
    hanhDong: 'CREATE_SHIFT',
    doiTuongLoai: 'SHIFT',
    doiTuongId: shift.id,
    giaTriSau: shift,
    lyDo: warnings.length > 0 ? warnings.join(' | ') : 'Tạo ca làm việc mới.',
  });

  return { shift, warnings };
};

export const respondToShift = async (shiftId, { trangThai, lyDoTuChoi }) => {
  const id = parseInt(shiftId, 10);
  const shift = await prisma.shift.findUnique({ where: { id } });
  if (!shift) throw new Error('Ca làm việc không tồn tại.');

  if (shift.trangThai === 'IN_PROGRESS' || shift.trangThai === 'COMPLETED') {
    throw new Error('Không thể chỉnh sửa ca làm việc khi đã bắt đầu hoặc hoàn thành.');
  }

  const updatedShift = await prisma.shift.update({
    where: { id },
    data: {
      trangThai,
      lyDoTuChoi: lyDoTuChoi || null,
    },
    include: {
      driver: { include: { user: true } },
      vehicle: true,
      route: true,
    },
  });

  return updatedShift;
};
