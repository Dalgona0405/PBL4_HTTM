import { AlertTriangle, ShieldAlert, ShieldCheck, Users } from "lucide-react";

export default function DriversKpiCards({ drivers = [] }) {
  const total = drivers.length;
  const normalCount = drivers.filter(
    (d) => d.cap_canh_bao === "NORMAL" || d.diem_uy_tin > 65,
  ).length;
  const warningCount = drivers.filter(
    (d) =>
      d.cap_canh_bao === "WARNING_YELLOW" ||
      (d.diem_uy_tin <= 65 && d.diem_uy_tin > 20),
  ).length;
  const suspendedCount = drivers.filter(
    (d) => d.cap_canh_bao === "SUSPENDED_RED" || d.diem_uy_tin <= 20,
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Tổng tài xế */}
      <div className="card-glass border-brand-border flex items-center gap-3.5 rounded-3xl border p-4 shadow-lg">
        <div className="border-brand-primary/30 bg-brand-blue-night/60 text-brand-blue-light flex h-11 w-11 items-center justify-center rounded-2xl border">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-brand-text-muted text-[11px] font-semibold">
            Tổng đội ngũ tài xế
          </p>
          <p className="text-brand-text-primary text-xl font-black">
            {total}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              tài xế
            </span>
          </p>
        </div>
      </div>

      {/* 2. An toàn chuẩn ISO (Xanh) */}
      <div className="card-glass flex items-center gap-3.5 rounded-3xl border border-emerald-500/30 bg-emerald-950/15 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-400">
            An toàn (&gt; 65đ)
          </p>
          <p className="text-brand-text-primary text-xl font-black">
            {normalCount}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              đủ điều kiện thưởng
            </span>
          </p>
        </div>
      </div>

      {/* 3. Cảnh cáo vàng */}
      <div className="card-glass flex items-center gap-3.5 rounded-3xl border border-amber-500/30 bg-amber-950/15 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/40 text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-amber-400">
            Cảnh cáo Vàng (&le; 65đ)
          </p>
          <p className="text-brand-text-primary text-xl font-black">
            {warningCount}{" "}
            <span className="text-[10px] font-semibold text-amber-300">
              (Giảm 30% ca đêm)
            </span>
          </p>
        </div>
      </div>

      {/* 4. Đình chỉ nhận ca (Khóa đỏ) */}
      <div className="card-glass flex items-center gap-3.5 rounded-3xl border border-rose-500/30 bg-rose-950/15 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
          <ShieldAlert className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-bold text-rose-400">
            Báo động Đỏ (&le; 20đ)
          </p>
          <p className="text-brand-text-primary text-xl font-black">
            {suspendedCount}{" "}
            <span className="text-xs font-semibold text-rose-300">
              đang bị đình chỉ
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
