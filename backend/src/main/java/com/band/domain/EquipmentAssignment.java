package com.band.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "equipment_assignments")
public class EquipmentAssignment {
  @Id
  @GeneratedValue
  private UUID id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "student_id", nullable = false)
  private User student;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "equipment_id", nullable = false)
  private Equipment equipment;

  @NotNull
  @Column(name = "checkout_date", nullable = false)
  private Instant checkoutDate;

  @Column(name = "expected_return_date")
  private Instant expectedReturnDate;

  @Column(name = "actual_return_date")
  private Instant actualReturnDate;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AssignmentStatus status;

  // Workflow and approval fields
  @Column(name = "checked_out_by")
  private UUID checkedOutBy;

  @Column(name = "returned_to")
  private UUID returnedTo;

  @Column(name = "peer_reviewer_id")
  private UUID peerReviewerId;

  @Column(name = "supervisor_approved_by")
  private UUID supervisorApprovedBy;

  // Condition tracking
  @Enumerated(EnumType.STRING)
  @Column(name = "checkout_condition")
  private Equipment.EquipmentCondition checkoutCondition;

  @Enumerated(EnumType.STRING)
  @Column(name = "return_condition")
  private Equipment.EquipmentCondition returnCondition;

  // Digital signatures
  @Column(name = "checkout_signature", columnDefinition = "TEXT")
  private String checkoutSignature; // Base64 encoded signature

  @Column(name = "return_signature", columnDefinition = "TEXT")
  private String returnSignature;

  // Purpose and event association
  @Column(name = "assignment_purpose")
  private String assignmentPurpose; // practice, performance, lesson

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "event_id")
  private BandEvent event;

  // Notes and comments
  @Column(name = "checkout_notes", columnDefinition = "TEXT")
  private String checkoutNotes;

  @Column(name = "return_notes", columnDefinition = "TEXT")
  private String returnNotes;

  @Column(name = "damage_notes", columnDefinition = "TEXT")
  private String damageNotes;

  // Audit fields
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at")
  private Instant updatedAt = Instant.now();

  // Constructors
  public EquipmentAssignment() {}

  public EquipmentAssignment(User student, Equipment equipment, String purpose) {
    this.student = student;
    this.equipment = equipment;
    this.assignmentPurpose = purpose;
    this.checkoutDate = Instant.now();
    this.status = AssignmentStatus.CHECKED_OUT;
    this.checkoutCondition = equipment.getCondition();
  }

  // Lifecycle callbacks
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }

  // Helper methods
  public boolean isOverdue() {
    return status == AssignmentStatus.CHECKED_OUT 
        && expectedReturnDate != null 
        && expectedReturnDate.isBefore(Instant.now());
  }

  public boolean isReturned() {
    return actualReturnDate != null;
  }

  public long getDaysOut() {
    if (isReturned()) {
      return java.time.Duration.between(checkoutDate, actualReturnDate).toDays();
    } else {
      return java.time.Duration.between(checkoutDate, Instant.now()).toDays();
    }
  }

  public boolean isDamaged() {
    return returnCondition != null && 
           checkoutCondition != null &&
           returnCondition.ordinal() > checkoutCondition.ordinal();
  }

  // Assignment status enum
  public enum AssignmentStatus {
    PENDING_CHECKOUT("Pending Checkout"),
    CHECKED_OUT("Checked Out"),
    PENDING_RETURN("Pending Return"),
    RETURNED("Returned"),
    OVERDUE("Overdue"),
    LOST("Lost"),
    DAMAGED("Damaged");

    private final String displayName;

    AssignmentStatus(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  // Getters and Setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public User getStudent() { return student; }
  public void setStudent(User student) { this.student = student; }

  public Equipment getEquipment() { return equipment; }
  public void setEquipment(Equipment equipment) { this.equipment = equipment; }

  public Instant getCheckoutDate() { return checkoutDate; }
  public void setCheckoutDate(Instant checkoutDate) { this.checkoutDate = checkoutDate; }

  public Instant getExpectedReturnDate() { return expectedReturnDate; }
  public void setExpectedReturnDate(Instant expectedReturnDate) { this.expectedReturnDate = expectedReturnDate; }

  public Instant getActualReturnDate() { return actualReturnDate; }
  public void setActualReturnDate(Instant actualReturnDate) { this.actualReturnDate = actualReturnDate; }

  public AssignmentStatus getStatus() { return status; }
  public void setStatus(AssignmentStatus status) { this.status = status; }

  public UUID getCheckedOutBy() { return checkedOutBy; }
  public void setCheckedOutBy(UUID checkedOutBy) { this.checkedOutBy = checkedOutBy; }

  public UUID getReturnedTo() { return returnedTo; }
  public void setReturnedTo(UUID returnedTo) { this.returnedTo = returnedTo; }

  public UUID getPeerReviewerId() { return peerReviewerId; }
  public void setPeerReviewerId(UUID peerReviewerId) { this.peerReviewerId = peerReviewerId; }

  public UUID getSupervisorApprovedBy() { return supervisorApprovedBy; }
  public void setSupervisorApprovedBy(UUID supervisorApprovedBy) { this.supervisorApprovedBy = supervisorApprovedBy; }

  public Equipment.EquipmentCondition getCheckoutCondition() { return checkoutCondition; }
  public void setCheckoutCondition(Equipment.EquipmentCondition checkoutCondition) { this.checkoutCondition = checkoutCondition; }

  public Equipment.EquipmentCondition getReturnCondition() { return returnCondition; }
  public void setReturnCondition(Equipment.EquipmentCondition returnCondition) { this.returnCondition = returnCondition; }

  public String getCheckoutSignature() { return checkoutSignature; }
  public void setCheckoutSignature(String checkoutSignature) { this.checkoutSignature = checkoutSignature; }

  public String getReturnSignature() { return returnSignature; }
  public void setReturnSignature(String returnSignature) { this.returnSignature = returnSignature; }

  public String getAssignmentPurpose() { return assignmentPurpose; }
  public void setAssignmentPurpose(String assignmentPurpose) { this.assignmentPurpose = assignmentPurpose; }

  public BandEvent getEvent() { return event; }
  public void setEvent(BandEvent event) { this.event = event; }

  public String getCheckoutNotes() { return checkoutNotes; }
  public void setCheckoutNotes(String checkoutNotes) { this.checkoutNotes = checkoutNotes; }

  public String getReturnNotes() { return returnNotes; }
  public void setReturnNotes(String returnNotes) { this.returnNotes = returnNotes; }

  public String getDamageNotes() { return damageNotes; }
  public void setDamageNotes(String damageNotes) { this.damageNotes = damageNotes; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}