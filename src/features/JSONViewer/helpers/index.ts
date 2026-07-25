export function validateJson(jsonCode: string): string | null {
  if (!jsonCode.trim()) return 'JSON is empty.';
  try {
    JSON.parse(jsonCode);
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : 'Invalid JSON syntax.';
  }
}

export function parseJson(jsonCode: string): unknown | null {
  try {
    return JSON.parse(jsonCode);
  } catch {
    return null;
  }
}

export function prettifyJson(jsonCode: string): string {
  const trimmed = jsonCode.trim();
  if (!trimmed) return trimmed;
  try {
    return `${JSON.stringify(JSON.parse(trimmed), null, 2)}\n`;
  } catch {
    return jsonCode;
  }
}

export function minifyJson(jsonCode: string): string {
  const trimmed = jsonCode.trim();
  if (!trimmed) return trimmed;
  try {
    return JSON.stringify(JSON.parse(trimmed));
  } catch {
    return jsonCode;
  }
}

export function filterJson(obj: unknown, term: string): unknown {
  if (!term) return obj;

  const termLower = term.toLowerCase();

  if (Array.isArray(obj)) {
    const filtered = obj
      .map((item) => filterJson(item, term))
      .filter((item) => {
        if (item === null || item === undefined) return false;
        if (typeof item === 'object') {
          return Array.isArray(item) ? item.length > 0 : Object.keys(item as object).length > 0;
        }
        return String(item).toLowerCase().includes(termLower);
      });
    return filtered;
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const keyMatch = key.toLowerCase().includes(termLower);

      if (typeof value === 'object' && value !== null) {
        const filtered = filterJson(value, term);
        const hasContent = Array.isArray(filtered)
          ? filtered.length > 0
          : filtered !== null && typeof filtered === 'object' && Object.keys(filtered).length > 0;
        if (keyMatch || hasContent) {
          result[key] = keyMatch ? value : filtered;
        }
      } else if (keyMatch || String(value).toLowerCase().includes(termLower)) {
        result[key] = value;
      }
    }
    return result;
  }

  return String(obj).toLowerCase().includes(termLower) ? obj : null;
}

export function isEmptyJson(data: unknown): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
}

export function countKeys(data: unknown): number {
  if (data === null || typeof data !== 'object') return 0;
  return Object.keys(data).length;
}

export function downloadText(content: string, filename: string, mime = 'application/json') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function typeLabel(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `array[${value.length}]`;
  return typeof value;
}
