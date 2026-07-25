import { ImageConverterHeader, PreviewPane, ImageConverterSidebar } from './components';

export default function ImageConverter() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ImageConverterHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ImageConverterSidebar />
      </div>
    </div>
  );
}
