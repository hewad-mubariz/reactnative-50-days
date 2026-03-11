import GlowyInput from "@/components/GlowyInput";
import { LayoutGrid, User } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { KeyboardGestureArea } from "react-native-keyboard-controller";

const ChatScreen = () => {
  const [message, setMessage] = useState<string>("");
  return (
    <View style={styles.container}>
      <KeyboardGestureArea style={{ flex: 1 }} interpolator="ios">
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <View style={styles.profileIcon}>
              <User size={20} color="#fff" />
            </View>
          </View>

          <View style={styles.rightHeaderIcons}>
            <Pressable style={styles.placeholderIcon}>
              <LayoutGrid size={20} color="#ccc" />
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Awesome Tech</Text>
              <View style={styles.subtitleContainer}>
                <Text style={styles.subtitle}>Chat with AI</Text>
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PLUS</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <GlowyInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={() => {}}
          handleSubmitEditing={() => {}}
          placeholder="Ask anything..."
        />
      </KeyboardGestureArea>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191A1C",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    height: 110,
    zIndex: 10,
  },
  profileContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  rightHeaderIcons: {
    flexDirection: "row",
    gap: 12,
  },
  placeholderIcon: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100, // Move it up from the center
  },
  scrollView: {
    flexGrow: 1,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -1,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -4,
  },
  subtitle: {
    fontSize: 18,
    color: "#4ADE80", // Changed to green to match our theme
    fontWeight: "500",
    marginRight: 6,
  },
  proBadge: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4ADE80",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  proBadgeText: {
    color: "#4ADE80",
    fontSize: 10,
    fontWeight: "bold",
  },
});
export default ChatScreen;
