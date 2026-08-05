import { useCallback, useMemo, useRef, type DragEvent } from 'react';
import { createColumnHelper, flexRender, tableFeatures, useTable, type ColumnDef } from '@tanstack/react-table';
import { AlertCircle, Filter, SortAsc, SortDesc, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ACCEPT_CSV } from '../constants';
import { ingestCsvFile, type CsvRow } from '../helpers';
import { useCsvStore } from '../stores';

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, CsvRow>();

export function PreviewPane({ headers, rows, hasData }: { headers: string[]; rows: CsvRow[]; hasData: boolean }) {
  const error = useCsvStore((s) => s.error);
  const isDragging = useCsvStore((s) => s.isDragging);
  const sortConfig = useCsvStore((s) => s.sortConfig);
  const filters = useCsvStore((s) => s.filters);
  const setParsed = useCsvStore((s) => s.setParsed);
  const setError = useCsvStore((s) => s.setError);
  const setDragging = useCsvStore((s) => s.setDragging);
  const toggleSort = useCsvStore((s) => s.toggleSort);
  const setFilter = useCsvStore((s) => s.setFilter);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      const file = files?.[0];
      const result = await ingestCsvFile(file);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setParsed(result);
    },
    [setError, setParsed]
  );

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  const columns = useMemo(
    () =>
      headers.map((header) =>
        columnHelper.accessor((row) => row[header] ?? '', {
          id: header,
          header: () => (
            <div className="space-y-2 py-1">
              <button
                type="button"
                onClick={() => toggleSort(header)}
                className="flex items-center gap-0.5 font-mono text-[11px] tracking-wide text-foreground transition-colors hover:text-primary"
              >
                {header}
                {sortConfig.key === header ? (
                  sortConfig.direction === 'asc' ? (
                    <SortAsc className="ml-1 inline size-3.5" />
                  ) : (
                    <SortDesc className="ml-1 inline size-3.5" />
                  )
                ) : null}
              </button>
              <div className="relative">
                <Filter className="absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter..."
                  value={filters[header] || ''}
                  onChange={(e) => setFilter(header, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 rounded-none pl-7 font-mono text-[11px]"
                />
              </div>
            </div>
          ),
          cell: (info) => <span className="font-mono text-[13px]">{String(info.getValue())}</span>,
        })
      ) as ColumnDef<typeof features, CsvRow>[],
    [headers, filters, sortConfig, toggleSort, setFilter]
  );

  const table = useTable({
    features,
    data: rows,
    columns,
    getRowId: (_row, index) => String(index),
  });

  const headerGroups = table.getHeaderGroups();
  const tableRows = table.getRowModel().rows;

  return (
    <section
      className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/40"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept={ACCEPT_CSV}
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {error && (
        <div className="shrink-0 border-b border-destructive/40 bg-destructive/10 px-4 py-2">
          <div className="flex items-center gap-2 font-mono text-[11px] text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            {error}
          </div>
        </div>
      )}

      {!hasData ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`m-auto flex w-full max-w-md flex-col items-center gap-3 border border-dashed px-6 py-16 text-center transition-colors ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-background/60 hover:border-primary/50 hover:bg-background/80'
          }`}
        >
          <div className="flex size-12 items-center justify-center bg-primary text-primary-foreground">
            <Upload className="size-5" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">Drop a CSV file here</p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">or click to select a file</p>
          </div>
        </button>
      ) : (
        <ScrollArea className="h-full w-full">
          <div className="min-w-full p-4 lg:p-5">
            <Table>
              <TableHeader>
                {headerGroups.map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {tableRows.length > 0 ? (
                  tableRows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getAllCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={Math.max(columns.length, 1)}
                      className="py-12 text-center font-mono text-[11px] text-muted-foreground"
                    >
                      No matching rows
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      )}

      {isDragging && hasData && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
          <div className="border border-primary bg-background px-6 py-4 font-mono text-[11px] text-primary">
            Drop CSV to replace
          </div>
        </div>
      )}
    </section>
  );
}
