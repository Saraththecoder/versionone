import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registerStudentAccount,
  loginStudentWithRollNo,
  updateStudentAssignedBus,
  normalizeRollNo,
} from './studentAuth';
import { extractRollNoFromBarcode, parseAitsRollNo } from './aitsRollNo';
import { getActiveBusInviteCode, rotateBusInviteCode, verifyBusInviteCode } from './inviteCode';

describe('aitsRollNo & inviteCode helpers', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, val: string) => {
        store[key] = String(val);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    });
  });

  it('parses AITS Roll No format and extracts from raw barcode text', () => {
    const parsed = parseAitsRollNo('23701a0501');
    expect(parsed.valid).toBe(true);
    expect(parsed.rollNo).toBe('23701A0501');
    expect(parsed.batchYear).toBe('2023');
    expect(parsed.degree).toBe('B.Tech');
    expect(parsed.branch).toBe('CSE');
    expect(parsed.label).toBe('2023 Batch • B.Tech CSE');

    expect(extractRollNoFromBarcode('ID:23701a0501\n')).toBe('23701A0501');
    expect(extractRollNoFromBarcode('RANDOM123')).toBeNull();
    expect(parseAitsRollNo('99999X0000').valid).toBe(false);
  });

  it('verifies and rotates the bus invite code', async () => {
    const initial = await getActiveBusInviteCode();
    expect(initial).toBe('AITS-2026');
    expect(await verifyBusInviteCode('aits2026')).toBe(true);
    expect(await verifyBusInviteCode('WRONG999')).toBe(false);

    const rotated = await rotateBusInviteCode('BUS-7788');
    expect(rotated).toBe('BUS-7788');
    expect(await verifyBusInviteCode('bus7788')).toBe(true);
    expect(await verifyBusInviteCode('AITS-2026')).toBe(false);
  });
});

describe('studentAuth (Roll No signup & login with Invite Code)', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, val: string) => {
        store[key] = String(val);
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
    });
  });

  it('normalizes roll numbers consistently', () => {
    expect(normalizeRollNo(' 23701a0501 ')).toBe('23701A0501');
  });

  it('registers a student account with valid AITS Roll No & invite code and logs in', async () => {
    const created = await registerStudentAccount({
      rollNo: '23701a0501',
      email: '23701a0501@aitsrajampet.ac.in',
      password: 'secret123',
      confirmPassword: 'secret123',
      inviteCode: 'aits-2026',
      verifiedViaIdScan: true,
    });

    expect(created.rollNo).toBe('23701A0501');
    expect(created.email).toBe('23701a0501@aitsrajampet.ac.in');
    expect(created.branchLabel).toBe('2023 Batch • B.Tech CSE');
    expect(created.verifiedViaIdScan).toBe(true);
    expect(created.role).toBe('student');

    const loggedIn = await loginStudentWithRollNo({
      rollNo: '23701A0501',
      password: 'secret123',
    });
    expect(loggedIn.uid).toBe(created.uid);
    expect(loggedIn.rollNo).toBe('23701A0501');

    const updated = await updateStudentAssignedBus(loggedIn, 'AP 04 TX 4589');
    expect(updated.assignedBusId).toBe('AP 04 TX 4589');

    const reLoggedIn = await loginStudentWithRollNo({
      rollNo: '23701a0501',
      password: 'secret123',
    });
    expect(reLoggedIn.assignedBusId).toBe('AP 04 TX 4589');
  });

  it('rejects invalid AITS roll numbers, wrong invite codes, duplicate roll numbers, and wrong passwords', async () => {
    await expect(
      registerStudentAccount({
        rollNo: 'OUTSIDER123',
        email: 'outsider@gmail.com',
        password: 'password1',
        confirmPassword: 'password1',
        inviteCode: 'AITS-2026',
      })
    ).rejects.toThrow('valid AITS Roll No');

    await expect(
      registerStudentAccount({
        rollNo: '23701A0502',
        email: 's2@aits.ac.in',
        password: 'password1',
        confirmPassword: 'password1',
        inviteCode: 'BADCODE',
      })
    ).rejects.toThrow('Invalid Bus Invite Code');

    await expect(
      registerStudentAccount({
        rollNo: '23701A0502',
        email: 's2@aits.ac.in',
        password: 'password1',
        confirmPassword: 'password2',
        inviteCode: 'AITS-2026',
      })
    ).rejects.toThrow('Passwords do not match');

    await registerStudentAccount({
      rollNo: '23701A0502',
      email: 's2@aits.ac.in',
      password: 'password1',
      confirmPassword: 'password1',
      inviteCode: 'AITS-2026',
    });

    await expect(
      registerStudentAccount({
        rollNo: '23701A0502',
        email: 's2@aits.ac.in',
        password: 'password1',
        confirmPassword: 'password1',
        inviteCode: 'AITS-2026',
      })
    ).rejects.toThrow('already exists');

    await expect(
      loginStudentWithRollNo({
        rollNo: '23701A0502',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Incorrect password');

    await expect(
      loginStudentWithRollNo({
        rollNo: 'UNKNOWN999',
        password: 'password1',
      })
    ).rejects.toThrow('No account found');
  });
});
