export type CsvRow = Record<string, string>;

export function parseCSV(text: string): { headers: string[]; data: CsvRow[] } {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0 || !lines[0]?.trim()) {
    throw new Error('CSV file is empty');
  }

  const headers = lines[0].split(',').map((header) => header.trim());
  if (headers.length === 0 || headers.every((h) => !h)) {
    throw new Error('Failed to parse CSV headers');
  }

  const data: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line?.trim()) continue;

    const values = line.split(',').map((value) => value.trim());
    if (values.length !== headers.length) continue;

    const row: CsvRow = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ?? '';
    });
    data.push(row);
  }

  return { headers, data };
}
