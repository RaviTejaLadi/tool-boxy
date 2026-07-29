import { ContrastCheckerHeader, ContrastCheckerSidebar, PreviewPane } from './components';

export default function ContrastChecker() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ContrastCheckerHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ContrastCheckerSidebar />
      </div>
    </div>
  );
}
