import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

type SectionHeaderProps = {
  title: string;
  Icon?: LucideIcon;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  Icon,
}) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {Icon && <Icon color="black" />}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SectionHeader;
