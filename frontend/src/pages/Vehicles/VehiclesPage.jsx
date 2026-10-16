import React, { useState } from "react";
import Button from "../../components/common/Button";
import { getFleetStatus } from "../../mock";
import toast from "react-hot-toast";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState(() => getFleetStatus());

  const getVehicleStatusBadge = (status) => {
    switch (status) {
      case "DANG_CHAY":
        return (
          <span className="flex w-max items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            Đang vận hành
          </span>
        );
      case "SAN_SANG":
        return (
          <span className="flex w-max items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            Sẵn sàng nhận ca
          </span>
        );
      case "BAO_DUONG":
        return (
          <span className="flex w-max items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Đang bảo dưỡng
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-brand-text-secondary text-2xl font-bold tracking-tight">
            Quản lý Đội xe & Thiết bị IoT
          </h2>
          <p className="text-brand-text-muted mt-1 text-sm">
            Kiểm soát tình trạng phương tiện và kết nối của các hộp đen AI trên
            xe
          </p>
        </div>
        <button
          onClick={() => {
            toast.error("Chức năng chưa được triển khai");
          }}
          className="bg-brand-primary hover:bg-brand-primary-hover flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
        >
          + Thêm phương tiện mới
        </button>
      </div>

      {/* DANH SÁCH XE */}
      <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-brand-border-dark bg-brand-dark/70 text-brand-text-muted border-b text-xs font-bold tracking-wider uppercase">
                <th className="rounded-tl-xl px-4 py-4">Biển số & Loại xe</th>
                <th className="px-4 py-4">Tải trọng</th>
                <th className="px-4 py-4">Thiết bị IoT (Edge AI)</th>
                <th className="px-4 py-4">Tài xế phụ trách</th>
                <th className="px-4 py-4">Trạng thái xe</th>
                <th className="rounded-tr-xl px-4 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-brand-border-dark/60 divide-y">
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="hover:bg-brand-surface/80 transition-colors"
                >
                  {/* Biển số & Loại xe */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3 font-sans font-semibold">
                      {v.bien_so}
                    </div>
                    <div className="text-brand-text-muted font-sans text-xs font-semibold">
                      {v.loai_xe}
                    </div>
                  </td>

                  {/* Tải trọng */}
                  <td className="text-brand-text-secondary px-4 py-4 font-medium">
                    {v.tai_trong}
                  </td>

                  {/* Thông tin IoT Edge */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          v.iot_device.trang_thai === "ONLINE"
                            ? "bg-emerald-500 shadow-sm"
                            : "bg-slate-300"
                        }`}
                      ></span>
                      <span className="text-brand-text-primary font-sans text-xs font-semibold">
                        {v.iot_device.mac_address}
                      </span>
                    </div>
                    <div className="text-brand-text-muted mt-0.5 font-sans text-[11px] font-semibold">
                      {v.iot_device.phien_ban}
                    </div>
                  </td>

                  {/* Tài xế phụ trách */}
                  <td className="px-4 py-4">
                    {v.tai_xe_hien_tai ? (
                      <span className="text-brand-text-primary font-semibold">
                        {v.tai_xe_hien_tai}
                      </span>
                    ) : (
                      <span className="text-brand-text-muted font-sans text-xs font-semibold italic">
                        Trống tài xế
                      </span>
                    )}
                  </td>

                  {/* Trạng thái xe */}
                  <td className="px-4 py-4">
                    {getVehicleStatusBadge(v.trang_thai)}
                  </td>

                  {/* Thao tác */}
                  <td className="px-4 py-4 text-right">
                    <button className="text-brand-blue-light mr-3 text-xs font-bold hover:underline">
                      Lịch sử chạy
                    </button>
                    <button className="text-brand-text-secondary hover:text-alert-warning text-xs font-bold">
                      Sửa
                    </button>
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

export default VehiclesPage;
