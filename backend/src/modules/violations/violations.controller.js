import * as violationsService from './violations.service.js';

export const getViolations = async (req, res) => {
  try {
    const { driverId, tripId } = req.query;
    let targetDriverId = driverId;
    if (req.user.role === 'DRIVER') {
      targetDriverId = req.user.driver?.userId || req.user.id;
    }

    const violations = await violationsService.getAllViolations({ driverId: targetDriverId, tripId });
    res.json({ violations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getViolationTypes = (req, res) => {
  try {
    const types = violationsService.getAllViolationTypes();
    res.json({ types });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createViolation = async (req, res) => {
  try {
    const { driverId, tripId, loaiViPham, violationTypeId, diemTru, videoUrl, videoDuration, moTa } = req.body;
    if (!driverId || !tripId || (!loaiViPham && !violationTypeId)) {
      return res.status(400).json({ message: 'Vui lòng cung cấp driverId, tripId và loaiViPham hoặc violationTypeId.' });
    }

    const result = await violationsService.createViolationRecord({
      driverId,
      tripId,
      loaiViPham,
      violationTypeId,
      diemTru,
      videoUrl,
      videoDuration,
      moTa,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDriversScore = async (req, res) => {
  try {
    const drivers = await violationsService.getDriverRankings();
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewViolation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, lyDo } = req.body;
    const reviewerId = req.user.id;

    if (!action || !['CONFIRM', 'REJECT'].includes(action)) {
      return res.status(400).json({ message: 'Thao tác không hợp lệ. Chỉ chấp nhận CONFIRM hoặc REJECT.' });
    }

    const result = await violationsService.reviewViolationManual(id, { action, lyDo, reviewerId });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

