import { StyleSheet, Text, View } from "react-native";

export const Tag = ({
  text,
  bgColor,
  textColor,
}: {
  text: string;
  bgColor?: string;
  textColor?: string;
}) => {
  return (
    <View
      style={[
        styles.tagContainer,
        bgColor ? { backgroundColor: bgColor } : null,
      ]}
    >
      <Text style={[styles.tagText, textColor ? { color: textColor } : null]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    backgroundColor: "#F1F3F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 13,
    fontFamily: "RobotoSerif_500Medium",
    color: "#495057",
  },
});
