package com.band.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue
  private UUID id;

  @Email
  @Column(nullable = false, unique = true)
  private String email;

  @NotBlank
  @Size(min = 8)
  @Column(nullable = false)
  private String password;

  @NotBlank
  @Column(nullable = false)
  private String name;

  @NotBlank
  @Column(nullable = false)
  private String role;

  // Enhanced user profile fields
  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "avatar_url")
  private String avatarUrl;

  @Column(name = "theme_preference")
  private String themePreference = "light";

  @Column(name = "notification_preferences")
  private String notificationPreferences = "{}"; // JSON string

  @Column(name = "timezone")
  private String timezone = "UTC";

  @Column(name = "language")
  private String language = "en";

  // Student-specific profile fields
  @Column(name = "grade_level")
  private Integer gradeLevel;

  @Column(name = "band_section")
  private String bandSection; // brass, woodwind, percussion, string

  @Column(name = "primary_instrument")
  private String primaryInstrument;

  @Column(name = "parent_contact")
  private String parentContact;

  @Column(name = "academic_standing")
  private String academicStanding = "good_standing";

  @Column(name = "enrollment_date")
  private Instant enrollmentDate;

  // Digital signature management
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<DigitalSignature> digitalSignatures = new HashSet<>();

  // Equipment assignments relationship
  @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private Set<EquipmentAssignment> equipmentAssignments = new HashSet<>();

  // Audit fields
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at")
  private Instant updatedAt = Instant.now();

  @Column(name = "last_login_at")
  private Instant lastLoginAt;

  @Column(name = "active", nullable = false)
  private Boolean active = true;

  // Constructors
  public User() {}

  public User(String email, String name, String role) {
    this.email = email;
    this.name = name;
    this.role = role;
  }

  // Lifecycle callbacks
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }

  // Helper methods
  public boolean isStudent() {
    return "Student".equals(this.role);
  }

  public boolean isBandDirector() {
    return "Band Director".equals(this.role);
  }

  public boolean isEquipmentManager() {
    return "Equipment Manager".equals(this.role);
  }

  public boolean hasActiveEquipmentAssignments() {
    return equipmentAssignments.stream()
        .anyMatch(assignment -> "checked_out".equals(assignment.getStatus()));
  }

  // Standard getters and setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getRole() { return role; }
  public void setRole(String role) { this.role = role; }

  public String getPhoneNumber() { return phoneNumber; }
  public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

  public String getAvatarUrl() { return avatarUrl; }
  public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

  public String getThemePreference() { return themePreference; }
  public void setThemePreference(String themePreference) { this.themePreference = themePreference; }

  public String getNotificationPreferences() { return notificationPreferences; }
  public void setNotificationPreferences(String notificationPreferences) { this.notificationPreferences = notificationPreferences; }

  public String getTimezone() { return timezone; }
  public void setTimezone(String timezone) { this.timezone = timezone; }

  public String getLanguage() { return language; }
  public void setLanguage(String language) { this.language = language; }

  public Integer getGradeLevel() { return gradeLevel; }
  public void setGradeLevel(Integer gradeLevel) { this.gradeLevel = gradeLevel; }

  public String getBandSection() { return bandSection; }
  public void setBandSection(String bandSection) { this.bandSection = bandSection; }

  public String getPrimaryInstrument() { return primaryInstrument; }
  public void setPrimaryInstrument(String primaryInstrument) { this.primaryInstrument = primaryInstrument; }

  public String getParentContact() { return parentContact; }
  public void setParentContact(String parentContact) { this.parentContact = parentContact; }

  public String getAcademicStanding() { return academicStanding; }
  public void setAcademicStanding(String academicStanding) { this.academicStanding = academicStanding; }

  public Instant getEnrollmentDate() { return enrollmentDate; }
  public void setEnrollmentDate(Instant enrollmentDate) { this.enrollmentDate = enrollmentDate; }

  public Set<DigitalSignature> getDigitalSignatures() { return digitalSignatures; }
  public void setDigitalSignatures(Set<DigitalSignature> digitalSignatures) { this.digitalSignatures = digitalSignatures; }

  public Set<EquipmentAssignment> getEquipmentAssignments() { return equipmentAssignments; }
  public void setEquipmentAssignments(Set<EquipmentAssignment> equipmentAssignments) { this.equipmentAssignments = equipmentAssignments; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Instant getLastLoginAt() { return lastLoginAt; }
  public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}
