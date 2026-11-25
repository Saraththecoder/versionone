'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserCodeReader, BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { extractRollNoFromBarcode } from '@/lib/aitsRollNo';
import { triggerFeedback } from '@/lib/feedback';
import {
  Camera,
  Flashlight,
  ScanBarcode,
  X,
  AlertCircle,
  SwitchCamera,
  ImagePlus,
} from 'lucide-react';

interface IdBarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
  onDetected: (rollNo: string) => void;
}

function createBarcodeReader(): BrowserMultiFormatReader {
  const hints = new Map();
  hints.set(DecodeHintType.TRY_HARDER, true);
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.ITF,
    BarcodeFormat.CODABAR,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.QR_CODE,
  ]);
  return new BrowserMultiFormatReader(hints, {
    delayBetweenScanAttempts: 180,
  });
}

function ScannerSession({
  onClose,
  onDetected,
}: {
  onClose: () => void;
  onDetected: (rollNo: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectedOnceRef = useRef(false);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanHint, setScanHint] = useState<string | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const stopCurrentStream = () => {
      controlsRef.current?.stop();
      controlsRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    async function startScanner() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          'Live camera is not available in this browser context. Use "Take / Upload Photo" below.'
        );
        return;
      }

      stopCurrentStream();

      const videoEl = videoRef.current;
      if (!videoEl) return;

      let stream: MediaStream | null = null;
      try {
        const primaryConstraints: MediaStreamConstraints = {
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : { facingMode: { ideal: 'environment' } },
          audio: false,
        };
        stream = await navigator.mediaDevices.getUserMedia(primaryConstraints);
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        } catch (err: unknown) {
          if (cancelled) return;
          const msg = err instanceof Error ? err.message.toLowerCase() : '';
          if (msg.includes('permission') || msg.includes('notallowed')) {
            setCameraError(
              'Camera permission denied. Allow camera access or tap "Take / Upload Photo" below.'
            );
          } else {
            setCameraError(
              'Could not open camera preview. Tap "Take / Upload Photo" below or enter Roll No manually.'
            );
          }
          return;
        }
      }

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.setAttribute('playsinline', 'true');
      videoEl.srcObject = stream;

      try {
        await videoEl.play();
      } catch {
        // Ignore autoplay rejection; decodeFromStream will also attempt playback
      }

      try {
        const videoDevices = await BrowserCodeReader.listVideoInputDevices();
        if (!cancelled) {
          setDevices(videoDevices);
        }
      } catch {
        // Device enumeration optional
      }

      const activeTrack = stream.getVideoTracks()[0];
      const caps = activeTrack?.getCapabilities?.() as MediaTrackCapabilities & {
        torch?: boolean;
      };
      if (!cancelled) {
        setTorchSupported(Boolean(caps?.torch));
        setTorchOn(false);
        setCameraError(null);
      }

      const reader = createBarcodeReader();

      try {
        const controls = await reader.decodeFromStream(stream, videoEl, (result) => {
          if (cancelled || detectedOnceRef.current || !result) return;
          const rawText = result.getText();
          const extracted = extractRollNoFromBarcode(rawText);
          if (extracted) {
            detectedOnceRef.current = true;
            triggerFeedback('success');
            stopCurrentStream();
            onDetected(extracted);
          } else {
            triggerFeedback('warning');
            setScanHint(`Read "${rawText.slice(0, 24)}" — point at your AITS Roll No barcode.`);
          }
        });

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setCameraReady(true);
      } catch {
        if (!cancelled) {
          setCameraError(
            'Camera preview could not start. Use "Take / Upload Photo" below or enter Roll No manually.'
          );
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      stopCurrentStream();
    };
  }, [onDetected, selectedDeviceId]);

  const handleSwitchCamera = () => {
    if (devices.length < 2) return;
    triggerFeedback('tap');
    setCameraReady(false);
    const activeTrack = streamRef.current?.getVideoTracks()[0];
    const currentId = activeTrack?.getSettings()?.deviceId || selectedDeviceId;
    const currentIdx = devices.findIndex((d) => d.deviceId === currentId);
    const nextIdx = currentIdx >= 0 ? (currentIdx + 1) % devices.length : 0;
    setSelectedDeviceId(devices[nextIdx].deviceId);
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const next = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: next } as MediaTrackConstraintSet],
      });
      setTorchOn(next);
      triggerFeedback('tap');
    } catch {
      // Torch constraint not supported by device
    }
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    try {
      const reader = createBarcodeReader();
      const result = await reader.decodeFromImageUrl(objectUrl);
      const rawText = result.getText();
      const extracted = extractRollNoFromBarcode(rawText);
      if (extracted) {
        triggerFeedback('success');
        onDetected(extracted);
      } else {
        triggerFeedback('warning');
        setScanHint(`Photo read "${rawText.slice(0, 24)}" — not a valid AITS Roll No barcode.`);
      }
    } catch {
      triggerFeedback('error');
      setScanHint('No barcode detected in that photo. Try a sharper, well-lit close-up.');
    } finally {
      URL.revokeObjectURL(objectUrl);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-[400px] bg-[#1C1C1E] text-white rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl border border-white/10">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#007AFF]/20 text-[#0A84FF] flex items-center justify-center">
              <ScanBarcode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading text-[15px] font-semibold leading-tight">
                Scan College ID Card
              </h2>
              <p className="text-[11px] text-white/60">Align barcode inside the frame</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {devices.length > 1 && (
              <button
                type="button"
                onClick={handleSwitchCamera}
                className="w-8 h-8 rounded-full bg-white/12 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Switch Camera"
                title="Switch Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}
            {torchSupported && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  torchOn ? 'bg-[#FFCC00] text-[#1C1C1E]' : 'bg-white/12 text-white'
                }`}
                aria-label="Toggle Flashlight"
              >
                <Flashlight className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                triggerFeedback('tap');
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/12 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Scanner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            muted
            playsInline
            autoPlay
            className="relative z-0 block w-full h-full object-cover"
          />

          {/* Apple-style Barcode Reticle Overlay */}
          {!cameraError && (
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-8">
              <div className="w-full max-w-[270px] h-[110px] rounded-2xl border-2 border-[#0A84FF] bg-transparent relative overflow-hidden">
                <div className="absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 bg-[#34C759] shadow-[0_0_8px_#34C759] animate-pulse" />
              </div>
              <span className="mt-4 px-3 py-1 rounded-full bg-black/70 text-[11px] font-medium text-white/95">
                {cameraReady ? 'Hold ID barcode steady (e.g. 24AK1A33D8)' : 'Starting camera...'}
              </span>
            </div>
          )}

          {/* Camera Error State */}
          {cameraError && (
            <div className="absolute inset-0 z-20 bg-[#1C1C1E] p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FF3B30]/15 text-[#FF453A] flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-[13px] text-white/85 leading-snug max-w-[260px]">{cameraError}</p>
              <button
                type="button"
                onClick={() => {
                  triggerFeedback('tap');
                  onClose();
                }}
                className="px-4 py-2 rounded-full bg-white/12 text-white text-[13px] font-semibold cursor-pointer"
              >
                Enter Roll No Manually
              </button>
            </div>
          )}
        </div>

        {/* Non-matching barcode feedback */}
        {scanHint && (
          <div className="px-4 py-2.5 bg-[#FF9500]/15 border-t border-white/10 flex items-center gap-2 text-[12px] text-[#FFD60A]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{scanHint}</span>
          </div>
        )}

        {/* Fallback Native Camera / Photo Capture */}
        <div className="px-4 py-3 bg-[#1C1C1E] border-t border-white/10 flex items-center justify-between gap-3">
          <p className="text-[11px] text-white/55">Camera dark or blocked?</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => {
              triggerFeedback('tap');
              fileInputRef.current?.click();
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0066D6] text-white text-[12px] font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ImagePlus className="w-3.5 h-3.5" />
            <span>Take / Upload Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function IdBarcodeScannerModal({ open, onClose, onDetected }: IdBarcodeScannerModalProps) {
  if (!open) return null;
  return <ScannerSession onClose={onClose} onDetected={onDetected} />;
}
