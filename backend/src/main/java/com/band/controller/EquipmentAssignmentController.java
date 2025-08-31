package com.band.controller;

import com.band.domain.Equipment.EquipmentCondition;
import com.band.domain.EquipmentAssignment;
import com.band.domain.EquipmentAssignment.AssignmentStatus;
import com.band.service.EquipmentAssignmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Equipment Assignment Management", description = "APIs for managing equipment checkout and return workflows")
public class EquipmentAssignmentController {
  
  private final EquipmentAssignmentService assignmentService;
  
  @GetMapping
  @Operation(summary = "Get all assignments with pagination", description = "Retrieve all equipment assignments with pagination support")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Page<EquipmentAssignment>> getAllAssignments(
      @PageableDefault(size = 20) Pageable pageable) {
    
    Page<EquipmentAssignment> assignments = assignmentService.findAllAssignments(pageable);
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/{id}")
  @Operation(summary = "Get assignment by ID", description = "Retrieve a specific assignment by its ID")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<EquipmentAssignment> getAssignmentById(
      @Parameter(description = "Assignment ID") @PathVariable UUID id) {
    
    return assignmentService.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
  
  // Checkout operations
  @PostMapping("/checkout")
  @Operation(summary = "Checkout equipment", description = "Create a new equipment checkout assignment")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<EquipmentAssignment> checkoutEquipment(
      @Valid @RequestBody CheckoutRequest request) {
    
    try {
      EquipmentAssignment assignment = assignmentService.checkoutEquipment(
          request.getQrCode(),
          request.getStudentId(),
          request.getEventId(),
          request.getExpectedReturnDate(),
          request.getPurpose()
      );
      return ResponseEntity.ok(assignment);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest().build();
    }
  }
  
  @PutMapping("/{id}/return")
  @Operation(summary = "Return equipment", description = "Process equipment return for an assignment")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<EquipmentAssignment> returnEquipment(
      @PathVariable UUID id,
      @Valid @RequestBody ReturnRequest request) {
    
    try {
      EquipmentAssignment assignment = assignmentService.returnEquipment(
          id,
          request.getReturnCondition(),
          request.getDamageNotes(),
          request.getReturnedById()
      );
      return ResponseEntity.ok(assignment);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest().build();
    }
  }
  
  @PutMapping("/{id}/approve-return")
  @Operation(summary = "Approve equipment return", description = "Approve a pending equipment return")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<EquipmentAssignment> approveReturn(
      @PathVariable UUID id,
      @Valid @RequestBody ApprovalRequest request) {
    
    try {
      EquipmentAssignment assignment = assignmentService.approveReturn(
          id,
          request.getApproverId(),
          request.getApprovalNotes()
      );
      return ResponseEntity.ok(assignment);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest().build();
    }
  }
  
  // Query operations by student
  @GetMapping("/student/{studentId}")
  @Operation(summary = "Get assignments by student", description = "Retrieve all assignments for a specific student")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsByStudent(@PathVariable UUID studentId) {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsByStudent(studentId);
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/student/{studentId}/active")
  @Operation(summary = "Get active assignments by student", description = "Retrieve currently active assignments for a student")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getActiveAssignmentsByStudent(@PathVariable UUID studentId) {
    List<EquipmentAssignment> assignments = assignmentService.findActiveAssignmentsByStudent(studentId);
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/student/{studentId}/history")
  @Operation(summary = "Get assignment history by student", description = "Retrieve assignment history for a student")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentHistoryByStudent(@PathVariable UUID studentId) {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentHistoryByStudent(studentId);
    return ResponseEntity.ok(assignments);
  }
  
  // Query operations by equipment
  @GetMapping("/equipment/{equipmentId}")
  @Operation(summary = "Get assignments by equipment", description = "Retrieve all assignments for a specific equipment")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsByEquipment(@PathVariable UUID equipmentId) {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsByEquipment(equipmentId);
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/equipment/{equipmentId}/active")
  @Operation(summary = "Get active assignment by equipment", description = "Retrieve currently active assignment for equipment")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<EquipmentAssignment> getActiveAssignmentByEquipment(@PathVariable UUID equipmentId) {
    return assignmentService.findActiveAssignmentByEquipment(equipmentId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
  
  @GetMapping("/equipment/{equipmentId}/history")
  @Operation(summary = "Get assignment history by equipment", description = "Retrieve assignment history for equipment")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentHistoryByEquipment(@PathVariable UUID equipmentId) {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentHistoryByEquipment(equipmentId);
    return ResponseEntity.ok(assignments);
  }
  
  // Query operations by status
  @GetMapping("/status/{status}")
  @Operation(summary = "Get assignments by status", description = "Retrieve assignments filtered by status")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsByStatus(@PathVariable AssignmentStatus status) {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsByStatus(status);
    return ResponseEntity.ok(assignments);
  }
  
  // Query operations by event
  @GetMapping("/event/{eventId}")
  @Operation(summary = "Get assignments by event", description = "Retrieve assignments for a specific event")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsByEvent(@PathVariable UUID eventId) {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsByEvent(eventId);
    return ResponseEntity.ok(assignments);
  }
  
  // Overdue and due soon operations
  @GetMapping("/overdue")
  @Operation(summary = "Get overdue assignments", description = "Retrieve assignments that are past their return date")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getOverdueAssignments() {
    List<EquipmentAssignment> assignments = assignmentService.findOverdueAssignments();
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/due-soon")
  @Operation(summary = "Get assignments due soon", description = "Retrieve assignments due within specified days")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsDueSoon(
      @RequestParam(defaultValue = "3") int daysAhead) {
    
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsDueSoon(daysAhead);
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/due-tomorrow")
  @Operation(summary = "Get assignments due tomorrow", description = "Retrieve assignments due tomorrow")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsDueTomorrow() {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsDueTomorrow();
    return ResponseEntity.ok(assignments);
  }
  
  // Recent activity operations
  @GetMapping("/recent/checkouts")
  @Operation(summary = "Get recent checkouts", description = "Retrieve recent equipment checkouts")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getRecentCheckouts(
      @RequestParam(defaultValue = "7") int daysBack) {
    
    List<EquipmentAssignment> assignments = assignmentService.findRecentCheckouts(daysBack);
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/recent/returns")
  @Operation(summary = "Get recent returns", description = "Retrieve recent equipment returns")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getRecentReturns(
      @RequestParam(defaultValue = "7") int daysBack) {
    
    List<EquipmentAssignment> assignments = assignmentService.findRecentReturns(daysBack);
    return ResponseEntity.ok(assignments);
  }
  
  // Approval workflow operations
  @GetMapping("/pending-peer-review")
  @Operation(summary = "Get assignments pending peer review", description = "Retrieve assignments awaiting peer review")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsPendingPeerReview() {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsPendingPeerReview();
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/pending-supervisor-approval")
  @Operation(summary = "Get assignments pending supervisor approval", description = "Retrieve assignments awaiting supervisor approval")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsPendingSupervisorApproval() {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsPendingSupervisorApproval();
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/condition-changes")
  @Operation(summary = "Get assignments with condition changes", description = "Retrieve assignments where equipment condition changed")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsWithConditionChanges() {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsWithConditionChanges();
    return ResponseEntity.ok(assignments);
  }
  
  @GetMapping("/with-damage")
  @Operation(summary = "Get assignments with damage", description = "Retrieve assignments with reported damage")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<EquipmentAssignment>> getAssignmentsWithDamage() {
    List<EquipmentAssignment> assignments = assignmentService.findAssignmentsWithDamage();
    return ResponseEntity.ok(assignments);
  }
  
  // Statistics operations
  @GetMapping("/stats/count/{status}")
  @Operation(summary = "Count assignments by status", description = "Get count of assignments for a specific status")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Map<String, Long>> countAssignmentsByStatus(@PathVariable AssignmentStatus status) {
    long count = assignmentService.countAssignmentsByStatus(status);
    return ResponseEntity.ok(Map.of("count", count));
  }
  
  @GetMapping("/stats/purpose")
  @Operation(summary = "Get assignment statistics by purpose", description = "Retrieve assignment count statistics by purpose")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Object[]>> getAssignmentStatsByPurpose() {
    List<Object[]> stats = assignmentService.getAssignmentStatsByPurpose();
    return ResponseEntity.ok(stats);
  }
  
  @GetMapping("/stats/checkouts-by-date")
  @Operation(summary = "Get checkout statistics by date", description = "Retrieve checkout count statistics by date")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Object[]>> getCheckoutStatsByDate(
      @RequestParam(defaultValue = "30") int daysBack) {
    
    List<Object[]> stats = assignmentService.getCheckoutStatsByDate(daysBack);
    return ResponseEntity.ok(stats);
  }
  
  @GetMapping("/stats/average-duration")
  @Operation(summary = "Get average assignment duration", description = "Retrieve average assignment duration in days")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Map<String, Double>> getAverageAssignmentDuration() {
    Double averageDuration = assignmentService.getAverageAssignmentDurationInDays();
    return ResponseEntity.ok(Map.of("averageDurationDays", averageDuration != null ? averageDuration : 0.0));
  }
  
  // Bulk operations
  @PutMapping("/bulk/extend")
  @Operation(summary = "Extend multiple assignments", description = "Bulk extend return dates for multiple assignments")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<EquipmentAssignment>> extendMultipleAssignments(
      @RequestBody ExtendAssignmentsRequest request) {
    
    try {
      List<EquipmentAssignment> assignments = assignmentService.extendMultipleAssignments(
          request.getAssignmentIds(),
          request.getNewReturnDate()
      );
      return ResponseEntity.ok(assignments);
    } catch (IllegalArgumentException | IllegalStateException e) {
      return ResponseEntity.badRequest().build();
    }
  }
  
  @PostMapping("/notifications/overdue")
  @Operation(summary = "Send overdue notifications", description = "Trigger notifications for overdue assignments")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Map<String, String>> sendOverdueNotifications() {
    assignmentService.sendOverdueNotifications();
    return ResponseEntity.ok(Map.of("message", "Overdue notifications sent successfully"));
  }
  
  // Request/Response DTOs
  public static class CheckoutRequest {
    private String qrCode;
    private UUID studentId;
    private UUID eventId;
    private Instant expectedReturnDate;
    private String purpose;
    
    // Getters and setters
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    
    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }
    
    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }
    
    public Instant getExpectedReturnDate() { return expectedReturnDate; }
    public void setExpectedReturnDate(Instant expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }
    
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
  }
  
  public static class ReturnRequest {
    private EquipmentCondition returnCondition;
    private String damageNotes;
    private UUID returnedById;
    
    // Getters and setters
    public EquipmentCondition getReturnCondition() { return returnCondition; }
    public void setReturnCondition(EquipmentCondition returnCondition) { this.returnCondition = returnCondition; }
    
    public String getDamageNotes() { return damageNotes; }
    public void setDamageNotes(String damageNotes) { this.damageNotes = damageNotes; }
    
    public UUID getReturnedById() { return returnedById; }
    public void setReturnedById(UUID returnedById) { this.returnedById = returnedById; }
  }
  
  public static class ApprovalRequest {
    private UUID approverId;
    private String approvalNotes;
    
    // Getters and setters
    public UUID getApproverId() { return approverId; }
    public void setApproverId(UUID approverId) { this.approverId = approverId; }
    
    public String getApprovalNotes() { return approvalNotes; }
    public void setApprovalNotes(String approvalNotes) { this.approvalNotes = approvalNotes; }
  }
  
  public static class ExtendAssignmentsRequest {
    private List<UUID> assignmentIds;
    private Instant newReturnDate;
    
    // Getters and setters
    public List<UUID> getAssignmentIds() { return assignmentIds; }
    public void setAssignmentIds(List<UUID> assignmentIds) { this.assignmentIds = assignmentIds; }
    
    public Instant getNewReturnDate() { return newReturnDate; }
    public void setNewReturnDate(Instant newReturnDate) { this.newReturnDate = newReturnDate; }
  }
}