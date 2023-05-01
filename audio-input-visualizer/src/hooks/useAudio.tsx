import { useState, useEffect } from "react";
import { Audio } from "expo-av";
import { dBToLinear } from "../utils/sound";
import { Recording } from "expo-av/build/Audio";

const bufferSize = 50;

const useAudio = () => {
  const [recording, setRecording] = useState<Recording | undefined>(undefined);
  const [levels, setLevels] = useState<number[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const toggleRecording = async () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
    }
    setRecording(undefined);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
  };
  const updateLevel = async () => {
    if (!recording) return;
    const status = await recording.getStatusAsync();
    const linearValue = dBToLinear(status.metering || 0);

    setLevels((prevLevels) => {
      return prevLevels.length < bufferSize
        ? [...prevLevels, linearValue]
        : [...prevLevels.slice(1), linearValue];
    });
  };

  useEffect(() => {
    const interval = setInterval(updateLevel, 100);
    return () => clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [recording]);

  return {
    recording,
    levels,
    recordingTime,
    toggleRecording,
  };
};

export default useAudio;
