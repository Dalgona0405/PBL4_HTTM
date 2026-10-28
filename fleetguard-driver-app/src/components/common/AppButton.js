import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../mobileConfig";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  icon: Icon,
  disabled = false,
  isLoading = false,
  style,
}) {
  const bgMap = {
    primary: COLORS.brandPrimary,
    secondary: COLORS.brandDark,
    warning: COLORS.alertWarning,
    danger: COLORS.alertDanger,
    safe: COLORS.alertSafe,
  };

  const borderMap = {
    primary: COLORS.brandPrimary,
    secondary: COLORS.brandBorder,
    warning: COLORS.alertWarning,
    danger: COLORS.alertDanger,
    safe: COLORS.alertSafe,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.btn,
        {
          backgroundColor: bgMap[variant] || COLORS.brandPrimary,
          borderColor: borderMap[variant] || COLORS.brandBorder,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={COLORS.textPrimary} size="small" />
      ) : (
        <View style={styles.content}>
          {Icon && <Icon size={17} color={COLORS.textPrimary} />}
          <Text style={styles.text}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});