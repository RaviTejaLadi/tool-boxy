import type { ColorStop, GradientType } from '../constants';

export function generateLinearCSS(angle: number, linearStops: ColorStop[]) {
  const stops = linearStops.map((s) => `${s.color} ${s.position}%`).join(', ');
  return `linear-gradient(${angle}deg, ${stops})`;
}

export function generateCornerCSS(cornerStops: ColorStop[]) {
  const corners: Record<string, string> = {};
  cornerStops.forEach((s) => {
    if (s.label === 'Top Left') corners.tl = s.color;
    else if (s.label === 'Top Right') corners.tr = s.color;
    else if (s.label === 'Bottom Left') corners.bl = s.color;
    else if (s.label === 'Bottom Right') corners.br = s.color;
  });
  return `background: radial-gradient(ellipse at top left, ${corners.tl}, transparent 70%),
radial-gradient(ellipse at top right, ${corners.tr}, transparent 70%),
radial-gradient(ellipse at bottom left, ${corners.bl}, transparent 70%),
radial-gradient(ellipse at bottom right, ${corners.br}, transparent 70%);`;
}

export function generateMeshCSS(meshStops: ColorStop[]) {
  const stops = meshStops
    .map((s) => `radial-gradient( circle at ${s.x}% ${s.y}%, ${s.color}, transparent 60% )`)
    .join(',\n');
  return `/* Mesh gradients cannot be perfectly replicated in CSS. */
Use image export for accurate results.
Below is a rough approximation: */
background: ${stops};`;
}

export function getCurrentCSS(
  activeTab: GradientType,
  angle: number,
  linearStops: ColorStop[],
  cornerStops: ColorStop[],
  meshStops: ColorStop[]
) {
  if (activeTab === 'linear') return generateLinearCSS(angle, linearStops);
  if (activeTab === 'corners') return generateCornerCSS(cornerStops);
  return generateMeshCSS(meshStops);
}

export function getPreviewBackground(
  activeTab: GradientType,
  angle: number,
  linearStops: ColorStop[],
  cornerStops: ColorStop[],
  meshStops: ColorStop[]
): string {
  if (activeTab === 'linear') return generateLinearCSS(angle, linearStops);
  if (activeTab === 'corners') {
    return generateCornerCSS(cornerStops)
      .replace(/background: /, '')
      .replace(/;$/, '');
  }
  return meshStops.map((s) => `radial-gradient(circle at ${s.x}% ${s.y}%, ${s.color}, transparent 60%)`).join(', ');
}
