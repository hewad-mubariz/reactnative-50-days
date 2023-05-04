import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TextStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../constants/screen";

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);
const IMAGE_PATH = "../../assets";

const getImage = (source: string) => {
  switch (source) {
    case "paypal.png":
      return require(`${IMAGE_PATH}/paypal.png`);
    case "chip.png":
      return require(`${IMAGE_PATH}/chip.png`);
    case "wifi.png":
      return require(`${IMAGE_PATH}/wifi.png`);
    case "master-card.png":
      return require(`${IMAGE_PATH}/master-card.png`);
    default:
      return null;
  }
};

const renderImage = (source: string) => (
  <Image style={styles.image} source={getImage(source)} />
);

const renderStyledText = (style: TextStyle, content: string) => (
  <Text style={[styles.rotatedText, style]}>{content}</Text>
);

const FlippyCard = () => {
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(withTiming(-180, { duration: 1000 }), -1, true);
  }, [rotation]);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
    backfaceVisibility: "hidden",
    padding: 15,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value + 180}deg` }],
    backfaceVisibility: "hidden",
  }));

  const renderBackContent = () => (
    <AnimatedGradient
      colors={["#CEE8D2", "#BDE1C9"]}
      style={[styles.card, styles.cardBack, backAnimatedStyle]}
    >
      <View style={styles.backContent}>
        <View style={styles.leftSide}>
          {renderStyledText(styles.companyName, "Bank Co.")}
          {renderStyledText(styles.phoneNumber, "+49 170 1234567")}
        </View>
        <View style={styles.blackLabel} />
        <CardDetails />
      </View>
    </AnimatedGradient>
  );

  const renderFrontContent = () => (
    <AnimatedGradient
      colors={["#CEE8D2", "#BDE1C9"]}
      style={[styles.card, frontAnimatedStyle]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>{renderImage("paypal.png")}</View>
        <View style={styles.headerRight}>
          {renderImage("chip.png")}
          {renderImage("wifi.png")}
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text}>debit</Text>
        {renderImage("master-card.png")}
      </View>
    </AnimatedGradient>
  );

  return (
    <LinearGradient colors={["#0443CA", "#3279DE"]} style={styles.container}>
      <View style={styles.cardContainer}>
        {renderFrontContent()}
        {renderBackContent()}
      </View>
    </LinearGradient>
  );
};

const CardDetails = () => (
  <View style={styles.cardInfo}>
    <View style={{ marginTop: 8, alignSelf: "flex-end" }}>
      {renderImage("master-card.png")}
    </View>

    <Text style={styles.sectionTitle}>Card Number</Text>
    <Text style={styles.sectionSubTitle}>4352**** ****1234</Text>
    <View style={styles.row}>
      <View>
        <Text style={styles.sectionTitle}>Valid Up to</Text>
        <Text style={styles.sectionSubTitle}>04/27</Text>
      </View>
      <View>
        <Text style={[styles.sectionTitle, { fontWeight: "400" }]}>CVC</Text>
        <Text style={styles.sectionSubTitle}>04/27</Text>
      </View>
    </View>
    <Text style={styles.sectionTitle}>Card Holder</Text>
    <Text style={styles.sectionSubTitle}>Hewad Mubariz</Text>
  </View>
);

export default FlippyCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  cardContainer: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotateZ: "10deg" }],
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    justifyContent: "space-between",
  },
  cardBack: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {},
  headerRight: {
    flexDirection: "row",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#5B8C82",
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  backContent: {
    flex: 1,
    flexDirection: "row",
  },
  leftSide: {
    flex: 0.2,
    justifyContent: "space-between",
  },
  rightSide: {
    flex: 1,
  },
  rotatedText: {
    transform: [{ rotate: "-90deg" }],
    color: "#68A490",
    textAlign: "center",
  },
  //should be calculated
  phoneNumber: {
    width: SCREEN_WIDTH * 0.5,
    bottom: 75,
    right: 85,
  },
  //should be calculated
  companyName: {
    width: SCREEN_WIDTH * 0.5,
    top: 40,
    right: 85,
  },
  blackLabel: {
    width: 50,
    height: "100%",
    backgroundColor: "#007A6F",
  },
  sectionTitle: {
    color: "#2A7560",
    fontWeight: "bold",
    marginVertical: 8,
    textAlign: "left",
  },
  sectionSubTitle: {
    color: "#2A7560",
    marginVertical: 4,
  },
  topRight: {
    alignSelf: "flex-end",
    flex: 1,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
