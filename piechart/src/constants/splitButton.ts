// constants/splitButtonConstants.js
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./window";

const size = 100;
const r = size * 0.2;
const notchDepth = 20;
const notchWidth = 12;
const lineLength = 20;
const lineSpacing = 35;
const angle = 16; // Rotate by 16 degrees

const leftButtonRect = {
  rect: {
    x: 0,
    y: 0, // Changed y to 0
    width: size * 2,
    height: size * 0.75,
  },
  topLeft: { x: r, y: r },
  topRight: { x: 0, y: 0 },
  bottomRight: { x: 0, y: 0 },
  bottomLeft: { x: r, y: r },
};

const rightButtonRect = {
  rect: {
    x: leftButtonRect.rect.width - 8,
    y: 0, // Changed y to 0
    width: size * 1.1,
    height: size * 0.75,
  },
  topLeft: { x: 0, y: 0 },
  topRight: { x: r, y: r },
  bottomRight: { x: r, y: r },
  bottomLeft: { x: 0, y: 0 },
};

const totalWidth = leftButtonRect.rect.width + rightButtonRect.rect.width;
const buttonHeight = leftButtonRect.rect.height; // Use the button height for the SVG

const endPoints = {
  leftButtonRectEndX: leftButtonRect.rect.x + leftButtonRect.rect.width,
  leftButtonRectEndY: leftButtonRect.rect.y + leftButtonRect.rect.height / 2,
  rightButtonRectEndX: rightButtonRect.rect.x + rightButtonRect.rect.width,
  rightButtonRectEndY: rightButtonRect.rect.y + rightButtonRect.rect.height / 2,
};

// Calculate the rotated lines for the collapse part
const linePoints = {
  line1P1: {
    x: endPoints.leftButtonRectEndX,
    y: endPoints.leftButtonRectEndY - lineSpacing / 2,
  },
  line1P2: {
    x:
      endPoints.leftButtonRectEndX +
      lineLength * Math.cos((Math.PI / 180) * angle),
    y:
      endPoints.leftButtonRectEndY -
      lineSpacing / 2 +
      lineLength * Math.sin((Math.PI / 180) * angle),
  },
  line2P1: {
    x: endPoints.leftButtonRectEndX,
    y: endPoints.leftButtonRectEndY + lineSpacing / 2,
  },
  line2P2: {
    x:
      endPoints.leftButtonRectEndX +
      lineLength * Math.cos((Math.PI / 180) * -angle),
    y:
      endPoints.leftButtonRectEndY +
      lineSpacing / 2 +
      lineLength * Math.sin((Math.PI / 180) * -angle),
  },
};

export const splitButtonConstants = {
  size,
  r,
  notchDepth,
  notchWidth,
  leftButtonRect,
  rightButtonRect,
  totalWidth,
  buttonHeight,
  endPoints,
  linePoints,
};
