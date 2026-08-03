import type { CSSProperties } from 'react';
import type { FlexItemConfig } from '../constants/patterns';

export function getFlexItemStyle(item: FlexItemConfig): CSSProperties {
  const style: CSSProperties = {
    flexGrow: item.flexGrow ?? 0,
    flexShrink: item.flexShrink ?? 1,
    flexBasis: item.flexBasis ?? 'auto',
  };

  if (item.width === 'auto') style.width = 'auto';
  else if (item.width !== undefined) style.width = item.width;

  if (item.height === 'auto') style.height = 'auto';
  else if (item.height !== undefined) style.height = item.height;

  if (item.alignSelf && item.alignSelf !== 'auto') {
    style.alignSelf = item.alignSelf as CSSProperties['alignSelf'];
  }

  if (item.minWidth !== undefined) style.minWidth = item.minWidth;
  if (item.minHeight !== undefined) style.minHeight = item.minHeight;

  return style;
}
