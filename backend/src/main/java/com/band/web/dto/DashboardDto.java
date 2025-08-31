package com.band.web.dto;

import com.band.domain.*;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class DashboardDto {
    
    @Data
    public static class StudentDashboard {
        private StudentInfo studentInfo;
        private List<MyEquipment> myEquipment;
        private List<UpcomingReturn> upcomingReturns;
        private List<RecentActivityItem> recentActivity;
        private List<BandEventSummary> upcomingEvents;
        private List<DigitalSignatureSummary> digitalSignatures;
        private EquipmentUsageStats equipmentUsage;
    }
    
    @Data
    public static class DirectorDashboard {
        private SystemOverview systemOverview;
        private List<StudentSummary> studentSummaries;
        private List<BandEventSummary> eventManagement;
        private EquipmentAnalytics equipmentAnalytics;
        private List<MaintenanceAlert> maintenanceAlerts;
        private List<PerformanceMetric> performanceMetrics;
        private List<RecentActivityItem> recentActivity;
    }
    
    @Data
    public static class EquipmentManagerDashboard {
        private InventoryStatus inventoryStatus;
        private List<MaintenanceScheduleItem> maintenanceSchedule;
        private EquipmentAnalytics equipmentAnalytics;
        private List<AssignmentTracker> assignmentTracking;
        private List<ConditionAlert> conditionAlerts;
        private List<UtilizationMetric> utilizationMetrics;
        private List<RecentActivityItem> recentActivity;
    }
    
    @Data
    public static class SupervisorDashboard {
        private SystemHealthOverview systemHealth;
        private List<ApprovalQueueItem> approvalQueue;
        private List<AuditLogEntry> auditLogs;
        private List<PerformanceMetric> performanceMetrics;
        private List<RiskIndicator> riskIndicators;
        private List<ComplianceStatus> complianceStatus;
        private List<RecentActivityItem> recentActivity;
    }
    
    // Supporting DTOs
    @Data
    public static class StudentInfo {
        private UUID id;
        private String name;
        private String email;
        private Integer gradeLevel;
        private String bandSection;
        private String primaryInstrument;
        private String academicStanding;
        private int activeAssignments;
        private int completedAssignments;
    }
    
    @Data
    public static class MyEquipment {
        private UUID equipmentId;
        private String qrCode;
        private String make;
        private String model;
        private String category;
        private String condition;
        private Instant assignmentDate;
        private Instant expectedReturnDate;
        private boolean isOverdue;
        private int daysUntilDue;
    }
    
    @Data
    public static class UpcomingReturn {
        private UUID assignmentId;
        private String equipmentName;
        private String qrCode;
        private Instant expectedReturnDate;
        private boolean isOverdue;
        private int daysUntilDue;
        private String urgency; // "critical", "warning", "normal"
    }
    
    @Data
    public static class RecentActivityItem {
        private String type; // "checkout", "return", "maintenance", "event", "assignment"
        private String description;
        private Instant timestamp;
        private String status;
        private Map<String, Object> metadata;
    }
    
    @Data
    public static class BandEventSummary {
        private UUID id;
        private String name;
        private String eventType;
        private Instant eventDate;
        private String venue;
        private String status;
        private boolean requiresEquipment;
        private Map<String, Integer> equipmentRequirements;
        private boolean isParticipating;
    }
    
    @Data
    public static class DigitalSignatureSummary {
        private UUID id;
        private String signatureType;
        private String signatureName;
        private Instant lastUsed;
        private int usageCount;
        private boolean isVerified;
    }
    
    @Data
    public static class EquipmentUsageStats {
        private int totalAssignments;
        private int currentlyAssigned;
        private int onTimeReturns;
        private int lateReturns;
        private double averageUsageDays;
        private String favoriteCategory;
    }
    
    @Data
    public static class SystemOverview {
        private int totalStudents;
        private int activeStudents;
        private int totalEquipment;
        private int availableEquipment;
        private int checkedOutEquipment;
        private int maintenanceEquipment;
        private int upcomingEvents;
        private int pendingReturns;
        private double systemHealthScore;
    }
    
    @Data
    public static class StudentSummary {
        private UUID id;
        private String name;
        private String bandSection;
        private int activeAssignments;
        private int overdueItems;
        private String academicStanding;
        private Instant lastActivity;
        private boolean hasAlerts;
    }
    
    @Data
    public static class EquipmentAnalytics {
        private Map<String, Integer> byCategory;
        private Map<String, Integer> byStatus;
        private Map<String, Integer> byCondition;
        private double utilizationRate;
        private double maintenanceRate;
        private List<TrendDataPoint> utilizationTrend;
        private List<CategoryStats> categoryBreakdown;
    }
    
    @Data
    public static class MaintenanceAlert {
        private UUID equipmentId;
        private String equipmentName;
        private String qrCode;
        private String alertType; // "overdue", "upcoming", "urgent"
        private LocalDate scheduledDate;
        private int daysOverdue;
        private String priority;
        private String maintenanceType;
    }
    
    @Data
    public static class PerformanceMetric {
        private String metricName;
        private Object currentValue;
        private Object targetValue;
        private double percentageChange;
        private String trend; // "up", "down", "stable"
        private String period;
        private List<TrendDataPoint> history;
    }
    
    @Data
    public static class InventoryStatus {
        private int totalEquipment;
        private int availableEquipment;
        private int checkedOutEquipment;
        private int inMaintenanceEquipment;
        private int retiredEquipment;
        private double totalValue;
        private Map<String, CategoryInventory> categoryBreakdown;
    }
    
    @Data
    public static class MaintenanceScheduleItem {
        private UUID maintenanceId;
        private UUID equipmentId;
        private String equipmentName;
        private String qrCode;
        private String maintenanceType;
        private LocalDate scheduledDate;
        private String status;
        private String priority;
        private String serviceProvider;
        private Double estimatedCost;
        private boolean isOverdue;
    }
    
    @Data
    public static class AssignmentTracker {
        private UUID assignmentId;
        private String studentName;
        private String equipmentName;
        private String qrCode;
        private Instant assignmentDate;
        private Instant expectedReturnDate;
        private String status;
        private boolean isOverdue;
        private int daysSinceAssignment;
    }
    
    @Data
    public static class ConditionAlert {
        private UUID equipmentId;
        private String equipmentName;
        private String qrCode;
        private String currentCondition;
        private String previousCondition;
        private Instant lastInspectionDate;
        private String alertLevel; // "warning", "critical"
        private String recommendedAction;
    }
    
    @Data
    public static class UtilizationMetric {
        private String category;
        private int totalEquipment;
        private int inUseEquipment;
        private double utilizationRate;
        private double averageUsageDays;
        private List<TrendDataPoint> trend;
    }
    
    @Data
    public static class SystemHealthOverview {
        private double overallHealthScore;
        private Map<String, HealthIndicator> indicators;
        private List<SystemAlert> activeAlerts;
        private SystemStats systemStats;
    }
    
    @Data
    public static class ApprovalQueueItem {
        private UUID itemId;
        private String itemType; // "equipment_checkout", "maintenance_request", "event_approval"
        private String title;
        private String description;
        private String requesterName;
        private Instant submittedDate;
        private String priority;
        private String status;
        private Map<String, Object> details;
    }
    
    @Data
    public static class AuditLogEntry {
        private UUID id;
        private String action;
        private String entityType;
        private UUID entityId;
        private String userName;
        private String userRole;
        private Instant timestamp;
        private String description;
        private Map<String, Object> changes;
        private String ipAddress;
    }
    
    @Data
    public static class RiskIndicator {
        private String riskType;
        private String severity; // "low", "medium", "high", "critical"
        private String description;
        private Double probability;
        private String impact;
        private List<String> mitigationActions;
        private Instant identifiedDate;
    }
    
    @Data
    public static class ComplianceStatus {
        private String complianceArea;
        private String status; // "compliant", "warning", "non_compliant"
        private Double complianceScore;
        private Instant lastAssessment;
        private List<String> requirements;
        private List<String> issues;
    }
    
    // Supporting nested DTOs
    @Data
    public static class TrendDataPoint {
        private LocalDate date;
        private Double value;
        private String label;
    }
    
    @Data
    public static class CategoryStats {
        private String category;
        private int total;
        private int available;
        private int inUse;
        private int maintenance;
        private double utilizationRate;
        private double averageAge; // in months
    }
    
    @Data
    public static class CategoryInventory {
        private String category;
        private int total;
        private int available;
        private int checkedOut;
        private int maintenance;
        private int retired;
        private double totalValue;
        private double averageConditionScore;
    }
    
    @Data
    public static class HealthIndicator {
        private String name;
        private String status; // "healthy", "warning", "critical"
        private Double score;
        private String description;
        private Instant lastCheck;
    }
    
    @Data
    public static class SystemAlert {
        private String alertType;
        private String severity;
        private String message;
        private Instant timestamp;
        private boolean acknowledged;
        private String category;
    }
    
    @Data
    public static class SystemStats {
        private int totalUsers;
        private int activeUsers;
        private int totalEquipment;
        private int activeAssignments;
        private int completedMaintenance;
        private int upcomingEvents;
        private Instant lastDataRefresh;
    }
    
    // Specialized metric DTOs
    @Data
    public static class EquipmentUtilizationMetrics {
        private double overallUtilization;
        private Map<String, Double> categoryUtilization;
        private List<UtilizationTrend> trends;
        private List<TopUtilizedEquipment> topEquipment;
        private List<UnderutilizedEquipment> underutilizedEquipment;
    }
    
    @Data
    public static class StudentPerformanceMetrics {
        private double averageAssignmentDuration;
        private double onTimeReturnRate;
        private Map<String, Integer> assignmentsBySection;
        private List<StudentPerformanceSummary> topPerformers;
        private List<StudentPerformanceSummary> needsAttention;
    }
    
    @Data
    public static class MaintenanceOverview {
        private int scheduledMaintenance;
        private int overdueMaintenance;
        private int completedThisMonth;
        private double averageMaintenanceCost;
        private List<MaintenanceByCategory> categoryBreakdown;
        private List<UpcomingMaintenanceItem> upcomingItems;
    }
    
    @Data
    public static class UpcomingEvents {
        private List<BandEventSummary> thisWeek;
        private List<BandEventSummary> thisMonth;
        private List<BandEventSummary> nextMonth;
        private int totalUpcoming;
    }
    
    @Data
    public static class SystemHealth {
        private double overallScore;
        private Map<String, ComponentHealth> components;
        private List<SystemIssue> activeIssues;
        private SystemPerformance performance;
    }
    
    @Data
    public static class RecentActivity {
        private List<RecentActivityItem> activities;
        private int totalActivities;
        private Instant lastUpdate;
    }
    
    // Additional supporting classes
    @Data
    public static class UtilizationTrend {
        private String period;
        private Double utilizationRate;
        private LocalDate date;
    }
    
    @Data
    public static class TopUtilizedEquipment {
        private String equipmentName;
        private String qrCode;
        private Double utilizationRate;
        private int totalAssignments;
    }
    
    @Data
    public static class UnderutilizedEquipment {
        private String equipmentName;
        private String qrCode;
        private Double utilizationRate;
        private LocalDate lastAssigned;
        private String recommendedAction;
    }
    
    @Data
    public static class StudentPerformanceSummary {
        private String studentName;
        private String bandSection;
        private Double performanceScore;
        private int totalAssignments;
        private Double onTimeReturnRate;
    }
    
    @Data
    public static class MaintenanceByCategory {
        private String category;
        private int scheduledCount;
        private int completedCount;
        private Double averageCost;
        private Double completionRate;
    }
    
    @Data
    public static class UpcomingMaintenanceItem {
        private String equipmentName;
        private String qrCode;
        private String maintenanceType;
        private LocalDate scheduledDate;
        private String priority;
        private int daysUntilDue;
    }
    
    @Data
    public static class ComponentHealth {
        private String componentName;
        private String status;
        private Double healthScore;
        private String lastChecked;
        private List<String> issues;
    }
    
    @Data
    public static class SystemIssue {
        private String issueType;
        private String severity;
        private String description;
        private Instant detectedAt;
        private String affectedComponent;
    }
    
    @Data
    public static class SystemPerformance {
        private double responseTime;
        private double uptime;
        private int activeConnections;
        private double memoryUsage;
        private double cpuUsage;
    }
}