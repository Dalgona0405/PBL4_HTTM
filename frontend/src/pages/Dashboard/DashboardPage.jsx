import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getPriorityFleet,
  getLiveMonitoringStats,
  getDefaultSelectedVehicle,
  dispatchVehicleToRestStop,
} from "../../mock";
import {
  Truck,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Radio,
  Navigation,
  PhoneCall,
  Video,
  X,
  Gauge,
  Wind,
} from "lucide-react";

function DashboardPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(() =>
    getDefaultSelectedVehicle(),
  );
  const [fleetList, setFleetList] = useState(() => getPriorityFleet());
  const [stats, setStats] = useState(() => getLiveMonitoringStats());
  const [countdownSeconds, setCountdownSeconds] = useState(
    () => selectedVehicle?.countdownSeconds || 12 * 60 + 49,
  );

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

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

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (vehicle?.countdownSeconds !== undefined) {
      setCountdownSeconds(vehicle.countdownSeconds);
    }
  };

  const handleDispatchNav = (stopName) => {
    const targetStop =
      stopName || selectedVehicle?.nearestRestStop?.name || "Trạm Nghỉ Cao Tốc";

    dispatchVehicleToRestStop({
      vehiclePlate: selectedVehicle.plate,
      restStopName: targetStop,
    });

    setFleetList(getPriorityFleet());
    setStats(getLiveMonitoringStats());
    toast.success(
      `Đã phát lệnh điều hướng vào [${targetStop}] tới xe ${selectedVehicle.plate}!`,
      { duration: 4000, icon: "📍" },
    );
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* 1. TIÊU ĐỀ TRANG */}
      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-brand-text-primary text-2xl font-black tracking-tight">
            Bản đồ GPS & Điều phối Trực tuyến
          </h1>
          <p className="text-brand-text-muted text-xs">
            Giám sát vi phạm AI thời gian thực, nồng độ CO2 và điều hướng khẩn
            cấp
          </p>
        </div>
        <div className="card-glass flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-brand-text-secondary font-mono font-bold">
            MQTT Telemetry: ONLINE
          </span>
        </div>
      </div>

      {/* 2. CÁC THẺ KPI STATS (CHUẨN THEO BẢNG MÀU PALETTE) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-glass border-brand-border flex items-center gap-4 rounded-2xl border p-4 shadow-lg">
          <div className="bg-brand-blue-night/60 text-brand-blue-light border-brand-primary/30 flex h-12 w-12 items-center justify-center rounded-xl border">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-brand-text-muted text-xs font-semibold">
              Xe đang chạy
            </p>
            <p className="text-brand-text-primary text-xl font-black">
              {stats.activeVehicles}{" "}
              <span className="text-brand-text-subtle text-xs font-normal">
                xe IoT
              </span>
            </p>
          </div>
        </div>

        <div className="card-glass border-alert-danger/30 flex items-center gap-4 rounded-2xl border bg-rose-950/20 p-4 shadow-lg">
          <div className="bg-alert-danger/20 text-alert-danger border-alert-danger/40 flex h-12 w-12 items-center justify-center rounded-xl border">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-alert-danger text-xs font-bold tracking-wider uppercase">
              Ngủ gật (Microsleep)
            </p>
            <p className="text-brand-text-primary text-xl font-black">
              {String(stats.microsleepAlerts).padStart(2, "0")}{" "}
              <span className="text-alert-danger text-xs font-semibold">
                Can thiệp gấp
              </span>
            </p>
          </div>
        </div>

        <div className="card-glass border-alert-warning/30 flex items-center gap-4 rounded-2xl border bg-amber-950/20 p-4 shadow-lg">
          <div className="bg-alert-warning/20 text-alert-warning border-alert-warning/40 flex h-12 w-12 items-center justify-center rounded-xl border">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-alert-warning text-xs font-bold">
              Cảnh báo mệt mỏi
            </p>
            <p className="text-brand-text-primary text-xl font-black">
              {String(stats.fatigueWarnings).padStart(2, "0")}{" "}
              <span className="text-brand-text-subtle text-xs font-normal">
                xe ngáp/CO2
              </span>
            </p>
          </div>
        </div>

        <div className="card-glass border-brand-border flex items-center gap-4 rounded-2xl border p-4 shadow-lg">
          <div className="text-alert-safe flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-brand-text-muted text-xs font-semibold">
              Trạng thái an toàn
            </p>
            <p className="text-brand-text-primary text-xl font-black">
              {stats.normalVehicles}{" "}
              <span className="text-brand-text-subtle text-xs font-normal">
                xe bình thường
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. KHU VỰC BẢN ĐỒ VÀ BẢNG ĐIỀU PHỐI CHI TIẾT */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* KHUNG BẢN ĐỒ MÔ PHỎNG GPS */}
        <div className="card-glass border-brand-border relative flex h-[620px] flex-col overflow-hidden rounded-3xl border shadow-2xl lg:col-span-7">
          <div className="border-brand-border-dark bg-brand-dark/85 absolute top-4 left-4 z-10 flex items-center gap-2.5 rounded-2xl border px-3.5 py-2 text-xs shadow-xl backdrop-blur-md">
            <span className="bg-brand-primary rounded px-2 py-0.5 font-mono text-[11px] font-black text-white">
              CT01
            </span>
            <span className="text-brand-text-primary font-bold">
              Cao tốc Bắc - Nam (Hà Nội - Ninh Bình)
            </span>
            <span className="text-brand-text-subtle">|</span>
            <span className="text-alert-safe flex items-center gap-1.5 text-[11px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Thông suốt
            </span>
          </div>

          {/* Sơ đồ vector đường kính mô phỏng */}
          <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-[#0a101f] to-[#0f172a]">
            <svg
              className="absolute inset-0 h-full w-full opacity-60"
              viewBox="0 0 800 620"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M 60,-30 C 160,140 180,280 230,420 C 290,560 320,700 350,800"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <path
                d="M 270,0 L 270,620"
                fill="none"
                stroke="#1e293b"
                strokeWidth="6"
              />
              <path
                d="M 440,0 Q 420,180 450,330 T 510,620"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeDasharray="12, 6"
              />
            </svg>

            {/* Điểm xe cảnh báo đỏ trên bản đồ */}
            <div className="absolute top-[230px] left-[420px] z-30 cursor-pointer">
              <span className="bg-alert-danger absolute -top-3 -left-3 h-14 w-14 animate-ping rounded-full opacity-40"></span>
              <div className="bg-alert-danger relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white shadow-2xl">
                <span className="text-lg">🚨</span>
              </div>
              <div className="card-glass border-alert-danger/50 mt-2 -ml-8 rounded-lg border px-2 py-1 text-center shadow-md">
                <p className="text-brand-text-primary font-mono text-[10px] font-bold">
                  {selectedVehicle.plate}
                </p>
                <p className="text-alert-danger text-[9px] font-bold">
                  Microsleep
                </p>
              </div>
            </div>

            {/* Danh sách các xe ưu tiên theo dõi (Mini Fleet Bar) */}
            <div className="absolute right-4 bottom-4 left-4 z-20">
              <div className="card-glass border-brand-border rounded-2xl border p-3">
                <p className="text-brand-text-muted mb-2 text-[11px] font-bold tracking-wider uppercase">
                  Đội xe cần chú ý theo dõi ({fleetList.length})
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {fleetList.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleSelectVehicle(v)}
                      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all ${
                        selectedVehicle.plate === v.plate
                          ? "border-brand-primary bg-brand-primary/20 text-white"
                          : "border-brand-border-dark bg-brand-dark/60 text-brand-text-muted hover:border-brand-border"
                      }`}
                    >
                      <span className="text-xs">
                        {v.priorityLevel === "DANGER"
                          ? "🔴"
                          : v.priorityLevel === "WARNING"
                            ? "🟡"
                            : "🟢"}
                      </span>
                      <div>
                        <p className="font-mono text-xs font-bold text-white">
                          {v.plate}
                        </p>
                        <p className="text-brand-text-subtle text-[10px]">
                          {v.driver}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* THẺ BẢNG ĐIỀU PHỐI CAN THIỆP (ACTION PANEL) */}
        <div className="card-glass border-brand-border flex flex-col justify-between rounded-3xl border p-6 shadow-2xl lg:col-span-5">
          <div className="space-y-4">
            {/* Header thông tin xe */}
            <div className="border-brand-border-dark flex items-start justify-between border-b pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-alert-danger animate-pulse rounded-md px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                    Cần can thiệp
                  </span>
                  <span className="bg-brand-surface border-brand-border text-brand-text-muted rounded-md border px-2 py-0.5 text-[10px] font-bold">
                    {selectedVehicle.route}
                  </span>
                </div>
                <h2 className="text-brand-text-primary mt-1.5 font-mono text-3xl font-black tracking-tight">
                  {selectedVehicle.plate}
                </h2>
                <p className="text-brand-text-muted text-xs">
                  {selectedVehicle.model}
                </p>
              </div>

              {/* Đồng hồ đếm ngược tuân thủ T+15p theo SRS 3.1 */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/40 p-2.5 text-right">
                <p className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                  Thời hạn dừng xe
                </p>
                <p className="font-mono text-lg font-black text-amber-300">
                  {formatCountdown(countdownSeconds)}
                </p>
              </div>
            </div>

            {/* Thông tin tài xế */}
            <div className="border-brand-border-dark bg-brand-dark/70 flex items-center justify-between rounded-2xl border p-3.5">
              <div className="flex items-center gap-3">
                <div className="from-brand-primary to-brand-primary-dark flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-white shadow-md">
                  {selectedVehicle.driverName?.charAt(0) || "T"}
                </div>
                <div>
                  <p className="text-brand-text-primary text-xs font-bold">
                    {selectedVehicle.driverName}
                  </p>
                  <p className="text-brand-text-subtle text-[11px]">
                    Mã: {selectedVehicle.driverCode} • Kn:{" "}
                    {selectedVehicle.experience}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-brand-text-subtle text-[10px] font-semibold">
                  Điểm uy tín
                </p>
                <p className="text-brand-blue-sky text-base font-black">
                  {selectedVehicle.score}
                  <span className="text-brand-text-subtle text-xs font-normal">
                    /100
                  </span>
                </p>
              </div>
            </div>

            {/* Các thông số Telemetry thời gian thực */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-brand-border-dark bg-brand-surface/50 rounded-2xl border p-3">
                <div className="text-brand-text-muted flex items-center gap-1.5 text-[11px]">
                  <Gauge className="h-3.5 w-3.5 text-blue-400" /> Vận tốc xe
                </div>
                <p className="text-brand-text-primary mt-1 font-mono text-lg font-black">
                  {selectedVehicle.speed}{" "}
                  <span className="text-brand-text-muted text-xs font-normal">
                    km/h
                  </span>
                </p>
              </div>

              <div className="border-alert-danger/30 rounded-2xl border bg-rose-950/20 p-3">
                <div className="text-alert-danger flex items-center gap-1.5 text-[11px] font-semibold">
                  <Wind className="h-3.5 w-3.5" /> CO2 Trong Cabin
                </div>
                <p className="text-alert-danger mt-1 font-mono text-lg font-black">
                  {selectedVehicle.co2}{" "}
                  <span className="text-xs font-normal">ppm (Cao)</span>
                </p>
              </div>
            </div>

            {/* Chi tiết cảnh báo vi phạm */}
            <div className="border-brand-border-dark bg-brand-dark/50 rounded-2xl border p-3.5 text-xs">
              <p className="text-brand-text-primary font-bold">
                ⚠️ Sự kiện phát hiện: {selectedVehicle.alertType}
              </p>
              <p className="text-brand-text-muted mt-1 leading-relaxed">
                {selectedVehicle.alertDesc}
              </p>
            </div>
          </div>

          {/* Các nút hành động nghiệp vụ (Action Buttons) */}
          <div className="mt-5 space-y-2.5">
            <button
              onClick={() => handleDispatchNav()}
              className="btn-nav-active flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-black tracking-wider text-white uppercase transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Navigation className="h-4 w-4" />
              Gửi Điều Hướng Trạm Nghỉ (
              {selectedVehicle.nearestRestStop?.name || "Km 227"})
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowCallModal(true)}
                className="bg-alert-warning flex cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-amber-600"
              >
                <PhoneCall className="h-3.5 w-3.5" /> Gọi Trực Tiếp
              </button>
              <button
                onClick={() => setShowVideoModal(true)}
                className="card-glass border-brand-border text-brand-text-primary hover:border-brand-border-active flex cursor-pointer items-center justify-center gap-2 rounded-xl border py-2.5 text-xs font-bold transition-all"
              >
                <Video className="text-brand-blue-sky h-3.5 w-3.5" /> Xem Clip
                AI 10s
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL XEM CLIP AI BẰNG CHỨNG 10S */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="card-glass border-brand-border w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl">
            <div className="border-brand-border-dark flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <span className="text-alert-danger text-lg">📹</span>
                <h3 className="text-brand-text-primary text-sm font-bold">
                  Bằng chứng Edge AI (10 giây) • {selectedVehicle.plate}
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-brand-text-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  controls
                  autoPlay
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-alert-danger font-semibold">
                  🔴 Nhận diện: Mắt nhắm 1.8s & gục đầu
                </span>
                <span className="text-alert-safe font-mono font-bold">
                  Độ tin cậy AI: 92%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL GỌI ĐIỆN CHO TÀI XẾ */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="card-glass border-brand-border w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 text-3xl text-amber-400">
              📞
            </div>
            <h3 className="text-brand-text-primary mt-4 text-base font-bold">
              Đang kết nối buồng lái...
            </h3>
            <p className="text-brand-text-muted mt-1 text-xs">
              Tài xế: {selectedVehicle.driverName} (Xe {selectedVehicle.plate})
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  setShowCallModal(false);
                  toast.success("Đã kết thúc cuộc gọi khẩn cấp!");
                }}
                className="bg-alert-danger cursor-pointer rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md"
              >
                Ngắt kết nối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
