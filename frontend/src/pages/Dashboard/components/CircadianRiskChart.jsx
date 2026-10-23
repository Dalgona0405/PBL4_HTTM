// src/pages/Dashboard/components/CircadianRiskChart.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function CircadianRiskChart() {
  const hourlyData = [
    { hour: "00h", count: 4, isDangerZone: true },
    { hour: "01h", count: 8, isDangerZone: true },
    { hour: "02h", count: 14, isDangerZone: true }, // Đỉnh điểm ca đêm
    { hour: "03h", count: 11, isDangerZone: true },
    { hour: "04h", count: 5, isDangerZone: true },
    { hour: "05h", count: 2, isDangerZone: false },
    { hour: "06h", count: 1, isDangerZone: false },
    { hour: "07h", count: 0, isDangerZone: false },
    { hour: "08h", count: 1, isDangerZone: false },
    { hour: "09h", count: 2, isDangerZone: false },
    { hour: "10h", count: 1, isDangerZone: false },
    { hour: "11h", count: 3, isDangerZone: false },
    { hour: "12h", count: 4, isDangerZone: false },
    { hour: "13h", count: 12, isDangerZone: true }, // Đỉnh điểm đầu giờ chiều
    { hour: "14h", count: 15, isDangerZone: true }, // Hạ đường huyết & buồn ngủ
    { hour: "15h", count: 9, isDangerZone: true },
    { hour: "16h", count: 3, isDangerZone: false },
    { hour: "17h", count: 2, isDangerZone: false },
    { hour: "18h", count: 2, isDangerZone: false },
    { hour: "19h", count: 1, isDangerZone: false },
    { hour: "20h", count: 3, isDangerZone: false },
    { hour: "21h", count: 4, isDangerZone: false },
    { hour: "22h", count: 6, isDangerZone: false },
    { hour: "23h", count: 7, isDangerZone: true },
  ];

  const maxCount = 15;
  const trackHeightPx = 140;

  return (
    <div className="card-glass border-brand-border rounded-3xl border p-6 shadow-2xl">
      {/* Tiêu đề & Chú giải */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-brand-text-primary text-base font-bold tracking-tight">
            Phân bổ Rủi ro theo Nhịp Sinh học 24 Giờ (Circadian Risk Curve)
          </h2>
          <p className="text-brand-text-muted text-xs">
            Chứng minh thực nghiệm hai vùng trũng sinh học: Ca đêm (01h - 04h)
            &amp; Đầu giờ chiều (13h - 15h)
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span> Khung giờ
            rủi ro cao
          </span>
          <span className="text-brand-text-muted flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span> Khung giờ
            an toàn
          </span>
        </div>
      </div>

      {/* Vùng cột biểu đồ */}
      <div className="mt-8">
        <div className="flex items-end gap-1.5 sm:gap-2.5">
          {hourlyData.map((item, idx) => {
            const barHeight = Math.max(
              8,
              Math.round((item.count / maxCount) * trackHeightPx),
            );

            return (
              <div
                key={idx}
                className="group relative flex flex-1 flex-col items-center"
              >
                {/* TOOLTIP */}
                <div className="pointer-events-none absolute -top-14 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center rounded-xl border border-slate-700/80 bg-slate-900/95 px-3 py-1.5 shadow-2xl backdrop-blur-md group-hover:flex">
                  <span className="text-xs font-bold whitespace-nowrap text-amber-400">
                    {item.count} vụ vi phạm
                  </span>
                  <span className="text-[10px] font-medium whitespace-nowrap text-slate-400">
                    Khung giờ {item.hour}
                  </span>
                  {/* Mũi tên trỏ xuống đỉnh cột */}
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-slate-700/80 bg-slate-900/95"></div>
                </div>

                {/* Khung rãnh cột */}
                <div
                  style={{ height: `${trackHeightPx}px` }}
                  className="bg-brand-dark/70 border-brand-border-dark/40 relative flex w-full items-end overflow-hidden rounded-lg border"
                >
                  <div
                    style={{ height: `${barHeight}px` }}
                    className={`w-full rounded-t-md transition-all duration-300 group-hover:brightness-125 ${
                      item.isDangerZone
                        ? "bg-linear-to-t from-rose-600 via-rose-500 to-amber-400 shadow-sm shadow-rose-500/40"
                        : "bg-linear-to-t from-blue-600 to-cyan-400 shadow-sm shadow-blue-500/20"
                    }`}
                  />
                </div>

                {/* Nhãn giờ */}
                <span className="text-brand-text-subtle mt-2 text-[9px] sm:text-[10px]">
                  {item.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Khuyến nghị nghiệp vụ */}
      <div className="border-brand-border-dark bg-brand-dark/50 mt-6 flex flex-col gap-3 rounded-2xl border p-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            <b>Khuyến nghị thuật toán Smart Scheduling:</b> Giảm 30% tần suất
            xếp ca đêm liên tục cho tài xế có điểm cảnh cáo vàng.
          </span>
        </div>
        <span className="bg-brand-surface border-brand-border text-brand-text-muted self-start rounded-lg border px-2.5 py-1 text-[11px] sm:self-auto">
          SRS 4.1 § 6.4
        </span>
      </div>
    </div>
  );
}
