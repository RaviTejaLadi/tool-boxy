import { Box, Type } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAnimationGeneratorStore } from '../stores';
import { CodeSection } from './CodeSection';
import { MotionSection } from './MotionSection';
import { StyleSection } from './StyleSection';
import { TextMotionSection } from './TextMotionSection';
import { TextPropertiesSection } from './TextPropertiesSection';
import { TimingSection } from './TimingSection';

export function AnimationGeneratorSidebar() {
  const previewMode = useAnimationGeneratorStore((s) => s.previewMode);
  const setPreviewMode = useAnimationGeneratorStore((s) => s.setPreviewMode);

  return (
    <aside className="flex max-h-[50svh] w-full shrink-0 flex-col overflow-hidden border-t border-border bg-card lg:h-full lg:max-h-none lg:w-95 lg:min-h-0 lg:border-t-0 lg:border-l">
      <div className="shrink-0 border-b border-border p-3">
        <div className="grid grid-cols-2 border border-border">
          <button
            type="button"
            onClick={() => setPreviewMode('text')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
              previewMode === 'text'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <Type className="size-3.5" />
            Text
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('shape')}
            className={cn(
              'flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors',
              previewMode === 'shape'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <Box className="size-3.5" />
            Shape
          </button>
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="space-y-6 p-5">
          {previewMode === 'text' ? (
            <>
              <TextMotionSection />
              <TextPropertiesSection />
              <CodeSection />
            </>
          ) : (
            <>
              <MotionSection />
              <StyleSection />
              <TimingSection />
              <CodeSection />
            </>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
