package com.band.repo;

import com.band.domain.EquipmentAssignment;
import com.band.domain.EquipmentAssignment.AssignmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EquipmentAssignmentRepository extends JpaRepository<EquipmentAssignment, UUID> {
  
  // Student-related queries
  List<EquipmentAssignment> findByStudent_Id(UUID studentId);
  List<EquipmentAssignment> findByStudent_Email(String email);
  List<EquipmentAssignment> findByStudent_IdAndStatus(UUID studentId, AssignmentStatus status);
  
  // Equipment-related queries
  List<EquipmentAssignment> findByEquipment_Id(UUID equipmentId);
  List<EquipmentAssignment> findByEquipment_QrCode(String qrCode);
  Optional<EquipmentAssignment> findByEquipment_IdAndStatus(UUID equipmentId, AssignmentStatus status);
  
  // Current active assignments
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.student.id = :studentId AND ea.status = 'CHECKED_OUT'")
  List<EquipmentAssignment> findActiveAssignmentsByStudent(@Param("studentId") UUID studentId);
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.equipment.id = :equipmentId AND ea.status = 'CHECKED_OUT'")
  Optional<EquipmentAssignment> findActiveAssignmentByEquipment(@Param("equipmentId") UUID equipmentId);
  
  // Status-based queries
  List<EquipmentAssignment> findByStatus(AssignmentStatus status);
  List<EquipmentAssignment> findByStatusIn(List<AssignmentStatus> statuses);
  
  // Date-based queries
  List<EquipmentAssignment> findByCheckoutDateBetween(Instant startDate, Instant endDate);
  List<EquipmentAssignment> findByExpectedReturnDateBefore(Instant date);
  List<EquipmentAssignment> findByExpectedReturnDateBetween(Instant startDate, Instant endDate);
  
  // Overdue assignments
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.status = 'CHECKED_OUT' AND ea.expectedReturnDate < CURRENT_TIMESTAMP")
  List<EquipmentAssignment> findOverdueAssignments();
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.status = 'CHECKED_OUT' AND ea.expectedReturnDate BETWEEN CURRENT_TIMESTAMP AND :date")
  List<EquipmentAssignment> findAssignmentsDueSoon(@Param("date") Instant date);
  
  // Assignment history
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.student.id = :studentId ORDER BY ea.checkoutDate DESC")
  List<EquipmentAssignment> findAssignmentHistoryByStudent(@Param("studentId") UUID studentId);
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.equipment.id = :equipmentId ORDER BY ea.checkoutDate DESC")
  List<EquipmentAssignment> findAssignmentHistoryByEquipment(@Param("equipmentId") UUID equipmentId);
  
  // Event-related queries
  List<EquipmentAssignment> findByEvent_Id(UUID eventId);
  List<EquipmentAssignment> findByAssignmentPurpose(String purpose);
  
  // Statistical queries
  @Query("SELECT COUNT(ea) FROM EquipmentAssignment ea WHERE ea.status = :status")
  long countByStatus(@Param("status") AssignmentStatus status);
  
  @Query("SELECT ea.assignmentPurpose, COUNT(ea) FROM EquipmentAssignment ea GROUP BY ea.assignmentPurpose")
  List<Object[]> countAssignmentsByPurpose();
  
  @Query("SELECT date(ea.checkoutDate), COUNT(ea) FROM EquipmentAssignment ea " +
         "WHERE ea.checkoutDate >= :startDate GROUP BY date(ea.checkoutDate) ORDER BY date(ea.checkoutDate)")
  List<Object[]> getCheckoutStatsByDate(@Param("startDate") Instant startDate);
  
  // Duration analysis
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.actualReturnDate IS NOT NULL")
  List<EquipmentAssignment> findCompletedAssignments();
  
  // Temporarily disabled due to HQL issue
  // @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (ea.actual_return_date - ea.checkout_date))/86400) FROM equipment_assignments ea " +
  //        "WHERE ea.actual_return_date IS NOT NULL", nativeQuery = true)
  default Double getAverageAssignmentDurationInDays() {
    return 0.0; // Placeholder implementation
  }
  
  // Approval workflow queries
  List<EquipmentAssignment> findByPeerReviewerId(UUID peerReviewerId);
  List<EquipmentAssignment> findBySupervisorApprovedBy(UUID supervisorId);
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.peerReviewerId IS NULL AND ea.status = 'PENDING_RETURN'")
  List<EquipmentAssignment> findAssignmentsPendingPeerReview();
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.peerReviewerId IS NOT NULL " +
         "AND ea.supervisorApprovedBy IS NULL AND ea.status = 'PENDING_RETURN'")
  List<EquipmentAssignment> findAssignmentsPendingSupervisorApproval();
  
  // Damage and condition tracking
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.returnCondition != ea.checkoutCondition")
  List<EquipmentAssignment> findAssignmentsWithConditionChanges();
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.damageNotes IS NOT NULL AND ea.damageNotes != ''")
  List<EquipmentAssignment> findAssignmentsWithDamage();
  
  // Recent activity
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.checkoutDate >= :since ORDER BY ea.checkoutDate DESC")
  List<EquipmentAssignment> findRecentCheckouts(@Param("since") Instant since);
  
  @Query("SELECT ea FROM EquipmentAssignment ea WHERE ea.actualReturnDate >= :since ORDER BY ea.actualReturnDate DESC")
  List<EquipmentAssignment> findRecentReturns(@Param("since") Instant since);
  
  // Additional methods for dashboard service
  List<EquipmentAssignment> findByStudentId(UUID studentId);
  List<EquipmentAssignment> findByStudentIdAndStatus(UUID studentId, AssignmentStatus status);
  List<EquipmentAssignment> findByStudentIdOrderByCreatedAtDesc(UUID studentId);
  List<EquipmentAssignment> findByStatusOrderByCreatedAtDesc(AssignmentStatus status);
  
  @Query("SELECT COUNT(ea) FROM EquipmentAssignment ea WHERE ea.status = 'CHECKED_OUT' AND ea.expectedReturnDate < CURRENT_TIMESTAMP")
  long countOverdueAssignments();
}