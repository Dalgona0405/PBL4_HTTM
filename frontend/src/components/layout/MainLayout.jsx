import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Truck,
  ShieldAlert,
  Users,
  CalendarClock,
  BarChart3,
  Sliders,
  LogOut,
  PhoneCall,
  Serach,
} from "lucide-react";
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
    if (path !== "/" && path !== "/map" && location.pathname.startsWith(path))
      return true;
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
    <div className="bg-brand-blue-dark flex h-screen overflow-hidden font-sans text-slate-100">
      <aside className="bg-brand-dark z-20 flex w-20 shrink-0 flex-col items-center border-r border-slate-800 py-4 shadow-xl">
        <button
          onClick={() => navigate("/")}
          className="mb-5 flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl transition-all hover:bg-slate-800/80"
          title="Trang chủ FleetGuard"
        >
          <img
            src={logoImg}
            alt="Logo"
            className="h-9 w-9 object-contain drop-shadow"
          />
        </button>

        <nav className="flex w-full flex-1 flex-col items-center gap-2.5 overflow-x-hidden overflow-y-auto px-3">
          {primaryNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <div key={item.id} className="group relative flex justify-center">
                <button
                  onClick={() => navigate(item.path)}
                  className={`relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl transition-all ${
                    active
                      ? "border border-blue-400/40 bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/35"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                  {item.hasBadgeDot && (
                    <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                    </span>
                  )}
                </button>
                <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3.5 hidden -translate-y-1/2 items-center group-hover:flex">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-100 shadow-2xl">
                    <span>{item.label}</span>
                    {item.tag && (
                      <span className="rounded-md border border-blue-400/30 bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                        {item.tag}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div className="my-1 h-px w-8 bg-slate-800" />
          {user?.role === "admin" && (
            <div className="my-1 h-px w-8 bg-slate-800" />
          )}
          {user?.role === "admin" &&
            adminNavItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative flex justify-center"
                >
                  <button
                    onClick={() => navigate(item.path)}
                    className={`relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl transition-all ${
                      active
                        ? "bg-linear-to border border-blue-400/40 from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/35"
                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </button>

                  <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3.5 hidden -translate-y-1/2 items-center group-hover:flex">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-100 shadow-2xl">
                      <span>{item.label}</span>
                      {item.tag && (
                        <span className="rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                          {item.tag}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </nav>
        <div className="flex w-full flex-col items-center gap-2.5 border-t border-slate-800 px-3 pt-3">
          <div className="group relative flex justify-center">
            <a
              href="tel:19008899"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-sm transition-all hover:bg-rose-500 hover:text-white"
              aria-label="Hotline Cứu hộ 1900 8899"
            >
              <PhoneCall className="h-4.5 w-4.5" />
            </a>
            <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3.5 hidden -translate-y-1/2 items-center group-hover:flex">
              <div className="rounded-xl border border-rose-500/30 bg-slate-900 px-3 py-1.5 text-xs font-bold whitespace-nowrap text-rose-400 shadow-2xl">
                Hotline SOS: 1900 8899
              </div>
            </div>
          </div>
          <div className="group relative flex justify-center">
            <button
              onClick={handleLogout}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl text-slate-500 transition-all hover:bg-rose-950/30 hover:text-rose-400"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
            <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-3.5 hidden -translate-y-1/2 items-center group-hover:flex">
              <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-300 shadow-2xl">
                Đăng xuất
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="bg-brand-deep flex flex-1 flex-col overflow-hidden">
        <header className="bg-brand-dark flex h-18 shrink-0 items-center justify-between border-b border-slate-800 px-8 shadow-md">
          <div className="mr-4 max-w-xl flex-1">
            <div className="relative">
              <Serach className="h-4 w-4" />
              <input
                type="text"
                placeholder="Tra cứu biển số xe (29C-882.14), tên tài xế, mã ca chạy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-700/80 bg-slate-900/90 py-2 pr-4 pl-9 text-xs text-slate-100 transition-all outline-none placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-900 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
              <div className="bg-linear-to relative flex h-9 w-9 items-center justify-center rounded-full from-blue-500 to-blue-700 text-xs font-bold text-white shadow-md ring-2 ring-blue-500/30">
                {user?.name ? user.name.charAt(0) : "TN"}
              </div>
              <div className="hidden text-left leading-tight sm:block">
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

        <main className="flex-1 overflow-y-auto bg-[#090d16] p-6 text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
