// ==============================================================================
// 0. BẢNG MÃ VI PHẠM & HELPER PARSE JSON
// ==============================================================================
export const VIOLATION_TYPE_MAP = {
  MICROSLEEP: {
    label: "Ngủ gật (Microsleep)",
    color: "#ef4444",
    default_penalty: 10,
    need_video: true,
  },
  PHONE_DISTRACTION: {
    label: "Dùng điện thoại",
    color: "#f97316",
    default_penalty: 5,
    need_video: true,
  },
  YAWNING_FATIGUE: {
    label: "Ngáp dài mệt mỏi",
    color: "#f59e0b",
    default_penalty: 5,
    need_video: false,
  },
  HIGH_CO2: {
    label: "CO2 buồng lái cao",
    color: "#eab308",
    default_penalty: 2,
    need_video: false,
  },
  DEVICE_TAMPERING: {
    label: "Che / Rút cáp thiết bị",
    color: "#a855f7",
    default_penalty: 15,
    need_video: false,
  },
};

export const safeParseJSON = (data, fallback = null) => {
  if (!data) return fallback;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};

// ==============================================================================
// 1. USERS & DRIVERS (Đủ 3 cấp: Xanh - Vàng - Đỏ)
// ==============================================================================
export const mockUsers = [
  {
    id: 1,
    fleet_id: 1,
    username: "admin_dut",
    ho_ten: "Nguyễn Quản Trị",
    so_dien_thoai: "0905111222",
    vai_tro: "ADMIN",
    trang_thai: "ACTIVE",
    created_at: "2026-09-01T08:00:00.000Z",
  },
  {
    id: 2,
    fleet_id: 1,
    username: "dispatcher_dn",
    ho_ten: "Trần Điều Phối",
    so_dien_thoai: "0905222333",
    vai_tro: "DISPATCHER",
    trang_thai: "ACTIVE",
    created_at: "2026-09-01T08:00:00.000Z",
  },
  {
    id: 3,
    fleet_id: 1,
    username: "tx_minhtuan",
    ho_ten: "Lê Minh Tuấn",
    so_dien_thoai: "0905333444",
    vai_tro: "DRIVER",
    trang_thai: "ACTIVE",
    created_at: "2026-09-05T08:00:00.000Z",
  },
  {
    id: 4,
    fleet_id: 1,
    username: "tx_hoangnam",
    ho_ten: "Phạm Hoàng Nam",
    so_dien_thoai: "0905444555",
    vai_tro: "DRIVER",
    trang_thai: "ACTIVE",
    created_at: "2026-09-05T08:00:00.000Z",
  },
  {
    id: 5,
    fleet_id: 1,
    username: "tx_vanhung",
    ho_ten: "Đặng Văn Hùng",
    so_dien_thoai: "0905555666",
    vai_tro: "DRIVER",
    trang_thai: "LOCKED", // Điểm <= 20 nên bị khóa tài khoản
    created_at: "2026-09-10T08:00:00.000Z",
  },
  {
    id: 6,
    fleet_id: 1,
    username: "tx_quocbao",
    ho_ten: "Võ Quốc Bảo",
    so_dien_thoai: "0905666777",
    vai_tro: "DRIVER",
    trang_thai: "ACTIVE",
    created_at: "2026-09-12T08:00:00.000Z",
  },
];

export const mockDrivers = [
  {
    id: 1,
    user_id: 3,
    fleet_id: 1,
    so_bang_lai: "FC-790012345",
    hang_bang_lai: "FC",
    diem_uy_tin: 95, // Tài xế an toàn (NORMAL - Xanh)
    cap_canh_bao: "NORMAL",
    trang_thai_lai_xe: "ON_TRIP",
    user: mockUsers[2],
  },
  {
    id: 2,
    user_id: 4,
    fleet_id: 1,
    so_bang_lai: "C-430054321",
    hang_bang_lai: "C",
    diem_uy_tin: 58, // Cảnh cáo vàng (<= 65 điểm)
    cap_canh_bao: "WARNING_YELLOW",
    trang_thai_lai_xe: "ON_TRIP",
    user: mockUsers[3],
  },
  {
    id: 3,
    user_id: 5,
    fleet_id: 1,
    so_bang_lai: "FC-430098765",
    hang_bang_lai: "FC",
    diem_uy_tin: 15, // Báo động đỏ (<= 20 điểm) -> HARD_BLOCK
    cap_canh_bao: "SUSPENDED_RED",
    trang_thai_lai_xe: "OFF_DUTY",
    user: mockUsers[4],
  },
  {
    id: 4,
    user_id: 6,
    fleet_id: 1,
    so_bang_lai: "C-920011223",
    hang_bang_lai: "C",
    diem_uy_tin: 85,
    cap_canh_bao: "NORMAL",
    trang_thai_lai_xe: "AVAILABLE",
    user: mockUsers[5],
  },
];

// ==============================================================================
// 2. VEHICLES, IOT DEVICES & ROUTES (Chuẩn theo bảng vehicles & iot_devices)
// ==============================================================================
export const mockVehicles = [
  {
    id: 101,
    fleet_id: 1,
    bien_so_xe: "43C-123.45",
    loai_xe: "Đầu kéo Container 40ft",
    tai_trong_tan: 32.5,
    trang_thai: "IN_USE",
    iot_device: {
      id: 201,
      ma_thiet_bi: "IOT-DN-01",
      cpu_serial: "10000000a1b2c3d4",
      firmware_version: "fw-v1.2.0",
      ai_model_version: "yolo26n-v1.1",
      trang_thai_ket_noi: "ONLINE",
      cpu_temp_c: 64.5,
      free_storage_mb: 24500,
      last_heartbeat_at: "2026-10-22T04:03:50.000Z",
    },
  },
  {
    id: 102,
    fleet_id: 1,
    bien_so_xe: "43H-567.89",
    loai_xe: "Xe tải thùng 8 tấn",
    tai_trong_tan: 8.0,
    trang_thai: "IN_USE",
    iot_device: {
      id: 202,
      ma_thiet_bi: "IOT-DN-02",
      cpu_serial: "10000000e5f6a7b8",
      firmware_version: "fw-v1.2.0",
      ai_model_version: "yolo26n-v1.1",
      trang_thai_ket_noi: "ONLINE",
      cpu_temp_c: 73.2,
      free_storage_mb: 18200,
      last_heartbeat_at: "2026-10-22T04:03:55.000Z",
    },
  },
  {
    id: 103,
    fleet_id: 1,
    bien_so_xe: "92C-888.99",
    loai_xe: "Xe tải ISUZU 5 tấn",
    tai_trong_tan: 5.0,
    trang_thai: "ACTIVE",
    iot_device: {
      id: 203,
      ma_thiet_bi: "IOT-QN-01",
      cpu_serial: "100000009c8b7a6f",
      firmware_version: "fw-v1.1.5",
      ai_model_version: "yolo26n-v1.0",
      trang_thai_ket_noi: "OFFLINE",
      cpu_temp_c: null,
      free_storage_mb: 28900,
      last_heartbeat_at: "2026-10-21T18:30:00.000Z",
    },
  },
  {
    id: 104,
    fleet_id: 1,
    bien_so_xe: "43C-999.00",
    loai_xe: "Đầu kéo Hyundai Xcient",
    tai_trong_tan: 30.0,
    trang_thai: "MAINTENANCE", // Bảo dưỡng -> Test chặn xếp ca
    iot_device: null,
  },
];

export const mockRoutes = [
  {
    id: 301,
    fleet_id: 1,
    ten_tuyen: "Cảng Tiên Sa (Đà Nẵng) - KCN Phú Bài (Huế)",
    khoang_cach_km: 95.5,
    thoi_gian_du_kien_phut: 150,
    danh_sach_tram_nghi_chuan: [
      {
        ten: "Trạm dừng nghỉ Nam Hải Vân (Km 22)",
        vi_do: 16.1485,
        kinh_do: 108.1322,
        km_marker: 22,
      },
      {
        ten: "Trạm dừng nghỉ Bắc Hải Vân (Lăng Cô)",
        vi_do: 16.2331,
        kinh_do: 108.0789,
        km_marker: 38,
      },
      {
        ten: "Trạm dịch vụ Hòa Nhơn",
        vi_do: 16.321,
        kinh_do: 107.8215,
        km_marker: 65,
      },
    ],
  },
  {
    id: 302,
    fleet_id: 1,
    ten_tuyen: "KCN Hòa Khánh (Đà Nẵng) - KCN VSIP (Quảng Ngãi)",
    khoang_cach_km: 138.0,
    thoi_gian_du_kien_phut: 180,
    danh_sach_tram_nghi_chuan: [
      {
        ten: "Trạm dừng nghỉ Cao tốc CT01 (Km 36)",
        vi_do: 15.7921,
        kinh_do: 108.3105,
        km_marker: 36,
      },
      {
        ten: "Trạm dịch vụ Tam Kỳ (Km 72)",
        vi_do: 15.5642,
        kinh_do: 108.4812,
        km_marker: 72,
      },
    ],
  },
  {
    id: 303,
    fleet_id: 1,
    ten_tuyen: "Đà Nẵng - Quy Nhơn (Ca đêm xuyên tỉnh)",
    khoang_cach_km: 320.0,
    thoi_gian_du_kien_phut: 390,
    danh_sach_tram_nghi_chuan: [
      {
        ten: "Trạm dừng nghỉ Tam Kỳ",
        vi_do: 15.5642,
        kinh_do: 108.4812,
        km_marker: 72,
      },
      {
        ten: "Trạm dừng nghỉ Sa Huỳnh (Km 170)",
        vi_do: 14.8056,
        kinh_do: 108.9512,
        km_marker: 170,
      },
      {
        ten: "Trạm dừng nghỉ Bồng Sơn (Km 235)",
        vi_do: 14.4312,
        kinh_do: 109.0185,
        km_marker: 235,
      },
    ],
  },
];

// ==============================================================================
// 3. SHIFTS & TRIPS (Khớp 100% với sự kiện Telemetry & Leaflet Map)
// ==============================================================================
export const mockShifts = [
  {
    id: 401,
    driver_id: 1, // Lê Minh Tuấn
    vehicle_id: 101, // 43C-123.45
    route_id: 301,
    thoi_gian_bat_dau_du_kien: "2026-10-22T01:00:00.000Z",
    thoi_gian_ket_thuc_du_kien: "2026-10-22T04:00:00.000Z",
    trang_thai: "IN_PROGRESS",
    canh_bao_khi_tao: null,
    driver: mockDrivers[0],
    vehicle: mockVehicles[0],
    route: mockRoutes[0],
  },
  {
    id: 402,
    driver_id: 2, // Phạm Hoàng Nam (58 điểm)
    vehicle_id: 102, // 43H-567.89
    route_id: 302,
    thoi_gian_bat_dau_du_kien: "2026-10-22T02:00:00.000Z",
    thoi_gian_ket_thuc_du_kien: "2026-10-22T06:30:00.000Z",
    trang_thai: "IN_PROGRESS",
    canh_bao_khi_tao: [
      {
        level: "SOFT_WARNING",
        code: "EXCEED_RECOMMENDED_DRIVE_TIME",
        message:
          "Thời lượng ca vượt mức khuyến nghị của Hồ sơ sinh học (180 phút).",
        ly_do_override:
          "Tài xế cam kết dừng nghỉ 20 phút tại trạm dừng Tam Kỳ.",
      },
      {
        level: "NOTICE",
        code: "BIO_WEAK_WINDOW_OVERLAP",
        message:
          "Ca chạy giao thoa với khung giờ yếu sinh học (13:00 - 15:00).",
      },
    ],
    driver: mockDrivers[1],
    vehicle: mockVehicles[1],
    route: mockRoutes[1],
  },
  {
    id: 403,
    driver_id: 4, // Võ Quốc Bảo
    vehicle_id: 103, // 92C-888.99
    route_id: 303,
    thoi_gian_bat_dau_du_kien: "2026-10-22T14:00:00.000Z",
    thoi_gian_ket_thuc_du_kien: "2026-10-22T21:00:00.000Z",
    trang_thai: "SCHEDULED",
    driver: mockDrivers[3],
    vehicle: mockVehicles[2],
    route: mockRoutes[2],
  },
];

export const mockTrips = [
  {
    id: 501,
    shift_id: 401,
    active_driver_id: 1,
    vehicle_id: 101,
    route_id: 301,
    trang_thai: "IN_PROGRESS",
    thoi_gian_bat_dau: "2026-10-22T01:02:15.000Z",
    driver: mockDrivers[0],
    vehicle: mockVehicles[0],
    route: mockRoutes[0],
    // Tọa độ trực tuyến đang leo đèo Hải Vân
    latest_telemetry: {
      vi_do_gps: 16.1652,
      kinh_do_gps: 108.1284,
      toc_do_kmh: 42.5,
      co2_ppm: 680,
      marker_color: "GREEN",
      thoi_gian_ghi_nhan: "2026-10-22T04:03:55.000Z",
    },
  },
  {
    id: 502,
    shift_id: 402,
    active_driver_id: 2,
    vehicle_id: 102,
    route_id: 302,
    trang_thai: "IN_PROGRESS",
    thoi_gian_bat_dau: "2026-10-22T02:04:30.000Z",
    driver: mockDrivers[1],
    vehicle: mockVehicles[1],
    route: mockRoutes[1],
    // Đang trên cao tốc qua Điện Bàn - BỊ CẢNH BÁO ĐỎ MICROSLEEP
    latest_telemetry: {
      vi_do_gps: 15.8801,
      kinh_do_gps: 108.2519,
      toc_do_kmh: 78.0,
      co2_ppm: 1340,
      marker_color: "RED", // Đang nhấp nháy đỏ trên Leaflet!
      thoi_gian_ghi_nhan: "2026-10-22T04:03:58.000Z",
    },
  },
];

// ==============================================================================
// 4. VIOLATIONS
// ==============================================================================
export const mockViolations = [
  {
    id: 601,
    client_event_id: "550e8400-e29b-41d4-a716-446655440601",
    trip_id: 502,
    driver_id: 2, // Phạm Hoàng Nam
    violation_type_id: 1,
    ma_loai: "MICROSLEEP",
    ten_loai: "Ngủ gật (Microsleep)",
    diem_bi_tru: 10,
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    video_duration: 10,
    trang_thai_xac_thuc: "PENDING_MANUAL_REVIEW", // AI 0.76 -> Chờ duyệt tay
    nguon_quyet_dinh: null,
    trang_thai_diem: "NOT_APPLIED",
    ai_confidence_score: 0.76,
    edge_confidence: 0.88,
    thoi_gian_chot_vi_pham: "2026-10-22T03:55:12.000Z",
    mo_ta:
      "YOLO26 phát hiện mắt nhắm liên tục 1.8s. Điểm EAR Cloud = 0.14. Cần Điều phối viên xác nhận qua video.",
    driver: mockDrivers[1],
    trip: mockTrips[1],
  },
  {
    id: 602,
    client_event_id: "550e8400-e29b-41d4-a716-446655440602",
    trip_id: 502,
    driver_id: 2,
    violation_type_id: 4,
    ma_loai: "PHONE_DISTRACTION",
    ten_loai: "Dùng điện thoại khi lái xe",
    diem_bi_tru: 5,
    video_url:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    video_duration: 10,
    trang_thai_xac_thuc: "CONFIRMED", // AI 0.92 >= 0.85 -> Tự động xác nhận
    nguon_quyet_dinh: "AI",
    trang_thai_diem: "APPLIED",
    ai_confidence_score: 0.92,
    thoi_gian_chot_vi_pham: "2026-10-22T03:30:04.000Z",
    mo_ta:
      "Phát hiện tay cầm điện thoại áp tai liên tục 4.2 giây khi xe chạy 75 km/h.",
    driver: mockDrivers[1],
    trip: mockTrips[1],
  },
  {
    id: 603,
    client_event_id: "550e8400-e29b-41d4-a716-446655440603",
    trip_id: 501,
    driver_id: 1, // Lê Minh Tuấn
    violation_type_id: 2,
    ma_loai: "YAWNING_FATIGUE",
    ten_loai: "Ngáp mệt mỏi liên tục",
    diem_bi_tru: 0,
    video_url: null,
    trang_thai_xac_thuc: "RESOLVED_SAFE", // Đã tấp trạm nghỉ an toàn nên không trừ điểm
    nguon_quyet_dinh: "SYSTEM_RULE",
    trang_thai_diem: "NOT_APPLIED",
    ai_confidence_score: 0.88,
    thoi_gian_chot_vi_pham: "2026-10-22T02:14:30.000Z",
    mo_ta:
      "Ngáp 3 lần trong 5 phút. Tài xế đã dừng nghỉ đủ 15 phút tại Trạm Nam Hải Vân.",
    driver: mockDrivers[0],
    trip: mockTrips[0],
  },
  {
    id: 604,
    client_event_id: "550e8400-e29b-41d4-a716-446655440604",
    trip_id: 502,
    driver_id: 2,
    violation_type_id: 3,
    ma_loai: "HIGH_CO2",
    ten_loai: "Nồng độ CO2 buồng lái cao",
    diem_bi_tru: 2,
    video_url: null,
    trang_thai_xac_thuc: "CONFIRMED",
    nguon_quyet_dinh: "SYSTEM_RULE",
    trang_thai_diem: "APPLIED",
    ai_confidence_score: 1.0,
    thoi_gian_chot_vi_pham: "2026-10-22T04:02:00.000Z",
    mo_ta: "Cảm biến buồng lái ghi nhận CO2 đạt 1340 ppm kéo dài quá 5 phút.",
    driver: mockDrivers[1],
    trip: mockTrips[1],
  },
  {
    id: 605,
    client_event_id: "550e8400-e29b-41d4-a716-446655440605",
    trip_id: 501,
    driver_id: 3, // Đặng Văn Hùng
    violation_type_id: 5,
    ma_loai: "DEVICE_TAMPERING",
    ten_loai: "Che / Rút cáp thiết bị",
    diem_bi_tru: 15,
    video_url: null,
    trang_thai_xac_thuc: "CONFIRMED",
    nguon_quyet_dinh: "DISPATCHER",
    trang_thai_diem: "APPLIED",
    ai_confidence_score: 1.0,
    thoi_gian_chot_vi_pham: "2026-10-21T09:20:00.000Z",
    mo_ta:
      "Khung hình camera bị che tối đen khi xe đang chạy 65 km/h. Điều phối viên xác nhận cố ý vi phạm.",
    driver: mockDrivers[2],
    trip: mockTrips[0],
  },
];

// ==============================================================================
// 5. DRIVER SCORE LOGS (Sổ cái bất biến - Khóa giao dịch)
// ==============================================================================
export const mockDriverScoreLogs = [
  {
    id: 701,
    driver_id: 1, // Lê Minh Tuấn
    loai_thay_doi: "CONG_DIEM_THUONG",
    so_diem_thay_doi: 5,
    diem_truoc: 90,
    diem_sau: 95,
    ly_do: "Thưởng hoàn thành chuyến đi an toàn (> 50km, không có lỗi)",
    violation_id: null,
    trip_id: 501,
    created_at: "2026-10-21T14:00:00.000Z",
  },
  {
    id: 702,
    driver_id: 2, // Phạm Hoàng Nam
    loai_thay_doi: "TRU_DIEM",
    so_diem_thay_doi: -5,
    diem_truoc: 65,
    diem_sau: 60,
    ly_do: "Vi phạm PHONE_DISTRACTION #602",
    violation_id: 602,
    trip_id: 502,
    created_at: "2026-10-22T03:30:25.000Z",
  },
  {
    id: 703,
    driver_id: 2,
    loai_thay_doi: "TRU_DIEM",
    so_diem_thay_doi: -2,
    diem_truoc: 60,
    diem_sau: 58,
    ly_do: "Vi phạm HIGH_CO2 #604",
    violation_id: 604,
    trip_id: 502,
    created_at: "2026-10-22T04:02:00.000Z",
  },
  {
    id: 704,
    driver_id: 3, // Đặng Văn Hùng
    loai_thay_doi: "TRU_DIEM",
    so_diem_thay_doi: -15,
    diem_truoc: 30,
    diem_sau: 15,
    ly_do: "Vi phạm DEVICE_TAMPERING #605 -> Chuyển cấp SUSPENDED_RED",
    violation_id: 605,
    trip_id: 501,
    created_at: "2026-10-21T09:30:00.000Z",
  },
];

// ==============================================================================
// 6. AUDIT LOGS (Nhật ký kiểm toán hệ thống)
// ==============================================================================
export const mockAuditLogs = [
  {
    id: 1101,
    user_id: 2,
    hanh_dong: "REVIEW_VIOLATION",
    doi_tuong_loai: "violation",
    doi_tuong_id: "605",
    gia_tri_truoc: { trang_thai_xac_thuc: "PENDING_MANUAL_REVIEW" },
    gia_tri_sau: { trang_thai_xac_thuc: "CONFIRMED", diem_bi_tru: 15 },
    ly_do: "Xác nhận tài xế cố ý dùng khăn che camera.",
    created_at: "2026-10-21T09:30:00.000Z",
    user_name: "Trần Điều Phối",
  },
  {
    id: 1102,
    user_id: 1,
    hanh_dong: "SUSPEND_DRIVER",
    doi_tuong_loai: "driver",
    doi_tuong_id: "3",
    gia_tri_truoc: { cap_canh_bao: "WARNING_YELLOW", diem_uy_tin: 30 },
    gia_tri_sau: { cap_canh_bao: "SUSPENDED_RED", diem_uy_tin: 15 },
    ly_do: "Điểm rơi xuống 15 (<= 20). Đình chỉ nhận ca theo quy định.",
    created_at: "2026-10-21T09:30:05.000Z",
    user_name: "Nguyễn Quản Trị",
  },
];

// ==============================================================================
// 7. HÀM GIẢ LẬP SOCKET.IO CHO TRÚC TEST BẢN ĐỒ REALTIME
// ==============================================================================
export const startMockSocketSimulation = (
  onEventCallback,
  intervalMs = 3000,
) => {
  let step = 0;
  const timer = setInterval(() => {
    step += 1;
    // Xe 1: Đang leo đèo Hải Vân
    onEventCallback("telemetry:update", {
      trip_id: 501,
      vehicle_id: 101,
      bien_so_xe: "43C-123.45",
      active_driver_name: "Lê Minh Tuấn",
      vi_do_gps: +(16.1652 + step * 0.0008).toFixed(6),
      kinh_do_gps: +(108.1284 - step * 0.0005).toFixed(6),
      toc_do_kmh: +(40 + Math.random() * 8).toFixed(1),
      co2_ppm: Math.round(670 + Math.random() * 40),
      marker_color: "GREEN",
    });

    // Xe 2: Đang trên Cao tốc CT01 - Cảnh báo ĐỎ
    onEventCallback("telemetry:update", {
      trip_id: 502,
      vehicle_id: 102,
      bien_so_xe: "43H-567.89",
      active_driver_name: "Phạm Hoàng Nam",
      vi_do_gps: +(15.8801 - step * 0.0012).toFixed(6),
      kinh_do_gps: +(108.2519 + step * 0.0009).toFixed(6),
      toc_do_kmh: +(75 + Math.random() * 10).toFixed(1),
      co2_ppm: Math.round(1300 + Math.random() * 60),
      marker_color: "RED",
    });
  }, intervalMs);

  return () => clearInterval(timer);
};

// ==============================================================================
// 8. HỒ SƠ SINH HỌC TÀI XẾ 30 NGÀY
// ==============================================================================
export const mockDriverBiometricProfiles = [
  {
    id: 801,
    driver_id: 1, // Lê Minh Tuấn (Tài xế gương mẫu)
    khung_gio_yeu_sinh_hoc: ["02:00 - 04:00"],
    thoi_gian_lai_toi_da_khuyen_nghi: 240, // 4 tiếng
    thoi_gian_lai_trung_binh_truoc_met_moi: 215,
    tan_suat_vi_pham_30_ngay: {
      MICROSLEEP: 0,
      YAWNING_FATIGUE: 1,
      HIGH_CO2: 1,
      PHONE_DISTRACTION: 0,
      DEVICE_TAMPERING: 0,
    },
    danh_gia_chung:
      "Thể trạng xuất sắc, nhịp sinh học ổn định. Thích hợp phân bổ các ca đêm đường dài xuyên tỉnh.",
  },
  {
    id: 802,
    driver_id: 2, // Phạm Hoàng Nam (Cảnh cáo vàng 58đ)
    khung_gio_yeu_sinh_hoc: ["13:00 - 15:00", "01:00 - 04:00"],
    thoi_gian_lai_toi_da_khuyen_nghi: 180, // Chỉ nên lái tối đa 3 tiếng liên tục
    thoi_gian_lai_trung_binh_truoc_met_moi: 145, // Hay ngáp sau 2.5 tiếng
    tan_suat_vi_pham_30_ngay: {
      MICROSLEEP: 2,
      YAWNING_FATIGUE: 5,
      HIGH_CO2: 3,
      PHONE_DISTRACTION: 2,
      DEVICE_TAMPERING: 0,
    },
    danh_gia_chung:
      "Điểm uy tín 58 (Cảnh cáo vàng). Nhịp sinh học giảm rõ rệt đầu giờ chiều. Đang bị giảm 30% tần suất ca đêm.",
  },
  {
    id: 803,
    driver_id: 3, // Đặng Văn Hùng (Báo động đỏ 15đ)
    khung_gio_yeu_sinh_hoc: ["14:00 - 16:00", "00:00 - 05:00"],
    thoi_gian_lai_toi_da_khuyen_nghi: 120,
    thoi_gian_lai_trung_binh_truoc_met_moi: 90,
    tan_suat_vi_pham_30_ngay: {
      MICROSLEEP: 6,
      YAWNING_FATIGUE: 10,
      HIGH_CO2: 4,
      PHONE_DISTRACTION: 4,
      DEVICE_TAMPERING: 2,
    },
    danh_gia_chung:
      "Điểm uy tín 15 (Báo động đỏ). Tài khoản bị đình chỉ công tác toàn bộ. Chờ hội đồng kỷ luật an toàn giao thông xử lý.",
  },
  {
    id: 804,
    driver_id: 4, // Võ Quốc Bảo
    khung_gio_yeu_sinh_hoc: ["13:30 - 15:00"],
    thoi_gian_lai_toi_da_khuyen_nghi: 240,
    thoi_gian_lai_trung_binh_truoc_met_moi: 200,
    tan_suat_vi_pham_30_ngay: {
      MICROSLEEP: 0,
      YAWNING_FATIGUE: 2,
      HIGH_CO2: 0,
      PHONE_DISTRACTION: 1,
      DEVICE_TAMPERING: 0,
    },
    danh_gia_chung:
      "Thể lực tốt, chấp hành nghiêm quy tắc buồng lái. Sẵn sàng nhận ca tại bãi.",
  },
];

// 9. DANH SÁCH KHIẾU NẠI VI PHẠM TỪ APP TÀI XẾ
export const mockDisputes = [
  {
    id: 901,
    violation_id: 602, // Lỗi dùng điện thoại (-5đ) của Phạm Hoàng Nam
    driver_id: 2,
    ma_ly_do: "FALSE_DETECTION",
    ten_ly_do: "AI nhận diện nhầm hành vi",
    noi_dung_giai_trinh:
      "Lúc 03:30 xe đi qua trạm thu phí, tôi đưa tay lên gãi tai và chỉnh lại tai nghe đàm thoại bộ đàm đội xe chứ không hề cầm điện thoại cá nhân. Mong điều phối viên xem kỹ lại video giúp tôi.",
    trang_thai: "OPEN", // Đang chờ giải quyết
    khieu_nai_luc: "2026-10-22T04:10:00.000Z",
    resolved_by: null,
    resolved_at: null,
    phan_hoi: null,
    driver: mockDrivers[1],
    violation: mockViolations[1],
  },
  {
    id: 902,
    violation_id: 604, // Lỗi CO2 cao (-2đ) của Phạm Hoàng Nam
    driver_id: 2,
    ma_ly_do: "SENSOR_ERROR",
    ten_ly_do: "Nhiễu cảm biến môi trường",
    noi_dung_giai_trinh:
      "Thời điểm đó xe đang dừng chờ xếp hàng sau một xe đầu kéo xả khói đen ở trạm cân nên khói lọt vào cabin làm cảm biến MQ-135 nhảy vọt, sau đó tôi đã bật quạt hút gió ngay.",
    trang_thai: "OPEN",
    khieu_nai_luc: "2026-10-22T04:15:00.000Z",
    resolved_by: null,
    resolved_at: null,
    phan_hoi: null,
    driver: mockDrivers[1],
    violation: mockViolations[3],
  },
  {
    id: 903,
    violation_id: 605, // Lỗi che camera (-15đ) của Đặng Văn Hùng (reviewed_by = 2)
    driver_id: 3,
    ma_ly_do: "OTHER",
    ten_ly_do: "Sự cố phần cứng ngoài ý muốn",
    noi_dung_giai_trinh:
      "Do đi qua đoạn đường xóc làm giá đỡ camera bị cụp xuống chứ tôi không cố ý lấy khăn che.",
    trang_thai: "REJECTED", // Đã bị bác bỏ khiếu nại
    khieu_nai_luc: "2026-10-21T11:00:00.000Z",
    resolved_by: 1,
    resolved_by_name: "Nguyễn Quản Trị",
    resolved_at: "2026-10-21T14:20:00.000Z",
    phan_hoi:
      "Hình ảnh trước khi tối đen cho thấy rõ bàn tay kéo vật cản che kín ống kính IR. Giữ nguyên mức phạt đình chỉ.",
    driver: mockDrivers[2],
    violation: mockViolations[4],
  },
];
