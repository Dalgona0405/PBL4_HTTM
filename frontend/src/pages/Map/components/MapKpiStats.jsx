import { AlertTriangle, Flame, ShieldCheck, Truck } from "lucide-react";

export default function MapKpiStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Xe đang chạy */}
      <div className="card-glass border-brand-border flex items-center gap-3.5 rounded-2xl border p-3.5 shadow-lg">
        <div className="bg-brand-blue-night/60 text-brand-blue-light border-brand-primary/30 flex h-11 w-11 items-center justify-center rounded-xl border">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-brand-text-muted text-[11px] font-semibold">
            Xe đang lăn bánh
          </p>
          <p className="text-brand-text-primary text-lg font-black">
            {stats.activeVehicles}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              xe IoT
            </span>
          </p>
        </div>
      </div>

      {/* 2. Báo động đỏ Microsleep */}
      <div className="card-glass border-alert-danger/40 flex items-center gap-3.5 rounded-2xl border bg-rose-950/20 p-3.5 shadow-lg shadow-rose-950/30">
        <div className="bg-alert-danger/20 text-alert-danger border-alert-danger/40 flex h-11 w-11 items-center justify-center rounded-xl border">
          <Flame className="h-5 w-5 animate-pulse" />
        </div>
        <div>
          <p className="text-alert-danger text-[11px] font-bold tracking-wider uppercase">
            Ngủ gật (Microsleep)
          </p>
          <p className="text-brand-text-primary text-lg font-black">
            {String(stats.microsleepAlerts).padStart(2, "0")}{" "}
            <span className="text-alert-danger text-xs font-semibold">
              Cần can thiệp
            </span>
          </p>
        </div>
      </div>

      {/* 3. Cảnh báo mệt mỏi */}
      <div className="card-glass border-alert-warning/40 flex items-center gap-3.5 rounded-2xl border bg-amber-950/20 p-3.5 shadow-lg shadow-amber-950/30">
        <div className="bg-alert-warning/20 text-alert-warning border-alert-warning/40 flex h-11 w-11 items-center justify-center rounded-xl border">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-alert-warning text-[11px] font-bold tracking-wider uppercase">
            Cảnh báo mệt mỏi
          </p>
          <p className="text-brand-text-primary text-lg font-black">
            {String(stats.fatigueWarnings).padStart(2, "0")}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              xe ngáp/CO2
            </span>
          </p>
        </div>
      </div>

      {/* 4. Trạng thái an toàn */}
      <div className="card-glass border-brand-border flex items-center gap-3.5 rounded-2xl border p-3.5 shadow-lg">
        <div className="text-alert-safe flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-brand-text-muted text-[11px] font-semibold">
            Tình trạng bình thường
          </p>
          <p className="text-brand-text-primary text-lg font-black">
            {stats.normalVehicles}{" "}
            <span className="text-brand-text-subtle text-xs font-normal">
              xe an toàn
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
