import { ChartScreen } from "@/screens/ChartScreen";
import { useState } from "react";

export default function index() {
  const [rollingDigitValue, setRollingDigitValue] = useState(13914);
  return <ChartScreen />;
}
