package com.band.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "equipment_maintenance")
public class EquipmentMaintenance {
  @Id
  @GeneratedValue
  private UUID id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "equipment_id", nullable = false)
  private Equipment equipment;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "maintenance_type", nullable = false)
  private MaintenanceType maintenanceType;

  @NotNull
  @Column(name = "scheduled_date", nullable = false)
  private LocalDate scheduledDate;

  @Column(name = "completed_date")
  private LocalDate completedDate;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MaintenanceStatus status = MaintenanceStatus.SCHEDULED;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MaintenancePriority priority = MaintenancePriority.MEDIUM;

  // Service provider information
  @Column(name = "service_provider")
  private String serviceProvider;

  @Column(name = "service_contact")
  private String serviceContact;

  @Column(name = "technician_name")
  private String technicianName;

  // Cost tracking
  @Column(name = "estimated_cost", columnDefinition = "NUMERIC")
  private Double estimatedCost;

  @Column(name = "actual_cost", columnDefinition = "NUMERIC")
  private Double actualCost;

  @Column(name = "parts_cost", columnDefinition = "NUMERIC")
  private Double partsCost;

  @Column(name = "labor_cost", columnDefinition = "NUMERIC")
  private Double laborCost;

  // Work details
  @Column(name = "work_description", columnDefinition = "TEXT")
  private String workDescription;

  @Column(name = "parts_replaced", columnDefinition = "TEXT")
  private String partsReplaced;

  @Column(name = "work_performed", columnDefinition = "TEXT")
  private String workPerformed;

  // Condition tracking
  @Enumerated(EnumType.STRING)
  @Column(name = "condition_before")
  private Equipment.EquipmentCondition conditionBefore;

  @Enumerated(EnumType.STRING)
  @Column(name = "condition_after")
  private Equipment.EquipmentCondition conditionAfter;

  // Quality and warranty
  @Column(name = "quality_rating")
  private Integer qualityRating; // 1-5 scale

  @Column(name = "warranty_months")
  private Integer warrantyMonths;

  @Column(name = "warranty_expiration")
  private LocalDate warrantyExpiration;

  // Follow-up scheduling
  @Column(name = "next_maintenance_date")
  private LocalDate nextMaintenanceDate;

  @Column(name = "maintenance_interval_months")
  private Integer maintenanceIntervalMonths;

  // Notes and documentation
  @Column(name = "notes", columnDefinition = "TEXT")
  private String notes;

  @Column(name = "internal_notes", columnDefinition = "TEXT")
  private String internalNotes;

  // File attachments (receipts, photos, etc.)
  @Column(name = "attachment_urls")
  private String attachmentUrls; // JSON array of URLs

  // Audit fields
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by")
  private User createdBy;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "completed_by")
  private User completedBy;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at")
  private Instant updatedAt = Instant.now();

  // Constructors
  public EquipmentMaintenance() {}

  public EquipmentMaintenance(Equipment equipment, MaintenanceType type, LocalDate scheduledDate) {
    this.equipment = equipment;
    this.maintenanceType = type;
    this.scheduledDate = scheduledDate;
    this.conditionBefore = equipment.getCondition();
  }

  // Lifecycle callbacks
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }

  // Helper methods
  public boolean isOverdue() {
    return status == MaintenanceStatus.SCHEDULED && scheduledDate.isBefore(LocalDate.now());
  }

  public boolean isCompleted() {
    return status == MaintenanceStatus.COMPLETED && completedDate != null;
  }

  public boolean isWarrantyValid() {
    return warrantyExpiration != null && warrantyExpiration.isAfter(LocalDate.now());
  }

  public long getDaysOverdue() {
    if (!isOverdue()) return 0;
    return java.time.Period.between(scheduledDate, LocalDate.now()).getDays();
  }

  public boolean wasCostEffective() {
    return estimatedCost != null && actualCost != null && actualCost <= estimatedCost;
  }

  // Enums
  public enum MaintenanceType {
    PREVENTIVE("Preventive Maintenance"),
    REPAIR("Repair"),
    CLEANING("Deep Cleaning"),
    CALIBRATION("Calibration"),
    INSPECTION("Inspection"),
    UPGRADE("Upgrade"),
    REPLACEMENT("Parts Replacement");

    private final String displayName;

    MaintenanceType(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  public enum MaintenanceStatus {
    SCHEDULED("Scheduled"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    POSTPONED("Postponed");

    private final String displayName;

    MaintenanceStatus(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  public enum MaintenancePriority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High"),
    URGENT("Urgent");

    private final String displayName;

    MaintenancePriority(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  // Getters and Setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public Equipment getEquipment() { return equipment; }
  public void setEquipment(Equipment equipment) { this.equipment = equipment; }

  public MaintenanceType getMaintenanceType() { return maintenanceType; }
  public void setMaintenanceType(MaintenanceType maintenanceType) { this.maintenanceType = maintenanceType; }

  public LocalDate getScheduledDate() { return scheduledDate; }
  public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

  public LocalDate getCompletedDate() { return completedDate; }
  public void setCompletedDate(LocalDate completedDate) { this.completedDate = completedDate; }

  public MaintenanceStatus getStatus() { return status; }
  public void setStatus(MaintenanceStatus status) { this.status = status; }

  public MaintenancePriority getPriority() { return priority; }
  public void setPriority(MaintenancePriority priority) { this.priority = priority; }

  public String getServiceProvider() { return serviceProvider; }
  public void setServiceProvider(String serviceProvider) { this.serviceProvider = serviceProvider; }

  public String getServiceContact() { return serviceContact; }
  public void setServiceContact(String serviceContact) { this.serviceContact = serviceContact; }

  public String getTechnicianName() { return technicianName; }
  public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }

  public Double getEstimatedCost() { return estimatedCost; }
  public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

  public Double getActualCost() { return actualCost; }
  public void setActualCost(Double actualCost) { this.actualCost = actualCost; }

  public Double getPartsCost() { return partsCost; }
  public void setPartsCost(Double partsCost) { this.partsCost = partsCost; }

  public Double getLaborCost() { return laborCost; }
  public void setLaborCost(Double laborCost) { this.laborCost = laborCost; }

  public String getWorkDescription() { return workDescription; }
  public void setWorkDescription(String workDescription) { this.workDescription = workDescription; }

  public String getPartsReplaced() { return partsReplaced; }
  public void setPartsReplaced(String partsReplaced) { this.partsReplaced = partsReplaced; }

  public String getWorkPerformed() { return workPerformed; }
  public void setWorkPerformed(String workPerformed) { this.workPerformed = workPerformed; }

  public Equipment.EquipmentCondition getConditionBefore() { return conditionBefore; }
  public void setConditionBefore(Equipment.EquipmentCondition conditionBefore) { this.conditionBefore = conditionBefore; }

  public Equipment.EquipmentCondition getConditionAfter() { return conditionAfter; }
  public void setConditionAfter(Equipment.EquipmentCondition conditionAfter) { this.conditionAfter = conditionAfter; }

  public Integer getQualityRating() { return qualityRating; }
  public void setQualityRating(Integer qualityRating) { this.qualityRating = qualityRating; }

  public Integer getWarrantyMonths() { return warrantyMonths; }
  public void setWarrantyMonths(Integer warrantyMonths) { this.warrantyMonths = warrantyMonths; }

  public LocalDate getWarrantyExpiration() { return warrantyExpiration; }
  public void setWarrantyExpiration(LocalDate warrantyExpiration) { this.warrantyExpiration = warrantyExpiration; }

  public LocalDate getNextMaintenanceDate() { return nextMaintenanceDate; }
  public void setNextMaintenanceDate(LocalDate nextMaintenanceDate) { this.nextMaintenanceDate = nextMaintenanceDate; }

  public Integer getMaintenanceIntervalMonths() { return maintenanceIntervalMonths; }
  public void setMaintenanceIntervalMonths(Integer maintenanceIntervalMonths) { this.maintenanceIntervalMonths = maintenanceIntervalMonths; }

  public String getNotes() { return notes; }
  public void setNotes(String notes) { this.notes = notes; }

  public String getInternalNotes() { return internalNotes; }
  public void setInternalNotes(String internalNotes) { this.internalNotes = internalNotes; }

  public String getAttachmentUrls() { return attachmentUrls; }
  public void setAttachmentUrls(String attachmentUrls) { this.attachmentUrls = attachmentUrls; }

  public User getCreatedBy() { return createdBy; }
  public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

  public User getCompletedBy() { return completedBy; }
  public void setCompletedBy(User completedBy) { this.completedBy = completedBy; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}