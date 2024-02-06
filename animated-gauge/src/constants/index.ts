import { Dimensions } from "react-native";
const ScreenDimensions = Dimensions.get("screen");
export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = ScreenDimensions;
export const SEGMENT_OVERLAP = 0.05;
export const WIDTH = SCREEN_WIDTH * 0.7;
export const HEIGHT = 300;
const IMAGE_PATH = "../../assets/moods";

export const moods = [
  {
    color: "#b33030", // very sad - dark red
    label: "Oh no",
    value: 1,
    emoji: require(`${IMAGE_PATH}/mood-bad1.png`),
  },
  {
    color: "#d65c5c", // kinda bad - lighter red
    label: "Kinda bad",
    value: 2,
    emoji: require(`${IMAGE_PATH}/mood-bad2.png`),
  },
  {
    color: "#e69999", // not so good - even lighter red
    label: "not so good",
    value: 3,
    emoji: require(`${IMAGE_PATH}/mood-bad3.png`),
  },
  {
    color: "#e6b3b3", // so so - pale red
    label: "so so",
    value: 4,
    emoji: require(`${IMAGE_PATH}/mood-bad4.png`),
  },
  {
    color: "#ffd699", // cant complain - neutral beige
    label: "cant complain",
    value: 5,
    emoji: require(`${IMAGE_PATH}/mood-happy.png`),
  },
  {
    color: "#ffe0b3", // Decent - lighter neutral beige
    label: "Decent",
    value: 6,
    emoji: require(`${IMAGE_PATH}/mood-happy.png`),
  },
  {
    color: "#ccffcc", // Good - light green
    label: "Good",
    value: 7,
    emoji: require(`${IMAGE_PATH}/mood-happy.png`),
  },
  {
    color: "#b3ffb3", // Good! - brighter green
    label: "Good!",
    value: 8,
    emoji: require(`${IMAGE_PATH}/mood-happy.png`),
  },
  {
    color: "#99ff99", // Very Good - even brighter green
    label: "Very Good",
    value: 9,
    emoji: require(`${IMAGE_PATH}/mood-happy.png`),
  },
  {
    color: "#66ff66", // Awesome - bright green
    label: "Awesome",
    value: 10,
    emoji: require(`${IMAGE_PATH}/mood-happy.png`),
  },
];
