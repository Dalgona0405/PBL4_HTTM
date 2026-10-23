import { Cpu, PlayCircle, Truck, Wrench } from "lucide-react";

export default function VehiclesKpiCards({ vehicles = [] }) {
  const totalVehicles = vehicles.length;
  const inUseCount = vehicles.filter(
    (v) => v.trang_thai === "IN_USE" || v.trang_thai === "DANG_CHAY",
  ).length;
  const maintenanceCount = vehicles.filter(
    (v) => v.trang_thai === "MAINTENANCE" || v.trang_thai === "BAO_DUONG",
  ).length;
  const warningDeviceCount = vehicles.filter(
    (v) =>
      v.iot_device?.trang_thai_ket_noi === "ERROR_CAMERA" ||
      v.iot_device?.trang_thai_ket_noi === "OFFLINE" ||
      (v.iot_device?.cpu_temp_c && v.iot_device.cpu_temp_c >= 70),
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Tổng số phương tiện */}
      <div className="card-glass border-brand-border flex items-center gap-3.5 rounded-3xl border p-4 shadow-lg">
        <div className="border-brand-primary/30 bg-brand-blue-night/60 text-brand-blue-light flex h-11 w-11 items-center justify-center rounded-2xl border">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-brand-text-muted text-[11px] font-semibold">
            Tổng phương tiện
          </p>
          <p className="text-brand-text-primary text-xl font-black">
            {totalVehicles}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              xe
            </span>
          </p>
        </div>
      </div>

      {/* 2. Đang vận hành */}
      <div className="card-glass flex items-center gap-3.5 rounded-3xl border border-emerald-500/30 bg-emerald-950/15 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
          <PlayCircle className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-400">Đang lăn bánh</p>
          <p className="text-brand-text-primary text-xl font-black">
            {inUseCount}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              xe trên đường
            </span>
          </p>
        </div>
      </div>

      {/* 3. Đang bảo dưỡng (Chặn xếp ca) */}
      <div className="card-glass flex items-center gap-3.5 rounded-3xl border border-amber-500/30 bg-amber-950/15 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/40 text-amber-400">
          <Wrench className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-400">Đang bảo dưỡng</p>
          <p className="text-brand-text-primary text-xl font-black">
            {maintenanceCount}{" "}
            <span className="text-[10px] font-semibold text-amber-300">
              (Khóa xếp ca)
            </span>
          </p>
        </div>
      </div>

      {/* 4. Cảnh báo Edge IoT */}
      <div className="card-glass flex items-center gap-3.5 rounded-3xl border border-rose-500/30 bg-rose-950/15 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-rose-400">IoT Cần chú ý</p>
          <p className="text-brand-text-primary text-xl font-black">
            {warningDeviceCount}{" "}
            <span className="text-xs font-semibold text-rose-300">
              thiết bị nóng/lỗi
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
