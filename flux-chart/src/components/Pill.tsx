import { Pressable, StyleSheet, Text } from "react-native";

const BG_SELECTED = "#F2F2F7";

type PillProps = {
  index: number;
  text: string;
  selected: boolean;
  handlePress: (item: string, index: number) => void;
};

const Pill = ({ index, text, selected, handlePress }: PillProps) => {
  return (
    <Pressable
      key={text}
      onPress={() => handlePress(text, index)}
      disabled={selected}
      style={[styles.tab, selected && styles.activeTab]}
    >
      <Text style={[styles.tabText, selected && styles.activeTabText]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  tabText: {
    color: "#8E8E93",
    fontWeight: "700",
    fontSize: 14,
  },
  activeTabText: {
    color: "#000000",
  },
  activeTab: {
    backgroundColor: BG_SELECTED,
  },
});
export default Pill;
