import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../common/prisma.js';

const JWT_SECRET = process.env.ACCESS_JWT_SECRET || 'pbl4_access_token_secret_key_2026_super_secure_node_jwt_auth_key';

export const registerUser = async ({ username, password, hoTen, sdt, role, bangLai }) => {
  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) {
    throw new Error('Tên đăng nhập đã tồn tại trong hệ thống.');
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = await prisma.user.create({
    data: {
      username,
      passwordHash,
      hoTen,
      sdt,
      role: role || 'DRIVER',
      trangThai: 'ACTIVE',
      ...(role === 'DRIVER'
        ? { driver: { create: { bangLai: bangLai || 'B2', uyTin: 100, trangThaiTaiXe: 'AVAILABLE' } } }
        : {}),
    },
    include: {
      driver: true,
    },
  });

  return newUser;
};

export const loginUser = async ({ username, password }) => {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      driver: true,
    },
  });

  if (!user) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
  }

  if (user.trangThai !== 'ACTIVE') {
    throw new Error('Tài khoản của bạn đã bị khóa.');
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác.');
  }

  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    hoTen: user.hoTen,
    driverId: user.driver?.userId || null,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

  return {
    user: {
      id: user.id,
      username: user.username,
      hoTen: user.hoTen,
      sdt: user.sdt,
      role: user.role,
      driver: user.driver,
    },
    token,
  };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      driver: {
        include: {
          violations: {
            take: 5,
            orderBy: { thoiGianViPham: 'desc' },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error('Không tìm thấy người dùng.');
  }

  return user;
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    include: {
      driver: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateUserStatus = async (userId, { trangThai, role }, adminId) => {
  const pUserId = parseInt(userId, 10);
  const oldUser = await prisma.user.findUnique({ where: { id: pUserId } });
  if (!oldUser) throw new Error('Người dùng không tồn tại.');

  const data = {};
  if (trangThai) data.trangThai = trangThai;
  if (role) data.role = role;

  const updatedUser = await prisma.user.update({
    where: { id: pUserId },
    data,
    include: { driver: true },
  });

  if (adminId) {
    const { logAuditAction } = await import('../../common/audit.service.js');
    logAuditAction({
      userId: adminId,
      hanhDong: 'UPDATE_USER_ACCOUNT',
      doiTuongLoai: 'USER',
      doiTuongId: pUserId,
      giaTriTruoc: { trangThai: oldUser.trangThai, role: oldUser.role },
      giaTriSau: { trangThai: updatedUser.trangThai, role: updatedUser.role },
      lyDo: `Quản trị viên cập nhật tài khoản: ${oldUser.username}`,
    });
  }

  return updatedUser;
};

// In-memory System Configuration Store (can be persisted to file / DB)
let systemConfig = {
  aiConfidenceConfirmThreshold: 0.85,
  aiConfidenceRejectThreshold: 0.60,
  co2PpmThreshold: 1000,
  minRestHours: 8,
  eyeClosedDurationSeconds: 2,
  yawnDurationSeconds: 3,
};

export const getSystemConfig = async () => {
  return systemConfig;
};

export const updateSystemConfig = async (newConfig, adminId) => {
  const oldConfig = { ...systemConfig };
  systemConfig = { ...systemConfig, ...newConfig };

  if (adminId) {
    const { logAuditAction } = await import('../../common/audit.service.js');
    logAuditAction({
      userId: adminId,
      hanhDong: 'UPDATE_SYSTEM_CONFIG',
      doiTuongLoai: 'SYSTEM',
      doiTuongId: 1,
      giaTriTruoc: oldConfig,
      giaTriSau: systemConfig,
      lyDo: 'Quản trị viên cập nhật tham số AI & Cảm biến hệ thống',
    });
  }

  return systemConfig;
};

