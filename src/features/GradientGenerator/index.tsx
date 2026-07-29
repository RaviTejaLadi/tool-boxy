import { GradientGeneratorHeader, GradientGeneratorSidebar, PreviewPane } from './components';

export default function GradientGenerator() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <GradientGeneratorHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <GradientGeneratorSidebar />
      </div>
    </div>
  );
}
