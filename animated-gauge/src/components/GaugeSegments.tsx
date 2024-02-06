import { moods } from "../constants";
import { GaugeSegment } from "./GaugeSegment";

export const GaugeSegments = ({
  handleSegmentPress,
}: {
  handleSegmentPress: (moodValue: number) => void;
}): JSX.Element => {
  return (
    <>
      {moods.map((_, i) => (
        <GaugeSegment
          key={i}
          index={i}
          handleSegmentPress={handleSegmentPress}
        />
      ))}
    </>
  );
};
