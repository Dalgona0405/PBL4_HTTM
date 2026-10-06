import React, { useState } from "react";
import mockVehicles from "../../mock/mockVehicles.json";

function VehiclesPage() {
  const [vehicles, setVehicles] = useState(mockVehicles);

  const getVehicleStatusBadge = (status) => {
    switch (status) {
      case "DANG_CHAY":
        return (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
            Đang vận hành
          </span>
        );
      case "SAN_SANG":
        return (
          <span className="text-brand-blue rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold">
            Sẵn sàng nhận ca
          </span>
        );
      case "BAO_DUONG":
        return (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
            Đang bảo dưỡng 🔧
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
          <h2 className="text-2xl font-bold text-slate-800">
            Quản lý Đội xe & Thiết bị IoT
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kiểm soát tình trạng phương tiện và kết nối của các hộp đen AI trên
            xe
          </p>
        </div>
        <button className="bg-brand-blue flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-lg">
          <span>🚚</span> + Thêm phương tiện mới
        </button>
      </div>

      {/* DANH SÁCH XE */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                <th className="rounded-tl-xl px-4 py-4">Biển số & Loại xe</th>
                <th className="px-4 py-4">Tải trọng</th>
                <th className="px-4 py-4">Thiết bị IoT (Edge AI)</th>
                <th className="px-4 py-4">Tài xế phụ trách</th>
                <th className="px-4 py-4">Trạng thái xe</th>
                <th className="rounded-tr-xl px-4 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((v) => (
                <tr
                  key={v.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {/* Biển số & Loại xe */}
                  <td className="px-4 py-4">
                    <div className="font-mono text-base font-bold text-slate-800">
                      {v.bien_so}
                    </div>
                    <div className="text-xs text-slate-500">{v.loai_xe}</div>
                  </td>

                  {/* Tải trọng */}
                  <td className="px-4 py-4 font-medium text-slate-700">
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
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {v.iot_device.mac_address}
                      </span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {v.iot_device.phien_ban}
                    </div>
                  </td>

                  {/* Tài xế phụ trách */}
                  <td className="px-4 py-4">
                    {v.tai_xe_hien_tai ? (
                      <span className="font-semibold text-slate-800">
                        {v.tai_xe_hien_tai}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
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
                    <button className="text-brand-blue mr-3 text-xs font-bold hover:underline">
                      Lịch sử chạy
                    </button>
                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800">
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
