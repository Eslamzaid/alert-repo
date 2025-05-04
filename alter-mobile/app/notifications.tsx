import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import io from "socket.io-client";
import { Bell } from "lucide-react-native";
import { Platform } from "react-native";

interface LocationPoints {
  x: string;
  y: string;
}

interface AlartSignle {
  name: string;
  message: string;
  location: LocationPoints;
}

const SOCKET_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000"
    : "http://192.168.100.221:3000";

export default function NotificationScreen() {
  const [alert, setAlert] = useState(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const socket = io(SOCKET_URL, { reconnection: true });

    socket.on("connect", () => console.log("✅ Socket connected"));
    socket.on("alert", setAlert);
    socket.on("clear-alert", () => setAlert(null));
    socket.on("disconnect", () => console.log("❌ Socket disconnected"));
    socket.on("connect_error", (err) => console.log("❌ connect_error", err));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (alert) {
      startPulse();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [alert]);


  const resetAlter = ()=> {
    
  }


  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  if (!alert) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.emptyOuter}>
          <Bell size={48} color="#a3a3a3" />
        </View>
        <Text style={styles.emptyTitle}>There are no notifications</Text>
        <Text style={styles.emptySubtitle}>
          Your notifications will appear on this page
        </Text>
      </View>
    );
  }

  const ringScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.8],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={{ alignItems: "center", marginVertical: 32 }}>
        <Animated.View
          style={[styles.outerRing, { transform: [{ scale: ringScale }] }]}
        />
        <View style={styles.middleRing} />
        <View style={styles.innerDot} />
      </View>

      <Text style={styles.alertTitle}>! WARNING !</Text>

      <Text style={styles.personName}>{alert.name} Wants Immediate Help</Text>
      <Text style={styles.locationText}>
        Location: {alert.location?.x}, {alert.location?.y}
      </Text>
    </View>
  );
}

const SIZE = 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
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
  outerRing: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "rgba(255, 0, 0, 0.15)",
  },
  middleRing: {
    position: "absolute",
    width: SIZE * 0.6,
    height: SIZE * 0.6,
    borderRadius: (SIZE * 0.6) / 2,
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  innerDot: {
    position: "absolute",
    width: SIZE * 0.08,
    height: SIZE * 0.08,
    borderRadius: (SIZE * 0.08) / 2,
    backgroundColor: "#ff1d1d",
  },
  alertTitle: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#ff1d1d",
    letterSpacing: 1,
    marginBottom: 24,
  },
  personName: {
    fontSize: 24,
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
