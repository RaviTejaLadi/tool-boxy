import { PreviewPane, WordCounterHeader, WordCounterSidebar } from './components';

export default function WordCounter() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <WordCounterHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <WordCounterSidebar />
      </div>
    </div>
  );
}
