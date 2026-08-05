import type { CsvRow } from './parseCSV';

export function buildCSVContent(headers: string[], rows: CsvRow[]): string {
  return [headers.join(','), ...rows.map((row) => headers.map((header) => row[header] ?? '').join(','))].join('\n');
}

export function downloadCSV(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName.endsWith('.csv') ? fileName : `${fileName || 'export'}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
