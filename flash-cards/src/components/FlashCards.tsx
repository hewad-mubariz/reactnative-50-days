import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { SCREEN_WIDTH } from "../constants/window";
import Controls from "./Controls";
import FlashCard from "./FlashCard";
import Header from "./Header";
export interface CardData {
  question: string;
  answer: string;
  category: string;
}
const cardsData: CardData[] = [
  {
    question: "Who Invented The Mouse?",
    answer: "Douglas Engelbart",
    category: "Technology",
  },
  {
    question: "What is the longest river in the world?",
    answer: "The Nile River",
    category: "Geography",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    answer: "William Shakespeare",
    category: "Literature",
  },
  {
    question: "What is the largest planet in our Solar System?",
    answer: "Jupiter",
    category: "Astronomy",
  },
  {
    question: "What is the speed of light?",
    answer: "299,792 km/s",
    category: "Physics",
  },
];
export const FlashCards = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollViewRef.current?.scrollTo({
        x: (currentIndex - 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  const onNext = () => {
    if (currentIndex < cardsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    }
  };

  return (
    <LinearGradient style={{ flex: 1 }} colors={["#6b67da", "#dbb1f0"]}>
      <Header />
      <ScrollView
        horizontal
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
      >
        {cardsData.map((data, index) => (
          <FlashCard key={index} {...{ data }} />
        ))}
      </ScrollView>
      <Controls onPrev={onPrev} onNext={onNext} />
    </LinearGradient>
  );
};
