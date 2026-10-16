import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { dataService } from "../../services/dataService";
import formatDateTime from "../../utils/formatDateTime";
import { CalendarClock, AlertTriangle, CheckCircle2, Plus } from "lucide-react";

function TripsPage() {
  const [shifts, setShifts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const data = await dataService.getShifts();
        setShifts(data);
      } catch (err) {
        toast.error("Không thể tải danh sách ca chạy");
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-bold text-emerald-400">
            <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400"></span>
            Đang chạy
          </span>
        );
      case "SCHEDULED":
        return (
          <span className="text-brand-blue-sky inline-flex items-center rounded-full border border-blue-500/30 bg-blue-950/50 px-3 py-1 text-xs font-bold">
            Sắp chạy
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="text-brand-blue-sky inline-flex items-center rounded-full border border-blue-500/30 bg-blue-950/50 px-3 py-1 text-xs font-bold">
            Đã xác nhận
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bg-brand-surface text-brand-text-muted inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-bold">
            Hoàn thành
          </span>
        );
      case "CANCELLED":
      case "DECLINED":
        return (
          <span className="text-alert-danger inline-flex items-center rounded-full border border-rose-500/30 bg-rose-950/50 px-3 py-1 text-xs font-bold">
            Đã hủy / Từ chối
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    if (filterStatus === "ALL") return true;
    return shift.trang_thai === filterStatus;
  });

  return (
    <div className="animate-fade-in-up space-y-6">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-brand-text-primary text-2xl font-bold tracking-tight">
            Quản lý Ca làm việc & Smart Scheduling
          </h2>
          <p className="text-brand-text-muted mt-1 text-sm">
            Điều phối lộ trình và kiểm soát cảnh báo nhịp sinh học theo chuẩn an
            toàn
          </p>
        </div>
        <button
          onClick={() =>
            toast("Chức năng tạo ca sẽ ghép ở bước tiếp theo nha Trúc!", {
              icon: "✨",
            })
          }
          className="bg-brand-primary hover:bg-brand-primary-hover flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          <span>Lập ca phân công mới</span>
        </button>
      </div>

      {/* DANH SÁCH CA LÀM VIỆC */}
      <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
        {/* TABS LỌC */}
        <div className="border-brand-border-dark mb-6 flex gap-2 border-b pb-4">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "IN_PROGRESS", label: "Đang chạy" },
            { key: "SCHEDULED", label: "Sắp ca" },
            { key: "COMPLETED", label: "Hoàn thành" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                filterStatus === tab.key
                  ? "bg-brand-primary text-white shadow-md shadow-blue-500/20"
                  : "bg-brand-dark/60 text-brand-text-muted hover:bg-brand-surface hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-brand-border-dark bg-brand-dark/70 text-brand-text-muted border-b text-xs font-bold tracking-wider uppercase">
                <th className="rounded-tl-2xl px-4 py-4">Mã ca</th>
                <th className="px-4 py-4">Tài xế & Phương tiện</th>
                <th className="px-4 py-4">Tuyến đường</th>
                <th className="px-4 py-4">Thời gian dự kiến</th>
                <th className="px-4 py-4">Cảnh báo nhịp sinh học</th>
                <th className="px-4 py-4">Trạng thái</th>
                <th className="rounded-tr-2xl px-4 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-brand-border-dark/60 divide-y">
              {filteredShifts.map((shift) => (
                <tr
                  key={shift.id}
                  className="hover:bg-brand-surface/80 transition-colors"
                >
                  <td className="text-brand-blue-sky px-4 py-4 font-mono font-bold">
                    #{shift.id}
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-brand-text-primary font-bold">
                      {shift.driver.ho_ten}
                    </p>
                    <p className="text-brand-text-subtle font-sans text-xs">
                      Xe:{" "}
                      <span className="text-brand-text-secondary font-medium">
                        {shift.vehicle.bien_so}
                      </span>{" "}
                      ({shift.vehicle.loai_xe})
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-brand-text-secondary font-semibold">
                      {shift.route.ten_tuyen}
                    </p>
                    <p className="text-brand-text-subtle text-xs">
                      {shift.route.khoang_cach_km} km
                    </p>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    <div className="text-brand-text-secondary">
                      Bắt đầu:{" "}
                      <span className="font-semibold text-white">
                        {formatDateTime(shift.thoi_gian_bat_dau_du_kien)}
                      </span>
                    </div>
                    <div className="text-brand-text-muted mt-0.5">
                      Kết thúc:{" "}
                      <span className="font-semibold">
                        {formatDateTime(shift.thoi_gian_ket_thuc_du_kien)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {shift.canh_bao_khi_tao?.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {shift.canh_bao_khi_tao.map((alert, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-950/40 px-2 py-1 text-[11px] font-medium text-amber-300"
                          >
                            <AlertTriangle className="h-3 w-3 shrink-0 text-amber-400" />
                            {alert.ly_do}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Thể trạng tối
                        ưu
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {getStatusBadge(shift.trang_thai)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() =>
                        toast(`Chi tiết ca #${shift.id}`, { icon: "ℹ️" })
                      }
                      className="text-brand-blue-sky hover:text-brand-primary text-xs font-bold hover:underline"
                    >
                      Chi tiết
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

export default TripsPage;
