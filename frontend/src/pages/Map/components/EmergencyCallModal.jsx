import toast from "react-hot-toast";

export default function EmergencyCallModal({ isOpen, onClose, vehicle }) {
  if (!isOpen) return null;

  const handleEndCall = () => {
    onClose();
    toast.success("Đã kết thúc cuộc gọi khẩn cấp!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-sm rounded-3xl border p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 text-3xl text-amber-400">
          📞
        </div>
        <h3 className="text-brand-text-primary mt-4 text-base font-bold">
          Đang kết nối buồng lái...
        </h3>
        <p className="text-brand-text-muted mt-1 text-xs">
          Tài xế:{" "}
          {vehicle?.driverName || vehicle?.driver || vehicle?.tai_xe_hien_tai}{" "}
          (Xe {vehicle?.bien_so_xe || vehicle?.plate})
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleEndCall}
            className="bg-alert-danger cursor-pointer rounded-xl px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-rose-600"
          >
            Ngắt máy
          </button>
        </div>
      </div>
    </div>
  );
}
