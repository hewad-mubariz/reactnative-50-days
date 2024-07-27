import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import CircularProgressBar from "./src/components/CircularProgressBar";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CircularProgressBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
    alignItems: "center",
    justifyContent: "center",
  },
});
