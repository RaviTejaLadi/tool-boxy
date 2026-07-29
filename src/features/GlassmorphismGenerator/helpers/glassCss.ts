import type { CSSProperties } from 'react';

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.startsWith('#') ? hex : `#${hex}`;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export type GlassOptions = {
  bgColor: string;
  bgOpacity: number;
  borderColor: string;
  borderOpacity: number;
  blur: number;
  borderRadius: number;
  shadowIntensity: number;
  borderWidth: number;
  enableBorder: boolean;
  enableShadow: boolean;
};

export function generateGlassStyle(options: GlassOptions) {
  const bg = hexToRgba(options.bgColor, options.bgOpacity / 100);
  const border = options.enableBorder ? hexToRgba(options.borderColor, options.borderOpacity / 100) : 'transparent';
  const shadow = options.enableShadow ? `0 8px 32px rgba(0,0,0,${options.shadowIntensity / 100})` : 'none';

  return {
    background: bg,
    backdropFilter: `blur(${options.blur}px)`,
    WebkitBackdropFilter: `blur(${options.blur}px)`,
    border: `${options.borderWidth}px solid ${border}`,
    borderRadius: `${options.borderRadius}px`,
    boxShadow: shadow,
  } as CSSProperties;
}

export function generateGlassCssBlock(options: GlassOptions): string {
  const bg = hexToRgba(options.bgColor, options.bgOpacity / 100);
  const border = hexToRgba(options.borderColor, options.borderOpacity / 100);
  const shadowAlpha = options.shadowIntensity / 100;

  return `.glass {
  background: ${bg};
  backdrop-filter: blur(${options.blur}px);
  -webkit-backdrop-filter: blur(${options.blur}px);
  border: ${options.borderWidth}px solid ${options.enableBorder ? border : 'transparent'};
  border-radius: ${options.borderRadius}px;
  box-shadow: ${options.enableShadow ? `0 8px 32px rgba(0,0,0,${shadowAlpha})` : 'none'};
}`;
}
