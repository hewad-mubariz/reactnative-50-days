import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { RunnyCircle } from "./src/components/RunnyCircle";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RunnyCircle />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000000",
    justifyContent: "center",
  },
});
