import * as biometricsService from './biometrics.service.js';

export const getBiometricProfile = async (req, res) => {
  try {
    const { driverId } = req.params;
    let targetDriverId = driverId;
    if (req.user.role === 'DRIVER') {
      targetDriverId = req.user.driver?.userId || req.user.id;
    }

    const profile = await biometricsService.getDriverBiometricProfile(targetDriverId);
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCalibrations = async (req, res) => {
  try {
    const { driverId } = req.params;
    let targetDriverId = driverId;
    if (req.user.role === 'DRIVER') {
      targetDriverId = req.user.driver?.userId || req.user.id;
    }

    const calibrations = await biometricsService.getDriverCalibrations(targetDriverId);
    res.json({ calibrations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveCalibration = async (req, res) => {
  try {
    const { driverId, tripId, shiftId, vectorDacTrung, ketQua } = req.body;
    let targetDriverId = driverId;
    if (req.user.role === 'DRIVER') {
      targetDriverId = req.user.driver?.userId || req.user.id;
    }

    const calibration = await biometricsService.saveCalibrationData({
      driverId: targetDriverId,
      tripId,
      shiftId,
      vectorDacTrung,
      ketQua,
    });
    res.status(201).json({ calibration });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
