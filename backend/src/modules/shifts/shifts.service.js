import prisma from '../../common/prisma.js';
import { logAuditAction } from '../../common/audit.service.js';
import { getSystemConfig } from '../auth/auth.service.js';

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

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw new Error('Thời gian ca làm việc không hợp lệ.');
  }

  if (startTime >= endTime) {
    throw new Error('Thời gian bắt đầu ca phải diễn ra trước thời gian kết thúc.');
  }

  const warnings = [];

  // Lấy cấu hình hệ thống động
  const config = await getSystemConfig();
  const minRestHours = config.minRestHours ?? 8.0;

  // 1. Kiểm tra trùng lặp ca trực của Tài xế (Driver Overlap Check)
  const overlappingDriverShift = await prisma.shift.findFirst({
    where: {
      driverId: pDriverId,
      trangThai: { notIn: ['CANCELLED', 'DECLINED'] },
      thoiGianBatDauDuKien: { lt: endTime },
      thoiGianKetThucDuKien: { gt: startTime },
    },
  });
  if (overlappingDriverShift) {
    throw new Error('CHẶN: Tài xế này đã có một ca làm việc khác trùng với khoảng thời gian đã chọn.');
  }

  // 2. Kiểm tra trùng lặp lịch phương tiện (Vehicle Overlap Check)
  const overlappingVehicleShift = await prisma.shift.findFirst({
    where: {
      vehicleId: pVehicleId,
      trangThai: { notIn: ['CANCELLED', 'DECLINED'] },
      thoiGianBatDauDuKien: { lt: endTime },
      thoiGianKetThucDuKien: { gt: startTime },
    },
  });
  if (overlappingVehicleShift) {
    throw new Error('CHẶN: Phương tiện này đã được xếp vào một ca làm việc khác trong khoảng thời gian đã chọn.');
  }

  // 3. Kiểm tra khoảng thời gian nghỉ tối thiểu (trước và sau ca)
  const prevShift = await prisma.shift.findFirst({
    where: {
      driverId: pDriverId,
      trangThai: { notIn: ['CANCELLED', 'DECLINED'] },
      thoiGianKetThucDuKien: { lte: startTime },
    },
    orderBy: { thoiGianKetThucDuKien: 'desc' },
  });

  if (prevShift) {
    const restHoursBefore = (startTime.getTime() - new Date(prevShift.thoiGianKetThucDuKien).getTime()) / (1000 * 3600);
    if (restHoursBefore < minRestHours) {
      throw new Error(`CHẶN: Khoảng thời gian nghỉ giữa ca trước và ca này chỉ có ${restHoursBefore.toFixed(1)}h (< ${minRestHours}h tối thiểu theo quy định). Không thể tạo ca.`);
    }
  }

  const nextShift = await prisma.shift.findFirst({
    where: {
      driverId: pDriverId,
      trangThai: { notIn: ['CANCELLED', 'DECLINED'] },
      thoiGianBatDauDuKien: { gte: endTime },
    },
    orderBy: { thoiGianBatDauDuKien: 'asc' },
  });

  if (nextShift) {
    const restHoursAfter = (new Date(nextShift.thoiGianBatDauDuKien).getTime() - endTime.getTime()) / (1000 * 3600);
    if (restHoursAfter < minRestHours) {
      throw new Error(`CHẶN: Khoảng thời gian nghỉ giữa ca này và ca sau chỉ có ${restHoursAfter.toFixed(1)}h (< ${minRestHours}h tối thiểu theo quy định). Không thể tạo ca.`);
    }
  }

  // 4. Kiểm tra Hồ sơ Sinh học (Biometric Profile Check)
  const profile = await prisma.driverBiometricProfile.findFirst({
    where: { driverId: pDriverId },
    orderBy: { createdAt: 'desc' },
  });

  if (profile) {
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

export const getShiftById = async (id) => {
  return prisma.shift.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      driver: { include: { user: true } },
      vehicle: true,
      route: true,
    },
  });
};
