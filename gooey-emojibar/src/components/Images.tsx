import {
  useImage,
  Image,
  rrect,
  rect,
  Group,
  RoundedRect,
} from "@shopify/react-native-skia";
import { useWindowDimensions } from "react-native";

const Images = () => {
  const { width, height } = useWindowDimensions();
  const image = useImage(require("../../assets/image1.jpg"));

  // Define main image dimensions
  const imgWidth = width * 0.9;
  const imgHeight = height / 1.6;
  const cornerRadius = 20;

  // Offset values for the stacked effect
  const spacing = 12;

  // Define the main rounded rectangle (clipping shape for image)
  const mainRoundedRect = rrect(
    rect((width - imgWidth) / 2, (height - imgHeight) / 2, imgWidth, imgHeight),
    cornerRadius,
    cornerRadius
  );

  if (!image) {
    return null;
  }

  return (
    <Group>
      {/* Bottom-most Card (largest & slightly offset) */}
      <RoundedRect
        x={(width - imgWidth) / 2}
        y={(height - imgHeight) / 2 + spacing * 2}
        width={imgWidth}
        height={imgHeight}
        r={cornerRadius}
        color="#8f4a66"
        opacity={0.3}
      />

      {/* Middle Card (slightly smaller and offset) */}
      <RoundedRect
        x={(width - imgWidth) / 2}
        y={(height - imgHeight) / 2 + spacing}
        width={imgWidth}
        height={imgHeight}
        r={cornerRadius}
        color="#8f4a66"
        opacity={0.5}
      />

      {/* Main Image (on top, clipped with rounded corners) */}
      <Group clip={mainRoundedRect}>
        <Image
          image={image}
          width={imgWidth}
          height={imgHeight}
          x={(width - imgWidth) / 2}
          y={(height - imgHeight) / 2}
          fit="cover"
        />
      </Group>
    </Group>
  );
};

export default Images;
