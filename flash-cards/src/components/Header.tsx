import React from "react";
import { View, StyleSheet } from "react-native";
import { Wand, HelpCircle, Settings } from "lucide-react-native";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Wand color="white" size={24} />
      <HelpCircle color="white" size={24} />
      <Settings color="white" size={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
    position: "absolute",
  },
});

export default Header;
