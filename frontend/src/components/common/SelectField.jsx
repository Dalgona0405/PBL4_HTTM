import React from "react";

// Khuôn đúc cho Ô xổ xuống (Dropdown)
function SelectField({
  label,
  name,
  value,
  onChange,
  options = [], // Danh sách các lựa chọn (Mảng)
  required,
  disabled,
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-bold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="focus:border-earth focus:ring-earth focus:ring-opacity-20 w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 transition-all outline-none focus:bg-white focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="">-- Vui lòng chọn --</option>
        {/* Duyệt qua mảng options để in ra các thẻ <option> */}
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
