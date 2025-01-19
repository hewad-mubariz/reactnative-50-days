import { StyleSheet, Text, View } from "react-native";
import TimerScreen from "./src/screens/TimerScreen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [fontsLoaded] = useFonts({
    Anton: require("./assets/fonts/Anton-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <TimerScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
