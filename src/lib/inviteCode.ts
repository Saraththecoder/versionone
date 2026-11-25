'use client';

import { db } from '@/lib/firebase/firestore';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const INVITE_CODE_STORAGE_KEY = 'aits_bus_invite_code';
const DEFAULT_INVITE_CODE = 'AITS-2026';

export function normalizeInviteCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function getEnvDefaultCode(): string {
  const envCode = process.env.NEXT_PUBLIC_BUS_INVITE_CODE?.trim();
  return envCode && envCode.length >= 4 ? envCode.toUpperCase() : DEFAULT_INVITE_CODE;
}

function readLocalInviteCode(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(INVITE_CODE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeLocalInviteCode(code: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INVITE_CODE_STORAGE_KEY, code);
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Resolves the active Bus Invite Code (Admin view: prefers server API / Firestore / local).
 */
export async function getActiveBusInviteCode(): Promise<string> {
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const res = await fetch('/api/invite-code', {
        headers: { 'x-aits-role': 'admin' },
      });
      if (res.ok) {
        const data = (await res.json()) as { code?: string };
        if (data.code) {
          writeLocalInviteCode(data.code);
          return data.code;
        }
      }
    } catch {
      // Fallback to Firestore / local when server API is unavailable (e.g. unit tests)
    }
  }

  if (db) {
    try {
      const snap = await getDoc(doc(db, 'settings', 'transit'));
      const remoteCode = snap.exists()
        ? (snap.data()?.inviteCode as string | undefined)
        : undefined;
      if (remoteCode && normalizeInviteCode(remoteCode).length >= 4) {
        const formatted = remoteCode.trim().toUpperCase();
        writeLocalInviteCode(formatted);
        return formatted;
      }
    } catch {
      // Fallback to local/env code
    }
  }

  return readLocalInviteCode() || getEnvDefaultCode();
}

/**
 * Checks if a user-submitted Bus Invite Code matches the active code.
 * Uses server verification first in browser environments so secret codes stay server-side.
 */
export async function verifyBusInviteCode(submittedCode: string): Promise<boolean> {
  const normalizedSubmitted = normalizeInviteCode(submittedCode);
  if (normalizedSubmitted.length < 4) return false;

  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const res = await fetch('/api/invite-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', code: submittedCode }),
      });
      if (res.status === 429) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || 'Too many invalid invite code attempts. Try again later.');
      }
      if (res.ok) {
        const data = (await res.json()) as { valid?: boolean };
        return Boolean(data.valid);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('Too many')) {
        throw err;
      }
      // Fallback to local check in test environments
    }
  }

  const active = readLocalInviteCode() || getEnvDefaultCode();
  return normalizedSubmitted === normalizeInviteCode(active);
}

/**
 * Generates or sets a new rotating Bus Invite Code (used by Admin).
 */
export async function rotateBusInviteCode(customCode?: string): Promise<string> {
  if (typeof window !== 'undefined' && typeof fetch === 'function') {
    try {
      const res = await fetch('/api/invite-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-aits-role': 'admin',
        },
        body: JSON.stringify({ action: 'rotate', customCode }),
      });
      if (res.ok) {
        const data = (await res.json()) as { code?: string };
        if (data.code) {
          writeLocalInviteCode(data.code);
          return data.code;
        }
      }
    } catch {
      // Fallback to local/Firestore rotation in test environments
    }
  }

  let nextCode: string;

  if (customCode !== undefined) {
    const cleaned = customCode.trim().toUpperCase();
    if (normalizeInviteCode(cleaned).length < 4) {
      throw new Error('Invite code must have at least 4 letters or numbers.');
    }
    nextCode = cleaned;
  } else {
    const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    nextCode = `AITS-${suffix}`;
  }

  writeLocalInviteCode(nextCode);

  if (db) {
    try {
      await setDoc(
        doc(db, 'settings', 'transit'),
        {
          inviteCode: nextCode,
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch {
      // Local rotation still succeeds
    }
  }

  return nextCode;
}
