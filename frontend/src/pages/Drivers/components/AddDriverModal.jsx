import { Plus, UserPlus, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import SelectField from "../../../components/common/SelectField";

const LICENSE_OPTIONS = [
  { value: "FC", label: "Hạng FC (Container)" },
  { value: "C", label: "Hạng C (Xe tải nặng)" },
  { value: "D", label: "Hạng D (Xe khách)" },
  { value: "E", label: "Hạng E (Xe giường nằm)" },
];

export default function AddDriverModal({ isOpen, onClose, onAddDriver }) {
  const [formData, setFormData] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    hang_bang_lai: "FC",
    so_bang_lai: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ho_ten.trim()) {
      toast.error("Vui lòng nhập họ tên!");
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
      { icon: "👤" },
    );
    setFormData({
      ho_ten: "",
      so_dien_thoai: "",
      hang_bang_lai: "FC",
      so_bang_lai: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl">
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="text-brand-blue-sky h-5 w-5" />
            <h3 className="text-brand-text-primary text-sm font-bold">
              Thêm Tài xế mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted cursor-pointer rounded-full p-1 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <InputField
            label="Họ tên tài xế"
            name="ho_ten"
            required
            placeholder="VD: Nguyễn Văn An"
            value={formData.ho_ten}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            <InputField
              label="Số điện thoại"
              name="so_dien_thoai"
              placeholder="VD: 0905123456"
              value={formData.so_dien_thoai}
              onChange={handleChange}
            />
            <SelectField
              label="Hạng bằng lái"
              name="hang_bang_lai"
              value={formData.hang_bang_lai}
              onChange={handleChange}
              options={LICENSE_OPTIONS}
            />
          </div>

          <InputField
            label="Số giấy phép lái xe"
            name="so_bang_lai"
            placeholder="VD: FC-790012345"
            value={formData.so_bang_lai}
            onChange={handleChange}
          />

          <div className="border-brand-border-dark flex items-center justify-end gap-2.5 border-t pt-4">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="h-4 w-4" />
              <span>Tạo tài xế</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
