import Svg, { Rect } from "react-native-svg";

interface AudioVisualizerProps {
  levels: number[];
  width: number;
  height: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  levels,
  width,
  height,
}) => {
  const bufferSize = 50;
  const barWidth = width / bufferSize;
  const minHeight = 4;
  const spacing = 2;

  return (
    <Svg width={width} height={height}>
      {levels.map((level, index) => {
        const barHeight = Math.max(minHeight, height * level);
        const x = (index + (bufferSize - levels.length)) * barWidth; // Adjust x position
        const y = (height - barHeight) / 2;

        return (
          <Rect
            key={index}
            x={x}
            rx={3}
            ry={3}
            y={y}
            width={barWidth - spacing}
            height={barHeight}
            fill="#017BFE"
          />
        );
      })}
    </Svg>
  );
};

export default AudioVisualizer;
