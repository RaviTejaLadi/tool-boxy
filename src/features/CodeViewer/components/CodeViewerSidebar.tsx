import { ScrollArea } from '@/components/ui/scroll-area';
import { useCodeViewerStore } from '../stores';
import { ExplorerSection } from './ExplorerSection';
import { FindingsSection } from './FindingsSection';
import { GrepSection } from './GrepSection';
import { InfoSection } from './InfoSection';
import { InsightsSection } from './InsightsSection';
import { OutlineSection } from './OutlineSection';
import { SearchSection } from './SearchSection';
import { SidebarPanelTabs } from './SidebarPanelTabs';
import { UploadSection } from './UploadSection';
import { ViewSection } from './ViewSection';

export function CodeViewerSidebar() {
  const folderName = useCodeViewerStore((s) => s.folderName);
  const sidebarPanel = useCodeViewerStore((s) => s.sidebarPanel);

  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-95 lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-6 p-5">
          <UploadSection />
          {folderName && <SidebarPanelTabs />}

          {sidebarPanel === 'files' && (
            <>
              <SearchSection />
              <ExplorerSection />
              <OutlineSection />
              <ViewSection />
              <InfoSection />
            </>
          )}
          {sidebarPanel === 'search' && <GrepSection />}
          {sidebarPanel === 'insights' && <InsightsSection />}
          {sidebarPanel === 'findings' && <FindingsSection />}
        </div>
      </ScrollArea>
    </aside>
  );
}
