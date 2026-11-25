'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDriverTracking } from '@/hooks/useDriverTracking';
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Play,
  Square,
  Clock,
  Wrench,
  WifiOff,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { PasswordInputRow } from '@/components/ui/PasswordInputRow';
import { triggerFeedback } from '@/lib/feedback';

interface BusOption {
  num: number;
  id: string;
  plate: string;
  route: string;
}

const BUS_OPTIONS: BusOption[] = [
  { num: 1, id: 'bus-1', plate: 'AP 04 TX 1022', route: 'Route 01: Kadapa Central → AITS' },
  { num: 2, id: 'bus-2', plate: 'AP 04 TX 4589', route: 'Route 02: Tirupati Bypass → AITS' },
  { num: 3, id: 'bus-3', plate: 'AP 04 TX 8812', route: 'Route 03: Rayachoty Town → AITS' },
  { num: 4, id: 'bus-4', plate: 'AP 04 TX 9044', route: 'Route 04: Badvel Route → AITS' },
  { num: 5, id: 'bus-5', plate: 'AP 04 TX 3311', route: 'Route 05: Rajampet Local → AITS' },
  { num: 6, id: 'bus-6', plate: 'AP 04 TX 7744', route: 'Route 06: Nandalur Shuttle → AITS' },
];

type DriverFlowStep = 'home' | 'signup' | 'login' | 'choose_bus' | 'ride_status';

export default function DriverPage() {
  const { login, loginWithDemo } = useAuth();
  const { user } = useCurrentUser();

  const [step, setStep] = useState<DriverFlowStep>('home');
  const [username, setUsername] = useState('');
  const [mail, setMail] = useState('driver.venkat@aitsrajampet.ac.in');
  const [mobile, setMobile] = useState('+91 98480 22334');
  const [password, setPassword] = useState('••••••••');
  const [selectedBus, setSelectedBus] = useState<BusOption>(BUS_OPTIONS[1]);
  const [loadingAction, setLoadingAction] = useState(false);

  const { isTracking, health, startTracking, stopTracking, lastSentLocation } = useDriverTracking(
    user?.uid || 'demo-driver-202',
    selectedBus.plate
  );

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    setTimeout(() => {
      loginWithDemo('driver');
      setLoadingAction(false);
      triggerFeedback('success');
      toast.success('Driver profile registered');
      setStep('choose_bus');
    }, 350);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await login('driver');
      triggerFeedback('success');
      toast.success('Signed in');
      setStep('choose_bus');
    } catch {
      loginWithDemo('driver');
      triggerFeedback('success');
      setStep('choose_bus');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleQuickDemo = () => {
    loginWithDemo('driver');
    triggerFeedback('success');
    toast.success('Driver Demo Active');
    setStep('choose_bus');
  };

  const handleBusSelect = (bus: BusOption) => {
    triggerFeedback('select');
    setSelectedBus(bus);
    toast.info(`Assigned Bus ${bus.num} (${bus.plate})`);
    setStep('ride_status');
  };

  const handleStartRide = () => {
    triggerFeedback('success');
    startTracking();
    toast.success('Ride Started • Live GPS Broadcasting');
  };

  const handleEndRide = () => {
    triggerFeedback('stop');
    stopTracking('Trip ended by driver.');
    toast.info('Ride Ended safely');
  };

  const handleQuickAlert = (type: string) => {
    triggerFeedback('warning');
    toast.warning(`Broadcast Sent: ${type}`, {
      description: 'Transport desk and students notified.',
    });
  };

  const stepTitles: Record<DriverFlowStep, string> = {
    home: 'Driver',
    signup: 'Driver Signup',
    login: 'Driver Login',
    choose_bus: 'Choose Bus No',
    ride_status: 'Ride Status',
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
                setStep(step === 'ride_status' ? 'choose_bus' : 'home');
              }}
              className="flex items-center gap-0.5 text-[15px] font-medium text-[#007AFF] hover:opacity-75 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              <span>{step === 'ride_status' ? 'Buses' : 'Back'}</span>
            </button>
          )}

          <span className="font-heading font-semibold text-[15px] tracking-[-0.01em] text-[#1C1C1E]">
            {stepTitles[step]}
          </span>

          <div className="flex items-center gap-2 justify-end min-w-[56px]">
            {step === 'ride_status' && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  isTracking ? 'text-[#248A3D] bg-[#34C759]/14' : 'text-[#8E8E93] bg-[#E5E5EA]'
                }`}
              >
                {isTracking ? 'Live' : 'Idle'}
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
          {/* SCREEN 1: DRIVER HOME                                      */}
          {/* ========================================================== */}
          {step === 'home' && (
            <div className="space-y-5">
              <div className="apple-card rounded-[28px] p-6 text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-[#FFF7ED] border border-[#FED7AA] p-2 flex items-center justify-center">
                  <img
                    src="/images/icon-driver.png"
                    alt="Driver Cockpit"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="font-heading text-[26px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                    Driver Cockpit
                  </h1>
                  <p className="text-[13px] text-[#8E8E93] leading-snug max-w-[260px] mx-auto">
                    Select your assigned shuttle and broadcast live GPS updates.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    triggerFeedback('tap');
                    setStep('signup');
                  }}
                  className="w-full h-12 bg-white hover:bg-white/90 text-[#007AFF] font-heading font-semibold text-[16px] rounded-[14px] apple-card motion-press cursor-pointer"
                >
                  Driver Signup
                </button>

                <button
                  onClick={() => {
                    triggerFeedback('tap');
                    setStep('login');
                  }}
                  className="w-full h-12 bg-[#007AFF] hover:bg-[#0066D6] text-white font-heading font-semibold text-[16px] rounded-[14px] shadow-xs motion-press cursor-pointer"
                >
                  Driver Login
                </button>

                <button
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 text-[13px] font-medium text-[#007AFF] hover:opacity-75 flex items-center justify-center gap-1.5 transition-opacity cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Skip to Choose Bus (Demo)</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SCREEN 2: DRIVER SIGNUP                                    */}
          {/* ========================================================== */}
          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF9500]/12 p-2 flex items-center justify-center">
                  <img
                    src="/images/icon-driver.png"
                    alt="Driver"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-heading text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                  Register Driver
                </h1>
              </div>

              {/* Apple Grouped Inset Form */}
              <div className="apple-card rounded-[16px] overflow-hidden divide-y divide-black/[0.06]">
                <div className="flex items-center px-4 h-12 gap-3">
                  <User className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
                  />
                </div>

                <div className="flex items-center px-4 h-12 gap-3">
                  <Mail className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="email"
                    required
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="Mail"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
                  />
                </div>

                <div className="flex items-center px-4 h-12 gap-3">
                  <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile no"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
                  />
                </div>

                <PasswordInputRow
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
                    'Sign Up'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="w-full text-[13px] font-medium text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer"
                >
                  Already registered? <span className="text-[#007AFF]">Log In</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================== */}
          {/* SCREEN 3: DRIVER LOGIN                                     */}
          {/* ========================================================== */}
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF9500]/12 p-2 flex items-center justify-center">
                  <img
                    src="/images/icon-driver.png"
                    alt="Driver"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="font-heading text-[22px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                  Driver Login
                </h1>
              </div>

              <div className="apple-card rounded-[16px] overflow-hidden divide-y divide-black/[0.06]">
                <div className="flex items-center px-4 h-12 gap-3">
                  <User className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <input
                    type="text"
                    required
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-transparent text-[15px] text-[#1C1C1E] placeholder:text-[#C7C7CC] focus:outline-none"
                  />
                </div>

                <PasswordInputRow
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

                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full h-11 bg-white text-[#007AFF] font-heading font-semibold text-[14px] rounded-[14px] apple-card motion-press cursor-pointer"
                >
                  Instant Demo Login
                </button>

                <button
                  type="button"
                  onClick={() => setStep('signup')}
                  className="w-full text-[13px] font-medium text-[#8E8E93] hover:text-[#1C1C1E] transition-colors cursor-pointer"
                >
                  Need an account? <span className="text-[#007AFF]">Sign Up</span>
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
                <h1 className="font-heading text-[24px] font-bold tracking-[-0.02em] text-[#1C1C1E]">
                  Choose Bus No
                </h1>
                <p className="text-[13px] text-[#8E8E93]">Select your bus to open ride controls</p>
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* SCREEN 5: RIDE STATUS (Apple Workout / CarPlay Cockpit)    */}
          {/* ========================================================== */}
          {step === 'ride_status' && (
            <div className="space-y-4">
              {!health.isOnline && (
                <div className="bg-[#FF3B30]/12 text-[#D70015] text-[12px] font-semibold px-3 py-2 rounded-[14px] flex items-center justify-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5" /> Offline Mode • Buffering GPS
                </div>
              )}

              {/* Telemetry Card */}
              <div className="apple-card rounded-[28px] p-6 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#007AFF] text-white font-display font-bold text-[12px] tabular-nums flex items-center justify-center">
                    {selectedBus.num}
                  </span>
                  <span className="font-heading text-[14px] font-semibold text-[#1C1C1E]">
                    {selectedBus.plate}
                  </span>
                </div>

                <div className="py-2">
                  <div className="font-display text-[56px] font-bold tracking-[-0.03em] text-[#1C1C1E] leading-none tabular-nums">
                    {isTracking ? Math.round((lastSentLocation?.speed || 0) * 3.6) : 0}
                    <span className="text-[18px] font-medium text-[#8E8E93] ml-1.5">km/h</span>
                  </div>
                  <p className="text-[13px] text-[#8E8E93] mt-2 font-medium">
                    {isTracking
                      ? 'Broadcasting GPS every 3 seconds'
                      : 'Tap Start Ride to broadcast location'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F2F7] text-[11px] font-semibold text-[#8E8E93]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isTracking ? 'bg-[#34C759] animate-pulse' : 'bg-[#C7C7CC]'
                    }`}
                  />
                  <span>{selectedBus.route}</span>
                </div>
              </div>

              {/* Primary Ride Controls: Start Ride & End Ride */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleStartRide}
                  disabled={isTracking}
                  className="w-full h-13 bg-[#34C759] hover:bg-[#2DB84D] disabled:bg-[#E5E5EA] text-white disabled:text-[#8E8E93] font-heading font-semibold text-[16px] rounded-[16px] shadow-xs flex items-center justify-center gap-2 motion-press disabled:cursor-not-allowed cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Ride</span>
                </button>

                <button
                  type="button"
                  onClick={handleEndRide}
                  disabled={!isTracking}
                  className="w-full h-13 bg-[#FF3B30] hover:bg-[#E53429] disabled:bg-[#E5E5EA] text-white disabled:text-[#8E8E93] font-heading font-semibold text-[16px] rounded-[16px] shadow-xs flex items-center justify-center gap-2 motion-press disabled:cursor-not-allowed cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>End Ride</span>
                </button>
              </div>

              {/* Apple Grouped Action Rows for Alerts */}
              <div className="apple-card rounded-[16px] overflow-hidden divide-y divide-black/[0.06]">
                <button
                  type="button"
                  onClick={() => handleQuickAlert('Traffic Delay (+15 mins)')}
                  className="w-full px-4 h-11 flex items-center justify-between hover:bg-[#F2F2F7]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#1C1C1E]">
                    <Clock className="w-4 h-4 text-[#FF9500]" />
                    <span>Report Traffic Delay (+15m)</span>
                  </div>
                  <span className="text-[12px] font-medium text-[#007AFF]">Send</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAlert('Breakdown / Flat Tyre')}
                  className="w-full px-4 h-11 flex items-center justify-between hover:bg-[#F2F2F7]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 text-[14px] font-medium text-[#1C1C1E]">
                    <Wrench className="w-4 h-4 text-[#FF3B30]" />
                    <span>Report Breakdown SOS</span>
                  </div>
                  <span className="text-[12px] font-medium text-[#FF3B30]">Alert</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 text-center">
        <p className="text-[11px] text-[#8E8E93] font-medium">AITS Campus Transit • Driver</p>
      </footer>
    </div>
  );
}
