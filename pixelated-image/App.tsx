import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Button,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { PixelatedImage } from "./src/components/PixelatedImage";
import { useSharedValue, withTiming } from "react-native-reanimated";
import Pagination from "./src/components/Pagination";

export default function App() {
  const [revealed, setRevealed] = useState(false); // Prevent multiple triggers
  const [imageIndex, setImageIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const handleReveal = () => {
    if (revealed) return; // Prevent re-triggering
    setRevealed(true);

    // Gradually reveal the image
  };
  const images = [
    require("./assets/image1.jpg"),
    require("./assets/image2.jpg"),
    require("./assets/image3.jpg"),
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setImageIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={styles.container}>
      <View style={{ height: height * 0.6 }}>
        <ScrollView
          horizontal
          onScroll={handleScroll}
          pagingEnabled
          style={{ height: height * 0.6 }}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((image, index) => (
            <View
              key={index}
              style={[styles.imageContainer, { width, height: height * 0.6 }]}
            >
              <PixelatedImage
                image={image}
                index={index}
                width={width * 0.9}
                height={height * 0.6}
                currentIndex={imageIndex}
              />
            </View>
          ))}
        </ScrollView>
      </View>
      <Pagination totalLength={images.length} currentIndex={imageIndex} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
