package com.band.controller;

import com.band.domain.Equipment;
import com.band.domain.Equipment.EquipmentCategory;
import com.band.domain.Equipment.EquipmentStatus;
import com.band.domain.Equipment.EquipmentCondition;
import com.band.service.EquipmentService;
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
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Equipment Management", description = "APIs for managing band equipment inventory")
public class EquipmentController {
  
  private final EquipmentService equipmentService;
  
  @GetMapping
  @Operation(summary = "Get all equipment with pagination", description = "Retrieve all equipment with pagination support")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Page<Equipment>> getAllEquipment(
      @PageableDefault(size = 20) Pageable pageable) {
    
    Page<Equipment> equipment = equipmentService.findAllEquipment(pageable);
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/{id}")
  @Operation(summary = "Get equipment by ID", description = "Retrieve a specific equipment item by its ID")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Equipment> getEquipmentById(
      @Parameter(description = "Equipment ID") @PathVariable UUID id) {
    
    return equipmentService.findById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
  
  @GetMapping("/qr/{qrCode}")
  @Operation(summary = "Get equipment by QR code", description = "Retrieve equipment using QR code scan")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Equipment> getEquipmentByQrCode(
      @Parameter(description = "QR Code") @PathVariable String qrCode) {
    
    return equipmentService.findByQrCode(qrCode)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }
  
  @PostMapping
  @Operation(summary = "Create new equipment", description = "Add a new equipment item to the inventory")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Equipment> createEquipment(@Valid @RequestBody Equipment equipment) {
    Equipment savedEquipment = equipmentService.saveEquipment(equipment);
    return ResponseEntity.ok(savedEquipment);
  }
  
  @PutMapping("/{id}")
  @Operation(summary = "Update equipment", description = "Update an existing equipment item")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Equipment> updateEquipment(
      @PathVariable UUID id, @Valid @RequestBody Equipment equipment) {
    
    if (!equipmentService.findById(id).isPresent()) {
      return ResponseEntity.notFound().build();
    }
    
    equipment.setId(id);
    Equipment updatedEquipment = equipmentService.saveEquipment(equipment);
    return ResponseEntity.ok(updatedEquipment);
  }
  
  @DeleteMapping("/{id}")
  @Operation(summary = "Delete equipment", description = "Remove equipment from inventory")
  @PreAuthorize("hasRole('EQUIPMENT_MANAGER')")
  public ResponseEntity<Void> deleteEquipment(@PathVariable UUID id) {
    if (!equipmentService.findById(id).isPresent()) {
      return ResponseEntity.notFound().build();
    }
    
    equipmentService.deleteEquipment(id);
    return ResponseEntity.noContent().build();
  }
  
  // Status and availability endpoints
  @GetMapping("/available")
  @Operation(summary = "Get available equipment", description = "Retrieve all equipment available for checkout")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<Equipment>> getAvailableEquipment() {
    List<Equipment> equipment = equipmentService.findAvailableEquipment();
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/available/category/{category}")
  @Operation(summary = "Get available equipment by category", description = "Retrieve available equipment filtered by category")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<Equipment>> getAvailableEquipmentByCategory(
      @PathVariable EquipmentCategory category) {
    
    List<Equipment> equipment = equipmentService.findAvailableEquipmentByCategory(category);
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/status/{status}")
  @Operation(summary = "Get equipment by status", description = "Retrieve equipment filtered by status")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> getEquipmentByStatus(@PathVariable EquipmentStatus status) {
    List<Equipment> equipment = equipmentService.findEquipmentByStatus(status);
    return ResponseEntity.ok(equipment);
  }
  
  @PutMapping("/{id}/status")
  @Operation(summary = "Update equipment status", description = "Change the status of equipment")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Equipment> updateEquipmentStatus(
      @PathVariable UUID id, 
      @RequestBody Map<String, EquipmentStatus> statusUpdate) {
    
    EquipmentStatus newStatus = statusUpdate.get("status");
    if (newStatus == null) {
      return ResponseEntity.badRequest().build();
    }
    
    try {
      Equipment updatedEquipment = equipmentService.updateEquipmentStatus(id, newStatus);
      return ResponseEntity.ok(updatedEquipment);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }
  
  // Condition management endpoints
  @GetMapping("/condition/{condition}")
  @Operation(summary = "Get equipment by condition", description = "Retrieve equipment filtered by condition")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> getEquipmentByCondition(@PathVariable EquipmentCondition condition) {
    List<Equipment> equipment = equipmentService.findEquipmentByCondition(condition);
    return ResponseEntity.ok(equipment);
  }
  
  @PutMapping("/{id}/condition")
  @Operation(summary = "Update equipment condition", description = "Change the condition of equipment")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Equipment> updateEquipmentCondition(
      @PathVariable UUID id, 
      @RequestBody Map<String, Object> conditionUpdate) {
    
    EquipmentCondition newCondition = EquipmentCondition.valueOf((String) conditionUpdate.get("condition"));
    String notes = (String) conditionUpdate.get("notes");
    
    try {
      Equipment updatedEquipment = equipmentService.updateEquipmentCondition(id, newCondition, notes);
      return ResponseEntity.ok(updatedEquipment);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }
  
  // Search and filtering endpoints
  @GetMapping("/search")
  @Operation(summary = "Search equipment", description = "Search equipment by make, model, serial number, or QR code")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> searchEquipment(
      @RequestParam("q") String searchTerm) {
    
    List<Equipment> equipment = equipmentService.searchEquipment(searchTerm);
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/category/{category}")
  @Operation(summary = "Get equipment by category", description = "Retrieve equipment filtered by category")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> getEquipmentByCategory(@PathVariable EquipmentCategory category) {
    List<Equipment> equipment = equipmentService.findEquipmentByCategory(category);
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/location/{location}")
  @Operation(summary = "Get equipment by location", description = "Retrieve equipment filtered by location")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> getEquipmentByLocation(@PathVariable String location) {
    List<Equipment> equipment = equipmentService.findEquipmentByLocation(location);
    return ResponseEntity.ok(equipment);
  }
  
  // Maintenance-related endpoints
  @GetMapping("/maintenance/due")
  @Operation(summary = "Get equipment due for maintenance", description = "Retrieve equipment that needs maintenance")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<Equipment>> getEquipmentDueForMaintenance() {
    List<Equipment> equipment = equipmentService.findEquipmentDueForMaintenance();
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/maintenance/overdue")
  @Operation(summary = "Get overdue maintenance equipment", description = "Retrieve equipment with overdue maintenance")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<Equipment>> getOverdueMaintenanceEquipment() {
    List<Equipment> equipment = equipmentService.findOverdueMaintenanceEquipment();
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/maintenance/upcoming")
  @Operation(summary = "Get upcoming maintenance equipment", description = "Retrieve equipment with upcoming maintenance")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<Equipment>> getUpcomingMaintenanceEquipment(
      @RequestParam(defaultValue = "7") int daysAhead) {
    
    List<Equipment> equipment = equipmentService.findUpcomingMaintenanceEquipment(daysAhead);
    return ResponseEntity.ok(equipment);
  }
  
  // Assignment and overdue endpoints
  @GetMapping("/assigned/user/{userId}")
  @Operation(summary = "Get equipment assigned to user", description = "Retrieve equipment assigned to a specific user")
  @PreAuthorize("hasAnyRole('STUDENT', 'BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> getEquipmentAssignedToUser(@PathVariable UUID userId) {
    List<Equipment> equipment = equipmentService.findEquipmentAssignedToUser(userId);
    return ResponseEntity.ok(equipment);
  }
  
  @GetMapping("/overdue")
  @Operation(summary = "Get overdue equipment", description = "Retrieve equipment that is past its return date")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Equipment>> getOverdueEquipment() {
    List<Equipment> equipment = equipmentService.findOverdueEquipment();
    return ResponseEntity.ok(equipment);
  }
  
  // Statistics endpoints
  @GetMapping("/stats/category")
  @Operation(summary = "Get equipment statistics by category", description = "Retrieve equipment count statistics by category")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Object[]>> getEquipmentStatsByCategory() {
    List<Object[]> stats = equipmentService.getEquipmentStatsByCategory();
    return ResponseEntity.ok(stats);
  }
  
  @GetMapping("/stats/status")
  @Operation(summary = "Get equipment statistics by status", description = "Retrieve equipment count statistics by status")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Object[]>> getEquipmentStatsByStatus() {
    List<Object[]> stats = equipmentService.getEquipmentStatsByStatus();
    return ResponseEntity.ok(stats);
  }
  
  @GetMapping("/stats/condition")
  @Operation(summary = "Get equipment statistics by condition", description = "Retrieve equipment count statistics by condition")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<List<Object[]>> getEquipmentStatsByCondition() {
    List<Object[]> stats = equipmentService.getEquipmentStatsByCondition();
    return ResponseEntity.ok(stats);
  }
  
  @GetMapping("/stats/value")
  @Operation(summary = "Get total equipment value", description = "Retrieve total monetary value of all equipment")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Map<String, Double>> getTotalEquipmentValue() {
    Double totalValue = equipmentService.getTotalEquipmentValue();
    return ResponseEntity.ok(Map.of("totalValue", totalValue != null ? totalValue : 0.0));
  }
  
  @GetMapping("/stats/value/category/{category}")
  @Operation(summary = "Get equipment value by category", description = "Retrieve total value of equipment by category")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER', 'SUPERVISOR')")
  public ResponseEntity<Map<String, Double>> getTotalValueByCategory(@PathVariable EquipmentCategory category) {
    Double categoryValue = equipmentService.getTotalValueByCategory(category);
    return ResponseEntity.ok(Map.of("categoryValue", categoryValue != null ? categoryValue : 0.0));
  }
  
  // Bulk operations
  @PutMapping("/bulk/status")
  @Operation(summary = "Update multiple equipment status", description = "Bulk update status for multiple equipment items")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<List<Equipment>> updateMultipleEquipmentStatus(
      @RequestBody Map<String, Object> bulkUpdate) {
    
    @SuppressWarnings("unchecked")
    List<String> equipmentIdStrings = (List<String>) bulkUpdate.get("equipmentIds");
    List<UUID> equipmentIds = equipmentIdStrings.stream()
        .map(UUID::fromString)
        .toList();
    
    EquipmentStatus newStatus = EquipmentStatus.valueOf((String) bulkUpdate.get("status"));
    
    List<Equipment> updatedEquipment = equipmentService.updateMultipleEquipmentStatus(equipmentIds, newStatus);
    return ResponseEntity.ok(updatedEquipment);
  }
  
  @PutMapping("/{id}/deactivate")
  @Operation(summary = "Deactivate equipment", description = "Mark equipment as inactive with reason")
  @PreAuthorize("hasRole('EQUIPMENT_MANAGER')")
  public ResponseEntity<Equipment> deactivateEquipment(
      @PathVariable UUID id, 
      @RequestBody Map<String, String> deactivationRequest) {
    
    String reason = deactivationRequest.get("reason");
    
    try {
      Equipment deactivatedEquipment = equipmentService.markEquipmentAsInactive(id, reason);
      return ResponseEntity.ok(deactivatedEquipment);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.notFound().build();
    }
  }
  
  // QR Code utilities
  @GetMapping("/qr/validate/{qrCode}")
  @Operation(summary = "Validate QR code uniqueness", description = "Check if QR code is unique")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Map<String, Boolean>> validateQrCode(@PathVariable String qrCode) {
    boolean isUnique = equipmentService.isQrCodeUnique(qrCode);
    return ResponseEntity.ok(Map.of("isUnique", isUnique));
  }
  
  @GetMapping("/qr/generate/{category}")
  @Operation(summary = "Generate next QR code", description = "Generate next available QR code for category")
  @PreAuthorize("hasAnyRole('BAND_DIRECTOR', 'EQUIPMENT_MANAGER')")
  public ResponseEntity<Map<String, String>> generateNextQrCode(@PathVariable EquipmentCategory category) {
    String nextQrCode = equipmentService.generateNextQrCode(category);
    return ResponseEntity.ok(Map.of("qrCode", nextQrCode));
  }
}