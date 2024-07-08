import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import WigglingCards from "./src/components/WigglingCards";

export default function App() {
  return (
    <View style={styles.container}>
      <WigglingCards />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    justifyContent: "center",
  },
});
