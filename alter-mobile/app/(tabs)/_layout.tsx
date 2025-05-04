import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import HomeScreen from ".";
import { Image } from "expo-image";

export default function TabLayout() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const prepare = async () => {
      await new Promise((res) => setTimeout(res, 3000));
      setIsReady(true);
    };
    prepare();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.image}
          contentFit="cover"
          transition={1000}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.loadingContainer}>
        <HomeScreen />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bellButton: {
    paddingHorizontal: 16,
  },
  image: {
    backgroundColor: "white",
    width: 400,
    height: 400,
  },
});
