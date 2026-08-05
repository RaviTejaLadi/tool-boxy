import { ScrollArea } from '@/components/ui/scroll-area';
import { ToolsSection } from './ToolsSection';
import { ShapesSection } from './ShapesSection';
import { StyleSection } from './StyleSection';
import { LayersSection } from './LayersSection';
import { ViewSection } from './ViewSection';
import { ExportSection } from './ExportSection';
import { InfoSection } from './InfoSection';
import { ShortcutsSection } from './ShortcutsSection';

export function ImageAnnotatorSidebar() {
  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-95 lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-7 p-5">
          <ToolsSection />
          <ShapesSection />
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
