import { z, ZodError } from 'zod';

export interface CSVParseResult<T> {
  data: T[];
  errors: { row: number; error: string }[];
}

export function parseCSV<T>(csvString: string, schema: z.ZodSchema<T>): CSVParseResult<T> {
  const lines = csvString.split(/\r?\n/).filter((line) => line.trim() !== '');
  if (lines.length < 2) return { data: [], errors: [] }; // Empty or just headers

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const data: T[] = [];
  const errors: { row: number; error: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rowRaw = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const obj: Record<string, string> = {};

    headers.forEach((header, index) => {
      // Basic type inference from string (e.g., number if numeric) can be done if needed,
      // but assuming schema handles string coercion or strings are fine for this MVP.
      obj[header] = rowRaw[index] || '';
    });

    try {
      const parsed = schema.parse(obj);
      data.push(parsed);
    } catch (e: unknown) {
      const msg =
        e instanceof ZodError
          ? e.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
          : 'Invalid data';
      errors.push({
        row: i + 1,
        error: msg || 'Invalid data',
      });
    }
  }

  return { data, errors };
}

export function exportCSV<T extends object>(data: T[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]) as (keyof T)[];
  const csvRows = [];

  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map((header) => {
      const raw = row[header];
      const val = raw !== undefined && raw !== null ? raw : '';
      const escaped = String(val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
