import { CheckSquare, ShieldCheck, Square, Truck } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../mobileConfig";
import AppButton from "../../components/common/AppButton";
import AppCard from "../../components/common/AppCard";

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("tx_hoangnam");
  const [password, setPassword] = useState("123456");
  const [consent, setConsent] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onLogin(username, password, consent);
    } catch (err) {
      Alert.alert("Thông báo", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandBox}>
        <View style={styles.logoCircle}>
          <Truck size={34} color={COLORS.brandBlueSky} />
        </View>
        <Text style={styles.appName}>FleetGuard Driver</Text>
        <Text style={styles.appTag}>
          HỆ THỐNG AN TOÀN BUỒNG LÁI & ĐIỀU PHỐI CA
        </Text>
      </View>

      <AppCard style={styles.formCard}>
        <Text style={styles.formTitle}>Đăng nhập Tài xế</Text>
        <Text style={styles.formSub}>
          Kết nối đồng bộ với thiết bị Raspberry Pi 4 & Cloud
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Mã tài khoản tài xế *</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="VD: tx_hoangnam"
            placeholderTextColor={COLORS.textSubtle}
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mật khẩu *</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu..."
            placeholderTextColor={COLORS.textSubtle}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Điều khoản đồng ý dữ liệu sinh trắc học theo Nghị định 13/2023/NĐ-CP */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setConsent(!consent)}
          style={styles.consentRow}
        >
          {consent ? (
            <CheckSquare size={20} color={COLORS.brandPrimary} />
          ) : (
            <Square size={20} color={COLORS.textMuted} />
          )}
          <Text style={styles.consentText}>
            Tôi đồng ý cho phép thu thập{" "}
            <Text style={styles.highlight}>
              Dữ liệu sinh trắc học khuôn mặt (AES-256)
            </Text>{" "}
            để hiệu chuẩn chống ngủ gật theo Nghị định 13/2023/NĐ-CP.
          </Text>
        </TouchableOpacity>

        <AppButton
          title="Đăng nhập Ca trực"
          icon={ShieldCheck}
          isLoading={loading}
          onPress={handleSubmit}
          style={{ marginTop: 10 }}
        />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.brandDeep,
    justifyContent: "center",
    padding: 20,
  },
  brandBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: COLORS.brandBlueNight,
    borderWidth: 1.5,
    borderColor: COLORS.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: "900",
  },
  appTag: {
    color: COLORS.brandBlueSky,
    fontSize: 10,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.8,
  },
  formCard: {
    padding: 22,
  },
  formTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  formSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 18,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.brandDark,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginVertical: 10,
    backgroundColor: COLORS.brandDark,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
  },
  consentText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  highlight: {
    color: COLORS.brandBlueSky,
    fontWeight: "700",
  },
});