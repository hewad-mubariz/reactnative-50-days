import React from "react";
import { Text, View } from "react-native";

import styles from "./styles";

export default function Message({ text, sender }: any) {
  return (
    <View style={sender ? styles.senderContainer : styles.recipientContainer}>
      <Text style={styles.message}>{text}</Text>
    </View>
  );
}
