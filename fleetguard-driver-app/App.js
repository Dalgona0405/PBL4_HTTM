import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { COLORS } from "./mobileConfig";
import BottomTabBar from "./src/components/layout/BottomTabBar";
import DriverHeader from "./src/components/layout/DriverHeader";
import LoginScreen from "./src/screens/Login/LoginScreen";
import ProfileScreen from "./src/screens/Profile/ProfileScreen";
import ScoreScreen from "./src/screens/Score/ScoreScreen";
import TripScreen from "./src/screens/Trip/TripScreen";
import ViolationsScreen from "./src/screens/Violations/ViolationsScreen";
import driverDataService from "./src/services/driverDataService";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("TRIP");
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [shift, setShift] = useState(null);
  const [biometricProfile, setBiometricProfile] = useState(null);
  const [scoreLogs, setScoreLogs] = useState([]);
  const [violations, setViolations] = useState([]);

  const loadDashboard = async () => {
    const data = await driverDataService.getDriverDashboard();
    setUser(data.user);
    setShift(data.currentShift);
    setBiometricProfile(data.biometricProfile);
    setScoreLogs(data.scoreLogs);
    setViolations(data.violations);
  };

  useEffect(() => {
    driverDataService.getDriverDashboard().then((data) => {
      setShift(data.currentShift);
      setBiometricProfile(data.biometricProfile);
      setScoreLogs(data.scoreLogs);
      setViolations(data.violations);
    });
  }, []);

  const handleLogin = async (username, password, consent) => {
    const loggedUser = await driverDataService.login(
      username,
      password,
      consent,
    );
    setUser(loggedUser);
    await loadDashboard();
  };

  const handleRespondShift = async (decision) => {
    const updated = await driverDataService.respondShift(decision);
    setShift(updated);
  };

  const handleCompleteCalibration = async (offline) => {
    const updated = await driverDataService.completeCalibration(offline);
    setShift(updated);
  };

  const handleToggleRest = async () => {
    const updated = await driverDataService.toggleResting();
    setShift(updated);
  };

  const handleSwitchDriver = async (offline) => {
    const updated = await driverDataService.switchCoDriver(offline);
    setShift(updated);
  };

  const handleCompleteTrip = async () => {
    const updated = await driverDataService.completeTrip();
    setShift(updated);
  };

  const handleSubmitDispute = async (payload) => {
    const updatedList = await driverDataService.submitDispute(payload);
    setViolations(updatedList);
    Alert.alert(
      "Đã gửi khiếu nại",
      "Đơn khiếu nại đã được đẩy lên Web Dashboard của Điều phối viên theo quy trình Four-Eyes!",
    );
  };

  const handleUpdateProfile = async (updatedFields) => {
    const updatedUser = await driverDataService.updateProfile(updatedFields);
    setUser(updatedUser);
    await loadDashboard();
  };

  const handleChangePassword = async (pwdPayload) => {
    await driverDataService.changePassword(pwdPayload);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.brandDark}
        translucent={false}
      />
      {!user ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <View style={styles.mainWrap}>
          <DriverHeader
            user={user}
            isOfflineMode={isOfflineMode}
            onToggleOffline={() => setIsOfflineMode(!isOfflineMode)}
            onOpenProfile={() => setActiveTab("PROFILE")}
            onLogout={() => setUser(null)}
          />

          <View style={styles.content}>
            {activeTab === "TRIP" && shift && (
              <TripScreen
                shift={shift}
                isOfflineMode={isOfflineMode}
                onRespondShift={handleRespondShift}
                onCompleteCalibration={handleCompleteCalibration}
                onToggleRest={handleToggleRest}
                onSwitchDriver={handleSwitchDriver}
                onCompleteTrip={handleCompleteTrip}
              />
            )}

            {activeTab === "SCORE" && (
              <ScoreScreen
                user={user}
                biometricProfile={biometricProfile}
                scoreLogs={scoreLogs}
              />
            )}

            {activeTab === "VIOLATIONS" && (
              <ViolationsScreen
                violations={violations}
                onSubmitDispute={handleSubmitDispute}
              />
            )}

            {activeTab === "PROFILE" && (
              <ProfileScreen
                user={user}
                onUpdateProfile={handleUpdateProfile}
                onChangePassword={handleChangePassword}
              />
            )}
          </View>

          <BottomTabBar
            activeTab={activeTab}
            onChangeTab={setActiveTab}
            violationCount={violations.length}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.brandDark,
  },
  mainWrap: {
    flex: 1,
    backgroundColor: COLORS.brandDeep,
  },
  content: {
    flex: 1,
  },
});