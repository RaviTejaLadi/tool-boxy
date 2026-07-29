import { useMetaTagStore } from '../stores';

function OgImage({ imageUrl }: { imageUrl: string }) {
  if (!imageUrl) {
    return <span className="text-sm text-muted-foreground">No image</span>;
  }
  return (
    <img
      src={imageUrl}
      alt="OG preview"
      className="h-full w-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

export function PreviewPane() {
  const pageTitle = useMetaTagStore((s) => s.pageTitle);
  const description = useMetaTagStore((s) => s.description);
  const url = useMetaTagStore((s) => s.url);
  const imageUrl = useMetaTagStore((s) => s.imageUrl);
  const siteName = useMetaTagStore((s) => s.siteName);
  const showPreview = useMetaTagStore((s) => s.showPreview);

  if (!showPreview) {
    return (
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center overflow-hidden bg-muted/40 p-6">
        <p className="font-mono text-sm text-muted-foreground">Preview hidden — use header to show</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40">
      <div
        className="flex min-h-0 flex-1 flex-col overflow-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 lg:p-10">
          <div className="w-full max-w-lg overflow-hidden border border-border bg-background shadow-sm">
            <div className="border-b border-border p-4">
              <div className="truncate text-xs text-green-700 dark:text-green-500">{url}</div>
              <div className="truncate text-lg font-medium text-blue-600 dark:text-blue-400">
                {pageTitle || 'Page Title'}
              </div>
              <div className="line-clamp-2 text-sm text-muted-foreground">{description || 'Page description…'}</div>
            </div>
            <div className="bg-muted/30 p-4">
              <div className="mb-2 font-mono text-[10px] uppercase text-muted-foreground">Social card</div>
              <div className="overflow-hidden border border-border bg-background">
                <div className="relative flex aspect-[1.91/1] items-center justify-center bg-muted">
                  <OgImage imageUrl={imageUrl} />
                </div>
                <div className="p-3">
                  <div className="truncate text-xs uppercase text-muted-foreground">{siteName || 'example.com'}</div>
                  <div className="truncate font-semibold">{pageTitle || 'Page Title'}</div>
                  <div className="line-clamp-2 text-sm text-muted-foreground">{description || 'Description'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
