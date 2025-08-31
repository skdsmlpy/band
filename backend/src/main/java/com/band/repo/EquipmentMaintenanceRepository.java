package com.band.repo;

import com.band.domain.EquipmentMaintenance;
import com.band.domain.EquipmentMaintenance.MaintenanceType;
import com.band.domain.EquipmentMaintenance.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface EquipmentMaintenanceRepository extends JpaRepository<EquipmentMaintenance, UUID> {
  
  // Equipment-related queries
  List<EquipmentMaintenance> findByEquipment_Id(UUID equipmentId);
  List<EquipmentMaintenance> findByEquipment_QrCode(String qrCode);
  
  // Maintenance type and status queries
  List<EquipmentMaintenance> findByMaintenanceType(MaintenanceType type);
  List<EquipmentMaintenance> findByStatus(MaintenanceStatus status);
  List<EquipmentMaintenance> findByMaintenanceTypeAndStatus(MaintenanceType type, MaintenanceStatus status);
  
  // Technician queries
  List<EquipmentMaintenance> findByTechnicianName(String technicianName);
  
  // Date-based queries
  List<EquipmentMaintenance> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
  List<EquipmentMaintenance> findByCompletedDateBetween(LocalDate startDate, LocalDate endDate);
  List<EquipmentMaintenance> findByScheduledDateBefore(LocalDate date);
  
  // Active maintenance queries
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.status IN ('SCHEDULED', 'IN_PROGRESS')")
  List<EquipmentMaintenance> findActiveMaintenance();
  
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.equipment.id = :equipmentId AND em.status IN ('SCHEDULED', 'IN_PROGRESS')")
  List<EquipmentMaintenance> findActiveMaintenanceByEquipment(@Param("equipmentId") UUID equipmentId);
  
  // Overdue maintenance
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.status = 'SCHEDULED' AND em.scheduledDate < CURRENT_DATE")
  List<EquipmentMaintenance> findOverdueMaintenance();
  
  // Upcoming maintenance
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.status = 'SCHEDULED' AND em.scheduledDate BETWEEN CURRENT_DATE AND :date")
  List<EquipmentMaintenance> findUpcomingMaintenance(@Param("date") LocalDate date);
  
  // Cost and duration analysis
  @Query("SELECT AVG(em.actualCost) FROM EquipmentMaintenance em WHERE em.actualCost IS NOT NULL AND em.status = 'COMPLETED'")
  Double getAverageMaintenanceCost();
  
  @Query("SELECT SUM(em.actualCost) FROM EquipmentMaintenance em WHERE em.actualCost IS NOT NULL AND em.completedDate >= :since")
  Double getTotalMaintenanceCostSince(@Param("since") LocalDate since);
  
  @Query(value = "SELECT AVG(EXTRACT(EPOCH FROM (em.completed_date - em.scheduled_date))/3600) FROM equipment_maintenances em " +
         "WHERE em.completed_date IS NOT NULL AND em.status = 'COMPLETED'", nativeQuery = true)
  Double getAverageMaintenanceDurationInHours();
  
  // Equipment maintenance history
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.equipment.id = :equipmentId ORDER BY em.scheduledDate DESC")
  List<EquipmentMaintenance> findMaintenanceHistoryByEquipment(@Param("equipmentId") UUID equipmentId);
  
  // Recent maintenance activity
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.completedDate >= :since ORDER BY em.completedDate DESC")
  List<EquipmentMaintenance> findRecentCompletedMaintenance(@Param("since") LocalDate since);
  
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.scheduledDate >= :since ORDER BY em.scheduledDate DESC")
  List<EquipmentMaintenance> findRecentlyScheduledMaintenance(@Param("since") LocalDate since);
  
  // Statistical queries
  @Query("SELECT em.maintenanceType, COUNT(em) FROM EquipmentMaintenance em GROUP BY em.maintenanceType")
  List<Object[]> countMaintenanceByType();
  
  @Query("SELECT em.status, COUNT(em) FROM EquipmentMaintenance em GROUP BY em.status")
  List<Object[]> countMaintenanceByStatus();
  
  @Query("SELECT date(em.scheduledDate), COUNT(em) FROM EquipmentMaintenance em " +
         "WHERE em.scheduledDate >= :startDate GROUP BY date(em.scheduledDate) ORDER BY date(em.scheduledDate)")
  List<Object[]> getMaintenanceStatsByDate(@Param("startDate") LocalDate startDate);
  
  // Equipment category maintenance patterns
  @Query("SELECT e.category, COUNT(em) FROM EquipmentMaintenance em JOIN em.equipment e " +
         "WHERE em.completedDate >= :since GROUP BY e.category")
  List<Object[]> getMaintenanceCountByEquipmentCategory(@Param("since") LocalDate since);
  
  // Critical maintenance alerts
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.priority = 'HIGH' AND em.status != 'COMPLETED'")
  List<EquipmentMaintenance> findHighPriorityMaintenance();
  
  @Query("SELECT em FROM EquipmentMaintenance em WHERE em.notes LIKE %:keyword%")
  List<EquipmentMaintenance> findMaintenanceByNotesKeyword(@Param("keyword") String keyword);
}