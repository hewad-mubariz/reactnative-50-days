import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/screen";
import MasterCard from "../components/MasterCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
type CardDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CardDetail"
>;
const cards: ("master" | "visa")[] = ["master", "visa", "master"];
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedCards = () => {
  const expanded = useSharedValue(0);
  const navigation = useNavigation<CardDetailScreenNavigationProp>();
  const handleCardPress = (card: "master" | "visa") => {
    expanded.value = 1;
    if (expanded.value == 1) {
      navigation.navigate("CardDetail", { card });
    }
  };

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const initialSpace = (index + 1) * 65;
      const expandedSpace = (index * SCREEN_HEIGHT) / 4;
      const extraSpace = initialSpace / (index + 1) + index * 10;

      const translateY =
        expanded.value === 1 ? expandedSpace + extraSpace : initialSpace;

      return {
        transform: [
          {
            translateY: withSpring(translateY, {
              mass: expanded.value ? 0.5 : 1,
            }),
          },
        ],
      };
    });
  };
  const closeButtonAStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(expanded.value),
    };
  });
  const titleAstyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(expanded.value === 0 ? SCREEN_WIDTH / 2.9 : 0),
        },
      ],
    };
  });
  const closePressed = () => {
    expanded.value = 0;
  };
  const createButtonAStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      bottom: 50,
      left: SCREEN_WIDTH / 2 - 30,
      borderRadius: 30,
      alignItems: "center",
      backgroundColor: "#2196F3",
      justifyContent: "center",
      width: 60,
      height: 60,
      opacity: withTiming(expanded.value === 1 ? 0 : 1),
    };
  });
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ paddingHorizontal: 10 }}>
        <View style={styles.header}>
          <Animated.Text style={[styles.title, titleAstyle]}>
            Wallet
          </Animated.Text>

          <AnimatedPressable
            style={[styles.button, closeButtonAStyle]}
            onPress={closePressed}
          >
            <MaterialCommunityIcons
              color={"white"}
              size={16}
              name="window-close"
            />
          </AnimatedPressable>
        </View>
        {cards.map((type, index) => {
          const aStyle = getAnimatedStyle(index);
          return (
            <AnimatedPressable
              onPress={() => handleCardPress(type)}
              key={index}
              style={[aStyle, styles.card]}
            >
              <MasterCard type={type} />
            </AnimatedPressable>
          );
        })}
      </View>
      <AnimatedPressable style={[createButtonAStyle]} onPress={closePressed}>
        <MaterialCommunityIcons color={"white"} size={30} name="plus" />
      </AnimatedPressable>
    </SafeAreaView>
  );
};

export default AnimatedCards;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    alignSelf: "center",
    position: "absolute",
  },
  button: {
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#2196F3",
    justifyContent: "center",
    width: 36,
    height: 36,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
