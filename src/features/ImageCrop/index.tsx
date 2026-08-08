import { ImageCropHeader, PreviewPane, ImageCropSidebar } from './components';

export default function ImageCrop() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ImageCropHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ImageCropSidebar />
      </div>
    </div>
  );
}
