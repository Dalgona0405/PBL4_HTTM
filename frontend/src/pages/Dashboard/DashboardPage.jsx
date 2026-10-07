import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

function DashboardPage() {
  // Trạng thái xe đang chọn xem trên bản đồ & bảng điều phối
  const [selectedVehicle, setSelectedVehicle] = useState({
    plate: "29C-882.14",
    model: "Đầu kéo Dongfeng Tianlong 420HP",
    driverName: "Nguyễn Văn Hùng",
    driverCode: "TX-0182",
    experience: "6 năm",
    score: 88,
    speed: 58,
    co2: 1120,
    route: "Tuyến HN - Đà Nẵng",
    alertType: "MICROSLEEP",
    alertDesc:
      "Phát hiện mi mắt khép 1.8s (Microsleep). Đã tự động hú còi 85dB & loa cảnh báo lúc 14:32:10.",
    nearestRestStop: {
      name: "Trạm Dừng Nghỉ Vực Vòng (Km 227)",
      distance: "4.2 km",
      eta: "~6 phút",
      emptySlots: 14,
    },
    altRestStop: {
      name: "Trạm Dịch Vụ Liêm Tuyền",
      distance: "18.5 km",
      eta: "~21 phút",
      emptySlots: 5,
    },
  });

  // Đồng hồ đếm ngược tuân thủ an toàn (T + 15p) theo SRS 3.1 & 3.3
  const [countdownSeconds, setCountdownSeconds] = useState(12 * 60 + 49);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const [selectedRestStopOpt, setSelectedRestStopOpt] = useState(1);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  // Gửi lệnh dẫn đường vào trạm dừng
  const handleDispatchNav = (stopName = "Trạm Dừng Nghỉ Vực Vòng") => {
    toast.success(
      `🚀 Đã gửi lệnh điều hướng rẽ vào [${stopName}] tới màn hình Cabin xe ${selectedVehicle.plate} & App Driver!`,
      { duration: 5000, icon: "📡" }
    );
  };

  // Danh sách xe trong "Bảng ưu tiên Can thiệp & Điều phối Đội xe" đúng như hình mẫu
  const priorityFleet = [
    {
      id: 1,
      priorityLevel: "DANGER",
      priorityBadge: "CAN THIỆP GẤP",
      priorityDesc: "Microsleep 1.8s • Hú còi 85dB",
      plate: "29C-882.14",
      driver: "Nguyễn Văn Hùng",
      driverCode: "TX-0182",
      route: "HN - Đà Nẵng",
      location: "Km 222+800 (CT01 Phủ Lý)",
      speed: "58 km/h",
      co2: "1,120 ppm",
      co2Status: "danger",
      score: "88/100",
      restStop: "Trạm Vực Vòng (Km 227)",
      restStopDistance: "Cách 4.2 km (~6 phút)",
      actionType: "EMERGENCY_DISPATCH",
    },
    {
      id: 2,
      priorityLevel: "WARNING",
      priorityBadge: "CẢNH BÁO MỆT MỎI",
      priorityDesc: "Ngáp 4 lần/5p • Mắt lim dim",
      plate: "51D-401.99",
      driver: "Lê Hoàng Nam",
      driverCode: "TX-0441",
      route: "Pháp Vân - Ninh Bình",
      location: "Km 233+100",
      speed: "64 km/h",
      co2: "920 ppm",
      co2Status: "warning",
      score: "91/100",
      restStop: "Trạm Liêm Tuyền (Km 245)",
      restStopDistance: "Cách 12.3 km (~11 phút)",
      actionType: "REMIND_REST",
    },
    {
      id: 3,
      priorityLevel: "WARNING",
      priorityBadge: "CẢNH BÁO MỆT MỎI",
      priorityDesc: "Dao động làn • Giảm tốc đột ngột",
      plate: "43C-198.52",
      driver: "Phan Quốc Bảo",
      driverCode: "TX-0298",
      route: "Hà Nội - Nghệ An",
      location: "Km 210+400",
      speed: "45 km/h",
      co2: "890 ppm",
      co2Status: "normal",
      score: "85/100",
      restStop: "Trạm Cầu Giẽ (Km 212)",
      restStopDistance: "Cách 1.8 km (~3 phút)",
      actionType: "CHECK_VEHICLE",
    },
    {
      id: 4,
      priorityLevel: "CO2_HIGH",
      priorityBadge: "GIÁM SÁT CO2 CAO",
      priorityDesc: "Thiếu oxy cabin (đếm ngược 5p)",
      plate: "36H-021.45",
      driver: "Vũ Đức Trọng",
      driverCode: "TX-0511",
      route: "Thanh Hóa - Hải Phòng",
      location: "Km 260+500",
      speed: "62 km/h",
      co2: "1,350 ppm",
      co2Status: "danger",
      score: "90/100",
      restStop: "Trạm Cao Bồ (Km 282)",
      restStopDistance: "Cách 2.1 km (~4 phút)",
      actionType: "VENTILATE_CABIN",
    },
    {
      id: 5,
      priorityLevel: "SAFE",
      priorityBadge: "AN TOÀN",
      priorityDesc: "Tình trạng ổn định",
      plate: "15C-312.80",
      driver: "Trần Đình Trọng",
      driverCode: "TX-0114",
      route: "HN - Hải Phòng (Cao tốc 5B)",
      location: "Km 18+200",
      speed: "68 km/h",
      co2: "650 ppm",
      co2Status: "safe",
      score: "96/100",
      restStop: "Trạm dừng Hưng Yên (Km 24)",
      restStopDistance: "Cách 5.8 km (~6 phút)",
      actionType: "STABLE",
    },
    {
      id: 6,
      priorityLevel: "SAFE",
      priorityBadge: "AN TOÀN",
      priorityDesc: "Tình trạng ổn định",
      plate: "29H-772.19",
      driver: "Ngô Quang Huy",
      driverCode: "TX-0322",
      route: "HN - Thanh Hóa",
      location: "Km 42+150",
      speed: "72 km/h",
      co2: "610 ppm",
      co2Status: "safe",
      score: "94/100",
      restStop: "Trạm Tiên Hiệp (Km 185)",
      restStopDistance: "Cách 8.5 km (~9 phút)",
      actionType: "STABLE",
    },
  ];

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* ========================================================================= */}
      {/* 1. HEADER: BREADCRUMB & TIÊU ĐỀ TRUNG TÂM GIÁM SÁT */}
      {/* ========================================================================= */}
      <div>
        <p className="text-[11px] font-black tracking-wider text-blue-600 uppercase">
          Trung tâm giám sát điều phối thời gian thực
        </p>
        <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">
          Bản đồ Giám sát GPS & Điều phối Trạm dừng khẩn cấp
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 2. STATS SUMMARY ROW (4 THẺ KPI ĐÚNG HÌNH MẪU) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Đang hoạt động */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-blue-100 bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <span className="text-lg">📡</span>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Đang hoạt động</p>
            <p className="text-lg font-black text-slate-900">
              42 <span className="text-xs font-semibold text-slate-400">xe IoT</span>
            </p>
          </div>
        </div>

        {/* Card 2: Ngủ gật (Microsleep) */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs">
            <span className="text-lg font-black">!</span>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-rose-700 uppercase">
              Ngủ gật (Microsleep)
            </p>
            <p className="text-lg font-black text-rose-600">
              01 <span className="text-xs font-bold text-rose-500">Cần can thiệp gấp</span>
            </p>
          </div>
        </div>

        {/* Card 3: Cảnh báo Mệt mỏi */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
            <span className="text-lg">🌙</span>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-tight text-amber-800">
              Cảnh báo Mệt mỏi
            </p>
            <p className="text-lg font-black text-amber-700">
              03 <span className="text-xs font-semibold text-amber-600">xe</span>
            </p>
          </div>
        </div>

        {/* Card 4: Bình thường */}
        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <span className="text-lg">✔️</span>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400">Trạng thái Bình thường</p>
            <p className="text-lg font-black text-slate-900">
              38 <span className="text-xs font-semibold text-slate-400">xe</span>
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CENTER SPLIT: BẢN ĐỒ LIVE (LEFT 60%) & BẢNG ĐIỀU PHỐI KHẨN CẤP (RIGHT 40%) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* --------------------------------------------------------------------- */}
        {/* CỘT TRÁI: BẢN ĐỒ LIVE (7/12 COLS) */}
        {/* --------------------------------------------------------------------- */}
        <div className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xs lg:col-span-7 h-[670px]">
          {/* BANNER CAO TỐC TRÊN ĐẦU BẢN ĐỒ */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-1.5 backdrop-blur-md shadow-md border border-slate-100 text-xs">
            <span className="rounded bg-blue-600 px-1.5 py-0.5 font-mono text-[10px] font-black text-white">
              CT01
            </span>
            <span className="font-bold text-slate-800 text-[11px]">
              Cao tốc Bắc - Nam (Pháp Vân - Cầu Giẽ - Ninh Bình)
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Mật độ: Thông
            </span>
          </div>

          {/* CONTROLS BÊN PHẢI BẢN ĐỒ */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <button className="flex items-center gap-1.5 rounded-xl bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-md backdrop-blur-md hover:bg-white">
              <span>🗺️</span> Vệ tinh
            </button>
            <div className="flex flex-col overflow-hidden rounded-xl bg-white shadow-md border border-slate-100">
              <button
                className="p-1.5 text-xs font-black text-slate-700 hover:bg-slate-100"
                onClick={() => toast("Phóng to")}
              >
                +
              </button>
              <div className="h-px bg-slate-100"></div>
              <button
                className="p-1.5 text-xs font-black text-slate-700 hover:bg-slate-100"
                onClick={() => toast("Thu nhỏ")}
              >
                -
              </button>
            </div>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-slate-700 shadow-md hover:bg-slate-100 text-xs"
              onClick={() => toast.success("Định vị xe 29C-882.14")}
            >
              📍
            </button>
          </div>

          {/* SVG MAP CANVAS */}
          <div className="relative flex-1 bg-gradient-to-br from-slate-100 via-teal-50/50 to-blue-50/60 overflow-hidden">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 800 670"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Sông Đáy */}
              <path
                d="M 60,-30 C 160,140 180,280 230,420 C 290,560 320,700 350,800"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="20"
                strokeLinecap="round"
                opacity="0.75"
              />

              {/* Quốc lộ 1A */}
              <path d="M 270,0 L 270,670" fill="none" stroke="#e2e8f0" strokeWidth="5" />

              {/* Tuyến Cao tốc CT01 */}
              <path
                d="M 440,0 Q 420,180 450,330 T 510,670"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="12"
              />
              <path
                d="M 440,0 Q 420,180 450,330 T 510,670"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="7"
                strokeDasharray="14, 5"
              />

              {/* DÒNG CHỈ DẪN DẪN ĐƯỜNG MÀU CAM DẤU CHẤM TỚI TRẠM DỪNG NGHỈ (ĐÚNG NHƯ HÌNH MẪU!) */}
              <path
                d="M 440,260 C 480,310 520,330 600,340"
                fill="none"
                stroke="#f97316"
                strokeWidth="5"
                strokeDasharray="6, 5"
                className="animate-pulse"
              />

              {/* Nhãn địa danh */}
              <text x="170" y="230" fill="#64748b" fontSize="12" fontWeight="bold">
                Đại Học Công Nghiệp Hà Nam
              </text>
              <text x="210" y="300" fill="#0f766e" fontSize="13" fontWeight="black">
                Phủ Lý
              </text>
              <text x="180" y="440" fill="#64748b" fontSize="11">
                Chùa Phật Quang
              </text>
              <text x="210" y="540" fill="#64748b" fontSize="11">
                Tân Thanh
              </text>
              <text x="490" y="240" fill="#64748b" fontSize="11">
                Liêm Tuyền
              </text>
              <text x="560" y="100" fill="#64748b" fontSize="11">
                Duy Tiên
              </text>
            </svg>

            {/* TRẠM DỪNG NGHỈ VỰC VÒNG (BLUE ICON TRÊN MAP) */}
            <div className="absolute top-[315px] left-[595px] z-20 flex flex-col items-center">
              <div className="flex items-center gap-1.5 rounded-2xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                <span className="text-sm">⛽</span>
                <span>Trạm Dừng Nghỉ Vực Vòng</span>
              </div>
              <div className="h-2 w-2 rotate-45 bg-blue-600 -mt-1"></div>
            </div>

            {/* XE MỆT MỎI (AMBER MOON ICON) */}
            <div className="absolute top-[440px] left-[415px] z-20 flex flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-lg">
                🌙
              </div>
            </div>

            {/* XE 29C-882.14 BÁO ĐỘNG NGỦ GẬT VỚI TOOLTIP NỔI TRÊN NÓC XE */}
            <div className="absolute top-[240px] left-[420px] z-30">
              <span className="absolute -top-3 -left-3 h-14 w-14 rounded-full bg-rose-500 opacity-40 animate-ping"></span>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-2xl">
                <span className="text-base">🚨</span>
              </div>

              {/* CALLOUT POPUP NỔI ĐÚNG Y NHƯ HÌNH MẪU! */}
              <div className="absolute -top-[190px] -left-[140px] w-72 rounded-2xl bg-slate-900/95 p-3.5 text-white shadow-2xl backdrop-blur-md border border-slate-700/70">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-rose-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                    NGỦ GẬT (MICROSLEEP 1.8S)
                  </span>
                  <span className="text-slate-400">2 phút trước</span>
                </div>

                <div className="mt-1 flex items-baseline justify-between">
                  <h3 className="font-mono text-xl font-black tracking-tight text-white">
                    29C-882.14
                  </h3>
                </div>

                <p className="text-xs text-slate-300">Tài xế: Nguyễn Văn Hùng</p>

                <div className="mt-2 space-y-1 text-xs border-t border-slate-800 pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Còi xe Edge IoT:</span>
                    <span className="font-bold text-rose-400">ĐÃ KÍCH HOẠT (85dB)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vận tốc:</span>
                    <span className="font-bold text-white">58 km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nồng độ CO2:</span>
                    <span className="font-bold text-amber-400">1,120 ppm (Cao)</span>
                  </div>
                </div>

                <div className="mt-2.5 rounded-lg bg-amber-400/20 px-2 py-1 text-[11px] font-bold text-amber-300">
                  📍 Đang chỉ dẫn tới trạm Vực Vòng:{" "}
                  <span className="text-white">4.2 km (6 ph)</span>
                </div>
              </div>
            </div>
          </div>

          {/* CHÚ THÍCH DƯỚI ĐÁY BẢN ĐỒ */}
          <div className="flex flex-wrap items-center justify-between border-t border-slate-800 bg-slate-950/90 px-4 py-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                Khẩn cấp: Ngủ gật (1)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400"></span>
                Cảnh báo Mệt mỏi (3)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                An toàn
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-400">
              Định vị Km 222 + 800 | Phủ Lý - Hà Nam
            </div>
          </div>
        </div>

        {/* --------------------------------------------------------------------- */}
        {/* CỘT PHẢI: BẢNG ĐIỀU PHỐI KHẨN CẤP (5/12 COLS) */}
        {/* --------------------------------------------------------------------- */}
        <div className="flex flex-col gap-3.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-5">
          {/* HEADER XE */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase animate-pulse">
                  Can thiệp gấp
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {selectedVehicle.route}
                </span>
              </div>
              <h2 className="mt-1 font-mono text-3xl font-black text-slate-900 tracking-tight">
                {selectedVehicle.plate}
              </h2>
              <p className="text-xs text-slate-400">{selectedVehicle.model}</p>
            </div>

            <button
              onClick={() => toast.error("Đã kích hoạt còi khẩn cấp cabin!")}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-xs"
            >
              <span className="text-lg">🚨</span>
            </button>
          </div>

          {/* TÀI XẾ & ĐIỂM UY TÍN */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
                {selectedVehicle.driverName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs">
                  {selectedVehicle.driverName}
                </p>
                <p className="text-[11px] text-slate-400">
                  Mã: {selectedVehicle.driverCode} • Thâm niên: {selectedVehicle.experience}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">Điểm uy tín</p>
              <p className="text-base font-black text-blue-600">
                {selectedVehicle.score}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </p>
            </div>
          </div>

          {/* TELEMETRY */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5">
              <span className="text-[10px] text-slate-400 font-medium">Tốc độ xe</span>
              <p className="mt-0.5 text-base font-black text-slate-800">
                {selectedVehicle.speed}{" "}
                <span className="text-xs font-semibold text-slate-400">km/h</span>
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-2.5">
              <span className="text-[10px] text-rose-600 font-medium">
                Nồng độ CO2 cabin
              </span>
              <p className="mt-0.5 text-base font-black text-rose-600">
                1,120{" "}
                <span className="text-xs font-bold text-rose-500">ppm (Cao)</span>
              </p>
            </div>
          </div>

          {/* CẢNH BÁO EDGE AI CAMERA */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-900 leading-relaxed shadow-xs">
            <span className="text-base text-rose-600 mt-0.5">🛡️</span>
            <div>
              <span className="font-bold text-rose-700">Edge AI Camera:</span>{" "}
              {selectedVehicle.alertDesc}
            </div>
          </div>

          {/* ĐỀ XUẤT TRẠM DỪNG ĐÓN ĐẦU */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Đề xuất Trạm dừng đón đầu
              </h3>
              <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
                <span>⚡</span> AI Route Optimizer
              </span>
            </div>

            {/* Ưu tiên 1 */}
            <div
              onClick={() => setSelectedRestStopOpt(1)}
              className={`cursor-pointer rounded-2xl p-3.5 transition-all border-2 ${
                selectedRestStopOpt === 1
                  ? "border-blue-600 bg-blue-50/40 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  Ưu tiên 1
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  {selectedVehicle.nearestRestStop.emptySlots} chỗ trống
                </span>
              </div>

              <h4 className="mt-1 font-bold text-slate-900 text-xs">
                {selectedVehicle.nearestRestStop.name}
              </h4>

              <div className="mt-1.5 flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px]">Cự ly</span>
                  <p className="font-black text-slate-800 text-xs">
                    {selectedVehicle.nearestRestStop.distance}
                  </p>
                </div>
                <div className="h-5 w-px bg-slate-200"></div>
                <div>
                  <span className="text-slate-400 text-[10px]">ETA</span>
                  <p className="font-black text-blue-600 text-xs">
                    {selectedVehicle.nearestRestStop.eta}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500 border-t border-slate-200/60 pt-1.5">
                <span>☕ Cà phê</span>
                <span>•</span>
                <span>🚿 Tắm nghỉ ngơi</span>
                <span>•</span>
                <span>🛟 Cứu hộ SOS</span>
              </div>
            </div>

            {/* Phương án 2 */}
            <div
              onClick={() => setSelectedRestStopOpt(2)}
              className={`cursor-pointer rounded-2xl p-2.5 transition-all border ${
                selectedRestStopOpt === 2
                  ? "border-blue-600 bg-blue-50/40"
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-200 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 uppercase">
                  Phương án 2
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {selectedVehicle.altRestStop.emptySlots} chỗ
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px]">
                    {selectedVehicle.altRestStop.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    Cách {selectedVehicle.altRestStop.distance} • ETA{" "}
                    {selectedVehicle.altRestStop.eta}
                  </p>
                </div>
                <button className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-700 hover:bg-slate-100">
                  Chọn
                </button>
              </div>
            </div>
          </div>

          {/* ĐỒNG HỒ ĐẾM NGƯỢC TUÂN THỦ T + 15P */}
          <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/70 p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-600">⏰</span>
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-slate-800">
                  Hạn mức tuân thủ bắt buộc (T + 15p)
                </p>
                <p className="text-[10px] text-amber-700">
                  Tránh phạt trừ 5 điểm an toàn
                </p>
              </div>
            </div>
            <div className="font-mono text-lg font-black text-rose-600">
              {formatCountdown(countdownSeconds)}
            </div>
          </div>

          {/* HÀNH ĐỘNG ĐIỀU PHỐI */}
          <div className="space-y-2 pt-0.5">
            <button
              onClick={() => handleDispatchNav()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-black text-white shadow-md shadow-blue-600/30 hover:bg-blue-700 active:scale-98 transition-all"
            >
              <span>🚀</span>
              <span>GỬI LỆNH DẪN ĐƯỜNG VÀO TRẠM VỰC VÒNG</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCallModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all"
              >
                <span>📞</span> Gọi Trực Tiếp Tài Xế
              </button>

              <button
                onClick={() => setShowVideoModal(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 py-2 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-all"
              >
                <span>📹</span> Clip AI 10s{" "}
                <span className="rounded bg-emerald-500 px-1 py-0.2 text-[9px] text-white">
                  92%
                </span>
              </button>
            </div>

            <p className="text-center text-[10px] text-slate-400">
              Lệnh gửi sẽ phát âm thanh cảnh báo điều phối qua màn hình Cabin &
              App Driver FleetGuard.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BẢNG ƯU TIÊN CAN THIỆP & ĐIỀU PHỐI ĐỘI XE (ĐÚNG THEO HÌNH MẪU 100%) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        {/* TIÊU ĐỀ BẢNG ƯU TIÊN */}
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-lg font-black border border-rose-100 shadow-xs">
            !
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">
              Bảng ưu tiên Can thiệp & Điều phối Đội xe
            </h3>
            <p className="text-xs text-slate-400">
              Giám sát thời gian thực danh sách phương tiện theo mức độ rủi ro sinh
              học & vị trí trạm dừng đón đầu
            </p>
          </div>
        </div>

        {/* PILL TỔNG SỐ XE ĐANG THEO DÕI */}
        <div className="mb-3">
          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            Tổng: 6 xe đang theo dõi trọng điểm
          </span>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="rounded-tl-xl px-4 py-3">Mức ưu tiên & Trạng thái</th>
                <th className="px-4 py-3">Phương tiện & Tài xế</th>
                <th className="px-4 py-3">Tuyến & Định vị</th>
                <th className="px-4 py-3">Chỉ số Telemetry</th>
                <th className="px-4 py-3">Trạm dừng đón đầu</th>
                <th className="rounded-tr-xl px-4 py-3 text-center">Hành động điều phối</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {priorityFleet.map((item) => (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-slate-50/80 ${
                    item.id === 1 ? "bg-rose-50/30" : ""
                  }`}
                >
                  {/* Cột 1: Mức ưu tiên & Trạng thái */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-1">
                      {item.priorityLevel === "DANGER" && (
                        <span className="inline-flex w-fit items-center rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
                          {item.priorityBadge}
                        </span>
                      )}
                      {item.priorityLevel === "WARNING" && (
                        <span className="inline-flex w-fit items-center rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-xs">
                          {item.priorityBadge}
                        </span>
                      )}
                      {item.priorityLevel === "CO2_HIGH" && (
                        <span className="inline-flex w-fit items-center rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[10px] font-black text-amber-800">
                          {item.priorityBadge}
                        </span>
                      )}
                      {item.priorityLevel === "SAFE" && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {item.priorityBadge}
                        </span>
                      )}
                      <p
                        className={`text-[11px] ${
                          item.priorityLevel === "DANGER"
                            ? "font-bold text-rose-600"
                            : item.priorityLevel === "WARNING"
                              ? "text-amber-700"
                              : "text-slate-400"
                        }`}
                      >
                        {item.priorityDesc}
                      </p>
                    </div>
                  </td>

                  {/* Cột 2: Phương tiện & Tài xế */}
                  <td className="px-4 py-3.5">
                    <p className="font-mono text-sm font-black text-slate-900">
                      {item.plate}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {item.driver} ({item.driverCode})
                    </p>
                  </td>

                  {/* Cột 3: Tuyến & Định vị */}
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-slate-800 text-xs">
                      {item.route}
                    </p>
                    <p className="text-[11px] text-slate-400">{item.location}</p>
                  </td>

                  {/* Cột 4: Chỉ số Telemetry */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-black text-slate-800">
                        {item.speed}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          item.co2Status === "danger"
                            ? "text-rose-600"
                            : item.co2Status === "warning"
                              ? "text-amber-600"
                              : "text-emerald-600"
                        }`}
                      >
                        • CO2: {item.co2}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600">
                        Uy tín: {item.score}
                      </span>
                    </div>
                  </td>

                  {/* Cột 5: Trạm dừng đón đầu */}
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-blue-600 cursor-pointer hover:underline text-xs flex items-center gap-1">
                      <span>⛽</span> {item.restStop}
                    </p>
                    <p
                      className={`text-[11px] ${
                        item.priorityLevel === "DANGER"
                          ? "font-bold text-rose-600"
                          : "text-slate-400"
                      }`}
                    >
                      {item.restStopDistance}
                    </p>
                  </td>

                  {/* Cột 6: Hành động điều phối */}
                  <td className="px-4 py-3.5 text-center">
                    {item.actionType === "EMERGENCY_DISPATCH" && (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleDispatchNav(item.restStop)}
                          className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all"
                        >
                          <span>🚀</span> Điều phối trạm
                        </button>
                        <button
                          onClick={() => setShowCallModal(true)}
                          className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-all"
                        >
                          <span>📞</span> Gọi khẩn
                        </button>
                      </div>
                    )}

                    {item.actionType === "REMIND_REST" && (
                      <button
                        onClick={() =>
                          toast.success(
                            `Đã phát loa nhắc tài xế ${item.driver} chuẩn bị phương án đỗ nghỉ!`
                          )
                        }
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-600 transition-all mx-auto"
                      >
                        <span>🌙</span> Nhắc nghỉ ngơi
                      </button>
                    )}

                    {item.actionType === "CHECK_VEHICLE" && (
                      <button
                        onClick={() =>
                          toast(`Đang yêu cầu camera cabin kiểm tra hành vi ${item.plate}`)
                        }
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all mx-auto"
                      >
                        <span>👁️</span> Kiểm tra
                      </button>
                    )}

                    {item.actionType === "VENTILATE_CABIN" && (
                      <button
                        onClick={() =>
                          toast.success(
                            `Đã kích hoạt loa cabin xe ${item.plate}: Yêu cầu hạ kính thông gió lấy oxy ngoài!`
                          )
                        }
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all mx-auto"
                      >
                        <span>💨</span> Nhắc hạ kính
                      </button>
                    )}

                    {item.actionType === "STABLE" && (
                      <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                        <span>✔️</span> Ổn định
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL XEM CLIP AI BẰNG CHỨNG 10S */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Clip Bằng Chứng Edge AI (10 Giây)
                </h3>
                <p className="text-xs text-slate-500">
                  Xe: 29C-882.14 • Tài xế: Nguyễn Văn Hùng
                </p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="overflow-hidden rounded-2xl bg-black">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  controls
                  autoPlay
                  className="max-h-64 w-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-rose-50 p-3 text-xs text-rose-800 border border-rose-100">
                <span>🎯 Độ tin cậy AI xác thực:</span>
                <span className="font-bold text-rose-600 text-sm">92%</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setShowVideoModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL GỌI TRỰC TIẾP TÀI XẾ (VOIP CABIN SIMULATOR) */}
      {/* ========================================================================= */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl animate-fade-in-up">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl text-amber-600 animate-bounce">
              📞
            </div>
            <h3 className="mt-3 text-lg font-black text-slate-900">
              Đang kết nối Cabin xe...
            </h3>
            <p className="text-xs text-slate-500">
              Tài xế: Nguyễn Văn Hùng (29C-882.14)
            </p>
            <p className="mt-2 text-xs font-mono text-emerald-600">
              Kênh đàm thoại hai chiều IoT ESP32 đã sẵn sàng
            </p>
            <button
              onClick={() => {
                setShowCallModal(false);
                toast("Đã ngắt cuộc gọi đàm thoại cabin.");
              }}
              className="mt-6 w-full rounded-2xl bg-rose-600 py-3 text-xs font-bold text-white shadow-md hover:bg-rose-700"
            >
              Kết thúc cuộc gọi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
