import { StatusBar } from "expo-status-bar";
import EmojiBar from "./src/components/Reaction";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <EmojiBar />
    </GestureHandlerRootView>
  );
}
