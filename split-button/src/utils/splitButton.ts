// constants/splitButtonPaths.js
import { splitButtonConstants } from "../constants/splitButton";

const {
  notchDepth,
  notchWidth,
  leftButtonRect,
  rightButtonRect,
  endPoints,
  linePoints,
} = splitButtonConstants;

// First shape path with the rounded rectangle and the middle lines
export const pathData1 = `
  M ${leftButtonRect.rect.x + leftButtonRect.topLeft.x},${leftButtonRect.rect.y}
  H ${endPoints.leftButtonRectEndX - leftButtonRect.topRight.x}
  A ${leftButtonRect.topRight.x},${leftButtonRect.topRight.y} 0 0 1 ${
  endPoints.leftButtonRectEndX
},${leftButtonRect.rect.y + leftButtonRect.topRight.y}
  V ${
    leftButtonRect.rect.y +
    leftButtonRect.rect.height -
    leftButtonRect.bottomRight.y
  }
  A ${leftButtonRect.bottomRight.x},${leftButtonRect.bottomRight.y} 0 0 1 ${
  endPoints.leftButtonRectEndX - leftButtonRect.bottomRight.x
},${leftButtonRect.rect.y + leftButtonRect.rect.height}
  H ${leftButtonRect.rect.x + leftButtonRect.bottomLeft.x}
  A ${leftButtonRect.bottomLeft.x},${leftButtonRect.bottomLeft.y} 0 0 1 ${
  leftButtonRect.rect.x
},${
  leftButtonRect.rect.y +
  leftButtonRect.rect.height -
  leftButtonRect.bottomLeft.y
}
  V ${endPoints.leftButtonRectEndY}
  L ${leftButtonRect.rect.x + notchDepth},${endPoints.leftButtonRectEndY}
  L ${leftButtonRect.rect.x},${endPoints.leftButtonRectEndY}
  V ${leftButtonRect.rect.y + leftButtonRect.topLeft.y}
  A ${leftButtonRect.topLeft.x},${leftButtonRect.topLeft.y} 0 0 1 ${
  leftButtonRect.rect.x + leftButtonRect.topLeft.x
},${leftButtonRect.rect.y}
  Z

  M ${linePoints.line1P1.x} ${linePoints.line1P1.y}
  L ${linePoints.line1P2.x} ${linePoints.line1P2.y}
  L ${linePoints.line2P2.x} ${linePoints.line2P2.y}
  L ${linePoints.line2P1.x} ${linePoints.line2P1.y}
  Z
`;

// Second shape path
export const pathData2 = `
  M ${rightButtonRect.rect.x},${rightButtonRect.rect.y}
  H ${endPoints.rightButtonRectEndX - rightButtonRect.topRight.x}
  A ${rightButtonRect.topRight.x},${rightButtonRect.topRight.y} 0 0 1 ${
  endPoints.rightButtonRectEndX
},${rightButtonRect.rect.y + rightButtonRect.topRight.y}
  V ${
    rightButtonRect.rect.y +
    rightButtonRect.rect.height -
    rightButtonRect.bottomRight.y
  }
  A ${rightButtonRect.bottomRight.x},${rightButtonRect.bottomRight.y} 0 0 1 ${
  endPoints.rightButtonRectEndX - rightButtonRect.bottomRight.x
},${rightButtonRect.rect.y + rightButtonRect.rect.height}
  H ${rightButtonRect.rect.x}
  V ${endPoints.rightButtonRectEndY + notchWidth * 1.6}
  L ${rightButtonRect.rect.x + notchDepth},${
  endPoints.rightButtonRectEndY + notchWidth
}
  L ${rightButtonRect.rect.x + notchDepth},${
  endPoints.rightButtonRectEndY - notchWidth
}
  L ${rightButtonRect.rect.x},${
  endPoints.rightButtonRectEndY - notchWidth * 1.6
}
  Z
`;

// Right arrow path
export const arrowPath = `
  M ${rightButtonRect.rect.x + rightButtonRect.rect.width / 2 - 5},${
  rightButtonRect.rect.y + rightButtonRect.rect.height / 2 - 10
}
  L ${rightButtonRect.rect.x + rightButtonRect.rect.width / 2 + 5},${
  rightButtonRect.rect.y + rightButtonRect.rect.height / 2
}
  L ${rightButtonRect.rect.x + rightButtonRect.rect.width / 2 - 5},${
  rightButtonRect.rect.y + rightButtonRect.rect.height / 2 + 10
}
  M ${rightButtonRect.rect.x + rightButtonRect.rect.width / 2 + 5},${
  rightButtonRect.rect.y + rightButtonRect.rect.height / 2
}
  L ${rightButtonRect.rect.x + rightButtonRect.rect.width / 2 - 18},${
  rightButtonRect.rect.y + rightButtonRect.rect.height / 2
}
`;
