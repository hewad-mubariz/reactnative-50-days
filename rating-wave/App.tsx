import { StyleSheet, View } from "react-native";
import AppRating from "./src/screens/AppRating";

export default function App() {
  return (
    <View style={styles.container}>
      <AppRating rating={5} />
      <AppRating rating={4.5} />
      <AppRating rating={4} />
      <AppRating rating={3.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 50,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
  },
  avatarsContainer: {
    width: 115,
    flexDirection: "row",
    marginTop: 10,
    position: "relative",
  },
  designersText: {
    marginTop: 5, // Adjust as needed
    fontSize: 14,
    color: "white",
  },
});
