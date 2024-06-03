import { StyleSheet, View } from "react-native";
import React from "react";
import { SCREEN_WIDTH } from "../constants/window";

export const ListItem = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH / 2.4,
    height: 180,
    backgroundColor: "#f5eded",
    borderRadius: 10,
  },
});
