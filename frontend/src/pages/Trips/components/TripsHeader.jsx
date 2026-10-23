import { CalendarClock, Plus, Route } from "lucide-react";

export default function TripsHeader({
  activeTab,
  setActiveTab,
  shiftCount,
  tripCount,
  onOpenCreateModal,
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-brand-text-primary text-2xl font-black tracking-tight">
          Điều phối Ca chạy &amp; Quản trị Chuyến đi
        </h1>
        <p className="text-brand-text-muted text-xs">
          Thuật toán Smart Scheduling đối soát nhịp sinh học và theo dõi thực
          tích lăn bánh
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Nút chuyển đổi 2 Tabs */}
        <div className="card-glass border-brand-border flex items-center gap-1 rounded-2xl border p-1 shadow-md">
          <button
            onClick={() => setActiveTab("SHIFTS")}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "SHIFTS"
                ? "bg-brand-primary text-white shadow-md shadow-blue-500/25"
                : "text-brand-text-muted hover:text-white"
            }`}
          >
            <CalendarClock className="h-4 w-4" />
            <span>Kế hoạch Phân ca ({shiftCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("TRIPS")}
            className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "TRIPS"
                ? "bg-brand-primary text-white shadow-md shadow-blue-500/25"
                : "text-brand-text-muted hover:text-white"
            }`}
          >
            <Route className="h-4 w-4" />
            <span>Chuyến đi Thực tế ({tripCount})</span>
          </button>
        </div>

        {/* Nút mở Modal Lập ca */}
        <button
          onClick={onOpenCreateModal}
          className="bg-brand-primary hover:bg-brand-primary-hover flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Lập ca phân công mới</span>
        </button>
      </div>
    </div>
  );
}
