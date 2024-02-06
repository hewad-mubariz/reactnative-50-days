import { StyleSheet, Text, View } from "react-native";
import { Gauge } from "./src/components/Gauge";

export default function App() {
  return (
    <View style={styles.container}>
      <Gauge />
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
