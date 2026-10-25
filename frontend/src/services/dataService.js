import axiosClient from "../api/axiosClient";
import * as mockRepo from "../mock";

// - true: Chạy dữ liệu Mock cục bộ (LocalStorage)
// - false: Tự động bắn API thật lên Express Backend (/api/v1)
const USE_MOCK = true;

export const dataService = {
  // 1. XÁC THỰC & ĐĂNG NHẬP (AUTH)
  async login(username, password) {
    if (USE_MOCK) return mockRepo.mockLogin(username, password);
    return await axiosClient.post("/auth/login", { username, password });
  },

  async getCurrentUser() {
    if (USE_MOCK) return mockRepo.getStoredUser();
    return await axiosClient.get("/auth/me");
  },

  // 2. TÀI XẾ, HỒ SƠ SINH HỌC & ĐIỂM UY TÍN
  async getDrivers() {
    if (USE_MOCK) return mockRepo.getDrivers();
    return await axiosClient.get("/drivers");
  },

  async updateDriverStatus(driverId, newStatus, reason, adminName) {
    if (USE_MOCK)
      return mockRepo.updateDriverStatus(
        driverId,
        newStatus,
        reason,
        adminName,
      );
    return await axiosClient.patch(`/drivers/${driverId}/status`, {
      cap_canh_bao: newStatus,
      ly_do: reason,
    });
  },

  async getDriverScoreLogs(driverId = null) {
    if (USE_MOCK) return mockRepo.getScoreLogs(driverId);
    return await axiosClient.get(`/drivers/${driverId}/score-logs`);
  },

  async getDriverBiometrics(driverId = null) {
    if (USE_MOCK) return mockRepo.getBiometricProfiles(driverId);
    return await axiosClient.get(`/drivers/${driverId}/biometrics`);
  },

  async createDriver(driverData) {
    if (USE_MOCK) return mockRepo.createDriver(driverData);
    return await axiosClient.post("/drivers", driverData);
  },

  // 3. ĐỘI XE & THIẾT BỊ IOT EDGE
  async getVehicles() {
    if (USE_MOCK) return mockRepo.getVehicles();
    return await axiosClient.get("/vehicles");
  },

  async createVehicle(vehicleData) {
    if (USE_MOCK) return mockRepo.createVehicle(vehicleData);
    return await axiosClient.post("/vehicles", vehicleData);
  },

  async updateVehicleStatus(vehicleId, newStatus) {
    if (USE_MOCK) return mockRepo.updateVehicleStatus(vehicleId, newStatus);
    return await axiosClient.patch(`/vehicles/${vehicleId}/status`, {
      trang_thai: newStatus,
    });
  },

  // 4. TUYẾN ĐƯỜNG, CA CHẠY & CHUYẾN ĐI
  async getRoutes() {
    if (USE_MOCK) return mockRepo.getRoutes();
    return await axiosClient.get("/routes");
  },

  async getShifts() {
    if (USE_MOCK) return mockRepo.getShifts();
    return await axiosClient.get("/shifts");
  },

  async createShift(shiftData, creatorName) {
    if (USE_MOCK) return mockRepo.createShift(shiftData, creatorName);
    return await axiosClient.post("/shifts", shiftData);
  },

  async getTrips() {
    if (USE_MOCK) return mockRepo.getTrips();
    return await axiosClient.get("/trips");
  },

  // 5. THẨM ĐỊNH VI PHẠM AI
  async getViolations(params = {}) {
    if (USE_MOCK) return mockRepo.getViolations();
    return await axiosClient.get("/violations", { params });
  },

  async reviewViolation({
    violationId,
    decision,
    notes,
    reviewerName,
    reviewerId,
  }) {
    if (USE_MOCK) {
      return mockRepo.reviewViolationTransaction({
        violationId,
        decision,
        notes,
        reviewerName,
        reviewerId,
      });
    }
    return await axiosClient.patch(`/violations/${violationId}/review`, {
      trang_thai_xac_thuc: decision,
      ghi_chu_duyet: notes,
    });
  },

  // 6. GIÁM SÁT REALTIME MAP & THỐNG KÊ DASHBOARD
  async getPriorityFleet() {
    if (USE_MOCK) return mockRepo.getPriorityFleet();
    return await axiosClient.get("/monitoring/priority-fleet");
  },

  async getMonitoringStats() {
    if (USE_MOCK) return mockRepo.getLiveMonitoringStats();
    return await axiosClient.get("/monitoring/stats");
  },

  async dispatchVehicleToRestStop(payload) {
    if (USE_MOCK) return mockRepo.dispatchVehicleToRestStop(payload);
    return await axiosClient.post("/trips/dispatch-rest-stop", payload);
  },

  async getAuditLogs() {
    if (USE_MOCK) return mockRepo.getAuditLogs();
    return await axiosClient.get("/audit-logs");
  },

  async getAiConfig() {
    if (USE_MOCK) return mockRepo.getAiConfig();
    return await axiosClient.get("/admin/ai-config");
  },
};

export default dataService;
