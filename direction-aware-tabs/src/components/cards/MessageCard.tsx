import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

type MessageCardProps = {
  profilePicture: string;
  isOnline: boolean;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadMessages: number;
};

export const MessageCard: React.FC<MessageCardProps> = ({
  profilePicture,
  isOnline,
  name,
  lastMessage,
  timestamp,
  unreadMessages,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        {isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.lastMessage}>{lastMessage}</Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        {unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadMessages}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  profileContainer: {
    position: "relative",
  },
  profilePicture: {
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
    backgroundColor: "#00FF00",
    borderWidth: 2,
    borderColor: "#fff",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lastMessage: {
    color: "#888",
    fontSize: 14,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  timestamp: {
    color: "#888",
    fontSize: 12,
  },
  unreadBadge: {
    marginTop: 5,
    backgroundColor: "#6246ea",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
