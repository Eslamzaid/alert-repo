import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Image,
  Platform,
  SafeAreaView,
} from "react-native";
import io from "socket.io-client";
import { Bell, AlertTriangle, X } from "lucide-react-native";

interface LocationPoints {
  x: string;
  y: string;
}

interface AlertSingle {
  name: string;
  message: string;
  location: LocationPoints;
}

const SOCKET_URL = "http://172.20.10.6:3000";

// ⚠️ Replace the path below with the actual location of the GIF in your project.
const ALERT_GIF = require("../assets/alert.gif");

/**
 * NotificationScreen
 * ------------------
 * Displays a looping GIF as the central alert animation. The Clear button
 * now sits directly underneath the animation—centre‑aligned and easily
 * reachable without overlapping important UI elements.
 */
export default function NotificationScreen() {
  const [alert, setAlert] = useState<AlertSingle | null>(null);

  const clearAlert = () => setAlert(null);

  /* --------------------------- Socket handshake -------------------------- */
  useEffect(() => {
    const socket = io(SOCKET_URL, { reconnection: true });

    socket.on("connect", () => console.log("✅ Socket connected"));
    socket.on("alert", setAlert);
    socket.on("clear-alert", clearAlert);
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
    socket.on("connect_error", (err) => console.log("❌ connect_error", err));

    return () => socket.disconnect();
  }, []);

  /* ------------------------------ Empty state ---------------------------- */
  if (!alert) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.emptyOuter}>
          <Bell size={48} color="#a3a3a3" />
        </View>

        <Text style={styles.emptyTitle}>There are no notifications</Text>
        <Text style={styles.emptySubtitle}>
          Your notifications will appear on this page
        </Text>
      </SafeAreaView>
    );
  }

  /* ---------------------------- Active alert UI -------------------------- */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Warning GIF */}
      <Image source={ALERT_GIF} style={styles.alertGif} />

      {/* Clear button – now under the animation */}
      <Pressable
        onPress={clearAlert}
        android_ripple={{ color: "rgba(0,0,0,0.12)", radius: 140 }}
        style={({ pressed }) => [
          styles.clearBtn,
          pressed && Platform.OS === "ios" && { opacity: 0.75 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Clear alert"
      >
        <X size={20} color="#4a4a4a" />
        <Text style={styles.clearBtnText}>Clear</Text>
      </Pressable>

      {/* WARNING banner */}
      <View style={styles.bannerWrapper}>
        <AlertTriangle size={28} color="#fff" style={styles.bannerIcon} />
        <Text style={styles.bannerText}>WARNING</Text>
      </View>

      <Text style={styles.personName}>{alert.name} needs immediate help</Text>
      <Text style={styles.locationText}>
        Location: {alert.location?.x}, {alert.location?.y}
      </Text>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Styles                                  */
/* -------------------------------------------------------------------------- */
const COLOR_DANGER = "#ff3b30"; // iOS system red – intense and eye‑catching

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },

  /* --------------------------- Empty‑state styles -------------------------- */
  emptyOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fafafa",
    borderWidth: 2,
    borderColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    ...Platform.select({ ios: { shadowOffset: { width: 0, height: 2 } }, android: { elevation: 4 } }),
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 36,
    textAlign: "center",
    color: "#262626",
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#737373",
    textAlign: "center",
    marginTop: 6,
  },

  /* --------------------------- Alert GIF & banner -------------------------- */
  alertGif: {
    width: 150,
    height: 150,
    marginTop: 16,
    marginBottom: 8,
  },

  bannerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLOR_DANGER,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    ...Platform.select({ ios: { shadowOffset: { width: 0, height: 2 } }, android: { elevation: 6 } }),

    marginTop: 24,
    marginBottom: 24,
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },

  /* -------------------------- Clear button styles -------------------------- */
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1.5,
    borderColor: "#c5c5c7",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#ffffff",

    alignSelf: "center",
    marginTop: 8,
    ...Platform.select({ ios: { shadowOffset: { width: 0, height: 1 }, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2 }, android: { elevation: 2 } }),
  },
  clearBtnText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "600",
    color: "#4a4a4a",
    letterSpacing: 0.5,
  },

  /* ------------------------ Person & location text ------------------------- */
  personName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#171717",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 18,
    textAlign: "center",
    color: "#525252",
  },
});
