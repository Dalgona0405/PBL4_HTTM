import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding 13 Tables for PBL4 Fleet System According to SRS Specification...');

  // 1. Clean existing tables in order
  await prisma.auditLog.deleteMany();
  await prisma.driverCalibrationData.deleteMany();
  await prisma.driverBiometricProfile.deleteMany();
  await prisma.driverScoreLog.deleteMany();
  await prisma.violation.deleteMany();
  await prisma.iotDataLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.iotDevice.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.route.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const commonPassword = await bcrypt.hash('password123', saltRounds);

  // 2. Users (Admin, Manager, Drivers)
  console.log('👥 Creating Users (Admin, Manager & Drivers)...');
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: commonPassword,
      hoTen: 'Nguyễn Văn Quản Trị (Admin)',
      sdt: '0905111222',
      role: 'ADMIN',
      trangThai: 'ACTIVE',
    },
  });

  const managerUser = await prisma.user.create({
    data: {
      username: 'manager1',
      passwordHash: commonPassword,
      hoTen: 'Trần Thị Điều Phối (Manager)',
      sdt: '0905333444',
      role: 'MANAGER',
      trangThai: 'ACTIVE',
    },
  });

  const driver1User = await prisma.user.create({
    data: {
      username: 'driver1',
      passwordHash: commonPassword,
      hoTen: 'Trần Văn Tài (Tài Xế 1)',
      sdt: '0914888999',
      role: 'DRIVER',
      trangThai: 'ACTIVE',
      driver: {
        create: {
          bangLai: 'B2-88991122',
          uyTin: 95,
          trangThaiTaiXe: 'ON_TRIP',
        },
      },
    },
    include: { driver: true },
  });

  const driver2User = await prisma.user.create({
    data: {
      username: 'driver2',
      passwordHash: commonPassword,
      hoTen: 'Lê Hoàng Long (Tài Xế 2)',
      sdt: '0987654321',
      role: 'DRIVER',
      trangThai: 'ACTIVE',
      driver: {
        create: {
          bangLai: 'FC-99001133',
          uyTin: 60, // Yellow warning <= 65
          trangThaiTaiXe: 'AVAILABLE',
        },
      },
    },
    include: { driver: true },
  });

  // 3. Vehicles & IoT Devices
  console.log('🚚 Creating Vehicles & IoT Devices...');
  const vehicle1 = await prisma.vehicle.create({
    data: {
      bienSo: '43C-123.45',
      loaiXe: 'Xe Tải 5 Tấn',
      trangThai: 'IN_USE',
      iotDevice: {
        create: {
          macAddress: '00:1A:2B:3C:4D:5E',
          phienBan: 'v2.1-GPS-4G-AI',
        },
      },
    },
    include: { iotDevice: true },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      bienSo: '92C-678.90',
      loaiXe: 'Xe Container 40ft',
      trangThai: 'AVAILABLE',
      iotDevice: {
        create: {
          macAddress: '00:1A:2B:3C:99:88',
          phienBan: 'v2.2-GPS-5G',
        },
      },
    },
    include: { iotDevice: true },
  });

  // 4. Routes
  console.log('🛣️ Creating Routes...');
  const route1 = await prisma.route.create({
    data: {
      tenTuyen: 'Tuyến Đà Nẵng ➔ Huế (Qua hầm Hải Vân)',
      khoangCachKm: 105.5,
      danhSachTramDungChan: JSON.stringify([
        { ten: 'Trạm Dừng Chân Nam Hải Vân (Km 25)', kmMarker: 25.0, phutMarker: 30 },
        { ten: 'Trạm Dừng Chân Lăng Cô (Km 55)', kmMarker: 55.0, phutMarker: 65 },
        { ten: 'Trạm Dừng Chân Phú Lộc (Km 80)', kmMarker: 80.0, phutMarker: 95 },
      ]),
    },
  });

  const route2 = await prisma.route.create({
    data: {
      tenTuyen: 'Tuyến Đà Nẵng ➔ Quy Nhơn (QL1A)',
      khoangCachKm: 302.0,
      danhSachTramDungChan: JSON.stringify([
        { ten: 'Trạm Dừng Chân Quảng Nam (Km 60)', kmMarker: 60.0, phutMarker: 70 },
        { ten: 'Trạm Dừng Chân Quảng Ngãi (Km 140)', kmMarker: 140.0, phutMarker: 160 },
        { ten: 'Trạm Dừng Chân Bình Định (Km 240)', kmMarker: 240.0, phutMarker: 280 },
      ]),
    },
  });

  // 5. Shifts (Smart Scheduling)
  console.log('📅 Creating Shifts (Smart Scheduling)...');
  const shift1 = await prisma.shift.create({
    data: {
      driverId: driver1User.id,
      vehicleId: vehicle1.id,
      routeId: route1.id,
      thoiGianBatDauDuKien: new Date(Date.now() - 3600 * 1000 * 3),
      thoiGianKetThucDuKien: new Date(Date.now() + 3600 * 1000 * 3),
      trangThai: 'IN_PROGRESS',
      createdBy: managerUser.id,
      canhBaoKhiTao: JSON.stringify(['Ca rơi vào khung giờ yếu sinh học 13:00-15:00']),
    },
  });

  const shift2 = await prisma.shift.create({
    data: {
      driverId: driver2User.id,
      vehicleId: vehicle2.id,
      routeId: route2.id,
      thoiGianBatDauDuKien: new Date(Date.now() + 3600 * 1000 * 24),
      thoiGianKetThucDuKien: new Date(Date.now() + 3600 * 1000 * 30),
      trangThai: 'SCHEDULED',
      createdBy: managerUser.id,
      canhBaoKhiTao: JSON.stringify([]),
    },
  });

  // 6. Trips (Linked to Shift)
  console.log('📦 Creating Trips...');
  const trip1 = await prisma.trip.create({
    data: {
      shiftId: shift1.id,
      driverId: driver1User.id,
      vehicleId: vehicle1.id,
      routeId: route1.id,
      thoiGianBatDau: new Date(Date.now() - 3600 * 1000 * 2),
      trangThai: 'IN_PROGRESS',
    },
  });

  // 7. IoT Data Logs
  console.log('📡 Generating IoT Data Logs & CO2 Sensor Readings...');
  await prisma.iotDataLog.createMany({
    data: [
      { tripId: trip1.id, deviceId: vehicle1.iotDevice.id, kinhDo: 108.2022, viDo: 16.0544, tocDo: 45.0, co2Level: 450.0, thoiGianGhiNhan: new Date(Date.now() - 3600 * 1000 * 2) },
      { tripId: trip1.id, deviceId: vehicle1.iotDevice.id, kinhDo: 108.1950, viDo: 16.0700, tocDo: 65.0, co2Level: 680.0, thoiGianGhiNhan: new Date(Date.now() - 3600 * 1000 * 1.5) },
      { tripId: trip1.id, deviceId: vehicle1.iotDevice.id, kinhDo: 108.1150, viDo: 16.1350, tocDo: 92.4, co2Level: 1150.0, thoiGianGhiNhan: new Date(Date.now() - 3600 * 1000 * 1) },
    ],
  });

  // 8. Violations (With Verification Lifecycle 3.2 & Nearest Rest Stop Guidance)
  console.log('🚨 Creating Violations with Verification Lifecycle...');
  const violation1 = await prisma.violation.create({
    data: {
      driverId: driver1User.id,
      tripId: trip1.id,
      loaiViPham: '😴 NGỦ GẬT (AI - Nhắm mắt > 2s)',
      diemTru: 10,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDuration: 15,
      trangThai: 'CONFIRMED',
      aiConfidenceScore: 0.94,
      tramDungChanGoiY: JSON.stringify({
        tenTram: 'Trạm Dừng Chân Nam Hải Vân (Km 25)',
        kmConLai: 4.2,
        phutConLai: 5,
        thongBaoGiongNoi: 'Cảnh báo buồn ngủ! Còn 4.2 km (khoảng 5 phút) nữa sẽ đến Trạm Dừng Chân Nam Hải Vân. Vui lòng giảm tốc độ để dừng xe nghỉ ngơi hoặc đổi ca lái!',
      }),
      reviewedBy: adminUser.id,
      reviewedAt: new Date(Date.now() - 3600 * 1000 * 1),
      thoiGianBatDauTheoDoi: new Date(Date.now() - 3600 * 1000 * 1.1),
      thoiGianChotViPham: new Date(Date.now() - 3600 * 1000 * 1),
      thoiGianViPham: new Date(Date.now() - 3600 * 1000 * 1),
      moTa: 'Tự động xác thực bởi AI Server (Confidence 94%). Trừ 10 điểm uy tín.',
    },
  });

  const violation2 = await prisma.violation.create({
    data: {
      driverId: driver2User.id,
      tripId: trip1.id,
      loaiViPham: '📱 DÙNG ĐIỆN THOẠI (AI - Mất tập trung)',
      diemTru: 5,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoDuration: 10,
      trangThai: 'PENDING_MANUAL_REVIEW',
      aiConfidenceScore: 0.72,
      tramDungChanGoiY: JSON.stringify({
        tenTram: 'Trạm Dừng Chân Nam Hải Vân (Km 25)',
        kmConLai: 4.2,
        phutConLai: 5,
        thongBaoGiongNoi: 'Cảnh báo mất tập trung! Còn 4.2 km nữa đến Trạm Dừng Chân Nam Hải Vân.',
      }),
      thoiGianBatDauTheoDoi: new Date(Date.now() - 3600 * 1000 * 0.5),
      thoiGianChotViPham: new Date(Date.now() - 3600 * 1000 * 0.4),
      thoiGianViPham: new Date(Date.now() - 3600 * 1000 * 0.4),
      moTa: 'Đang chờ Điều phối viên duyệt thủ công (AI Confidence: 72%).',
    },
  });


  // 9. Driver Score Logs
  console.log('📈 Creating Driver Score Logs...');
  await prisma.driverScoreLog.create({
    data: {
      driverId: driver1User.id,
      loaiThayDoi: 'TRU_DIEM',
      soDiemThayDoi: 5,
      diemTruoc: 100,
      diemSau: 95,
      lyDo: 'Vi phạm Quá tốc độ (92.4 km/h) được xác thực.',
      violationId: violation1.id,
      tripId: trip1.id,
    },
  });

  await prisma.driverScoreLog.create({
    data: {
      driverId: driver2User.id,
      loaiThayDoi: 'TRU_DIEM',
      soDiemThayDoi: 40,
      diemTruoc: 100,
      diemSau: 60,
      lyDo: 'Cảnh cáo vàng: Phát hiện nhiều lần vi phạm tập trung khi lái ca đêm.',
      violationId: violation2.id,
    },
  });

  // 10. Driver Biometric Profiles (30-day Profile)
  console.log('🧬 Creating Driver Biometric Profiles...');
  await prisma.driverBiometricProfile.create({
    data: {
      driverId: driver1User.id,
      khungGioYeuSinhHoc: JSON.stringify(['13:00-15:00', '02:00-04:00']),
      thoiGianLaiToiDaKhuyenNghi: 240, // 4 hours
      thoiGianLaiTrungBinhTruocMetMoi: 180, // 3 hours
      tanSuatViPham30Ngay: JSON.stringify({ EYES_CLOSED: 1, YAWN: 3, PHONE: 0 }),
      isDefaultProfile: false,
      kyTinhToanTu: new Date(Date.now() - 30 * 24 * 3600 * 1000),
      kyTinhToanDen: new Date(),
    },
  });

  // 11. Driver Calibration Data
  console.log('📷 Creating Driver Calibration Data...');
  await prisma.driverCalibrationData.create({
    data: {
      driverId: driver1User.id,
      tripId: trip1.id,
      shiftId: shift1.id,
      vectorDacTrung: JSON.stringify({ eyeEARThreshold: 0.21, mouthMARThreshold: 0.55 }),
      ketQua: 'SUCCESS',
    },
  });

  // 12. Audit Logs (Administrative actions)
  console.log('🛡️ Creating Audit Logs...');
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      hanhDong: 'VERIFY_VIOLATION',
      doiTuongLoai: 'VIOLATION',
      doiTuongId: violation1.id,
      giaTriTruoc: JSON.stringify({ trangThai: 'PENDING_VERIFICATION' }),
      giaTriSau: JSON.stringify({ trangThai: 'CONFIRMED' }),
      lyDo: 'AI Server xác thực video với độ tin cậy 94%.',
    },
  });

  console.log('✅ 13 TABLES SEEDED SUCCESSFULLY!');
  console.log('--------------------------------------------------');
  console.log('🔑 ACCOUNTS:');
  console.log('👉 ADMIN: username = admin     | password = password123');
  console.log('👉 MANAGER: username = manager1 | password = password123');
  console.log('👉 DRIVER 1: username = driver1 | password = password123');
  console.log('👉 DRIVER 2: username = driver2 | password = password123');
  console.log('--------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
