let mockDriverState = {
  user: {
    id: 4,
    driver_id: 2,
    username: "tx_hoangnam",
    ho_ten: "Phạm Hoàng Nam",
    email: "hoangnam.driver@fleetguard.vn",
    so_dien_thoai: "0905444555",
    hang_bang_lai: "Hạng C",
    so_bang_lai: "C-430054321",
    ngay_het_han_bang_lai: "15/08/2029",
    diem_uy_tin: 58,
    cap_canh_bao: "WARNING_YELLOW",
    privacy_consent_at: "05/09/2026",
    privacy_consent_version: "v1.2-ND13/2023",
  },
  biometricProfile: {
    khung_gio_yeu_sinh_hoc: ["13:00 - 15:00", "01:00 - 04:00"],
    thoi_gian_lai_toi_da_khuyen_nghi_phut: 180,
    thoi_gian_lai_trung_binh_truoc_met_moi_phut: 145,
    ear_baseline: 0.285,
    danh_gia:
      "Điểm uy tín 58 (Cảnh cáo vàng). Hệ thống khuyến nghị nghỉ giải lao 15 phút sau mỗi 2.5 giờ lái liên tục.",
  },
  currentShift: {
    id: 402,
    trip_id: 502,
    bien_so_xe: "43H-567.89",
    loai_xe: "Xe tải thùng 8 tấn",
    ma_thiet_bi: "IOT-DN-02 (Pi 4 + ESP32)",
    ten_tuyen: "KCN Hòa Khánh (Đà Nẵng) → KCN VSIP (Quảng Ngãi)",
    khoang_cach_km: 138.0,
    thoi_gian_bat_dau: "14:00 - 22/10/2026",
    thoi_gian_ket_thuc: "18:30 - 22/10/2026",
    tai_xe_chinh: "Phạm Hoàng Nam",
    tai_xe_phu: "Võ Quốc Bảo",
    active_driver_name: "Phạm Hoàng Nam",
    shift_status: "SCHEDULED",
    trip_status: "NOT_STARTED",
    calibration_mode: null,
    canh_bao_sinh_hoc:
      "Lưu ý: Ca chạy đi qua khung giờ yếu sinh học (13:00 - 15:00). Bắt buộc dừng nghỉ tại Trạm Tam Kỳ (Km 72).",
    telemetry: {
      toc_do_kmh: 64,
      co2_ppm: 780,
      cpu_temp_c: 63.5,
      nearest_rest_stop: "Trạm dịch vụ Tam Kỳ (Cách 14 km)",
    },
  },
  scoreLogs: [
    {
      id: 703,
      loai_thay_doi: "TRU_DIEM",
      so_diem_thay_doi: -2,
      diem_truoc: 60,
      diem_sau: 58,
      ly_do: "Vi phạm HIGH_CO2 #604 (CO2 > 1200ppm quá 5 phút)",
      created_at: "22/10/2026 • 04:02",
    },
    {
      id: 702,
      loai_thay_doi: "TRU_DIEM",
      so_diem_thay_doi: -5,
      diem_truoc: 65,
      diem_sau: 60,
      ly_do: "Vi phạm PHONE_DISTRACTION #602 (Dùng điện thoại 4.2s)",
      created_at: "22/10/2026 • 03:30",
    },
    {
      id: 700,
      loai_thay_doi: "CONG_DIEM_THUONG",
      so_diem_thay_doi: 5,
      diem_truoc: 60,
      diem_sau: 65,
      ly_do: "Thưởng hoàn thành chuyến đi an toàn (> 50km, không vi phạm)",
      created_at: "20/10/2026 • 19:15",
    },
  ],
  violations: [
    {
      id: 601,
      ma_loai: "MICROSLEEP",
      ten_loai: "Ngủ gật (Microsleep)",
      diem_bi_tru: 10,
      trang_thai_xac_thuc: "PENDING_MANUAL_REVIEW",
      thoi_gian: "22/10/2026 • 03:55",
      mo_ta:
        "YOLO26 phát hiện mắt nhắm 1.8s khi xe chạy 75 km/h. Đang chờ Điều phối viên duyệt video 10s.",
      dispute_status: null,
    },
    {
      id: 602,
      ma_loai: "PHONE_DISTRACTION",
      ten_loai: "Dùng điện thoại khi lái xe",
      diem_bi_tru: 5,
      trang_thai_xac_thuc: "CONFIRMED",
      thoi_gian: "22/10/2026 • 03:30",
      mo_ta:
        "AI Cloud xác nhận (Độ tin cậy 92%): Cầm điện thoại áp tai 4.2 giây.",
      dispute_status: null,
    },
    {
      id: 604,
      ma_loai: "HIGH_CO2",
      ten_loai: "Nồng độ CO2 cabin cao",
      diem_bi_tru: 2,
      trang_thai_xac_thuc: "CONFIRMED",
      thoi_gian: "22/10/2026 • 04:02",
      mo_ta:
        "Cảm biến MQ-135 ghi nhận CO2 đạt 1,340 ppm kéo dài quá 5 phút không mở kính.",
      dispute_status: "OPEN",
      dispute_reason:
        "Xe dừng sau xe đầu kéo xả khói đen ở trạm cân làm cảm biến nhảy vọt.",
    },
  ],
};

export const driverDataService = {
  async login(username, password, consentChecked) {
    if (!consentChecked) {
      throw new Error(
        "Vui lòng đồng ý chính sách bảo vệ dữ liệu sinh trắc học (NĐ 13/2023/NĐ-CP)!",
      );
    }
    if (!username.trim() || !password.trim()) {
      throw new Error("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
    }
    return { ...mockDriverState.user };
  },

  async getDriverDashboard() {
    return {
      user: { ...mockDriverState.user },
      biometricProfile: { ...mockDriverState.biometricProfile },
      currentShift: { ...mockDriverState.currentShift },
      scoreLogs: [...mockDriverState.scoreLogs],
      violations: [...mockDriverState.violations],
    };
  },

  async respondShift(decision) {
    mockDriverState.currentShift.shift_status = decision;
    return { ...mockDriverState.currentShift };
  },

  async completeCalibration(isOfflineMode = false) {
    mockDriverState.currentShift.trip_status = "IN_PROGRESS";
    mockDriverState.currentShift.calibration_mode = isOfflineMode
      ? "PENDING_CALIBRATION"
      : "ONLINE_SUCCESS";
    return { ...mockDriverState.currentShift };
  },

  async toggleResting() {
    const current = mockDriverState.currentShift.trip_status;
    mockDriverState.currentShift.trip_status =
      current === "RESTING" ? "IN_PROGRESS" : "RESTING";
    return { ...mockDriverState.currentShift };
  },

  async switchCoDriver(isOfflineMode = false) {
    const shift = mockDriverState.currentShift;
    shift.active_driver_name =
      shift.active_driver_name === shift.tai_xe_chinh
        ? shift.tai_xe_phu
        : shift.tai_xe_chinh;
    shift.calibration_mode = isOfflineMode
      ? "PENDING_CALIBRATION"
      : "ONLINE_SUCCESS";
    return { ...shift };
  },

  async completeTrip() {
    mockDriverState.currentShift.trip_status = "COMPLETED";
    return { ...mockDriverState.currentShift };
  },

  async submitDispute({ violationId, reasonCode, explanation }) {
    const target = mockDriverState.violations.find((v) => v.id === violationId);
    if (target) {
      target.dispute_status = "OPEN";
      target.dispute_reason = `[${reasonCode}] ${explanation}`;
    }
    return [...mockDriverState.violations];
  },

  async updateProfile(updatedFields) {
    mockDriverState.user = {
      ...mockDriverState.user,
      ...updatedFields,
    };
    if (updatedFields.ho_ten) {
      mockDriverState.currentShift.tai_xe_chinh = updatedFields.ho_ten;
      mockDriverState.currentShift.active_driver_name = updatedFields.ho_ten;
    }
    return { ...mockDriverState.user };
  },

  async changePassword({ currentPassword, newPassword }) {
    if (!currentPassword || !newPassword) {
      throw new Error("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới!");
    }
    if (newPassword.length < 6) {
      throw new Error("Mật khẩu mới phải có tối thiểu 6 ký tự!");
    }
    return { success: true };
  },
};

export default driverDataService;