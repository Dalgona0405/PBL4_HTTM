import { useState } from "react";
import toast from "react-hot-toast";
import { mockDrivers } from "../../mock/mockData";
import AddDriverModal from "./components/AddDriverModal";
import DriverProfileModal from "./components/DriverProfileModal";
import DriversFilterBar from "./components/DriversFilterBar";
import DriversKpiCards from "./components/DriversKpiCards";
import DriversTable from "./components/DriversTable";

export default function DriversPage() {
  const [drivers, setDrivers] = useState(() => mockDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [selectedDriverForProfile, setSelectedDriverForProfile] =
    useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // 1. Thao tác Đình chỉ hoặc Mở khóa tài xế
  const handleToggleDriverStatus = (driver) => {
    const score =
      driver.diem_uy_tin !== undefined
        ? driver.diem_uy_tin
        : driver.uy_tin || 100;
    const isSuspended = score <= 20 || driver.cap_canh_bao === "SUSPENDED_RED";
    const driverName = driver.user?.ho_ten || driver.ho_ten;

    setDrivers((prev) =>
      prev.map((d) => {
        if (d.id === driver.id) {
          return {
            ...d,
            diem_uy_tin: isSuspended ? 85 : 15, // Mở khóa phục hồi 85đ, Đình chỉ hạ 15đ
            cap_canh_bao: isSuspended ? "NORMAL" : "SUSPENDED_RED",
          };
        }
        return d;
      }),
    );

    if (isSuspended) {
      toast.success(`Đã mở khóa nhận ca cho tài xế ${driverName}!`, {
        icon: "✅",
      });
    } else {
      toast.error(
        `Đã đình chỉ công tác tài xế ${driverName} (Khóa cứng xếp ca theo SRS 4.1)!`,
        { icon: "🚫" },
      );
    }
  };

  // 2. Thêm tài xế mới vào danh sách
  const handleAddDriver = (newDriver) => {
    setDrivers((prev) => [newDriver, ...prev]);
  };

  // 3. Lọc danh sách theo Tab và Từ khóa tìm kiếm
  const filteredDrivers = drivers.filter((d) => {
    const name = (d.user?.ho_ten || d.ho_ten || "").toLowerCase();
    const phone = (d.user?.so_dien_thoai || d.sdt || "").toLowerCase();
    const license = (d.so_bang_lai || "").toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchSearch =
      name.includes(query) || phone.includes(query) || license.includes(query);

    const score = d.diem_uy_tin !== undefined ? d.diem_uy_tin : d.uy_tin || 100;
    if (statusFilter === "ALL") return matchSearch;
    if (statusFilter === "NORMAL") return matchSearch && score > 65;
    if (statusFilter === "WARNING_YELLOW")
      return matchSearch && score <= 65 && score > 20;
    if (statusFilter === "SUSPENDED_RED") return matchSearch && score <= 20;
    return matchSearch;
  });

  return (
    <div className="animate-fade-in-up space-y-6 font-sans">
      {/* 1. Header Trang */}
      <div>
        <h1 className="text-brand-text-primary text-2xl font-black tracking-tight">
          Quản trị Tài xế &amp; Điểm Uy tín Sổ cái
        </h1>
        <p className="text-brand-text-muted text-xs">
          Kiểm soát thể trạng sinh học 30 ngày, đối soát sổ cái bất biến và áp
          dụng chế tài tự động
        </p>
      </div>

      {/* 2. Cụm 4 Thẻ KPI */}
      <DriversKpiCards drivers={drivers} />

      {/* 3. Thanh tìm kiếm & Bộ lọc */}
      <DriversFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenAddModal={() => setShowAddModal(true)}
      />

      {/* 4. Bảng Danh sách Tài xế */}
      <DriversTable
        drivers={filteredDrivers}
        onOpenProfileModal={(d) => setSelectedDriverForProfile(d)}
        onToggleDriverStatus={handleToggleDriverStatus}
      />

      {/* 5. Các Modals */}
      <DriverProfileModal
        isOpen={Boolean(selectedDriverForProfile)}
        onClose={() => setSelectedDriverForProfile(null)}
        driver={selectedDriverForProfile}
      />

      <AddDriverModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddDriver={handleAddDriver}
      />
    </div>
  );
}
