import { FlexboxPlaygroundHeader, FlexboxPlaygroundSidebar, PreviewPane } from './components';

export default function FlexboxPlayground() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <FlexboxPlaygroundHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <FlexboxPlaygroundSidebar />
      </div>
    </div>
  );
}
