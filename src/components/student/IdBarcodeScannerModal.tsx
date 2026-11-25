'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType } from '@zxing/library';
import { extractRollNoFromBarcode } from '@/lib/aitsRollNo';
import { triggerFeedback } from '@/lib/feedback';
import { Camera, Flashlight, ScanBarcode, X, AlertCircle } from 'lucide-react';

interface IdBarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
  onDetected: (rollNo: string) => void;
}

function ScannerSession({
  onClose,
  onDetected,
}: {
  onClose: () => void;
  onDetected: (rollNo: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const detectedOnceRef = useRef(false);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanHint, setScanHint] = useState<string | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startScanner() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not available on this browser or requires HTTPS.');
        return;
      }

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

      const reader = new BrowserMultiFormatReader(hints, {
        delayBetweenScanAttempts: 180,
      });

      const videoEl = videoRef.current;
      if (!videoEl) return;

      try {
        const controls = await reader.decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: 'environment' },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          },
          videoEl,
          (result) => {
            if (cancelled || detectedOnceRef.current || !result) return;
            const rawText = result.getText();
            const extracted = extractRollNoFromBarcode(rawText);
            if (extracted) {
              detectedOnceRef.current = true;
              triggerFeedback('success');
              controlsRef.current?.stop();
              onDetected(extracted);
            } else {
              triggerFeedback('warning');
              setScanHint(`Read "${rawText.slice(0, 24)}" — point at your AITS Roll No barcode.`);
            }
          }
        );

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setCameraReady(true);

        const stream = videoEl.srcObject as MediaStream | null;
        const track = stream?.getVideoTracks()[0];
        const caps = track?.getCapabilities?.() as MediaTrackCapabilities & { torch?: boolean };
        if (caps?.torch) {
          setTorchSupported(true);
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : '';
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
          setCameraError(
            'Camera permission denied. Allow camera access or enter your Roll No manually.'
          );
        } else {
          setCameraError('Could not start camera. Ensure a camera is available and try again.');
        }
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onDetected]);

  const toggleTorch = async () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    const track = stream?.getVideoTracks()[0];
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
          <video ref={videoRef} muted playsInline autoPlay className="w-full h-full object-cover" />

          {/* Apple-style Barcode Reticle Overlay */}
          {!cameraError && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-8">
              <div className="w-full max-w-[270px] h-[110px] rounded-2xl border-2 border-[#0A84FF] shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] relative overflow-hidden">
                <div className="absolute inset-x-3 top-1/2 h-[2px] -translate-y-1/2 bg-[#34C759] shadow-[0_0_8px_#34C759] animate-pulse" />
              </div>
              <span className="mt-4 px-3 py-1 rounded-full bg-black/65 backdrop-blur-sm text-[11px] font-medium text-white/90">
                {cameraReady ? 'Hold ID barcode steady (e.g. 23701A0501)' : 'Starting camera...'}
              </span>
            </div>
          )}

          {/* Camera Error State */}
          {cameraError && (
            <div className="absolute inset-0 bg-[#1C1C1E] p-6 flex flex-col items-center justify-center text-center space-y-3">
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
                className="px-4 py-2 rounded-full bg-[#007AFF] text-white text-[13px] font-semibold cursor-pointer"
              >
                Enter Roll No Manually
              </button>
            </div>
          )}
        </div>

        {/* Non-matching barcode feedback */}
        {scanHint && !cameraError && (
          <div className="px-4 py-2.5 bg-[#FF9500]/15 border-t border-white/10 flex items-center gap-2 text-[12px] text-[#FFD60A]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{scanHint}</span>
          </div>
        )}

        <div className="px-4 py-3 bg-[#1C1C1E] text-center">
          <p className="text-[11px] text-white/50">
            Supports 1D ID card barcodes (Code 128 / Code 39) & QR codes
          </p>
        </div>
      </div>
    </div>
  );
}

export function IdBarcodeScannerModal({ open, onClose, onDetected }: IdBarcodeScannerModalProps) {
  if (!open) return null;
  return <ScannerSession onClose={onClose} onDetected={onDetected} />;
}
