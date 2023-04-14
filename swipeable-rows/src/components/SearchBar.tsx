import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  placeholder: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="gray" />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 35,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    margin: 10,
  },
  input: {
    marginLeft: 5,
    fontSize: 16,
    flex: 1,
  },
});

export default SearchBar;
