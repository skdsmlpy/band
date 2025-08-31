"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";
import { apiGet } from "@/lib/api";
import { DashboardWidget, MetricWidget, StatusBadge, ProgressBar } from "./DashboardWidget";
import { BarChart, DonutChart, LineChart, StatCard } from "./SimpleChart";

interface DirectorDashboardData {
  systemOverview: {
    totalStudents: number;
    activeStudents: number;
    totalEquipment: number;
    availableEquipment: number;
    checkedOutEquipment: number;
    maintenanceEquipment: number;
    upcomingEvents: number;
    pendingReturns: number;
    systemHealthScore: number;
  };
  studentSummaries: Array<{
    id: string;
    name: string;
    bandSection: string;
    activeAssignments: number;
    overdueItems: number;
    academicStanding: string;
    lastActivity: string;
    hasAlerts: boolean;
  }>;
  eventManagement: Array<{
    id: string;
    name: string;
    eventType: string;
    eventDate: string;
    venue: string;
    status: string;
    requiresEquipment: boolean;
    equipmentRequirements: Record<string, number>;
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
  maintenanceAlerts: Array<{
    equipmentId: string;
    equipmentName: string;
    qrCode: string;
    alertType: "overdue" | "upcoming" | "urgent";
    scheduledDate: string;
    daysOverdue: number;
    priority: string;
    maintenanceType: string;
  }>;
  performanceMetrics: Array<{
    metricName: string;
    currentValue: number;
    targetValue: number;
    percentageChange: number;
    trend: "up" | "down" | "stable";
    period: string;
    history: Array<{ date: string; value: number; label: string }>;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    status: string;
    metadata: Record<string, any>;
  }>;
}

export function DirectorDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [data, setData] = useState<DirectorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<"overview" | "students" | "events" | "equipment" | "maintenance">("overview");

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiGet<DirectorDashboardData>(
          "/dashboard/director",
          token
        );
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch director dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return <DirectorDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Icon icon="material-symbols:error-outline" className="text-red-500 mb-4" width={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Director Dashboard Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load the director dashboard at this time."}
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  // Prepare chart data
  const equipmentStatusData = Object.entries(data.equipmentAnalytics.byStatus).map(([status, count]) => ({
    label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: status.includes('AVAILABLE') ? 'bg-success' :
           status.includes('CHECKED') ? 'bg-warning' :
           status.includes('MAINTENANCE') ? 'bg-error' : 'bg-gray-500'
  }));

  const equipmentCategoryData = Object.entries(data.equipmentAnalytics.byCategory).map(([category, count]) => ({
    label: category.charAt(0) + category.slice(1).toLowerCase(),
    value: count
  }));

  const utilizationTrendData = data.equipmentAnalytics.utilizationTrend.map(point => ({
    label: point.label,
    value: point.value
  }));

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-error";
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "material-symbols:dashboard" },
    { id: "students", label: "Students", icon: "material-symbols:group" },
    { id: "events", label: "Events", icon: "material-symbols:event" },
    { id: "equipment", label: "Equipment", icon: "material-symbols:inventory-2" },
    { id: "maintenance", label: "Maintenance", icon: "material-symbols:build" }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-responsive-xl font-semibold text-gray-900 dark:text-gray-100">
            Band Director Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            System overview and management tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
            <p className={`text-lg font-bold ${getHealthScoreColor(data.systemOverview.systemHealthScore)}`}>
              {data.systemOverview.systemHealthScore.toFixed(1)}%
            </p>
          </div>
          <Icon 
            icon="material-symbols:health-and-safety" 
            className={getHealthScoreColor(data.systemOverview.systemHealthScore)} 
            width={32} 
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              selectedTab === tab.id
                ? "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-b-2 border-teal-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            <Icon icon={tab.icon} width={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Students"
              value={data.systemOverview.totalStudents}
              icon="material-symbols:group"
              color="text-info"
              change={{
                value: 5,
                type: "increase",
                period: "last month"
              }}
            />
            <StatCard
              title="Available Equipment"
              value={data.systemOverview.availableEquipment}
              icon="material-symbols:inventory-2"
              color="text-success"
            />
            <StatCard
              title="Checked Out"
              value={data.systemOverview.checkedOutEquipment}
              icon="material-symbols:assignment-returned"
              color="text-warning"
            />
            <StatCard
              title="Upcoming Events"
              value={data.systemOverview.upcomingEvents}
              icon="material-symbols:event"
              color="text-purple-500"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Equipment Status Distribution"
              icon="material-symbols:pie-chart"
              iconColor="text-teal-500"
              variant="glass"
            >
              <DonutChart
                data={equipmentStatusData}
                size={160}
                showLegend={true}
                centerText={data.systemOverview.totalEquipment.toString()}
                centerSubtext="Total Items"
              />
            </DashboardWidget>

            <DashboardWidget
              title="Equipment by Category"
              icon="material-symbols:bar-chart"
              iconColor="text-teal-500"
              variant="glass"
            >
              <BarChart
                data={equipmentCategoryData}
                height="h-48"
                showValues={true}
              />
            </DashboardWidget>
          </div>

          {/* Utilization Trend */}
          <DashboardWidget
            title="Equipment Utilization Trend"
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
        </div>
      )}

      {selectedTab === "students" && (
        <div className="space-y-6">
          {/* Student Performance Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricWidget
              title="Active Students"
              value={data.systemOverview.activeStudents}
              icon="material-symbols:school"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="Students with Overdue Items"
              value={data.studentSummaries.filter(s => s.overdueItems > 0).length}
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="Students with Alerts"
              value={data.studentSummaries.filter(s => s.hasAlerts).length}
              icon="material-symbols:notifications-active"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Average Assignments"
              value={(data.studentSummaries.reduce((sum, s) => sum + s.activeAssignments, 0) / data.studentSummaries.length).toFixed(1)}
              icon="material-symbols:assignment"
              iconColor="text-info"
              variant="glass"
            />
          </div>

          {/* Student List */}
          <DashboardWidget
            title="Student Management"
            icon="material-symbols:group"
            iconColor="text-info"
            variant="glass"
            actions={
              <button className="btn-secondary">
                <Icon icon="material-symbols:add" width={16} />
                Add Student
              </button>
            }
          >
            <div className="space-y-3">
              {data.studentSummaries.map((student) => (
                <div key={student.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {student.name}
                        </h4>
                        <StatusBadge status={student.bandSection} variant="equipment" size="sm" />
                        <StatusBadge status={student.academicStanding} variant="assignment" size="sm" />
                        {student.hasAlerts && (
                          <Icon icon="material-symbols:warning" className="text-warning" width={16} />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Active: {student.activeAssignments} items</span>
                        <span>Overdue: {student.overdueItems} items</span>
                        <span>Last activity: {formatDate(student.lastActivity)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:visibility" width={16} />
                        View
                      </button>
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:edit" width={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedTab === "events" && (
        <div className="space-y-6">
          {/* Event Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricWidget
              title="Upcoming Events"
              value={data.systemOverview.upcomingEvents}
              icon="material-symbols:event"
              iconColor="text-info"
              variant="glass"
            />
            <MetricWidget
              title="This Month"
              value={data.eventManagement.filter(e => new Date(e.eventDate).getMonth() === new Date().getMonth()).length}
              icon="material-symbols:calendar-month"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Requiring Equipment"
              value={data.eventManagement.filter(e => e.requiresEquipment).length}
              icon="material-symbols:inventory-2"
              iconColor="text-teal-500"
              variant="glass"
            />
          </div>

          {/* Event Management */}
          <DashboardWidget
            title="Event Management"
            icon="material-symbols:event"
            iconColor="text-info"
            variant="glass"
            actions={
              <button className="btn-primary">
                <Icon icon="material-symbols:add" width={16} />
                Create Event
              </button>
            }
          >
            <div className="space-y-3">
              {data.eventManagement.map((event) => (
                <div key={event.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {event.name}
                        </h4>
                        <StatusBadge status={event.eventType} variant="event" size="sm" />
                        <StatusBadge status={event.status} variant="event" size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {event.venue} • {formatDateTime(event.eventDate)}
                      </p>
                      {event.requiresEquipment && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Icon icon="material-symbols:inventory-2" width={16} />
                          <span>Equipment Required:</span>
                          {Object.entries(event.equipmentRequirements).map(([type, count]) => (
                            <span key={type} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                              {type}: {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:edit" width={16} />
                        Edit
                      </button>
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:group" width={16} />
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedTab === "equipment" && (
        <div className="space-y-6">
          {/* Equipment Analytics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Total Equipment"
              value={data.systemOverview.totalEquipment}
              icon="material-symbols:inventory-2"
              iconColor="text-teal-500"
              variant="glass"
            />
            <MetricWidget
              title="Utilization Rate"
              value={`${(data.equipmentAnalytics.utilizationRate * 100).toFixed(1)}%`}
              icon="material-symbols:trending-up"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="In Maintenance"
              value={data.systemOverview.maintenanceEquipment}
              icon="material-symbols:build"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Pending Returns"
              value={data.systemOverview.pendingReturns}
              icon="material-symbols:assignment-returned"
              iconColor="text-info"
              variant="glass"
            />
          </div>

          {/* Category Breakdown */}
          <DashboardWidget
            title="Equipment Category Breakdown"
            icon="material-symbols:category"
            iconColor="text-teal-500"
            variant="glass"
          >
            <div className="space-y-4">
              {data.equipmentAnalytics.categoryBreakdown.map((category) => (
                <div key={category.category} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                      {category.category.toLowerCase()}
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {category.total} total items
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <p className="text-gray-500">Available</p>
                      <p className="font-medium text-success">{category.available}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">In Use</p>
                      <p className="font-medium text-warning">{category.inUse}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Maintenance</p>
                      <p className="font-medium text-error">{category.maintenance}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Utilization</p>
                      <p className="font-medium text-info">{(category.utilizationRate * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <ProgressBar
                    value={category.inUse}
                    max={category.total}
                    label={`Usage: ${category.inUse}/${category.total}`}
                    color="warning"
                    showValue={false}
                  />
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedTab === "maintenance" && (
        <div className="space-y-6">
          {/* Maintenance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricWidget
              title="Overdue Maintenance"
              value={data.maintenanceAlerts.filter(a => a.alertType === "overdue").length}
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="Due Soon"
              value={data.maintenanceAlerts.filter(a => a.alertType === "upcoming").length}
              icon="material-symbols:schedule"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Urgent Items"
              value={data.maintenanceAlerts.filter(a => a.alertType === "urgent").length}
              icon="material-symbols:priority-high"
              iconColor="text-error"
              variant="glass"
            />
          </div>

          {/* Maintenance Alerts */}
          <DashboardWidget
            title="Maintenance Alerts"
            icon="material-symbols:build"
            iconColor="text-warning"
            variant="glass"
          >
            <div className="space-y-3">
              {data.maintenanceAlerts.map((alert) => (
                <div key={alert.equipmentId} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {alert.equipmentName}
                        </h4>
                        <StatusBadge status={alert.alertType} variant="maintenance" size="sm" />
                        <StatusBadge status={alert.priority} variant="maintenance" size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        QR: {alert.qrCode} • Type: {alert.maintenanceType}
                      </p>
                      <p className="text-sm">
                        {alert.alertType === "overdue" ? (
                          <span className="text-error">
                            {alert.daysOverdue} days overdue
                          </span>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400">
                            Scheduled: {formatDate(alert.scheduledDate)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:schedule" width={16} />
                        Reschedule
                      </button>
                      <button className="btn-primary btn-sm">
                        <Icon icon="material-symbols:build" width={16} />
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

      {/* Performance Metrics (always visible) */}
      <DashboardWidget
        title="Performance Metrics"
        icon="material-symbols:analytics"
        iconColor="text-purple-500"
        variant="glass"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.performanceMetrics.map((metric) => (
            <div key={metric.metricName} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {metric.metricName}
                </h4>
                <Icon
                  icon={
                    metric.trend === "up" ? "material-symbols:trending-up" :
                    metric.trend === "down" ? "material-symbols:trending-down" :
                    "material-symbols:trending-flat"
                  }
                  className={
                    metric.trend === "up" ? "text-success" :
                    metric.trend === "down" ? "text-error" :
                    "text-gray-500"
                  }
                  width={20}
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {metric.currentValue}
                </span>
                <span className="text-sm text-gray-500">
                  Target: {metric.targetValue}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className={
                  metric.percentageChange > 0 ? "text-success" :
                  metric.percentageChange < 0 ? "text-error" :
                  "text-gray-500"
                }>
                  {metric.percentageChange > 0 ? "+" : ""}{metric.percentageChange.toFixed(1)}%
                </span>
                <span className="text-gray-500">vs {metric.period}</span>
              </div>
              <ProgressBar
                value={metric.currentValue}
                max={metric.targetValue}
                color={metric.currentValue >= metric.targetValue ? "success" : "warning"}
                size="sm"
              />
            </div>
          ))}
        </div>
      </DashboardWidget>
    </div>
  );
}

function DirectorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>

      {/* Tab skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts skeleton */}
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