"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { WidgetCard, ChartStub } from "@/components/widgets/WidgetCard";
import { MOCK_EQUIPMENT, MOCK_STUDENTS, MOCK_BAND_EVENTS, MOCK_MAINTENANCE_RECORDS } from "@/lib/mockBandData";
import { useMemo } from "react";

export default function LandingPage() {
  const bandStats = useMemo(() => {
    const totalEquipment = MOCK_EQUIPMENT.length;
    const availableEquipment = MOCK_EQUIPMENT.filter(eq => eq.status === 'AVAILABLE').length;
    const checkedOutEquipment = MOCK_EQUIPMENT.filter(eq => eq.status === 'CHECKED_OUT').length;
    const maintenanceEquipment = MOCK_EQUIPMENT.filter(eq => eq.status === 'IN_MAINTENANCE').length;
    const activeStudents = MOCK_STUDENTS.length;
    const upcomingEvents = MOCK_BAND_EVENTS.filter(event => event.status === 'SCHEDULED').length;
    const pendingMaintenance = MOCK_MAINTENANCE_RECORDS.filter(maint => maint.status === 'SCHEDULED').length;
    const utilizationRate = Math.round((checkedOutEquipment / totalEquipment) * 100);
    const maintenanceCompliance = Math.round(((totalEquipment - pendingMaintenance) / totalEquipment) * 100);
    
    return {
      totalEquipment,
      availableEquipment,
      checkedOutEquipment,
      maintenanceEquipment,
      activeStudents,
      upcomingEvents,
      pendingMaintenance,
      utilizationRate,
      maintenanceCompliance,
      systemStatus: (maintenanceEquipment > 2 ? 'yellow' : 'green') as 'green' | 'yellow' | 'red',
      systemMessage: maintenanceEquipment > 2 ? 'Some equipment needs attention' : 'All systems operational'
    };
  }, []);

  return (
    <RequireAuth>
      <AppShell>
        <div className="space-y-4 md:space-y-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Band Management Dashboard</h1>
            <p className="text-gray-600 text-sm md:text-base">Overview of your band program status and key metrics</p>
          </div>
          
          {/* Key Metrics - Mobile-First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <WidgetCard title="System Status" status={bandStats.systemStatus}>
              <div className="text-sm">{bandStats.systemMessage}</div>
            </WidgetCard>
            <WidgetCard title="Total Equipment">
              <div className="text-2xl md:text-3xl font-semibold">{bandStats.totalEquipment}</div>
            </WidgetCard>
            <WidgetCard title="Active Students">
              <div className="text-2xl md:text-3xl font-semibold">{bandStats.activeStudents}</div>
            </WidgetCard>
            <WidgetCard title="Upcoming Events">
              <div className="text-2xl md:text-3xl font-semibold">{bandStats.upcomingEvents}</div>
            </WidgetCard>
          </div>
          
          {/* Detailed Analytics - Mobile-Friendly */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <WidgetCard title="Equipment Utilization" status={(bandStats.utilizationRate > 80 ? 'yellow' : 'green') as 'green' | 'yellow' | 'red'}>
              <ChartStub label="Utilization" value={bandStats.utilizationRate} />
            </WidgetCard>
            <WidgetCard title="Available Equipment">
              <ChartStub label="Available" value={bandStats.availableEquipment} max={bandStats.totalEquipment} />
            </WidgetCard>
            <WidgetCard title="Maintenance Compliance">
              <ChartStub label="Compliance" value={bandStats.maintenanceCompliance} />
            </WidgetCard>
            <WidgetCard title="Equipment Status">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="text-green-600 font-medium">{bandStats.availableEquipment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checked Out:</span>
                  <span className="text-yellow-600 font-medium">{bandStats.checkedOutEquipment}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance:</span>
                  <span className="text-red-600 font-medium">{bandStats.maintenanceEquipment}</span>
                </div>
              </div>
            </WidgetCard>
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}
