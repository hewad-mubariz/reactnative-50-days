import { LinearGradient } from "expo-linear-gradient";
import Timer from "../components/Timer";
import { View, StyleSheet } from "react-native";
import { IconButton } from "../components/IconButton";

const TimerScreen = () => {
  return (
    <LinearGradient
      colors={["#242024", "#242225", "#884139"]}
      style={styles.gradient}
    >
      <Timer initialSeconds={7210} />
      <View style={styles.buttonContainer}>
        <IconButton icon="stop" onPress={() => {}} />
        <IconButton icon="play" onPress={() => {}} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 60,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
    flexDirection: "row",
    gap: 20,
  },
});

export default TimerScreen;
