import { Plus, Truck, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddVehicleModal({ isOpen, onClose, onAddVehicle }) {
  const [formData, setFormData] = useState({
    bien_so_xe: "",
    loai_xe: "Xe Container 40ft",
    tai_trong_tan: "30",
    ma_thiet_bi: "IOT-DN-03",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bien_so_xe.trim()) {
      toast.error("Vui lòng nhập biển số xe!");
      return;
    }

    const newVehicle = {
      id: Date.now(),
      bien_so_xe: formData.bien_so_xe.trim().toUpperCase(),
      loai_xe: formData.loai_xe,
      tai_trong_tan: parseFloat(formData.tai_trong_tan) || 15,
      trang_thai: "ACTIVE", // Mặc định sẵn sàng nhận ca
      tai_xe_hien_tai: null,
      iot_device: {
        id: Date.now() + 1,
        ma_thiet_bi: formData.ma_thiet_bi,
        firmware_version: "fw-v1.2.0",
        ai_model_version: "yolo26n-v1.1",
        trang_thai_ket_noi: "ONLINE",
        cpu_temp_c: 62.0,
        free_storage_mb: 28000,
      },
    };

    onAddVehicle(newVehicle);
    toast.success(`Đã thêm thành công xe [${newVehicle.bien_so_xe}] vào đội!`, {
      icon: "🚚",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl">
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Truck className="text-brand-blue-sky h-5 w-5" />
            <h3 className="text-brand-text-primary text-sm font-bold">
              Thêm Phương tiện Mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted rounded-full p-1 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 text-xs">
          <div>
            <label className="text-brand-text-primary mb-1 block font-bold">
              Biển số xe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: 43C-888.88"
              value={formData.bien_so_xe}
              onChange={(e) =>
                setFormData({ ...formData, bien_so_xe: e.target.value })
              }
              className="border-brand-border bg-brand-dark/90 text-brand-text-primary focus:border-brand-primary w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Dòng xe
              </label>
              <select
                value={formData.loai_xe}
                onChange={(e) =>
                  setFormData({ ...formData, loai_xe: e.target.value })
                }
                className="border-brand-border bg-brand-dark text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              >
                <option value="Xe Container 40ft">Container 40ft</option>
                <option value="Xe tải thùng 15 tấn">Tải thùng 15T</option>
                <option value="Xe tải đông lạnh 10T">Đông lạnh 10T</option>
                <option value="Xe tải ISUZU 5 tấn">Tải nhẹ 5T</option>
              </select>
            </div>

            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Tải trọng (Tấn)
              </label>
              <input
                type="number"
                value={formData.tai_trong_tan}
                onChange={(e) =>
                  setFormData({ ...formData, tai_trong_tan: e.target.value })
                }
                className="border-brand-border bg-brand-dark/90 text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-brand-text-primary mb-1 block font-bold">
              Gán Thiết bị Edge AI (Pi 4 + ESP32)
            </label>
            <input
              type="text"
              value={formData.ma_thiet_bi}
              onChange={(e) =>
                setFormData({ ...formData, ma_thiet_bi: e.target.value })
              }
              className="border-brand-border bg-brand-dark/90 text-brand-text-primary w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
            />
          </div>

          <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-end gap-2.5 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border-brand-border bg-brand-surface text-brand-text-muted rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-brand-primary hover:bg-brand-primary-hover flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm vào đội xe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
