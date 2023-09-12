import { Image, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import Rating from "../components/Rating";
interface AppRatingProps {
  rating: number;
}
const AppRating: FC<AppRatingProps> = ({ rating }) => {
  const userImages = [
    require("../../assets/users/user1.jpeg"),
    require("../../assets/users/user2.jpeg"),
    require("../../assets/users/user3.jpeg"),
    require("../../assets/users/user4.jpeg"),
    require("../../assets/users/user5.jpeg"),
  ];
  return (
    <View style={styles.userRatingContainer}>
      <View style={styles.avatarsContainer}>
        {userImages.map((img, index) => (
          <Image
            key={index}
            source={img}
            style={[styles.avatar, { left: index * 20 }]}
          />
        ))}
      </View>
      <View>
        <Rating rating={rating} />
        <Text style={styles.designersText}>Loved by 1000+ developers</Text>
      </View>
    </View>
  );
};

export default AppRating;

const styles = StyleSheet.create({
  userRatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
  },
  avatarsContainer: {
    width: 115,
    flexDirection: "row",
    marginTop: 10,
    position: "relative",
  },
  designersText: {
    marginTop: 5,
    fontSize: 14,
    color: "white",
  },
});
