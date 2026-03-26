import { View, StyleSheet, Text } from "react-native";
import { Tag } from "./tag";
import { Image } from "expo-image";
import { ArrowUpRight } from "lucide-react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
  withTiming,
  withSpring,
} from "react-native-reanimated";
const DeckCardContent = ({
  item,
  sharedProgress,
  index,
}: {
  item: any;
  sharedProgress: SharedValue<number>;
  index: number;
}) => {
  const contentAnimatedStyle = useAnimatedStyle(() => {
    const relIndex = index - sharedProgress.value;

    const opacity = interpolate(
      relIndex,
      [0, 0.3],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      relIndex,
      [0, 0.1],
      [0, -10],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withTiming(opacity, { duration: 300 }),
      transform: [{ translateY: withTiming(translateY, { duration: 300 }) }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <Image source={item.image} style={styles.image} />
          <Tag text={item.tag} bgColor="#f4f4f4" textColor="#b8b8b8" />
        </View>
        {/* {in case you want content to animate, you can use the contentAnimatedStyle} */}
        <Animated.View>
          <View style={styles.tags}>
            <Tag text={item.category} bgColor="#f4f4f4" textColor="#b8b8b8" />
            <Tag text={item.mention} bgColor="#E7F2FF" textColor="#3e83dc" />
          </View>

          <View style={styles.content}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.contentDescription}>{item.description}</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Read more</Text>
        <ArrowUpRight size={20} color="#b8b8b8" strokeWidth={1.5} />
      </View>
    </View>
  );
};

export default DeckCardContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  mainContent: {
    flex: 1,
  },
  image: {
    width: 30,
    height: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tags: {
    gap: 10,
    marginTop: 20,
  },
  content: {
    marginTop: 20,
  },
  contentTitle: {
    fontSize: 28,
    fontFamily: "RobotoSerif_400Regular",
    color: "#1a1a1a",
    width: "80%",
    lineHeight: 36,
  },
  contentDescription: {
    fontSize: 16,
    color: "#000",
    marginTop: 12,
    lineHeight: 24,
    fontFamily: "RobotoSerif_300Light",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 15,
    fontFamily: "RobotoSerif_300Light",
    // fontFamily: "RobotoSerif_500Medium",
    color: "#000",
  },
});
