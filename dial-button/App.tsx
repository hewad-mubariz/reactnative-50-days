import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import DialButton from "./src/components/DialButton";

export default function App() {
  return (
    <View style={styles.container}>
      <DialButton />
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
