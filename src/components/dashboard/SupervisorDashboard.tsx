"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";
import { apiGet } from "@/lib/api";
import { DashboardWidget, MetricWidget, StatusBadge, ProgressBar } from "./DashboardWidget";
import { BarChart, DonutChart, LineChart, StatCard } from "./SimpleChart";

interface SupervisorDashboardData {
  systemHealth: {
    overallScore: number;
    components: Record<string, {
      componentName: string;
      status: "healthy" | "warning" | "critical";
      healthScore: number;
      lastChecked: string;
      issues: string[];
    }>;
    activeIssues: Array<{
      issueType: string;
      severity: "low" | "medium" | "high" | "critical";
      description: string;
      detectedAt: string;
      affectedComponent: string;
    }>;
    performance: {
      responseTime: number;
      uptime: number;
      activeConnections: number;
      memoryUsage: number;
      cpuUsage: number;
    };
  };
  approvalQueue: Array<{
    itemId: string;
    itemType: "equipment_checkout" | "maintenance_request" | "event_approval";
    title: string;
    description: string;
    requesterName: string;
    submittedDate: string;
    priority: "low" | "medium" | "high" | "urgent";
    status: string;
    details: Record<string, any>;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    userName: string;
    userRole: string;
    timestamp: string;
    description: string;
    changes: Record<string, any>;
    ipAddress: string;
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
  riskIndicators: Array<{
    riskType: string;
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    probability: number;
    impact: string;
    mitigationActions: string[];
    identifiedDate: string;
  }>;
  complianceStatus: Array<{
    complianceArea: string;
    status: "compliant" | "warning" | "non_compliant";
    complianceScore: number;
    lastAssessment: string;
    requirements: string[];
    issues: string[];
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    status: string;
    metadata: Record<string, any>;
  }>;
}

export function SupervisorDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [data, setData] = useState<SupervisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"overview" | "approvals" | "audit" | "performance" | "risks" | "compliance">("overview");

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await apiGet<SupervisorDashboardData>(
          "/dashboard/supervisor",
          token
        );
        setData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch supervisor dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return <SupervisorDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Icon icon="material-symbols:error-outline" className="text-red-500 mb-4" width={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Supervisor Dashboard Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load the supervisor dashboard at this time."}
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

  const getHealthColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-error";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical": return "text-error";
      case "high": return "text-error";
      case "medium": return "text-warning";
      case "low": return "text-success";
      default: return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "healthy": return "text-success";
      case "compliant": return "text-success";
      case "warning": return "text-warning";
      case "critical": return "text-error";
      case "non_compliant": return "text-error";
      default: return "text-gray-500";
    }
  };

  // Prepare chart data
  const systemHealthData = Object.values(data.systemHealth.components).map(component => ({
    label: component.componentName,
    value: component.healthScore,
    color: component.healthScore >= 90 ? 'bg-success' :
           component.healthScore >= 70 ? 'bg-warning' : 'bg-error'
  }));

  const approvalTypeData = data.approvalQueue.reduce((acc, approval) => {
    const type = approval.itemType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const approvalChartData = Object.entries(approvalTypeData).map(([type, count]) => ({
    label: type,
    value: count
  }));

  const riskSeverityData = data.riskIndicators.reduce((acc, risk) => {
    acc[risk.severity] = (acc[risk.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskChartData = Object.entries(riskSeverityData).map(([severity, count]) => ({
    label: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count,
    color: severity === 'critical' ? 'bg-error' :
           severity === 'high' ? 'bg-error' :
           severity === 'medium' ? 'bg-warning' : 'bg-success'
  }));

  const views = [
    { id: "overview", label: "Overview", icon: "material-symbols:dashboard" },
    { id: "approvals", label: "Approvals", icon: "material-symbols:approval" },
    { id: "audit", label: "Audit Logs", icon: "material-symbols:history" },
    { id: "performance", label: "Performance", icon: "material-symbols:analytics" },
    { id: "risks", label: "Risk Management", icon: "material-symbols:warning" },
    { id: "compliance", label: "Compliance", icon: "material-symbols:verified" }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-responsive-xl font-semibold text-gray-900 dark:text-gray-100">
            Supervisor Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            System oversight, approvals, and compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">System Health</p>
            <div className="flex items-center gap-2">
              <p className={`text-lg font-bold ${getHealthColor(data.systemHealth.overallScore)}`}>
                {data.systemHealth.overallScore.toFixed(1)}%
              </p>
              <Icon 
                icon="material-symbols:health-and-safety" 
                className={getHealthColor(data.systemHealth.overallScore)} 
                width={24} 
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Uptime</p>
            <p className="text-lg font-bold text-success">
              {data.systemHealth.performance.uptime.toFixed(2)}%
            </p>
          </div>
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
            {view.id === "approvals" && data.approvalQueue.length > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                {data.approvalQueue.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* View Content */}
      {selectedView === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="System Health"
              value={`${data.systemHealth.overallScore.toFixed(1)}%`}
              icon="material-symbols:health-and-safety"
              color={getHealthColor(data.systemHealth.overallScore)}
            />
            <StatCard
              title="Pending Approvals"
              value={data.approvalQueue.length}
              icon="material-symbols:approval"
              color="text-warning"
            />
            <StatCard
              title="Active Issues"
              value={data.systemHealth.activeIssues.length}
              icon="material-symbols:warning"
              color="text-error"
            />
            <StatCard
              title="Critical Risks"
              value={data.riskIndicators.filter(r => r.severity === "critical").length}
              icon="material-symbols:priority-high"
              color="text-error"
            />
          </div>

          {/* System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Component Health"
              icon="material-symbols:monitoring"
              iconColor="text-teal-500"
              variant="glass"
            >
              <BarChart
                data={systemHealthData}
                height="h-48"
                showValues={true}
              />
            </DashboardWidget>

            <DashboardWidget
              title="System Performance"
              icon="material-symbols:speed"
              iconColor="text-teal-500"
              variant="glass"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {data.systemHealth.performance.responseTime}ms
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {data.systemHealth.performance.activeConnections}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Connections</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <ProgressBar
                    value={data.systemHealth.performance.cpuUsage}
                    max={100}
                    label="CPU Usage"
                    color={data.systemHealth.performance.cpuUsage > 80 ? "error" : data.systemHealth.performance.cpuUsage > 60 ? "warning" : "success"}
                    showValue={true}
                  />
                  <ProgressBar
                    value={data.systemHealth.performance.memoryUsage}
                    max={100}
                    label="Memory Usage"
                    color={data.systemHealth.performance.memoryUsage > 80 ? "error" : data.systemHealth.performance.memoryUsage > 60 ? "warning" : "success"}
                    showValue={true}
                  />
                  <ProgressBar
                    value={data.systemHealth.performance.uptime}
                    max={100}
                    label="System Uptime"
                    color="success"
                    showValue={true}
                  />
                </div>
              </div>
            </DashboardWidget>
          </div>

          {/* Active Issues and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Active Issues"
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            >
              {data.systemHealth.activeIssues.length === 0 ? (
                <div className="text-center py-8">
                  <Icon icon="material-symbols:check-circle" className="text-success mb-2" width={32} />
                  <p className="text-success">No active system issues!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.systemHealth.activeIssues.slice(0, 5).map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <Icon 
                        icon="material-symbols:warning" 
                        className={getSeverityColor(issue.severity)}
                        width={20}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {issue.issueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <StatusBadge status={issue.severity} variant="maintenance" size="sm" />
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          {issue.affectedComponent} • {formatDateTime(issue.detectedAt)}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          {issue.description}
                        </p>
                      </div>
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:build" width={14} />
                        Resolve
                      </button>
                    </div>
                  ))}
                  {data.systemHealth.activeIssues.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{data.systemHealth.activeIssues.length - 5} more issues
                    </p>
                  )}
                </div>
              )}
            </DashboardWidget>

            <DashboardWidget
              title="High Priority Actions"
              icon="material-symbols:priority-high"
              iconColor="text-warning"
              variant="glass"
            >
              <div className="space-y-3">
                {/* Urgent approvals */}
                {data.approvalQueue.filter(a => a.priority === "urgent").slice(0, 3).map((approval) => (
                  <div key={approval.itemId} className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {approval.title}
                        </h4>
                        <StatusBadge status="urgent" variant="maintenance" size="sm" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {approval.requesterName} • {formatDate(approval.submittedDate)}
                      </p>
                    </div>
                    <button className="btn-primary btn-sm">
                      <Icon icon="material-symbols:check" width={14} />
                      Review
                    </button>
                  </div>
                ))}
                
                {/* Critical risks */}
                {data.riskIndicators.filter(r => r.severity === "critical").slice(0, 2).map((risk) => (
                  <div key={risk.riskType} className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {risk.riskType}
                        </h4>
                        <StatusBadge status="critical" variant="maintenance" size="sm" />
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {risk.probability.toFixed(0)}% probability • {risk.impact}
                      </p>
                    </div>
                    <button className="btn-secondary btn-sm">
                      <Icon icon="material-symbols:security" width={14} />
                      Mitigate
                    </button>
                  </div>
                ))}
              </div>
            </DashboardWidget>
          </div>
        </div>
      )}

      {selectedView === "approvals" && (
        <div className="space-y-6">
          {/* Approval Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Total Pending"
              value={data.approvalQueue.length}
              icon="material-symbols:approval"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Urgent Items"
              value={data.approvalQueue.filter(a => a.priority === "urgent").length}
              icon="material-symbols:priority-high"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="Equipment Requests"
              value={data.approvalQueue.filter(a => a.itemType === "equipment_checkout").length}
              icon="material-symbols:inventory-2"
              iconColor="text-teal-500"
              variant="glass"
            />
            <MetricWidget
              title="Maintenance Requests"
              value={data.approvalQueue.filter(a => a.itemType === "maintenance_request").length}
              icon="material-symbols:build"
              iconColor="text-warning"
              variant="glass"
            />
          </div>

          {/* Approval Queue */}
          <DashboardWidget
            title="Approval Queue"
            icon="material-symbols:approval"
            iconColor="text-warning"
            variant="glass"
            actions={
              <div className="flex gap-2">
                <button className="btn-secondary">
                  <Icon icon="material-symbols:filter-list" width={16} />
                  Filter
                </button>
                <button className="btn-primary">
                  <Icon icon="material-symbols:done-all" width={16} />
                  Bulk Approve
                </button>
              </div>
            }
          >
            <div className="space-y-3">
              {data.approvalQueue.map((approval) => (
                <div key={approval.itemId} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {approval.title}
                        </h4>
                        <StatusBadge status={approval.itemType.replace(/_/g, ' ')} variant="equipment" size="sm" />
                        <StatusBadge status={approval.priority} variant="maintenance" size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {approval.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>Requested by: {approval.requesterName}</span>
                        <span>Submitted: {formatDate(approval.submittedDate)}</span>
                      </div>
                      {Object.keys(approval.details).length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(approval.details).map(([key, value]) => (
                              <span key={key} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:close" width={16} />
                        Reject
                      </button>
                      <button className="btn-primary btn-sm">
                        <Icon icon="material-symbols:check" width={16} />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>

          {/* Approval Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Approval Types"
              icon="material-symbols:pie-chart"
              iconColor="text-teal-500"
              variant="glass"
            >
              <DonutChart
                data={approvalChartData}
                size={160}
                showLegend={true}
                centerText={data.approvalQueue.length.toString()}
                centerSubtext="Total Pending"
              />
            </DashboardWidget>

            <DashboardWidget
              title="Priority Distribution"
              icon="material-symbols:priority-high"
              iconColor="text-warning"
              variant="glass"
            >
              <div className="space-y-4">
                {["urgent", "high", "medium", "low"].map(priority => {
                  const count = data.approvalQueue.filter(a => a.priority === priority).length;
                  const percentage = data.approvalQueue.length > 0 ? (count / data.approvalQueue.length) * 100 : 0;
                  
                  return (
                    <div key={priority}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{priority}</span>
                        <span className="text-sm font-medium">{count} items</span>
                      </div>
                      <ProgressBar
                        value={count}
                        max={data.approvalQueue.length}
                        color={priority === "urgent" ? "error" : priority === "high" ? "warning" : priority === "medium" ? "info" : "success"}
                        size="sm"
                      />
                    </div>
                  );
                })}
              </div>
            </DashboardWidget>
          </div>
        </div>
      )}

      {selectedView === "audit" && (
        <div className="space-y-6">
          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Total Entries"
              value={data.auditLogs.length}
              icon="material-symbols:history"
              iconColor="text-info"
              variant="glass"
            />
            <MetricWidget
              title="Today's Activity"
              value={data.auditLogs.filter(log => 
                new Date(log.timestamp).toDateString() === new Date().toDateString()
              ).length}
              icon="material-symbols:today"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="Critical Actions"
              value={data.auditLogs.filter(log => 
                log.action.includes("DELETE") || log.action.includes("CRITICAL")
              ).length}
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="Unique Users"
              value={new Set(data.auditLogs.map(log => log.userName)).size}
              icon="material-symbols:group"
              iconColor="text-purple-500"
              variant="glass"
            />
          </div>

          {/* Audit Log */}
          <DashboardWidget
            title="Audit Log"
            icon="material-symbols:history"
            iconColor="text-info"
            variant="glass"
            actions={
              <div className="flex gap-2">
                <button className="btn-secondary">
                  <Icon icon="material-symbols:filter-list" width={16} />
                  Filter
                </button>
                <button className="btn-secondary">
                  <Icon icon="material-symbols:download" width={16} />
                  Export
                </button>
              </div>
            }
          >
            <div className="space-y-3">
              {data.auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Icon 
                    icon={
                      log.action.includes("CREATE") ? "material-symbols:add-circle" :
                      log.action.includes("UPDATE") ? "material-symbols:edit" :
                      log.action.includes("DELETE") ? "material-symbols:delete" :
                      "material-symbols:info"
                    }
                    className={
                      log.action.includes("DELETE") ? "text-error" :
                      log.action.includes("CREATE") ? "text-success" :
                      log.action.includes("UPDATE") ? "text-warning" :
                      "text-info"
                    }
                    width={20}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <StatusBadge status={log.userRole} variant="equipment" size="sm" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>User: {log.userName}</span>
                      <span>Entity: {log.entityType}</span>
                      <span>IP: {log.ipAddress}</span>
                      <span>Time: {formatDateTime(log.timestamp)}</span>
                    </div>
                    {Object.keys(log.changes).length > 0 && (
                      <div className="mt-2 text-xs">
                        <details className="text-gray-600 dark:text-gray-400">
                          <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                            View Changes ({Object.keys(log.changes).length} fields)
                          </summary>
                          <div className="mt-1 pl-4 space-y-1">
                            {Object.entries(log.changes).map(([field, value]) => (
                              <div key={field} className="flex items-center gap-2">
                                <span className="font-medium">{field}:</span>
                                <span className="text-gray-500">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {data.auditLogs.length > 10 && (
                <div className="text-center">
                  <button className="btn-secondary">
                    <Icon icon="material-symbols:expand-more" width={16} />
                    Load More Entries
                  </button>
                </div>
              )}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedView === "performance" && (
        <div className="space-y-6">
          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.performanceMetrics.map((metric) => (
              <DashboardWidget
                key={metric.metricName}
                title={metric.metricName}
                icon="material-symbols:analytics"
                iconColor="text-purple-500"
                variant="glass"
                size="sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metric.currentValue}
                    </span>
                    <div className="flex items-center gap-1">
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
                        width={16}
                      />
                      <span className={`text-sm ${
                        metric.percentageChange > 0 ? "text-success" :
                        metric.percentageChange < 0 ? "text-error" :
                        "text-gray-500"
                      }`}>
                        {metric.percentageChange > 0 ? "+" : ""}{metric.percentageChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <ProgressBar
                    value={metric.currentValue}
                    max={metric.targetValue}
                    label={`Target: ${metric.targetValue}`}
                    color={metric.currentValue >= metric.targetValue ? "success" : "warning"}
                    showValue={false}
                  />
                  
                  <div className="text-xs text-gray-500">
                    vs {metric.period}
                  </div>
                </div>
              </DashboardWidget>
            ))}
          </div>
        </div>
      )}

      {selectedView === "risks" && (
        <div className="space-y-6">
          {/* Risk Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Total Risks"
              value={data.riskIndicators.length}
              icon="material-symbols:warning"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Critical"
              value={data.riskIndicators.filter(r => r.severity === "critical").length}
              icon="material-symbols:priority-high"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="High Priority"
              value={data.riskIndicators.filter(r => r.severity === "high").length}
              icon="material-symbols:warning"
              iconColor="text-error"
              variant="glass"
            />
            <MetricWidget
              title="Avg Risk Score"
              value={(data.riskIndicators.reduce((sum, r) => sum + (r.probability || 0), 0) / data.riskIndicators.length).toFixed(1)}
              icon="material-symbols:analytics"
              iconColor="text-info"
              variant="glass"
            />
          </div>

          {/* Risk Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardWidget
              title="Risk Severity Distribution"
              icon="material-symbols:pie-chart"
              iconColor="text-teal-500"
              variant="glass"
            >
              <DonutChart
                data={riskChartData}
                size={160}
                showLegend={true}
                centerText={data.riskIndicators.length.toString()}
                centerSubtext="Total Risks"
              />
            </DashboardWidget>

            <DashboardWidget
              title="Risk Overview"
              icon="material-symbols:assessment"
              iconColor="text-warning"
              variant="glass"
            >
              <div className="space-y-4">
                {["critical", "high", "medium", "low"].map(severity => {
                  const risks = data.riskIndicators.filter(r => r.severity === severity);
                  const avgProbability = risks.length > 0 
                    ? risks.reduce((sum, r) => sum + r.probability, 0) / risks.length 
                    : 0;
                  
                  return (
                    <div key={severity} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <h4 className="font-medium capitalize">{severity} Risk</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {risks.length} items • Avg {avgProbability.toFixed(1)}% probability
                        </p>
                      </div>
                      <StatusBadge status={severity} variant="maintenance" />
                    </div>
                  );
                })}
              </div>
            </DashboardWidget>
          </div>

          {/* Risk Details */}
          <DashboardWidget
            title="Risk Management"
            icon="material-symbols:security"
            iconColor="text-error"
            variant="glass"
          >
            <div className="space-y-4">
              {data.riskIndicators.map((risk, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {risk.riskType}
                        </h4>
                        <StatusBadge status={risk.severity} variant="maintenance" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {risk.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Probability: {risk.probability.toFixed(1)}%</span>
                        <span>Impact: {risk.impact}</span>
                        <span>Identified: {formatDate(risk.identifiedDate)}</span>
                      </div>
                      {risk.mitigationActions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mitigation Actions:
                          </p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                            {risk.mitigationActions.map((action, actionIndex) => (
                              <li key={actionIndex}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:edit" width={16} />
                        Update
                      </button>
                      <button className="btn-primary btn-sm">
                        <Icon icon="material-symbols:check" width={16} />
                        Mitigate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}

      {selectedView === "compliance" && (
        <div className="space-y-6">
          {/* Compliance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <MetricWidget
              title="Overall Compliance"
              value={`${(data.complianceStatus.reduce((sum, c) => sum + c.complianceScore, 0) / data.complianceStatus.length).toFixed(1)}%`}
              icon="material-symbols:verified"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="Compliant Areas"
              value={data.complianceStatus.filter(c => c.status === "compliant").length}
              icon="material-symbols:check-circle"
              iconColor="text-success"
              variant="glass"
            />
            <MetricWidget
              title="Warning Areas"
              value={data.complianceStatus.filter(c => c.status === "warning").length}
              icon="material-symbols:warning"
              iconColor="text-warning"
              variant="glass"
            />
            <MetricWidget
              title="Non-Compliant"
              value={data.complianceStatus.filter(c => c.status === "non_compliant").length}
              icon="material-symbols:error"
              iconColor="text-error"
              variant="glass"
            />
          </div>

          {/* Compliance Status */}
          <DashboardWidget
            title="Compliance Areas"
            icon="material-symbols:verified"
            iconColor="text-success"
            variant="glass"
          >
            <div className="space-y-4">
              {data.complianceStatus.map((compliance, index) => (
                <div key={index} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {compliance.complianceArea}
                        </h4>
                        <StatusBadge 
                          status={compliance.status.replace('_', ' ')} 
                          variant="equipment" 
                        />
                        <span className={`text-sm font-medium ${getStatusColor(compliance.status)}`}>
                          {compliance.complianceScore.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Last Assessment: {formatDate(compliance.lastAssessment)}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Requirements ({compliance.requirements.length}):
                          </p>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                            {compliance.requirements.slice(0, 3).map((req, reqIndex) => (
                              <li key={reqIndex}>{req}</li>
                            ))}
                            {compliance.requirements.length > 3 && (
                              <li className="text-gray-500">+{compliance.requirements.length - 3} more...</li>
                            )}
                          </ul>
                        </div>
                        
                        {compliance.issues.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Issues ({compliance.issues.length}):
                            </p>
                            <ul className="text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                              {compliance.issues.slice(0, 3).map((issue, issueIndex) => (
                                <li key={issueIndex}>{issue}</li>
                              ))}
                              {compliance.issues.length > 3 && (
                                <li className="text-red-500">+{compliance.issues.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <ProgressBar
                        value={compliance.complianceScore}
                        max={100}
                        label="Compliance Score"
                        color={compliance.complianceScore >= 90 ? "success" : compliance.complianceScore >= 70 ? "warning" : "error"}
                        showValue={false}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="btn-secondary btn-sm">
                        <Icon icon="material-symbols:assessment" width={16} />
                        Assess
                      </button>
                      {compliance.issues.length > 0 && (
                        <button className="btn-primary btn-sm">
                          <Icon icon="material-symbols:build" width={16} />
                          Remediate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      )}
    </div>
  );
}

function SupervisorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-80"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
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