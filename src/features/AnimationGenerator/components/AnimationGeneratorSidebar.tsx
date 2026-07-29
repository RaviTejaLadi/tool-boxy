import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeSection } from './CodeSection';
import { MotionSection } from './MotionSection';
import { PresetsSection } from './PresetsSection';
import { StyleSection } from './StyleSection';
import { TimingSection } from './TimingSection';

export function AnimationGeneratorSidebar() {
  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-95 lg:min-h-0 lg:border-t-0 lg:border-l">
      <ScrollArea className="h-full">
        <div className="space-y-7 p-5">
          <MotionSection />
          <PresetsSection />
          <TimingSection />
          <StyleSection />
          <CodeSection />
        </div>
      </ScrollArea>
    </aside>
  );
}
