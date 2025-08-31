package com.band.service;

import com.band.domain.Equipment;
import com.band.domain.EquipmentAssignment;
import com.band.domain.EquipmentAssignment.AssignmentStatus;
import com.band.domain.User;
import com.band.domain.BandEvent;
import com.band.repo.EquipmentAssignmentRepository;
import com.band.repo.EquipmentRepository;
import com.band.repo.UserRepository;
import com.band.repo.BandEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EquipmentAssignmentService {
  
  private final EquipmentAssignmentRepository assignmentRepository;
  private final EquipmentRepository equipmentRepository;
  private final UserRepository userRepository;
  private final BandEventRepository eventRepository;
  
  // Basic CRUD operations
  public Page<EquipmentAssignment> findAllAssignments(Pageable pageable) {
    return assignmentRepository.findAll(pageable);
  }
  
  public Optional<EquipmentAssignment> findById(UUID id) {
    return assignmentRepository.findById(id);
  }
  
  @Transactional
  public EquipmentAssignment saveAssignment(EquipmentAssignment assignment) {
    log.info("Saving equipment assignment for equipment: {} to student: {}", 
        assignment.getEquipment().getQrCode(), assignment.getStudent().getEmail());
    return assignmentRepository.save(assignment);
  }
  
  // Equipment checkout operations
  @Transactional
  public EquipmentAssignment checkoutEquipment(String qrCode, UUID studentId, 
                                              UUID eventId, Instant expectedReturnDate, String purpose) {
    
    // Validate equipment availability
    Equipment equipment = equipmentRepository.findByQrCode(qrCode)
        .orElseThrow(() -> new IllegalArgumentException("Equipment not found: " + qrCode));
    
    if (equipment.getStatus() != Equipment.EquipmentStatus.AVAILABLE) {
      throw new IllegalStateException("Equipment is not available for checkout: " + qrCode);
    }
    
    // Check if equipment is already checked out
    Optional<EquipmentAssignment> existingAssignment = 
        assignmentRepository.findActiveAssignmentByEquipment(equipment.getId());
    if (existingAssignment.isPresent()) {
      throw new IllegalStateException("Equipment is already checked out: " + qrCode);
    }
    
    // Validate student
    User student = userRepository.findById(studentId)
        .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));
    
    // Validate event (optional)
    BandEvent event = null;
    if (eventId != null) {
      event = eventRepository.findById(eventId)
          .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));
    }
    
    // Create assignment
    EquipmentAssignment assignment = new EquipmentAssignment();
    assignment.setEquipment(equipment);
    assignment.setStudent(student);
    assignment.setEvent(event);
    assignment.setStatus(AssignmentStatus.CHECKED_OUT);
    assignment.setCheckoutDate(Instant.now());
    assignment.setExpectedReturnDate(expectedReturnDate);
    assignment.setAssignmentPurpose(purpose);
    assignment.setCheckoutCondition(equipment.getCondition());
    
    // Update equipment status
    equipment.setStatus(Equipment.EquipmentStatus.CHECKED_OUT);
    equipment.setAssignedTo(student);
    equipmentRepository.save(equipment);
    
    log.info("Equipment {} checked out to student {} for event {}", 
        qrCode, student.getEmail(), event != null ? event.getName() : "practice");
    
    return assignmentRepository.save(assignment);
  }
  
  @Transactional
  public EquipmentAssignment returnEquipment(UUID assignmentId, Equipment.EquipmentCondition returnCondition, 
                                           String damageNotes, UUID returnedById) {
    
    EquipmentAssignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));
    
    if (assignment.getStatus() != AssignmentStatus.CHECKED_OUT) {
      throw new IllegalStateException("Assignment is not in checked out state: " + assignmentId);
    }
    
    // Update assignment
    assignment.setStatus(AssignmentStatus.PENDING_RETURN);
    assignment.setActualReturnDate(Instant.now());
    assignment.setReturnCondition(returnCondition);
    assignment.setDamageNotes(damageNotes);
    
    // Update equipment
    Equipment equipment = assignment.getEquipment();
    equipment.setCondition(returnCondition);
    equipment.setAssignedTo(null);
    
    // Determine if approval is needed based on condition change or damage
    if (returnCondition != assignment.getCheckoutCondition() || 
        (damageNotes != null && !damageNotes.trim().isEmpty())) {
      log.info("Equipment {} returned with condition change or damage, requiring approval", 
          equipment.getQrCode());
      // Keep status as PENDING_RETURN for approval workflow
    } else {
      // No issues, can be marked as available immediately
      assignment.setStatus(AssignmentStatus.RETURNED);
      equipment.setStatus(Equipment.EquipmentStatus.AVAILABLE);
      log.info("Equipment {} returned in good condition, marked as available", equipment.getQrCode());
    }
    
    equipmentRepository.save(equipment);
    return assignmentRepository.save(assignment);
  }
  
  @Transactional
  public EquipmentAssignment approveReturn(UUID assignmentId, UUID approverId, String approvalNotes) {
    EquipmentAssignment assignment = assignmentRepository.findById(assignmentId)
        .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + assignmentId));
    
    if (assignment.getStatus() != AssignmentStatus.PENDING_RETURN) {
      throw new IllegalStateException("Assignment is not pending return approval: " + assignmentId);
    }
    
    User approver = userRepository.findById(approverId)
        .orElseThrow(() -> new IllegalArgumentException("Approver not found: " + approverId));
    
    assignment.setStatus(AssignmentStatus.RETURNED);
    assignment.setSupervisorApprovedBy(approver.getId());
    assignment.setReturnNotes(approvalNotes);
    
    // Update equipment status to available
    Equipment equipment = assignment.getEquipment();
    equipment.setStatus(Equipment.EquipmentStatus.AVAILABLE);
    equipmentRepository.save(equipment);
    
    log.info("Equipment return approved by {} for assignment {}", approver.getEmail(), assignmentId);
    
    return assignmentRepository.save(assignment);
  }
  
  // Query operations
  public List<EquipmentAssignment> findAssignmentsByStudent(UUID studentId) {
    return assignmentRepository.findByStudent_Id(studentId);
  }
  
  public List<EquipmentAssignment> findActiveAssignmentsByStudent(UUID studentId) {
    return assignmentRepository.findActiveAssignmentsByStudent(studentId);
  }
  
  public List<EquipmentAssignment> findAssignmentsByEquipment(UUID equipmentId) {
    return assignmentRepository.findByEquipment_Id(equipmentId);
  }
  
  public Optional<EquipmentAssignment> findActiveAssignmentByEquipment(UUID equipmentId) {
    return assignmentRepository.findActiveAssignmentByEquipment(equipmentId);
  }
  
  public List<EquipmentAssignment> findAssignmentsByStatus(AssignmentStatus status) {
    return assignmentRepository.findByStatus(status);
  }
  
  public List<EquipmentAssignment> findAssignmentsByEvent(UUID eventId) {
    return assignmentRepository.findByEvent_Id(eventId);
  }
  
  // Overdue and due soon queries
  public List<EquipmentAssignment> findOverdueAssignments() {
    return assignmentRepository.findOverdueAssignments();
  }
  
  public List<EquipmentAssignment> findAssignmentsDueSoon(int daysAhead) {
    Instant dueDate = Instant.now().plus(daysAhead, ChronoUnit.DAYS);
    return assignmentRepository.findAssignmentsDueSoon(dueDate);
  }
  
  public List<EquipmentAssignment> findAssignmentsDueTomorrow() {
    return findAssignmentsDueSoon(1);
  }
  
  // Assignment history and analytics
  public List<EquipmentAssignment> findAssignmentHistoryByStudent(UUID studentId) {
    return assignmentRepository.findAssignmentHistoryByStudent(studentId);
  }
  
  public List<EquipmentAssignment> findAssignmentHistoryByEquipment(UUID equipmentId) {
    return assignmentRepository.findAssignmentHistoryByEquipment(equipmentId);
  }
  
  public List<EquipmentAssignment> findRecentCheckouts(int daysBack) {
    Instant since = Instant.now().minus(daysBack, ChronoUnit.DAYS);
    return assignmentRepository.findRecentCheckouts(since);
  }
  
  public List<EquipmentAssignment> findRecentReturns(int daysBack) {
    Instant since = Instant.now().minus(daysBack, ChronoUnit.DAYS);
    return assignmentRepository.findRecentReturns(since);
  }
  
  // Approval workflow queries
  public List<EquipmentAssignment> findAssignmentsPendingPeerReview() {
    return assignmentRepository.findAssignmentsPendingPeerReview();
  }
  
  public List<EquipmentAssignment> findAssignmentsPendingSupervisorApproval() {
    return assignmentRepository.findAssignmentsPendingSupervisorApproval();
  }
  
  public List<EquipmentAssignment> findAssignmentsWithConditionChanges() {
    return assignmentRepository.findAssignmentsWithConditionChanges();
  }
  
  public List<EquipmentAssignment> findAssignmentsWithDamage() {
    return assignmentRepository.findAssignmentsWithDamage();
  }
  
  // Statistical queries
  public long countAssignmentsByStatus(AssignmentStatus status) {
    return assignmentRepository.countByStatus(status);
  }
  
  public List<Object[]> getAssignmentStatsByPurpose() {
    return assignmentRepository.countAssignmentsByPurpose();
  }
  
  public List<Object[]> getCheckoutStatsByDate(int daysBack) {
    Instant startDate = Instant.now().minus(daysBack, ChronoUnit.DAYS);
    return assignmentRepository.getCheckoutStatsByDate(startDate);
  }
  
  public Double getAverageAssignmentDurationInDays() {
    return assignmentRepository.getAverageAssignmentDurationInDays();
  }
  
  // Bulk operations
  @Transactional
  public List<EquipmentAssignment> extendMultipleAssignments(List<UUID> assignmentIds, Instant newReturnDate) {
    log.info("Extending {} assignments to new return date: {}", assignmentIds.size(), newReturnDate);
    
    return assignmentIds.stream()
        .map(id -> {
          EquipmentAssignment assignment = assignmentRepository.findById(id)
              .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + id));
          
          if (assignment.getStatus() != AssignmentStatus.CHECKED_OUT) {
            throw new IllegalStateException("Assignment is not checked out: " + id);
          }
          
          assignment.setExpectedReturnDate(newReturnDate);
          return assignmentRepository.save(assignment);
        })
        .toList();
  }
  
  @Transactional
  public void sendOverdueNotifications() {
    List<EquipmentAssignment> overdueAssignments = findOverdueAssignments();
    
    log.info("Found {} overdue assignments for notification", overdueAssignments.size());
    
    for (EquipmentAssignment assignment : overdueAssignments) {
      // TODO: Implement notification system (email/SMS/push notification)
      log.info("Overdue notification needed for student: {} - Equipment: {}", 
          assignment.getStudent().getEmail(), 
          assignment.getEquipment().getQrCode());
    }
  }
}