import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { AlertCircle, Copy, Download, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { PREVIEW_BACKGROUNDS, PREVIEW_TABS, type PreviewBackground, type PreviewTab } from '../constants';
import { downloadDataUrl, downloadText, svgToDataUri, svgToPngDataUrl, svgToReact, svgToReactNative } from '../helpers';
import { useViewerStore } from '../stores';
import { OutputCodePanel } from './OutputCodePanel';

function backgroundStyle(bg: PreviewBackground): CSSProperties | undefined {
  if (bg === 'white') return { background: '#ffffff' };
  if (bg === 'black') return { background: '#000000' };
  if (bg === 'checker') {
    return {
      backgroundImage:
        'repeating-conic-gradient(color-mix(in oklab, var(--muted-foreground) 35%, transparent) 0% 25%, transparent 0% 50%)',
      backgroundSize: '16px 16px',
    };
  }
  return {
    backgroundImage:
      'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
    backgroundSize: '22px 22px',
  };
}

function formatDataUriExport(dataUri: string): string {
  const escaped = dataUri.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  if (escaped.length <= 88) {
    return `export const iconDataUri = '${escaped}';\n`;
  }
  return `export const iconDataUri =\n  '${escaped}';\n`;
}

export function PreviewPane() {
  const svgCode = useViewerStore((s) => s.svgCode);
  const error = useViewerStore((s) => s.error);
  const scale = useViewerStore((s) => s.scale);
  const previewTab = useViewerStore((s) => s.previewTab);
  const previewBackground = useViewerStore((s) => s.previewBackground);
  const zoomIn = useViewerStore((s) => s.zoomIn);
  const zoomOut = useViewerStore((s) => s.zoomOut);
  const resetZoom = useViewerStore((s) => s.resetZoom);
  const setPreviewTab = useViewerStore((s) => s.setPreviewTab);
  const setPreviewBackground = useViewerStore((s) => s.setPreviewBackground);

  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngError, setPngError] = useState<string | null>(null);

  const reactCode = useMemo(() => (error ? '' : svgToReact(svgCode)), [svgCode, error]);
  const rnCode = useMemo(() => (error ? '' : svgToReactNative(svgCode)), [svgCode, error]);
  const dataUri = useMemo(() => (error ? '' : svgToDataUri(svgCode)), [svgCode, error]);
  const dataUriExport = useMemo(() => (dataUri ? formatDataUriExport(dataUri) : ''), [dataUri]);

  useEffect(() => {
    if (previewTab !== 'png' || error || !svgCode.trim()) {
      setPngUrl(null);
      setPngError(null);
      return;
    }
    let cancelled = false;
    setPngError(null);
    svgToPngDataUrl(svgCode)
      .then((url) => {
        if (!cancelled) setPngUrl(url);
      })
      .catch(() => {
        if (!cancelled) {
          setPngUrl(null);
          setPngError('Failed to render PNG.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [previewTab, svgCode, error]);

  const isCodeTab = previewTab === 'react' || previewTab === 'react-native' || previewTab === 'data-uri';

  const copyActive = async () => {
    const map: Record<PreviewTab, string> = {
      preview: svgCode,
      react: reactCode,
      'react-native': rnCode,
      png: pngUrl ?? '',
      'data-uri': dataUri,
    };
    const value = map[previewTab];
    if (value) await navigator.clipboard.writeText(value);
  };

  const downloadActive = async () => {
    if (previewTab === 'preview') {
      downloadText(svgCode, 'icon.svg', 'image/svg+xml');
      return;
    }
    if (previewTab === 'react') {
      downloadText(reactCode, 'Icon.tsx', 'text/typescript');
      return;
    }
    if (previewTab === 'react-native') {
      downloadText(rnCode, 'Icon.jsx', 'text/javascript');
      return;
    }
    if (previewTab === 'data-uri') {
      downloadText(dataUri, 'icon-data-uri.txt', 'text/plain');
      return;
    }
    if (previewTab === 'png') {
      const url = pngUrl ?? (await svgToPngDataUrl(svgCode));
      downloadDataUrl(url, 'icon.png');
    }
  };

  return (
    <section className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
        <Tabs value={previewTab} onValueChange={(v) => setPreviewTab(v as PreviewTab)} className="min-w-0 flex-1">
          <TabsList
            variant="line"
            className="h-8 max-w-full justify-start gap-0 overflow-x-auto overflow-y-hidden rounded-none p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {PREVIEW_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent px-3 py-0 font-mono text-[11px] text-muted-foreground after:hidden hover:text-foreground data-active:border-primary data-active:bg-primary/10 data-active:font-semibold data-active:text-primary data-active:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={copyActive} aria-label="Copy output">
          <Copy className="size-4" />
        </Button>
      </div>

      <div
        className={cn(
          'flex min-h-0 flex-1 overflow-auto',
          isCodeTab ? 'items-stretch justify-stretch p-4 lg:p-5' : 'items-center justify-center p-6'
        )}
        style={isCodeTab ? undefined : backgroundStyle(previewBackground)}
      >
        {error ? (
          <div className="m-auto flex max-w-md flex-col items-center gap-2 border border-destructive/40 bg-background/90 px-4 py-6 text-center text-destructive">
            <AlertCircle className="size-5" />
            <p className="font-mono text-[11px]">{error}</p>
          </div>
        ) : previewTab === 'preview' ? (
          <div
            className="border border-dashed border-border bg-background/40 p-4 transition-transform duration-200 ease-in-out [&_svg]:block [&_svg]:h-auto [&_svg]:max-w-full"
            style={{ transform: `scale(${scale})` }}
            dangerouslySetInnerHTML={{ __html: svgCode }}
          />
        ) : previewTab === 'react' ? (
          <OutputCodePanel code={reactCode} language="tsx" filename="Icon.tsx" label="React component" />
        ) : previewTab === 'react-native' ? (
          <OutputCodePanel code={rnCode} language="jsx" filename="Icon.jsx" label="React Native SVG" />
        ) : previewTab === 'data-uri' ? (
          <OutputCodePanel
            code={dataUriExport}
            language="jsx"
            filename="iconDataUri.js"
            label="Data URI export"
            copyValue={dataUri}
          />
        ) : pngError ? (
          <p className="font-mono text-[11px] text-destructive">{pngError}</p>
        ) : pngUrl ? (
          <img
            src={pngUrl}
            alt="PNG preview"
            className="max-h-full max-w-full border border-dashed border-border"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          />
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground">Rendering PNG…</p>
        )}
      </div>

      <div className="flex h-12 shrink-0 items-center gap-2 border-t border-border bg-background/80 px-3 backdrop-blur-sm">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={zoomOut}
            aria-label="Zoom out"
            disabled={isCodeTab}
          >
            <Minus className="size-4" />
          </Button>
          <button
            type="button"
            onClick={resetZoom}
            disabled={isCodeTab}
            className="min-w-12 px-1 text-center font-mono text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            {Math.round(scale * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={zoomIn}
            aria-label="Zoom in"
            disabled={isCodeTab}
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          {PREVIEW_BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              title={bg.label}
              aria-label={bg.label}
              disabled={isCodeTab}
              onClick={() => setPreviewBackground(bg.id)}
              className={cn(
                'size-6 border border-border disabled:opacity-40',
                previewBackground === bg.id && !isCodeTab && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
              )}
              style={
                bg.id === 'surface'
                  ? {
                      backgroundImage:
                        'radial-gradient(circle, color-mix(in oklab, var(--foreground) 20%, transparent) 1px, transparent 1px)',
                      backgroundSize: '6px 6px',
                      backgroundColor: 'var(--muted)',
                    }
                  : bg.id === 'white'
                  ? { background: '#fff' }
                  : bg.id === 'black'
                  ? { background: '#000' }
                  : {
                      backgroundImage: 'repeating-conic-gradient(#c4c4c4 0% 25%, #fff 0% 50%)',
                      backgroundSize: '8px 8px',
                    }
              }
            />
          ))}
        </div>

        <Button size="sm" className="ml-auto" onClick={downloadActive} disabled={!!error || !svgCode.trim()}>
          <Download data-icon="inline-start" />
          Download
        </Button>
      </div>
    </section>
  );
}
