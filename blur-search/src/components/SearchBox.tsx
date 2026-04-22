import {
  SEARCH_COLLAPSED_SIZE,
  SEARCH_HORIZONTAL_PADDING,
  SEARCH_INPUT_COLLAPSED_HEIGHT,
  SEARCH_INPUT_EXPANDED_HEIGHT,
} from "@/constants/search";
import { Mic, Search } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedSearchIcon = Animated.createAnimatedComponent(Search);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
const SEARCH_PILL_HORIZONTAL_PADDING = 16;
const MIC_ICON_SIZE = 20;
const SEARCH_COLLAPSED_CONTENT_WIDTH = 74; // icon + gap + "Search" label visual width

type Props = {
  searchProgress: SharedValue<number>;
  handleSearchTap: () => void;
};
export const SearchBox = ({ searchProgress, handleSearchTap }: Props) => {
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const { height, progress } = useReanimatedKeyboardAnimation();

  const micAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(searchProgress.value, [0, 1], [0, 1]),
      width: interpolate(searchProgress.value, [0, 1], [0, MIC_ICON_SIZE]),
      marginLeft: interpolate(searchProgress.value, [0, 1], [0, 8]),
    };
  });
  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(searchProgress.value, [0, 1], [1, 0]),
      color: interpolateColor(
        searchProgress.value,
        [0, 1],
        ["#FFFFFF", "#506081"],
      ),
    };
  });

  const searchContainerAnimatedStyle = useAnimatedStyle(() => {
    const bottom = interpolate(progress.value, [0, 1], [insets.bottom + 30, 5]);
    const translateY = interpolate(
      searchProgress.value,
      [0, 1],
      [insets.bottom + 100, Math.abs(height.value) + bottom],
    );
    return {
      transform: [{ translateY: -translateY }],
      bottom: 0,
    };
  });

  const searchPillContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      alignItems: "center",
      flexDirection: "row",
      paddingHorizontal: SEARCH_PILL_HORIZONTAL_PADDING,
      //paddingVertical: 8,
      height: interpolate(
        searchProgress.value,
        [0, 1],
        [SEARCH_INPUT_COLLAPSED_HEIGHT, SEARCH_INPUT_EXPANDED_HEIGHT],
      ),
      width: interpolate(
        searchProgress.value,
        [0, 1],
        [SEARCH_COLLAPSED_SIZE, screenWidth - SEARCH_HORIZONTAL_PADDING * 2],
      ),
      borderRadius: 100,
      borderColor: interpolateColor(
        searchProgress.value,
        [0, 1],
        ["rgba(255,255,255,0.32)", "rgba(46, 63, 92, 0.4)"],
      ),
      borderWidth: interpolate(searchProgress.value, [0, 1], [1, 1.5]),
      backgroundColor: interpolateColor(
        searchProgress.value,
        [0, 1],
        ["rgba(255,255,255,0.14)", "rgba(30,	45,	79, 0.8)"],
      ),
      transform: [
        { scale: interpolate(searchProgress.value, [0, 1], [0.8, 1]) },
      ],
    };
  });
  const searchPillAnimatedStyle = useAnimatedStyle(() => {
    const collapsedInnerWidth =
      SEARCH_COLLAPSED_SIZE - SEARCH_PILL_HORIZONTAL_PADDING * 2;
    const collapsedOffset = Math.max(
      0,
      (collapsedInnerWidth - SEARCH_COLLAPSED_CONTENT_WIDTH) / 2,
    );

    return {
      transform: [
        {
          translateX: interpolate(
            searchProgress.value,
            [0, 1],
            [collapsedOffset, 0],
          ),
        },
      ],
    };
  });
  const handleInputFocus = useCallback(() => {
    if (searchProgress.value < 0.5) {
      handleSearchTap();
    }
  }, [handleSearchTap, searchProgress]);

  const handleSubmit = useCallback(() => {}, [query]);
  const searchInputAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(searchProgress.value, [0, 1], [0, 1]),
      height: 40,
    };
  });
  return (
    <AnimatedPressable
      style={[styles.searchContainer, searchContainerAnimatedStyle]}
      onPress={handleSearchTap}
    >
      <Animated.View
        style={[styles.searchPillContainer, searchPillContainerAnimatedStyle]}
      >
        <Animated.View style={[styles.searchPill, searchPillAnimatedStyle]}>
          <AnimatedSearchIcon color="#FFFFFF" size={20} strokeWidth={2.5} />

          <AnimatedTextInput
            style={[styles.searchInput, searchInputAnimatedStyle]}
            value={query}
            onChangeText={setQuery}
            onFocus={handleInputFocus}
            onSubmitEditing={handleSubmit}
            placeholder="Search"
            placeholderTextColor="rgba(206,220,245,0.72)"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor="#FFFFFF"
            underlineColorAndroid="transparent"
          />
          {/* Experimental: Could only use TextInput and not Text for the label */}
          <Animated.Text style={labelAnimatedStyle}>Search</Animated.Text>
        </Animated.View>
        <Animated.View style={micAnimatedStyle}>
          <Mic color="#FFFFFF" size={20} strokeWidth={2.5} />
        </Animated.View>
      </Animated.View>
    </AnimatedPressable>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  searchPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    //backgroundColor: "red",
    // overflow: "hidden",
  },
  searchPillContainer: {
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  searchInput: {
    // flex: 1,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    position: "absolute",
    //backgroundColor: "red",
    width: "100%",
    left: 28,
  },
});
export default SearchBox;
