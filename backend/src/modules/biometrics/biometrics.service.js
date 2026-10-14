import prisma from '../../common/prisma.js';

export const getDriverBiometricProfile = async (driverId) => {
  const pDriverId = parseInt(driverId, 10);
  
  let profile = await prisma.driverBiometricProfile.findFirst({
    where: { driverId: pDriverId },
    orderBy: { createdAt: 'desc' },
  });

  if (!profile) {
    // Generate default profile if none exists
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Count violations in last 30 days
    const recentViolations = await prisma.violation.findMany({
      where: {
        driverId: pDriverId,
        thoiGianViPham: { gte: thirtyDaysAgo },
        trangThai: { in: ['CONFIRMED', 'MANUALLY_CONFIRMED'] },
      },
    });

    const violationCounts = {};
    recentViolations.forEach((v) => {
      violationCounts[v.loaiViPham] = (violationCounts[v.loaiViPham] || 0) + 1;
    });

    profile = await prisma.driverBiometricProfile.create({
      data: {
        driverId: pDriverId,
        khungGioYeuSinhHoc: JSON.stringify(['13:00-15:00', '01:00-04:00']),
        thoiGianLaiToiDaKhuyenNghi: 240, // 4 hours
        thoiGianLaiTrungBinhTruocMetMoi: 180, // 3 hours
        tanSuatViPham30Ngay: JSON.stringify(violationCounts),
        isDefaultProfile: true,
        kyTinhToanTu: thirtyDaysAgo,
        kyTinhToanDen: now,
      },
    });
  }

  return {
    ...profile,
    khungGioYeuSinhHoc: JSON.parse(profile.khungGioYeuSinhHoc || '[]'),
    tanSuatViPham30Ngay: JSON.parse(profile.tanSuatViPham30Ngay || '{}'),
  };
};

export const getDriverCalibrations = async (driverId) => {
  const pDriverId = parseInt(driverId, 10);
  return prisma.driverCalibrationData.findMany({
    where: { driverId: pDriverId },
    orderBy: { thoiGianHieuChuan: 'desc' },
  });
};

export const saveCalibrationData = async ({ driverId, tripId, shiftId, vectorDacTrung, ketQua }) => {
  return prisma.driverCalibrationData.create({
    data: {
      driverId: parseInt(driverId, 10),
      tripId: tripId ? parseInt(tripId, 10) : null,
      shiftId: shiftId ? parseInt(shiftId, 10) : null,
      vectorDacTrung: typeof vectorDacTrung === 'string' ? vectorDacTrung : JSON.stringify(vectorDacTrung || {}),
      ketQua: ketQua || 'SUCCESS',
    },
  });
};
