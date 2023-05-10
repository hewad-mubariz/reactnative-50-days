import { Image, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { SCREEN_HEIGHT } from "../constants/screen";
type Props = {
  item: any;
  index: number;
  expand: Animated.SharedValue<number>;
};
export const ITEM_HEIGHT = SCREEN_HEIGHT / 13.5;
const MAX_ITEMS = 12;
const ListItem: FC<Props> = ({ item, index, expand }) => {
  const itemContainerAStyle = useAnimatedStyle(() => {
    const initialSpace = (index + 1) * 5;
    const expandedSpace = index * ITEM_HEIGHT;
    const extraSpace = initialSpace / (index + 1) + index * 10;

    const translateY =
      expand.value === 1 ? expandedSpace + extraSpace : initialSpace;
    return {
      width: "100%",
      position: "absolute",
      top: 80,
      zIndex: MAX_ITEMS - index,
      transform: [
        {
          translateY: withSpring(translateY, {
            mass: expand.value ? 0.5 : 0.5,
          }),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.itemContainer, itemContainerAStyle]}>
      <View style={styles.itemLeftContainer}>
        <Image style={styles.itemImage} source={item.image} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={{ color: "gray" }}>{item.subTitle}</Text>
        </View>
      </View>
      <View>
        <Text
          style={[
            styles.itemPrice,
            { color: item.price > 0 ? "green" : "black" },
          ]}
        >
          {item.price > 0 ? "+" : ""}
          {item.price}€
        </Text>
        <Text style={styles.itemDate}>{item.category}</Text>
      </View>
    </Animated.View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_HEIGHT,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.5,
    elevation: 5,
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
    fontWeight: "700",
    textAlign: "right",
  },
  itemDate: {
    color: "gray",
  },
});
