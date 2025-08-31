"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";
import { apiGet } from "@/lib/api";
import { DashboardWidget, MetricWidget, StatusBadge, ProgressBar } from "./DashboardWidget";
import { BarChart, DonutChart, LineChart, StatCard } from "./SimpleChart";

interface EquipmentManagerDashboardData {
  inventoryStatus: {
    totalEquipment: number;
    availableEquipment: number;
    checkedOutEquipment: number;
    inMaintenanceEquipment: number;
    retiredEquipment: number;
    totalValue: number;
    categoryBreakdown: Record<string, {
      category: string;
      total: number;
      available: number;
      checkedOut: number;
      maintenance: number;
      retired: number;
      totalValue: number;
      averageConditionScore: number;
    }>;
  };
  maintenanceSchedule: Array<{
    maintenanceId: string;
    equipmentId: string;
    equipmentName: string;
    qrCode: string;
    maintenanceType: string;
    scheduledDate: string;
    status: string;
    priority: string;
    serviceProvider: string;
    estimatedCost: number;
    isOverdue: boolean;
  }>;
  equipmentAnalytics: {
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    byCondition: Record<string, number>;
    utilizationRate: number;
    maintenanceRate: number;
    utilizationTrend: Array<{ date: string; value: number; label: string }>;
    categoryBreakdown: Array<{
      category: string;
      total: number;
      available: number;
      inUse: number;
      maintenance: number;
      utilizationRate: number;
      averageAge: number;
    }>;
  };
  assignmentTracking: Array<{
    assignmentId: string;
    studentName: string;
    equipmentName: string;
    qrCode: string;
    assignmentDate: string;
    expectedReturnDate: string;
    status: string;
    isOverdue: boolean;
    daysSinceAssignment: number;
  }>;
  conditionAlerts: Array<{
    equipmentId: string;
    equipmentName: string;
    qrCode: string;
    currentCondition: string;
    previousCondition: string;
    lastInspectionDate: string;
    alertLevel: "warning" | "critical";
    recommendedAction: string;
  }>;
  utilizationMetrics: Array<{
    category: string;
    totalEquipment: number;
    inUseEquipment: number;
    utilizationRate: number;
    averageUsageDays: number;
    trend: Array<{ date: string; value: number; label: string }>;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    status: string;
    metadata: Record<string, any>;
  }>;
}

export function EquipmentManagerDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [data, setData] = useState<EquipmentManagerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"overview" | "inventory" | "maintenance" | "assignments" | "analytics">("overview");

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiGet<EquipmentManagerDashboardData>(
          "/dashboard/equipment-manager",
          token
        );
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch equipment manager dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return <EquipmentManagerDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Icon icon="material-symbols:error-outline" className="text-red-500 mb-4" width={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Equipment Manager Dashboard Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load the equipment manager dashboard at this time."}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  // Prepare chart data
  const inventoryStatusData = [
    { label: "Available", value: data.inventoryStatus.availableEquipment, color: "bg-success" },
    { label: "Checked Out", value: data.inventoryStatus.checkedOutEquipment, color: "bg-warning" },
    { label: "Maintenance", value: data.inventoryStatus.inMaintenanceEquipment, color: "bg-error" },
    { label: "Retired", value: data.inventoryStatus.retiredEquipment, color: "bg-gray-500" }
  ];

  const conditionData = Object.entries(data.equipmentAnalytics.byCondition).map(([condition, count]) => ({
    label: condition.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: condition.includes('EXCELLENT') ? 'bg-success' :
           condition.includes('GOOD') ? 'bg-info' :
           condition.includes('FAIR') ? 'bg-warning' :
           condition.includes('POOR') ? 'bg-error' : 'bg-gray-500'
  }));

  const utilizationTrendData = data.equipmentAnalytics.utilizationTrend.map(point => ({
    label: point.label,
    value: point.value
  }));

  const views = [
    { id: "overview", label: "Overview", icon: "material-symbols:dashboard" },
    { id: "inventory", label: "Inventory", icon: "material-symbols:inventory-2" },
    { id: "maintenance", label: "Maintenance", icon: "material-symbols:build" },
    { id: "assignments", label: "Assignments", icon: "material-symbols:assignment" },
    { id: "analytics", label: "Analytics", icon: "material-symbols:analytics" }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-responsive-xl font-semibold text-gray-900 dark:text-gray-100">
            Equipment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Inventory, maintenance, and utilization tracking
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Inventory Value</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">
              {formatCurrency(data.inventoryStatus.totalValue)}
            </p>
          </div>
          <button className="btn-primary">
            <Icon icon="material-symbols:add" width={16} />
            Add Equipment
          </button>
        </div>
      </div>

      {/* View Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              selectedView === view.id
                ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-b-2 border-teal-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Icon icon={view.icon} width={16} />
            {view.label}
          </button>
        ))}
      </div>

      {/* View Content */}
      {selectedView === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Equipment"
              value={data.inventoryStatus.totalEquipment}
              icon="material-symbols:inventory-2"
              color="text-teal-500"
            />
            <StatCard
              title="Available"
              value={data.inventoryStatus.availableEquipment}
              icon="material-symbols:check-circle"
              color="text-success"
            />
            <StatCard
              title="In Use"
              value={data.inventoryStatus.checkedOutEquipment}
              icon="material-symbols:assignment-returned"
              color="text-warning"
            />
            <StatCard
              title="Maintenance"
              value={data.inventoryStatus.inMaintenanceEquipment}
              icon="material-symbols:build"
              color="text-error"
            />
            <StatCard
              title="Utilization Rate"
              value={`${(data.equipmentAnalytics.utilizationRate * 100).toFixed(1)}%`}
              icon="material-symbols:trending-up"
              color="text-info"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Inventory Status"
              icon="material-symbols:pie-chart"
              iconColor="text-teal-500"
              variant="glass"
            >
              <DonutChart
                data={inventoryStatusData}
                size={180}
                showLegend={true}
                centerText={data.inventoryStatus.totalEquipment.toString()}
                centerSubtext="Total Items"
              />
            </DashboardWidget>

            <DashboardWidget
              title="Equipment Condition"
              icon="material-symbols:health-and-safety"
              iconColor="text-teal-500"
              variant="glass"
            >
              <BarChart
                data={conditionData}
                height="h-48"
                showValues={true}
              />
            </DashboardWidget>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Condition Alerts"
              icon="material-symbols:warning"
              iconColor="text-warning"
              variant="glass"
            >
              {data.conditionAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <Icon icon="material-symbols:check-circle" className="text-success mb-2" width={32} />
                  <p className="text-success">All equipment in good condition!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.conditionAlerts.slice(0, 5).map((alert) => (
                    <div key={alert.equipmentId} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <Icon 
                        icon="material-symbols:warning" 
                        className={alert.alertLevel === "critical" ? "text-error" : "text-warning"}
                        width={20}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {alert.equipmentName}
                          </h4>
                          <StatusBadge status={alert.alertLevel} variant="maintenance" size="sm" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {alert.qrCode} • {alert.currentCondition} (was {alert.previousCondition})
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                          {alert.recommendedAction}
                        </p>
                      </div>
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:edit" width={14} />
                        Action
                      </button>
                    </div>
                  ))}
                  {data.conditionAlerts.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{data.conditionAlerts.length - 5} more alerts
                    </p>
                  )}
                </div>
              )}
            </DashboardWidget>

            <DashboardWidget
              title="Maintenance Due Soon"
              icon="material-symbols:schedule"
              iconColor="text-warning"
              variant="glass"
            >
              <div className="space-y-3">
                {data.maintenanceSchedule.filter(m => !m.isOverdue).slice(0, 5).map((item) => (
                  <div key={item.maintenanceId} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {item.equipmentName}
                        </h4>
                        <StatusBadge status={item.priority} variant="maintenance" size="sm" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.maintenanceType} • {formatDate(item.scheduledDate)}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {item.serviceProvider} • {formatCurrency(item.estimatedCost)}
                      </p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <Icon icon="material-symbols:schedule" width={14} />
                      Schedule
                    </button>
                  </div>
                ))}
              </div>
            </DashboardWidget>
          </div>
        </div>
      )}

      {selectedView === "inventory" && (
        <div className="space-y-6">
          {/* Inventory Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Total Value"
              value={formatCurrency(data.inventoryStatus.totalValue)}
              icon="material-symbols:attach-money"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="Available Items"
              value={data.inventoryStatus.availableEquipment}
              subtitle={`${((data.inventoryStatus.availableEquipment / data.inventoryStatus.totalEquipment) * 100).toFixed(1)}% of total`}
              icon="material-symbols:check-circle"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="Checked Out"
              value={data.inventoryStatus.checkedOutEquipment}
              subtitle={`${((data.inventoryStatus.checkedOutEquipment / data.inventoryStatus.totalEquipment) * 100).toFixed(1)}% of total`}
              icon="material-symbols:assignment-returned"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Retired/Lost"
              value={data.inventoryStatus.retiredEquipment}
              icon="material-symbols:delete"
              iconColor="text-gray-500"
              variant="glass"
            />
          </div>

          {/* Category Breakdown */}
          <DashboardWidget
            title="Inventory by Category"
            icon="material-symbols:category"
            iconColor="text-teal-500"
            variant="glass"
          >
            <div className="space-y-4">
              {Object.values(data.inventoryStatus.categoryBreakdown).map((category) => (
                <div key={category.category} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {category.category.toLowerCase()}
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(category.totalValue)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{category.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Available</p>
                      <p className="font-medium text-success">{category.available}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Checked Out</p>
                      <p className="font-medium text-warning">{category.checkedOut}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Maintenance</p>
                      <p className="font-medium text-error">{category.maintenance}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Condition</p>
                      <p className="font-medium text-info">{category.averageConditionScore.toFixed(1)}/5.0</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <ProgressBar
                      value={category.checkedOut}
                      max={category.total}
                      label="Utilization"
                      color="warning"
                      showValue={true}
                    />
                    <ProgressBar
                      value={category.available}
                      max={category.total}
                      label="Available"
                      color="success"
                      showValue={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedView === "maintenance" && (
        <div className="space-y-6">
          {/* Maintenance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Scheduled"
              value={data.maintenanceSchedule.filter(m => m.status === "SCHEDULED").length}
              icon="material-symbols:schedule"
              iconColor="text-info"
              variant="glass"
            />
            <MetricWidget
              title="Overdue"
              value={data.maintenanceSchedule.filter(m => m.isOverdue).length}
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="In Progress"
              value={data.maintenanceSchedule.filter(m => m.status === "IN_PROGRESS").length}
              icon="material-symbols:build"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Estimated Cost"
              value={formatCurrency(data.maintenanceSchedule.reduce((sum, m) => sum + (m.estimatedCost || 0), 0))}
              icon="material-symbols:attach-money"
              iconColor="text-success"
              variant="glass"
            />
          </div>

          {/* Maintenance Schedule */}
          <DashboardWidget
            title="Maintenance Schedule"
            icon="material-symbols:calendar-month"
            iconColor="text-warning"
            variant="glass"
            actions={
              <button className="btn-primary">
                <Icon icon="material-symbols:add" width={16} />
                Schedule Maintenance
              </button>
            }
          >
            <div className="space-y-3">
              {data.maintenanceSchedule.map((item) => (
                <div key={item.maintenanceId} className={`card p-4 ${item.isOverdue ? 'border-l-4 border-red-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {item.equipmentName}
                        </h4>
                        <StatusBadge status={item.status} variant="maintenance" size="sm" />
                        <StatusBadge status={item.priority} variant="maintenance" size="sm" />
                        {item.isOverdue && (
                          <StatusBadge status="overdue" variant="maintenance" size="sm" />
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{item.maintenanceType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Scheduled</p>
                          <p className="font-medium">{formatDate(item.scheduledDate)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Service Provider</p>
                          <p className="font-medium">{item.serviceProvider || "Internal"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>QR: {item.qrCode}</span>
                        <span>Cost: {formatCurrency(item.estimatedCost)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:edit" width={16} />
                        Edit
                      </button>
                      <button className="btn-primary btn-sm">
                        <Icon icon="material-symbols:check" width={16} />
                        Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedView === "assignments" && (
        <div className="space-y-6">
          {/* Assignment Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Active Assignments"
              value={data.assignmentTracking.filter(a => a.status === "CHECKED_OUT").length}
              icon="material-symbols:assignment"
              iconColor="text-info"
              variant="glass"
            />
            <MetricWidget
              title="Overdue Returns"
              value={data.assignmentTracking.filter(a => a.isOverdue).length}
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="Due This Week"
              value={data.assignmentTracking.filter(a => {
                const dueDate = new Date(a.expectedReturnDate);
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return dueDate <= weekFromNow && !a.isOverdue;
              }).length}
              icon="material-symbols:schedule"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Avg Assignment Days"
              value={Math.round(data.assignmentTracking.reduce((sum, a) => sum + a.daysSinceAssignment, 0) / data.assignmentTracking.length)}
              icon="material-symbols:hourglass-empty"
              iconColor="text-teal-500"
              variant="glass"
            />
          </div>

          {/* Assignment Tracking */}
          <DashboardWidget
            title="Assignment Tracking"
            icon="material-symbols:assignment"
            iconColor="text-info"
            variant="glass"
          >
            <div className="space-y-3">
              {data.assignmentTracking.map((assignment) => (
                <div key={assignment.assignmentId} className={`card p-4 ${assignment.isOverdue ? 'border-l-4 border-red-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {assignment.studentName}
                        </h4>
                        <StatusBadge status={assignment.status} variant="assignment" size="sm" />
                        {assignment.isOverdue && (
                          <StatusBadge status="overdue" variant="assignment" size="sm" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {assignment.equipmentName} ({assignment.qrCode})
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Assigned: {formatDate(assignment.assignmentDate)}</span>
                        <span>Due: {formatDate(assignment.expectedReturnDate)}</span>
                        <span>{assignment.daysSinceAssignment} days active</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:message" width={16} />
                        Contact
                      </button>
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:assignment-returned" width={16} />
                        Return
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedView === "analytics" && (
        <div className="space-y-6">
          {/* Utilization Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Utilization Trend"
              icon="material-symbols:trending-up"
              iconColor="text-teal-500"
              variant="glass"
            >
              <LineChart
                data={utilizationTrendData}
                height="h-48"
                color="#14b8a6"
                showPoints={true}
              />
            </DashboardWidget>

            <DashboardWidget
              title="Category Performance"
              icon="material-symbols:category"
              iconColor="text-teal-500"
              variant="glass"
            >
              <div className="space-y-4">
                {data.utilizationMetrics.map((metric) => (
                  <div key={metric.category} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm capitalize">
                        {metric.category.toLowerCase()}
                      </h4>
                      <span className="text-sm font-medium text-teal-600">
                        {(metric.utilizationRate * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{metric.inUseEquipment}/{metric.totalEquipment} in use</span>
                      <span>Avg: {metric.averageUsageDays.toFixed(1)} days</span>
                    </div>
                    <ProgressBar
                      value={metric.inUseEquipment}
                      max={metric.totalEquipment}
                      color="teal"
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </DashboardWidget>
          </div>

          {/* Detailed Analytics */}
          <DashboardWidget
            title="Equipment Analytics Summary"
            icon="material-symbols:analytics"
            iconColor="text-purple-500"
            variant="glass"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Icon icon="material-symbols:trending-up" className="text-success mb-2 mx-auto" width={32} />
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Utilization Rate</h4>
                <p className="text-2xl font-bold text-success">
                  {(data.equipmentAnalytics.utilizationRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">of total inventory</p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Icon icon="material-symbols:build" className="text-warning mb-2 mx-auto" width={32} />
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Maintenance Rate</h4>
                <p className="text-2xl font-bold text-warning">
                  {(data.equipmentAnalytics.maintenanceRate * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">requires maintenance</p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Icon icon="material-symbols:inventory-2" className="text-info mb-2 mx-auto" width={32} />
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Inventory Health</h4>
                <p className="text-2xl font-bold text-info">
                  {(((data.inventoryStatus.totalEquipment - data.inventoryStatus.retiredEquipment) / data.inventoryStatus.totalEquipment) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">equipment active</p>
              </div>
            </div>
          </DashboardWidget>
        </div>
      )}
    </div>
  );
}

function EquipmentManagerDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}