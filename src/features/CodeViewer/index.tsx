import { CodeViewerHeader, CodeViewerSidebar, PreviewPane } from './components';

export default function CodeViewer() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <CodeViewerHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <CodeViewerSidebar />
      </div>
    </div>
  );
}
