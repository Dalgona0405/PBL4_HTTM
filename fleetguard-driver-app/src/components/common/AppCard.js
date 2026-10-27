import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../mobileConfig";

export default function AppCard({ children, style, variant = "default" }) {
  const borderStyles = {
    default: { borderColor: COLORS.brandBorder },
    active: { borderColor: COLORS.brandPrimary, borderWidth: 1.5 },
    warning: {
      borderColor: "rgba(245, 158, 11, 0.45)",
      backgroundColor: COLORS.alertWarningBg,
    },
    danger: {
      borderColor: "rgba(239, 68, 68, 0.45)",
      backgroundColor: COLORS.alertDangerBg,
    },
    safe: {
      borderColor: "rgba(16, 185, 129, 0.4)",
      backgroundColor: COLORS.alertSafeBg,
    },
  };

  return (
    <View style={[styles.card, borderStyles[variant], style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.brandSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.brandBorder,
    padding: 16,
    marginBottom: 14,
  },
});