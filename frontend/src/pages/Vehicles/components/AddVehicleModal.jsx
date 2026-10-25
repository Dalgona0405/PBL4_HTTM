import { Plus, Truck, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../../../components/common/Button";
import InputField from "../../../components/common/InputField";
import SelectField from "../../../components/common/SelectField";

const VEHICLE_TYPE_OPTIONS = [
  { value: "Xe Container 40ft", label: "Container 40ft" },
  { value: "Xe tải thùng 15 tấn", label: "Tải thùng 15T" },
  { value: "Xe đông lạnh 10T", label: "Đông lạnh 10T" },
  { value: "Xe tải ISUZU 5 tấn", label: "Tải nhẹ 5T" },
];

export default function AddVehicleModal({ isOpen, onClose, onAddVehicle }) {
  const [formData, setFormData] = useState({
    bien_so_xe: "",
    loai_xe: "Xe Container 40ft",
    tai_trong_tan: "30",
    ma_thiet_bi: "IOT-DN-03",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      trang_thai: "ACTIVE",
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
    toast.success(`Đã thêm thành công xe [${newVehicle.bien_so_xe}] mới!`, {
      icon: "🚛",
    });
    setFormData({
      bien_so_xe: "",
      loai_xe: "Xe Container 40ft",
      tai_trong_tan: "30",
      ma_thiet_bi: "IOT-DN-04",
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
              Thêm Phương tiện
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
            label="Biển số xe"
            name="bien_so_xe"
            required
            placeholder="VD: 43C-888.88"
            value={formData.bien_so_xe}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              label="Dòng xe"
              name="loai_xe"
              value={formData.loai_xe}
              onChange={handleChange}
              options={VEHICLE_TYPE_OPTIONS}
            />
            <InputField
              label="Tải trọng (Tấn)"
              name="tai_trong_tan"
              type="number"
              value={formData.tai_trong_tan}
              onChange={handleChange}
            />
          </div>

          <InputField
            label="Gắn Thiết bị Edge AI (Pi 4 + ESP32)"
            name="ma_thiet_bi"
            value={formData.ma_thiet_bi}
            onChange={handleChange}
          />

          <div className="border-brand-border-dark flex items-center justify-end gap-2.5 border-t pt-4">
            <Button variant="secondary" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary">
              <Plus className="h-4 w-4" />
              <span>Thêm mới xe</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
