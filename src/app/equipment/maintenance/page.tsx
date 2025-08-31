"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { MOCK_MAINTENANCE_RECORDS, MOCK_EQUIPMENT } from "@/lib/mockBandData";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function EquipmentMaintenancePage() {
  const [filter, setFilter] = useState("all");

  const filteredMaintenance = MOCK_MAINTENANCE_RECORDS.filter(record => {
    return filter === "all" || record.status.toLowerCase() === filter.toLowerCase();
  });

  const statusCounts = {
    all: MOCK_MAINTENANCE_RECORDS.length,
    scheduled: MOCK_MAINTENANCE_RECORDS.filter(r => r.status === 'SCHEDULED').length,
    in_progress: MOCK_MAINTENANCE_RECORDS.filter(r => r.status === 'IN_PROGRESS').length,
    completed: MOCK_MAINTENANCE_RECORDS.filter(r => r.status === 'COMPLETED').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_PROGRESS': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-700 bg-red-100';
      case 'HIGH': return 'text-orange-700 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
      case 'LOW': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getEquipmentInfo = (equipmentId: string) => {
    return MOCK_EQUIPMENT.find(eq => eq.id === equipmentId);
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Equipment Maintenance</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn-primary">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                Schedule Maintenance
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:calendar-month" className="w-4 h-4 mr-2" />
                Calendar View
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:schedule" className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">{statusCounts.scheduled}</div>
                  <div className="text-sm text-blue-600">Scheduled</div>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:build" className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-900">{statusCounts.in_progress}</div>
                  <div className="text-sm text-yellow-600">In Progress</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:check-circle" className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">{statusCounts.completed}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <Icon icon="material-symbols:list-alt" className="w-8 h-8 text-gray-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ').toUpperCase()} ({count})
              </button>
            ))}
          </div>

          {/* Maintenance Records - Mobile-first Card Layout */}
          <div className="space-y-4">
            {filteredMaintenance.map(record => {
              const equipment = getEquipmentInfo(record.equipmentId);
              return (
                <div key={record.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon icon="material-symbols:build" className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          {equipment && (
                            <div className="mb-2">
                              <h3 className="font-semibold text-lg">{equipment.make} {equipment.model}</h3>
                              <p className="text-sm text-gray-600">S/N: {equipment.serialNumber}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(record.status)}`}>
                              {record.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(record.priority)}`}>
                              {record.priority}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                              {record.maintenanceType}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Icon icon="material-symbols:schedule" className="w-4 h-4 text-gray-400" />
                          <span>Scheduled: {record.scheduledDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon icon="material-symbols:person" className="w-4 h-4 text-gray-400" />
                          <span>Technician: {record.technicianName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon icon="material-symbols:attach-money" className="w-4 h-4 text-gray-400" />
                          <span>Cost: {record.cost ? `$${record.cost.toFixed(2)}` : 'TBD'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button className="btn-secondary text-sm">
                        <Icon icon="material-symbols:visibility" className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button className="btn-secondary text-sm">
                        <Icon icon="material-symbols:edit" className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMaintenance.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:build-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No maintenance records found</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}