import { Camera, CheckCircle2, Sparkles, WifiOff, X } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../mobileConfig";
import AppButton from "../../components/common/AppButton";

export default function CalibrationModal({
  visible,
  onClose,
  isOfflineMode,
  driverName,
  onFinishCalibration,
}) {
  const [scanning, setScanning] = useState(false);

  const handleStartScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      onFinishCalibration();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Hiệu chuẩn Khuôn mặt Đầu ca (SRS § 6.2)
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.cameraFrame}>
            <Camera size={48} color={COLORS.brandBlueSky} />
            <Text style={styles.cameraTitle}>
              {scanning
                ? "Đang thu thập 10 khung hình IR (850nm)..."
                : `Camera IR Pi 4 • Tài xế: ${driverName}`}
            </Text>
            <Text style={styles.cameraSub}>
              {scanning
                ? "Đang tính ngưỡng mắt EAR Baseline & đối khớp Face Embedding..."
                : "Nhìn thẳng vào camera buồng lái và chớp mắt tự nhiên trong 5 giây"}
            </Text>
          </View>

          {isOfflineMode ? (
            <View style={styles.offlineBanner}>
              <WifiOff size={16} color="#fbbf24" />
              <Text style={styles.offlineText}>
                Chế độ Tạm ứng Ngoại tuyến (Offline Handover): Lưu gói ảnh vào
                SQLite `PENDING_CALIBRATION` trên Pi 4 với ngưỡng `default_ear_baseline = 0.28`.
              </Text>
            </View>
          ) : (
            <View style={styles.onlineBanner}>
              <Sparkles size={16} color="#34d399" />
              <Text style={styles.onlineText}>
                Kết nối Cloud 4G sẵn sàng: Xác thực thực thể sống (Liveness) &
                cá nhân hóa ngưỡng mắt `ear_baseline`.
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <AppButton
              title="Hủy"
              variant="secondary"
              onPress={onClose}
              style={{ flex: 1 }}
            />
            <AppButton
              title={
                isOfflineMode
                  ? "Tạm ứng Offline & Chạy"
                  : "Chụp IR & Bắt đầu chuyến"
              }
              icon={CheckCircle2}
              isLoading={scanning}
              onPress={handleStartScan}
              style={{ flex: 2 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    justifyContent: "center",
    padding: 18,
  },
  modalBox: {
    backgroundColor: COLORS.brandSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: "800",
  },
  cameraFrame: {
    backgroundColor: COLORS.brandDeep,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.brandPrimary,
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  cameraTitle: {
    color: COLORS.textPrimary,
    fontWeight: "700",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center",
  },
  cameraSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
    lineHeight: 16,
  },
  offlineBanner: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.alertWarningBg,
    borderColor: "rgba(245, 158, 11, 0.45)",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  offlineText: {
    flex: 1,
    color: "#fde68a",
    fontSize: 11,
    lineHeight: 16,
  },
  onlineBanner: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: COLORS.alertSafeBg,
    borderColor: "rgba(16, 185, 129, 0.45)",
    borderWidth: 1,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  onlineText: {
    flex: 1,
    color: "#a7f3d0",
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
  },
});