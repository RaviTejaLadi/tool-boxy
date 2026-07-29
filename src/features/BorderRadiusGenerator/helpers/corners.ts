export type CornerValues = {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
};

export const DEFAULT_CORNERS: CornerValues = {
  topLeft: 8,
  topRight: 8,
  bottomRight: 8,
  bottomLeft: 8,
};

export function formatBorderRadius(corners: CornerValues): string {
  return `${corners.topLeft}px ${corners.topRight}px ${corners.bottomRight}px ${corners.bottomLeft}px`;
}

export function formatBorderRadiusCss(corners: CornerValues): string {
  return `border-radius: ${formatBorderRadius(corners)};`;
}
