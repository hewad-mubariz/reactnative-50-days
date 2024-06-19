import React from "react";
import { View, FlatList, StyleSheet, ListRenderItem } from "react-native";
import { Search } from "lucide-react-native";
import SectionHeader from "../SectionHeader";
import NotificationCard from "../cards/NotificationCard";
import { Notification, notifications } from "../../data";

const renderItem: ListRenderItem<Notification> = ({ item }) => (
  <NotificationCard notification={item} />
);

const keyExtractor = (item: Notification) => item.id.toString();

const NotificationList: React.FC = () => {
  return (
    <>
      <SectionHeader title="Notifications" Icon={Search} />
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.contentContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  contentContainer: {
    padding: 16,
  },
});

export default NotificationList;
