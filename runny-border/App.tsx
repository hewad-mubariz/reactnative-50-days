import { StyleSheet, Text, View } from "react-native";
import Button from "./src/components/Button";
import { useState } from "react";
import ButtonGradient from "./src/components/ButtonGradient";

export default function App() {
  const [loadingGradeint, setLoadingGradient] = useState(false);
  const [loadingPrimary, setLoadingPrimay] = useState(false);
  const [loadingPurple, setLoadingPurlple] = useState(false);
  return (
    <View style={styles.container}>
      <ButtonGradient
        onPress={() => setLoadingGradient(!loadingGradeint)}
        loading={loadingGradeint}
      />

      <Button
        loading={loadingPurple}
        onPress={() => setLoadingPurlple(!loadingPurple)}
      />

      <Button
        borderColor="rgba(0, 123, 255,0.8)"
        loading={loadingPrimary}
        onPress={() => setLoadingPrimay(!loadingPrimary)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
