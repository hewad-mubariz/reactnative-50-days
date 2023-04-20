import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Shape from "../components/Shape";
const COLORS = [
  "#f3e8ff",
  "#e9d5ff",
  "#d8b4fe",
  "#c084fc",
  "#a855f7",
  "#9333ea",
  "#7e22ce",
  "#6b21a8",
  "#581c87",
].reverse();
const AnimatedShapes = () => {
  return (
    <View style={styles.container}>
      {COLORS.map((color, index) => {
        return <Shape key={index} color={color} index={index} />;
      })}
    </View>
  );
};

export default AnimatedShapes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#181028",
  },
});
