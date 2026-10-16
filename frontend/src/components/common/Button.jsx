import React from "react";

function Button({
  children, // Chữ hoặc Icon bên trong nút
  onClick, // Hàm chạy khi click
  type = "button", // Loại nút (button, submit)
  isLoading = false, // Trạng thái đang tải
  disabled = false, // Trạng thái khóa nút
  variant = "primary", // Màu sắc: "primary" | "secondary" | "danger" | "outline"
  fullWidth = false, // chỉ true ở Login
  className = "",
}) {
  const baseStyle =
    "px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ";
  const variants = {
    primary:
      "bg-brand-primary text-white hover:bg-brand-primary-hover shadow-lg shadow-blue-500/25 hover:-translate-y-0.5",
    secondary:
      "bg-brand-surface text-brand-text-secondary hover:bg-brand-surface-elevated border border-brand-border",
    danger: "bg-alert-danger text-white hover:bg-red-600 shadow-md",
    outline: "border border-gray-200 bg-white text-slate-600 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? "w-full py-3.5 text-base" : ""} ${className}`}
    >
      {isLoading ? (
        <>
          <span className="animate-spin text-xl">⏳</span> Đang xử lý...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
