import { Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildCSVContent, downloadCSV, filterRows, sortRows } from '../helpers';
import { useCsvStore } from '../stores';

export function CSVViewerHeader() {
  const data = useCsvStore((s) => s.data);
  const headers = useCsvStore((s) => s.headers);
  const fileName = useCsvStore((s) => s.fileName);
  const searchTerm = useCsvStore((s) => s.searchTerm);
  const searchColumn = useCsvStore((s) => s.searchColumn);
  const filters = useCsvStore((s) => s.filters);
  const sortConfig = useCsvStore((s) => s.sortConfig);
  const clearAll = useCsvStore((s) => s.clearAll);

  const hasData = data.length > 0;

  const exportToCSV = () => {
    if (!hasData) return;
    const filtered = filterRows(data, searchTerm, searchColumn, filters);
    const sorted = sortRows(filtered, sortConfig);
    const content = buildCSVContent(headers, sorted);
    downloadCSV(content, fileName || 'export.csv');
  };

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center bg-primary text-primary-foreground">
          <FileSpreadsheet className="size-4" />
        </div>
        <div>
          <div className="font-heading text-sm leading-none font-semibold">CSV Viewer</div>
          <div className="mt-1 font-mono text-[11px] leading-none text-muted-foreground">
            Upload, search, sort, and export CSV data
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={exportToCSV} disabled={!hasData}>
          <Download data-icon="inline-start" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={clearAll} disabled={!hasData}>
          <Trash2 data-icon="inline-start" />
          Clear
        </Button>
      </div>
    </header>
  );
}
