import { useState } from "react";
import CircadianRiskChart from "./components/CircadianRiskChart";
import DashboardHeader from "./components/DashboardHeader";
import DriverPerformanceCard from "./components/DriverPerformanceCard";
import ExecutiveKpiCards from "./components/ExecutiveKpiCards";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7D");

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* 1. Header Báo cáo & Nút Xuất File */}
      <DashboardHeader timeRange={timeRange} setTimeRange={setTimeRange} />

      {/* 2. 4 Thẻ KPI Cấp Quản Lý */}
      <ExecutiveKpiCards />

      {/* 3. Biểu đồ Đường Cong Rủi Ro Sinh Học 24 Giờ */}
      <CircadianRiskChart />

      {/* 4. Danh Sách Tài Xế Gương Mẫu vs Cần Can Thiệp */}
      <DriverPerformanceCard />
    </div>
  );
}
