import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Check, X } from "lucide-react-native";

type FriendCardProps = {
  profilePicture: string;
  isOnline: boolean;
  name: string;
};

export const InviteCard: React.FC<FriendCardProps> = ({
  profilePicture,
  isOnline,
  name,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: profilePicture }} style={styles.avatar} />
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.buttonsContainer}>
          <Pressable
            style={[
              styles.iconButton,
              { borderWidth: 1, borderColor: "#8377d1" },
            ]}
          >
            <X color="#007AFF" size={20} />
          </Pressable>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: "#8377d1" }]}
          >
            <Check color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    marginHorizontal: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
