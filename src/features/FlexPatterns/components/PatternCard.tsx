import { cn } from '@/lib/utils';
import type { FlexPattern } from '../constants/patterns';
import { PreviewThumbnail } from './PatternPreview';

export function PatternCard({
  pattern,
  active,
  onSelect,
}: {
  pattern: FlexPattern;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'group flex w-full flex-col overflow-hidden border bg-card text-left transition-all',
        active ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50 hover:shadow-sm'
      )}
    >
      <PreviewThumbnail pattern={pattern} />
      <div className="border-t border-border px-3 py-2">
        <p className="truncate text-sm font-semibold">{pattern.name}</p>
      </div>
    </button>
  );
}
