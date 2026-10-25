import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dataService from "../../services/dataService";
import LogsFilterBar from "./components/LogsFilterBar";
import LogsKpiStats from "./components/LogsKpiStats";
import LogsTable from "./components/LogsTable";
import ViolationReviewModal from "./components/ViolationReviewModal";

export default function LogsPage() {
  const [violations, setViolations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);

  const loadData = async () => {
    try {
      const data = await dataService.getViolations();
      setViolations([...data]);
    } catch (err) {
      toast.error("Không thể tải danh sách vi phạm");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Xử lý Điều phối viên bấm Duyệt hoặc Bác bỏ vi phạm
  const handleConfirmReview = async (violationId, decision, notes) => {
    try {
      const res = await dataService.reviewViolation({
        violationId,
        decision,
        notes,
        reviewerName: "Trần điều phối",
        reviewerId: 2,
      });
      await loadData();

      if (decision === "COFIRMED") {
        toast.success(
          `Đã xác nhận vi phạm #${violationId} & tự động trừ điểm uy tín.`,
          { icon: "✅" },
        );
      } else {
        toast.success(
          `Đã đánh dấu báo động giả cho cho sự kiện #${violationId}.`,
          { icon: "🛡️" },
        );
      }
    } catch (err) {
      toast.error(err.message || "Có lỗi xảy ra khi duyệt.");
    }
  };

  // Lọc danh sách theo Tab trạng thái, Loại vi phạm và Từ khóa tìm kiếm
  const filteredViolations = violations.filter((v) => {
    const currentStatus = v.trang_thai_xac_thuc || v.trang_thai;
    const currentType = v.ma_loai || v.loai_vi_pham;
    const driverName = (
      v.driver?.user?.ho_ten ||
      v.driver_name ||
      ""
    ).toLowerCase();
    const plate = (
      v.vehicle?.bien_so_xe ||
      v.vehicle_plate ||
      v.trip?.vehicle?.bien_so_xe ||
      ""
    ).toLowerCase();
    const query = searchTerm.toLowerCase();

    // 1. Lọc theo trạng thái
    if (statusFilter !== "ALL") {
      if (
        statusFilter === "CONFIRMED" &&
        currentStatus !== "CONFIRMED" &&
        currentStatus !== "MANUALLY_CONFIRMED"
      )
        return false;
      if (
        statusFilter === "REJECTED" &&
        currentStatus !== "REJECTED" &&
        currentStatus !== "MANUALLY_REJECTED" &&
        currentStatus !== "RESOLVED_SAFE"
      )
        return false;
      if (
        statusFilter === "PENDING_MANUAL_REVIEW" &&
        currentStatus !== "PENDING_MANUAL_REVIEW"
      )
        return false;
    }

    // 2. Lọc theo loại vi phạm
    if (typeFilter !== "ALL" && !currentType.includes(typeFilter)) {
      return false;
    }

    // 3. Lọc theo từ khóa tìm kiếm
    if (
      searchTerm &&
      !driverName.includes(query) &&
      !plate.includes(query) &&
      !String(v.id).includes(query)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="animate-fade-in-up space-y-6 font-sans">
      {/* 1. Header Trang */}
      <div>
        <h1 className="text-brand-text-primary text-2xl font-black tracking-tight">
          Xác thực Vi phạm AI &amp; Bằng chứng Telemetry
        </h1>
        <p className="text-brand-text-muted text-xs">
          Quy trình thẩm định 2 pha (Edge AI &rarr; Cloud Hậu kiểm), loại bỏ báo
          động giả và ghi nhận điểm uy tín
        </p>
      </div>

      {/* 2. Cụm 4 Thẻ KPI */}
      <LogsKpiStats violations={violations} />

      {/* 3. Thanh Lọc & Tìm kiếm */}
      <LogsFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 4. Bảng Dữ liệu Vi phạm */}
      <LogsTable
        violations={filteredViolations}
        onSelectViolation={(v) => setSelectedViolation(v)}
      />

      {/* 5. Modal Xem Clip 10s & Duyệt */}
      <ViolationReviewModal
        isOpen={Boolean(selectedViolation)}
        onClose={() => setSelectedViolation(null)}
        violation={selectedViolation}
        onConfirmReview={handleConfirmReview}
      />
    </div>
  );
}
