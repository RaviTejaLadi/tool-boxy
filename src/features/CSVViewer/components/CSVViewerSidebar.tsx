import { ScrollArea } from '@/components/ui/scroll-area';
import { InfoSection } from './InfoSection';
import { PaginationSection } from './PaginationSection';
import { SearchSection } from './SearchSection';
import { UploadSection } from './UploadSection';

export function CSVViewerSidebar({ totalPages, totalRows }: { totalPages: number; totalRows: number }) {
  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-95 lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-7 p-5">
          <UploadSection />
          <SearchSection />
          <PaginationSection totalPages={totalPages} totalRows={totalRows} />
          <InfoSection visibleRows={totalRows} />
        </div>
      </ScrollArea>
    </aside>
  );
}
