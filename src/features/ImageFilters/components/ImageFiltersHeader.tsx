import { Filter, ImageDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { composeFilterCss, getFilterById } from '../constants';
import { downloadFiltered } from '../helpers';
import { useFilterStore } from '../stores';

export function ImageFiltersHeader() {
  const source = useFilterStore((s) => s.source);
  const selectedFilterId = useFilterStore((s) => s.selectedFilterId);
  const intensity = useFilterStore((s) => s.intensity);
  const settings = useFilterStore((s) => s.settings);
  const exportFormat = useFilterStore((s) => s.exportFormat);
  const isExporting = useFilterStore((s) => s.isExporting);
  const clearAll = useFilterStore((s) => s.clearAll);
  const setExporting = useFilterStore((s) => s.setExporting);

  const handleDownload = async () => {
    if (!source) return;
    setExporting(true);
    try {
      const filter = getFilterById(selectedFilterId);
      const css = composeFilterCss(filter.css, settings);
      await downloadFiltered(source, css, intensity, filter.id, exportFormat, settings.opacity);
    } finally {
      setExporting(false);
    }
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <Filter className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">Image Filters</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Apply Instagram-style photo filters
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {source && (
          <Button size="sm" onClick={() => void handleDownload()} disabled={isExporting}>
            <ImageDown data-icon="inline-start" />
            Download {exportFormat.toUpperCase()}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={clearAll} disabled={!source || isExporting}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
      </div>
    </header>
  );
}
