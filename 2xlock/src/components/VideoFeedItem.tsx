import { VideoPlayerHeader } from "@/components/VideoPlayerHeader";
import { springConfig } from "@/constants/spring";
import { useVideoPlayer, VideoView } from "expo-video";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { clamp, useSharedValue, withSpring } from "react-native-reanimated";

const LOCK_DRAG_DISTANCE = 30;

type VideoFeedItemProps = {
  source: number;
  pageHeight: number;
};

export const VideoFeedItem = ({ source, pageHeight }: VideoFeedItemProps) => {
  const player = useVideoPlayer(source, (p) => {
    p.play();
    p.loop = true;
  });
  const playBackProgress = useSharedValue(0);
  const visibility = useSharedValue(0);
  const isLocked = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart(() => {
      player.playbackRate = 2;
      visibility.value = withSpring(1, springConfig);
    })
    .onUpdate((event) => {
      const downDrag = Math.max(0, event.translationY);
      const rawProgress = downDrag / LOCK_DRAG_DISTANCE;
      const normalizedProgress = Number.isFinite(rawProgress)
        ? clamp(rawProgress, 0, 1)
        : 0;
      playBackProgress.value = normalizedProgress;
      player.playbackRate = 2;
    })
    .onEnd(() => {
      const normalizedProgress = clamp(playBackProgress.value, 0, 1);
      if (normalizedProgress === 1) {
        isLocked.value = 1;
      } else {
        visibility.value = withSpring(0, springConfig);
        player.playbackRate = 1;
      }
    })
    .runOnJS(true);

  const handlePress2xLock = () => {
    if (isLocked.value === 1) {
      visibility.value = withSpring(0, springConfig, (finished) => {
        if (finished) {
          isLocked.value = 0;
        }
      });
      player.playbackRate = 1;
    }
  };

  return (
    <View style={{ height: pageHeight }}>
      <GestureDetector gesture={Gesture.Simultaneous(panGesture)}>
        <Animated.View style={{ flex: 1 }}>
          <VideoView
            nativeControls={false}
            player={player}
            contentFit="cover"
            style={{ flex: 1, backgroundColor: "black" }}
          />
          <VideoPlayerHeader
            progress={playBackProgress}
            visibility={visibility}
            onPress2xLock={handlePress2xLock}
            isLocked={isLocked}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
