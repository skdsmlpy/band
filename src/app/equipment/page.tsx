"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { MOCK_EQUIPMENT, getEquipmentStatusColor, getEquipmentConditionColor } from "@/lib/mockBandData";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function EquipmentPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredEquipment = MOCK_EQUIPMENT.filter(eq => {
    const matchesFilter = filter === "all" || eq.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = search === "" || 
      eq.make.toLowerCase().includes(search.toLowerCase()) ||
      eq.model.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
      eq.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: MOCK_EQUIPMENT.length,
    available: MOCK_EQUIPMENT.filter(eq => eq.status === 'AVAILABLE').length,
    checked_out: MOCK_EQUIPMENT.filter(eq => eq.status === 'CHECKED_OUT').length,
    in_maintenance: MOCK_EQUIPMENT.filter(eq => eq.status === 'IN_MAINTENANCE').length,
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-xl md:text-2xl font-bold">Equipment Management</h1>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="btn-primary">
                <Icon icon="material-symbols:add" className="w-4 h-4 mr-2" />
                Add Equipment
              </button>
              <button className="btn-secondary">
                <Icon icon="material-symbols:download" className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search equipment..."
                className="input-field w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
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
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEquipment.map(equipment => (
              <div key={equipment.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{equipment.make} {equipment.model}</h3>
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

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial:</span>
                    <span className="font-mono">{equipment.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span>{equipment.location}</span>
                  </div>
                  {equipment.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned:</span>
                      <span className="text-blue-600">{equipment.assignedTo}</span>
                    </div>
                  )}
                  {equipment.purchasePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span>${equipment.purchasePrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 btn-secondary text-xs">
                    <Icon icon="material-symbols:qr-code" className="w-3 h-3 mr-1" />
                    QR Code
                  </button>
                  <button className="flex-1 btn-secondary text-xs">
                    <Icon icon="material-symbols:edit" className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <Icon icon="material-symbols:search-off" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No equipment found matching your criteria</p>
            </div>
          )}
        </div>
      </AppShell>
    </RequireAuth>
  );
}