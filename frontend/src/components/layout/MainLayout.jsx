import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notification/NotificationBell";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper nhỏ để tô sáng (Active) menu khi đang ở đúng trang
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-brand-light flex h-screen font-sans">
      {/* SIDEBAR (CỘT TRÁI) */}
      <aside className="bg-brand-dark flex w-64 flex-col shadow-xl">
        {/* LOGO */}
        <div className="flex h-20 items-center justify-center border-b border-slate-800">
          <h1
            className="text-alert-safe flex cursor-pointer items-center gap-2 text-xl font-extrabold tracking-wide transition-transform hover:scale-105"
            onClick={() => navigate("/")}
          >
            IoT Driver Safety
          </h1>
        </div>

        {/* DANH SÁCH MENU */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          <button
            onClick={() => navigate("/")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            Giám sát Live
          </button>

          <button
            onClick={() => navigate("/drivers")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/drivers")
                ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            Quản lý Tài xế
          </button>

          <button
            onClick={() => navigate("/vehicles")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/vehicles")
                ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            Quản lý phương tiện
          </button>

          <button
            onClick={() => navigate("/trips")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/trips")
                ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            Ca làm việc
          </button>

          <button
            onClick={() => navigate("/logs")}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/logs")
                ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
            }`}
          >
            Lịch sử Cảnh báo
          </button>

          {/* MENU DÀNH RIÊNG CHO QUẢN TRỊ VIÊN */}
          {user?.role === "ADMIN" && (
            <>
              <div className="pt-6 pb-2">
                <p className="px-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Quản trị hệ thống
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/ai-config")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive("/admin/ai-config")
                    ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                Cấu hình AI
              </button>
              <button
                onClick={() => navigate("/admin/audit-logs")}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive("/admin/audit-logs")
                    ? "bg-brand-blue text-white shadow-md shadow-blue-900/30"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                Nhật ký thao tác
              </button>
            </>
          )}
        </nav>
      </aside>

      {/* KHU VỰC NỘI DUNG BÊN PHẢI */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <header className="flex h-20 items-center justify-between border-b border-gray-100 bg-white px-8 shadow-sm">
          {/* TIÊU ĐỀ TRANG TỰ ĐỘNG THEO MENU */}
          <div className="text-sm font-medium text-slate-500">
            Hệ thống Quản lý Vận hành An toàn Xe tải
          </div>

          {/* KHU VỰC THÔNG BÁO & USER PROFILE */}
          <div className="flex items-center gap-5">
            {/* QUẢ CHUÔNG THÔNG BÁO ĐÃ ĐƯỢC TÍCH HỢP */}
            <NotificationBell />

            {/* VẠCH NGĂN CÁCH NHẸ */}
            <div className="h-6 w-px bg-gray-200"></div>

            {/* THÔNG TIN NGƯỜI DÙNG */}
            <div className="flex items-center gap-3">
              <div className="text-brand-blue flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-sm font-bold">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-bold text-slate-800">
                  {user?.name || "Người dùng"}
                </p>
                <p className="text-[11px] font-semibold text-slate-400">
                  {user?.role === "ADMIN" ? "Quản trị viên" : "Điều phối viên"}
                </p>
              </div>
            </div>

            {/* NÚT ĐĂNG XUẤT */}
            <button
              onClick={handleLogout}
              className="hover:text-alert-danger rounded-xl border border-gray-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* KHU VỰC HIỂN THỊ CÁC TRANG CON */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
