import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnnotatorStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function PagesSection() {
  const sourceKind = useAnnotatorStore((s) => s.sourceKind);
  const pageNumber = useAnnotatorStore((s) => s.pageNumber);
  const numPages = useAnnotatorStore((s) => s.numPages);
  const isLoading = useAnnotatorStore((s) => s.isLoading);
  const setPage = useAnnotatorStore((s) => s.setPage);

  if (sourceKind !== 'pdf' || numPages <= 1) return null;

  return (
    <section className="space-y-2">
      <SectionHeading>Pages</SectionHeading>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          disabled={isLoading || pageNumber <= 1}
          onClick={() => void setPage(pageNumber - 1)}
          title="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <div className="flex flex-1 items-center gap-1.5">
          <Input
            type="number"
            min={1}
            max={numPages}
            value={pageNumber}
            disabled={isLoading}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) void setPage(next);
            }}
            className="h-8 text-center font-mono text-xs"
          />
          <span className="shrink-0 font-mono text-xs text-muted-foreground">/ {numPages}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          disabled={isLoading || pageNumber >= numPages}
          onClick={() => void setPage(pageNumber + 1)}
          title="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">Annotations are saved per page.</p>
    </section>
  );
}
