import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getPriorityFleet,
  getLiveMonitoringStats,
  getDefaultSelectedVehicle,
  dispatchVehicleToRestStop,
  mockLiveMonitoring,
} from "../../mock";

function MapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState(() =>
    getDefaultSelectedVehicle(),
  );

  const [fleetList, setFleetList] = useState(() => getPriorityFleet());

  const [stats, setStats] = useState(() => getLiveMonitoringStats());

  const [countdownSeconds, setCountdownSeconds] = useState(
    () => selectedVehicle?.countdownSeconds || 12 * 60 + 49,
  );

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);

    if (vehicle?.countdownSeconds !== undefined) {
      setCountdownSeconds(vehicle.countdownSeconds);
    }
  };

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

  const handleDispatchNav = (stopName) => {
    const targetStop =
      stopName ||
      (selectedRestStopOpt === 1
        ? selectedVehicle?.nearestRestStop?.name
        : selectedVehicle?.altRestStop?.name) ||
      "Trạm Nghỉ";

    dispatchVehicleToRestStop({
      vehiclePlate: selectedVehicle.plate,

      restStopName: targetStop,
    });

    setFleetList(getPriorityFleet());

    setStats(getLiveMonitoringStats());

    toast.success(
      `Điều hướng vào [${targetStop}] tới Cabin xe ${selectedVehicle.plate} & App Driver!`,

      { duration: 5000, icon: "📍" },
    );
  };

  return (
    <div className="animate-fade-in-up space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Bản đồ GPS & Điều phối Trực tuyến
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-blue-100 bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <span className="text-lg">🚚</span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400">
              Đang hoạt động
            </p>

            <p className="text-lg font-black text-slate-900">
              {stats.activeVehicles}{" "}
              <span className="text-xs font-semibold text-slate-400">
                xe IoT
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-rose-200 bg-rose-50/70 p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-xs">
            <span className="text-lg font-black">!</span>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-tight text-rose-700 uppercase">
              Ngủ gật (Microsleep)
            </p>

            <p className="text-lg font-black text-rose-600">
              {String(stats.microsleepAlerts).padStart(2, "0")}{" "}
              <span className="text-xs font-bold text-rose-500">
                Cần can thiệp
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
            <span className="text-lg">⚠️</span>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-tight text-amber-800">
              Cảnh báo mệt mỏi
            </p>

            <p className="text-lg font-black text-amber-700">
              {String(stats.fatigueWarnings).padStart(2, "0")}{" "}
              <span className="text-xs font-semibold text-amber-600">xe</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <span className="text-lg">🛡️</span>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400">
              Trạng thái bình thường
            </p>

            <p className="text-lg font-black text-slate-900">
              {stats.normalVehicles}{" "}
              <span className="text-xs font-semibold text-slate-400">xe</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="relative flex h-[670px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xs lg:col-span-7">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/95 px-3 py-1.5 text-xs shadow-md backdrop-blur-md">
            <span className="rounded bg-blue-600 px-1.5 py-0.5 font-sans text-[10px] font-black text-white">
              CT01
            </span>

            <span className="text-[11px] font-bold text-slate-800">
              Cao tốc Bắc - Nam
            </span>

            <span className="text-slate-300">|</span>

            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Mật độ: Thông suốt
            </span>
          </div>

          <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-100 via-teal-50/50 to-blue-50/60">
            <svg
              className="absolute inset-0 h-full w-full"

              viewBox="0 0 800 670"

              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M 60,-30 C 160,140 180,280 230,420 C 290,560 320,700 350,800"

                fill="none"

                stroke="var(--color-blue-light, #bae6fd)"

                strokeWidth="20"

                strokeLinecap="round"

                opacity="0.75"
              />

              <path
                d="M 270,0 L 270,670"

                fill="none"

                stroke="var(--text-secondary, #e2e8f0)"

                strokeWidth="5"
              />

              <path
                d="M 440,0 Q 420,180 450,330 T 510,670"

                fill="none"

                stroke="var(--text-muted, #cbd5e1)"

                strokeWidth="12"
              />

              <path
                d="M 440,0 Q 420,180 450,330 T 510,670"

                fill="none"

                stroke="var(--color-primary, #3b82f6)"

                strokeWidth="7"

                strokeDasharray="14, 5"
              />
            </svg>

            <div className="absolute top-[240px] left-[420px] z-30">
              <span className="absolute -top-3 -left-3 h-14 w-14 animate-ping rounded-full bg-rose-500 opacity-40"></span>

              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-rose-600 text-white shadow-2xl">
                <span className="text-base">🚨</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-5">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="animate-pulse rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-black tracking-wider text-white uppercase">
                  Can thiệp
                </span>

                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                  {selectedVehicle.route}
                </span>
              </div>

              <h2 className="mt-1 font-sans text-3xl font-black tracking-tight text-slate-900">
                {selectedVehicle.plate}
              </h2>

              <p className="text-xs text-slate-400">{selectedVehicle.model}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
                {selectedVehicle.driverName.charAt(0)}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-900">
                  {selectedVehicle.driverName}
                </p>

                <p className="text-[11px] text-slate-400">
                  Mã: {selectedVehicle.driverCode} | Thâm niên:{" "}
                  {selectedVehicle.experience}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-medium text-slate-400">
                Điểm uy tín
              </p>

              <p className="text-base font-black text-blue-600">
                {selectedVehicle.score}

                <span className="text-xs font-normal text-slate-400">/100</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-2.5">
              <span className="text-[10px] font-medium text-slate-400">
                Tốc độ
              </span>

              <p className="mt-0.5 text-base font-black text-slate-800">
                {selectedVehicle.speed}{" "}
                <span className="text-xs font-semibold text-slate-400">
                  km/h
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-2.5">
              <span className="text-[10px] font-medium text-rose-600">
                Nồng độ CO2
              </span>

              <p className="mt-0.5 text-base font-black text-rose-600">
                {selectedVehicle.co2}{" "}
                <span className="text-xs font-bold text-rose-500">
                  ppm (Cao)
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-0.5">
            <button
              onClick={() => handleDispatchNav()}

              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-black text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-98"
            >
              <span>🧭</span>

              <span>GỬI ĐIỀU HƯỚNG VÀO TRẠM NGHỈ</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowCallModal(true)}

                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-amber-600"
              >
                <span>📞</span> Gọi Trực Tiếp
              </button>

              <button
                onClick={() => setShowVideoModal(true)}

                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 py-2 text-xs font-bold text-slate-800 transition-all hover:bg-slate-200"
              >
                <span>📹</span> Clip AI 10s
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
