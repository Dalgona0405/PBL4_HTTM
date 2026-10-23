import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  dispatchVehicleToRestStop,
  getDefaultSelectedVehicle,
  getLiveMonitoringStats,
  getPriorityFleet,
} from "../../mock";
import EmergencyCallModal from "./components/EmergencyCallModal";
import EvidenceVideoModal from "./components/EvidenceVideoModal";
import LeafletMapView from "./components/LeafletMapView";
import MapKpiStats from "./components/MapKpiStats";
import VehicleDispatchPanel from "./components/VehicleDispatchPanel";

export default function MapPage() {
  // 1. DỮ LIỆU ĐỘI XE KÈM TỌA ĐỘ VÀ ĐỒNG HỒ RIÊNG TỪNG XE
  const [fleet, setFleet] = useState(() => {
    const defaultList = getPriorityFleet();
    return defaultList.map((item, index) => ({
      ...item,
      lat: 16.0544 + (index === 0 ? 0.015 : index * 0.018 - 0.025),
      lng: 108.2022 + (index === 0 ? -0.012 : index * 0.015 - 0.02),
      currentSpeed: parseInt(item.speed) || 60,
      currentCo2: parseInt(item.co2?.replace(",", "")) || 850,
      // Mỗi xe có số giây đếm ngược riêng:
      remainingSeconds:
        item.countdownSeconds !== undefined ? item.countdownSeconds : 900,
    }));
  });

  const [selectedVehicle, setSelectedVehicle] = useState(
    () => fleet[0] || getDefaultSelectedVehicle(),
  );
  const [stats] = useState(() => getLiveMonitoringStats());
  const [isSimulating, setIsSimulating] = useState(true);

  // Modals
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  // Ref bản đồ
  const mapInstanceRef = useRef(null);

  // 2. GIẢ LẬP XE CHẠY VÀ GIẢM ĐỒNG HỒ ĐẾM NGƯỢC RIÊNG CHO MỖI XE
  useEffect(() => {
    const timer = setInterval(() => {
      setFleet((prevFleet) =>
        prevFleet.map((v) => {
          // Chỉ nhích nhẹ tọa độ nếu đang bật mô phỏng
          const deltaLat = isSimulating ? (Math.random() - 0.48) * 0.001 : 0;
          const deltaLng = isSimulating ? (Math.random() - 0.48) * 0.001 : 0;

          const updatedVehicle = {
            ...v,
            lat: v.lat + deltaLat,
            lng: v.lng + deltaLng,
            remainingSeconds:
              v.remainingSeconds > 0 ? v.remainingSeconds - 1 : 0,
          };

          // Nếu chiếc xe này đang được chọn trên màn hình -> cập nhật tức thì
          const selectedPlate =
            selectedVehicle?.plate || selectedVehicle?.bien_so;
          const currentPlate = v.plate || v.bien_so;
          if (currentPlate === selectedPlate) {
            setSelectedVehicle(updatedVehicle);
          }

          return updatedVehicle;
        }),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isSimulating, selectedVehicle]);

  // 3. ĐỊNH DẠNG ĐỒNG HỒ PHÚT:GIÂY
  const formatCountdown = (totalSec = 0) => {
    if (totalSec <= 0) return "00:00 (Hết hạn)";
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 4. KHI NGƯỜI DÙNG CLICK CHỌN XE KHÁC
  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);

    // Di chuyển tâm bản đồ tới đúng tọa độ xe đó
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([vehicle.lat, vehicle.lng], 13.5, {
        animate: true,
        duration: 1.0,
      });
    }
  };

  const handleDispatchNav = () => {
    const plate =
      selectedVehicle?.plate || selectedVehicle?.bien_so || "Xe IoT";
    const targetStop =
      selectedVehicle?.nearestRestStop?.name || "Trạm Tiên Hiệp (Km 185)";
    dispatchVehicleToRestStop({
      vehiclePlate: plate,
      restStopName: targetStop,
    });
    toast.success(
      `Đã gửi điều hướng vào [${targetStop}] tới Cabin xe ${plate}!`,
      {
        duration: 4500,
        icon: "📍",
      },
    );
  };

  return (
    <div className="animate-fade-in-up space-y-5 font-sans">
      {/* 1. Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-brand-text-primary text-2xl font-black tracking-tight">
            Giám sát Thời gian thực & Điều phối Đội xe
          </h1>
          <p className="text-brand-text-muted text-xs">
            Dữ liệu Edge Telemetry trực tiếp qua Leaflet Maps & IoT WebSockets
          </p>
        </div>
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
            isSimulating
              ? "border border-emerald-500/40 bg-emerald-950/60 text-emerald-400 shadow-sm"
              : "border-brand-border bg-brand-dark/80 text-brand-text-muted border"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isSimulating && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                isSimulating ? "bg-emerald-500" : "bg-slate-500"
              }`}
            ></span>
          </span>
          <span>
            {isSimulating ? "GPS Telemetry: LIVE" : "Tạm dừng giả lập"}
          </span>
        </button>
      </div>

      {/* 2. Cụm thẻ KPI */}
      <MapKpiStats stats={stats} />

      {/* 3. Bản đồ (Trái) & Bảng điều phối (Phải) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <LeafletMapView
          vehicles={fleet}
          selectedVehicle={selectedVehicle}
          onSelectVehicle={handleSelectVehicle}
          mapInstanceRef={mapInstanceRef}
        />

        <VehicleDispatchPanel
          vehicle={selectedVehicle}
          countdownText={formatCountdown(selectedVehicle?.remainingSeconds)}
          onDispatchNav={handleDispatchNav}
          onOpenCallModal={() => setShowCallModal(true)}
          onOpenVideoModal={() => setShowVideoModal(true)}
        />
      </div>

      {/* 4. Modals */}
      <EvidenceVideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        vehicle={selectedVehicle}
      />
      <EmergencyCallModal
        isOpen={showCallModal}
        onClose={() => setShowCallModal(false)}
        vehicle={selectedVehicle}
      />
    </div>
  );
}
