import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import MasterCard from "../components/MasterCard";
type CardDetailRouteProps = RouteProp<RootStackParamList, "CardDetail">;

const imagePath = "../../assets/list";

const list = [
  {
    id: 1,
    title: "Amazon",
    subTitle: "Groceries",
    date: new Date(),
    image: require(`${imagePath}/amazon.png`),
    price: 100,
  },
  {
    id: 2,
    title: "Apple",
    subTitle: "Electronics",
    date: new Date(),
    image: require(`${imagePath}/apple.png`),
    price: 200,
  },
  {
    id: 3,
    title: "Dribbble",
    subTitle: "Design",
    date: new Date(),
    image: require(`${imagePath}/dribble.png`),
    price: 50,
  },
  {
    id: 4,
    title: "GitHub",
    subTitle: "Code",
    date: new Date(),
    image: require(`${imagePath}/github.png`),
    price: 75,
  },
  {
    id: 5,
    title: "Instagram",
    subTitle: "Social Media",
    date: new Date(),
    image: require(`${imagePath}/instagram.png`),
    price: 150,
  },
  {
    id: 6,
    title: "Figma",
    subTitle: "Design Tool",
    date: new Date(),
    image: require(`${imagePath}/figma.png`),
    price: 120,
  },
  {
    id: 7,
    title: "Twitter",
    subTitle: "Social Media",
    date: new Date(),
    image: require(`${imagePath}/twitter.png`),
    price: 90,
  },
  {
    id: 8,
    title: "Spotify",
    subTitle: "Music Streaming",
    date: new Date(),
    image: require(`${imagePath}/spotify.png`),
    price: 60,
  },
  {
    id: 9,
    title: "Netflix",
    subTitle: "Video Streaming",
    date: new Date(),
    image: require(`${imagePath}/netflix.png`),
    price: 80,
  },
  {
    id: 10,
    title: "Dropbox",
    subTitle: "Cloud Storage",
    date: new Date(),
    image: require(`${imagePath}/dropbox.png`),
    price: 55,
  },
];
const CardDetail = () => {
  const route = useRoute<CardDetailRouteProps>();
  const { card } = route.params;

  const navigation = useNavigation();
  const handleCardPress = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={{ backgroundColor: "#EBEAF7", flex: 1 }}>
      <View style={styles.content}>
        <StatusBar barStyle={"dark-content"} />
        <Pressable onPress={handleCardPress}>
          <MasterCard type={card} />
        </Pressable>
        <View style={styles.list}>
          <ScrollView contentContainerStyle={{ marginTop: 20 }}>
            {list.map((item, index) => {
              return (
                <Animated.View
                  entering={FadeInUp.delay(index * 160)}
                  key={index}
                  style={styles.itemContainer}
                >
                  <View style={styles.itemLeftContainer}>
                    <Image style={styles.itemImage} source={item.image} />
                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={{ color: "gray" }}>{item.subTitle}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.itemPrice}>${item.price}</Text>
                    <Text style={styles.itemDate}>
                      {item.date.toLocaleDateString()}
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CardDetail;

const styles = StyleSheet.create({
  content: {
    paddingVertical: 10,
    flex: 1,
    paddingHorizontal: 10,
  },
  list: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  itemLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  itemTextContainer: {
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  itemDate: {
    color: "gray",
  },
});
