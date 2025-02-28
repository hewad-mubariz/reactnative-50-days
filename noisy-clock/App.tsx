import { StyleSheet, View } from "react-native";
import NoisyClock from "./src/components/NoisyClock";

export default function App() {
  return (
    <View style={styles.container}>
      <NoisyClock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
