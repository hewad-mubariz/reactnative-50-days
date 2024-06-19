import { StyleSheet, View } from "react-native";
import { TabView } from "./src/components/TabView";

export default function App() {
  return (
    <View style={styles.container}>
      <TabView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
    flex: 1,
    backgroundColor: "#fff",
    //alignItems: "center",
    //justifyContent: "center",
  },
});
