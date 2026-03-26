// chartData.ts

const POINTS = 40;

type RangeType = "1M" | "3M" | "1Y";

/**
 * Small deterministic pseudo-random number from index
 * So the chart stays stable and doesn't change every render
 */
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Linear interpolation
 */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Smooth interpolation curve
 */
const easeInOut = (t: number) => t * t * (3 - 2 * t);

/**
 * Config for one chart series: control points (anchors) and bump/jitter.
 * - anchors: Y values 0..100 along the curve (more points = more control).
 * - noiseAmount: random jitter per point (higher = rougher).
 * - wiggleAmount: sine-wave bumps (higher = more pronounced bumps).
 * - smoothPasses: moving-average passes (higher = smoother).
 */
export type ChartShapeConfig = {
  anchors: number[];
  noiseAmount?: number;
  wiggleAmount?: number;
  smoothPasses?: number;
  /** Optional seed offset so different sources get different curves. */
  seedOffset?: number;
};

/**
 * Build a curve from anchor points (control points) and optional bumps/jitter.
 * anchors = Y values 0..100; curve interpolates between them.
 */
const generateFromAnchors = (
  anchors: number[],
  totalPoints: number,
  noiseAmount = 2.5,
  wiggleAmount = 1.5,
  smoothPasses = 2,
  seedOffset = 0,
) => {
  const result: number[] = [];
  const segments = anchors.length - 1;

  for (let i = 0; i < totalPoints; i++) {
    const t = i / (totalPoints - 1);
    const segmentFloat = t * segments;
    const segmentIndex = Math.min(Math.floor(segmentFloat), segments - 1);
    const localT = segmentFloat - segmentIndex;

    const a = anchors[segmentIndex];
    const b = anchors[segmentIndex + 1];

    // Base interpolated trend (control points)
    let value = lerp(a, b, easeInOut(localT));

    // Bumps: organic wiggle
    const wiggle =
      Math.sin(t * Math.PI * 8) * wiggleAmount +
      Math.sin(t * Math.PI * 17) * (wiggleAmount * 0.45);

    // Jitter: per-point noise (seedOffset varies by data source for distinct curves)
    const jitter = (pseudoRandom(i + anchors.length * 10 + seedOffset) - 0.5) * noiseAmount;

    value += wiggle + jitter;

    result.push(clamp(value, 8, 92));
  }

  return smoothData(result, smoothPasses);
};

/**
 * Moving average smoothing
 */
const smoothData = (data: number[], passes = 1) => {
  let smoothed = [...data];

  for (let p = 0; p < passes; p++) {
    smoothed = smoothed.map((_, i, arr) => {
      const prev = arr[Math.max(0, i - 1)];
      const curr = arr[i];
      const next = arr[Math.min(arr.length - 1, i + 1)];
      return prev * 0.25 + curr * 0.5 + next * 0.25;
    });
  }

  return smoothed;
};

/** Build series from config: control points (anchors) + bumps (noise/wiggle). */
const generateFromConfig = (config: ChartShapeConfig, seedOffset = 0): number[] => {
  const {
    anchors,
    noiseAmount = 2.5,
    wiggleAmount = 1.5,
    smoothPasses = 2,
    seedOffset: configSeed = 0,
  } = config;
  return generateFromAnchors(
    anchors,
    POINTS,
    noiseAmount,
    wiggleAmount,
    smoothPasses,
    seedOffset + configSeed,
  );
};

/** Shape configs per range: tweak anchors for control points, noise/wiggle for bumps. */
const CHART_SHAPE_CONFIGS: Record<RangeType, ChartShapeConfig> = {
  "1M": {
    anchors: [58, 63, 60, 45, 43, 40, 35],
    noiseAmount: 50,
    wiggleAmount: 10,
    smoothPasses: 2,
  },
  "3M": {
    anchors: [42, 30, 38, 36, 55, 45, 62, 40, 34],
    noiseAmount: 100,
    wiggleAmount: 20,
    smoothPasses: 2,
  },
  "1Y": {
    anchors: [48, 44, 20, 40, 35, 68, 52, 66, 58, 62],
    noiseAmount: 300,
    wiggleAmount: 30,
    smoothPasses: 2,
  },
};

const generateChartDataForSource = (type: RangeType, sourceSeed: number) =>
  generateFromConfig(CHART_SHAPE_CONFIGS[type], sourceSeed);

/** Revenue-style summary per range: total value + % vs previous period */
export type RangeMeta = {
  totalValue: number;
  percentChange: number;
  periodLabel: string;
};

/** Single source (e.g. Revenue): chart data + metadata per range. */
export type ChartDataBySource = {
  chartDataSets: Record<RangeType, number[]>;
  rangeMetadata: Record<RangeType, RangeMeta>;
};

/** Seeds per source so each has a distinct curve (Revenue=0, Downloads=1000, MRR=2000). */
const SOURCE_SEEDS: Record<string, number> = {
  Revenue: 0,
  Downloads: 1000,
  MRR: 2000,
};

/** Metadata per source so the header value and % change update when you switch. */
const METADATA_BY_SOURCE: Record<string, Record<RangeType, RangeMeta>> = {
  Revenue: {
    "1M": { totalValue: 13_914, percentChange: 1.2, periodLabel: "last month" },
    "3M": { totalValue: 42_350, percentChange: 5.5, periodLabel: "last 3 months" },
    "1Y": { totalValue: 155_220, percentChange: 72.7, periodLabel: "last year" },
  },
  Downloads: {
    "1M": { totalValue: 28_450, percentChange: -2.1, periodLabel: "last month" },
    "3M": { totalValue: 89_200, percentChange: 8.3, periodLabel: "last 3 months" },
    "1Y": { totalValue: 312_000, percentChange: 24.5, periodLabel: "last year" },
  },
  MRR: {
    "1M": { totalValue: 4_200, percentChange: 0.8, periodLabel: "last month" },
    "3M": { totalValue: 12_100, percentChange: 3.2, periodLabel: "last 3 months" },
    "1Y": { totalValue: 48_500, percentChange: 18.0, periodLabel: "last year" },
  },
};

/** All data sources: each has its own curve (via source seed) and metadata. */
export const CHART_DATA_BY_SOURCE: Record<string, ChartDataBySource> = {
  Revenue: {
    chartDataSets: {
      "1M": generateChartDataForSource("1M", SOURCE_SEEDS.Revenue),
      "3M": generateChartDataForSource("3M", SOURCE_SEEDS.Revenue),
      "1Y": generateChartDataForSource("1Y", SOURCE_SEEDS.Revenue),
    },
    rangeMetadata: METADATA_BY_SOURCE.Revenue,
  },
  Downloads: {
    chartDataSets: {
      "1M": generateChartDataForSource("1M", SOURCE_SEEDS.Downloads),
      "3M": generateChartDataForSource("3M", SOURCE_SEEDS.Downloads),
      "1Y": generateChartDataForSource("1Y", SOURCE_SEEDS.Downloads),
    },
    rangeMetadata: METADATA_BY_SOURCE.Downloads,
  },
  MRR: {
    chartDataSets: {
      "1M": generateChartDataForSource("1M", SOURCE_SEEDS.MRR),
      "3M": generateChartDataForSource("3M", SOURCE_SEEDS.MRR),
      "1Y": generateChartDataForSource("1Y", SOURCE_SEEDS.MRR),
    },
    rangeMetadata: METADATA_BY_SOURCE.MRR,
  },
};

/** Legacy: same as Revenue for backwards compatibility. */
export const CHART_DATA_SETS = CHART_DATA_BY_SOURCE.Revenue.chartDataSets;
export const RANGE_METADATA = CHART_DATA_BY_SOURCE.Revenue.rangeMetadata;

export { CHART_SHAPE_CONFIGS, POINTS };
