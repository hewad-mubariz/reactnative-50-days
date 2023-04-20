import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AnimatedShapes from "./src/screens/AnimatedShapes";

export default function App() {
  return (
    <View style={styles.container}>
      <AnimatedShapes />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#181028",
  },
});
