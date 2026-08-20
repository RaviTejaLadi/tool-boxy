import { ImageFiltersHeader, PreviewPane, ImageFiltersSidebar } from './components';

export default function ImageFilters() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <ImageFiltersHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <PreviewPane />
        <ImageFiltersSidebar />
      </div>
    </div>
  );
}
