import { ImageStitcherHeader } from './components/ImageStitcherHeader';
import { PreviewPane } from './components/PreviewPane';
import { ImageStitcherSidebar } from './components/ImageStitcherSidebar';

export default function ImageStitcher() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ImageStitcherHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ImageStitcherSidebar />
      </div>
    </div>
  );
}
