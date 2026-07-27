import { QRCodeGeneratorHeader, PreviewPane, QRCodeGeneratorSidebar } from './components';

export default function QRCodeGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <QRCodeGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <QRCodeGeneratorSidebar />
      </div>
    </div>
  );
}
