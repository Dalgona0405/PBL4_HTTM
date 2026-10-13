import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {LayoutDashboard, Map, Truck, ShieldAlert, Users, CalendarClock, BarChart3, Sliders, LogOut, PhoneCall} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notification/NotificationBell";
import logoImg from "../../assets/Logo.png";

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
    if (path === "/map" && location.pathname === "/map") return true;
    if (path !== "/" && path !== "/map" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const primaryNavItems = [
    {
      id: "overview",
      path: "/",
      label: "Tổng quan",
      tag: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "gps-map",
      path: "/map",
      label: "Bản đồ GPS",
      tag: "Live Tracking",
      icon: Map,
    },
    {
      id: "fleet",
      path: "/vehicles",
      label: "Quản lý Đội xe",
      tag: "Fleet",
      icon: Truck,
    },
    {
      id: "violations",
      path: "/logs",
      label: "Xác thực Vi phạm AI",
      tag: "14 Vi phạm",
      hasBadgeDot: true,
      icon: ShieldAlert,
    },
    {
      id: "drivers",
      path: "/drivers",
      label: "Quản lý Tài xế",
      tag: "Biometrics",
      icon: Users,
    },
    {
      id: "shifts",
      path: "/trips",
      label: "Lịch Phân ca",
      tag: "Schedule",
      icon: CalendarClock,
    },
  ];

  const adminNavItems = [
    {
      id: "audit",
      path: "/admin/audit-logs",
      label: "Báo cáo & Audit Log",
      tag: "Reports",
      icon: BarChart3,
    },
    {
      id: "ai-config",
      path: "/admin/ai-config",
      label: "Cài đặt Ngưỡng AI",
      tag: "Settings",
      icon: Sliders,
    },
  ];

  return (
    <div className="flex h-screen bg-[#090d16] font-sans text-slate-100 overflow-hidden">
      <aside className="flex w-20 flex-col items-center border-r border-slate-800 bg-[#0f172a] py-4 shadow-xl shrink-0 z-20">
        <button
          onClick={() => navigate("/")}
          className="flex h-12 w-12 items-center justify-center rounded-2xl hover:bg-slate-800/80 transition-all cursor-pointer mb-5"
          title="Trang chủ FleetGuard"
        >
          <img
            src={logoImg}
            alt="Logo"
            className="h-9 w-9 object-contain drop-shadow"
          />
        </button>

        <nav className="flex-1 flex flex-col items-center gap-2.5 w-full px-3 overflow-y-auto overflow-x-hidden">
          {primaryNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group flex justify-center">
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/35 border border-blue-400/40"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                  {item.hasBadgeDot && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                  )}
                </button>
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden group-hover:flex items-center z-50">
                  <div className="rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-100 shadow-2xl whitespace-nowrap flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.tag && (
                      <span className="rounded-md bg-blue-500/20 border border-blue-400/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="w-8 h-px bg-slate-800 my-1" />
          {adminNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group flex justify-center">
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/35 border border-blue-400/40"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/80"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                </button>

                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden group-hover:flex items-center z-50">
                  <div className="rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-100 shadow-2xl whitespace-nowrap flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.tag && (
                      <span className="rounded-md bg-slate-800 border border-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="flex flex-col items-center gap-2.5 pt-3 border-t border-slate-800 w-full px-3">
          <div className="relative group flex justify-center">
            <a
              href="tel:19008899"
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              aria-label="Hotline Cứu hộ 1900 8899"
            >
              <PhoneCall className="h-4.5 w-4.5" />
            </a>
            <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden group-hover:flex items-center z-50">
              <div className="rounded-xl border border-rose-500/30 bg-slate-900 px-3 py-1.5 text-xs font-bold text-rose-400 shadow-2xl whitespace-nowrap">
                Hotline SOS: 1900 8899
              </div>
            </div>
          </div>
          <div className="relative group flex justify-center">
            <button
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all cursor-pointer"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
            <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3.5 hidden group-hover:flex items-center z-50">
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 shadow-2xl whitespace-nowrap">
                Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden bg-[#090d16]">
        <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0f172a] px-8 shadow-md">
          <div className="flex-1 max-w-xl mr-4">
            <div className="relative">
              <span className="absolute top-2.5 left-3.5 text-slate-500 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Tra cứu biển số xe (29C-882.14), tên tài xế, mã ca chạy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[3rem] border border-slate-700/80 bg-slate-900/90 py-2 pr-4 pl-9 text-xs text-slate-100 outline-none focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* PHẦN ĐIỀU KHIỂN BÊN PHẢI */}
          <div className="flex items-center gap-4">
            <NotificationBell />

            {/* THÔNG TIN NGƯỜI DÙNG */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white shadow-md ring-2 ring-blue-500/30">
                {user?.name ? user.name.charAt(0) : "TN"}
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <p className="text-xs font-bold text-slate-100">
                  {user?.name || "Trần Nam"}
                </p>
                <p className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Trực ban Điều phối
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH (GIỮ NGUYÊN VẸN 100%) */}
        <main className="flex-1 overflow-y-auto bg-[#090d16] p-6 text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
