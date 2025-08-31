"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store";
import { Icon } from "@iconify/react";
import { apiGet } from "@/lib/api";
import { DashboardWidget, MetricWidget, StatusBadge, ProgressBar } from "./DashboardWidget";
import { BarChart, DonutChart, StatCard } from "./SimpleChart";

interface StudentDashboardData {
  studentInfo: {
    id: string;
    name: string;
    email: string;
    gradeLevel: number;
    bandSection: string;
    primaryInstrument: string;
    academicStanding: string;
    activeAssignments: number;
    completedAssignments: number;
  };
  myEquipment: Array<{
    equipmentId: string;
    qrCode: string;
    make: string;
    model: string;
    category: string;
    condition: string;
    assignmentDate: string;
    expectedReturnDate: string;
    isOverdue: boolean;
    daysUntilDue: number;
  }>;
  upcomingReturns: Array<{
    assignmentId: string;
    equipmentName: string;
    qrCode: string;
    expectedReturnDate: string;
    isOverdue: boolean;
    daysUntilDue: number;
    urgency: "critical" | "warning" | "normal";
  }>;
  upcomingEvents: Array<{
    id: string;
    name: string;
    eventType: string;
    eventDate: string;
    venue: string;
    status: string;
    requiresEquipment: boolean;
  }>;
  equipmentUsage: {
    totalAssignments: number;
    currentlyAssigned: number;
    onTimeReturns: number;
    lateReturns: number;
    averageUsageDays: number;
    favoriteCategory: string;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
  practiceStats: {
    totalSessions: number;
    averageSessionLength: number;
    totalMinutes: number;
    streak: number;
    weeklyGoal: number;
    weeklyProgress: number;
    monthlyProgress: {
      practiceMinutes: number;
      goal: number;
      percentComplete: number;
    };
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
    type: string;
  }>;
  assignments: Array<{
    id: string;
    equipmentId: string;
    equipmentName: string;
    qrCode: string;
    assignmentDate: string;
    expectedReturnDate: string;
    status: string;
    condition: string;
    isOverdue: boolean;
  }>;
}

export function StudentDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Use mock data for now - replace with API call when backend is ready
    const loadMockData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData: StudentDashboardData = {
          studentInfo: {
            id: user.id,
            name: user.name || "Student User",
            email: user.email || "",
            gradeLevel: 10,
            bandSection: "Woodwind",
            primaryInstrument: "Clarinet",
            academicStanding: "Good",
            activeAssignments: 3,
            completedAssignments: 12
          },
          myEquipment: [
            {
              equipmentId: "eq_clarinet_001",
              qrCode: "CL-2024-001",
              make: "Yamaha",
              model: "YCL-255",
              category: "Woodwind",
              condition: "Good",
              assignmentDate: "2024-08-15",
              expectedReturnDate: "2024-12-15",
              isOverdue: false,
              daysUntilDue: 45
            }
          ],
          upcomingReturns: [
            {
              assignmentId: "assign_001",
              equipmentName: "Yamaha YCL-255 Clarinet",
              qrCode: "CL-2024-001",
              expectedReturnDate: "2024-12-15",
              isOverdue: false,
              daysUntilDue: 45,
              urgency: "normal"
            }
          ],
          upcomingEvents: [
            {
              id: "event_001",
              name: "Fall Concert",
              eventType: "Concert",
              eventDate: "2024-10-15",
              venue: "School Auditorium",
              status: "Confirmed",
              requiresEquipment: true
            }
          ],
          practiceStats: {
            totalSessions: 15,
            averageSessionLength: 45,
            totalMinutes: 675,
            streak: 3,
            weeklyGoal: 180,
            weeklyProgress: 120,
            monthlyProgress: {
              practiceMinutes: 675,
              goal: 720,
              percentComplete: 94
            }
          },
          tasks: [
            {
              id: "task_001",
              title: "Equipment Return - Clarinet",
              description: "Return Yamaha YCL-255 clarinet",
              priority: "Medium",
              dueDate: "2024-12-15",
              status: "Pending",
              type: "Equipment"
            }
          ],
          assignments: [
            {
              id: "assign_001",
              equipmentId: "eq_clarinet_001",
              equipmentName: "Yamaha YCL-255",
              qrCode: "CL-2024-001",
              assignmentDate: "2024-08-15",
              expectedReturnDate: "2024-12-15",
              status: "Active",
              condition: "Good",
              isOverdue: false
            }
          ],
          equipmentUsage: {
            totalAssignments: 8,
            currentlyAssigned: 1,
            onTimeReturns: 7,
            lateReturns: 0,
            averageUsageDays: 30,
            favoriteCategory: "Woodwind"
          },
          recentActivity: [
            {
              type: "EQUIPMENT_CHECKOUT",
              description: "Checked out Yamaha YCL-255 Clarinet",
              timestamp: "2024-08-15T10:00:00Z",
              status: "SUCCESS"
            },
            {
              type: "PRACTICE_SESSION",
              description: "Completed 45-minute practice session",
              timestamp: "2024-08-14T16:30:00Z",
              status: "SUCCESS"
            }
          ]
        };
        
        setData(mockData);
        setError(null);
      } catch (err) {
        console.error("Failed to load student dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadMockData();
  }, [user?.id]);

  if (loading) {
    return <StudentDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Icon icon="material-symbols:error-outline" className="text-red-500 mb-4" width={48} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard Unavailable
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load your dashboard at this time."}
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

  const getBandSectionColor = (section: string) => {
    const sectionLower = section.toLowerCase();
    if (sectionLower.includes("brass")) return "text-brass-500";
    if (sectionLower.includes("woodwind")) return "text-woodwind-500";
    if (sectionLower.includes("percussion")) return "text-percussion-500";
    if (sectionLower.includes("string")) return "text-string-500";
    return "text-teal-500";
  };

  // Prepare chart data
  const equipmentUsageData = [
    { label: "On Time", value: data.equipmentUsage.onTimeReturns, color: "bg-success" },
    { label: "Late", value: data.equipmentUsage.lateReturns, color: "bg-warning" }
  ];

  const categoryUsageData = data.myEquipment.reduce((acc, equipment) => {
    const category = equipment.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryUsageData).map(([category, count]) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
    value: count
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-responsive-xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome, {data.studentInfo.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Grade {data.studentInfo.gradeLevel} • {data.studentInfo.bandSection} • {data.studentInfo.primaryInstrument}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Icon 
            icon="material-symbols:music-note" 
            className={getBandSectionColor(data.studentInfo.bandSection)} 
            width={32} 
          />
          <StatusBadge status={data.studentInfo.academicStanding} variant="assignment" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricWidget
          title="Equipment Assigned"
          value={data.equipmentUsage.currentlyAssigned}
          icon="material-symbols:inventory-2"
          iconColor="text-teal-500"
          variant="glass"
        />
        <MetricWidget
          title="Total Assignments"
          value={data.equipmentUsage.totalAssignments}
          icon="material-symbols:assignment"
          iconColor="text-info"
          variant="glass"
        />
        <MetricWidget
          title="On-Time Returns"
          value={`${data.equipmentUsage.onTimeReturns}/${data.equipmentUsage.totalAssignments}`}
          subtitle={`${((data.equipmentUsage.onTimeReturns / (data.equipmentUsage.totalAssignments || 1)) * 100).toFixed(1)}% rate`}
          icon="material-symbols:check-circle"
          iconColor="text-success"
          variant="glass"
        />
        <MetricWidget
          title="Avg Usage Days"
          value={data.equipmentUsage.averageUsageDays.toFixed(1)}
          icon="material-symbols:schedule"
          iconColor="text-warning"
          variant="glass"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* My Equipment */}
        <div className="lg:col-span-2">
          <DashboardWidget
            title="My Equipment"
            icon="material-symbols:inventory-2"
            iconColor="text-teal-500"
            variant="glass"
          >
            {data.myEquipment.length === 0 ? (
              <div className="text-center py-8">
                <Icon icon="material-symbols:inventory-2" className="text-gray-400 mb-2" width={40} />
                <p className="text-gray-500">No equipment currently assigned</p>
                <button className="btn-primary mt-4">
                  <Icon icon="material-symbols:add" width={16} />
                  Request Equipment
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {data.myEquipment.map((equipment) => (
                  <div key={equipment.equipmentId} className="card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {equipment.make} {equipment.model}
                          </h4>
                          <StatusBadge status={equipment.category} variant="equipment" />
                          <StatusBadge status={equipment.condition} variant="equipment" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          QR: {equipment.qrCode}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-gray-500">
                            Assigned: {formatDate(equipment.assignmentDate)}
                          </span>
                          <span className={equipment.isOverdue ? "text-error" : "text-success"}>
                            Due: {formatDate(equipment.expectedReturnDate)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {equipment.isOverdue ? (
                          <div className="text-error">
                            <Icon icon="material-symbols:warning" width={20} />
                            <p className="text-xs font-medium">Overdue</p>
                          </div>
                        ) : (
                          <div className="text-gray-600">
                            <p className="text-xs">{equipment.daysUntilDue} days left</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardWidget>
        </div>

        {/* Upcoming Returns */}
        <div>
          <DashboardWidget
            title="Upcoming Returns"
            icon="material-symbols:schedule"
            iconColor="text-warning"
            variant="glass"
          >
            {data.upcomingReturns.length === 0 ? (
              <div className="text-center py-8">
                <Icon icon="material-symbols:check-circle" className="text-success mb-2" width={32} />
                <p className="text-success text-sm">All equipment up to date!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.upcomingReturns.slice(0, 5).map((returnItem) => (
                  <div key={returnItem.assignmentId} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {returnItem.equipmentName}
                      </p>
                      <p className="text-xs text-gray-500">{returnItem.qrCode}</p>
                      <p className={`text-xs ${returnItem.isOverdue ? "text-error" : "text-gray-600"}`}>
                        {returnItem.isOverdue 
                          ? `${Math.abs(returnItem.daysUntilDue)} days overdue`
                          : `Due in ${returnItem.daysUntilDue} days`
                        }
                      </p>
                    </div>
                    <StatusBadge 
                      status={returnItem.urgency} 
                      variant="assignment"
                      size="sm"
                    />
                  </div>
                ))}
                {data.upcomingReturns.length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{data.upcomingReturns.length - 5} more items
                  </p>
                )}
              </div>
            )}
          </DashboardWidget>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Events */}
        <DashboardWidget
          title="Upcoming Band Events"
          icon="material-symbols:event"
          iconColor="text-info"
          variant="glass"
        >
          {data.upcomingEvents.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon="material-symbols:event" className="text-gray-400 mb-2" width={32} />
              <p className="text-gray-500">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.upcomingEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {event.name}
                      </h4>
                      <StatusBadge status={event.eventType} variant="event" size="sm" />
                    </div>
                    <p className="text-xs text-gray-500">{event.venue}</p>
                    <p className="text-xs text-gray-600">{formatDateTime(event.eventDate)}</p>
                  </div>
                  {event.requiresEquipment && (
                    <Icon icon="material-symbols:inventory-2" className="text-teal-500" width={16} />
                  )}
                </div>
              ))}
            </div>
          )}
        </DashboardWidget>

        {/* Usage Statistics */}
        <DashboardWidget
          title="Equipment Usage Statistics"
          icon="material-symbols:analytics"
          iconColor="text-purple-500"
          variant="glass"
        >
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Return Performance
              </h5>
              <BarChart data={equipmentUsageData} height="h-32" showValues={true} />
            </div>
            
            {categoryChartData.length > 0 && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Equipment by Category
                </h5>
                <DonutChart 
                  data={categoryChartData}
                  size={100}
                  showLegend={false}
                  centerText={data.equipmentUsage.currentlyAssigned.toString()}
                  centerSubtext="Active"
                />
              </div>
            )}
          </div>
        </DashboardWidget>
      </div>

      {/* Recent Activity */}
      <DashboardWidget
        title="Recent Activity"
        icon="material-symbols:history"
        iconColor="text-gray-500"
        variant="glass"
      >
        {data.recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="material-symbols:history" className="text-gray-400 mb-2" width={32} />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentActivity.slice(0, 8).map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Icon 
                  icon={
                    activity.type === "checkout" ? "material-symbols:download" :
                    activity.type === "return" ? "material-symbols:upload" :
                    activity.type === "maintenance" ? "material-symbols:build" :
                    activity.type === "event" ? "material-symbols:event" :
                    "material-symbols:info"
                  }
                  className="text-teal-500 mt-0.5" 
                  width={16} 
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {formatDateTime(activity.timestamp)}
                    </p>
                    <StatusBadge status={activity.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardWidget>

    </div>
  );
}

function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="card p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}