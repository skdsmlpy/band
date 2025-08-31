package com.band.repo;

import com.band.domain.Equipment;
import com.band.domain.Equipment.EquipmentCategory;
import com.band.domain.Equipment.EquipmentStatus;
import com.band.domain.Equipment.EquipmentCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, UUID> {
  
  // Basic queries
  Optional<Equipment> findByQrCode(String qrCode);
  List<Equipment> findBySerialNumber(String serialNumber);
  
  // Category and status queries
  List<Equipment> findByCategory(EquipmentCategory category);
  List<Equipment> findByStatus(EquipmentStatus status);
  List<Equipment> findByCategoryAndStatus(EquipmentCategory category, EquipmentStatus status);
  
  // Condition queries
  List<Equipment> findByCondition(EquipmentCondition condition);
  List<Equipment> findByConditionIn(List<EquipmentCondition> conditions);
  
  // Assignment queries
  List<Equipment> findByAssignedTo_Id(UUID userId);
  List<Equipment> findByAssignedTo_Email(String email);
  
  // Location queries
  List<Equipment> findByLocation(String location);
  List<Equipment> findByLocationContainingIgnoreCase(String locationKeyword);
  
  // Maintenance queries
  List<Equipment> findByNextMaintenanceDateBefore(LocalDate date);
  List<Equipment> findByNextMaintenanceDateBetween(LocalDate startDate, LocalDate endDate);
  
  @Query("SELECT e FROM Equipment e WHERE e.nextMaintenanceDate <= :date AND e.status != 'IN_MAINTENANCE'")
  List<Equipment> findEquipmentDueForMaintenance(@Param("date") LocalDate date);
  
  @Query("SELECT e FROM Equipment e WHERE e.lastMaintenanceDate IS NULL OR e.lastMaintenanceDate < :date")
  List<Equipment> findEquipmentOverdueForMaintenance(@Param("date") LocalDate date);
  
  // Active equipment queries
  List<Equipment> findByActiveTrue();
  List<Equipment> findByCategoryAndActiveTrue(EquipmentCategory category);
  List<Equipment> findByStatusAndActiveTrue(EquipmentStatus status);
  
  // Search queries
  @Query("SELECT e FROM Equipment e WHERE " +
         "LOWER(e.make) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
         "LOWER(e.model) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
         "LOWER(e.serialNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
         "LOWER(e.qrCode) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
  List<Equipment> searchEquipment(@Param("searchTerm") String searchTerm);
  
  // Statistical queries
  @Query("SELECT COUNT(e) FROM Equipment e WHERE e.category = :category AND e.active = true")
  long countByCategory(@Param("category") EquipmentCategory category);
  
  @Query("SELECT COUNT(e) FROM Equipment e WHERE e.status = :status AND e.active = true")
  long countByStatus(@Param("status") EquipmentStatus status);
  
  @Query("SELECT e.category, COUNT(e) FROM Equipment e WHERE e.active = true GROUP BY e.category")
  List<Object[]> countEquipmentByCategory();
  
  @Query("SELECT e.status, COUNT(e) FROM Equipment e WHERE e.active = true GROUP BY e.status")
  List<Object[]> countEquipmentByStatus();
  
  @Query("SELECT e.condition, COUNT(e) FROM Equipment e WHERE e.active = true GROUP BY e.condition")
  List<Object[]> countEquipmentByCondition();
  
  // Value queries
  @Query("SELECT SUM(e.purchasePrice) FROM Equipment e WHERE e.active = true")
  Double getTotalEquipmentValue();
  
  @Query("SELECT SUM(e.purchasePrice) FROM Equipment e WHERE e.category = :category AND e.active = true")
  Double getTotalValueByCategory(@Param("category") EquipmentCategory category);
  
  // Advanced queries for dashboard
  @Query("SELECT e FROM Equipment e WHERE e.assignedTo IS NOT NULL AND e.expectedReturnDate < CURRENT_TIMESTAMP")
  List<Equipment> findOverdueEquipment();
  
  @Query("SELECT e FROM Equipment e WHERE e.status = 'CHECKED_OUT' AND e.expectedReturnDate BETWEEN CURRENT_TIMESTAMP AND :date")
  List<Equipment> findEquipmentDueSoon(@Param("date") java.time.Instant date);
  
  @Query("SELECT e FROM Equipment e WHERE e.warrantyExpiration IS NOT NULL AND e.warrantyExpiration <= :date")
  List<Equipment> findEquipmentWithExpiringWarranty(@Param("date") LocalDate date);
  
  // Additional count methods for dashboard
  long countByActiveTrue();
  long countByStatusAndActiveTrue(EquipmentStatus status);
}