import { Base64ImageEncoderHeader, PreviewPane, Base64Sidebar } from './components';

export default function Base64ImageEncoder() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <Base64ImageEncoderHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <Base64Sidebar />
      </div>
    </div>
  );
}
