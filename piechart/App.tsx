import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "./src/components/BarChart";
export default function App() {
  return (
    <View style={styles.container}>
      <PieChart />
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
