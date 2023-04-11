import { Image, StyleSheet, Text, View } from "react-native";

import React, { FC } from "react";
import { SCREEN_HEIGHT } from "../constants/screen";
import { LinearGradient } from "expo-linear-gradient";
const imagePath = "../../assets";
const colorsMaster = ["#2B5150", "#2E898A", "#159D9F"];
const colorsVisa = ["#95C5F0", "#6A9CFE", "#656BFC"];

type Props = {
  type: "master" | "visa";
};
const MasterCard: FC<Props> = ({ type }) => {
  return (
    <LinearGradient
      style={styles.card}
      start={{ x: 0.1, y: 0 }}
      colors={type === "master" ? colorsMaster : colorsVisa}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Credit</Text>
        <Image
          style={styles.image}
          source={
            type === "master"
              ? require(`${imagePath}/master-card.png`)
              : require(`${imagePath}/visa-card.png`)
          }
        />
      </View>
      <View>
        <Text style={styles.title}>Hewad</Text>
        <Text style={styles.title}>***** **** *** 233</Text>
      </View>
    </LinearGradient>
  );
};

export default MasterCard;

const styles = StyleSheet.create({
  card: {
    height: SCREEN_HEIGHT / 4,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    color: "white",
    textAlignVertical: "center",
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "flex-end",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
