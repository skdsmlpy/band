"use client";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";
import RequireAuth from "@/components/auth/RequireAuth";
import { AppShell } from "@/components/shell/AppShell";
import { StudentDashboard } from "@/components/dashboard/StudentDashboard";
import { DirectorDashboard } from "@/components/dashboard/DirectorDashboard";
import { EquipmentManagerDashboard } from "@/components/dashboard/EquipmentManagerDashboard";
import { SupervisorDashboard } from "@/components/dashboard/SupervisorDashboard";

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);

  // Function to determine which dashboard to render based on user role
  const renderDashboard = () => {
    if (!user?.role) {
      return <DefaultDashboard />;
    }

    const role = user.role.toLowerCase();
    
    switch (role) {
      case "student":
        return <StudentDashboard />;
      case "band director":
      case "band_director":
        return <DirectorDashboard />;
      case "equipment manager":
      case "equipment_manager":
        return <EquipmentManagerDashboard />;
      case "supervisor":
        return <SupervisorDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <RequireAuth>
      <AppShell>
        <div className="min-h-screen">
          {renderDashboard()}
        </div>
      </AppShell>
    </RequireAuth>
  );
}

// Default dashboard for unknown/unassigned roles
function DefaultDashboard() {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Icon icon="material-symbols:dashboard" className="text-gray-400 mb-4" width={64} />
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Welcome{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {user?.role 
            ? `Your role (${user.role}) doesn't have a specific dashboard configured yet.`
            : "Your dashboard is being prepared..."
          }
        </p>
        
        <div className="max-w-md mx-auto">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Available Actions
            </h2>
            <div className="space-y-3">
              <a className="btn-primary block text-center" href="/queues">
                <Icon icon="material-symbols:assignment" width={20} className="inline mr-2" />
                View Queues
              </a>
              <a className="btn-primary block text-center" href="/tasks">
                <Icon icon="material-symbols:task" width={20} className="inline mr-2" />
                View Tasks
              </a>
              <a className="btn-primary block text-center" href="/workflows">
                <Icon icon="material-symbols:account-tree" width={20} className="inline mr-2" />
                Start Workflow
              </a>
              <a className="btn-primary block text-center" href="/equipment">
                <Icon icon="material-symbols:music-note" width={20} className="inline mr-2" />
                Manage Equipment
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
