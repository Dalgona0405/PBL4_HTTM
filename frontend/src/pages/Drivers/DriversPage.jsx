import React, { useState } from "react";
import toast from "react-hot-toast";
import { getDrivers, updateDriverStatus } from "../../mock";

function DriversPage() {
  const [drivers, setDrivers] = useState(() => getDrivers());

  // Hàm tô màu Điểm uy tín (UI/UX: Giúp người dùng nhìn màu là biết tài xế tốt hay xấu)
  const getScoreBadge = (score) => {
    if (score > 80) {
      return (
        <span className="text-alert-safe font-sans text-lg font-bold">
          {score}
        </span>
      );
    } else if (score >= 65) {
      return (
        <span className="text-alert-warning font-sans text-lg font-bold">
          {score}
        </span>
      );
    } else {
      return (
        <span className="text-alert-danger font-sans text-lg font-bold">
          {score}
        </span>
      );
    }
  };

  // Hàm tạo nhãn Trạng thái hoạt động
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="rounded-e-2xl bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            Đang hoạt động
          </span>
        );
      case "RESTRICTED":
        return (
          <span className="rounded-e-2xl bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
            Hạn chế chạy đêm
          </span>
        );
      case "LOCKED":
        return (
          <span className="rounded-e-2xl bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            Đình chỉ
          </span>
        );
      default:
        return (
          <span className="rounded-e-2xl bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
            {status}
          </span>
        );
    }
  };

  const handleLockDriver = (driver) => {
    try {
      updateDriverStatus(driver.id, "LOCKED", "Khóa thủ công");
      setDrivers(getDrivers());
      toast.success(`Đã đình chỉ tài xế ${driver.ho_ten}`);
    } catch (error) {
      toast.error(
        "Không thể cập nhật trạng thái tài xế. Vui lòng thử lại sau.",
      );
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* HEADER CỦA TRANG */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-brand-text-secondary text-2xl font-bold tracking-tight">
            Quản lý Tài xế & Điểm uy tín
          </h2>
          <p className="text-brand-text-muted mt-1 text-sm">
            Theo dõi điểm uy tín và trạng thái hoạt động của đội ngũ tài xế
          </p>
        </div>
        <button
          onClick={() =>
            toast("Tính năng thêm tài xế sẽ có trong Phase tới!", {
              icon: "👨‍✈️",
            })
          }
          className="bg-brand-primary hover:bg-brand-primary-hover flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
        >
          <span>+ Thêm tài xế mới</span>
        </button>
      </div>

      {/* BẢNG DANH SÁCH TÀI XẾ */}
      <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-brand-border-dark bg-brand-dark/70 text-brand-text-muted border-b text-xs font-bold tracking-wider uppercase">
                <th className="rounded-tl-2xl px-4 py-4">Tài xế</th>
                <th className="px-4 py-4">Bằng lái</th>
                <th className="px-4 py-4">Xe ca hiện tại</th>
                <th className="px-4 py-4 text-center">Điểm uy tín</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="rounded-tr-2xl px-4 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-brand-border-dark/60 divide-y text-sm">
              {drivers.map((driver) => (
                <tr
                  key={driver.id}
                  className="hover:bg-brand-surface/80 transition-colors"
                >
                  {/* Cột 1: Thông tin tài xế */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="border-brand-border-active/40 bg-brand-blue-night text-brand-blue-light flex h-10 w-10 items-center justify-center rounded-2xl border font-bold shadow-sm">
                        {driver.ho_ten.charAt(0)}
                      </div>
                      <div>
                        <div className="text-brand-text-primary font-bold">
                          {driver.ho_ten}
                        </div>
                        <div className="text-brand-text-subtle font-sans text-xs">
                          {driver.sdt}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Cột 2: Bằng lái */}
                  <td className="text-brand-text-secondary px-4 py-4 font-sans font-bold">
                    Hạng {driver.bang_lai}
                  </td>

                  {/* Cột 3: Xe ca hiện tại */}
                  <td className="px-4 py-4">
                    {driver.xe_hien_tai ? (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
                        <span className="border-brand-border bg-brand-dark text-brand-text-primary rounded-lg border px-2.5 py-1 font-sans text-xs font-bold shadow-xs">
                          {driver.xe_hien_tai}
                        </span>
                      </div>
                    ) : (
                      <span className="border-brand-border-dark bg-brand-surface/40 text-brand-text-subtle rounded-lg border px-2.5 py-1 text-xs italic">
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
                    <button
                      onClick={() =>
                        toast(`Hồ sơ sinh học của ${driver.ho_ten}`, {
                          icon: "📊",
                        })
                      }
                      className="text-brand-blue-sky mr-3 text-xs font-bold hover:underline"
                    >
                      Hồ sơ
                    </button>
                    {driver.trang_thai_tai_xe !== "LOCKED" && (
                      <button
                        onClick={() => handleLockDriver(driver)}
                        className="text-alert-danger text-xs font-bold hover:underline"
                      >
                        Đình chỉ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DriversPage;
