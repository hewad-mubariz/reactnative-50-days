import Stars from "./src/components/Stars";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stars />
    </GestureHandlerRootView>
  );
}
