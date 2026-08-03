import type { FlexPattern } from './patterns';

export function getPatternCanvasSize(pattern: FlexPattern) {
  return {
    width: pattern.previewWidth,
    height: pattern.container.minHeight ?? pattern.previewHeight,
  };
}

export const PREVIEW_STAGE_CLASS = 'flex items-center justify-center bg-muted/40 p-4';

export const PREVIEW_CONTAINER_CLASS = 'box-border overflow-hidden border border-dashed border-border bg-background';

export const PREVIEW_ITEM_CLASS =
  'box-border flex min-w-0 items-center justify-center border border-border bg-muted px-2 font-medium text-muted-foreground';
