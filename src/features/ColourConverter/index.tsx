import { ColourConverterHeader, ColourConverterSidebar, PreviewPane } from './components';

export default function ColourConverter() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ColourConverterHeader />
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ColourConverterSidebar />
      </div>
    </div>
  );
}
