import { JSONViewerHeader, CodePane, PreviewPane } from './components';

export default function JSONViewer() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <JSONViewerHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <CodePane />
        <PreviewPane />
      </div>
    </div>
  );
}
