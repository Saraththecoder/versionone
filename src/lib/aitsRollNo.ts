export interface ParsedAitsRollNo {
  valid: boolean;
  rollNo: string;
  batchYear?: string;
  entryType?: 'Regular' | 'Lateral';
  degree?: string;
  branch?: string;
  label?: string;
  reason?: string;
}

const DEGREE_MAP: Record<string, string> = {
  A: 'B.Tech',
  D: 'M.Tech',
  E: 'MBA',
  F: 'MCA',
};

const BRANCH_MAP: Record<string, string> = {
  '00': 'General',
  '01': 'Civil',
  '02': 'EEE',
  '03': 'Mech',
  '04': 'ECE',
  '05': 'CSE',
  '12': 'IT',
  '42': 'AI & ML',
  '43': 'AI',
  '44': 'Data Science',
  '46': 'Cyber Security',
};

const AITS_ROLL_FULL_REGEX = /^(\d{2})70([15])([A-Z])([A-Z0-9]{2})([A-Z0-9]{2})$/;
const AITS_ROLL_EMBEDDED_REGEX = /\d{2}70[15][A-Z][A-Z0-9]{4}/;

export function normalizeRollNo(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Extracts a valid AITS Roll No (e.g. 23701A0501) from raw barcode scanner text.
 */
export function extractRollNoFromBarcode(raw: string): string | null {
  const cleaned = normalizeRollNo(raw);
  if (AITS_ROLL_FULL_REGEX.test(cleaned)) {
    return cleaned;
  }
  const match = cleaned.match(AITS_ROLL_EMBEDDED_REGEX);
  return match ? match[0] : null;
}

/**
 * Validates and decodes an AITS Roll No (YY 70 [1|5] Degree Branch Serial).
 */
export function parseAitsRollNo(raw: string): ParsedAitsRollNo {
  const rollNo = normalizeRollNo(raw);

  if (!rollNo) {
    return { valid: false, rollNo, reason: 'Please enter or scan your AITS Roll No.' };
  }

  const match = rollNo.match(AITS_ROLL_FULL_REGEX);
  if (!match) {
    return {
      valid: false,
      rollNo,
      reason: 'Enter a valid AITS Roll No (e.g. 23701A0501 — must include college code 70).',
    };
  }

  const [, yr, entryDigit, degreeCode, branchCode] = match;
  const batchYear = `20${yr}`;
  const entryType = entryDigit === '5' ? 'Lateral' : 'Regular';
  const degree = DEGREE_MAP[degreeCode] || `Program ${degreeCode}`;
  const branch = BRANCH_MAP[branchCode] || branchCode;
  const label = `${batchYear} Batch • ${degree} ${branch}`;

  return {
    valid: true,
    rollNo,
    batchYear,
    entryType,
    degree,
    branch,
    label,
  };
}
