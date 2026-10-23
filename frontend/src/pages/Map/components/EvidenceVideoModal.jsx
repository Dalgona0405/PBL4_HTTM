import { CheckCircle2, X } from "lucide-react";

export default function EvidenceVideoModal({ isOpen, onClose, vehicle }) {
  if (!isOpen) return null;

  const plate =
    vehicle?.plate || vehicle?.bien_so || vehicle?.bien_so_xe || "---";
  const driverName =
    vehicle?.driverName ||
    vehicle?.driver ||
    vehicle?.tai_xe_hien_tai ||
    "Tài xế";

  // Lấy dữ liệu vi phạm động từ chiếc xe đang chọn
  const hasViolation =
    vehicle?.priorityLevel === "DANGER" ||
    vehicle?.priorityLevel === "WARNING" ||
    vehicle?.alertType === "MICROSLEEP" ||
    vehicle?.alertType === "FATIGUE_WARNING";

  // Video mẫu tương ứng: Nếu dùng điện thoại hoặc mệt mỏi sẽ đổi video khác
  const videoUrl =
    vehicle?.evidenceClip?.videoUrl ||
    vehicle?.video_url ||
    (vehicle?.alertType === "MICROSLEEP"
      ? "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4");

  const alertDescription =
    vehicle?.alertDesc ||
    vehicle?.priorityDesc ||
    "Phát hiện hành vi mất an toàn buồng lái.";

  const aiConfidence = vehicle?.evidenceClip?.aiConfidence || 92;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl">
        {/* Header Modal */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{hasViolation ? "🚨" : "🛡️"}</span>
            <div>
              <h3 className="text-brand-text-primary text-sm font-bold">
                Bằng chứng Edge AI (10 giây) — Xe {plate}
              </h3>
              <p className="text-brand-text-muted text-[11px]">
                Tài xế: {driverName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted rounded-full p-1 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung video & phân tích AI */}
        <div className="bg-black p-4">
          {hasViolation ? (
            <>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-950">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-black/70 px-2 py-1 text-[10px] font-bold text-red-400 backdrop-blur-md">
                  <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
                  CCTV Cabin Clip (10s)
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-alert-danger flex items-center gap-1 font-semibold">
                  ⚠️ {alertDescription}
                </span>
                <span className="text-alert-safe font-mono font-bold">
                  Độ tin cậy AI: {aiConfidence}%
                </span>
              </div>
            </>
          ) : (
            // Giao diện khi tài xế an toàn (không có video vi phạm)
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
              <h4 className="text-brand-text-primary mt-3 text-base font-bold">
                Tài xế đang vận hành an toàn!
              </h4>
              <p className="text-brand-text-muted mt-1 text-xs">
                Phương tiện {plate} không phát sinh sự kiện vi phạm nào cần
                trích xuất video.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
