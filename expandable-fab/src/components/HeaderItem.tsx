import React from "react";
import { StyleSheet, View } from "react-native";
import { SCREEN_WIDTH } from "../constants/window";

const HeaderItem = () => {
  return <View style={styles.headerItem} />;
};
const styles = StyleSheet.create({
  headerItem: {
    backgroundColor: "#f0f0f0",
    width: SCREEN_WIDTH / 3,
    height: 50,
    borderRadius: 10,
  },
});
export default HeaderItem;
