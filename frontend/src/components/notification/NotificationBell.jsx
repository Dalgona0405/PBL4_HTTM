import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Tạm thời comment axiosClient lại khi chưa có BE, dùng Mock Data
// import axiosClient from '../../api/axiosClient';
// import { API_URLS } from '../../api/api';

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(2); // Giả lập có 2 thông báo chưa đọc
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Mock data thông báo của hệ thống IoT
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "DANGER",
      message: "🚨 Tài xế Nguyễn Văn Hùng vừa có dấu hiệu ngủ gật!",
      createdAt: "2026-09-24T13:30:00Z",
      isRead: false,
      link: "/logs",
    },
    {
      id: 2,
      type: "WARNING",
      message: "⚠️ Xe 43C-128.45 có nồng độ CO2 vượt mức 1000ppm.",
      createdAt: "2026-09-24T13:15:00Z",
      isRead: false,
      link: "/logs",
    },
  ]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleBell = () => setIsOpen(!isOpen);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
    setUnreadCount(0);
    toast.success("Đã đánh dấu đọc tất cả!");
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* NÚT QUẢ CHUÔNG */}
      <button
        onClick={handleToggleBell}
        className="relative rounded-xl p-2 text-brand-text-muted transition-colors hover:bg-brand-surface hover:text-brand-text-primary"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="bg-alert-danger absolute top-1 right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-brand-dark text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* HỘP THOẠI DROPDOWN */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-brand-border bg-brand-dark shadow-2xl md:w-96">
          <div className="flex items-center justify-between border-b border-brand-border-dark bg-brand-surface/70 px-5 py-3.5">
            <h3 className="text-sm font-bold text-brand-text-primary">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-bold text-brand-blue-sky hover:underline"
              >
                Đánh dấu đọc hết ✔️
              </button>
            )}
          </div>

          <div className="max-h-100 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-brand-text-subtle text-xs">
                Không có thông báo nào.
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex cursor-pointer gap-3.5 border-b border-brand-border-dark/60 p-3.5 transition-colors hover:bg-brand-surface/60 ${
                      notif.isRead ? "bg-transparent opacity-60" : "bg-brand-blue-night/20"
                    }`}
                  >
                    <div className="text-xl">
                      {notif.type === "DANGER"
                        ? "🚨"
                        : notif.type === "WARNING"
                          ? "⚠️"
                          : "💬"}
                    </div>
                    <div>
                      <p
                        className={`text-xs ${notif.isRead ? "text-brand-text-muted" : "font-bold text-brand-text-primary"}`}
                      >
                        {notif.message}
                      </p>
                      <p className="mt-1 text-[11px] text-brand-text-subtle">
                        {new Date(notif.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
