import { LoremIpsumGeneratorHeader, PreviewPane, LoremIpsumGeneratorSidebar } from './components';

export default function LoremIpsumGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <LoremIpsumGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <LoremIpsumGeneratorSidebar />
      </div>
    </div>
  );
}
