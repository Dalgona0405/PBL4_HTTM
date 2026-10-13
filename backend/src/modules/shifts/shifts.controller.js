import * as shiftsService from './shifts.service.js';

export const getShifts = async (req, res) => {
  try {
    const { driverId, status } = req.query;
    let targetDriverId = driverId;
    if (req.user.role === 'DRIVER') {
      targetDriverId = req.user.driver?.userId || req.user.id;
    }

    const shifts = await shiftsService.getAllShifts({ driverId: targetDriverId, status });
    res.json({ shifts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createShift = async (req, res) => {
  try {
    const { driverId, vehicleId, routeId, thoiGianBatDauDuKien, thoiGianKetThucDuKien } = req.body;
    if (!driverId || !vehicleId || !routeId || !thoiGianBatDauDuKien || !thoiGianKetThucDuKien) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ driverId, vehicleId, routeId và thời gian ca.' });
    }

    const result = await shiftsService.createShift({
      driverId,
      vehicleId,
      routeId,
      thoiGianBatDauDuKien,
      thoiGianKetThucDuKien,
      createdBy: req.user.id,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const respondToShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai, lyDoTuChoi } = req.body;

    // Kiểm tra quyền sở hữu: DRIVER chỉ được phản hồi ca trực của mình
    if (req.user.role === 'DRIVER') {
      const existingShift = await shiftsService.getShiftById(id);
      if (!existingShift) return res.status(404).json({ message: 'Ca làm việc không tồn tại.' });
      const driverId = req.user.driver?.userId || req.user.id;
      if (existingShift.driverId !== driverId) {
        return res.status(403).json({ message: 'Bạn không có quyền phản hồi ca trực này.' });
      }
    }

    const shift = await shiftsService.respondToShift(id, { trangThai, lyDoTuChoi });
    res.json({ shift });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
