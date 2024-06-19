import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";

type Notification = {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: string;
};

type NotificationCardProps = {
  notification: Notification;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const Icon = notification.icon;

  return (
    <View style={styles.card}>
      <Icon color="#007AFF" size={24} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {notification.description}
        </Text>
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ececec",
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    color: "#666",
    marginTop: 4,
  },
  timestamp: {
    color: "#999",
    marginTop: 8,
    fontSize: 12,
  },
});

export default NotificationCard;
