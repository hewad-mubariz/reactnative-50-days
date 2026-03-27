import { StyleSheet, useWindowDimensions, View } from "react-native";
import { DeckSwiper } from "../components/deck-swiper";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const DUMMY_DATA = [
  {
    id: "1",
    title: "Quarterly Sales Performance",
    description:
      "Our Q1 performance metrics are finally in, and the results are staggering. We've exceeded our primary growth targets by over 15%, driven largely by the successful rollout of the new enterprise tier. Let's maintain this incredible momentum as we transition into the Q2 roadmap planning phase next week.",
    tag: "Today",
    category: "#Engineering",
    mention: "You were mentioned",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "2",
    title: "Design System Evolution",
    description:
      "The core design system team has just pushed a major update to our Figma library. This release includes the highly anticipated fluid typography scales and a completely revamped color palette optimized for accessibility. Please ensure you've synced the latest library version before starting any new component work.",
    tag: "Tuesday",
    category: "#Design",
    mention: "Team update",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "3",
    title: "Cloud Infrastructure Migration",
    description:
      "We are officially scheduled to migrate our staging environment to the new high-performance cluster this coming weekend. This move is critical for improving our deployment velocity and system reliability",
    tag: "Wednesday",
    category: "#DevOps",
    mention: "Action required",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "4",
    title: "Product Vision 2026",
    description:
      "The initial draft for our 2026 product vision is now open for internal feedback. We are pivoting our core focus toward AI-native automation and extreme performance optimizations across the entire stack. Your input is invaluable as we shape the future of how our users interact with the platform.",
    tag: "Thursday",
    category: "#Product",
    mention: "You were mentioned",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "5",
    title: "Emergency Security Patch",
    description:
      "A critical zero-day vulnerability was discovered in the authentication middleware late last night. Our security team has already deployed a hotfix to production, but all developers must immediately update their local environments to version 4.2.1 to ensure continued security compliance.",
    tag: "Friday",
    category: "#Security",
    mention: "High priority",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "6",
    title: "GraphQL API Documentation",
    description:
      "The public-facing API documentation has been completely overhauled to reflect the new GraphQL schema. We've added comprehensive examples for the new subscription endpoints and a detailed section on breaking changes. Please review the updated documentation before migrating any client-side queries.",
    tag: "Saturday",
    category: "#Engineering",
    mention: "Team update",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "7",
    title: "User Research Insights",
    description:
      "Insights from our latest round of user interviews are now available in the research repository. While 80% of participants found the new navigation intuitive, there's significant friction identified in the multi-step checkout flow. We'll be holding a workshop to brainstorm potential UI solutions this Friday.",
    tag: "Sunday",
    category: "#Product",
    mention: "You were mentioned",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "8",
    title: "Welcome Our New Lead Designer",
    description:
      "We're thrilled to announce that Sarah Jenkins will be joining our design organization as the new Senior Lead Product Designer. Sarah brings a wealth of experience from her time at several top-tier tech firms and will be spearheading our upcoming mobile app redesign project starting next Monday.",
    tag: "Monday",
    category: "#Design",
    mention: "Announcement",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "9",
    title: "Database Query Optimization",
    description:
      "Our backend team has successfully optimized the primary indexing strategy for the global activity feed. This change has resulted in a 40% reduction in query latency and significantly lower CPU utilization on our database clusters. Users should notice a much snappier experience when loading their feeds.",
    tag: "Tuesday",
    category: "#Engineering",
    mention: "System update",
    image: require("../../assets/images/slack.png"),
  },
  {
    id: "10",
    title: "Q2 Marketing Strategy",
    description:
      "The final assets for our Q2 global marketing campaign have been approved and are ready for distribution. We'll be launching the new 'Speed of Thought' campaign across all major social channels and tech publications starting tomorrow morning. Please coordinate with the social team for any cross-promotion.",
    tag: "Wednesday",
    category: "#Marketing",
    mention: "Action required",
    image: require("../../assets/images/slack.png"),
  },
];

export default function App() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Header />
      <DeckSwiper
        data={DUMMY_DATA}
        cardWidth={width * 0.92}
        cardHeight={height * 0.6}
      />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeaea",
  },
});
