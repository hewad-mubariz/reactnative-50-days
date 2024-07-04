import { StyleSheet, View } from "react-native";
import { CollapsibleCard } from "./src/components/CollapsibleCard";

export default function App() {
  return (
    <View style={styles.container}>
      <CollapsibleCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
});
