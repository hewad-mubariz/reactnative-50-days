import { Image, StyleSheet, Text, View } from "react-native";
import { SCREEN_WIDTH } from "../../constants/screen";
type Props = {
  screen: any;
};

const OnboardingItem = ({ screen }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={screen.image} style={styles.image} />
      <Text style={styles.title}>{screen.title}</Text>
      <Text style={styles.description}>{screen.description}</Text>
    </View>
  );
};

export default OnboardingItem;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: 350,
  },
  title: {
    color: "#ab49c1",
    fontSize: 22,
    fontWeight: "bold",
  },
  description: {
    color: "#7598a5",
    width: "80%",
    textAlign: "center",
    marginVertical: 16,
  },
  header: {
    alignSelf: "flex-end",
    margin: 10,
    marginBottom: 10,
  },
});
