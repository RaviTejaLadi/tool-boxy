import { GlyphBrowserHeader, GlyphBrowserSidebar, PreviewPane } from './components';

export default function GlyphBrowser() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <GlyphBrowserHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <GlyphBrowserSidebar />
      </div>
    </div>
  );
}
