import { create } from "zustand";
import { getFleetStatus, getViolations } from "../mock";

export const useFleetStore = create((set, get) => ({
  vehicles: getFleetStatus(),
  violations: getViolations(),
  selectedVehicle: null,
  activeAlert: null,

  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  dismissAlert: () => set({ activeAlert: null }),

  updateTelemetry: (telemetryData) => {
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === telemetryData.vehicle_id
          ? {
              ...v,
              telemetry: {
                ...v.telemetry,
                vi_do: telemetryData.vi_do_gps,
                kinh_do: telemetryData.kinh_do_gps,
                toc_do: telemetryData.toc_do_kmh,
                co2_ppm: telemetryData.co2_ppm,
                trang_thai_canh_bao: telemetryData.marker_color,
              },
            }
          : v,
      ),
    }));
  },

  addNewViolation: (newViolation) => {
    set((state) => ({
      violations: [newViolation, ...state.violations],
      activeAlert: newViolation,
    }));
  },

  startSimulation: () => {
    const interval = setInterval(() => {
      const state = get();
      if (!state.vehicles || state.vehicles.length === 0) return;

      const randomVehicle = state.vehicles[0];
      const newLat =
        (randomVehicle.telemetry?.vi_do || 16.068) +
        (Math.random() - 0.5) * 0.002;
      const newLng =
        (randomVehicle.telemetry?.kinh_do || 108.212) +
        (Math.random() - 0.5) * 0.002;

      state.updateTelemetry({
        vehicle_id: randomVehicle.id,
        vi_do_gps: newLat,
        kinh_do_gps: newLng,
        toc_do_kmh: Math.floor(55 + Math.random() * 15),
        co2_ppm: Math.floor(750 + Math.random() * 200),
        marker_color: "GREEN",
      });
    }, 4000);
    return () => clearInterval(interval);
  },
}));
