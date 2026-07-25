import { FaviconGeneratorHeader, PreviewPane, FaviconSidebar } from './components';

export default function FaviconGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <FaviconGeneratorHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <FaviconSidebar />
      </div>
    </div>
  );
}
