package com.band.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "band_events")
public class BandEvent {
  @Id
  @GeneratedValue
  private UUID id;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @NotNull
  @Column(name = "event_date", nullable = false)
  private LocalDateTime eventDate;

  @Column(name = "end_date")
  private LocalDateTime endDate;

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "event_type", nullable = false)
  private EventType eventType;

  @Column
  private String venue;

  @Column(name = "venue_address", columnDefinition = "TEXT")
  private String venueAddress;

  // Event organization
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "director_id")
  private User director;

  @Column(name = "rehearsal_required")
  private Boolean rehearsalRequired = false;

  @Column(name = "rehearsal_date")
  private LocalDateTime rehearsalDate;

  @Column(name = "dress_code")
  private String dressCode;

  @Column(name = "arrival_time")
  private LocalDateTime arrivalTime;

  @Column(name = "setup_time")
  private LocalDateTime setupTime;

  @Column(name = "performance_time")
  private LocalDateTime performanceTime;

  // Equipment requirements
  @Column(name = "equipment_requirements", columnDefinition = "TEXT")
  private String equipmentRequirements; // JSON string

  @Column(name = "transportation_needed")
  private Boolean transportationNeeded = false;

  @Column(name = "equipment_transport", columnDefinition = "TEXT")
  private String equipmentTransport; // Transportation details

  // Participation tracking
  @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<EquipmentAssignment> equipmentAssignments = new HashSet<>();

  @Column(name = "required_participants", columnDefinition = "TEXT")
  private String requiredParticipants; // JSON array of user IDs or sections

  @Column(name = "optional_participants", columnDefinition = "TEXT")
  private String optionalParticipants;

  @Column(name = "confirmed_participants", columnDefinition = "TEXT")
  private String confirmedParticipants;

  // Event status and workflow
  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private EventStatus status = EventStatus.PLANNED;

  @Column(name = "approval_required")
  private Boolean approvalRequired = false;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "approved_by")
  private User approvedBy;

  @Column(name = "approved_at")
  private Instant approvedAt;

  // Budget and costs
  @Column(name = "budget_allocated", columnDefinition = "NUMERIC")
  private Double budgetAllocated;

  @Column(name = "actual_cost", columnDefinition = "NUMERIC")
  private Double actualCost;

  @Column(name = "revenue_expected", columnDefinition = "NUMERIC")
  private Double revenueExpected;

  @Column(name = "ticket_price", columnDefinition = "NUMERIC")
  private Double ticketPrice;

  // Communication
  @Column(name = "contact_person")
  private String contactPerson;

  @Column(name = "contact_email")
  private String contactEmail;

  @Column(name = "contact_phone")
  private String contactPhone;

  // Special requirements
  @Column(name = "special_requirements", columnDefinition = "TEXT")
  private String specialRequirements;

  @Column(name = "accessibility_requirements", columnDefinition = "TEXT")
  private String accessibilityRequirements;

  @Column(name = "equipment_setup_notes", columnDefinition = "TEXT")
  private String equipmentSetupNotes;

  // Media and documentation
  @Column(name = "photos_allowed")
  private Boolean photosAllowed = true;

  @Column(name = "recording_allowed")
  private Boolean recordingAllowed = false;

  @Column(name = "live_stream")
  private Boolean liveStream = false;

  @Column(name = "program_notes", columnDefinition = "TEXT")
  private String programNotes;

  // Weather and contingency (for outdoor events)
  @Column(name = "weather_contingency", columnDefinition = "TEXT")
  private String weatherContingency;

  @Column(name = "backup_venue")
  private String backupVenue;

  // Audit fields
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "created_by")
  private User createdBy;

  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at")
  private Instant updatedAt = Instant.now();

  @Column(name = "active", nullable = false)
  private Boolean active = true;

  // Constructors
  public BandEvent() {}

  public BandEvent(String name, LocalDateTime eventDate, EventType eventType, String venue) {
    this.name = name;
    this.eventDate = eventDate;
    this.eventType = eventType;
    this.venue = venue;
  }

  // Lifecycle callbacks
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }

  // Helper methods
  public boolean isUpcoming() {
    return eventDate.isAfter(LocalDateTime.now());
  }

  public boolean isToday() {
    return eventDate.toLocalDate().equals(java.time.LocalDate.now());
  }

  public boolean requiresEquipmentTransport() {
    return transportationNeeded != null && transportationNeeded;
  }

  public boolean isApproved() {
    return approvedBy != null && approvedAt != null;
  }

  public boolean isWithinBudget() {
    return budgetAllocated != null && actualCost != null && actualCost <= budgetAllocated;
  }

  public long getDaysUntilEvent() {
    return java.time.Duration.between(LocalDateTime.now(), eventDate).toDays();
  }

  // Event type enum
  public enum EventType {
    CONCERT("Concert"),
    COMPETITION("Competition"),
    PARADE("Parade"),
    FESTIVAL("Festival"),
    PRACTICE("Practice Session"),
    REHEARSAL("Rehearsal"),
    MASTERCLASS("Master Class"),
    RECORDING("Recording Session"),
    COMMUNITY_EVENT("Community Event"),
    FUNDRAISER("Fundraiser");

    private final String displayName;

    EventType(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  // Event status enum
  public enum EventStatus {
    PLANNED("Planned"),
    APPROVED("Approved"),
    CONFIRMED("Confirmed"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    POSTPONED("Postponed");

    private final String displayName;

    EventStatus(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  // Getters and Setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public LocalDateTime getEventDate() { return eventDate; }
  public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }

  public LocalDateTime getEndDate() { return endDate; }
  public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

  public EventType getEventType() { return eventType; }
  public void setEventType(EventType eventType) { this.eventType = eventType; }

  public String getVenue() { return venue; }
  public void setVenue(String venue) { this.venue = venue; }

  public String getVenueAddress() { return venueAddress; }
  public void setVenueAddress(String venueAddress) { this.venueAddress = venueAddress; }

  public User getDirector() { return director; }
  public void setDirector(User director) { this.director = director; }

  public Boolean getRehearsalRequired() { return rehearsalRequired; }
  public void setRehearsalRequired(Boolean rehearsalRequired) { this.rehearsalRequired = rehearsalRequired; }

  public LocalDateTime getRehearsalDate() { return rehearsalDate; }
  public void setRehearsalDate(LocalDateTime rehearsalDate) { this.rehearsalDate = rehearsalDate; }

  public String getDressCode() { return dressCode; }
  public void setDressCode(String dressCode) { this.dressCode = dressCode; }

  public LocalDateTime getArrivalTime() { return arrivalTime; }
  public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

  public LocalDateTime getSetupTime() { return setupTime; }
  public void setSetupTime(LocalDateTime setupTime) { this.setupTime = setupTime; }

  public LocalDateTime getPerformanceTime() { return performanceTime; }
  public void setPerformanceTime(LocalDateTime performanceTime) { this.performanceTime = performanceTime; }

  public String getEquipmentRequirements() { return equipmentRequirements; }
  public void setEquipmentRequirements(String equipmentRequirements) { this.equipmentRequirements = equipmentRequirements; }

  public Boolean getTransportationNeeded() { return transportationNeeded; }
  public void setTransportationNeeded(Boolean transportationNeeded) { this.transportationNeeded = transportationNeeded; }

  public String getEquipmentTransport() { return equipmentTransport; }
  public void setEquipmentTransport(String equipmentTransport) { this.equipmentTransport = equipmentTransport; }

  public Set<EquipmentAssignment> getEquipmentAssignments() { return equipmentAssignments; }
  public void setEquipmentAssignments(Set<EquipmentAssignment> equipmentAssignments) { this.equipmentAssignments = equipmentAssignments; }

  public String getRequiredParticipants() { return requiredParticipants; }
  public void setRequiredParticipants(String requiredParticipants) { this.requiredParticipants = requiredParticipants; }

  public String getOptionalParticipants() { return optionalParticipants; }
  public void setOptionalParticipants(String optionalParticipants) { this.optionalParticipants = optionalParticipants; }

  public String getConfirmedParticipants() { return confirmedParticipants; }
  public void setConfirmedParticipants(String confirmedParticipants) { this.confirmedParticipants = confirmedParticipants; }

  public EventStatus getStatus() { return status; }
  public void setStatus(EventStatus status) { this.status = status; }

  public Boolean getApprovalRequired() { return approvalRequired; }
  public void setApprovalRequired(Boolean approvalRequired) { this.approvalRequired = approvalRequired; }

  public User getApprovedBy() { return approvedBy; }
  public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }

  public Instant getApprovedAt() { return approvedAt; }
  public void setApprovedAt(Instant approvedAt) { this.approvedAt = approvedAt; }

  public Double getBudgetAllocated() { return budgetAllocated; }
  public void setBudgetAllocated(Double budgetAllocated) { this.budgetAllocated = budgetAllocated; }

  public Double getActualCost() { return actualCost; }
  public void setActualCost(Double actualCost) { this.actualCost = actualCost; }

  public Double getRevenueExpected() { return revenueExpected; }
  public void setRevenueExpected(Double revenueExpected) { this.revenueExpected = revenueExpected; }

  public Double getTicketPrice() { return ticketPrice; }
  public void setTicketPrice(Double ticketPrice) { this.ticketPrice = ticketPrice; }

  public String getContactPerson() { return contactPerson; }
  public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

  public String getContactEmail() { return contactEmail; }
  public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

  public String getContactPhone() { return contactPhone; }
  public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

  public String getSpecialRequirements() { return specialRequirements; }
  public void setSpecialRequirements(String specialRequirements) { this.specialRequirements = specialRequirements; }

  public String getAccessibilityRequirements() { return accessibilityRequirements; }
  public void setAccessibilityRequirements(String accessibilityRequirements) { this.accessibilityRequirements = accessibilityRequirements; }

  public String getEquipmentSetupNotes() { return equipmentSetupNotes; }
  public void setEquipmentSetupNotes(String equipmentSetupNotes) { this.equipmentSetupNotes = equipmentSetupNotes; }

  public Boolean getPhotosAllowed() { return photosAllowed; }
  public void setPhotosAllowed(Boolean photosAllowed) { this.photosAllowed = photosAllowed; }

  public Boolean getRecordingAllowed() { return recordingAllowed; }
  public void setRecordingAllowed(Boolean recordingAllowed) { this.recordingAllowed = recordingAllowed; }

  public Boolean getLiveStream() { return liveStream; }
  public void setLiveStream(Boolean liveStream) { this.liveStream = liveStream; }

  public String getProgramNotes() { return programNotes; }
  public void setProgramNotes(String programNotes) { this.programNotes = programNotes; }

  public String getWeatherContingency() { return weatherContingency; }
  public void setWeatherContingency(String weatherContingency) { this.weatherContingency = weatherContingency; }

  public String getBackupVenue() { return backupVenue; }
  public void setBackupVenue(String backupVenue) { this.backupVenue = backupVenue; }

  public User getCreatedBy() { return createdBy; }
  public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}