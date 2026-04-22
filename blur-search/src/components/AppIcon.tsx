import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
type IconMock = {
  Icon: LucideIcon;
  gradient: [string, string];
};
export const AppIcon = ({ item }: { item: IconMock }) => {
  return (
    <View style={styles.iconMock}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.iconTile}
      >
        <item.Icon color="#FFFFFF" size={30} strokeWidth={2.3} />
      </LinearGradient>
      <View style={styles.iconLabelStub} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconMock: {
    width: 80,
    alignItems: "center",
    gap: 8,
  },
  iconTile: {
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  iconLabelStub: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(215, 224, 240, 0.3)",
  },
});
