import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notification/NotificationBell";
import logoImg from "../../assets/Logo.png";
import toast from "react-hot-toast";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800">
      {/* ========================================================================= */}
      {/* SIDEBAR (CỘT TRÁI) */}
      {/* ========================================================================= */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white shadow-xs">
        <div
          className="flex h-20 items-center justify-center border-b border-slate-100 px-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logoImg}
            alt="Logo"
            className="h-12 w-auto max-w-[210px] object-contain"
          />
        </div>

        {/* AI TELEMATICS ENGINE STATUS CARD */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 p-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-xs">
              <span className="text-xs">⚡</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-800">
                AI Telematics Engine
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                Online • Latency 24ms
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION MENU ITEMS */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {/* Bản đồ Giám sát GPS (Trang chủ) */}
          <button
            onClick={() => navigate("/")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>Bản đồ Giám sát GPS</span>
          </button>

          {/* Quản lý phương tiện */}
          <button
            onClick={() => navigate("/vehicles")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/vehicles")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>Quản lý phương tiện</span>
          </button>

          {/* Quản lý tài xế */}
          <button
            onClick={() => navigate("/drivers")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/drivers")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>Quản lý tài xế</span>
          </button>

          {/* Xác thực Vi phạm AI */}
          <button
            onClick={() => navigate("/logs")}
            className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/logs")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <span>Xác thực Vi phạm AI</span>
            </div>
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              14
            </span>
          </button>

          {/* Lịch phân ca & Smart Schedule */}
          <button
            onClick={() => navigate("/trips")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/trips")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>Lịch phân ca & Smart Schedule</span>
          </button>

          {user?.role === "ADMIN" &&(
            <>
              <div className="pt-6 pb-2">
                <p className="px-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                  Quản trị hệ thống
                </p>
              </div>
         {/* Báo cáo & Audit Log */}
          <button
            onClick={() => navigate("/admin/audit-logs")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/admin/audit-logs")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>Báo cáo & Audit Log</span>
          </button>

          {/* Cài đặt Ngưỡng AI */}
          <button
            onClick={() => navigate("/admin/ai-config")}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive("/admin/ai-config")
                ? "border-r-4 border-blue-600 bg-blue-50/90 text-blue-700 shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span>Cài đặt Ngưỡng AI</span>
          </button>
          </>
          )}
        </nav>

        {/* BOTTOM HOTLINE CỨU HỘ CARD */}
        <div className="p-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800">
              <span>Hotline Cứu hộ SOS</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Hỗ trợ ứng cứu khẩn cấp đội xe 24/7
            </p>
            <a
              href="tel:19008899"
              className="mt-2.5 block w-full rounded-xl bg-white py-1.5 font-mono text-xs font-extrabold text-blue-700 shadow-xs hover:bg-blue-600 hover:text-white transition-all"
            >
              1900 8899
            </a>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOP HEADER THANH TÌM KIẾM THEO ĐÚNG ẢNH MẪU */}
        <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-xs">
          {/* SEARCH BAR RỘNG THEO ĐÚNG HÌNH */}
          <div className="flex-1 max-w-2xl mr-4">
            <div className="relative">
              <span className="absolute top-2.5 left-3.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Tra cứu nhanh biển số (VD: 29H-882.12), tài xế, mã chuyến đi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pr-4 pl-9 text-xs outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* RIGHT CONTROLS: BÁO ĐỘNG KHẨN CẤP + CHUÔNG + USER PROFILE */}
          <div className="flex items-center gap-4">
            {/* NOTIFICATION BELL */}
            <NotificationBell />

            {/* USER PROFILE INFO */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
                {user?.name ? user.name.charAt(0) : "TN"}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-900">
                  {user?.name || "Trần Nam"}
                </p>
                <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Trực ban Điều phối
                </p>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Đăng xuất"
              >
                🚪
              </button>
            </div>
          </div>
        </header>

        {/* MAIN OUTLET CONTAINER */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
