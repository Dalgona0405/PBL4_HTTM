import { Award, CheckCircle2, ShieldAlert } from "lucide-react";

const DEFAULT_DRIVERS = [
  {
    id: 1,
    ho_ten: "Lê Minh Tuấn",
    hang_bang_lai: "FC",
    so_dien_thoai: "0905.333.444",
    diem_uy_tin: 95,
    cap_canh_bao: "NORMAL",
  },
  {
    id: 2,
    ho_ten: "Võ Quốc Bảo",
    hang_bang_lai: "C",
    so_dien_thoai: "0905.666.777",
    diem_uy_tin: 85,
    cap_canh_bao: "NORMAL",
  },
  {
    id: 3,
    ho_ten: "Phạm Hoàng Nam",
    hang_bang_lai: "C",
    so_dien_thoai: "0905.444.555",
    diem_uy_tin: 58,
    cap_canh_bao: "WARNING_YELLOW",
  },
  {
    id: 4,
    ho_ten: "Đặng Văn Hùng",
    hang_bang_lai: "FC",
    so_dien_thoai: "0905.555.666",
    diem_uy_tin: 15,
    cap_canh_bao: "SUSPENDED_RED",
  },
];

export default function DriverPerformanceCard() {
  const topSafeDrivers = DEFAULT_DRIVERS.filter((d) => d.diem_uy_tin >= 80);
  const riskDrivers = DEFAULT_DRIVERS.filter((d) => d.diem_uy_tin <= 65);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* CỘT TRÁI: TOP TÀI XẾ GƯƠNG MẪU (XANH) */}
      <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
        <div className="border-brand-border-dark flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-brand-text-primary text-sm font-bold">
                Tài xế Tiêu biểu & An toàn (Top Safety)
              </h3>
              <p className="text-brand-text-muted text-[11px]">
                Điểm uy tín cao, đủ điều kiện nhận điểm thưởng sau chuyến
              </p>
            </div>
          </div>
          <span className="rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
            Thưởng +5đ/+10đ
          </span>
        </div>

        <div className="divide-brand-border-dark/60 mt-3 divide-y">
          {topSafeDrivers.map((driver) => (
            <div
              key={driver.id}
              className="flex items-center justify-between py-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 text-xs font-bold text-white shadow-md">
                  {driver.ho_ten.charAt(0)}
                </div>
                <div>
                  <p className="text-brand-text-primary text-xs font-bold">
                    {driver.ho_ten}
                  </p>
                  <p className="text-brand-text-subtle text-[11px]">
                    Bằng {driver.hang_bang_lai} • SĐT: {driver.so_dien_thoai}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-emerald-400">
                  {driver.diem_uy_tin}
                </span>
                <span className="text-brand-text-subtle text-xs">/100</span>
                <p className="flex items-center justify-end gap-1 text-[10px] font-semibold text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> Chuẩn ISO
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: DIỆN GIÁM SÁT RỦI RO (VÀNG / ĐỎ) */}
      <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-xl">
        <div className="border-brand-border-dark flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/40 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-brand-text-primary text-sm font-bold">
                Danh sách Giám sát Rủi ro (Watchlist)
              </h3>
              <p className="text-brand-text-muted text-[11px]">
                Tài xế chạm ngưỡng Cảnh cáo Vàng (&le; 65đ) hoặc Báo động Đỏ
                (&le; 20đ)
              </p>
            </div>
          </div>
          <span className="rounded-lg border border-rose-500/30 bg-rose-950/60 px-2 py-0.5 text-[10px] font-bold text-rose-400">
            Cần can thiệp
          </span>
        </div>

        <div className="divide-brand-border-dark/60 mt-3 divide-y">
          {riskDrivers.map((driver) => {
            const isSuspended =
              driver.cap_canh_bao === "SUSPENDED_RED" ||
              driver.diem_uy_tin <= 20;

            return (
              <div
                key={driver.id}
                className="flex items-center justify-between py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md ${
                      isSuspended ? "animate-pulse bg-rose-600" : "bg-amber-600"
                    }`}
                  >
                    {driver.ho_ten.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-brand-text-primary text-xs font-bold">
                        {driver.ho_ten}
                      </p>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                          isSuspended
                            ? "border border-rose-500/40 bg-rose-950 text-rose-300"
                            : "border border-amber-500/40 bg-amber-950 text-amber-300"
                        }`}
                      >
                        {isSuspended ? "Đình chỉ" : "Cảnh cáo"}
                      </span>
                    </div>
                    <p className="text-brand-text-subtle text-[11px]">
                      Bằng {driver.hang_bang_lai} • SĐT: {driver.so_dien_thoai}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-base font-black ${
                      isSuspended ? "text-rose-400" : "text-amber-400"
                    }`}
                  >
                    {driver.diem_uy_tin}
                  </span>
                  <span className="text-brand-text-subtle text-xs">/100</span>
                  <p
                    className={`text-[10px] font-bold ${
                      isSuspended ? "text-rose-400" : "text-amber-400"
                    }`}
                  >
                    {isSuspended ? "HARD_BLOCK xếp ca" : "Giảm 30% ca đêm"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
