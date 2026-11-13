import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  onScanSuccess,
  isScanning,
  setIsScanning,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerId = 'qr-camera-reader';

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {
        // Ignore stop errors
      }
    }
  };

  const startScanner = async () => {
    setErrorMessage(null);
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerId);
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          // Don't kill scanner immediately, but notify
        },
        () => {
          // Frame parse error, normal during searching
        }
      );
      setIsScanning(true);
    } catch (err: unknown) {
      const errorStr = err instanceof Error ? err.message : String(err);
      setErrorMessage(
        errorStr.includes('NotAllowedError') || errorStr.includes('Permission')
          ? 'Camera permission was denied. Please enable camera access in your browser or use manual participant search below.'
          : 'Could not access device camera. Please ensure camera is connected and not used by another application.'
      );
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0B2038] uppercase tracking-wide">
          Device Camera Scanner
        </span>
        {isScanning ? (
          <button
            id="stop-camera-scan-btn"
            onClick={async () => {
              await stopScanner();
              setIsScanning(false);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <CameraOff className="w-3.5 h-3.5" />
            Stop Camera
          </button>
        ) : (
          <button
            id="start-camera-scan-btn"
            onClick={startScanner}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1793D1] hover:bg-[#127EB5] active:bg-[#0F6B9B] px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            Scan QR Code
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Reader Container */}
      <div
        id={readerId}
        className={`w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-[#E2EDF4] bg-slate-950 ${
          isScanning ? 'min-h-[280px]' : 'hidden'
        }`}
      />
    </div>
  );
};
