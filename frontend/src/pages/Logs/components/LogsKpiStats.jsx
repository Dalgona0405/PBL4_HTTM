import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";

export default function LogsKpiStats({ violations = [] }) {
  const total = violations.length;
  const pendingCount = violations.filter(
    (v) => (v.trang_thai_xac_thuc || v.trang_thai) === "PENDING_MANUAL_REVIEW",
  ).length;
  const confirmedCount = violations.filter((v) => {
    const st = v.trang_thai_xac_thuc || v.trang_thai;
    return st === "CONFIRMED" || st === "MANUALLY_CONFIRMED";
  }).length;
  const rejectedCount = violations.filter((v) => {
    const st = v.trang_thai_xac_thuc || v.trang_thai;
    return (
      st === "REJECTED" || st === "MANUALLY_REJECTED" || st === "RESOLVED_SAFE"
    );
  }).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Tổng sự kiện ghi nhận */}
      <div className="card-glass border-brand-border flex flex-col justify-between rounded-3xl border p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="text-brand-text-muted text-xs font-bold tracking-wider uppercase">
            Tổng Sự kiện IoT
          </p>
          <div className="border-brand-primary/30 bg-brand-blue-night/60 text-brand-blue-sky flex h-9 w-9 items-center justify-center rounded-xl border">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-brand-text-primary text-3xl font-black">{total}</p>
          <p className="text-brand-text-subtle mt-1 text-[11px]">
            Thu thập từ Camera YOLO26 & Cảm biến buồng lái
          </p>
        </div>
      </div>

      {/* 2. Cần duyệt thủ công */}
      <div className="card-glass flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-lg shadow-amber-950/30">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-amber-400 uppercase">
            Cần Duyệt Thủ công
          </p>
          {pendingCount > 0 && (
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-amber-400"></span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black text-amber-300">{pendingCount}</p>
          <p className="mt-1 text-[11px] text-amber-200/70">
            Độ tin cậy 60% - 85% • Chờ Điều phối viên xem clip
          </p>
        </div>
      </div>

      {/* 3. Đã xác nhận & Trừ điểm */}
      <div className="card-glass flex flex-col justify-between rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-lg shadow-emerald-950/30">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
            Xác nhận Vi phạm
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/50 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-3xl font-black text-emerald-400">
            {confirmedCount}
          </p>
          <p className="mt-1 text-[11px] text-emerald-200/70">
            Đã đồng bộ trừ điểm uy tín vào sổ cái
          </p>
        </div>
      </div>

      {/* 4. Báo động giả / Bác bỏ */}
      <div className="card-glass border-brand-border-dark bg-brand-dark/60 flex flex-col justify-between rounded-3xl border p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="text-brand-text-muted text-xs font-bold tracking-wider uppercase">
            Báo động Giả (False Alarm)
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-400">
            <XCircle className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-brand-text-secondary text-3xl font-black">
            {rejectedCount}
          </p>
          <p className="text-brand-text-subtle mt-1 text-[11px]">
            Đã hủy bỏ hoặc tài xế nghỉ ngơi đúng hạn
          </p>
        </div>
      </div>
    </div>
  );
}
