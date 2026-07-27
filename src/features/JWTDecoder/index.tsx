import { JWTDecoderHeader, PreviewPane, JWTDecoderSidebar } from './components';

export default function JWTDecoder() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <JWTDecoderHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <JWTDecoderSidebar />
      </div>
    </div>
  );
}
