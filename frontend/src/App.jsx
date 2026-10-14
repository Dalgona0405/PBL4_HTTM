import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/Login/LoginPage";
import LogsPage from "./pages/Logs/LogsPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import DriversPage from "./pages/Drivers/DriversPage";
import TripsPage from "./pages/Trips/TripsPage";
import VehiclesPage from "./pages/Vehicles/VehiclesPage";
import { getAiConfig, getAuditLogs } from "./mock";

// Component tạm để test giao diện
const Placeholder = ({ title }) => (
  <div className="text-brand-text-primary p-8 text-2xl font-bold">{title}</div>
);

// Component quản trị cấu hình AI & tham số kết nối với tầng Mock
const AdminAiConfigPage = () => {
  const [config] = useState(() => getAiConfig());
  return (
    <div className="card-glass border-brand-border rounded-3xl border p-8 shadow-xl">
      <h2 className="text-brand-text-primary text-xl font-bold">
        Cấu hình tham số AI & Edge Telemetry
      </h2>
      <p className="text-brand-text-muted mt-1 text-sm">
        Thiết lập ngưỡng phát hiện buồn ngủ, nồng độ CO2 và nhịp thở của tài xế.
      </p>
      <div className="mt-6 max-w-lg space-y-4">
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="text-brand-text-primary text-sm font-semibold">
              Thời gian nhắm mắt báo động
            </p>
            <p className="text-brand-text-subtle text-xs">
              Ngưỡng tính ngủ gật (giây)
            </p>
          </div>
          <span className="bg-brand-blue-night text-brand-blue-light border-brand-border-active/30 rounded-lg border px-3 py-1 font-sans font-bold">
            {config?.microsleep_eye_closed_sec ?? 1.5}s
          </span>
        </div>
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="text-brand-text-primary text-sm font-semibold">
              Ngưỡng CO2 nguy hiểm
            </p>
            <p className="text-brand-text-subtle text-xs">
              Nồng độ CO2 kích hoạt còi cabin (ppm)
            </p>
          </div>
          <span className="text-alert-warning rounded-lg border border-amber-500/30 bg-amber-950/60 px-3 py-1 font-sans font-bold">
            {config?.co2_warning_threshold_ppm ?? 1000} ppm
          </span>
        </div>
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="text-brand-text-primary text-sm font-semibold">
              Độ tin cậy AI tối thiểu
            </p>
            <p className="text-brand-text-subtle text-xs">
              Ngưỡng tự động gửi bằng chứng video
            </p>
          </div>
          <span className="text-alert-safe rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 font-sans font-bold">
            {Math.round((config?.auto_confirm_min ?? 0.85) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Component quản trị nhật ký kiểm toán kết nối với tầng Mock
const AdminAuditLogsPage = () => {
  const [logs] = useState(() => getAuditLogs());
  return (
    <div className="card-glass border-brand-border rounded-3xl border p-8 shadow-xl">
      <h2 className="text-brand-text-primary text-xl font-bold">
        Nhật ký thao tác hệ thống
      </h2>
      <p className="text-brand-text-muted mt-1 text-sm">
        Ghi nhận lịch sử đăng nhập, phân ca và can thiệp thủ công của ban quản
        trị.
      </p>
      <div className="divide-brand-border-dark mt-6 divide-y text-sm">
        {logs?.slice(0, 10).map((log) => (
          <div
            key={log.id}
            className="text-brand-text-secondary flex items-center justify-between py-3"
          >
            <div>
              <span className="text-brand-text-primary font-semibold">
                {log.user_name}
              </span>
              <span className="text-brand-text-subtle mx-1.5">•</span>
              <span>{log.ly_do || log.hanh_dong}</span>
            </div>
            <span className="text-brand-text-subtle ml-4 shrink-0 font-sans text-xs">
              {log.created_at
                ? new Date(log.created_at).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Hôm nay"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/map" element={<DashboardPage />} />
        <Route path="/drivers" element={<DriversPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route
          path="/admin/ai-config"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAiConfigPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminAuditLogsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
