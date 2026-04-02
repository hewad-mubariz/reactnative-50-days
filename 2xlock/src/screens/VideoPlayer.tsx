import { VideoFeedItem } from "@/components/VideoFeedItem";
import { FlatList, useWindowDimensions } from "react-native";

const VIDEO_LIST = [
  require("@/assets/videos/video2.mp4"),
  require("@/assets/videos/video1.mp4"),
  require("@/assets/videos/video3.mp4"),
  require("@/assets/videos/video4.mp4"),
];

export const VideoPlayer = () => {
  const { height } = useWindowDimensions();

  return (
    <FlatList
      data={VIDEO_LIST}
      keyExtractor={(_, index) => `video-page-${index}`}
      renderItem={({ item }) => <VideoFeedItem source={item} pageHeight={height} />}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      bounces={false}
      snapToAlignment="start"
      removeClippedSubviews
    />
  );
};
