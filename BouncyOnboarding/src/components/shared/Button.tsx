import React, { FC } from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleProp,
  TextStyle,
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
export type CustomButtonProps = {
  title: string;
  loading?: boolean;
  iconLeft?: string;
  iconRight?: string;
  iconFamily?: "Feather" | "MaterialCommunityIcons";
  variant?: "text" | "contained" | "outline";
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
  roundness?: "full" | "medium" | "small";
  full?: boolean;
};

const Button: FC<CustomButtonProps> = ({
  title,
  loading = false,
  iconLeft,
  titleStyle,
  iconSize = 16,
  iconColor = "white",
  iconRight,
  iconFamily = "Feather",
  variant = "contained",
  style = {},
  onPress,
  roundness = "medium",
  full = false,
}: CustomButtonProps) => {
  const Icon = ICON_LIBRARIES[iconFamily]();

  const buttonStyles = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${roundness}Roundness`],
    full && styles.fullWidth,
    (iconLeft || iconRight) && styles.withIconText,
    style,
  ] as StyleProp<ViewStyle>;

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${roundness}RoundnessText`],
    iconLeft && { marginLeft: 8 },
    iconRight && { marginRight: 8 },
    titleStyle,
  ] as StyleProp<TextStyle>;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        buttonStyles,
        pressed && styles.buttonPressed,
        pressed && styles.shadow,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          {iconLeft && (
            <Icon name={iconLeft} size={iconSize} color={iconColor} />
          )}
          <Text style={textStyles}>{title}</Text>
          {iconRight && (
            <Icon name={iconRight} size={iconSize} color={iconColor} />
          )}
        </>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 40,
    minWidth: 64,
    borderRadius: 4,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  withIconText: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
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
  containedText: {
    color: "white",
  },
  textText: {
    color: "#2196F3",
  },
  outlineText: {
    color: "#2196F3",
  },
  fullRoundness: {
    borderRadius: 40,
  },
  mediumRoundness: {
    borderRadius: 4,
  },
  smallRoundness: {
    borderRadius: 2,
  },
  fullRoundnessText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mediumRoundnessText: {
    fontSize: 14,
    fontWeight: "600",
  },
  smallRoundnessText: {
    fontSize: 12,
    fontWeight: "600",
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
