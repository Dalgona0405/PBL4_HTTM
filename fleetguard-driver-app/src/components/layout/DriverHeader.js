import { LogOut, Wifi, WifiOff } from "lucide-react-native";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../mobileConfig";

export default function DriverHeader({
  user,
  isOfflineMode,
  onToggleOffline,
  onOpenProfile,
  onLogout,
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onOpenProfile}
        style={styles.userRow}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.ho_ten ? user.ho_ten.charAt(0) : "T"}
          </Text>
        </View>
        <View>
          <Text style={styles.greeting} numberOfLines={1}>
            {user?.ho_ten}
          </Text>
          <Text style={styles.subText}>
            {user?.hang_bang_lai} • Uy tín:{" "}
            <Text style={styles.scoreHighlight}>{user?.diem_uy_tin}/100</Text>
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onToggleOffline}
          style={[
            styles.netBadge,
            isOfflineMode ? styles.netOffline : styles.netOnline,
          ]}
        >
          {isOfflineMode ? (
            <WifiOff size={14} color="#fbbf24" />
          ) : (
            <Wifi size={14} color="#34d399" />
          )}
          <Text
            style={[
              styles.netText,
              { color: isOfflineMode ? "#fbbf24" : "#34d399" },
            ]}
          >
            {isOfflineMode ? "Pi4 Wi-Fi" : "4G Cloud"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
          <LogOut size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.brandDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.brandBorderDark,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 24) + 14 : 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.brandBlueNight,
    borderWidth: 1.5,
    borderColor: COLORS.brandPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.brandBlueSky,
    fontWeight: "900",
    fontSize: 16,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontWeight: "800",
    fontSize: 15,
  },
  subText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  scoreHighlight: {
    color: COLORS.alertWarning,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  netBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  netOnline: {
    backgroundColor: "rgba(16, 185, 129, 0.18)",
    borderColor: "rgba(16, 185, 129, 0.45)",
  },
  netOffline: {
    backgroundColor: "rgba(245, 158, 11, 0.22)",
    borderColor: "rgba(245, 158, 11, 0.5)",
  },
  netText: {
    fontSize: 11,
    fontWeight: "800",
  },
  logoutBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: COLORS.brandSurface,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
  },
});