import React, { useState } from "react";
import mockDrivers from "../../mock/mockDrivers.json";

function DriversPage() {
  const [drivers, setDrivers] = useState(mockDrivers);

  // Hàm tô màu Điểm uy tín (UI/UX: Giúp người dùng nhìn màu là biết tài xế tốt hay xấu)
  const getScoreBadge = (score) => {
    if (score > 80) {
      return <span className="text-alert-safe text-lg font-bold">{score}</span>;
    } else if (score >= 65) {
      return (
        <span className="text-alert-warning text-lg font-bold">{score}</span>
      );
    } else {
      return (
        <span className="text-alert-danger text-lg font-bold">{score}</span>
      );
    }
  };

  // Hàm tạo nhãn Trạng thái hoạt động
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            Đang hoạt động
          </span>
        );
      case "RESTRICTED":
        return (
          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
            Hạn chế chạy đêm
          </span>
        );
      case "LOCKED":
        return (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            Đình chỉ
          </span>
        );
      default:
        return (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="animate-fade-in-up rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* HEADER CỦA TRANG */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản lý Tài xế</h2>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi điểm uy tín và trạng thái hoạt động của đội ngũ tài xế
          </p>
        </div>
        <button className="bg-brand-blue rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-lg">
          + Thêm tài xế mới
        </button>
      </div>

      {/* BẢNG DANH SÁCH TÀI XẾ */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-sm text-gray-600">
              <th className="rounded-tl-xl px-4 py-4 font-semibold">Tài xế</th>
              <th className="px-4 py-4 font-semibold">Bằng lái</th>
              <th className="px-4 py-4 font-semibold">Xe đang chạy</th>
              <th className="px-4 py-4 text-center font-semibold">
                Điểm uy tín
              </th>
              <th className="px-4 py-4 font-semibold">Trạng thái</th>
              <th className="rounded-tr-xl px-4 py-4 text-right font-semibold">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {drivers.map((driver) => (
              <tr
                key={driver.id}
                className="border-b border-gray-50 transition-colors hover:bg-gray-50"
              >
                {/* Cột 1: Thông tin tài xế */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar giả lập bằng chữ cái đầu */}
                    <div className="text-brand-blue flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold">
                      {driver.ho_ten.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">
                        {driver.ho_ten}
                      </div>
                      <div className="text-xs text-gray-500">{driver.sdt}</div>
                    </div>
                  </div>
                </td>

                {/* Cột 2: Bằng lái */}
                <td className="px-4 py-4 font-medium text-gray-700">
                  Hạng {driver.bang_lai}
                </td>

                {/* Cột 3: Xe hiện tại */}
                {/* Cột 3: Xe ca hiện tại */}
                <td className="px-4 py-4 text-gray-600">
                  {driver.xe_hien_tai ? (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                      <span className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 shadow-sm">
                        {driver.xe_hien_tai}
                      </span>
                    </div>
                  ) : (
                    <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-400 italic">
                      Đang nghỉ ca
                    </span>
                  )}
                </td>

                {/* Cột 4: Điểm uy tín */}
                <td className="px-4 py-4 text-center">
                  {getScoreBadge(driver.uy_tin)}
                </td>

                {/* Cột 5: Trạng thái */}
                <td className="px-4 py-4">
                  {getStatusBadge(driver.trang_thai_tai_xe)}
                </td>

                {/* Cột 6: Thao tác */}
                <td className="px-4 py-4 text-right">
                  <button className="text-brand-blue mr-3 text-sm font-semibold transition-colors hover:text-blue-800">
                    Hồ sơ
                  </button>
                  {driver.trang_thai_tai_xe !== "LOCKED" && (
                    <button className="text-alert-danger text-sm font-semibold transition-colors hover:text-red-800">
                      Khóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriversPage;
