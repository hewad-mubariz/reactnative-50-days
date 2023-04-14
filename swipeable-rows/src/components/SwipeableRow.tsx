import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import { SCREEN_WIDTH } from "../constants/screen";
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { clamp, snapPoint } from "react-native-redash";
import AnimatedButton from "./AnimatedButton";
import { springConfig } from "../utils/animation";
const RIGHT_ACTIONS = [
  { icon: "dots-horizontal", color: "#128c7e", position: 1, title: "More" },
  { icon: "archive", color: "#056d9c", position: 0, title: "Archive" },
];
const LEFT_ACTIONS = [
  { icon: "chat", color: "#34B7F1", position: 1, title: "Unread" },
  { icon: "pin", color: "#056d9c", position: 0, title: "Pin" },
];
type Props = {
  children: React.ReactNode;
};
type Context = {
  translationX: number;
};
const MAX_TRANSLATE = 120;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SwipeableRow: FC<Props> = ({ children }) => {
  const translateX = useSharedValue(0);
  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (_, context) => {
      context.translationX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = clamp(
        event.translationX + context.translationX,
        -MAX_TRANSLATE,
        MAX_TRANSLATE
      );
    },
    onEnd: (event) => {
      const sameDirection =
        (event.translationX > 0 && translateX.value > 0) ||
        (event.translationX < 0 && translateX.value < 0);

      if (sameDirection) {
        translateX.value = withSpring(
          snapPoint(event.translationX, event.velocityX, [
            0,
            event.translationX > 0 ? MAX_TRANSLATE : -MAX_TRANSLATE,
          ]),
          springConfig(event.velocityX)
        );
      } else {
        translateX.value = withSpring(0, springConfig(event.velocityX));
      }
    },
  });
  const leftIconsStyle = useAnimatedStyle(() => {
    const translate = interpolate(translateX.value, [0, 120], [-60, 0]);
    return {
      transform: [{ translateX: translate }],
    };
  });

  const rightIconsStyle = useAnimatedStyle(() => {
    const translate = interpolate(translateX.value, [0, -120], [60, 0]);
    return {
      transform: [{ translateX: translate }],
    };
  });
  const handleTap = () => {
    translateX.value = withTiming(0);
  };
  const handleActionButtonPress = (action: string) => {
    Alert.alert("Hello Developers", action);
  };
  const renderLeftActions = () => {
    return (
      <Animated.View style={[styles.leftIconsContainer, leftIconsStyle]}>
        {LEFT_ACTIONS.map((action, index) => {
          return (
            <AnimatedButton
              onButtonPress={handleActionButtonPress}
              key={index}
              direction="left"
              translateX={translateX}
              action={action}
            />
          );
        })}
      </Animated.View>
    );
  };

  const renderRightActions = () => {
    return (
      <Animated.View style={[styles.rightIconsContainer, rightIconsStyle]}>
        {RIGHT_ACTIONS.map((action, index) => {
          return (
            <AnimatedButton
              onButtonPress={handleActionButtonPress}
              key={index}
              direction="right"
              translateX={translateX}
              action={action}
            />
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        {renderLeftActions()}
        {renderRightActions()}
      </View>
      <PanGestureHandler activeOffsetX={[-10, 10]} onGestureEvent={handler}>
        <AnimatedPressable onPress={handleTap} style={[styles.item, aStyle]}>
          {children}
        </AnimatedPressable>
      </PanGestureHandler>
    </View>
  );
};

export default SwipeableRow;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    position: "absolute",
    justifyContent: "space-between",
    flexDirection: "row",
    height: 60,
    width: SCREEN_WIDTH,
  },

  item: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  leftIconsContainer: {
    position: "relative",
    justifyContent: "flex-start",
    flexDirection: "row",
    height: 60,
  },
  rightIconsContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 60,
  },
  iconButtonTitle: {
    color: "white",
  },
});
