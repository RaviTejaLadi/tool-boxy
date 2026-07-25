import { ImageSplitterHeader, PreviewPane, ImageSplitterSidebar } from './components';

export default function ImageSplitter() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ImageSplitterHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ImageSplitterSidebar />
      </div>
    </div>
  );
}
