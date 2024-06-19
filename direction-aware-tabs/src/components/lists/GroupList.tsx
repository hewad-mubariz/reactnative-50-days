import { StyleSheet, FlatList, ListRenderItem } from "react-native";
import React from "react";
import { GroupCard } from "../cards/GroupCard";
import { Search } from "lucide-react-native"; // Example icons
import SectionHeader from "../SectionHeader";
import { Group, groups } from "../../data";

const renderItem: ListRenderItem<Group> = ({ item }) => (
  <GroupCard
    Icon={item.Icon}
    color={item.color}
    groupName={item.groupName}
    description={item.description}
    membersCount={item.membersCount}
    followersCount={item.followersCount}
    followersIncluding={item.followersIncluding}
    avatars={item.avatars}
    onAddPress={() => alert(`Join ${item.groupName}`)}
    timestamp={item.timestamp}
  />
);

const keyExtractor = (item: Group) => item.id.toString();

const GroupList: React.FC = () => {
  return (
    <>
      <SectionHeader title="Groups" Icon={Search} />

      <FlatList
        data={groups}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.container}
      />
    </>
  );
};

export default GroupList;

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});
