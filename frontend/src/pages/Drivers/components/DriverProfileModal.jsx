import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  HeartPulse,
  History,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  mockDriverBiometricProfiles,
  mockDriverScoreLogs,
} from "../../../mock/mockData";

export default function DriverProfileModal({ isOpen, onClose, driver }) {
  const [activeTab, setActiveTab] = useState("BIOMETRIC"); // "BIOMETRIC" | "SCORE_LOGS"

  if (!isOpen || !driver) return null;

  const driverName = driver.user?.ho_ten || driver.ho_ten || "Tài xế";
  const driverId = driver.id || driver.user_id;

  // Lấy Hồ sơ sinh học của tài xế này
  const bioProfile = mockDriverBiometricProfiles?.find(
    (b) => b.driver_id === driverId,
  ) || {
    khung_gio_yeu_sinh_hoc: ["13:00 - 15:00"],
    thoi_gian_lai_toi_da_khuyen_nghi: 240,
    thoi_gian_lai_trung_binh_truoc_met_moi: 180,
    danh_gia_chung:
      "Thể trạng ổn định, nhịp sinh học giảm nhẹ vào đầu giờ chiều.",
  };

  // Lấy lịch sử sổ cái biến động điểm
  const scoreLogs =
    mockDriverScoreLogs?.filter((l) => l.driver_id === driverId) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="card-glass border-brand-border animate-fade-in-up w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl">
        {/* Header Modal */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="border-brand-primary/40 bg-brand-blue-night text-brand-blue-sky flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-bold">
              {driverName.charAt(0)}
            </div>
            <div>
              <h3 className="text-brand-text-primary text-base font-bold">
                Hồ sơ Tài xế — {driverName}
              </h3>
              <p className="text-brand-text-muted text-xs">
                Bằng {driver.hang_bang_lai || "FC"} • Điểm hiện tại:{" "}
                <span className="text-brand-blue-sky font-bold">
                  {driver.diem_uy_tin ?? driver.uy_tin ?? 100}/100
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text-muted rounded-full p-1 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs chuyển đổi: Hồ sơ sinh học vs Sổ cái điểm */}
        <div className="border-brand-border-dark bg-brand-dark/50 flex border-b px-6 pt-3">
          <button
            onClick={() => setActiveTab("BIOMETRIC")}
            className={`mr-6 flex items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-all ${
              activeTab === "BIOMETRIC"
                ? "border-brand-primary text-brand-blue-sky"
                : "text-brand-text-muted border-transparent hover:text-white"
            }`}
          >
            <HeartPulse className="h-4 w-4" />
            <span>Hồ sơ Nhịp Sinh học (30 ngày)</span>
          </button>

          <button
            onClick={() => setActiveTab("SCORE_LOGS")}
            className={`flex items-center gap-2 border-b-2 pb-3 text-xs font-bold transition-all ${
              activeTab === "SCORE_LOGS"
                ? "border-brand-primary text-brand-blue-sky"
                : "text-brand-text-muted border-transparent hover:text-white"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Sổ cái Điểm Uy tín ({scoreLogs.length})</span>
          </button>
        </div>

        {/* Nội dung Tabs */}
        <div className="max-h-[65vh] overflow-y-auto p-6 text-xs">
          {activeTab === "BIOMETRIC" ? (
            <div className="space-y-4">
              {/* Thẻ chỉ số sinh học */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="border-brand-border-dark bg-brand-dark/70 rounded-2xl border p-4">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Clock className="h-4 w-4" />
                    <span>Khung giờ yếu sinh học</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {bioProfile.khung_gio_yeu_sinh_hoc?.map((slot, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-amber-500/30 bg-amber-950/40 px-2.5 py-1 font-bold text-amber-300"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                  <p className="text-brand-text-subtle mt-2 text-[10px]">
                    Hệ thống sẽ bật cảnh báo nếu xếp ca giao thoa với khung giờ
                    này.
                  </p>
                </div>

                <div className="border-brand-border-dark bg-brand-dark/70 rounded-2xl border p-4">
                  <div className="text-brand-blue-sky flex items-center gap-1.5 font-bold">
                    <Activity className="h-4 w-4" />
                    <span>Thời gian lái tối đa khuyến nghị</span>
                  </div>
                  <p className="text-brand-text-primary mt-2 text-2xl font-black">
                    {bioProfile.thoi_gian_lai_toi_da_khuyen_nghi
                      ? `${(bioProfile.thoi_gian_lai_toi_da_khuyen_nghi / 60).toFixed(1)} Giờ`
                      : "4.0 Giờ"}
                  </p>
                  <p className="text-brand-text-subtle mt-1 text-[10px]">
                    Thời gian lái trung bình trước khi ngáp:{" "}
                    <b>
                      {bioProfile.thoi_gian_lai_trung_binh_truoc_met_moi || 180}{" "}
                      phút
                    </b>
                  </p>
                </div>
              </div>

              {/* Nhận xét chuyên môn */}
              <div className="border-brand-border-active/30 bg-brand-blue-night/20 rounded-2xl border p-4">
                <p className="text-brand-blue-sky text-[11px] font-bold tracking-wider uppercase">
                  Đánh giá Thể trạng AI & Khuyến nghị Xếp ca
                </p>
                <p className="text-brand-text-secondary mt-1.5 text-xs leading-relaxed">
                  {bioProfile.danh_gia_chung ||
                    "Tài xế có thể lực tốt. Đề xuất bố trí thời gian nghỉ ngơi tối thiểu 10 giờ giữa hai ca làm việc liên tiếp."}
                </p>
              </div>
            </div>
          ) : (
            // Tab Sổ cái điểm uy tín
            <div className="space-y-3">
              {scoreLogs.length === 0 ? (
                <div className="text-brand-text-subtle py-12 text-center text-xs">
                  Chưa có bút toán biến động điểm nào được ghi nhận.
                </div>
              ) : (
                scoreLogs.map((log) => {
                  const isDeduction = log.so_diem_thay_doi < 0;
                  return (
                    <div
                      key={log.id}
                      className="border-brand-border-dark bg-brand-dark/70 flex items-center justify-between rounded-2xl border p-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                            isDeduction
                              ? "border-rose-500/40 bg-rose-950/40 text-rose-400"
                              : "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                          }`}
                        >
                          {isDeduction ? (
                            <ArrowDownRight className="h-4 w-4" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-brand-text-primary text-xs font-bold">
                            {log.ly_do}
                          </p>
                          <p className="text-brand-text-subtle text-[10px]">
                            {new Date(log.created_at).toLocaleString("vi-VN")} •
                            Chuyến #{log.trip_id || "501"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-black ${
                            isDeduction
                              ? "text-alert-danger"
                              : "text-emerald-400"
                          }`}
                        >
                          {log.so_diem_thay_doi > 0
                            ? `+${log.so_diem_thay_doi}`
                            : log.so_diem_thay_doi}
                        </span>
                        <p className="text-brand-text-subtle text-[10px]">
                          {log.diem_truoc} &rarr; <b>{log.diem_sau}đ</b>
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-brand-border-dark bg-brand-dark/80 flex justify-end border-t px-6 py-3.5">
          <button
            onClick={onClose}
            className="border-brand-border bg-brand-surface text-brand-text-muted rounded-xl border px-4 py-2 text-xs font-bold transition-all hover:text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
