import { useState } from "react";
import toast from "react-hot-toast";
import { mockVehicles } from "../../mock/mockData";
import AddVehicleModal from "./components/AddVehicleModal";
import DeviceHealthModal from "./components/DeviceHealthModal";
import VehiclesFilterBar from "./components/VehiclesFilterBar";
import VehiclesKpiCards from "./components/VehiclesKpiCards";
import VehiclesTable from "./components/VehiclesTable";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(() => mockVehicles);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 1. Chuyển trạng thái xe qua lại giữa Bảo dưỡng và Sẵn sàng
  const handleToggleMaintenance = (vehicle) => {
    const isMaintenance =
      vehicle.trang_thai === "MAINTENANCE" ||
      vehicle.trang_thai === "BAO_DUONG";
    const newStatus = isMaintenance ? "ACTIVE" : "MAINTENANCE";
    const plate = vehicle.bien_so_xe || vehicle.bien_so;

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicle.id ? { ...v, trang_thai: newStatus } : v,
      ),
    );

    if (newStatus === "MAINTENANCE") {
      toast.success(
        `Đã chuyển xe [${plate}] sang BẢO DƯỠNG (Tự động khóa xếp ca theo SRS 4.1)!`,
        { icon: "🔧" },
      );
    } else {
      toast.success(
        `Xe [${plate}] đã hoàn thành bảo dưỡng và sẵn sàng nhận ca!`,
        {
          icon: "✅",
        },
      );
    }
  };

  // 2. Thêm xe mới vào danh sách
  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  // 3. Lọc danh sách theo Tab và Từ khóa tìm kiếm
  const filteredVehicles = vehicles.filter((v) => {
    const plate = (v.bien_so_xe || v.bien_so || "").toLowerCase();
    const model = (v.loai_xe || "").toLowerCase();
    const matchSearch =
      plate.includes(searchTerm.toLowerCase()) ||
      model.includes(searchTerm.toLowerCase());

    if (statusFilter === "ALL") return matchSearch;
    return matchSearch && v.trang_thai === statusFilter;
  });

  return (
    <div className="animate-fade-in-up space-y-6 font-sans">
      {/* 1. Header trang */}
      <div>
        <h1 className="text-brand-text-primary text-2xl font-black tracking-tight">
          Quản trị Đội xe & Thiết bị IoT Edge
        </h1>
        <p className="text-brand-text-muted text-xs">
          Kiểm soát tình trạng phần cứng Raspberry Pi 4, cảm biến MQ-135 và liên
          kết xếp ca an toàn
        </p>
      </div>

      {/* 2. Cụm 4 Thẻ KPI */}
      <VehiclesKpiCards vehicles={vehicles} />

      {/* 3. Thanh tìm kiếm, Bộ lọc & Nút thêm xe */}
      <VehiclesFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* 4. Bảng danh sách phương tiện */}
      <VehiclesTable
        vehicles={filteredVehicles}
        onOpenDeviceModal={(v) => setSelectedVehicleForModal(v)}
        onToggleMaintenance={handleToggleMaintenance}
      />

      {/* 5. Các Modals */}
      <DeviceHealthModal
        isOpen={Boolean(selectedVehicleForModal)}
        onClose={() => setSelectedVehicleForModal(null)}
        vehicle={selectedVehicleForModal}
      />

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddVehicle={handleAddVehicle}
      />
    </div>
  );
}
