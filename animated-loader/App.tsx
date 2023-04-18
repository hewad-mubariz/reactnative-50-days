import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Loader from "./src/screens/Loader";

export default function App() {
  return (
    <View style={styles.container}>
      <Loader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
