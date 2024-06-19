import React from "react";
import { StyleSheet, FlatList, ListRenderItem } from "react-native";
import { InviteCard } from "../cards/InviteCard";
import SectionHeader from "../SectionHeader";
import { Search } from "lucide-react-native";
import { Friend, friends } from "../../data";

const renderItem: ListRenderItem<Friend> = ({ item }) => (
  <InviteCard
    profilePicture={item.profilePicture}
    isOnline={item.isOnline}
    name={item.name}
  />
);

const keyExtractor = (item: Friend) => item.id.toString();

export const InvitesList: React.FC = () => {
  return (
    <>
      <SectionHeader title="Invites" Icon={Search} />
      <FlatList
        data={friends}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
});
