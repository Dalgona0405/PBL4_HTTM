import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lock,
  Unlock,
} from "lucide-react";
import { useEffect, useState } from "react";
import dataService from "../../../services/dataService";

export default function DriversTable({
  drivers = [],
  onOpenProfileModal,
  onToggleDriverStatus,
}) {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    dataService.getShifts().then((data) => setShifts(data || []));
  }, [drivers]);

  const getActiveVehiclePlate = (driver) => {
    const activeShift = shifts.find(
      (s) =>
        (s.driver_id === driver.id ||
          s.driver?.id === driver.id ||
          s.driver?.user_id === driver.user_id) &&
        (s.trang_thai === "IN_PROGRESS" || s.trang_thai === "SCHEDULED"),
    );
    return activeShift?.vehicle?.bien_so_xe || driver.xe_hien_tai || null;
  };

  const renderAlertBadge = (score, alertLevel) => {
    if (score <= 20 || alertLevel === "SUSPENDED_RED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/60 px-3 py-1 text-xs font-bold text-rose-300">
          <span className="h-2 w-2 animate-ping rounded-full bg-rose-500"></span>
          Đình chỉ
        </span>
      );
    }
    if (score <= 65 || alertLevel === "WARNING_YELLOW") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-300">
          <AlertTriangle className="h-3 w-3" /> Cảnh cáo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Bình thường
      </span>
    );
  };

  return (
    <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-brand-border-dark bg-brand-dark/70 text-brand-text-muted border-b text-xs font-bold tracking-wider uppercase">
              <th className="rounded-tl-2xl px-4 py-4">Tài xế</th>
              <th className="px-4 py-4">Bằng lái</th>
              <th className="px-4 py-4">Xe ca hiện tại</th>
              <th className="px-4 py-4 text-center">Điểm uy tín (Ledger)</th>
              <th className="px-4 py-4">Cấp an toàn</th>
              <th className="rounded-tr-2xl px-4 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-brand-border-dark/60 divide-y">
            {drivers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-brand-text-subtle py-12 text-center text-xs"
                >
                  Không tìm thấy tài xế nào phù hợp
                </td>
              </tr>
            ) : (
              drivers.map((driver) => {
                const name = driver.user?.ho_ten || driver.ho_ten || "Tài xế";
                const phone = driver.user?.so_dien_thoai || driver.sdt || "--";
                const licenseGrade =
                  driver.hang_bang_lai || driver.bang_lai || "FC";
                const licenseNo = driver.so_bang_lai || `FC-${driver.id}009988`;
                const score =
                  driver.diem_uy_tin !== undefined
                    ? driver.diem_uy_tin
                    : driver.uy_tin || 100;
                const alertLevel = driver.cap_canh_bao;
                const isSuspended =
                  score <= 20 || alertLevel === "SUSPENDED_RED";
                const activePlate = getActiveVehiclePlate(driver);

                return (
                  <tr
                    key={driver.id}
                    className="hover:bg-brand-surface/80 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="border-brand-primary/40 bg-brand-blue-night text-brand-blue-sky flex h-10 w-10 items-center justify-center rounded-2xl border font-bold shadow-xs">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-brand-text-primary text-xs font-bold">
                            {name}
                          </p>
                          <p className="text-brand-text-subtle text-[11px]">
                            {phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-brand-text-primary text-xs font-bold">
                        Hạng {licenseGrade}
                      </p>
                      <p className="text-brand-text-subtle text-[10px]">
                        {licenseNo}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {activePlate ? (
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
                          <span className="border-brand-border bg-brand-dark text-brand-text-primary rounded-lg border px-2.5 py-1 text-xs font-bold">
                            {activePlate}
                          </span>
                        </div>
                      ) : (
                        <span className="border-brand-border-dark bg-brand-surface/40 text-brand-text-subtle rounded-lg border px-2.5 py-1 text-xs italic">
                          Đang nghỉ
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`text-base font-black ${
                          score > 80
                            ? "text-emerald-400"
                            : score > 65
                              ? "text-brand-blue-sky"
                              : score > 20
                                ? "text-amber-400"
                                : "text-rose-400"
                        }`}
                      >
                        {score}
                      </span>
                      <span className="text-brand-text-subtle text-xs">
                        /100
                      </span>
                      <div className="bg-brand-dark mx-auto mt-1 h-1.5 w-16 overflow-hidden rounded-full">
                        <div
                          className={`h-full ${
                            score > 65
                              ? "bg-emerald-500"
                              : score > 20
                                ? "bg-amber-500"
                                : "bg-rose-500"
                          }`}
                          style={{ width: `${Math.max(5, score)}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {renderAlertBadge(score, alertLevel)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => onOpenProfileModal(driver)}
                        className="text-brand-blue-sky hover:text-brand-primary mr-3 inline-flex cursor-pointer items-center gap-1 text-xs font-bold hover:underline"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Hồ sơ & Sổ cái</span>
                      </button>
                      <button
                        onClick={() => onToggleDriverStatus(driver)}
                        className={`inline-flex cursor-pointer items-center gap-1 text-xs font-bold hover:underline ${
                          isSuspended
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-rose-400 hover:text-rose-300"
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Unlock className="h-3.5 w-3.5" />
                            <span>Mở khóa</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>Đình chỉ</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
