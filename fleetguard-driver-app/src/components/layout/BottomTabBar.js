import { Award, Navigation, ShieldAlert, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../mobileConfig";

export default function BottomTabBar({
  activeTab,
  onChangeTab,
  violationCount = 0,
}) {
  const tabs = [
    { key: "TRIP", label: "Chuyến đi", icon: Navigation },
    { key: "SCORE", label: "Điểm & Sinh học", icon: Award },
    {
      key: "VIOLATIONS",
      label: "Vi phạm",
      icon: ShieldAlert,
      badge: violationCount,
    },
    { key: "PROFILE", label: "Cá nhân", icon: User },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.75}
            onPress={() => onChangeTab(tab.key)}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
          >
            <View style={styles.iconWrap}>
              <Icon
                size={20}
                color={isActive ? COLORS.textPrimary : COLORS.textMuted}
              />
              {tab.badge > 0 && (
                <View style={styles.badgeDot}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.brandDark,
    borderTopWidth: 1,
    borderTopColor: COLORS.brandBorderDark,
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: COLORS.brandPrimary,
  },
  iconWrap: {
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: -5,
    right: -10,
    backgroundColor: COLORS.alertDanger,
    borderRadius: 99,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.textPrimary,
    fontSize: 9,
    fontWeight: "900",
  },
  tabLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  tabLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: "800",
  },
});