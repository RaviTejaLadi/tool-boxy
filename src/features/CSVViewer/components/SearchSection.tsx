import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useCsvStore } from '../stores';
import { SectionHeading } from './SectionHeading';

export function SearchSection() {
  const headers = useCsvStore((s) => s.headers);
  const searchTerm = useCsvStore((s) => s.searchTerm);
  const searchColumn = useCsvStore((s) => s.searchColumn);
  const filters = useCsvStore((s) => s.filters);
  const setSearchTerm = useCsvStore((s) => s.setSearchTerm);
  const setSearchColumn = useCsvStore((s) => s.setSearchColumn);
  const clearFilters = useCsvStore((s) => s.clearFilters);

  const hasActiveFilters = Boolean(searchTerm) || Object.values(filters).some(Boolean);

  return (
    <section>
      <SectionHeading className="mb-3">Search</SectionHeading>
      <FieldGroup className="gap-2.5">
        <Field>
          <FieldLabel className="font-mono text-[11px] text-muted-foreground">Query</FieldLabel>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={headers.length === 0}
              className="rounded-none pl-9 font-mono text-[13px]"
            />
          </div>
        </Field>

        <Field>
          <FieldLabel className="font-mono text-[11px] text-muted-foreground">Column</FieldLabel>
          <Select
            value={searchColumn}
            onValueChange={(value) => value && setSearchColumn(value)}
            disabled={headers.length === 0}
          >
            <SelectTrigger className="w-full rounded-none font-mono text-[13px]">
              <SelectValue placeholder="All columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All columns</SelectItem>
              {headers.map((header) => (
                <SelectItem key={header} value={header}>
                  {header}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" className="rounded-none" onClick={clearFilters}>
            <X data-icon="inline-start" />
            Clear filters
          </Button>
        )}
      </FieldGroup>
    </section>
  );
}
