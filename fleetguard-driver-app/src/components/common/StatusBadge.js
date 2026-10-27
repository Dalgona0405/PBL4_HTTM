import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../../../mobileConfig";

export default function StatusBadge({ label, type = "info" }) {
  const palette = {
    safe: {
      bg: "rgba(16, 185, 129, 0.2)",
      border: "rgba(16, 185, 129, 0.45)",
      text: "#34d399",
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.2)",
      border: "rgba(245, 158, 11, 0.45)",
      text: "#fbbf24",
    },
    danger: {
      bg: "rgba(239, 68, 68, 0.2)",
      border: "rgba(239, 68, 68, 0.45)",
      text: "#f87171",
    },
    info: {
      bg: "rgba(59, 130, 246, 0.2)",
      border: "rgba(59, 130, 246, 0.45)",
      text: COLORS.brandBlueSky,
    },
  };

  const current = palette[type] || palette.info;

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: current.bg, borderColor: current.border },
      ]}
    >
      <Text style={[styles.text, { color: current.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "700",
  },
});