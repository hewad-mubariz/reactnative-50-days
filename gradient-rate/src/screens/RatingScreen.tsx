import RatingIcon from "@/components/RatingIcon";
import SkiaRating from "@/components/SkiaRating";
import { useRange } from "@/hooks/useRange";
import BottomSheet, {
  BottomSheetView,
  BottomSheetTextInput as TextInput,
} from "@gorhom/bottom-sheet";
import { CircleStar, Signature } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const range = [0, 2];
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const icons = [
  {
    Icon: CircleStar,
    backgroundColor: "#fbfafc",
    fillColor: "#000",
    strokeColor: "#fff",
    color: "#000",
  },
  {
    Icon: Signature,
    backgroundColor: "#343437",
    fillColor: "#fff",
    strokeColor: "#fff",
    color: "#fff",
  },
];

const feedbackOptions = [
  "Energy Prediction",
  "Magic Planner",
  "Device",
  "Speed",
  "Animations",
];

const RatingScreen = () => {
  const [ratingValue, setRatingValue] = useState(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [showHiddenContent, setShowHiddenContent] = useState(false);
  const insets = useSafeAreaInsets();
  const snapPoints = useRange();
  const animatedIndex = useSharedValue(0);
  const handleRatingChange = (r: number) => {
    setShowHiddenContent(true);
  };

  const animatedPressable = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(animatedIndex.value, range, [
        "#414144",
        "#ffffff",
      ]),
    };
  });
  const animatedSubmitButtonTextColor = useAnimatedStyle(() => {
    return {
      color: interpolateColor(animatedIndex.value, range, [
        "#ffffff",
        "#000000",
      ]),
    };
  });

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 100 }]}>
      <BottomSheet
        handleComponent={null}
        animatedIndex={animatedIndex}
        ref={bottomSheetRef}
        bottomInset={insets.bottom}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        backgroundStyle={styles.bottomSheetBackground}
        containerStyle={{ borderRadius: 32 }}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { paddingVertical: insets.bottom + 10 },
          ]}
        >
          <View style={styles.iconBar}>
            {icons.map((icon, index) => (
              <RatingIcon
                key={index}
                Icon={icon.Icon}
                index={index}
                backgroundColor={icon.backgroundColor}
                color={icon.color}
              />
            ))}
          </View>
          <Text style={styles.title}>How was your experience?</Text>
          <SkiaRating onRatingChange={handleRatingChange} />
          {showHiddenContent && (
            <Animated.View entering={FadeIn} style={styles.feedbackContainer}>
              <Animated.Text
                key={ratingValue > 3 ? "positive" : "negative"}
                entering={FadeInDown}
                style={styles.feedbackTitle}
              >
                {ratingValue > 3
                  ? "What did you like the most?"
                  : "What can we improve?"}
              </Animated.Text>
              <View style={styles.chipsContainer}>
                {feedbackOptions.map((option, index) => (
                  <View key={index} style={styles.chipItem}>
                    <Text style={styles.chipText}>{option}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.feedbackInputContainer}>
                <Signature size={24} color="#fff" stroke={"#fff"} />
                <TextInput
                  placeholderTextColor="#fff"
                  style={styles.feedbackInput}
                  placeholder="Write your feedback here"
                />
              </View>
            </Animated.View>
          )}
          <AnimatedPressable style={[styles.submitButton, animatedPressable]}>
            <Animated.Text
              style={[styles.submitButtonText, animatedSubmitButtonTextColor]}
            >
              {showHiddenContent ? "Submit" : "Cancel"}
            </Animated.Text>
          </AnimatedPressable>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161619",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    paddingHorizontal: 24,
  },
  bottomSheetBackground: {
    backgroundColor: "#242427",
    borderRadius: 32,
  },
  iconBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBarItem: {
    width: 50,
    height: 50,
    backgroundColor: "#fbfafc",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 70,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    backgroundColor: "#1a1a1a",
    borderRadius: 18,
    height: 55,
    paddingHorizontal: 20,
  },
  feedbackContainer: {
    marginTop: 24,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  chipsContainer: {
    flexDirection: "row",
    marginTop: 24,
    flexWrap: "wrap",
    gap: 8,
  },
  chipItem: {
    backgroundColor: "#3e3e41",
    borderRadius: 14,
    padding: 10,
  },
  chipText: {
    fontSize: 15,
    color: "#fff",
  },
  feedbackInputContainer: {
    marginTop: 24,
    backgroundColor: "#3e3e41",
    borderRadius: 16,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
  },
  feedbackInput: {
    backgroundColor: "#3e3e41",
    borderRadius: 14,
    padding: 10,
    flex: 1,
    fontSize: 16,
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
});

export default RatingScreen;
