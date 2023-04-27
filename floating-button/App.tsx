import { ScrollView, StyleSheet, Text, View } from "react-native";
import FloatingButton from "./src/components/FloatingButton";
import FloatingButtonCircular from "./src/components/FloatingButtonCircular";

export default function App() {
  return (
    <View style={styles.container}>
      <FloatingButtonCircular />
      <FloatingButton />
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
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 16,
  },
  itemText: {
    fontSize: 16,
  },
});
