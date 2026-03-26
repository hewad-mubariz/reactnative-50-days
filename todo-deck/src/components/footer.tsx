import { ArrowRight, CircleCheck, ClockAlert } from "lucide-react-native";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Footer = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.footerContainer, { paddingBottom: insets.bottom + 45 }]}
    >
      <View style={styles.nextButtonContainer}>
        <ClockAlert size={24} color="#b6b6b6" />
        <Text style={styles.nextButtonText}>Snooze</Text>
      </View>
      <View style={styles.nextButtonContainer}>
        <CircleCheck size={24} color="#b6b6b6" />
        <Text style={styles.nextButtonText}>Complete</Text>
      </View>
      <View style={styles.nextButtonContainer}>
        <ArrowRight size={24} color="#000" />
        <Text style={[styles.nextButtonText, { color: "#000" }]}>Next</Text>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 60,
  },
  nextButtonContainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "regular",
    fontFamily: "RobotoSerif_400Regular",
    color: "#b1b1b1",
  },
});
