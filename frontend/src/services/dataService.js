// Cơ chế chuyển mạch:
//   - USE_MOCK = true: Chạy dữ liệu Mock cục bộ (LocalStorage)
//   - USE_MOCK = false: Tự động chuyển qua gọi Backend API thật bằng axiosClient

import axiosClient from "../api/axiosClient";
import { API_URLS } from "../api/api";
import * as mockService from "../mock";

const USE_MOCK = true;
export const dataService = {
  async getDrivers() {
    if (USE_MOCK) return mockService.getDrivers();
    return await axiosClient.get(API_URLS.DRIVERS);
  },
  async getDriverById(id) {
    if (USE_MOCK) return mockService.getDriverById(id);
    return await axiosClient.get(`${API_URLS.DRIVERS}/${id}`);
  },
  async getDriverBiometric(driverId) {
    if (USE_MOCK) return mockService.getDriverBiometricProfile(driverId);
    return await axiosClient.get(API_URLS.DRIVER_BIOMETRIC(driverId));
  },
  async getDriverScoreLogs(driverId) {
    if (USE_MOCK) return mockService.getDriverScoreLogs(driverId);
    return await axiosClient.get(API_URLS.DRIVER_SCORE_HISTORY(driverId));
  },
  async updateDriverStatus(
    driverId,
    newStatus,
    reason = "",
    adminName = "Trần Quản Trị",
  ) {
    if (USE_MOCK) {
      return mockService.updateDriverStatus(
        driverId,
        newStatus,
        reason,
        adminName,
      );
    }
    return await axiosClient.patch(`${API_URLS.DRIVERS}/${driverId}/status`, {
      trang_thai: newStatus,
      ly_do: reason,
    });
  },
  async getShifts() {
    if (USE_MOCK) return mockService.getShifts();
    return await axiosClient.get(API_URLS.SHIFTS);
  },
  async getRoutes() {
    if (USE_MOCK) return mockService.getRoutes();
    return await axiosClient.get("/routes");
  },
  async validateShiftConstraints(payload) {
    // payload: { driverId, startTime, endTime }
    if (USE_MOCK) return mockService.validateShiftConstraints(payload);
    return await axiosClient.post("/shifts/validate", payload);
  },
  async createShift(shiftData, dispatcherName = "Lê Điều Phối") {
    if (USE_MOCK) return mockService.createShift(shiftData, dispatcherName);
    return await axiosClient.post(API_URLS.SHIFTS, shiftData);
  },
  async getViolations(params) {
    if (USE_MOCK) return mockService.getViolations();
    return await axiosClient.get(API_URLS.VIOLATIONS, { params });
  },
  async getViolationTypes() {
    if (USE_MOCK) return mockService.getViolationTypes();
    return await axiosClient.get("/violation-types");
  },
  async reviewViolation(payload) {
    // payload: { violationId, decision, notes, reviewerName, reviewerId }
    if (USE_MOCK) return mockService.reviewViolation(payload);
    return await axiosClient.patch(
      API_URLS.VIOLATION_REVIEW(payload.violationId),
      {
        quyet_dinh: payload.decision,
        ghi_chu: payload.notes,
      },
    );
  },
  async getLiveMonitoringData() {
    if (USE_MOCK) return mockService.getLiveMonitoringData();
    return await axiosClient.get("/monitoring/live");
  },
  async getPriorityFleet() {
    if (USE_MOCK) return mockService.getPriorityFleet();
    return await axiosClient.get("/monitoring/priority-fleet");
  },
  async getLiveMonitoringStats() {
    if (USE_MOCK) return mockService.getLiveMonitoringStats();
    return await axiosClient.get("/monitoring/stats");
  },
  async getDefaultSelectedVehicle() {
    if (USE_MOCK) return mockService.getDefaultSelectedVehicle();
    return await axiosClient.get("/monitoring/selected-vehicle");
  },
  async dispatchVehicleToRestStop(payload) {
    // payload: { vehiclePlate, restStopName, dispatcherName }
    if (USE_MOCK) return mockService.dispatchVehicleToRestStop(payload);
    return await axiosClient.post("/trips/dispatch-rest-stop", payload);
  },
  async getFleetStatus() {
    if (USE_MOCK) return mockService.getFleetStatus();
    return await axiosClient.get(API_URLS.FLEET_STATUS);
  },
  async getNearestRestStop(tripId) {
    if (USE_MOCK) return mockService.getNearestRestStop(tripId);
    return await axiosClient.get(`/routes/nearest-rest-stop?tripId=${tripId}`);
  },
  async getAiConfig() {
    if (USE_MOCK) return mockService.getAiConfig();
    return await axiosClient.get("/admin/ai-config");
  },
  async updateAiConfig(newConfig, adminName = "Trần Quản Trị") {
    if (USE_MOCK) return mockService.updateAiConfig(newConfig, adminName);
    return await axiosClient.put("/admin/ai-config", newConfig);
  },
  async getAuditLogs() {
    if (USE_MOCK) return mockService.getAuditLogs();
    return await axiosClient.get("/admin/audit-logs");
  },
  async createAuditLog(logData) {
    if (USE_MOCK) return mockService.createAuditLog(logData);
    return await axiosClient.post("/admin/audit-logs", logData);
  },
  async getUnreadNotificationCount() {
    if (USE_MOCK) return 2;
    return await axiosClient.get(API_URLS.NOTIFICATIONS_UNREAD);
  },
  async markAllNotificationsAsRead() {
    if (USE_MOCK) return true;
    return await axiosClient.patch(API_URLS.NOTIFICATIONS_READ_ALL);
  },
};

export default dataService;
