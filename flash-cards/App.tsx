import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { FlashCards } from "./src/components/FlashCards";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FlashCards />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
