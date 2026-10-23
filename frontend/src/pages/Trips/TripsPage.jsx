import { useState } from "react";
import { mockShifts, mockTrips } from "../../mock/mockData";
import CreateShiftModal from "./components/CreateShiftModal";
import RealTripsTable from "./components/RealTripsTable";
import ShiftsTable from "./components/ShiftsTable";
import TripsHeader from "./components/TripsHeader";

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("SHIFTS"); // "SHIFTS" (Kế hoạch) | "TRIPS" (Thực tế)
  const [shifts, setShifts] = useState(() => mockShifts);
  const [trips] = useState(() => mockTrips);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Thêm ca mới vào đầu danh sách
  const handleAddShift = (newShift) => {
    setShifts((prev) => [newShift, ...prev]);
  };

  return (
    <div className="animate-fade-in-up space-y-6 font-sans">
      {/* 1. Header Trang, Thanh chuyển 2 Tabs & Nút Lập ca */}
      <TripsHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shiftCount={shifts.length}
        tripCount={trips.length}
        onOpenCreateModal={() => setShowCreateModal(true)}
      />

      {/* 2. Hiển thị Nội dung theo Tab được chọn */}
      {activeTab === "SHIFTS" ? (
        <ShiftsTable
          shifts={shifts}
          onSwitchToTripTab={() => setActiveTab("TRIPS")}
        />
      ) : (
        <RealTripsTable trips={trips} />
      )}

      {/* 3. Modal Lập Ca Thông Minh (Smart Scheduling) */}
      <CreateShiftModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onAddShift={handleAddShift}
      />
    </div>
  );
}
