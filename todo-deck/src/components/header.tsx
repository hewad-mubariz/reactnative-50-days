import { ClockFading, Menu, Users } from "lucide-react-native";
import { View, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Header = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: insets.top + 50, paddingBottom: 16 },
      ]}
    >
      <Menu size={24} color="#b1b1b1" />
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Summarize</Text>
        <View style={styles.headerSubTitleContainer}>
          <Text style={styles.headerSubTitle}>Updated today,</Text>
          <Text style={styles.headerSubTitle}>09:14</Text>
        </View>
      </View>
      <View style={styles.headerIconsContainer}>
        <ClockFading size={24} color="#b1b1b1" />
        <Users size={24} color="#b1b1b1" />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  headerTitleContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
  headerIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  headerSubTitleContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    gap: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "RobotoSerif_700Bold",
  },
  headerSubTitle: {
    fontSize: 16,
    color: "#b1b1b1",
    fontWeight: "regular",
    lineHeight: 20,
    fontFamily: "Roboto Serif Regular",
  },
});
