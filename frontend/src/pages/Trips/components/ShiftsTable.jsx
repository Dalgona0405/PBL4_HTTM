import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { safeParseJSON } from "../../../mock/mockData";

export default function ShiftsTable({ shifts = [], onSwitchToTripTab }) {
  // Chuẩn hóa ngôn ngữ nghiệp vụ phân ca theo góc nhìn BA
  const renderShiftStatusBadge = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/50 px-3 py-1 text-xs font-bold text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></span>
              Đang thực hiện
            </span>
            {onSwitchToTripTab && (
              <button
                onClick={onSwitchToTripTab}
                className="text-brand-blue-sky flex cursor-pointer items-center gap-0.5 text-[10px] font-semibold hover:text-white hover:underline"
              >
                <span>Theo dõi chuyến</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            )}
          </div>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Đã chốt ca (Sẵn sàng)
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-xs font-bold text-slate-300">
            <Clock className="h-3 w-3" /> Chờ tài xế nhận
          </span>
        );
      case "DECLINED":
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-950/50 px-3 py-1 text-xs font-bold text-rose-400">
            <XCircle className="h-3 w-3" /> Tài xế từ chối
          </span>
        );
      default:
        return (
          <span className="border-brand-border bg-brand-surface text-brand-text-muted rounded-full border px-2.5 py-1 text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-brand-border-dark bg-brand-dark/70 text-brand-text-muted border-b text-xs font-bold tracking-wider uppercase">
              <th className="rounded-tl-2xl px-4 py-4">Mã ca</th>
              <th className="px-4 py-4">Tài xế &amp; Phương tiện</th>
              <th className="px-4 py-4">Lộ trình tuyến đường</th>
              <th className="px-4 py-4">Khung giờ kế hoạch</th>
              <th className="px-4 py-4">Cảnh báo Smart Scheduling</th>
              <th className="rounded-tr-2xl px-4 py-4 text-center">
                Trạng thái kế hoạch
              </th>
            </tr>
          </thead>
          <tbody className="divide-brand-border-dark/60 divide-y">
            {shifts.map((shift) => {
              const driverName =
                shift.driver?.user?.ho_ten || shift.driver?.ho_ten || "Tài xế";
              const plate =
                shift.vehicle?.bien_so_xe || shift.vehicle?.bien_so || "Xe IoT";
              const vehicleModel = shift.vehicle?.loai_xe || "Xe tải";
              const routeName = shift.route?.ten_tuyen || "Tuyến đường chính";
              const distance = shift.route?.khoang_cach_km || 100;
              const alerts =
                safeParseJSON(shift.canh_bao_khi_tao, shift.canh_bao_khi_tao) ||
                [];

              return (
                <tr
                  key={shift.id}
                  className="hover:bg-brand-surface/80 transition-colors"
                >
                  {/* Mã ca */}
                  <td className="text-brand-blue-sky px-4 py-4 text-xs font-bold">
                    #{shift.id}
                  </td>

                  {/* Tài xế & Xe */}
                  <td className="px-4 py-4">
                    <p className="text-brand-text-primary text-xs font-bold">
                      {driverName}
                    </p>
                    <p className="text-brand-text-subtle text-[11px]">
                      {plate} •{" "}
                      <span className="font-sans">{vehicleModel}</span>
                    </p>
                  </td>

                  {/* Tuyến đường */}
                  <td className="px-4 py-4">
                    <p className="text-brand-text-secondary text-xs font-semibold">
                      {routeName}
                    </p>
                    <p className="text-brand-text-subtle text-[11px]">
                      {distance} km
                    </p>
                  </td>

                  {/* Thời gian dự kiến */}
                  <td className="px-4 py-4 text-xs">
                    <div className="text-brand-text-secondary">
                      Bắt đầu:{" "}
                      <span className="font-bold text-white">
                        {new Date(
                          shift.thoi_gian_bat_dau_du_kien,
                        ).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-brand-text-muted mt-0.5">
                      Kết thúc:{" "}
                      <span>
                        {new Date(
                          shift.thoi_gian_ket_thuc_du_kien,
                        ).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Cảnh báo Smart Scheduling */}
                  <td className="px-4 py-4">
                    {alerts.length > 0 ? (
                      <div className="flex max-w-xs flex-col gap-1.5">
                        {alerts.map((al, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2 py-1 text-[11px] font-medium text-amber-300"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                            <span>{al.message || al.ly_do}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-alert-safe inline-flex items-center gap-1 text-xs font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Phù hợp thể
                        trạng
                      </span>
                    )}
                  </td>

                  {/* Trạng thái Kế hoạch phân ca */}
                  <td className="px-4 py-4 text-center">
                    {renderShiftStatusBadge(shift.trang_thai)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
