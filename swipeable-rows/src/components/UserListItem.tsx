import { View, Text, StyleSheet, Image } from "react-native";
import SwipeableRow from "./SwipeableRow";

type UserListItemProps = {
  name: string;
  lastMessage: string;
  profilePic: any;
  timestamp: string;
  onPress: () => void;
};

const UserListItem: React.FC<UserListItemProps> = ({
  name,
  lastMessage,
  timestamp,
  profilePic,
}) => {
  return (
    <SwipeableRow>
      <Image source={profilePic} style={styles.profilePic} />
      <View style={styles.infoContainer}>
        <View style={styles.nameAndTime}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
    </SwipeableRow>
  );
};

const styles = StyleSheet.create({
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    height: 60,
    justifyContent: "space-evenly",
    borderTopColor: "#E9EDEF",
    borderBottomColor: "#E9EDEF",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    fontSize: 14,
    color: "gray",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    position: "absolute",
    right: 10,
    top: 10,
  },
  nameAndTime: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default UserListItem;
