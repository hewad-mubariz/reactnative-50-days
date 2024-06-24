import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Accordion } from "./src/components/Accordion";
import Header from "./src/components/Header";
import { faqs } from "./src/data";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header />

        {/* FAQs */}
        {faqs.map((item) => {
          return (
            <Accordion
              key={item.id}
              title={item.title}
              description={item.description}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    backgroundColor: "#151515",
  },
  contentContainer: {
    paddingTop: 80,
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  subTitle: {
    color: "#585c5c",
  },
});
