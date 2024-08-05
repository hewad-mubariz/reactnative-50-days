import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { RadialFab } from "./src/components/RadialFab";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <RadialFab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
