import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(2);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "DANGER",
      message: "Tài xế Phạm Hoàng Nam (43H-567.89) có dấu hiệu ngủ gật!",
      createdAt: "2026-10-22T03:55:12Z",
      isRead: false,
      link: "/logs",
    },
    {
      id: 2,
      type: "WARNING",
      message: "Xe 43H-567.89 nồng độ CO2 buồng lái đạt 1,340 ppm.",
      createdAt: "2026-10-22T04:02:00Z",
      isRead: false,
      link: "/logs",
    },
  ]);

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
      <button
        onClick={handleToggleBell}
        className="text-brand-text-muted hover:bg-brand-surface hover:text-brand-text-primary relative cursor-pointer rounded-xl p-2.5 transition-colors"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="bg-alert-danger border-brand-dark absolute top-1.5 right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full border text-[10px] font-bold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* POPUP THÔNG BÁO */}
      {isOpen && (
        <div className="border-brand-border bg-brand-dark/95 absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl md:w-96">
          <div className="border-brand-border-dark bg-brand-surface/80 flex items-center justify-between border-b px-5 py-3.5">
            <h3 className="text-brand-text-primary text-sm font-bold">
              Thông báo Hệ thống
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-brand-blue-sky cursor-pointer text-xs font-bold hover:text-white hover:underline"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-brand-text-subtle p-8 text-center text-xs">
                Không có thông báo mới nào
              </div>
            ) : (
              <div className="divide-brand-border-dark/60 divide-y">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`hover:bg-brand-surface/70 flex cursor-pointer gap-3.5 p-4 transition-colors ${
                      notif.isRead
                        ? "bg-transparent opacity-60"
                        : "bg-brand-blue-night/25"
                    }`}
                  >
                    <div className="shrink-0 text-xl">
                      {notif.type === "DANGER"
                        ? "🚨"
                        : notif.type === "WARNING"
                          ? "⚠️"
                          : "ℹ️"}
                    </div>
                    <div>
                      <p
                        className={`text-xs leading-relaxed ${
                          notif.isRead
                            ? "text-brand-text-muted"
                            : "text-brand-text-primary font-bold"
                        }`}
                      >
                        {notif.message}
                      </p>
                      <p className="text-brand-text-subtle mt-1.5 font-mono text-[10px]">
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
