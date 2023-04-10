import { Pressable, StyleSheet, View } from "react-native";
import React, { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "./Input";
const HEADER_HEIGHT = 170;
const HEADER_PADDING = 15;
const SCROLL_VALUE = 50;
const ICONS_X_MIN =
  (SCREEN_WIDTH - HEADER_PADDING * 2 - SCREEN_WIDTH * 0.6) / 2;

const ICONS_X_MAX =
  (SCREEN_WIDTH - HEADER_PADDING * 2 - SCREEN_WIDTH * 0.8) / 2;

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../constants/screen";
const ICONS = ["logout", "currency-usd", "qrcode", "line-scan"];
const AnimatedMIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

type Props = {
  scrollY: Animated.SharedValue<number>;
};
const Header: FC<Props> = ({ scrollY }) => {
  const insets = useSafeAreaInsets();

  //Just to update react state to keep icon colors updated
  const [scrollYL, setScrollYL] = useState(scrollY.value);

  const inputOpacity = useSharedValue(0);
  useAnimatedReaction(
    () => scrollY.value,
    (value) => {
      runOnJS(setScrollYL)(value);
      inputOpacity.value = withTiming(0);
    }
  );
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const headerHeight = interpolate(
      scrollY.value,
      [0, SCROLL_VALUE],
      [HEADER_HEIGHT, HEADER_HEIGHT / 1.5],
      Extrapolation.CLAMP
    );

    return {
      height: headerHeight,
    };
  });

  const animatedIconProps = useAnimatedProps(() => {
    const color = interpolateColor(
      scrollY.value,
      [0, SCROLL_VALUE],
      ["black", "white"]
    );
    return {
      color: color,
    };
  });

  const iconAstyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, SCROLL_VALUE],
      ["white", "transparent"]
    );
    return {
      width: 30,
      height: 30,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
    };
  });
  const profileIconAnimatedStyle = useAnimatedStyle(() => {
    const size = interpolate(
      scrollY.value,
      [0, SCROLL_VALUE],
      [45, 34],
      Extrapolation.CLAMP
    );

    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      opacity: inputOpacity.value ? withTiming(0) : withTiming(1),
    };
  });
  const iconContainerAStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_VALUE],
      [60, 0],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollY.value,
      [0, SCROLL_VALUE],
      [ICONS_X_MAX, ICONS_X_MIN],
      Extrapolation.CLAMP
    );

    const width = interpolate(
      scrollY.value,
      [0, SCROLL_VALUE],
      [SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.6],
      Extrapolation.CLAMP
    );

    return {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      zIndex: -1,
      transform: [{ translateY: translateY }, { translateX: translateX }],
      width: width,
    };
  });
  const closeButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      right: 0,
      opacity: inputOpacity.value,
    };
  });
  const handleSearchPress = () => {
    if (scrollY.value >= SCROLL_VALUE) {
      inputOpacity.value = withTiming(1);
    }
  };
  return (
    <Animated.View
      style={[
        headerAnimatedStyle,
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <View style={styles.profileAndSearch}>
        <Input
          onSearchPress={handleSearchPress}
          externalOpacity={inputOpacity}
          scrollY={scrollY}
        />
        <Animated.View style={iconContainerAStyle}>
          {ICONS.map((icon, index) => {
            return (
              <Animated.View key={index} style={iconAstyle}>
                <AnimatedMIcon
                  size={18}
                  animatedProps={animatedIconProps}
                  name={icon}
                />
              </Animated.View>
            );
          })}
        </Animated.View>
        <Animated.Image
          style={profileIconAnimatedStyle}
          source={require("../../assets/man.jpg")}
        />
        <Pressable
          onPress={() => {
            inputOpacity.value = withTiming(0, { duration: 200 });
          }}
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Animated.View style={closeButtonAnimatedStyle}>
            <AnimatedMIcon name={"window-close"} color={"white"} size={30} />
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF3A32",
    position: "absolute",
    zIndex: 2,
    width: SCREEN_WIDTH,
    paddingHorizontal: HEADER_PADDING,
  },
  profileAndSearch: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
