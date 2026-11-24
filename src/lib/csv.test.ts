import { describe, it, expect, vi } from 'vitest';
import { parseCSV, exportCSV } from './csv';
import { z } from 'zod';

describe('CSV Utilities', () => {
  const schema = z.object({
    id: z.string(),
    email: z.string().email(),
  });

  describe('parseCSV', () => {
    it('parses valid CSV correctly', () => {
      const csv = `id,email\n1,valid@test.com\n2,valid2@test.com`;
      const result = parseCSV(csv, schema);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({ id: '1', email: 'valid@test.com' });
      expect(result.errors).toHaveLength(0);
    });

    it('collects errors for invalid rows', () => {
      const csv = `id,email\n1,valid@test.com\n2,not_an_email`;
      const result = parseCSV(csv, schema);
      expect(result.data).toHaveLength(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].row).toBe(3);
    });

    it('handles empty strings gracefully', () => {
      const result = parseCSV('', schema);
      expect(result.data).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('exportCSV', () => {
    // Blob and URL are not fully available in jsdom exactly as browsers,
    // but we can mock or check if it throws. For this test, we can mock URL.createObjectURL.
    it('does not throw when exporting data', () => {
      global.URL.createObjectURL = vi.fn();

      const data = [{ id: '1', name: 'Alice' }];
      expect(() => exportCSV(data, 'test.csv')).not.toThrow();
    });
  });
});
