import { StyleSheet, Text, View } from "react-native";
import CardDeck from "./src/screens/CardDeck";

export default function App() {
  return (
    <View style={styles.container}>
      <CardDeck />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
  },
});
