import React from "react";

// Khuôn đúc cho Ô nhập liệu (Text, Email, Password...)
function InputField({
  label, // Tên hiển thị (VD: "Email của bạn")
  name, // Tên biến để lưu data
  type = "text", // Loại input (text, email, password, date...)
  value, // Giá trị hiện tại
  onChange, // Hàm xử lý khi gõ phím
  placeholder, // Chữ mờ gợi ý
  required, // Bắt buộc nhập không?
  disabled, // Có bị khóa không?
}) {
  return (
    <div className="w-full">
      {/* Nếu có truyền label vào thì mới hiển thị */}
      {label && (
        <label className="text-brand-text-primary mb-2 block text-sm font-bold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-brand-border bg-brand-surface/90 px-4 py-2.5 text-sm font-medium text-white placeholder:text-brand-text-muted transition-all outline-none focus:border-brand-primary focus:bg-brand-dark focus:ring-2 focus:ring-brand-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

export default InputField;
