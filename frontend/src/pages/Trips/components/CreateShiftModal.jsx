import {
  AlertOctagon,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Plus,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import SelectField from "../../../components/common/SelectField";
import dataService from "../../../services/dataService";

export default function CreateShiftModal({ isOpen, onClose, onAddShift }) {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [startTime, setStartTime] = useState("2026-10-23T13:30");
  const [durationHours, setDurationHours] = useState(4);
  const [overrideReason, setOverrideReason] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const fetchOptions = async () => {
      const [dList, vList, rList] = await Promise.all([
        dataService.getDrivers(),
        dataService.getVehicles(),
        dataService.getRoutes(),
      ]);
      setDrivers(dList);
      setVehicles(vList);
      setRoutes(rList);
      if (dList.length) setDriverId(dList[0].id);
      if (vList.length) setVehicleId(vList[0].id);
      if (rList.length) setRouteId(rList[0].id);
    };
    fetchOptions();
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedDriver = drivers.find((d) => d.id === Number(driverId));
  const selectedVehicle = vehicles.find((v) => v.id === Number(vehicleId));
  const selectedRoute = routes.find((r) => r.id === Number(routeId));
  const driverScore = selectedDriver?.diem_uy_tin ?? 100;
  const isDriverSuspended =
    driverScore <= 20 || selectedDriver?.cap_canh_bao === "SUSPENDED_RED";
  const isVehicleMaintenance = selectedVehicle?.trang_thai === "MAINTENANCE";
  const isHardBlocked = isDriverSuspended || isVehicleMaintenance;
  const startHour = new Date(startTime).getHours();
  const isWeakHour = startHour >= 12 && startHour <= 15;
  const isLongDuration = Number(durationHours) >= 5;

  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: `${d.user?.ho_ten || d.ho_ten} - Điểm uy tín: ${d.diem_uy_tin}/100 ${
      d.diem_uy_tin <= 20 ? "(ĐÌNH CHỈ)" : ""
    }`,
  }));

  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.bien_so_xe} (${
      v.trang_thai === "MAINTENANCE" ? "BẢO DƯỠNG" : v.loai_xe
    })`,
  }));

  const routeOptions = routes.map((r) => ({
    value: r.id,
    label: `${r.ten_tuyen} (${r.khoang_cach_km} km)`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isHardBlocked) {
      toast.error("Không thể phân ca do vi phạm quy tắc cứng (HARD_BLOCK)!");
      return;
    }
    if ((isLongDuration || isWeakHour) && !overrideReason.trim()) {
      toast.error("Bắt buộc nhập lý do ghi đè (Override)!");
      return;
    }

    const startISO = new Date(startTime).toISOString();
    const endISO = new Date(
      new Date(startTime).getTime() + durationHours * 3600000,
    ).toISOString();

    const alerts = [];
    if (isWeakHour)
      alerts.push({
        level: "NOTICE",
        message: "Giao thoa khung giờ yếu sinh học (13h-15h)",
      });
    if (isLongDuration)
      alerts.push({
        level: "SOFT_WARNING",
        message: `Ca dài (${durationHours}h) vượt mức khuyến nghị`,
      });

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
    toast.success(`Đã phân ca cho tài xế ${selectedDriver?.user?.ho_ten}!`, {
      icon: "📅",
    });
    setOverrideReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl">
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="border-brand-primary/40 bg-brand-blue-night text-brand-blue-sky flex h-9 w-9 items-center justify-center rounded-xl border">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-brand-text-primary text-sm font-bold">
                Lập Ca Phân Bổ Mới
              </h3>
              <p className="text-brand-text-muted text-[11px]">
                Hệ thống kiểm tra Smart Scheduling tự động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted cursor-pointer rounded-full p-1 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 text-xs">
          <SelectField
            label="Tài xế nhận ca"
            name="driverId"
            required
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            options={driverOptions}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Phương tiện"
              name="vehicleId"
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              options={vehicleOptions}
            />
            <SelectField
              label="Lộ trình tuyến"
              name="routeId"
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              options={routeOptions}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Giờ xuất phát"
              name="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <InputField
              label="Thời lượng dự kiến (Giờ)"
              name="durationHours"
              type="number"
              min={1}
              max={12}
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
            />
          </div>

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
                <span>CẢNH BÁO THÔNG MINH SINH HỌC (SOFT_WARNING)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {isWeakHour &&
                  "• Ca chạy giao thoa với khung giờ yếu sinh học (13:00 - 15:00). "}
                {isLongDuration &&
                  `• Thời lượng ca (${durationHours}h) vượt mức khuyến nghị.`}
              </p>
              <InputField
                label="Nhập lý do ghi đè (Bắt buộc theo SRS 4.1)"
                name="overrideReason"
                required
                placeholder="VD: Đổi tài trạm Tam Kỳ..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Lịch phân ca hoàn toàn phù hợp nhịp sinh học</span>
            </div>
          )}

          <div className="border-brand-border-dark flex items-center justify-end gap-2.5 border-t pt-4">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" disabled={isHardBlocked}>
              <Plus className="h-4 w-4" />
              <span>Xác nhận lập ca</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
