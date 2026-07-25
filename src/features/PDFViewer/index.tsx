import { PDFViewerHeader, PreviewPane } from './components';

export default function PDFViewer() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <PDFViewerHeader />
      <PreviewPane />
    </div>
  );
}
