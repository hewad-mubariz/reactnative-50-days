import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { LucideIcon, Clock, CheckCheck } from "lucide-react-native";

type GroupCardProps = {
  Icon?: LucideIcon;
  color?: string;
  groupName: string;
  description: string;
  membersCount: number;
  followersCount: number;
  followersIncluding: string;
  avatars: string[];
  onAddPress: () => void;
  timestamp: string;
};

function getRandomInt() {
  return Math.floor(Math.random() * 9) + 1;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  groupName,
  description,
  avatars,
  color,
  Icon,
  timestamp,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <Text style={styles.groupName}>{groupName}</Text>
          {Icon ? (
            <View>
              <Icon color={color} size={20} />
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getRandomInt()}</Text>
            </View>
          )}
        </View>
        <Text numberOfLines={3} style={styles.description}>
          {description}
        </Text>
        <View style={styles.separator} />
        <View style={styles.footer}>
          <View style={styles.avatarsContainer}>
            {avatars.map((avatar, index) => (
              <Image
                key={index}
                source={{ uri: avatar }}
                style={[styles.avatar, { marginLeft: index > 0 ? -10 : 0 }]}
              />
            ))}
            <View style={styles.moreMembersContainer}>
              <Text style={styles.moreMembersText}>+{getRandomInt()}</Text>
            </View>
          </View>
          <View style={styles.timestampContainer}>
            <Clock size={18} color={"#909ead"} />
            <Text style={styles.timestamp}>{timestamp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ececec",
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ececec",
    marginVertical: 8,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  badge: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6246ea",
    borderRadius: 10,
  },
  badgeText: {
    color: "white",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  moreMembersContainer: {
    backgroundColor: "#eeeef3",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    marginLeft: -10,
    borderRadius: 17.5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  moreMembersText: {
    color: "#6246ea",
    fontSize: 14,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    marginLeft: 4,
    color: "#888",
    fontSize: 14,
  },
});

export default GroupCard;
