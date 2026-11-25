'use client';

import { StudentDocument } from '@/lib/schemas';
import { auth } from '@/lib/firebase/auth';
import { db } from '@/lib/firebase/firestore';
import { normalizeRollNo, parseAitsRollNo } from '@/lib/aitsRollNo';
import { verifyBusInviteCode } from '@/lib/inviteCode';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

export { normalizeRollNo };

const ACCOUNTS_STORAGE_KEY = 'aits_student_accounts';

interface StoredStudentRecord {
  uid: string;
  rollNo: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  assignedBusId?: string;
  batchYear?: string;
  branchLabel?: string;
  verifiedViaIdScan?: boolean;
}

async function hashPassword(rollNo: string, password: string): Promise<string> {
  const input = `aits:${rollNo}:${password}`;
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const buf = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback deterministic hash for environments without SubtleCrypto
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv_${(hash >>> 0).toString(16)}`;
}

function readLocalAccounts(): Record<string, StoredStudentRecord> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredStudentRecord>) : {};
  } catch {
    return {};
  }
}

function writeLocalAccounts(accounts: Record<string, StoredStudentRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota errors
  }
}

function toStudentDoc(record: StoredStudentRecord): StudentDocument {
  return {
    uid: record.uid,
    rollNo: record.rollNo,
    name: record.name,
    email: record.email,
    role: 'student',
    createdAt: record.createdAt,
    assignedBusId: record.assignedBusId,
    batchYear: record.batchYear,
    branchLabel: record.branchLabel,
    verifiedViaIdScan: record.verifiedViaIdScan,
  };
}

export async function registerStudentAccount(params: {
  rollNo: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteCode: string;
  verifiedViaIdScan?: boolean;
}): Promise<StudentDocument> {
  const parsed = parseAitsRollNo(params.rollNo);
  if (!parsed.valid) {
    throw new Error(parsed.reason || 'Please enter a valid AITS Roll No.');
  }

  const rollNo = parsed.rollNo;
  const email = params.email.trim().toLowerCase();
  const { password, confirmPassword, inviteCode, verifiedViaIdScan } = params;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid college email address.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  const inviteValid = await verifyBusInviteCode(inviteCode);
  if (!inviteValid) {
    throw new Error(
      'Invalid Bus Invite Code. Check your bus notice board or ask the transport coordinator.'
    );
  }

  const localAccounts = readLocalAccounts();
  if (localAccounts[rollNo]) {
    throw new Error(`An account with Roll No ${rollNo} already exists. Please log in.`);
  }

  // Check Firestore for existing rollNo if configured
  if (db) {
    try {
      const snap = await getDocs(query(collection(db, 'students'), where('rollNo', '==', rollNo)));
      if (!snap.empty) {
        throw new Error(`An account with Roll No ${rollNo} already exists. Please log in.`);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('already exists')) {
        throw err;
      }
      // Ignore network/permission errors so offline/local signup still works
    }
  }

  const passwordHash = await hashPassword(rollNo, password);
  let uid = `stu_${rollNo}_${Date.now().toString(36)}`;

  // Best-effort Firebase Auth email/password creation when configured
  if (auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      uid = cred.user.uid;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/email-already-in-use') {
        throw new Error('This email address is already registered. Please log in.');
      }
      // If email/password provider is disabled in Firebase Console, continue with local/Firestore record
    }
  }

  const record: StoredStudentRecord = {
    uid,
    rollNo,
    name: rollNo,
    email,
    passwordHash,
    createdAt: Date.now(),
    batchYear: parsed.batchYear,
    branchLabel: parsed.label,
    verifiedViaIdScan: Boolean(verifiedViaIdScan),
  };

  localAccounts[rollNo] = record;
  writeLocalAccounts(localAccounts);

  const studentDoc = toStudentDoc(record);

  if (db) {
    try {
      await setDoc(doc(db, 'students', uid), {
        ...studentDoc,
        passwordHash,
      });
    } catch {
      // Best-effort Firestore persistence
    }
  }

  return studentDoc;
}

export async function loginStudentWithRollNo(params: {
  rollNo: string;
  password: string;
}): Promise<StudentDocument> {
  const rollNo = normalizeRollNo(params.rollNo);
  const { password } = params;

  if (!rollNo) {
    throw new Error('Please enter or scan your Roll No.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  const localAccounts = readLocalAccounts();
  let record: StoredStudentRecord | undefined = localAccounts[rollNo];

  // If not found locally and Firestore is available, look up by rollNo
  if (!record && db) {
    try {
      const snap = await getDocs(query(collection(db, 'students'), where('rollNo', '==', rollNo)));
      if (!snap.empty) {
        const data = snap.docs[0].data() as StoredStudentRecord;
        record = data;
      }
    } catch {
      // Ignore Firestore lookup error
    }
  }

  if (!record) {
    throw new Error(`No account found for Roll No ${rollNo}. Please sign up first.`);
  }

  const expectedHash = await hashPassword(rollNo, password);
  let passwordValid = record.passwordHash === expectedHash;

  if (!passwordValid && auth && record.email) {
    try {
      await signInWithEmailAndPassword(auth, record.email, password);
      passwordValid = true;
    } catch {
      passwordValid = false;
    }
  }

  if (!passwordValid) {
    throw new Error(`Incorrect password for Roll No ${rollNo}.`);
  }

  // Cache in local accounts if fetched from Firestore
  if (!localAccounts[rollNo]) {
    localAccounts[rollNo] = { ...record, passwordHash: expectedHash };
    writeLocalAccounts(localAccounts);
  }

  return toStudentDoc(record);
}

export async function updateStudentAssignedBus(
  student: StudentDocument,
  busPlate: string
): Promise<StudentDocument> {
  const updated: StudentDocument = { ...student, assignedBusId: busPlate };
  const rollNo = student.rollNo ? normalizeRollNo(student.rollNo) : null;

  if (rollNo) {
    const accounts = readLocalAccounts();
    if (accounts[rollNo]) {
      accounts[rollNo].assignedBusId = busPlate;
      writeLocalAccounts(accounts);
    }
  }

  if (db && student.uid) {
    try {
      await updateDoc(doc(db, 'students', student.uid), { assignedBusId: busPlate });
    } catch {
      // Best-effort Firestore update
    }
  }

  return updated;
}
