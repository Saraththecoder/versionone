import { NextRequest, NextResponse } from 'next/server';
import { assertNotLockedOut, clearFailedAttempts, recordFailedAttempt } from '@/lib/security';

let serverInviteCode =
  process.env.BUS_INVITE_CODE?.trim().toUpperCase() ||
  process.env.NEXT_PUBLIC_BUS_INVITE_CODE?.trim().toUpperCase() ||
  'AITS-2026';

function normalizeCode(code: string): string {
  return code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function generateNextCode(): string {
  const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let suffix = '';
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `AITS-${suffix}`;
}

export async function GET(req: NextRequest) {
  const adminRole = req.headers.get('x-aits-role');
  if (adminRole !== 'admin') {
    return NextResponse.json({ error: 'Admin authorization required.' }, { status: 403 });
  }
  return NextResponse.json({ code: serverInviteCode });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      action?: 'verify' | 'rotate';
      code?: string;
      customCode?: string;
    };

    if (body.action === 'verify') {
      const clientIp = req.headers.get('x-forwarded-for') || 'client';
      const lockoutKey = `invite:${clientIp}`;
      try {
        assertNotLockedOut(lockoutKey);
      } catch (err: unknown) {
        return NextResponse.json(
          { valid: false, error: err instanceof Error ? err.message : 'Too many attempts.' },
          { status: 429 }
        );
      }

      const submitted = normalizeCode(body.code || '');
      const valid = submitted.length >= 4 && submitted === normalizeCode(serverInviteCode);
      if (!valid) {
        recordFailedAttempt(lockoutKey);
        return NextResponse.json({ valid: false }, { status: 200 });
      }
      clearFailedAttempts(lockoutKey);
      return NextResponse.json({ valid: true }, { status: 200 });
    }

    if (body.action === 'rotate') {
      const adminRole = req.headers.get('x-aits-role');
      if (adminRole !== 'admin') {
        return NextResponse.json({ error: 'Admin authorization required.' }, { status: 403 });
      }

      if (body.customCode) {
        const cleaned = body.customCode.trim().toUpperCase();
        if (normalizeCode(cleaned).length < 4) {
          return NextResponse.json(
            { error: 'Invite code must have at least 4 characters.' },
            { status: 400 }
          );
        }
        serverInviteCode = cleaned;
      } else {
        serverInviteCode = generateNextCode();
      }
      return NextResponse.json({ code: serverInviteCode });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
