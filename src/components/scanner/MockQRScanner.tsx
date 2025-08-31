"use client";
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { MOCK_QR_CODES, getMockScanResult, MockEquipment } from "@/lib/mockBandData";

interface MockQRScannerProps {
  onScan: (result: any) => void;
  onError?: (error: string) => void;
  autoScan?: boolean;
  showDevControls?: boolean;
}

export function MockQRScanner({ 
  onScan, 
  onError, 
  autoScan = false,
  showDevControls = true 
}: MockQRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMockCode, setSelectedMockCode] = useState("");
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [scanningAnimation, setScanningAnimation] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  // Simulate camera initialization
  useEffect(() => {
    if (cameraEnabled) {
      const timer = setTimeout(() => {
        setCameraEnabled(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [cameraEnabled]);

  const simulateScan = async (qrCode: string) => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanningAnimation(true);
    
    try {
      // Simulate realistic scanning delay
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const result = getMockScanResult(qrCode);
      
      // Add to scan history
      setScanHistory(prev => [qrCode, ...prev.slice(0, 4)]);
      
      if (result.success) {
        onScan(result);
      } else {
        onError?.(result.error || "Scan failed");
      }
    } catch (error) {
      onError?.("Scanner error occurred");
    } finally {
      setIsScanning(false);
      setScanningAnimation(false);
    }
  };

  const startCameraMode = () => {
    setCameraEnabled(true);
    if (autoScan && selectedMockCode) {
      setTimeout(() => simulateScan(selectedMockCode), 2000);
    }
  };

  const stopCameraMode = () => {
    setCameraEnabled(false);
    setIsScanning(false);
    setScanningAnimation(false);
  };

  return (
    <div className="space-y-4">
      {/* Mock Camera View */}
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        {!cameraEnabled ? (
          // Camera off state
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <Icon icon="material-symbols:videocam-off" width={64} height={64} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm mb-4">Camera is off</p>
              <button
                onClick={startCameraMode}
                className="btn-primary text-sm"
                disabled={isScanning}
              >
                <Icon icon="material-symbols:videocam" className="mr-2" />
                Enable Camera
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mock camera feed background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
              {/* Simulate camera noise/grain */}
              <div className="absolute inset-0 opacity-20" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                  backgroundSize: '200px 200px'
                }}
              />
            </div>

            {/* Scanning Overlay */}
            <div className="absolute inset-0">
              {/* Corner guides */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-teal-500"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-teal-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-teal-500"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-500"></div>

              {/* Central scanning area */}
              <div className="absolute inset-8 border-2 border-teal-500/50 rounded-lg flex items-center justify-center">
                {isScanning ? (
                  <div className="text-center text-white">
                    <div className={`mb-3 ${scanningAnimation ? 'scanning-animation' : ''}`}>
                      <Icon icon="material-symbols:qr-code-scanner" width={48} height={48} className="animate-pulse" />
                    </div>
                    <p className="text-sm">Scanning...</p>
                    <div className="mt-2 w-32 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-300">
                    <Icon icon="material-symbols:qr-code-2" width={48} height={48} className="mb-3" />
                    <p className="text-sm">Point camera at QR code</p>
                  </div>
                )}
              </div>

              {/* Scanning line animation */}
              {scanningAnimation && (
                <div className="absolute inset-8 pointer-events-none">
                  <div className="qr-scanner-overlay"></div>
                </div>
              )}
            </div>

            {/* Camera controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={stopCameraMode}
                className="bg-red-500/80 hover:bg-red-600/80 text-white p-2 rounded-full backdrop-blur-sm"
                title="Stop camera"
              >
                <Icon icon="material-symbols:videocam-off" width={20} />
              </button>
              <button
                onClick={() => setScanningAnimation(!scanningAnimation)}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
                title="Toggle scanning animation"
              >
                <Icon icon="material-symbols:animation" width={20} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Development Controls */}
      {showDevControls && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Development Controls
            </h3>
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
              DEV MODE
            </span>
          </div>

          {/* Quick QR Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick Test QR Codes:
            </label>
            <select 
              className="input-field-mobile w-full"
              value={selectedMockCode}
              onChange={(e) => setSelectedMockCode(e.target.value)}
              disabled={isScanning}
            >
              <option value="">Select a QR code to test...</option>
              <optgroup label="Brass Section">
                <option value="QR_TRUMPET_001">🎺 Trumpet TR-2024-001 (Available)</option>
                <option value="QR_TRUMPET_002">🎺 Trumpet TR-2024-002 (Checked Out)</option>
                <option value="QR_TROMBONE_001">🎺 Trombone TB-2024-001 (Available)</option>
                <option value="QR_FRENCHHORN_001">🎺 French Horn FH-2024-001 (Available)</option>
              </optgroup>
              <optgroup label="Woodwind Section">
                <option value="QR_FLUTE_001">🎵 Flute FL-2024-001 (Available)</option>
                <option value="QR_CLARINET_001">🎵 Clarinet CL-2024-001 (Available)</option>
                <option value="QR_SAXOPHONE_001">🎵 Saxophone SX-2024-001 (Available)</option>
              </optgroup>
              <optgroup label="Percussion Section">
                <option value="QR_SNARE_001">🥁 Snare Drum SD-2024-001 (Available)</option>
                <option value="QR_TIMPANI_001">🥁 Timpani TI-2024-001 (Available)</option>
              </optgroup>
              <optgroup label="String Section">
                <option value="QR_VIOLIN_001">🎻 Violin VN-2024-001 (Available)</option>
              </optgroup>
              <optgroup label="Maintenance Examples">
                <option value="QR_TROMBONE_002">🔧 Trombone TB-2024-002 (In Maintenance)</option>
              </optgroup>
              <optgroup label="Error Cases">
                <option value="QR_INVALID_001">❌ Invalid QR Code (Test Error)</option>
              </optgroup>
            </select>
          </div>
          
          {/* Simulate Scan Button */}
          <button 
            className="btn-primary w-full"
            disabled={!selectedMockCode || isScanning}
            onClick={() => simulateScan(selectedMockCode)}
          >
            <Icon icon="material-symbols:qr-code-scanner" className="mr-2" />
            {isScanning ? "Scanning..." : "Simulate Scan"}
          </button>

          {/* Scan History */}
          {scanHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recent Scans:
              </h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {scanHistory.map((code, index) => (
                  <div key={`${code}-${index}`} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{code}</span>
                    <button
                      onClick={() => simulateScan(code)}
                      className="text-teal-600 hover:text-teal-700 text-xs"
                      disabled={isScanning}
                    >
                      Rescan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto-scan toggle */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={autoScan}
              onChange={(e) => {
                // This would need to be handled by parent component
                console.log("Auto-scan toggled:", e.target.checked);
              }}
              className="rounded"
            />
            <span className="text-gray-700 dark:text-gray-300">Auto-scan when camera starts</span>
          </label>
        </div>
      )}

      {/* Scanner Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${cameraEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span>{cameraEnabled ? 'Camera Active' : 'Camera Inactive'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:developer-mode" width={14} />
          <span>Mock Scanner</span>
        </div>
      </div>
    </div>
  );
}