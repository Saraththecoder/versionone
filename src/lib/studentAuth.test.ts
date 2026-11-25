import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registerStudentAccount,
  loginStudentWithRollNo,
  updateStudentAssignedBus,
  normalizeRollNo,
} from './studentAuth';

describe('studentAuth (Roll No signup & login)', () => {
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

  it('registers a student account and logs in with Roll No and password', async () => {
    const created = await registerStudentAccount({
      rollNo: '23701a0501',
      email: '23701a0501@aitsrajampet.ac.in',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    expect(created.rollNo).toBe('23701A0501');
    expect(created.email).toBe('23701a0501@aitsrajampet.ac.in');
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

  it('rejects mismatched passwords, duplicate roll numbers, and wrong login passwords', async () => {
    await expect(
      registerStudentAccount({
        rollNo: '23701A0502',
        email: 's2@aits.ac.in',
        password: 'password1',
        confirmPassword: 'password2',
      })
    ).rejects.toThrow('Passwords do not match');

    await registerStudentAccount({
      rollNo: '23701A0502',
      email: 's2@aits.ac.in',
      password: 'password1',
      confirmPassword: 'password1',
    });

    await expect(
      registerStudentAccount({
        rollNo: '23701A0502',
        email: 's2@aits.ac.in',
        password: 'password1',
        confirmPassword: 'password1',
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
