import { ScrollArea } from '@/components/ui/scroll-area';
import { ToolsSection } from './ToolsSection';
import { ShapesSection } from './ShapesSection';
import { PagesSection } from './PagesSection';
import { StyleSection } from './StyleSection';
import { LayersSection } from './LayersSection';
import { ViewSection } from './ViewSection';
import { ExportSection } from './ExportSection';
import { InfoSection } from './InfoSection';
import { ShortcutsSection } from './ShortcutsSection';

export function DocumentAnnotatorSidebar() {
  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-80 lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-5 p-4">
          <ToolsSection />
          <ShapesSection />
          <PagesSection />
          <StyleSection />
          <LayersSection />
          <ViewSection />
          <ExportSection />
          <InfoSection />
          <ShortcutsSection />
        </div>
      </ScrollArea>
    </aside>
  );
}
