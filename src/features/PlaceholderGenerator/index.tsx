import { useMemo } from 'react';
import { buildDataUrl, type PlaceholderConfig } from './helpers';
import { PlaceholderGeneratorHeader, PreviewPane, PlaceholderSidebar } from './components';
import { usePlaceholderStore } from './stores';

export type { PlaceholderConfig } from './helpers';

export default function PlaceholderGenerator() {
  const width = usePlaceholderStore((s) => s.width);
  const height = usePlaceholderStore((s) => s.height);
  const customText = usePlaceholderStore((s) => s.customText);
  const bgColor = usePlaceholderStore((s) => s.bgColor);
  const textColor = usePlaceholderStore((s) => s.textColor);

  const config = useMemo<PlaceholderConfig>(
    () => ({
      width,
      height,
      text: customText || `${width} × ${height}`,
      bgColor,
      textColor,
    }),
    [width, height, customText, bgColor, textColor]
  );

  const dataUrl = useMemo(() => buildDataUrl(config), [config]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <PlaceholderGeneratorHeader config={config} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane dataUrl={dataUrl} />
        <PlaceholderSidebar config={config} />
      </div>
    </div>
  );
}
