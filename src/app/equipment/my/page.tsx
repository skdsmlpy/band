"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { MOCK_EQUIPMENT, MOCK_STUDENTS, getEquipmentStatusColor, getEquipmentConditionColor } from "@/lib/mockBandData";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";

export default function MyEquipmentPage() {
  const userEmail = useAppSelector((s) => s.auth.user?.email);
  
  // Get student info
  const student = MOCK_STUDENTS.find(s => s.email === userEmail);
  
  // Get current assignments
  const myEquipment = MOCK_EQUIPMENT.filter(eq => eq.assignedTo === userEmail);
  
  // Get equipment history
  const equipmentHistory = student?.equipmentHistory 
    ? MOCK_EQUIPMENT.filter(eq => student.equipmentHistory.includes(eq.qrCode))
    : [];

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">My Equipment</h1>
            <button className="btn-primary w-full sm:w-auto">
              <Icon icon="material-symbols:qr-code-scanner" className="w-4 h-4 mr-2" />
              Check Out Equipment
            </button>
          </div>

          {/* Student Info */}
          {student && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-4">
                <Icon icon="material-symbols:school" className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="font-semibold text-lg">{student.name}</h2>
                  <p className="text-blue-600">Grade {student.gradeLevel} • {student.bandSection} section • {student.primaryInstrument}</p>
                  <p className="text-sm text-gray-600">Academic Standing: {student.academicStanding.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Currently Checked Out */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="material-symbols:assignment-ind" className="w-6 h-6" />
              Currently Checked Out ({myEquipment.length})
            </h2>
            
            {myEquipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEquipment.map(equipment => (
                  <div key={equipment.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{equipment.make} {equipment.model}</h3>
                        <p className="text-sm text-gray-600">{equipment.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEquipmentConditionColor(equipment.condition)}`}>
                        {equipment.condition}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Serial:</span>
                        <span className="font-mono">{equipment.serialNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Checked Out:</span>
                        <span>{equipment.checkoutDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Due Back:</span>
                        <span className="text-red-600 font-medium">{equipment.expectedReturn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span>{equipment.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 btn-primary text-xs">
                        <Icon icon="material-symbols:assignment-return" className="w-3 h-3 mr-1" />
                        Return
                      </button>
                      <button className="flex-1 btn-secondary text-xs">
                        <Icon icon="material-symbols:qr-code" className="w-3 h-3 mr-1" />
                        QR Code
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Icon icon="material-symbols:music-note-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">You don't have any equipment checked out</p>
                <button className="mt-4 btn-primary">
                  <Icon icon="material-symbols:qr-code-scanner" className="w-4 h-4 mr-2" />
                  Check Out Equipment
                </button>
              </div>
            )}
          </div>

          {/* Equipment History */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Icon icon="material-symbols:history" className="w-6 h-6" />
              Equipment History ({equipmentHistory.length})
            </h2>
            
            {equipmentHistory.length > 0 ? (
              <div className="space-y-3">
                {equipmentHistory.map(equipment => (
                  <div key={equipment.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{equipment.make} {equipment.model}</h3>
                        <p className="text-sm text-gray-600">{equipment.category}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEquipmentStatusColor(equipment.status)}`}>
                          {equipment.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEquipmentConditionColor(equipment.condition)}`}>
                          {equipment.condition}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-mono">{equipment.serialNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Icon icon="material-symbols:history-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No equipment history available</p>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}