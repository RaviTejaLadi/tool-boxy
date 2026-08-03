import { ScrollArea } from '@/components/ui/scroll-area';
import { FlexPatternsHeader, PatternDetail, PatternGrid } from './components';

export default function FlexPatterns() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-background text-foreground">
      <FlexPatternsHeader />

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex min-h-0 flex-col border-b border-border lg:w-[min(440px,40%)] lg:border-r lg:border-b-0">
          <ScrollArea className="min-h-0 flex-1">
            <div className="p-4 lg:p-6">
              <PatternGrid />
            </div>
          </ScrollArea>
        </section>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <PatternDetail />
        </section>
      </div>
    </div>
  );
}
