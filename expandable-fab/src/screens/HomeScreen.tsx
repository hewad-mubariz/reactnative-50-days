import React, { useRef } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCREEN_WIDTH } from "../constants/window";

import HeaderItem from "../components/HeaderItem";
import { FABHandle, FAB } from "../components/FAB";

const renderItem = () => <View style={styles.item} />;
const renderHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <HeaderItem />
      <HeaderItem />
    </View>
  );
};

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const fabRef = useRef<FABHandle>(null);

  const handleTouchStart = () => {
    if (fabRef.current) {
      fabRef.current.closeFAB();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={[...Array(20).keys()]}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.listContent}
        onTouchStart={handleTouchStart}
      />
      <FAB ref={fabRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContent: {
    paddingBottom: 100, // Space for the FAB
  },
  column: {
    justifyContent: "space-between",
  },
  item: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    width: SCREEN_WIDTH / 2 - 20,
    height: 150,
    margin: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 40,
    marginBottom: 20,
  },
});
