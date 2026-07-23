// @ts-nocheck — typed gradually
import { useEffect, useMemo, useRef } from 'react';
import { CODE_FONT, THEMES, BACKGROUNDS } from './constants';
import { tokenize, linesFromTokens, buildSVG } from './helpers';
import { CodeSnippetHeader, PreviewPane, CodeSnippetSidebar } from './components';
import { useCodeStore, useThemeStore, useBackgroundStore, useWindowStore, useExportStore } from './stores';

export default function CodeSnippet() {
  const code = useCodeStore((s) => s.code);
  const langId = useCodeStore((s) => s.langId);
  const title = useCodeStore((s) => s.title);

  const themeId = useThemeStore((s) => s.themeId);

  const bgId = useBackgroundStore((s) => s.bgId);
  const customColor = useBackgroundStore((s) => s.customColor);

  const showTitleBar = useWindowStore((s) => s.showTitleBar);
  const showWindowControls = useWindowStore((s) => s.showWindowControls);
  const showLineNumbers = useWindowStore((s) => s.showLineNumbers);
  const showShadow = useWindowStore((s) => s.showShadow);
  const cornerRadius = useWindowStore((s) => s.cornerRadius);
  const fontSize = useWindowStore((s) => s.fontSize);
  const framePadding = useWindowStore((s) => s.framePadding);

  const exportScale = useExportStore((s) => s.exportScale);
  const setFrameSize = useExportStore((s) => s.setFrameSize);

  const measureCanvasRef = useRef(null);
  const getMeasureCtx = () => {
    if (!measureCanvasRef.current) {
      measureCanvasRef.current = document.createElement('canvas').getContext('2d');
    }
    return measureCanvasRef.current;
  };

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const background =
    bgId === 'custom' ? { type: 'custom', label: 'Custom' } : BACKGROUNDS.find((b) => b.id === bgId) || BACKGROUNDS[0];

  const lines = useMemo(() => linesFromTokens(tokenize(code, langId)), [code, langId]);

  const { svg, frameWidth, frameHeight } = useMemo(() => {
    const ctx = getMeasureCtx();
    ctx.font = `${fontSize}px ${CODE_FONT}`;
    const measure = (text) => ctx.measureText(text).width;
    return buildSVG({
      lines,
      theme,
      background,
      customColor,
      showTitleBar,
      title,
      showWindowControls,
      showLineNumbers,
      showShadow,
      cornerRadius,
      fontSize,
      framePadding,
      measure,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lines,
    theme,
    background,
    customColor,
    showTitleBar,
    title,
    showWindowControls,
    showLineNumbers,
    showShadow,
    cornerRadius,
    fontSize,
    framePadding,
  ]);

  useEffect(() => {
    setFrameSize(frameWidth, frameHeight);
  }, [frameWidth, frameHeight, setFrameSize]);

  const fileBase =
    (title || 'code')
      .trim()
      .replace(/[^a-z0-9-_]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'code';

  function downloadSVG() {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileBase}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function downloadPNG() {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(frameWidth * exportScale);
      canvas.height = Math.ceil(frameHeight * exportScale);
      const ctx = canvas.getContext('2d');
      ctx.scale(exportScale, exportScale);
      ctx.drawImage(img, 0, 0, frameWidth, frameHeight);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        const dlUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = dlUrl;
        a.download = `${fileBase}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(dlUrl);
      }, 'image/png');
    };
    img.src = url;
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <CodeSnippetHeader onDownloadSVG={downloadSVG} onDownloadPNG={downloadPNG} />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane svg={svg} isTransparent={background.type === 'transparent'} />
        <CodeSnippetSidebar />
      </div>
    </div>
  );
}
