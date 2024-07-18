import React from "react";
import { View, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/window";

const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;
const PADDING = 20;

interface DynamicCardProps {}

export const Card: React.FC<DynamicCardProps> = () => {
  return (
    <View style={[styles.container]}>
      <LinearGradient colors={["#f3ecf2", "#c297a1"]} style={styles.card} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: PADDING,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 5,
  },
});
