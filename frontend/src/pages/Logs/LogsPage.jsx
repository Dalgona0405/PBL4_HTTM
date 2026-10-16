// src/pages/Logs/LogsPage.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getViolations, reviewViolation } from "../../mock";
import formatDateTime from "../../utils/formatDateTime";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Play,
  FileVideo,
  Wind,
  PhoneCall,
  Zap,
  Filter,
} from "lucide-react";

function LogsPage() {
  const [violations, setViolations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);

  // Load danh sách vi phạm khi mở trang
  useEffect(() => {
    setViolations(getViolations());
  }, []);

  // 1. Phù phép Huy hiệu loại vi phạm (Semantic Alert Badges)
  const getViolationBadge = (type) => {
    const raw = String(type || "").toUpperCase();

    if (raw.includes("BUON_NGU") || raw.includes("MICROSLEEP")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-1 text-xs font-semibold text-rose-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400"></span>
          Ngủ gật (Microsleep)
        </span>
      );
    }
    if (raw.includes("CO2")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-300">
          <Wind className="h-3 w-3 text-amber-400" />
          CO2 vượt ngưỡng
        </span>
      );
    }
    if (raw.includes("DIEN_THOAI") || raw.includes("PHONE")) {
      return (
        <span className="text-brand-blue-light inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1 text-xs font-semibold">
          <PhoneCall className="text-brand-blue-sky h-3 w-3" />
          Dùng điện thoại
        </span>
      );
    }
    if (raw.includes("MET_MOI") || raw.includes("NGAP")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300">
          <AlertTriangle className="h-3 w-3 text-purple-400" />
          Mệt mỏi / Ngáp
        </span>
      );
    }
    if (raw.includes("QUA_TOC_DO") || raw.includes("SPEED")) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-950/40 px-3 py-1 text-xs font-semibold text-orange-300">
          <Zap className="h-3 w-3 text-orange-400" />
          Quá tốc độ
        </span>
      );
    }
    return (
      <span className="border-brand-border bg-brand-surface text-brand-text-muted rounded-full border px-3 py-1 text-xs font-semibold">
        {type}
      </span>
    );
  };

  // 2. Huy hiệu Vòng đời xác thực 2 pha (SRS 3.2)
  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
      case "MANUALLY_CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã xác nhận
          </span>
        );
      case "REJECTED":
      case "MANUALLY_REJECTED":
        return (
          <span className="bg-brand-surface/70 text-brand-text-subtle inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium">
            <XCircle className="h-3.5 w-3.5" />
            Đã bác bỏ
          </span>
        );
      case "PENDING_MANUAL_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10">
            <span className="h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
            Chờ duyệt thủ công
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="text-brand-blue-sky inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/50 px-3 py-1 text-xs font-bold">
            <Clock className="h-3.5 w-3.5 animate-spin" />
            AI đang phân tích
          </span>
        );
      default:
        return (
          <span className="border-brand-border bg-brand-dark text-brand-text-muted rounded-full border px-3 py-1 text-xs">
            {status}
          </span>
        );
    }
  };

  // 3. Xử lý Phê duyệt / Bác bỏ (Flow xác thực)
  const handleUpdateStatus = (id, decision) => {
    try {
      const updatedViolation = reviewViolation({
        violationId: id,
        decision: decision,
        notes:
          decision === "CONFIRMED"
            ? "Điều phối viên xác nhận vi phạm qua clip video bằng chứng"
            : "Bỏ qua cảnh báo giả (False Alarm) sau khi rà soát video",
      });

      // Cập nhật lại state danh sách và modal hiện tại
      setViolations(getViolations());
      setSelectedViolation(updatedViolation);

      if (decision === "CONFIRMED") {
        toast.success(`Đã xác nhận vi phạm #${id} & tự động trừ điểm uy tín!`, {
          icon: "🚨",
        });
      } else {
        toast.success(`Đã đánh dấu cảnh báo giả cho sự kiện #${id}!`, {
          icon: "🛡️",
        });
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi duyệt vi phạm");
    }
  };

  // 4. Lọc danh sách theo tab và tìm kiếm
  const filteredViolations = violations.filter((v) => {
    if (statusFilter !== "ALL" && v.trang_thai !== statusFilter) return false;
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      const matchName = v.driver_name?.toLowerCase().includes(query);
      const matchPlate = v.vehicle_plate?.toLowerCase().includes(query);
      const matchId = String(v.id).includes(query);
      return matchName || matchPlate || matchId;
    }
    return true;
  });

  const pendingCount = violations.filter(
    (v) => v.trang_thai === "PENDING_MANUAL_REVIEW",
  ).length;
  const confirmedCount = violations.filter(
    (v) =>
      v.trang_thai === "CONFIRMED" || v.trang_thai === "MANUALLY_CONFIRMED",
  ).length;
  const rejectedCount = violations.filter(
    (v) => v.trang_thai === "REJECTED" || v.trang_thai === "MANUALLY_REJECTED",
  ).length;

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* HEADER TRANG */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-brand-text-primary text-2xl font-bold tracking-tight">
            Xác thực Vi phạm AI & Bằng chứng Telemetry
          </h2>
          <p className="text-brand-text-muted mt-1 text-sm">
            Hậu kiểm video 10 giây từ Edge AI, loại bỏ cảnh báo giả và ghi nhận
            điểm uy tín
          </p>
        </div>
      </div>

      {/* 4 CARDS THỐNG KÊ TỔNG QUAN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Tổng số */}
        <div className="card-glass border-brand-border rounded-2xl border p-5 shadow-lg">
          <p className="text-brand-text-subtle text-xs font-bold tracking-wider uppercase">
            Tổng số sự kiện
          </p>
          <p className="text-brand-text-primary mt-2 text-3xl font-black">
            {violations.length}
          </p>
          <p className="text-brand-text-muted mt-1 text-xs">
            Ghi nhận từ camera & cảm biến IoT
          </p>
        </div>

        {/* Card 2: Chờ duyệt thủ công */}
        <div className="card-glass rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 shadow-lg shadow-amber-500/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold tracking-wider text-amber-400 uppercase">
              Cần duyệt thủ công
            </p>
            {pendingCount > 0 && (
              <span className="h-2 w-2 animate-ping rounded-full bg-amber-400"></span>
            )}
          </div>
          <p className="mt-2 text-3xl font-black text-amber-400">
            {pendingCount}
          </p>
          <p className="mt-1 text-xs text-amber-300/70">
            Độ tin cậy nằm trong vùng 60% - 85%
          </p>
        </div>

        {/* Card 3: Đã xác nhận */}
        <div className="card-glass rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-lg shadow-emerald-500/5">
          <p className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
            Đã trừ điểm an toàn
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-400">
            {confirmedCount}
          </p>
          <p className="mt-1 text-xs text-emerald-300/70">
            Đã đồng bộ sang thẻ điểm tài xế
          </p>
        </div>

        {/* Card 4: Bác bỏ / False Alarm */}
        <div className="card-glass border-brand-border-dark bg-brand-dark/60 rounded-2xl border p-5 shadow-lg">
          <p className="text-brand-text-subtle text-xs font-bold tracking-wider uppercase">
            Cảnh báo giả (False Alarm)
          </p>
          <p className="text-brand-text-secondary mt-2 text-3xl font-black">
            {rejectedCount}
          </p>
          <p className="text-brand-text-muted mt-1 text-xs">
            Không trừ điểm uy tín tài xế
          </p>
        </div>
      </div>

      {/* BẢNG CHÍNH VÀ THANH CÔNG CỤ */}
      <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
        {/* THANH LỌC TABS & Ô TÌM KIẾM */}
        <div className="border-brand-border-dark mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "ALL", label: "Tất cả" },
              {
                key: "PENDING_MANUAL_REVIEW",
                label: `Chờ duyệt (${pendingCount})`,
              },
              { key: "CONFIRMED", label: `Đã xác nhận (${confirmedCount})` },
              { key: "REJECTED", label: `Từ chối (${rejectedCount})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  statusFilter === tab.key
                    ? "bg-brand-primary text-white shadow-md shadow-blue-500/25"
                    : "bg-brand-dark/60 text-brand-text-muted hover:bg-brand-surface hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm Dark Glass */}
          <div className="relative w-full sm:w-72">
            <Search className="text-brand-text-subtle pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tên tài xế, biển số, mã số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-brand-border bg-brand-dark/90 text-brand-text-primary placeholder:text-brand-text-subtle focus:border-brand-primary focus:bg-brand-surface focus:ring-brand-primary/40 w-full rounded-xl border py-2.5 pr-4 pl-10 text-xs transition-all outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* BẢNG DỮ LIỆU CẢNH BÁO */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-brand-border-dark bg-brand-dark/70 text-brand-text-muted border-b text-xs font-bold tracking-wider uppercase">
                <th className="rounded-tl-2xl px-4 py-4">Mã số</th>
                <th className="px-4 py-4">Thời gian</th>
                <th className="px-4 py-4">Tài xế & Xe</th>
                <th className="px-4 py-4">Hành vi phát hiện</th>
                <th className="px-4 py-4 text-center">Độ tin cậy AI</th>
                <th className="px-4 py-4 text-center">Mức phạt</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="rounded-tr-2xl px-4 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-brand-border-dark/60 divide-y">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-brand-text-subtle py-12 text-center"
                  >
                    Không tìm thấy bản ghi cảnh báo nào phù hợp
                  </td>
                </tr>
              ) : (
                filteredViolations.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-brand-surface/70 transition-colors"
                  >
                    {/* Mã số */}
                    <td className="text-brand-blue-sky px-4 py-4 font-mono font-bold">
                      #{v.id}
                    </td>

                    {/* Thời gian */}
                    <td className="px-4 py-4 text-xs">
                      <div className="text-brand-text-secondary font-medium">
                        {new Date(v.thoi_gian_vi_pham).toLocaleDateString(
                          "vi-VN",
                        )}
                      </div>
                      <div className="text-brand-text-subtle font-mono text-[11px]">
                        {new Date(v.thoi_gian_vi_pham).toLocaleTimeString(
                          "vi-VN",
                        )}
                      </div>
                    </td>

                    {/* Tài xế & Xe */}
                    <td className="px-4 py-4">
                      <p className="text-brand-text-primary font-bold">
                        {v.driver_name}
                      </p>
                      <p className="text-brand-text-subtle font-sans text-xs">
                        <span className="text-brand-text-secondary font-semibold">
                          {v.vehicle_plate}
                        </span>{" "}
                        • Ca #{v.trip_id}
                      </p>
                    </td>

                    {/* Hành vi vi phạm */}
                    <td className="px-4 py-4">
                      {getViolationBadge(v.loai_vi_pham)}
                    </td>

                    {/* Độ tin cậy AI */}
                    <td className="px-4 py-4 text-center">
                      {v.ai_confidence_score ? (
                        <div>
                          <span
                            className={`font-mono text-xs font-bold ${
                              v.ai_confidence_score >= 0.85
                                ? "text-emerald-400"
                                : v.ai_confidence_score >= 0.6
                                  ? "text-amber-400"
                                  : "text-rose-400"
                            }`}
                          >
                            {(v.ai_confidence_score * 100).toFixed(0)}%
                          </span>
                          <div className="bg-brand-dark mx-auto mt-1.5 h-1.5 w-16 overflow-hidden rounded-full">
                            <div
                              className={`h-full ${
                                v.ai_confidence_score >= 0.85
                                  ? "bg-emerald-500"
                                  : v.ai_confidence_score >= 0.6
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                              }`}
                              style={{
                                width: `${v.ai_confidence_score * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-brand-text-subtle text-xs italic">
                          Chờ xử lý
                        </span>
                      )}
                    </td>

                    {/* Mức phạt */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-alert-danger font-mono font-bold">
                        -{v.diem_tru}đ
                      </span>
                    </td>

                    {/* Trạng thái xác thực */}
                    <td className="px-4 py-4">
                      {getStatusBadge(v.trang_thai)}
                    </td>

                    {/* Thao tác xem chi tiết */}
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setSelectedViolation(v)}
                        className="border-brand-border-active/40 bg-brand-surface/90 text-brand-blue-sky hover:border-brand-primary hover:bg-brand-primary inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:text-white hover:shadow-md"
                      >
                        <FileVideo className="h-3.5 w-3.5" />
                        <span>Xem clip & Duyệt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CHI TIẾT & PHÁT VIDEO BẰNG CHỨNG (DARK GLASS POPUP) */}
      {selectedViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="card-glass border-brand-border-active animate-fade-in-up w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl">
            {/* Modal Header */}
            <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-brand-text-primary text-lg font-bold">
                  Bằng chứng Cảnh báo #{selectedViolation.id}
                </h3>
                <p className="text-brand-text-muted text-xs">
                  Tài xế: {selectedViolation.driver_name} • Xe:{" "}
                  {selectedViolation.vehicle_plate}
                </p>
              </div>
              <button
                onClick={() => setSelectedViolation(null)}
                className="hover:bg-brand-surface text-brand-text-muted rounded-full p-2 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[75vh] space-y-4 overflow-y-auto p-6">
              {/* VIDEO CLIP HOẶC TELEMETRY */}
              {selectedViolation.video_url ? (
                <div className="border-brand-border-dark relative overflow-hidden rounded-2xl border bg-black shadow-inner">
                  <video
                    src={selectedViolation.video_url}
                    controls
                    autoPlay
                    muted
                    className="max-h-72 w-full object-contain"
                  />
                  <div className="border-brand-border/60 bg-brand-dark/90 absolute top-3 left-3 flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                    <span className="h-2 w-2 animate-ping rounded-full bg-rose-500"></span>
                    <span>CCTV Cabin Edge IoT (10s)</span>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-5 text-center">
                  <Wind className="mx-auto h-8 w-8 text-amber-400" />
                  <p className="mt-2 text-sm font-bold text-amber-300">
                    Cảnh báo từ Cảm biến Môi trường Cabin (CO2)
                  </p>
                  <p className="text-brand-text-muted mt-1 text-xs">
                    Sự kiện được ghi nhận từ chu kỳ đo khí độc của cảm biến IoT,
                    không có video clip kèm theo
                  </p>
                </div>
              )}

              {/* GRID THÔNG SỐ SỰ KIỆN */}
              <div className="border-brand-border-dark bg-brand-dark/70 grid grid-cols-2 gap-4 rounded-2xl border p-4 text-sm">
                <div>
                  <span className="text-brand-text-subtle text-xs">
                    Loại vi phạm:
                  </span>
                  <div className="mt-1">
                    {getViolationBadge(selectedViolation.loai_vi_pham)}
                  </div>
                </div>
                <div>
                  <span className="text-brand-text-subtle text-xs">
                    Trạng thái hiện tại:
                  </span>
                  <div className="mt-1">
                    {getStatusBadge(selectedViolation.trang_thai)}
                  </div>
                </div>
                <div>
                  <span className="text-brand-text-subtle text-xs">
                    Thời điểm phát hiện:
                  </span>
                  <p className="text-brand-text-primary mt-1 font-mono font-medium">
                    {new Date(
                      selectedViolation.thoi_gian_vi_pham,
                    ).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div>
                  <span className="text-brand-text-subtle text-xs">
                    Điểm trừ quy định:
                  </span>
                  <p className="text-alert-danger mt-1 font-mono font-bold">
                    -{selectedViolation.diem_tru} điểm uy tín
                  </p>
                </div>
              </div>

              {/* GHI CHÚ PHÂN TÍCH TỪ EDGE AI */}
              <div className="border-brand-border-active/30 bg-brand-blue-night/20 rounded-2xl border p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-blue-sky h-4 w-4" />
                  <p className="text-brand-blue-sky text-xs font-bold tracking-wider uppercase">
                    Phân tích thuật toán AI (Độ tin cậy:{" "}
                    {selectedViolation.ai_confidence_score
                      ? (selectedViolation.ai_confidence_score * 100).toFixed(
                          0,
                        ) + "%"
                      : "N/A"}
                    )
                  </p>
                </div>
                <p className="text-brand-text-secondary mt-2 text-xs leading-relaxed">
                  {selectedViolation.mo_ta}
                </p>
              </div>
            </div>

            {/* Modal Footer / Thao tác Duyệt */}
            <div className="border-brand-border-dark bg-brand-dark/90 flex items-center justify-between border-t px-6 py-4">
              <button
                onClick={() => setSelectedViolation(null)}
                className="border-brand-border bg-brand-surface text-brand-text-muted rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:bg-slate-700 hover:text-white"
              >
                Đóng
              </button>

              <div className="flex gap-2.5">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedViolation.id, "REJECTED")
                  }
                  disabled={
                    selectedViolation.trang_thai === "REJECTED" ||
                    selectedViolation.trang_thai === "MANUALLY_REJECTED"
                  }
                  className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-300 transition-all hover:bg-rose-900/50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Bác bỏ (False Alarm)
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedViolation.id, "CONFIRMED")
                  }
                  disabled={
                    selectedViolation.trang_thai === "CONFIRMED" ||
                    selectedViolation.trang_thai === "MANUALLY_CONFIRMED"
                  }
                  className="bg-brand-primary hover:bg-brand-primary-hover shadow-brand-primary/25 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Xác nhận vi phạm & Trừ điểm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogsPage;
