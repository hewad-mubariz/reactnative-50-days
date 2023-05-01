import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AudioVisualizer from "./AudioVisualizer";
import { SCREEN_WIDTH } from "../constant/screen";
import useAudio from "../hooks/useAudio";

const AudioRecorder = () => {
  const { recording, levels, recordingTime, toggleRecording } = useAudio();
  return (
    <View style={styles.container}>
      <AudioVisualizer levels={levels} width={SCREEN_WIDTH} height={50} />
      <View style={styles.controls}>
        <MaterialCommunityIcons
          name={recording ? "pause-circle-outline" : "microphone"}
          size={48}
          color={"#017BFE"}
          onPress={toggleRecording}
        />
        <Text style={styles.timer}>
          {Math.floor(recordingTime / 60)
            .toString()
            .padStart(2, "0")}
          :{(recordingTime % 60).toString().padStart(2, "0")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  timer: {
    fontSize: 24,
    marginLeft: 20,
  },
});

export default AudioRecorder;
