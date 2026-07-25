import { BaseConverterHeader, PreviewPane, BaseConverterSidebar } from './components';

export default function BaseConverter() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <BaseConverterHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <BaseConverterSidebar />
      </div>
    </div>
  );
}
