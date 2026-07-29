import { BorderRadiusGeneratorHeader, BorderRadiusGeneratorSidebar, PreviewPane } from './components';

export default function BorderRadiusGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <BorderRadiusGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <BorderRadiusGeneratorSidebar />
      </div>
    </div>
  );
}
