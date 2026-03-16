import { useImage } from "@shopify/react-native-skia";

const CUBE_IMAGE_SOURCES = [
  require("../../assets/images/img1.jpeg"),
  require("../../assets/images/img2.jpeg"),
  require("../../assets/images/img3.jpeg"),
  require("../../assets/images/img4.jpg"),
  require("../../assets/images/img5.jpeg"),
  require("../../assets/images/img6.jpeg"),
] as const;

export function useCubeImages() {
  const img1 = useImage(CUBE_IMAGE_SOURCES[0]);
  const img2 = useImage(CUBE_IMAGE_SOURCES[1]);
  const img3 = useImage(CUBE_IMAGE_SOURCES[2]);
  const img4 = useImage(CUBE_IMAGE_SOURCES[3]);
  const img5 = useImage(CUBE_IMAGE_SOURCES[4]);
  const img6 = useImage(CUBE_IMAGE_SOURCES[5]);

  const images = [img1, img2, img3, img4, img5, img6];
  const areLoaded = images.every((img) => img != null);

  return { images, areLoaded };
}
