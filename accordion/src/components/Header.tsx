import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Frequently Asked Questions</Text>
      <Text style={styles.subTitle}>
        Don't hesitate to reach out to us and we are happy to help you and
        assist you
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  subTitle: {
    color: "#585c5c",
  },
});

export default Header;
