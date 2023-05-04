import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import FlippyCard from "./src/components/FlippyCard";

export default function App() {
  return (
    <View style={styles.container}>
      <FlippyCard />
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
