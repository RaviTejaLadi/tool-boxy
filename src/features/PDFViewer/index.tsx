import { PDFOperationsPanel, PDFViewerHeader, PreviewPane } from './components';

export default function PDFViewer() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <PDFViewerHeader />
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <PreviewPane />
        <PDFOperationsPanel />
      </div>
    </div>
  );
}
