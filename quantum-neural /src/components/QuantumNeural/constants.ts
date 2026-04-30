// All numeric tuning lives here. Both the JS data generators and the WGSL
// shader templates reference these, so changes here update both sides at once.

// ===== UI / DENSITY ==========================================================
export const DENSITY_MIN = 0.4;
export const DENSITY_MAX = 2.2;
export const DENSITY_DEFAULT = 1.0;

// ===== SKY / STARS ===========================================================
export const STAR_COUNT = 60000;
export const STAR_INNER_RADIUS = 28;
export const STAR_OUTER_RADIUS = 80;

// 8 floats per star: vec3 pos, f32 size, vec3 color, f32 phase.
export const STAR_STRIDE_FLOATS = 8;

export const STAR_TINY_FRACTION = 0.85;
export const STAR_TINY_SIZE_MIN = 0.05;
export const STAR_TINY_SIZE_MAX = 0.16;
export const STAR_BRIGHT_SIZE_MIN = 0.2;
export const STAR_BRIGHT_SIZE_MAX = 0.55;

export const STAR_WHITE_FRACTION = 0.62;
export const STAR_BLUE_FRACTION = 0.22;

export const STAR_TWINKLE_SPEED = 1.8;
export const STAR_SIZE_PULSE_BASE = 0.35;
export const STAR_SIZE_PULSE_AMP = 0.75;
export const STAR_COLOR_BASE = 0.5;
export const STAR_COLOR_AMP = 1.15;
export const STAR_HALO_STRENGTH = 0.7;
export const STAR_CORE_SHARPNESS = 3.2;
export const STAR_HALO_SOFTNESS = 1.3;

export const STAR_ROTATION_SPEED = 0.025;

// ===== NETWORK GEOMETRY ======================================================
export const NETWORK_LAYERS = 5;
export const NETWORK_POINT_FACTOR = 0.8;
export const RADIUS_PER_LAYER = 0.26;
export const SAME_LAYER_NEIGHBORS = 5;
export const PREV_LAYER_NEIGHBORS = 3;
export const CROSS_SHELL_CONNECTIONS = 20;

export const LINE_SEGMENTS = 12;
export const LINE_VERTS_PER_EDGE = LINE_SEGMENTS * 2;

// Vertex buffer strides (bytes).
export const NODE_POS_STRIDE = 16;
export const NODE_COLOR_STRIDE = 12;
export const LINE_POS_STRIDE = 32;
export const LINE_COLOR_STRIDE = 12;

// ===== PULSE / TAP ===========================================================
export const PULSE_SPEED = 2.5;
export const PULSE_LIFETIME = 3.4;
export const PULSE_ATTACK = 0.08;
export const PULSE_DECAY = 3.2;
export const PULSE_SIZE_BOOST = 3.4;
export const PULSE_FLASH_BOOST = 1.3;

// ===== NODE LOOK =============================================================
export const NODE_INNER_GLOW_RADIUS = 0.3;
export const NODE_OUTER_GLOW = 0.5;
export const NODE_CORE_RADIUS = 0.4;
export const NODE_CORE_SHINE = 0.6;
export const NODE_RECT_GLOW = 0.72;
export const NODE_RECT_EDGE = 5;
export const NODE_RECT_BG_GLOW = 0.58;
export const NODE_RECT_BG_EDGE = 2.24;
export const NODE_CROSS_SHINE = 0.34;
export const PULSE_RECT_BOOST = 2.8;

// ===== AMBIENT LIFE (always on) =============================================
export const NODE_COLOR_BREATHE = 0.15;
export const NODE_BREATHE_SPEED = 0.6;
export const LINE_COLOR_BREATHE = 0.22;
export const AMBIENT_WAVE_FREQ = 5.0;
export const AMBIENT_WAVE_SPEED = 1.4;
export const AMBIENT_SIZE_BOOST = 0.16;
export const AMBIENT_BRIGHT_BOOST = 0.24;
export const AMBIENT_LINE_BOOST = 0.2;
export const DESYNC_STRENGTH = 0.65;
export const SECONDARY_WAVE_MIX = 0.38;

// ===== BLOOM POSTPROCESS =====================================================
export const BLOOM_THRESHOLD = 0.5;
export const BLOOM_INTENSITY = 1.7;
export const BLOOM_DOWNSAMPLE = 2;
export const BLOOM_BLUR_RADIUS = 8;

// ===== INTERACTION (pan + tilt) ==============================================
export const MOMENTUM_DECAY = 0.8;
export const MOMENTUM_VEL_SENS = 0.0022;
export const MOMENTUM_VEL_MAX = 4.0;
export const TILT_LIMIT = 1.4;

// Camera position used both for the lookAt matrix and for the tap-raycast plane.
export const CAMERA_POS = [0, 1.2, 5] as const;
