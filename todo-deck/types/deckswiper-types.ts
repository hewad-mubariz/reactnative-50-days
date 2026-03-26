import { SharedValue } from "react-native-reanimated";
// Define a generic type that extends the item with `uniqueSwipeIndex`
export type ItemWithSwipeIndex<T> = T & {
  uniqueSwipeIndex: number;
};
export enum SwipeDirections {
  Left = "left",
  Right = "right",
  Down = "down",
  Up = "up",
}
// Define shared properties for Deck components
type CommonDeckProps<T> = {
  item: T;
  index: number;
  cardWidth: number;
  cardHeight: number;
  maxVisibleItems: number;
  cardOffset: number;
  totalItems: number;
  opacityEffect?: boolean;
  renderCard: (item: T, index: number) => React.ReactNode;
  onLongPressCard?: (item: T, index: number) => void;
  onLongPressEnd?: (item: T, index: number) => void;
  onSwipeLeft?: (item: T, index: number) => void;
  onSwipeRight?: (item: T, index: number) => void;
  onSwipeUp?: (item: T, index: number) => void;
  onSwipeDown?: (item: T, index: number) => void;
  onItemSwiped?: (item: T, direction: SwipeDirections) => void;
  activeSwipeIndex?: number;
  onSwipeDirectionDetected?: (item: T, direction: SwipeDirections) => void;
  onSwipeFinalize?: () => void;
  jitterOnLongPress?: boolean;
  scaleFactor?: number;
  shadowEffect?: boolean;
  preventSwipeDirections?: SwipeDirections[];
};

// Props specific to the DeckSwiper component
export type DeckSwiperProps<T> = Omit<CommonDeckProps<T>, "item" | "index"> & {
  data: T[];
  renderKey: (item: T, index: number) => string | number;
  uniqueidentifier?: keyof T;
  infinit?: boolean;
  longPressEffect?: boolean;
  ignoreInfinitDirections?: SwipeDirections[];

  renderEmptyDeck?: () => React.ReactNode;
};

// Props specific to the DeckCard component
export type DeckCardProps<T> = CommonDeckProps<T> & {
  onItemSwiped: (item: T, direction: SwipeDirections) => void;
  onItemSwipedEnd?: (item: T, direction: SwipeDirections) => void;
  sharedProgress: SharedValue<number>;
  gestureEnabled: boolean;
  isSwipeEnabled?: boolean;
  uniqueSwipeIndex: number;
  totalVisibleItems: number;
};
