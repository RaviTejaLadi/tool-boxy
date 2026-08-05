import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { ROWS_PER_PAGE_OPTIONS } from '../constants';
import { useCsvStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function PaginationSection({ totalPages, totalRows }: { totalPages: number; totalRows: number }) {
  const data = useCsvStore((s) => s.data);
  const currentPage = useCsvStore((s) => s.currentPage);
  const rowsPerPage = useCsvStore((s) => s.rowsPerPage);
  const setCurrentPage = useCsvStore((s) => s.setCurrentPage);
  const setRowsPerPage = useCsvStore((s) => s.setRowsPerPage);

  const disabled = data.length === 0;

  return (
    <section>
      <SectionHeading className="mb-3">Pagination</SectionHeading>
      <FieldGroup className="gap-2.5">
        <Field>
          <FieldLabel className="font-mono text-[11px] text-muted-foreground">Rows per page</FieldLabel>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(value) => value && setRowsPerPage(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger className="w-full rounded-none font-mono text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            {disabled
              ? 'No rows'
              : `Page ${Math.min(currentPage, Math.max(totalPages, 1))} of ${Math.max(totalPages, 1)} · ${totalRows}`}
          </p>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 rounded-none"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={disabled || currentPage <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-8 rounded-none"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={disabled || currentPage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </FieldGroup>
    </section>
  );
}
