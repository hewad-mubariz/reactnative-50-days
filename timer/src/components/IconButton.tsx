import { Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
};

export const IconButton = ({ icon, onPress }: Props) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <MaterialCommunityIcons name={icon} size={24} color="white" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6f2b2a",
    padding: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#b8786e",
    alignItems: "center",
    borderRadius: 30,
  },
});
