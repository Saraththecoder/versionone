import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import {
  assertNotLockedOut,
  clearFailedAttempts,
  isDemoModeEnabled,
  recordFailedAttempt,
} from '@/lib/security';

function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      role?: 'admin' | 'driver';
      email?: string;
      password?: string;
    };

    const role = body.role;
    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (role !== 'admin' && role !== 'driver') {
      return NextResponse.json({ error: 'Invalid staff role.' }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const lockoutKey = `staff:${role}:${email}`;
    try {
      assertNotLockedOut(lockoutKey);
    } catch (err: unknown) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Too many attempts.' },
        { status: 429 }
      );
    }

    if (role === 'admin') {
      const configuredEmail = (process.env.ADMIN_EMAIL || 'admin@aitsrajampet.ac.in')
        .trim()
        .toLowerCase();
      const configuredPassword = process.env.ADMIN_PASSWORD;

      if (!configuredPassword) {
        if (!isDemoModeEnabled()) {
          return NextResponse.json(
            {
              error:
                'Admin credentials are not configured on the server. Set ADMIN_PASSWORD or Firebase Auth.',
            },
            { status: 503 }
          );
        }
        // Development-only convenience when ADMIN_PASSWORD is not set locally
        if (safeEquals(email, configuredEmail) && password.length >= 6) {
          clearFailedAttempts(lockoutKey);
          return NextResponse.json({
            user: {
              uid: 'local-admin-1',
              email,
              name: 'Transport Admin',
              role: 'admin',
              createdAt: Date.now(),
            },
          });
        }
      } else if (safeEquals(email, configuredEmail) && safeEquals(password, configuredPassword)) {
        clearFailedAttempts(lockoutKey);
        return NextResponse.json({
          user: {
            uid: 'admin-verified-1',
            email,
            name: 'Dr. C. Mohan',
            role: 'admin',
            createdAt: Date.now(),
          },
        });
      }

      recordFailedAttempt(lockoutKey);
      return NextResponse.json({ error: 'Invalid admin email or password.' }, { status: 401 });
    }

    // Driver verification
    const driverPasscode = process.env.DRIVER_PASSCODE || process.env.DRIVER_PASSWORD;
    if (!driverPasscode) {
      if (!isDemoModeEnabled()) {
        return NextResponse.json(
          {
            error:
              'Driver login is not configured on the server. Set DRIVER_PASSCODE or Firebase Auth.',
          },
          { status: 503 }
        );
      }
      if (password.length >= 6) {
        clearFailedAttempts(lockoutKey);
        return NextResponse.json({
          user: {
            uid: `driver_${email.replace(/[^a-z0-9]/g, '_')}`,
            email,
            name: email.split('@')[0] || 'Bus Driver',
            role: 'driver',
            createdAt: Date.now(),
            currentBusId: 'AP 04 TX 4589',
          },
        });
      }
    } else if (safeEquals(password, driverPasscode)) {
      clearFailedAttempts(lockoutKey);
      return NextResponse.json({
        user: {
          uid: `driver_${email.replace(/[^a-z0-9]/g, '_')}`,
          email,
          name: email.split('@')[0] || 'Bus Driver',
          role: 'driver',
          createdAt: Date.now(),
          currentBusId: 'AP 04 TX 4589',
        },
      });
    }

    recordFailedAttempt(lockoutKey);
    return NextResponse.json({ error: 'Invalid driver credentials.' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
