export type DataSourceOption = "Revenue" | "Downloads" | "MRR";

export type DataSourceMenuProps = {
  value: DataSourceOption;
  onChange: (value: DataSourceOption) => void;
  style?: object;
};
export type RangeType = "1M" | "3M" | "1Y";
export const DATA_SOURCE_OPTIONS: DataSourceOption[] = [
  "Revenue",
  "Downloads",
  "MRR",
];
