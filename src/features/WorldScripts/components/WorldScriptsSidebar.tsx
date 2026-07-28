import { ScrollArea } from '@/components/ui/scroll-area';
import { BrowseSection } from './BrowseSection';
import { DetailsSection } from './DetailsSection';
import { DisplaySection } from './DisplaySection';
import { ExportSection } from './ExportSection';
import { LanguageSection } from './LanguageSection';
import { RelatedLanguagesSection } from './RelatedLanguagesSection';
import { SampleTextSection } from './SampleTextSection';

export function WorldScriptsSidebar() {
  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-95 lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-7 p-5">
          <LanguageSection />
          <BrowseSection />
          <DisplaySection />
          <SampleTextSection />
          <DetailsSection />
          <RelatedLanguagesSection />
          <ExportSection />
        </div>
      </ScrollArea>
    </aside>
  );
}
