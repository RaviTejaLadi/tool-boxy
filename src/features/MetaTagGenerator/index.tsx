import { MetaTagGeneratorHeader, MetaTagGeneratorSidebar, PreviewPane } from './components';

export default function MetaTagGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <MetaTagGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <MetaTagGeneratorSidebar />
      </div>
    </div>
  );
}
