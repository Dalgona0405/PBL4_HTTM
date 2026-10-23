import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  FileVideo,
  PhoneCall,
  Wind,
  XCircle,
} from "lucide-react";

export default function LogsTable({ violations = [], onSelectViolation }) {
  // Render Badge 5 loại lỗi
  const renderViolationBadge = (typeCode) => {
    const code = String(typeCode || "").toUpperCase();
    if (code.includes("MICROSLEEP") || code.includes("BUON_NGU")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400"></span>
          Ngủ gật (Microsleep)
        </span>
      );
    }
    if (code.includes("PHONE") || code.includes("DIEN_THOAI")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-950/40 px-3 py-1 text-xs font-semibold text-orange-300">
          <PhoneCall className="h-3 w-3 text-orange-400" /> Dùng điện thoại
        </span>
      );
    }
    if (code.includes("CO2")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-950/40 px-3 py-1 text-xs font-semibold text-yellow-300">
          <Wind className="h-3 w-3 text-yellow-400" /> CO2 buồng lái cao
        </span>
      );
    }
    if (code.includes("YAWN") || code.includes("MET_MOI")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-300">
          <AlertTriangle className="h-3 w-3 text-amber-400" /> Ngáp mệt mỏi
        </span>
      );
    }
    if (code.includes("TAMPER") || code.includes("THIET_BI")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300">
          <Cpu className="h-3 w-3 text-purple-400" /> Che / Rút cáp thiết bị
        </span>
      );
    }
    return (
      <span className="border-brand-border bg-brand-surface text-brand-text-muted rounded-full border px-2.5 py-1 text-xs">
        {typeCode}
      </span>
    );
  };

  // Render Badge trạng thái xác thực
  const renderStatusBadge = (status, source) => {
    switch (status) {
      case "CONFIRMED":
      case "MANUALLY_CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {source === "AI" ? "AI Tự động duyệt" : "Đã xác nhận"}
          </span>
        );
      case "PENDING_MANUAL_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-300 shadow-xs shadow-amber-500/10">
            <span className="h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
            Chờ duyệt tay
          </span>
        );
      case "RESOLVED_SAFE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/50 px-3 py-1 text-xs font-bold text-blue-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Đã nghỉ ngơi kịp thời
          </span>
        );
      case "REJECTED":
      case "MANUALLY_REJECTED":
        return (
          <span className="bg-brand-surface/70 text-brand-text-subtle inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium">
            <XCircle className="h-3.5 w-3.5" /> Bác bỏ (False Alarm)
          </span>
        );
      default:
        return (
          <span className="border-brand-border bg-brand-dark text-brand-text-muted rounded-full border px-2.5 py-1 text-xs">
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
              <th className="rounded-tl-2xl px-4 py-4">Mã</th>
              <th className="px-4 py-4">Thời gian</th>
              <th className="px-4 py-4">Tài xế & Phương tiện</th>
              <th className="px-4 py-4">Hành vi phát hiện</th>
              <th className="px-4 py-4 text-center">Độ tin cậy AI</th>
              <th className="px-4 py-4 text-center">Mức trừ</th>
              <th className="px-4 py-4">Trạng thái</th>
              <th className="rounded-tr-2xl px-4 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-brand-border-dark/60 divide-y">
            {violations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-brand-text-subtle py-12 text-center text-xs"
                >
                  Không tìm thấy bản ghi vi phạm nào phù hợp
                </td>
              </tr>
            ) : (
              violations.map((v) => {
                const driverName =
                  v.driver?.user?.ho_ten || v.driver_name || "Lê Minh Tuấn";
                const vehiclePlate =
                  v.vehicle?.bien_so_xe ||
                  v.vehicle_plate ||
                  v.trip?.vehicle?.bien_so_xe ||
                  "43C-123.45";
                const eventTime =
                  v.thoi_gian_chot_vi_pham ||
                  v.thoi_gian_vi_pham ||
                  new Date().toISOString();
                const penalty =
                  v.diem_bi_tru !== undefined ? v.diem_bi_tru : v.diem_tru || 0;
                const status = v.trang_thai_xac_thuc || v.trang_thai;
                const score = v.ai_confidence_score;

                return (
                  <tr
                    key={v.id}
                    className="hover:bg-brand-surface/70 transition-colors"
                  >
                    {/* Mã vi phạm */}
                    <td className="text-brand-blue-sky px-4 py-4 text-xs font-bold">
                      #{v.id}
                    </td>

                    {/* Thời gian */}
                    <td className="px-4 py-4 text-xs">
                      <div className="text-brand-text-secondary font-medium">
                        {new Date(eventTime).toLocaleDateString("vi-VN")}
                      </div>
                      <div className="text-brand-text-subtle text-[11px]">
                        {new Date(eventTime).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Tài xế & Xe */}
                    <td className="px-4 py-4">
                      <p className="text-brand-text-primary text-xs font-bold">
                        {driverName}
                      </p>
                      <p className="text-brand-text-subtle text-[11px]">
                        {vehiclePlate} • Chuyến #
                        {v.trip_id || v.trip?.id || "501"}
                      </p>
                    </td>

                    {/* Hành vi phát hiện */}
                    <td className="px-4 py-4">
                      {renderViolationBadge(v.ma_loai || v.loai_vi_pham)}
                    </td>

                    {/* Độ tin cậy AI */}
                    <td className="px-4 py-4 text-center">
                      {score !== null && score !== undefined ? (
                        <div>
                          <span
                            className={`text-xs font-bold ${
                              score >= 0.85
                                ? "text-emerald-400"
                                : score >= 0.6
                                  ? "text-amber-400"
                                  : "text-rose-400"
                            }`}
                          >
                            {(score * 100).toFixed(0)}%
                          </span>
                          <div className="bg-brand-dark mx-auto mt-1 h-1.5 w-14 overflow-hidden rounded-full">
                            <div
                              className={`h-full ${
                                score >= 0.85
                                  ? "bg-emerald-500"
                                  : score >= 0.6
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                              }`}
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-brand-text-subtle text-xs italic">
                          Cảm biến
                        </span>
                      )}
                    </td>

                    {/* Mức điểm trừ */}
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`text-xs font-bold ${penalty > 0 ? "text-alert-danger" : "text-emerald-400"}`}
                      >
                        {penalty > 0 ? `-${penalty}` : "0"}
                      </span>
                    </td>

                    {/* Trạng thái xác thực */}
                    <td className="px-4 py-4">
                      {renderStatusBadge(status, v.nguon_quyet_dinh)}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => onSelectViolation(v)}
                        className="border-brand-border-active/40 bg-brand-surface/90 text-brand-blue-sky hover:border-brand-primary hover:bg-brand-primary inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all hover:text-white"
                      >
                        <FileVideo className="h-3.5 w-3.5" />
                        <span>Xem &amp; Thẩm định</span>
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
