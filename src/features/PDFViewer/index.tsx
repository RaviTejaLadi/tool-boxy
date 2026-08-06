import { useState } from 'react';
import { PDFOperationsPanel, PDFViewerHeader, PreviewPane } from './components';

export default function PDFViewer() {
  const [showOperationsPanel, setShowOperationsPanel] = useState(true);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <PDFViewerHeader
        showOperationsPanel={showOperationsPanel}
        onToggleOperationsPanel={() => setShowOperationsPanel((value) => !value)}
      />
      <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
        <PreviewPane />
        {showOperationsPanel && <PDFOperationsPanel onCollapse={() => setShowOperationsPanel(false)} />}
      </div>
    </div>
  );
}
