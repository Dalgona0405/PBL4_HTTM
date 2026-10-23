import { Sparkles, Wind, X } from "lucide-react";
import { useState } from "react";

export default function ViolationReviewModal({
  isOpen,
  onClose,
  violation,
  onConfirmReview,
}) {
  const [reviewNote, setReviewNote] = useState("");

  if (!isOpen || !violation) return null;

  const driverName =
    violation.driver?.user?.ho_ten || violation.driver_name || "Lê Minh Tuấn";
  const vehiclePlate =
    violation.vehicle?.bien_so_xe ||
    violation.vehicle_plate ||
    violation.trip?.vehicle?.bien_so_xe ||
    "43C-123.45";
  const videoUrl = violation.video_url || violation.duong_dan_video;
  const isVideoRequired = Boolean(videoUrl);
  const status = violation.trang_thai_xac_thuc || violation.trang_thai;
  const isPending = status === "PENDING_MANUAL_REVIEW";

  const handleAction = (decision) => {
    onConfirmReview(violation.id, decision, reviewNote);
    setReviewNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl">
        {/* Header Modal */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-brand-text-primary text-base font-bold">
              Thẩm định Vi phạm IoT #{violation.id} — Xe {vehiclePlate}
            </h3>
            <p className="text-brand-text-muted text-xs">
              Tài xế: {driverName} • Chuyến #{violation.trip_id || "501"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted rounded-full p-1 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung bằng chứng: Video hoặc Cảm biến */}
        <div className="max-h-[72vh] space-y-4 overflow-y-auto p-6 text-xs">
          {isVideoRequired ? (
            <div className="border-brand-border-dark relative overflow-hidden rounded-2xl border bg-black shadow-inner">
              <video
                src={videoUrl}
                controls
                autoPlay
                muted
                className="max-h-68 w-full object-contain"
              />
              <div className="border-brand-border/60 bg-brand-dark/90 absolute top-3 left-3 flex items-center gap-2 rounded-lg border px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                <span className="h-2 w-2 animate-ping rounded-full bg-rose-500"></span>
                <span>Camera Buồng lái CCTV (10 giây)</span>
              </div>
            </div>
          ) : (
            // Giao diện khi lỗi ghi nhận từ Cảm biến CO2 / Che camera
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/25 p-5 text-center">
              <Wind className="mx-auto h-9 w-9 text-amber-400" />
              <p className="mt-2 text-sm font-bold text-amber-300">
                Ghi nhận Telemetry Môi trường Cabin (Không có video)
              </p>
              <p className="text-brand-text-muted mt-1 text-xs">
                Chỉ số CO2 đo được 1,340 ppm (vượt ngưỡng 1,200 ppm) kéo dài quá
                5 phút.
              </p>
            </div>
          )}

          {/* Chi tiết sự kiện & Điểm số */}
          <div className="border-brand-border-dark bg-brand-dark/70 grid grid-cols-2 gap-3.5 rounded-2xl border p-4">
            <div>
              <span className="text-brand-text-subtle text-[11px]">
                Loại vi phạm:
              </span>
              <p className="text-brand-text-primary mt-0.5 font-bold">
                {violation.ten_loai || violation.ma_loai}
              </p>
            </div>
            <div>
              <span className="text-brand-text-subtle text-[11px]">
                Mức phạt quy định:
              </span>
              <p className="text-alert-danger mt-0.5 font-bold">
                -{violation.diem_bi_tru ?? violation.diem_tru ?? 0} điểm uy tín
              </p>
            </div>
            <div>
              <span className="text-brand-text-subtle text-[11px]">
                Thời điểm chốt lỗi:
              </span>
              <p className="text-brand-text-primary mt-0.5">
                {new Date(
                  violation.thoi_gian_chot_vi_pham ||
                    violation.thoi_gian_vi_pham,
                ).toLocaleString("vi-VN")}
              </p>
            </div>
            <div>
              <span className="text-brand-text-subtle text-[11px]">
                Độ tin cậy Edge AI / Server:
              </span>
              <p className="mt-0.5 font-bold text-emerald-400">
                {violation.ai_confidence_score
                  ? `${(violation.ai_confidence_score * 100).toFixed(0)}% (Hậu kiểm Cloud)`
                  : "Quy tắc Cảm biến"}
              </p>
            </div>
          </div>

          {/* Phân tích thuật toán AI */}
          <div className="border-brand-border-active/30 bg-brand-blue-night/20 rounded-2xl border p-4">
            <div className="text-brand-blue-sky flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Phân tích Thuật toán Thị giác Máy tính (AI Engine)</span>
            </div>
            <p className="text-brand-text-secondary mt-1.5 leading-relaxed">
              {violation.mo_ta ||
                "Mô hình YOLO26 phát hiện mắt nhắm > 1.5s và góc nghiêng đầu gục xuống vô lăng. Điểm EAR = 0.14 thấp hơn ngưỡng cá nhân hóa."}
            </p>
          </div>

          {/* Ô nhập giải trình / Ghi chú duyệt */}
          {isPending && (
            <div>
              <label className="text-brand-text-muted mb-1 block font-bold">
                Ghi chú thẩm định của Điều phối viên (Lưu vết Audit Log):
              </label>
              <textarea
                rows={2}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="VD: Video rõ ràng tài xế gục đầu khi xe đang chạy 75km/h, xác nhận trừ điểm..."
                className="border-brand-border bg-brand-dark text-brand-text-primary focus:border-brand-primary w-full rounded-xl border p-2.5 text-xs outline-none"
              />
            </div>
          )}
        </div>

        {/* Cụm nút thao tác */}
        <div className="border-brand-border-dark bg-brand-dark/90 flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={onClose}
            className="border-brand-border bg-brand-surface text-brand-text-muted rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:text-white"
          >
            Đóng
          </button>

          {isPending ? (
            <div className="flex gap-2.5">
              <button
                onClick={() => handleAction("REJECTED")}
                className="cursor-pointer rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-2 text-xs font-bold text-rose-300 transition-all hover:bg-rose-900/50"
              >
                Bác bỏ (Báo động giả)
              </button>
              <button
                onClick={() => handleAction("CONFIRMED")}
                className="bg-brand-primary hover:bg-brand-primary-hover shadow-brand-primary/25 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-white shadow-lg transition-all active:scale-95"
              >
                Xác nhận &amp; Trừ điểm
              </button>
            </div>
          ) : (
            <span className="text-brand-text-subtle text-[11px] italic">
              Bản ghi đã chốt trạng thái ({status})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
