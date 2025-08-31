"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useAppSelector } from "@/store";

type Equipment = {
  id: string;
  qrCode: string;
  make: string;
  model: string;
  category: string;
  condition: string;
  status: 'AVAILABLE' | 'CHECKED_OUT' | 'MAINTENANCE' | 'RETIRED';
  location: string;
};

// Mock equipment data
const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq_trumpet_001',
    qrCode: 'TR-2024-001',
    make: 'Bach',
    model: 'TR300H2',
    category: 'Brass',
    condition: 'Excellent',
    status: 'AVAILABLE',
    location: 'Music Room A'
  },
  {
    id: 'eq_clarinet_001',
    qrCode: 'CL-2024-001',
    make: 'Yamaha',
    model: 'YCL-255',
    category: 'Woodwind',
    condition: 'Good',
    status: 'AVAILABLE',
    location: 'Music Room B'
  },
  {
    id: 'eq_trombone_001',
    qrCode: 'TB-2024-001',
    make: 'Bach',
    model: 'TB301',
    category: 'Brass',
    condition: 'Good',
    status: 'AVAILABLE',
    location: 'Music Room A'
  }
];

export default function EquipmentCheckoutPage() {
  const [scannedCode, setScannedCode] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const user = useAppSelector((s) => s.auth.user);

  const handleQRScan = (code: string) => {
    setScannedCode(code);
    const equipment = MOCK_EQUIPMENT.find(eq => eq.qrCode === code);
    setSelectedEquipment(equipment || null);
    setIsScanning(false);
  };

  const handleManualEntry = () => {
    if (scannedCode) {
      handleQRScan(scannedCode);
    }
  };

  const handleCheckout = () => {
    if (selectedEquipment && user) {
      alert(`Equipment ${selectedEquipment.qrCode} checked out to ${user.name}`);
      // Reset form
      setScannedCode('');
      setSelectedEquipment(null);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent': return 'text-green-700 bg-green-100';
      case 'Good': return 'text-blue-700 bg-blue-100';
      case 'Fair': return 'text-yellow-700 bg-yellow-100';
      case 'Poor': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Equipment Checkout</h1>
          </div>

          {/* QR Scanner Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Scan Equipment QR Code</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* QR Scanner */}
              <div className="space-y-4">
                <button
                  onClick={() => setIsScanning(!isScanning)}
                  className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center ${
                    isScanning ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Icon 
                    icon={isScanning ? "material-symbols:qr-code-scanner" : "material-symbols:qr-code"} 
                    className={`w-12 h-12 mb-2 ${isScanning ? 'text-blue-600' : 'text-gray-400'}`}
                  />
                  <span className={`text-sm font-medium ${isScanning ? 'text-blue-600' : 'text-gray-600'}`}>
                    {isScanning ? 'Scanning for QR Code...' : 'Click to Start QR Scanner'}
                  </span>
                </button>

                {/* Mock QR codes for testing */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Or click a sample QR code:</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {MOCK_EQUIPMENT.map(eq => (
                      <button
                        key={eq.id}
                        onClick={() => handleQRScan(eq.qrCode)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                      >
                        {eq.qrCode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Or enter QR code manually:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                      placeholder="Enter QR code (e.g., TR-2024-001)"
                      className="flex-1 input-field"
                    />
                    <button
                      onClick={handleManualEntry}
                      className="btn-primary"
                    >
                      <Icon icon="material-symbols:search" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Selected Equipment Display */}
                {selectedEquipment && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="material-symbols:check-circle" className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Equipment Found</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div><strong>QR Code:</strong> {selectedEquipment.qrCode}</div>
                      <div><strong>Equipment:</strong> {selectedEquipment.make} {selectedEquipment.model}</div>
                      <div><strong>Category:</strong> {selectedEquipment.category}</div>
                      <div><strong>Location:</strong> {selectedEquipment.location}</div>
                      <div className="flex items-center gap-2">
                        <strong>Condition:</strong>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getConditionColor(selectedEquipment.condition)}`}>
                          {selectedEquipment.condition}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Checkout Confirmation */}
          {selectedEquipment && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-4">Checkout Confirmation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Equipment Details</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>{selectedEquipment.make} {selectedEquipment.model}</div>
                    <div>QR Code: {selectedEquipment.qrCode}</div>
                    <div>Category: {selectedEquipment.category}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Student Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Name: {user?.name || 'Student User'}</div>
                    <div>Email: {user?.email}</div>
                    <div>Expected Return: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCheckout}
                  className="btn-primary"
                >
                  <Icon icon="material-symbols:check" className="w-4 h-4 mr-2" />
                  Confirm Checkout
                </button>
                <button
                  onClick={() => {
                    setSelectedEquipment(null);
                    setScannedCode('');
                  }}
                  className="btn-secondary"
                >
                  <Icon icon="material-symbols:cancel" className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Quick Access to Available Equipment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold mb-4">Available Equipment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_EQUIPMENT.filter(eq => eq.status === 'AVAILABLE').map(equipment => (
                <div key={equipment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="material-symbols:music-note" className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{equipment.make} {equipment.model}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>QR: {equipment.qrCode}</div>
                    <div>Location: {equipment.location}</div>
                    <div className="flex items-center gap-2">
                      <span>Condition:</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getConditionColor(equipment.condition)}`}>
                        {equipment.condition}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQRScan(equipment.qrCode)}
                    className="mt-3 w-full btn-secondary text-sm"
                  >
                    Select for Checkout
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}