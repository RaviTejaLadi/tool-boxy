import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { TailwindShadeGeneratorHeader, ControlsSection, ShadesSection, ExportSection } from './components';
import { useShadeStore } from './stores';

export type { Shade } from './helpers';
export type { GenerationMode } from './constants';

export interface TailwindShadeGeneratorProps {
  className?: string;
}

export default function TailwindShadeGenerator({ className }: TailwindShadeGeneratorProps) {
  const [searchParams] = useSearchParams();
  const loadFromHex = useShadeStore((s) => s.loadFromHex);

  useEffect(() => {
    loadFromHex(searchParams.get('hex'));
  }, [searchParams, loadFromHex]);

  return (
    <div className={cn('flex h-full min-h-0 w-full flex-col bg-background text-foreground', className)}>
      <TailwindShadeGeneratorHeader />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-6 sm:px-8">
          <ControlsSection />
          <ShadesSection />
          <ExportSection />
        </div>
      </div>
    </div>
  );
}
