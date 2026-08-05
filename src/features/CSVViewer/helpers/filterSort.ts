import type { SortConfig } from '../stores';
import type { CsvRow } from './parseCSV';

export function filterRows(
  data: CsvRow[],
  searchTerm: string,
  searchColumn: string,
  filters: Record<string, string>
): CsvRow[] {
  let result = [...data];

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter((row) => {
      if (searchColumn === 'all') {
        return Object.values(row).some((value) => String(value).toLowerCase().includes(term));
      }
      return String(row[searchColumn] ?? '')
        .toLowerCase()
        .includes(term);
    });
  }

  Object.entries(filters).forEach(([column, filterValue]) => {
    if (!filterValue) return;
    const term = filterValue.toLowerCase();
    result = result.filter((row) =>
      String(row[column] ?? '')
        .toLowerCase()
        .includes(term)
    );
  });

  return result;
}

export function sortRows(data: CsvRow[], sortConfig: SortConfig): CsvRow[] {
  if (!sortConfig.key || !sortConfig.direction) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';

    const aNum = Number(aValue);
    const bNum = Number(bValue);

    if (!Number.isNaN(aNum) && !Number.isNaN(bNum) && aValue !== '' && bValue !== '') {
      return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}
