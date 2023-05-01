import React from "react";
import { StyleSheet, View } from "react-native";
import AudioRecorder from "./src/components/AudioRecorder";

export default function App() {
  return (
    <View style={styles.container}>
      <AudioRecorder />
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
});
