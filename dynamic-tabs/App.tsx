import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DynamicTabs from "./screens/DynamicTabs";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <DynamicTabs />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
