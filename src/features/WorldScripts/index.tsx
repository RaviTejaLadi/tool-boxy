import { PreviewPane, WorldScriptsHeader, WorldScriptsSidebar } from './components';

export default function WorldScripts() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <WorldScriptsHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <WorldScriptsSidebar />
      </div>
    </div>
  );
}
