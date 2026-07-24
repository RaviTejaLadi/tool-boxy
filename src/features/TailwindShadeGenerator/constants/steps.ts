export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type ShadeStep = (typeof STEPS)[number];

/** Fixed lightness / chroma ladder used by Classic mode. */
export const BASE_LADDER: Record<ShadeStep, { L: number; C: number }> = {
  50: { L: 0.97, C: 0.056 },
  100: { L: 0.93, C: 0.056 },
  200: { L: 0.87, C: 0.188 },
  300: { L: 0.78, C: 0.188 },
  400: { L: 0.66, C: 0.188 },
  500: { L: 0.55, C: 0.188 },
  600: { L: 0.47, C: 0.188 },
  700: { L: 0.4, C: 0.188 },
  800: { L: 0.33, C: 0.188 },
  900: { L: 0.27, C: 0.113 },
  950: { L: 0.2, C: 0.113 },
};
