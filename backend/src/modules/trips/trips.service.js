import prisma from '../../common/prisma.js';

export const getAllTrips = async ({ driverId, status }) => {
  const where = {};
  if (driverId) where.driverId = parseInt(driverId, 10);
  if (status) where.trangThai = status;

  return prisma.trip.findMany({
    where,
    include: {
      driver: {
        include: { user: true },
      },
      vehicle: {
        include: { iotDevice: true },
      },
      route: true,
      violations: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getDriverActiveTrip = async (driverId) => {
  const id = parseInt(driverId, 10);
  const activeTrip = await prisma.trip.findFirst({
    where: {
      driverId: id,
      trangThai: 'IN_PROGRESS',
    },
    include: {
      driver: { include: { user: true } },
      vehicle: { include: { iotDevice: true } },
      route: true,
      violations: true,
    },
  });

  if (activeTrip) return activeTrip;

  return prisma.trip.findFirst({
    where: {
      driverId: id,
      trangThai: 'PLANNED',
    },
    include: {
      driver: { include: { user: true } },
      vehicle: { include: { iotDevice: true } },
      route: true,
      violations: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getTripById = async (id) => {
  return prisma.trip.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      driver: {
        include: { user: true },
      },
      vehicle: {
        include: { iotDevice: true },
      },
      route: true,
      violations: true,
    },
  });
};

export const createTrip = async ({ driverId, vehicleId, routeId }) => {
  const parsedDriverId = parseInt(driverId, 10);
  const parsedVehicleId = parseInt(vehicleId, 10);

  // Check if driver or vehicle is currently on another IN_PROGRESS trip
  const existingDriverTrip = await prisma.trip.findFirst({
    where: { driverId: parsedDriverId, trangThai: 'IN_PROGRESS' },
  });
  if (existingDriverTrip) {
    throw new Error('Tài xế này hiện đang trong một chuyến xe khác chưa hoàn thành.');
  }

  const existingVehicleTrip = await prisma.trip.findFirst({
    where: { vehicleId: parsedVehicleId, trangThai: 'IN_PROGRESS' },
  });
  if (existingVehicleTrip) {
    throw new Error('Phương tiện này hiện đang trong một chuyến xe khác chưa hoàn thành.');
  }

  const trip = await prisma.trip.create({
    data: {
      driverId: parsedDriverId,
      vehicleId: parsedVehicleId,
      routeId: parseInt(routeId, 10),
      trangThai: 'PLANNED',
    },
    include: {
      driver: { include: { user: true } },
      vehicle: true,
      route: true,
    },
  });

  return trip;
};

export const updateTripStatus = async (id, trangThai) => {
  const tripId = parseInt(id, 10);
  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) throw new Error('Chuyến xe không tồn tại.');

  const data = { trangThai };

  // Dùng prisma.$transaction đảm bảo cập nhật đồng thời trip, driver, vehicle
  const updatedTrip = await prisma.$transaction(async (tx) => {
    if (trangThai === 'IN_PROGRESS') {
      // Kiểm tra tài xế có chuyến xe khác đang chạy không
      const activeDriverTrip = await tx.trip.findFirst({
        where: { driverId: trip.driverId, trangThai: 'IN_PROGRESS', id: { not: tripId } },
      });
      if (activeDriverTrip) {
        throw new Error('Tài xế đang có một chuyến xe khác đang chạy (IN_PROGRESS). Vui lòng kết thúc chuyến cũ trước.');
      }

      // Kiểm tra phương tiện có chuyến xe khác đang chạy không
      const activeVehicleTrip = await tx.trip.findFirst({
        where: { vehicleId: trip.vehicleId, trangThai: 'IN_PROGRESS', id: { not: tripId } },
      });
      if (activeVehicleTrip) {
        throw new Error('Phương tiện này đang thuộc về một chuyến xe khác đang chạy (IN_PROGRESS).');
      }

      data.thoiGianBatDau = new Date();
      await tx.driver.update({ where: { userId: trip.driverId }, data: { trangThaiTaiXe: 'ON_TRIP' } });
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { trangThai: 'IN_USE' } });
    } else if (trangThai === 'COMPLETED' || trangThai === 'CANCELLED') {
      data.thoiGianKetThuc = new Date();
      await tx.driver.update({ where: { userId: trip.driverId }, data: { trangThaiTaiXe: 'AVAILABLE' } });
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { trangThai: 'AVAILABLE' } });
    }

    return tx.trip.update({
      where: { id: tripId },
      data,
      include: {
        driver: { include: { user: true } },
        vehicle: true,
        route: true,
      },
    });
  });

  if (trangThai === 'COMPLETED') {
    try {
      await grantSafeTripReward(tripId);
    } catch (e) {
      console.error('Error awarding safe trip reward:', e);
    }
  }

  return updatedTrip;
};

export const grantSafeTripReward = async (tripId) => {
  const pTripId = parseInt(tripId, 10);
  const trip = await prisma.trip.findUnique({
    where: { id: pTripId },
    include: { route: true, violations: true, driver: true },
  });

  if (!trip || trip.trangThai !== 'COMPLETED') return null;

  // Kiểm tra thời lượng chuyến đi thực tế (chống cày điểm ảo bằng cách tạo rồi ấn kết thúc ngay)
  if (!trip.thoiGianBatDau || !trip.thoiGianKetThuc) return null;
  const durationSeconds = (new Date(trip.thoiGianKetThuc).getTime() - new Date(trip.thoiGianBatDau).getTime()) / 1000;
  if (durationSeconds < 30) {
    // Chuyến đi ngắn hơn 30 giây không được nhận thưởng an toàn
    return null;
  }

  // Check if reward was already granted
  const existingRewardLog = await prisma.driverScoreLog.findFirst({
    where: {
      tripId: pTripId,
      loaiThayDoi: 'CONG_DIEM',
    },
  });
  if (existingRewardLog) return null;

  // Check if there are any violations associated with this trip
  const hasViolations = trip.violations.some((v) =>
    ['CONFIRMED', 'MANUALLY_CONFIRMED', 'PENDING_MANUAL_REVIEW', 'PENDING_VERIFICATION'].includes(v.trangThai)
  );

  if (hasViolations) return null;

  const distance = trip.route?.khoangCachKm || 50;
  const rewardPts = distance >= 100 ? 10 : 5;

  const currentUyTin = trip.driver.uyTin;
  const newUyTin = Math.min(100, currentUyTin + rewardPts);

  return prisma.$transaction(async (tx) => {
    const updatedDriver = await tx.driver.update({
      where: { userId: trip.driverId },
      data: { uyTin: newUyTin },
    });

    const scoreLog = await tx.driverScoreLog.create({
      data: {
        driverId: trip.driverId,
        loaiThayDoi: 'CONG_DIEM',
        soDiemThayDoi: rewardPts,
        diemTruoc: currentUyTin,
        diemSau: newUyTin,
        lyDo: `Thưởng chuyến xe an toàn (${trip.route?.tenTuyen || 'Tuyến đường'}, ${distance}km).`,
        tripId: pTripId,
      },
    });

    return { updatedDriver, scoreLog };
  });
};


export const getTripPlaybackData = async (tripId) => {
  const id = parseInt(tripId, 10);
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      route: true,
      vehicle: { include: { iotDevice: true } },
      driver: { include: { user: true } },
      violations: true,
    },
  });

  if (!trip) {
    throw new Error('Không tìm thấy chuyến xe.');
  }

  const logs = await prisma.iotDataLog.findMany({
    where: { tripId: id },
    orderBy: { thoiGianGhiNhan: 'asc' },
  });

  return {
    trip,
    logs,
    violations: trip.violations,
  };
};
