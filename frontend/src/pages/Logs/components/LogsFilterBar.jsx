import { Search } from "lucide-react";

export default function LogsFilterBar({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  searchTerm,
  setSearchTerm,
}) {
  const statusTabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING_MANUAL_REVIEW", label: "Chờ duyệt tay" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "REJECTED", label: "Báo động giả / Bác bỏ" },
  ];

  return (
    <div className="card-glass border-brand-border flex flex-col justify-between gap-4 rounded-3xl border p-4 shadow-xl sm:flex-row sm:items-center">
      {/* Tabs trạng thái */}
      <div className="flex flex-wrap gap-1.5">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? "bg-brand-primary text-white shadow-md shadow-blue-500/25"
                : "border-brand-border-dark bg-brand-dark/70 text-brand-text-muted hover:border-brand-border border hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Lọc loại lỗi & Tìm kiếm */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border-brand-border bg-brand-dark text-brand-text-primary rounded-xl border px-3 py-2 text-xs outline-none"
        >
          <option value="ALL">Tất cả loại vi phạm</option>
          <option value="MICROSLEEP">Ngủ gật (Microsleep)</option>
          <option value="PHONE_DISTRACTION">Dùng điện thoại</option>
          <option value="HIGH_CO2">CO2 buồng lái cao</option>
          <option value="YAWNING_FATIGUE">Ngáp mệt mỏi</option>
          <option value="DEVICE_TAMPERING">Che / Rút cáp thiết bị</option>
        </select>

        <div className="relative w-full sm:w-60">
          <Search className="text-brand-text-subtle pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm tài xế, biển số xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-brand-border bg-brand-dark/90 text-brand-text-primary placeholder:text-brand-text-subtle focus:border-brand-primary w-full rounded-xl border py-2 pr-3 pl-9 text-xs transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}
