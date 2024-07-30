import React, { FC } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
type Props = {
  onPrev: () => void;
  onNext: () => void;
};
const Controls: FC<Props> = ({ onPrev, onNext }) => {
  return (
    <View style={styles.controlsContainer}>
      <Pressable onPress={onPrev} style={styles.button}>
        <ChevronLeft color="black" size={24} />
      </Pressable>
      <Pressable onPress={onNext} style={styles.button}>
        <ChevronRight color="black" size={24} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
    alignSelf: "center",
    position: "absolute",
    bottom: 50,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
  },
});

export default Controls;
