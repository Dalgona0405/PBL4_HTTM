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
        <label className="mb-2 block text-sm font-bold text-gray-700">
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
        className="focus:border-earth focus:ring-earth focus:ring-opacity-20 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-all outline-none focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </div>
  );
}

export default InputField;
