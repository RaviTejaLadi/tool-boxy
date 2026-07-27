import { ASCIIArtGeneratorHeader, PreviewPane, ASCIIArtGeneratorSidebar } from './components';

export default function ASCIIArtGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ASCIIArtGeneratorHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ASCIIArtGeneratorSidebar />
      </div>
    </div>
  );
}
