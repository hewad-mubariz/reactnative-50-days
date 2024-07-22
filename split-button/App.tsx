import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SplitButton } from "./src/components/SplitButton";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SplitButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dee8dd",
    //alignItems: "center",
    justifyContent: "center",
  },
});
