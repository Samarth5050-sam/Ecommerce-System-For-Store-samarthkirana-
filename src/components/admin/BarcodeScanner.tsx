import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CameraOff, ScanLine } from "lucide-react";

interface Props {
  onScan: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const BarcodeScanner = ({ onScan, isOpen, onClose }: Props) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "barcode-reader";

  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }
    scannerRef.current = null;
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    try {
      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 1.5 },
        (decodedText) => {
          onScan(decodedText);
          // Brief vibration feedback
          if (navigator.vibrate) navigator.vibrate(100);
        },
        () => {}
      );
      setScanning(true);
    } catch (err: any) {
      setError(err?.message || "Camera access denied. Please allow camera permissions.");
      setScanning(false);
    }
  }, [onScan]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(startScanner, 300);
      return () => { clearTimeout(timer); stopScanner(); };
    } else {
      stopScanner();
    }
  }, [isOpen, startScanner, stopScanner]);

  if (!isOpen) return null;

  return (
    <Card className="border-2 border-primary/30 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Scanner Header */}
          <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-2">
              <ScanLine className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground">Barcode Scanner</span>
              {scanning && (
                <span className="text-xs text-secondary font-medium flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  Live
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { stopScanner(); onClose(); }}>
              <CameraOff className="h-3 w-3 mr-1" /> Close
            </Button>
          </div>

          {/* Scanner View */}
          <div className="relative bg-black">
            <div id={containerId} className="w-full" style={{ minHeight: 220 }} />
            {scanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-[260px] h-[160px] border-2 border-primary/60 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br-lg" />
                  <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-primary/50 animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="p-4 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button size="sm" onClick={startScanner}>
                <Camera className="h-3 w-3 mr-1" /> Retry
              </Button>
            </div>
          )}

          {/* Instructions */}
          <div className="p-2 bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">
              Point camera at product barcode · Auto-detects EAN, UPC, Code128
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarcodeScanner;
