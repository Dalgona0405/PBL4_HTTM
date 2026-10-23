import {
  AlertOctagon,
  HeartPulse,
  Route,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function ExecutiveKpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Tỷ lệ an toàn toàn đội */}
      <div className="card-glass border-brand-border flex flex-col justify-between rounded-3xl border p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-brand-text-muted text-xs font-bold tracking-wider uppercase">
            Chỉ số An toàn Toàn đội
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <p className="text-brand-text-primary text-3xl font-black">94.8%</p>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <TrendingUp className="mr-0.5 h-3 w-3" /> +2.4%
            </span>
          </div>
          <p className="text-brand-text-subtle mt-1 text-[11px]">
            Đạt chuẩn ISO-39001 về An toàn Giao thông
          </p>
        </div>
      </div>

      {/* 2. Tổng số km giám sát */}
      <div className="card-glass border-brand-border flex flex-col justify-between rounded-3xl border p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-brand-text-muted text-xs font-bold tracking-wider uppercase">
            Tổng Quãng đường Giám sát
          </p>
          <div className="border-brand-primary/30 bg-brand-blue-night/60 text-brand-blue-light flex h-9 w-9 items-center justify-center rounded-xl border">
            <Route className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-brand-text-primary text-3xl font-black">18,450</p>
          <p className="text-brand-text-subtle mt-1 text-[11px]">
            Kilomet lăn bánh qua IoT Telemetry (Đà Nẵng & Miền Trung)
          </p>
        </div>
      </div>

      {/* 3. Số vụ can thiệp rủi ro thành công */}
      <div className="card-glass flex flex-col justify-between rounded-3xl border border-amber-500/30 bg-amber-950/15 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-amber-400 uppercase">
            Can thiệp Rủi ro Tức thì
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/20 text-amber-400">
            <HeartPulse className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-amber-300">42</p>
            <span className="text-xs font-bold text-amber-400/90">vụ việc</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-200/70">
            Kích hoạt còi buồng lái & nhắc tấp trạm nghỉ kịp thời
          </p>
        </div>
      </div>

      {/* 4. Tài xế cần can thiệp / đình chỉ */}
      <div className="card-glass flex flex-col justify-between rounded-3xl border border-rose-500/30 bg-rose-950/15 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold tracking-wider text-rose-400 uppercase">
            Tài xế Diện Giám sát
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/20 text-rose-400">
            <AlertOctagon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black text-rose-400">01</p>
            <span className="text-xs font-bold text-rose-300">
              Khóa đỏ (&le; 20đ)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-rose-200/70">
            Đang đình chỉ nhận ca &amp; chờ đào tạo lại an toàn
          </p>
        </div>
      </div>
    </div>
  );
}
