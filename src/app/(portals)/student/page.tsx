'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRealtimeLocation } from '@/hooks/useRealtimeLocation';
import { useBusRoute } from '@/hooks/useBusRoute';
import {
  registerStudentAccount,
  loginStudentWithRollNo,
  updateStudentAssignedBus,
  normalizeRollNo,
} from '@/lib/studentAuth';
import { parseAitsRollNo } from '@/lib/aitsRollNo';
import { StudentDocument } from '@/lib/schemas';
import dynamic from 'next/dynamic';
import {
  ChevronLeft,
  Hash,
  Mail,
  Bus,
  Phone,
  LayoutDashboard,
  Sparkles,
  AlertCircle,
  ScanBarcode,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { PasswordInputRow } from '@/components/ui/PasswordInputRow';
import { IdBarcodeScannerModal } from '@/components/student/IdBarcodeScannerModal';
import { triggerFeedback } from '@/lib/feedback';
import { isDemoModeEnabled } from '@/lib/security';

const Map = dynamic(() => import('@/components/map/Map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-[#F2F2F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-7 h-7 border-2 border-[#007AFF] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="font-heading font-medium text-[13px] text-[#8E8E93]">Loading Map...</p>
    </div>
  ),
});

interface BusOption {
  num: number;
  id: string;
  plate: string;
  route: string;
  stops: string;
}

const BUS_OPTIONS: BusOption[] = [
  {
    num: 1,
    id: 'bus-1',
    plate: 'AP 04 TX 1022',
    route: 'Route 01: Kadapa Central → AITS',
    stops: 'Kadapa Stand • Seven Roads • RIMS',
  },
  {
    num: 2,
    id: 'bus-2',
    plate: 'AP 04 TX 4589',
    route: 'Route 02: Tirupati Bypass → AITS',
    stops: 'Tirupati RTC • Renigunta • Kodur',
  },
  {
    num: 3,
    id: 'bus-3',
    plate: 'AP 04 TX 8812',
    route: 'Route 03: Rayachoty Town → AITS',
    stops: 'Rayachoty Stand • Masapet • Sanipaya',
  },
  {
    num: 4,
    id: 'bus-4',
    plate: 'AP 04 TX 9044',
    route: 'Route 04: Badvel Route → AITS',
    stops: 'Badvel Clock Tower • Gopavaram',
  },
  {
    num: 5,
    id: 'bus-5',
    plate: 'AP 04 TX 3311',
    route: 'Route 05: Rajampet Local → AITS',
    stops: 'Rajampet Station • College Cross',
  },
  {
    num: 6,
    id: 'bus-6',
    plate: 'AP 04 TX 7744',
    route: 'Route 06: Nandalur Shuttle → AITS',
    stops: 'Nandalur Market • Gundlur Cross',
  },
];

type FlowStep = 'home' | 'signup' | 'login' | 'choose_bus' | 'map';

export default function StudentPage() {
  const router = useRouter();
  const { loginWithDemo, setActiveSession } = useAuth();
  const { user } = useCurrentUser();
  const demoEnabled = isDemoModeEnabled();

  const [step, setStep] = useState<FlowStep>('home');
  const [rollNo, setRollNo] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [scannedRollNo, setScannedRollNo] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusOption>(BUS_OPTIONS[1]);
  const [loadingAction, setLoadingAction] = useState(false);

  const mailInputRef = useRef<HTMLInputElement | null>(null);
  const loginPasswordRef = useRef<HTMLInputElement | null>(null);

  const { location } = useRealtimeLocation(selectedBus.plate);
  const { route, stops } = useBusRoute(selectedBus.plate);

  const parsedRoll = parseAitsRollNo(rollNo);
  const isScannedMatch =
    Boolean(scannedRollNo) && normalizeRollNo(rollNo) === scannedRollNo && parsedRoll.valid;

  const switchStep = (next: FlowStep) => {
    setAuthError(null);
    setStep(next);
  };

  const handleBarcodeDetected = (detectedRoll: string) => {
    setRollNo(detectedRoll);
    setScannedRollNo(detectedRoll);
    setAuthError(null);
    setScannerOpen(false);
    const info = parseAitsRollNo(detectedRoll);
    toast.success(
      info.label ? `ID Scanned: ${detectedRoll} (${info.label})` : `ID Scanned: ${detectedRoll}`
    );
    setTimeout(() => {
      if (step === 'signup' && !mail) {
        mailInputRef.current?.focus();
      } else if (step === 'login') {
        loginPasswordRef.current?.focus();
      }
    }, 100);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingAction(true);
    try {
      const studentDoc = await registerStudentAccount({
        rollNo,
        email: mail,
        password,
        confirmPassword,
        inviteCode,
        verifiedViaIdScan: isScannedMatch,
      });
      setActiveSession(studentDoc);
      triggerFeedback('success');
      toast.success(`Account created for ${studentDoc.rollNo}`);
      setPassword('');
      setConfirmPassword('');
      setInviteCode('');
      switchStep('choose_bus');
    } catch (err: unknown) {
      triggerFeedback('error');
      setAuthError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoadingAction(true);
    try {
      const studentDoc = await loginStudentWithRollNo({ rollNo, password });
      setActiveSession(studentDoc);
      triggerFeedback('success');
      toast.success(`Welcome back, ${studentDoc.rollNo}`);
      setPassword('');
      if (studentDoc.assignedBusId) {
        const matched = BUS_OPTIONS.find((b) => b.plate === studentDoc.assignedBusId);
        if (matched) setSelectedBus(matched);
      }
      switchStep('choose_bus');
    } catch (err: unknown) {
      triggerFeedback('error');
      setAuthError(err instanceof Error ? err.message : 'Invalid Roll No or password.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleQuickDemo = () => {
    if (!demoEnabled) return;
    loginWithDemo('student');
    triggerFeedback('success');
    toast.success('Demo Mode Active');
    switchStep('choose_bus');
  };

  const handleBusSelect = async (bus: BusOption) => {
    triggerFeedback('select');
    setSelectedBus(bus);
    if (user && user.role === 'student') {
      const updated = await updateStudentAssignedBus(user as StudentDocument, bus.plate);
      setActiveSession(updated);
    }
    toast.info(`Tracking Bus ${bus.num} (${bus.plate})`);
    switchStep('map');
  };

  const stepTitles: Record<FlowStep, string> = {
    home: 'Student',
    signup: 'Student Signup',
    login: 'Student Login',
    choose_bus: 'Choose Bus No',
    map: 'Map Overview',
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] text-[#1C1C1E] flex flex-col justify-between font-sans">
      {/* Apple Frosted Navigation Bar */}
      <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06]">
        <div className="max-w-md mx-auto px-3 h-12 flex items-center justify-between">
          {step === 'home' ? (
            <Link
              href="/"
              onClick={() => triggerFeedback('tap')}
              className="flex items-center gap-0.5 text-[15px] font-medium text-[#007AFF] hover:opacity-75 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              <span>Home</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                triggerFeedback('tap');
                switchStep(step === 'map' ? 'choose_bus' : 'home');
              }}
              className="flex items-center gap-0.5 text-[15px] font-medium text-[#007AFF] hover:opacity-75 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              <span>{step === 'map' ? 'Buses' : 'Back'}</span>
            </button>
          )}

          <span className="font-heading font-semibold text-[15px] tracking-[-0.01em] text-[#1C1C1E]">
            {stepTitles[step]}
          </span>

          <div className="flex items-center gap-2 justify-end min-w-[56px]">
            {step === 'map' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#248A3D] bg-[#34C759]/12 px-2 py-0.5 rounded-full tabular-nums">
                {location?.active ? `${Math.round((location.speed || 0) * 3.6)} km/h` : 'Rest'}
              </span>
            )}
            <SoundToggle />
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px]">
          {/* ========================================================== */}
          {/* SCREEN 1: STUDENT HOME                                     */}
          {/* ========================================================== */}
          {step === 'home' && (
            <div className="space-y-5">
              <div className="apple-card rounded-[28px] p-6 text-center space-y-4">
                <div className="w-36 h-24 mx-auto flex items-center justify-center">
                  <img
                    src="/images/splash-bus.png"
                    alt="Student School Bus"
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="font-heading text-[26px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                    Student Transit
                  </h1>
                  <p className="text-[13px] text-[#8E8E93] leading-snug max-w-[260px] mx-auto">
                    Create an account or log in with your Roll No to track your bus live.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    triggerFeedback('tap');
                    switchStep('signup');
                  }}
                  className="w-full h-12 bg-white hover:bg-white/90 text-[#007AFF] font-heading font-semibold text-[16px] rounded-[14px] apple-card motion-press cursor-pointer"
                >
                  Student Signup
                </button>

                <button
                  onClick={() => {
                    triggerFeedback('tap');
                    switchStep('login');
                  }}
                  className="w-full h-12 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[16px] rounded-[14px] shadow-xs motion-press cursor-pointer"
                >
                  Student Login
                </button>

                {demoEnabled && (
                  <button
                    onClick={handleQuickDemo}
                    className="w-full py-2.5 text-[13px] font-medium text-[#007AFF] hover:opacity-75 flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Skip to Choose Bus (Demo)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SCREEN 2: STUDENT SIGNUP (Roll No, Mail, Password, Confirm)*/}
          {/* ========================================================== */}
          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#007AFF]/10 p-2 flex items-center justify-center">
                  <img
                    src="/images/icon-student.png"
                    alt="Student"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-heading text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                  Create Student Account
                </h1>
              </div>

              {authError && (
                <div className="bg-[#FF3B30]/12 text-[#D70015] px-3.5 py-2.5 rounded-[14px] text-[13px] font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{authError}</p>
                </div>
              )}

              {/* Scan College ID Card Trigger */}
              <button
                type="button"
                onClick={() => {
                  triggerFeedback('tap');
                  setScannerOpen(true);
                }}
                className="w-full apple-card rounded-[16px] px-4 py-3 flex items-center justify-between hover:bg-white/90 transition-colors motion-press cursor-pointer"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#007AFF]/12 text-[#007AFF] flex items-center justify-center shrink-0">
                    <ScanBarcode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-heading text-[14px] font-semibold text-[#1C1C1E]">
                      {isScannedMatch ? 'College ID Verified' : 'Scan College ID Barcode'}
                    </p>
                    <p className="text-[11px] text-[#8E8E93]">
                      {isScannedMatch
                        ? `${rollNo} • ${parsedRoll.label}`
                        : 'Auto-fill Roll No from your AITS ID card'}
                    </p>
                  </div>
                </div>
                {isScannedMatch ? (
                  <CheckCircle2 className="w-5 h-5 text-[#34C759] shrink-0" />
                ) : (
                  <span className="text-[12px] font-semibold text-[#007AFF] bg-[#007AFF]/10 px-2.5 py-1 rounded-full shrink-0">
                    Scan
                  </span>
                )}
              </button>

              {/* Apple Grouped Inset Form */}
              <div className="apple-card rounded-[16px] overflow-hidden divide-y divide-black/[0.06]">
                <div className="flex items-center px-4 h-12 gap-3">
                  <Hash className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                    placeholder="Roll No (e.g. 24AK1A33D8)"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none uppercase"
                  />
                  {parsedRoll.valid && (
                    <span className="text-[10px] font-semibold text-[#248A3D] bg-[#34C759]/12 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                      {parsedRoll.branch}
                    </span>
                  )}
                </div>

                <div className="flex items-center px-4 h-12 gap-3">
                  <Mail className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    ref={mailInputRef}
                    type="email"
                    required
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="Mail (college email)"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
                  />
                </div>

                <div className="flex items-center px-4 h-12 gap-3">
                  <KeyRound className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="Bus Invite Code (e.g. AITS-2026)"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none uppercase"
                  />
                </div>

                <PasswordInputRow
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)"
                />

                <PasswordInputRow
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                />
              </div>

              <p className="text-[11px] text-[#8E8E93] text-center px-2">
                Ask your bus driver or check the bus notice board for the current Bus Invite Code.
              </p>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="w-full h-12 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[16px] rounded-[14px] shadow-xs flex items-center justify-center motion-press cursor-pointer"
                >
                  {loadingAction ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerFeedback('tap');
                    switchStep('login');
                  }}
                  className="w-full text-[13px] font-medium text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer"
                >
                  Already have an account? <span className="text-[#007AFF]">Log In</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================== */}
          {/* SCREEN 3: STUDENT LOGIN (Roll No & Password)               */}
          {/* ========================================================== */}
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#007AFF]/10 p-2 flex items-center justify-center">
                  <img
                    src="/images/icon-student.png"
                    alt="Student"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-heading text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                  Student Login
                </h1>
              </div>

              {authError && (
                <div className="bg-[#FF3B30]/12 text-[#D70015] px-3.5 py-2.5 rounded-[14px] text-[13px] font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{authError}</p>
                </div>
              )}

              <div className="apple-card rounded-[16px] overflow-hidden divide-y divide-black/[0.06]">
                <div className="flex items-center px-4 h-12 gap-3">
                  <Hash className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                    placeholder="Roll No (e.g. 24AK1A33D8)"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      triggerFeedback('tap');
                      setScannerOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 transition-colors shrink-0 cursor-pointer"
                    title="Scan College ID Barcode"
                    aria-label="Scan College ID Barcode"
                  >
                    <ScanBarcode className="w-4 h-4" />
                  </button>
                </div>

                <PasswordInputRow
                  ref={loginPasswordRef}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="w-full h-12 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[16px] rounded-[14px] shadow-xs flex items-center justify-center motion-press cursor-pointer"
                >
                  {loadingAction ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Log In'
                  )}
                </button>

                {demoEnabled && (
                  <button
                    type="button"
                    onClick={handleQuickDemo}
                    className="w-full h-11 bg-white text-[#007AFF] font-heading font-semibold text-[14px] rounded-[14px] apple-card motion-press cursor-pointer"
                  >
                    Instant Demo Login
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    triggerFeedback('tap');
                    switchStep('signup');
                  }}
                  className="w-full text-[13px] font-medium text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer"
                >
                  New student? <span className="text-[#007AFF]">Create Account</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================== */}
          {/* SCREEN 4: CHOOSE BUS NO (1–6 Apple Control Tiles)          */}
          {/* ========================================================== */}
          {step === 'choose_bus' && (
            <div className="space-y-4">
              <div className="px-1">
                <p className="text-[12px] font-semibold text-[#007AFF]">
                  {(user as StudentDocument | null)?.rollNo || user?.name || 'Student'}
                </p>
                <h1 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                  Choose Bus No
                </h1>
                <p className="text-[13px] text-[#8E8E93]">Tap a bus to open live Apple Maps view</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {BUS_OPTIONS.map((bus) => (
                  <button
                    key={bus.num}
                    onClick={() => handleBusSelect(bus)}
                    className="apple-card rounded-[22px] p-4 flex flex-col items-center text-center motion-press hover:ring-2 hover:ring-[#007AFF]/40 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#F2F2F7] text-[#1C1C1E] font-display font-bold text-[22px] tabular-nums flex items-center justify-center mb-2.5 border border-black/[0.04]">
                      {bus.num}
                    </div>
                    <span className="font-heading text-[13px] font-semibold text-[#1C1C1E]">
                      {bus.plate}
                    </span>
                    <span className="text-[11px] text-[#8E8E93] truncate max-w-[130px] mt-0.5">
                      {bus.route.split(':')[1]?.trim() || bus.route}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#248A3D] bg-[#34C759]/12 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                      Live
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SCREEN 5: MAP OVERVIEW (Apple Maps Frosted Sheet Style)    */}
          {/* ========================================================== */}
          {step === 'map' && (
            <div className="apple-card rounded-[28px] overflow-hidden flex flex-col h-[540px] relative">
              <div className="flex-1 w-full h-full relative z-10">
                <Map liveLocation={location} route={route} stops={stops} />
              </div>

              {/* Frosted Bottom Sheet Card */}
              <div className="apple-glass border-t border-black/[0.08] p-4 z-20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#007AFF] text-white font-display font-bold text-[12px] tabular-nums flex items-center justify-center">
                        {selectedBus.num}
                      </span>
                      <span className="text-[12px] font-semibold text-[#007AFF]">
                        {selectedBus.plate}
                      </span>
                    </div>
                    <h3 className="font-heading text-[15px] font-semibold text-[#1C1C1E] pt-0.5">
                      {selectedBus.route}
                    </h3>
                    <p className="text-[12px] text-[#8E8E93]">{selectedBus.stops}</p>
                  </div>

                  <a
                    href="tel:+919848022334"
                    onClick={() => triggerFeedback('tap')}
                    className="w-10 h-10 rounded-full bg-[#34C759]/14 text-[#248A3D] flex items-center justify-center motion-press shrink-0"
                    title="Call Transport"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      triggerFeedback('tap');
                      switchStep('choose_bus');
                    }}
                    className="h-10 bg-[#E5E5EA]/70 hover:bg-[#E5E5EA] text-[#1C1C1E] font-heading font-semibold text-[13px] rounded-[12px] flex items-center justify-center gap-1.5 motion-press cursor-pointer"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Change Bus</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerFeedback('tap');
                      router.push('/student/dashboard');
                    }}
                    className="h-10 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[13px] rounded-[12px] flex items-center justify-center gap-1.5 motion-press cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center">
        <p className="text-[11px] text-[#8E8E93] font-medium">AITS Campus Transit • Student</p>
      </footer>

      <IdBarcodeScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onDetected={handleBarcodeDetected}
      />
    </div>
  );
}
