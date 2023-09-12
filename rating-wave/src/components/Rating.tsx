import { FC } from "react";
import Svg from "react-native-svg";

import AnimatedStar from "./AnimatedStar";
interface RatingProps {
  rating: number;
}

const SIZE = 30;
const NUMBER_OF_STARS = 5;
const totalWidth = SIZE * NUMBER_OF_STARS;

const Rating: FC<RatingProps> = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <Svg width={totalWidth} height={SIZE}>
      {[...Array(NUMBER_OF_STARS)].map((_, index) => {
        const isFilled =
          index < filledStars || (index === filledStars && hasHalfStar);
        const isHalfFilled = index === filledStars && hasHalfStar;
        return (
          <AnimatedStar
            key={index}
            index={index}
            filled={isFilled}
            halfFill={isHalfFilled}
          />
        );
      })}
    </Svg>
  );
};

export default Rating;
