import { Plus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddDriverModal({ isOpen, onClose, onAddDriver }) {
  const [formData, setFormData] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    hang_bang_lai: "FC",
    so_bang_lai: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ho_ten.trim()) {
      toast.error("Vui lòng nhập họ tên tài xế!");
      return;
    }

    const newDriver = {
      id: Date.now(),
      user_id: Date.now(),
      diem_uy_tin: 100,
      cap_canh_bao: "NORMAL",
      hang_bang_lai: formData.hang_bang_lai,
      so_bang_lai:
        formData.so_bang_lai ||
        `FC-${Math.floor(100000 + Math.random() * 900000)}`,
      user: {
        id: Date.now(),
        ho_ten: formData.ho_ten.trim(),
        so_dien_thoai: formData.so_dien_thoai || "0905000999",
      },
    };

    onAddDriver(newDriver);
    toast.success(
      `Đã thêm thành công tài xế [${newDriver.user.ho_ten}] vào hệ thống!`,
      {
        icon: "🎉",
      },
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl">
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="text-brand-blue-sky h-5 w-5" />
            <h3 className="text-brand-text-primary text-sm font-bold">
              Thêm Hồ sơ Tài xế Mới
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
              Họ và tên tài xế <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn An"
              value={formData.ho_ten}
              onChange={(e) =>
                setFormData({ ...formData, ho_ten: e.target.value })
              }
              className="border-brand-border bg-brand-dark/90 text-brand-text-primary focus:border-brand-primary w-full rounded-xl border px-3.5 py-2.5 text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="VD: 0905123456"
                value={formData.so_dien_thoai}
                onChange={(e) =>
                  setFormData({ ...formData, so_dien_thoai: e.target.value })
                }
                className="border-brand-border bg-brand-dark/90 text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="text-brand-text-primary mb-1 block font-bold">
                Hạng bằng lái
              </label>
              <select
                value={formData.hang_bang_lai}
                onChange={(e) =>
                  setFormData({ ...formData, hang_bang_lai: e.target.value })
                }
                className="border-brand-border bg-brand-dark text-brand-text-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
              >
                <option value="FC">Hạng FC (Container)</option>
                <option value="C">Hạng C (Xe tải nặng)</option>
                <option value="D">Hạng D (Xe khách)</option>
                <option value="E">Hạng E (Xe giường nằm)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-brand-text-primary mb-1 block font-bold">
              Số giấy phép lái xe
            </label>
            <input
              type="text"
              placeholder="VD: FC-790012345"
              value={formData.so_bang_lai}
              onChange={(e) =>
                setFormData({ ...formData, so_bang_lai: e.target.value })
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
              <span>Tạo hồ sơ tài xế</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
