package com.band.service;

import com.band.domain.Equipment;
import com.band.domain.Equipment.EquipmentCategory;
import com.band.domain.Equipment.EquipmentStatus;
import com.band.domain.Equipment.EquipmentCondition;
import com.band.repo.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class EquipmentService {
  
  private final EquipmentRepository equipmentRepository;
  
  // Basic CRUD operations
  public Page<Equipment> findAllEquipment(Pageable pageable) {
    return equipmentRepository.findAll(pageable);
  }
  
  public Optional<Equipment> findById(UUID id) {
    return equipmentRepository.findById(id);
  }
  
  public Optional<Equipment> findByQrCode(String qrCode) {
    log.debug("Finding equipment by QR code: {}", qrCode);
    return equipmentRepository.findByQrCode(qrCode);
  }
  
  @Transactional
  public Equipment saveEquipment(Equipment equipment) {
    log.info("Saving equipment: {} - {}", equipment.getMake(), equipment.getModel());
    return equipmentRepository.save(equipment);
  }
  
  @Transactional
  public void deleteEquipment(UUID id) {
    log.info("Deleting equipment with ID: {}", id);
    equipmentRepository.deleteById(id);
  }
  
  // Equipment availability and status
  public List<Equipment> findAvailableEquipment() {
    return equipmentRepository.findByStatusAndActiveTrue(EquipmentStatus.AVAILABLE);
  }
  
  public List<Equipment> findAvailableEquipmentByCategory(EquipmentCategory category) {
    return equipmentRepository.findByCategoryAndStatus(category, EquipmentStatus.AVAILABLE);
  }
  
  public List<Equipment> findEquipmentByStatus(EquipmentStatus status) {
    return equipmentRepository.findByStatus(status);
  }
  
  @Transactional
  public Equipment updateEquipmentStatus(UUID equipmentId, EquipmentStatus newStatus) {
    Equipment equipment = equipmentRepository.findById(equipmentId)
        .orElseThrow(() -> new IllegalArgumentException("Equipment not found: " + equipmentId));
    
    log.info("Updating equipment {} status from {} to {}", 
        equipment.getQrCode(), equipment.getStatus(), newStatus);
    
    equipment.setStatus(newStatus);
    return equipmentRepository.save(equipment);
  }
  
  // Equipment condition management
  public List<Equipment> findEquipmentByCondition(EquipmentCondition condition) {
    return equipmentRepository.findByCondition(condition);
  }
  
  @Transactional
  public Equipment updateEquipmentCondition(UUID equipmentId, EquipmentCondition newCondition, String notes) {
    Equipment equipment = equipmentRepository.findById(equipmentId)
        .orElseThrow(() -> new IllegalArgumentException("Equipment not found: " + equipmentId));
    
    log.info("Updating equipment {} condition from {} to {}", 
        equipment.getQrCode(), equipment.getCondition(), newCondition);
    
    equipment.setCondition(newCondition);
    if (notes != null && !notes.trim().isEmpty()) {
      equipment.setNotes(notes);
    }
    
    return equipmentRepository.save(equipment);
  }
  
  // Search functionality
  public List<Equipment> searchEquipment(String searchTerm) {
    log.debug("Searching equipment with term: {}", searchTerm);
    return equipmentRepository.searchEquipment(searchTerm);
  }
  
  public List<Equipment> findEquipmentByCategory(EquipmentCategory category) {
    return equipmentRepository.findByCategory(category);
  }
  
  public List<Equipment> findEquipmentByLocation(String location) {
    return equipmentRepository.findByLocation(location);
  }
  
  // Maintenance-related queries
  public List<Equipment> findEquipmentDueForMaintenance() {
    return equipmentRepository.findEquipmentDueForMaintenance(LocalDate.now());
  }
  
  public List<Equipment> findOverdueMaintenanceEquipment() {
    return equipmentRepository.findEquipmentOverdueForMaintenance(LocalDate.now().minusMonths(1));
  }
  
  public List<Equipment> findUpcomingMaintenanceEquipment(int daysAhead) {
    LocalDate endDate = LocalDate.now().plusDays(daysAhead);
    return equipmentRepository.findByNextMaintenanceDateBetween(LocalDate.now(), endDate);
  }
  
  // Assignment-related queries
  public List<Equipment> findEquipmentAssignedToUser(UUID userId) {
    return equipmentRepository.findByAssignedTo_Id(userId);
  }
  
  public List<Equipment> findOverdueEquipment() {
    return equipmentRepository.findOverdueEquipment();
  }
  
  // Statistical and reporting functions
  public long countEquipmentByCategory(EquipmentCategory category) {
    return equipmentRepository.countByCategory(category);
  }
  
  public long countEquipmentByStatus(EquipmentStatus status) {
    return equipmentRepository.countByStatus(status);
  }
  
  public List<Object[]> getEquipmentStatsByCategory() {
    return equipmentRepository.countEquipmentByCategory();
  }
  
  public List<Object[]> getEquipmentStatsByStatus() {
    return equipmentRepository.countEquipmentByStatus();
  }
  
  public List<Object[]> getEquipmentStatsByCondition() {
    return equipmentRepository.countEquipmentByCondition();
  }
  
  public Double getTotalEquipmentValue() {
    return equipmentRepository.getTotalEquipmentValue();
  }
  
  public Double getTotalValueByCategory(EquipmentCategory category) {
    return equipmentRepository.getTotalValueByCategory(category);
  }
  
  // Bulk operations
  @Transactional
  public List<Equipment> updateMultipleEquipmentStatus(List<UUID> equipmentIds, EquipmentStatus newStatus) {
    log.info("Bulk updating status for {} equipment items to {}", equipmentIds.size(), newStatus);
    
    return equipmentIds.stream()
        .map(id -> updateEquipmentStatus(id, newStatus))
        .toList();
  }
  
  @Transactional
  public Equipment markEquipmentAsInactive(UUID equipmentId, String reason) {
    Equipment equipment = equipmentRepository.findById(equipmentId)
        .orElseThrow(() -> new IllegalArgumentException("Equipment not found: " + equipmentId));
    
    log.info("Marking equipment {} as inactive. Reason: {}", equipment.getQrCode(), reason);
    
    equipment.setActive(false);
    equipment.setStatus(EquipmentStatus.RETIRED);
    if (reason != null && !reason.trim().isEmpty()) {
      equipment.setNotes(equipment.getNotes() + "\nDeactivated: " + reason);
    }
    
    return equipmentRepository.save(equipment);
  }
  
  // QR Code validation and generation helpers
  public boolean isQrCodeUnique(String qrCode) {
    return equipmentRepository.findByQrCode(qrCode).isEmpty();
  }
  
  public String generateNextQrCode(EquipmentCategory category) {
    String prefix = getQrCodePrefix(category);
    long count = equipmentRepository.countByCategory(category);
    return String.format("%s_%03d", prefix, count + 1);
  }
  
  private String getQrCodePrefix(EquipmentCategory category) {
    return switch (category) {
      case BRASS -> "QR_BRASS";
      case WOODWIND -> "QR_WOODWIND";
      case PERCUSSION -> "QR_PERCUSSION";
      case STRING -> "QR_STRING";
      case ELECTRONIC -> "QR_ELECTRONIC";
      case ACCESSORY -> "QR_ACCESSORY";
    };
  }
}