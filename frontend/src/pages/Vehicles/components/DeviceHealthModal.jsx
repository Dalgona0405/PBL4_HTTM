import {
  Cpu,
  HardDrive,
  Radio,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DeviceHealthModal({ isOpen, onClose, vehicle }) {
  if (!isOpen || !vehicle) return null;

  const iot = vehicle.iot_device || vehicle.iotDevice;
  const plate = vehicle.bien_so_xe || vehicle.bien_so;
  const cpuTemp = iot?.cpu_temp_c || 64.5;
  const isOverheat = cpuTemp >= 70;

  const handleRebootDevice = () => {
    toast.success(`Đã gửi lệnh MQTT [REBOOT] xuống thiết bị xe ${plate}!`, {
      icon: "🔄",
      duration: 3500,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl">
        {/* Header Modal */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="border-brand-primary/40 bg-brand-blue-night text-brand-blue-sky flex h-9 w-9 items-center justify-center rounded-xl border">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-brand-text-primary text-sm font-bold">
                Sức khỏe Phần cứng IoT Edge — Xe {plate}
              </h3>
              <p className="text-brand-text-muted text-[11px]">
                Mã CPU: {iot?.cpu_serial || "10000000a1b2c3d4"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted rounded-full p-1 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung chi tiết các cảm biến */}
        <div className="space-y-4 p-6">
          <div className="grid grid-cols-2 gap-3">
            {/* Nhiệt độ CPU Pi 4 */}
            <div
              className={`rounded-2xl border p-3.5 ${
                isOverheat
                  ? "border-rose-500/40 bg-rose-950/20 text-rose-400"
                  : "border-brand-border-dark bg-brand-dark/70 text-emerald-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-brand-text-muted flex items-center gap-1.5 text-xs">
                  <Thermometer className="h-4 w-4" /> Nhiệt độ CPU
                </span>
                <span className="text-[10px] font-bold">
                  {isOverheat ? "Nóng" : "Ổn định"}
                </span>
              </div>
              <p className="mt-2 text-2xl font-black">{cpuTemp}°C</p>
              <p className="text-brand-text-subtle mt-1 text-[10px]">
                Ngưỡng tối đa an toàn: &lt; 75°C (SRS NFR_7)
              </p>
            </div>

            {/* Dung lượng thẻ nhớ / SSD */}
            <div className="border-brand-border-dark bg-brand-dark/70 rounded-2xl border p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-brand-text-muted flex items-center gap-1.5 text-xs">
                  <HardDrive className="text-brand-blue-sky h-4 w-4" /> Dung
                  lượng trống
                </span>
                <span className="text-alert-safe text-[10px] font-bold">
                  Trống 72%
                </span>
              </div>
              <p className="text-brand-text-primary mt-2 text-2xl font-black">
                {iot?.free_storage_mb
                  ? (iot.free_storage_mb / 1024).toFixed(1)
                  : "24.5"}{" "}
                GB
              </p>
              <p className="text-brand-text-subtle mt-1 text-[10px]">
                Lưu trữ video 10s & SQLite offline
              </p>
            </div>
          </div>

          {/* Trạng thái các mạch con */}
          <div className="border-brand-border-dark bg-brand-dark/50 space-y-2.5 rounded-2xl border p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-brand-text-muted flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-emerald-400" /> Kết nối MQTT
                Telemetry (QoS 1)
              </span>
              <span className="font-bold text-emerald-400">ONLINE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-text-muted flex items-center gap-1.5">
                <ShieldCheck className="text-brand-blue-sky h-3.5 w-3.5" /> Mô
                hình Edge AI
              </span>
              <span className="font-semibold text-slate-300">
                {iot?.ai_model_version || "yolo26n-v1.1 (15-20 FPS)"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-text-muted">
                Cảm biến chất lượng khí
              </span>
              <span className="font-semibold text-emerald-400">
                MQ-135 Sẵn sàng
              </span>
            </div>
          </div>
        </div>

        {/* Nút thao tác điều khiển thiết bị */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-end gap-2.5 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="border-brand-border bg-brand-surface text-brand-text-muted rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:text-white"
          >
            Đóng
          </button>
          <button
            onClick={handleRebootDevice}
            className="border-brand-primary/40 bg-brand-blue-night flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-600 active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Khởi động lại Pi 4</span>
          </button>
        </div>
      </div>
    </div>
  );
}
