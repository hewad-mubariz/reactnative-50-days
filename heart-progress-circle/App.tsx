import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HeartProgressCircle from "./src/components/HeartProgressCircle";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <HeartProgressCircle />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6c44a3",
    alignItems: "center",
    justifyContent: "center",
  },
});
