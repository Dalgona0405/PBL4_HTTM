import * as seedData from "./mockData";

const STORAGE_KEYS = {
  USERS: "pbl4_users_v2",
  DRIVERS: "pbl4_drivers_v2",
  VEHICLES: "pbl4_vehicles_v2",
  ROUTES: "pbl4_routes_v2",
  SHIFTS: "pbl4_shifts_v2",
  TRIPS: "pbl4_trips_v2",
  VIOLATIONS: "pbl4_violations_v2",
  SCORE_LOGS: "pbl4_score_logs_v2",
  AUDIT_LOGS: "pbl4_audit_logs_v2",
  BIOMETRICS: "pbl4_biometrics_v2",
  AI_CONFIG: "pbl4_ai_config_v2",
};

const getStored = (key, defaultList) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultList));
      return defaultList;
    }
    return JSON.parse(raw);
  } catch {
    return defaultList;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error("Lỗi ghi LocalStorage:", err);
  }
};

// Hàm tiện ích để reset lại dữ liệu gốc khi muốn test lại từ đầu
export const resetAllMockData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  window.location.reload();
};

// 1. AUTH LOGIN
export const mockLogin = (username, password) => {
  const users = getStored(STORAGE_KEYS.USERS, seedData.mockUsers);
  const user = users.find((u) => u.username === username);
  if (!user && username !== "admin" && username !== "dieuphoi") {
    throw new Error("Sai tên đăng nhập hoặc mật khẩu");
  }
  const loggedUser = user || {
    id: username === "admin" ? 1 : 2,
    username,
    ho_ten: username === "admin" ? "Nguyễn Quản Trị" : "Trần Điều Phối",
    vai_tro: username === "admin" ? "ADMIN" : "DISPATCHER",
    role: username === "admin" ? "ADMIN" : "DISPATCHER",
  };
  return {
    user: {
      ...loggedUser,
      name: loggedUser.ho_ten,
      role: loggedUser.vai_tro || loggedUser.role,
    },
    access_token: "mock-jwt-token-vietnam-2026",
  };
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

// 2. DATA GETTERS
export const getDrivers = () =>
  getStored(STORAGE_KEYS.DRIVERS, seedData.mockDrivers);
export const getVehicles = () =>
  getStored(STORAGE_KEYS.VEHICLES, seedData.mockVehicles);
export const getRoutes = () =>
  getStored(STORAGE_KEYS.ROUTES, seedData.mockRoutes);
export const getShifts = () =>
  getStored(STORAGE_KEYS.SHIFTS, seedData.mockShifts);
export const getTrips = () => getStored(STORAGE_KEYS.TRIPS, seedData.mockTrips);
export const getViolations = () =>
  getStored(STORAGE_KEYS.VIOLATIONS, seedData.mockViolations);

export const getScoreLogs = (driverId = null) => {
  const logs = getStored(STORAGE_KEYS.SCORE_LOGS, seedData.mockDriverScoreLogs);
  if (!driverId) return logs;
  return logs.filter((l) => l.driver_id === Number(driverId));
};

export const getAuditLogs = () =>
  getStored(STORAGE_KEYS.AUDIT_LOGS, seedData.mockAuditLogs);

export const getBiometricProfiles = (driverId = null) => {
  const bios = getStored(
    STORAGE_KEYS.BIOMETRICS,
    seedData.mockDriverBiometricProfiles,
  );
  if (!driverId) return bios;
  return bios.find((b) => b.driver_id === Number(driverId)) || null;
};

// 3. MUTATIONS (THÊM / SỬA / GIAO DỊCH TRỪ ĐIỂM)
export const reviewViolationTransaction = ({
  violationId,
  decision,
  notes = "",
  reviewerName = "Trần Điều Phối",
  reviewerId = 2,
}) => {
  const violations = getViolations();
  const violation = violations.find((v) => v.id === Number(violationId));
  if (!violation) throw new Error("Không tìm thấy vi phạm");

  const isConfirm = decision === "CONFIRMED";
  const oldStatus = violation.trang_thai_xac_thuc || violation.trang_thai;
  violation.trang_thai_xac_thuc = isConfirm ? "CONFIRMED" : "REJECTED";
  violation.nguon_quyet_dinh = "DISPATCHER";
  violation.trang_thai_diem = isConfirm ? "APPLIED" : "NOT_APPLIED";
  violation.reviewed_by = reviewerId;
  violation.reviewed_at = new Date().toISOString();
  violation.ghi_chu_duyet = notes;
  setStored(STORAGE_KEYS.VIOLATIONS, violations);

  if (isConfirm) {
    const drivers = getDrivers();
    const driver = drivers.find(
      (d) => d.id === violation.driver_id || d.user_id === violation.driver_id,
    );
    if (driver) {
      const diemTruoc = driver.diem_uy_tin ?? 100;
      const penalty = violation.diem_bi_tru ?? violation.diem_tru ?? 10;
      const diemSau = Math.max(0, diemTruoc - penalty);
      driver.diem_uy_tin = diemSau;

      if (diemSau <= 20) {
        driver.cap_canh_bao = "SUSPENDED_RED";
        driver.trang_thai_lai_xe = "OFF_DUTY";
      } else if (diemSau <= 65) {
        driver.cap_canh_bao = "WARNING_YELLOW";
      } else {
        driver.cap_canh_bao = "NORMAL";
      }
      setStored(STORAGE_KEYS.DRIVERS, drivers);

      const scoreLogs = getScoreLogs();
      scoreLogs.unshift({
        id: Date.now(),
        driver_id: driver.id,
        loai_thay_doi: "TRU_DIEM",
        so_diem_thay_doi: -penalty,
        diem_truoc: diemTruoc,
        diem_sau: diemSau,
        ly_do: `Vi phạm ${violation.ma_loai || violation.ten_loai}: ${notes || violation.mo_ta}`,
        violation_id: violation.id,
        trip_id: violation.trip_id || 501,
        created_at: new Date().toISOString(),
      });
      setStored(STORAGE_KEYS.SCORE_LOGS, scoreLogs);
    }
  }

  const auditLogs = getAuditLogs();
  auditLogs.unshift({
    id: Date.now() + 1,
    user_id: reviewerId,
    user_name: reviewerName,
    hanh_dong: isConfirm ? "CONFIRM_VIOLATION" : "REJECT_VIOLATION",
    doi_tuong_loai: "violation",
    doi_tuong_id: String(violation.id),
    gia_tri_truoc: { trang_thai_xac_thuc: oldStatus },
    gia_tri_sau: { trang_thai_xac_thuc: isConfirm ? "CONFIRMED" : "REJECTED" },
    ly_do: notes,
    created_at: new Date().toISOString(),
  });
  setStored(STORAGE_KEYS.AUDIT_LOGS, auditLogs);

  return violation;
};

export const updateDriverStatus = (
  driverId,
  newStatus,
  reason = "Cập nhật trạng thái từ bảng điều khiển",
  adminName = "Trần Điều Phối",
) => {
  const drivers = getDrivers();
  const driver = drivers.find((d) => d.id === Number(driverId));
  if (!driver) throw new Error("Không tìm thấy tài xế");

  const oldStatus = driver.cap_canh_bao;
  driver.cap_canh_bao = newStatus;
  if (newStatus === "SUSPENDED_RED") {
    driver.diem_uy_tin = Math.min(driver.diem_uy_tin, 15);
    driver.trang_thai_lai_xe = "OFF_DUTY";
  } else {
    driver.diem_uy_tin = 85;
    driver.trang_thai_lai_xe = "AVAILABLE";
  }
  setStored(STORAGE_KEYS.DRIVERS, drivers);

  const auditLogs = getAuditLogs();
  auditLogs.unshift({
    id: Date.now(),
    user_id: 1,
    user_name: adminName,
    hanh_dong:
      newStatus === "SUSPENDED_RED" ? "SUSPEND_DRIVER" : "UNLOCK_DRIVER",
    doi_tuong_loai: "driver",
    doi_tuong_id: String(driverId),
    gia_tri_truoc: { cap_canh_bao: oldStatus },
    gia_tri_sau: { cap_canh_bao: newStatus, diem_uy_tin: driver.diem_uy_tin },
    ly_do: reason,
    created_at: new Date().toISOString(),
  });
  setStored(STORAGE_KEYS.AUDIT_LOGS, auditLogs);

  return driver;
};

export const createDriver = (driverData) => {
  const drivers = getDrivers();
  drivers.unshift(driverData);
  setStored(STORAGE_KEYS.DRIVERS, drivers);
  return driverData;
};

export const createVehicle = (vehicleData) => {
  const vehicles = getVehicles();
  vehicles.unshift(vehicleData);
  setStored(STORAGE_KEYS.VEHICLES, vehicles);
  return vehicleData;
};

export const updateVehicleStatus = (vehicleId, newStatus) => {
  const vehicles = getVehicles();
  const v = vehicles.find((x) => x.id === Number(vehicleId));
  if (v) {
    v.trang_thai = newStatus;
    setStored(STORAGE_KEYS.VEHICLES, vehicles);
  }
  return v;
};

export const createShift = (shiftData) => {
  const shifts = getShifts();
  shifts.unshift(shiftData);
  setStored(STORAGE_KEYS.SHIFTS, shifts);
  return shiftData;
};

// 4. MAP & ADMIN HELPERS
export const getPriorityFleet = () => {
  const vehicles = getVehicles();
  return vehicles.map((v, idx) => ({
    id: v.id,
    plate: v.bien_so_xe || v.bien_so,
    bien_so_xe: v.bien_so_xe || v.bien_so,
    model: v.loai_xe,
    loai_xe: v.loai_xe,
    driver:
      v.tai_xe_hien_tai ||
      (idx === 0
        ? "Lê Minh Tuấn"
        : idx === 1
          ? "Phạm Hoàng Nam"
          : "Võ Quốc Bảo"),
    driverCode: `TX-010${idx + 1}`,
    experience: `${4 + idx} năm`,
    score: idx === 1 ? 58 : 95,
    route: idx === 1 ? "Đà Nẵng - Quảng Ngãi" : "Đà Nẵng - Huế",
    speed: idx === 0 ? "65 km/h" : idx === 1 ? "78 km/h" : "52 km/h",
    co2: idx === 1 ? "1,340 ppm" : "680 ppm",
    priorityLevel: idx === 1 ? "DANGER" : "SAFE",
    priorityBadge: idx === 1 ? "CAN THIỆP GẤP" : "AN TOÀN",
    alertType: idx === 1 ? "MICROSLEEP" : "NORMAL",
    alertDesc:
      idx === 1
        ? "YOLO26 phát hiện mắt nhắm 1.8s kèm nồng độ CO2 cabin vượt ngưỡng (1,340 ppm)."
        : "Phương tiện đang di chuyển ổn định, các chỉ số sinh học bình thường.",
    countdownSeconds: idx === 1 ? 769 : 900,
    nearestRestStop: { name: "Trạm Dừng Nghỉ Nam Hải Vân (Km 22)" },
  }));
};

export const getFleetStatus = () => getPriorityFleet();

export const getDefaultSelectedVehicle = () => {
  const fleet = getPriorityFleet();
  return fleet.find((v) => v.priorityLevel === "DANGER") || fleet[0] || null;
};

export const getLiveMonitoringStats = () => {
  const vehicles = getVehicles();
  const violations = getViolations();
  const activeCount =
    vehicles.filter((v) => v.trang_thai === "IN_USE").length || 2;
  const microsleepCount =
    violations.filter(
      (v) =>
        v.ma_loai === "MICROSLEEP" &&
        v.trang_thai_xac_thuc === "PENDING_MANUAL_REVIEW",
    ).length || 1;

  return {
    activeVehicles: activeCount,
    microsleepAlerts: microsleepCount,
    fatigueWarnings: 1,
    normalVehicles: Math.max(1, vehicles.length - microsleepCount - 1),
  };
};

export const dispatchVehicleToRestStop = ({ vehiclePlate, restStopName }) => {
  console.log(`[DISPATCH] Gửi lệnh vào ${restStopName} tới xe ${vehiclePlate}`);
  return { success: true };
};

export const getAiConfig = () =>
  getStored(STORAGE_KEYS.AI_CONFIG, {
    microsleep_eye_closed_sec: 1.5,
    co2_warning_threshold_ppm: 1200,
    auto_confirm_min: 0.85,
    penalty_cap_per_trip: 30,
    penalty_cap_per_day: 50,
  });

export const updateAiConfig = (newConfig) => {
  const current = getAiConfig();
  const updated = { ...current, ...newConfig };
  setStored(STORAGE_KEYS.AI_CONFIG, updated);
  return updated;
};
