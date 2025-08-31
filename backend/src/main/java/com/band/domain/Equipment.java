package com.band.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "equipment")
public class Equipment {
  @Id
  @GeneratedValue
  private UUID id;

  @NotBlank
  @Column(name = "qr_code", nullable = false, unique = true)
  private String qrCode;

  @Column(name = "serial_number")
  private String serialNumber;

  @NotBlank
  @Column(nullable = false)
  private String make;

  @NotBlank
  @Column(nullable = false)
  private String model;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EquipmentCategory category;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EquipmentCondition condition;

  @Column
  private String location;

  @Column
  private String description;

  @Column(name = "purchase_date")
  private LocalDate purchaseDate;

  @Column(name = "purchase_price", columnDefinition = "NUMERIC")
  private Double purchasePrice;

  @Column(name = "warranty_expiration")
  private LocalDate warrantyExpiration;

  @Column(name = "last_maintenance_date")
  private LocalDate lastMaintenanceDate;

  @Column(name = "next_maintenance_date")
  private LocalDate nextMaintenanceDate;

  @Column(name = "maintenance_interval_months")
  private Integer maintenanceIntervalMonths = 6;

  // Current assignment status
  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false)
  private EquipmentStatus status = EquipmentStatus.AVAILABLE;

  // Currently assigned to (if any)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "assigned_to_id")
  private User assignedTo;

  @Column(name = "assignment_date")
  private Instant assignmentDate;

  @Column(name = "expected_return_date")
  private Instant expectedReturnDate;

  // Equipment assignments history
  @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<EquipmentAssignment> assignments = new HashSet<>();

  // Maintenance records
  @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<EquipmentMaintenance> maintenanceRecords = new HashSet<>();

  // Notes and comments
  @Column(columnDefinition = "TEXT")
  private String notes;

  // Audit fields
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at")
  private Instant updatedAt = Instant.now();

  @Column(name = "active", nullable = false)
  private Boolean active = true;

  // Constructors
  public Equipment() {}

  public Equipment(String qrCode, String make, String model, EquipmentCategory category) {
    this.qrCode = qrCode;
    this.make = make;
    this.model = model;
    this.category = category;
    this.condition = EquipmentCondition.GOOD;
  }

  // Lifecycle callbacks
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }

  // Helper methods
  public boolean isAvailable() {
    return this.status == EquipmentStatus.AVAILABLE;
  }

  public boolean isCheckedOut() {
    return this.status == EquipmentStatus.CHECKED_OUT;
  }

  public boolean needsMaintenance() {
    if (nextMaintenanceDate == null) return false;
    return nextMaintenanceDate.isBefore(LocalDate.now().plusDays(30));
  }

  public boolean isOverdue() {
    if (status != EquipmentStatus.CHECKED_OUT || expectedReturnDate == null) {
      return false;
    }
    return expectedReturnDate.isBefore(Instant.now());
  }

  public String getDisplayName() {
    return String.format("%s %s (%s)", make, model, qrCode);
  }

  // Equipment enums
  public enum EquipmentCategory {
    BRASS("Brass"),
    WOODWIND("Woodwind"), 
    PERCUSSION("Percussion"),
    STRING("String"),
    ELECTRONIC("Electronic"),
    ACCESSORY("Accessory");

    private final String displayName;

    EquipmentCategory(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  public enum EquipmentCondition {
    EXCELLENT("Excellent"),
    GOOD("Good"),
    FAIR("Fair"),
    POOR("Poor"),
    REPAIR_NEEDED("Repair Needed");

    private final String displayName;

    EquipmentCondition(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  public enum EquipmentStatus {
    AVAILABLE("Available"),
    CHECKED_OUT("Checked Out"),
    IN_MAINTENANCE("In Maintenance"),
    RETIRED("Retired"),
    MISSING("Missing");

    private final String displayName;

    EquipmentStatus(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  // Getters and Setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getQrCode() { return qrCode; }
  public void setQrCode(String qrCode) { this.qrCode = qrCode; }

  public String getSerialNumber() { return serialNumber; }
  public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

  public String getMake() { return make; }
  public void setMake(String make) { this.make = make; }

  public String getModel() { return model; }
  public void setModel(String model) { this.model = model; }

  public EquipmentCategory getCategory() { return category; }
  public void setCategory(EquipmentCategory category) { this.category = category; }

  public EquipmentCondition getCondition() { return condition; }
  public void setCondition(EquipmentCondition condition) { this.condition = condition; }

  public String getLocation() { return location; }
  public void setLocation(String location) { this.location = location; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public LocalDate getPurchaseDate() { return purchaseDate; }
  public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

  public Double getPurchasePrice() { return purchasePrice; }
  public void setPurchasePrice(Double purchasePrice) { this.purchasePrice = purchasePrice; }

  public LocalDate getWarrantyExpiration() { return warrantyExpiration; }
  public void setWarrantyExpiration(LocalDate warrantyExpiration) { this.warrantyExpiration = warrantyExpiration; }

  public LocalDate getLastMaintenanceDate() { return lastMaintenanceDate; }
  public void setLastMaintenanceDate(LocalDate lastMaintenanceDate) { this.lastMaintenanceDate = lastMaintenanceDate; }

  public LocalDate getNextMaintenanceDate() { return nextMaintenanceDate; }
  public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) { this.nextMaintenanceDate = nextMaintenanceDate; }

  public Integer getMaintenanceIntervalMonths() { return maintenanceIntervalMonths; }
  public void setMaintenanceIntervalMonths(Integer maintenanceIntervalMonths) { this.maintenanceIntervalMonths = maintenanceIntervalMonths; }

  public EquipmentStatus getStatus() { return status; }
  public void setStatus(EquipmentStatus status) { this.status = status; }

  public User getAssignedTo() { return assignedTo; }
  public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

  public Instant getAssignmentDate() { return assignmentDate; }
  public void setAssignmentDate(Instant assignmentDate) { this.assignmentDate = assignmentDate; }

  public Instant getExpectedReturnDate() { return expectedReturnDate; }
  public void setExpectedReturnDate(Instant expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }

  public Set<EquipmentAssignment> getAssignments() { return assignments; }
  public void setAssignments(Set<EquipmentAssignment> assignments) { this.assignments = assignments; }

  public Set<EquipmentMaintenance> getMaintenanceRecords() { return maintenanceRecords; }
  public void setMaintenanceRecords(Set<EquipmentMaintenance> maintenanceRecords) { this.maintenanceRecords = maintenanceRecords; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}