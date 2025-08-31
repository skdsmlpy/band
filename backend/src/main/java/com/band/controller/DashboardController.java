package com.band.controller;

import com.band.service.DashboardService;
import com.band.web.dto.DashboardDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Dashboard Management", description = "APIs for role-based dashboard data")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    @GetMapping("/student/{userId}")
    @Operation(summary = "Get student dashboard data", description = "Retrieve dashboard data for student users")
    @PreAuthorize("hasRole('Student') or hasAnyRole('BAND_DIRECTOR', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.StudentDashboard> getStudentDashboard(
            @PathVariable UUID userId,
            Authentication authentication) {
        
        DashboardDto.StudentDashboard dashboard = dashboardService.getStudentDashboard(userId);
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/director")
    @Operation(summary = "Get band director dashboard data", description = "Retrieve dashboard data for band directors")
    @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.DirectorDashboard> getDirectorDashboard(Authentication authentication) {
        DashboardDto.DirectorDashboard dashboard = dashboardService.getDirectorDashboard();
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/equipment-manager")
    @Operation(summary = "Get equipment manager dashboard data", description = "Retrieve dashboard data for equipment managers")
    @PreAuthorize("hasAnyRole('EQUIPMENT_MANAGER', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.EquipmentManagerDashboard> getEquipmentManagerDashboard(Authentication authentication) {
        DashboardDto.EquipmentManagerDashboard dashboard = dashboardService.getEquipmentManagerDashboard();
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/supervisor")
    @Operation(summary = "Get supervisor dashboard data", description = "Retrieve dashboard data for supervisors")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<DashboardDto.SupervisorDashboard> getSupervisorDashboard(Authentication authentication) {
        DashboardDto.SupervisorDashboard dashboard = dashboardService.getSupervisorDashboard();
        return ResponseEntity.ok(dashboard);
    }
    
    // Performance metrics endpoints
    @GetMapping("/equipment/utilization")
    @Operation(summary = "Get equipment utilization metrics", description = "Equipment usage statistics")
    @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.EquipmentUtilizationMetrics> getEquipmentUtilization() {
        DashboardDto.EquipmentUtilizationMetrics metrics = dashboardService.getEquipmentUtilizationMetrics();
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/students/performance")
    @Operation(summary = "Get student performance metrics", description = "Student activity and performance statistics")
    @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.StudentPerformanceMetrics> getStudentPerformance() {
        DashboardDto.StudentPerformanceMetrics metrics = dashboardService.getStudentPerformanceMetrics();
        return ResponseEntity.ok(metrics);
    }
    
    @GetMapping("/maintenance/overview")
    @Operation(summary = "Get maintenance overview", description = "Equipment maintenance status and schedules")
    @PreAuthorize("hasAnyRole('EQUIPMENT_MANAGER', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.MaintenanceOverview> getMaintenanceOverview() {
        DashboardDto.MaintenanceOverview overview = dashboardService.getMaintenanceOverview();
        return ResponseEntity.ok(overview);
    }
    
    @GetMapping("/events/upcoming")
    @Operation(summary = "Get upcoming events", description = "Upcoming band events and schedules")
    @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.UpcomingEvents> getUpcomingEvents() {
        DashboardDto.UpcomingEvents events = dashboardService.getUpcomingEvents();
        return ResponseEntity.ok(events);
    }
    
    @GetMapping("/system/health")
    @Operation(summary = "Get system health metrics", description = "Overall system health and status indicators")
    @PreAuthorize("hasRole('SUPERVISOR')")
    public ResponseEntity<DashboardDto.SystemHealth> getSystemHealth() {
        DashboardDto.SystemHealth health = dashboardService.getSystemHealth();
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/recent-activity/{userId}")
    @Operation(summary = "Get recent activity", description = "Recent user activity and system events")
    @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
    public ResponseEntity<DashboardDto.RecentActivity> getRecentActivity(@PathVariable UUID userId) {
        DashboardDto.RecentActivity activity = dashboardService.getRecentActivity(userId);
        return ResponseEntity.ok(activity);
    }
}