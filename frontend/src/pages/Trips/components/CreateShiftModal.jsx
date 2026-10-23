import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { mockDrivers, mockRoutes, mockVehicles } from "../../../mock/mockData";

export default function CreateShiftModal({ isOpen, onClose, onAddShift }) {
  const [driverId, setDriverId] = useState(mockDrivers[0]?.id || 1);
  const [vehicleId, setVehicleId] = useState(mockVehicles[0]?.id || 101);
  const [routeId, setRouteId] = useState(mockRoutes[0]?.id || 301);
  const [startTime, setStartTime] = useState("2026-10-23T13:30"); // Mặc định vào đầu giờ chiều để test cảnh báo
  const [durationHours, setDurationHours] = useState(4);
  const [overrideReason, setOverrideReason] = useState("");

  if (!isOpen) return null;

  // 1. Kiểm tra đối soát Smart Scheduling theo thời gian thực
  const selectedDriver = mockDrivers.find((d) => d.id === Number(driverId));
  const selectedVehicle = mockVehicles.find((v) => v.id === Number(vehicleId));
  const selectedRoute = mockRoutes.find((r) => r.id === Number(routeId));

  const driverScore = selectedDriver?.diem_uy_tin ?? 100;
  const isDriverSuspended =
    driverScore <= 20 || selectedDriver?.cap_canh_bao === "SUSPENDED_RED";
  const isVehicleMaintenance = selectedVehicle?.trang_thai === "MAINTENANCE";

  // Ràng buộc cứng (HARD_BLOCK)
  const isHardBlocked = isDriverSuspended || isVehicleMaintenance;

  // Cảnh báo giờ yếu sinh học (13:00 - 15:00)
  const startHour = new Date(startTime).getHours();
  const isWeakHour = startHour >= 12 && startHour <= 15;

  // Cảnh báo ca dài (SOFT_WARNING)
  const isLongDuration = durationHours >= 5;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isHardBlocked) {
      toast.error(
        "Không thể lưu ca do vi phạm quy tắc an toàn cứng (HARD_BLOCK)!",
      );
      return;
    }

    if ((isLongDuration || isWeakHour) && !overrideReason.trim()) {
      toast.error(
        "Vui lòng nhập lý do ghi đè (Override) cho ca chạy đặc biệt này!",
      );
      return;
    }

    const startISO = new Date(startTime).toISOString();
    const endISO = new Date(
      new Date(startTime).getTime() + durationHours * 3600000,
    ).toISOString();

    const alerts = [];
    if (isWeakHour) {
      alerts.push({
        level: "NOTICE",
        message: "Giao thoa khung giờ yếu sinh học (13h-15h)",
      });
    }
    if (isLongDuration) {
      alerts.push({
        level: "SOFT_WARNING",
        message: `Thời lượng ca (${durationHours}h) vượt mức khuyến nghị`,
      });
    }

    const newShift = {
      id: Date.now(),
      driver_id: Number(driverId),
      vehicle_id: Number(vehicleId),
      route_id: Number(routeId),
      thoi_gian_bat_dau_du_kien: startISO,
      thoi_gian_ket_thuc_du_kien: endISO,
      trang_thai: "SCHEDULED",
      canh_bao_khi_tao: alerts,
      ly_do_override: overrideReason,
      driver: selectedDriver,
      vehicle: selectedVehicle,
      route: selectedRoute,
    };

    onAddShift(newShift);
    toast.success(
      `Đã phân ca #${newShift.id} thành công cho tài xế ${selectedDriver?.user?.ho_ten}!`,
      {
        icon: "📋",
      },
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl">
        {/* Header Modal */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="border-brand-primary/40 bg-brand-blue-night text-brand-blue-sky flex h-9 w-9 items-center justify-center rounded-xl border">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-brand-text-primary text-sm font-bold">
                Lập Ca Phân Công Mới
              </h3>
              <p className="text-brand-text-muted text-[11px]">
                Hệ thống kiểm tra Smart Scheduling tự động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted rounded-full p-1 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Lập Ca */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6 text-xs">
          {/* CHỌN TÀI XẾ */}
          <div>
            <label className="text-brand-text-primary mb-1 block font-bold">
              Tài xế nhận ca <span className="text-red-500">*</span>
            </label>
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="border-brand-border bg-brand-dark text-brand-text-primary w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
            >
              {mockDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.user?.ho_ten} — Điểm uy tín: {d.diem_uy_tin}/100{" "}
                  {d.diem_uy_tin <= 20 ? "(ĐÌNH CHỈ)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* CHỌN PHƯƠNG TIỆN & TUYẾN ĐƯỜNG */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Phương tiện
              </label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="border-brand-border bg-brand-dark text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              >
                {mockVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.bien_so_xe} (
                    {v.trang_thai === "MAINTENANCE" ? "BẢO DƯỠNG" : v.loai_xe})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Lộ trình tuyến
              </label>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="border-brand-border bg-brand-dark text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              >
                {mockRoutes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.ten_tuyen} ({r.khoang_cach_km} km)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* THỜI GIAN KHỞI HÀNH & THỜI LƯỢNG */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Giờ xuất phát dự kiến
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="border-brand-border bg-brand-dark/90 text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Thời lượng dự kiến (Giờ)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="border-brand-border bg-brand-dark/90 text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>

          {/* KHU VỰC HIỂN THỊ CẢNH BÁO SMART SCHEDULING */}
          {isHardBlocked ? (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-3.5 text-rose-300">
              <div className="flex items-center gap-2 font-bold">
                <AlertOctagon className="h-4 w-4 shrink-0 text-rose-400" />
                <span>CHẶN CỨNG (HARD_BLOCK - HTTP 422)</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed">
                {isDriverSuspended
                  ? `Tài xế ${selectedDriver?.user?.ho_ten} đang bị đình chỉ (Điểm: ${driverScore} <= 20). Không thể giao ca!`
                  : `Xe ${selectedVehicle?.bien_so_xe} đang trong xưởng bảo dưỡng!`}
              </p>
            </div>
          ) : isWeakHour || isLongDuration ? (
            <div className="space-y-2 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-amber-300">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>CẢNH BÁO THỂ TRẠNG SINH HỌC (SOFT_WARNING)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isWeakHour &&
                  "• Ca chạy giao thoa với khung giờ yếu sinh học (13:00 - 15:00). "}
                {isLongDuration &&
                  `• Thời lượng ca (${durationHours}h) vượt mức khuyến nghị.`}
              </p>
              <div>
                <label className="mb-1 block text-[11px] font-bold text-amber-200">
                  Nhập lý do ghi đè (Bắt buộc theo SRS 4.1):
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Đã bố trí tài xế phụ đổi lái tại trạm dừng Tam Kỳ..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="bg-brand-dark w-full rounded-lg border border-amber-500/40 px-3 py-1.5 text-xs text-white outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Lịch phân ca hoàn toàn phù hợp với Hồ sơ sinh học của tài xế.
              </span>
            </div>
          )}

          {/* NÚT SUBMIT */}
          <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-end gap-2.5 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border-brand-border bg-brand-surface text-brand-text-muted rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isHardBlocked}
              className="bg-brand-primary hover:bg-brand-primary-hover flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Xác nhận Lập ca</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
