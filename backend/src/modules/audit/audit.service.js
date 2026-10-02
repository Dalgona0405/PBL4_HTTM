import prisma from '../../common/prisma.js';
export { logAuditAction } from '../../common/audit.service.js';

export const getAuditLogs = async ({ userId, doiTuongLoai, hanhDong, limit = 50 }) => {
  const where = {};
  if (userId) where.userId = parseInt(userId, 10);
  if (doiTuongLoai) where.doiTuongLoai = doiTuongLoai;
  if (hanhDong) where.hanhDong = hanhDong;

  return prisma.auditLog.findMany({
    where,
    include: {
      user: true,
    },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit, 10),
  });
};
