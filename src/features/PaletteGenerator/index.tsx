import { cn } from '@/lib/utils';
import { PaletteGeneratorHeader, PaletteStrip, GenerateBar, ExportSection, ColoursList } from './components';

export type { PaletteColor } from './helpers';

export interface PaletteGeneratorProps {
  className?: string;
}

export default function PaletteGenerator({ className }: PaletteGeneratorProps) {
  return (
    <div className={cn('flex h-full min-h-0 w-full flex-col bg-background text-foreground', className)}>
      <PaletteGeneratorHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:px-8">
          <PaletteStrip />
          <GenerateBar />
          <ExportSection />
          <ColoursList />
        </div>
      </div>
    </div>
  );
}
