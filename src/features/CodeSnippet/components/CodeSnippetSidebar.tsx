// @ts-nocheck — typed gradually
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeSection } from './CodeSection';
import { ThemeSection } from './ThemeSection';
import { BackgroundSection } from './BackgroundSection';
import { WindowSection } from './WindowSection';
import { ExportInfo } from './ExportInfo';

export function CodeSnippetSidebar() {
  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-[380px] lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-7 p-5">
          <CodeSection />
          <ThemeSection />
          <BackgroundSection />
          <WindowSection />
          <ExportInfo />
        </div>
      </ScrollArea>
    </aside>
  );
}
