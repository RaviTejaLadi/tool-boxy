import { parseCSV, type CsvRow } from './parseCSV';

export async function ingestCsvFile(
  file: File | null | undefined
): Promise<{ headers: string[]; data: CsvRow[]; fileName: string } | { error: string }> {
  if (!file) return { error: 'No file selected' };

  if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
    return { error: 'Please upload a CSV file' };
  }

  try {
    const text = await file.text();
    const { headers, data } = parseCSV(text);
    return { headers, data, fileName: file.name };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to parse CSV file' };
  }
}
