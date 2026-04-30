export type RGB = readonly [number, number, number];

export type Vec3 = [number, number, number];

export type NetworkNode = {
  position: Vec3;
  level: number;
  size: number;
};

export type Network = {
  nodes: NetworkNode[];
  edges: Array<[number, number]>;
};

export type Interaction = {
  autoY: number;
  userY: number;
  userX: number;
  velY: number;
  velX: number;
  startUserY: number;
  startUserX: number;
  isDragging: boolean;
  lastT: number;
  scale: number;
};

export type PulseState = {
  pos: Vec3[];
  times: number[];
  tint: Vec3;
  nextSlot: number;
};

export type ThemeUpdater = (idx: number) => void;
export type PulseTrigger = (nx: number, ny: number) => void;
