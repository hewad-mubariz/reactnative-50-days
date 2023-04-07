import React, { FC } from "react";
import {
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export type IconLibrary = {
  [key: string]: () => React.ComponentType<any>;
};

const ICON_LIBRARIES: IconLibrary = {
  Feather: () => Feather,
  MaterialCommunityIcons: () => MaterialCommunityIcons,
  // add more libraries as needed
};

export type IconButtonProps = {
  icon: string;
  iconFamily?: "Feather" | "MaterialCommunityIcons";
  variant?: "text" | "contained" | "outline";
  size?: "small" | "medium" | "big";
  iconColor?: string;
  roundness?: "full" | "medium" | "small";
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const IconButton: FC<IconButtonProps> = ({
  icon,
  iconFamily = "Feather",
  variant = "contained",
  size = "medium",
  iconColor = "white",
  roundness = "medium",
  style = {},
  onPress,
}: IconButtonProps) => {
  const Icon = ICON_LIBRARIES[iconFamily]();
  const iconSize = size === "big" ? 24 : size === "medium" ? 16 : 12;
  const buttonSize = size === "big" ? 48 : size === "medium" ? 36 : 24;

  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${roundness}Roundness`],
    { width: buttonSize, height: buttonSize },
    style,
  ] as StyleProp<ViewStyle>;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles,
        pressed && styles.buttonPressed,
        pressed && styles.shadow,
      ]}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  containedButton: {
    backgroundColor: "#2196F3",
  },
  textButton: {
    backgroundColor: "transparent",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  fullRoundness: {
    borderRadius: 100,
  },
  mediumRoundness: {
    borderRadius: 20,
  },
  smallRoundness: {
    borderRadius: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
});
