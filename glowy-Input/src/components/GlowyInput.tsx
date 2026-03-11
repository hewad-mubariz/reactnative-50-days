import {
  BlurMask,
  Canvas,
  RoundedRect,
  SweepGradient,
  vec,
} from "@shopify/react-native-skia";
import { AudioLines, Check, Mic, Plus, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputSubmitEditingEvent,
  View,
} from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const canvasPadding = 50;
const borderRadius = 25;
const glowHeightExpansion = 10;

const auraColors = [
  "rgba(74, 222, 128, 0.4)",
  "rgba(34, 197, 94, 0.1)",
  "rgba(74, 222, 128, 0.4)",
];
const auraGradientColors = [...auraColors];
const positions = [0, 0.5, 1];

const travelingColors = ["transparent", "#4ADE80", "#22C55E", "transparent"];
const travelingPositions = [0.3, 0.75, 0.4, 1];

export interface InputMessage {
  text?: string;
}

interface GlowyInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: ({ message }: { message: InputMessage }) => void;
  handleSubmitEditing: (e: TextInputSubmitEditingEvent) => void;
  placeholder?: string;
}

function GlowyInput({
  message,
  setMessage,
  handleSubmitEditing,
  handleSendMessage,
  placeholder,
}: GlowyInputProps) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const rotation = useSharedValue(0);
  const rotationSlow = useSharedValue(0);
  const blurIntensity = useSharedValue(20);

  useEffect(() => {
    const finalValue = 1e6;
    // Fast rotation (traveling border)
    const durationFast = (finalValue / (Math.PI * 2)) * 4000;
    rotation.value = withTiming(finalValue, {
      duration: durationFast,
      easing: Easing.linear,
    });

    // Slow rotation (aura/glow)
    const durationSlow = (finalValue / (Math.PI * 2)) * 75000;
    rotationSlow.value = withTiming(finalValue, {
      duration: durationSlow,
      easing: Easing.linear,
    });
  }, [rotation, rotationSlow]);

  const animatedRotation = useDerivedValue(() => {
    "worklet";
    return [{ rotate: rotation.value % (Math.PI * 2) }];
  });

  const animatedRotationSlow = useDerivedValue(() => {
    "worklet";
    return [{ rotate: rotationSlow.value % (Math.PI * 2) }];
  });

  const onSend = () => {
    if (message.trim()) {
      handleSendMessage({ message: { text: message } });
      setMessage("");
    }
  };

  const { height: keyboardHeight, progress: keyboardProgress } =
    useReanimatedKeyboardAnimation();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
  }));

  const footerStyle = useAnimatedStyle(() => ({
    opacity: keyboardProgress.value,
    transform: [{ translateY: (1 - keyboardProgress.value) * 10 }],
  }));

  const initialFooterStyle = useAnimatedStyle(() => ({
    opacity: 1 - keyboardProgress.value,
    transform: [{ translateY: keyboardProgress.value * -10 }],
  }));
  const strokeWidthTraveling = useDerivedValue(() => {
    return keyboardProgress.value * 1.8;
  });
  const strokeWidthAura = useDerivedValue(() => {
    return keyboardProgress.value * 8;
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputWrapper,
          { opacity: dimensions ? 1 : 0 },
          animatedStyle,
        ]}
        onLayout={onLayout}
      >
        {dimensions && (
          <Canvas
            style={{
              position: "absolute",
              top: -canvasPadding,
              left: -canvasPadding,
              width: dimensions.width + canvasPadding * 2,
              height: dimensions.height + canvasPadding * 2,
            }}
          >
            <RoundedRect
              x={canvasPadding}
              y={canvasPadding - glowHeightExpansion / 2}
              width={dimensions.width}
              height={dimensions.height + glowHeightExpansion}
              r={borderRadius}
              opacity={keyboardProgress}
              strokeWidth={strokeWidthAura}
            >
              <SweepGradient
                transform={animatedRotationSlow}
                origin={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                c={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                colors={auraGradientColors}
                positions={positions}
              />
              <BlurMask blur={blurIntensity} />
            </RoundedRect>

            <RoundedRect
              x={canvasPadding}
              y={canvasPadding}
              width={dimensions.width}
              height={dimensions.height}
              r={borderRadius}
              style="stroke"
              opacity={keyboardProgress}
              strokeWidth={strokeWidthTraveling}
            >
              <SweepGradient
                transform={animatedRotation}
                origin={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                c={vec(
                  canvasPadding + dimensions.width / 2,
                  canvasPadding + dimensions.height / 2,
                )}
                colors={travelingColors}
                positions={travelingPositions}
              />
            </RoundedRect>
          </Canvas>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder || "Ask anything..."}
            placeholderTextColor="#666"
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="send"
            multiline
          />

          <View style={styles.footerContainer}>
            <Animated.View style={[styles.footer, footerStyle]}>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionButtonText}>EN</Text>
              </Pressable>

              <Pressable
                disabled={!message?.trim()}
                onPress={onSend}
                style={({ pressed }) => [
                  styles.sendButton,
                  {
                    backgroundColor: message?.trim() ? "#4ADE80" : "#333",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Check
                  size={18}
                  color={message?.trim() ? "#000" : "#666"}
                  strokeWidth={3}
                />
              </Pressable>
            </Animated.View>

            {/* Initial Footer (Plus, Search, Mic, Wave) */}
            <Animated.View
              style={[styles.footer, styles.absoluteFooter, initialFooterStyle]}
            >
              <View style={styles.leftActions}>
                <Pressable style={styles.iconButton}>
                  <Plus size={18} color="#ccc" />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <Search size={18} color="#ccc" />
                </Pressable>
              </View>

              <View style={styles.rightActions}>
                <Pressable style={styles.iconButton}>
                  <Mic size={18} color="#ccc" />
                </Pressable>
                <Pressable style={styles.waveButton}>
                  <AudioLines size={18} color="#000" />
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: "transparent",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  inputContainer: {
    backgroundColor: "#222427",
    borderRadius: borderRadius,
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 10,
    minHeight: 115,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    textAlignVertical: "top",
    paddingTop: 0,
  },
  footerContainer: {
    height: 40,
    marginTop: 8,
    position: "relative",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  absoluteFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  leftActions: {
    flexDirection: "row",
    gap: 12,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#ccc",
    fontSize: 16,
  },
  waveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FACC15",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#333",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "500",
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

GlowyInput.displayName = "GlowyInput";
export default GlowyInput;
