/** Distance (px) from bottom of content to treat scroll as "at end". */
export const SCROLL_END_THRESHOLD = 40;

export const springConfig = {
  damping: 50,
  stiffness: 400,
} as const;

export function isScrollAtEnd(
  contentOffsetY: number,
  contentHeight: number,
  viewportHeight: number,
  threshold: number = SCROLL_END_THRESHOLD,
): boolean {
  return contentOffsetY + viewportHeight >= contentHeight - threshold;
}
