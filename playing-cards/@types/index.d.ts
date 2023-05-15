type Suit = "hearts" | "diamonds" | "clubs" | "spades";

type Card = {
  suit: Suit;
  rank: string;
};

type FlipCardProps = {
  suit: Suit;
  rank: string;
  width: number;
  height: number;
};
