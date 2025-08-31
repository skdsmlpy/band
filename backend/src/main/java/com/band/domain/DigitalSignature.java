package com.band.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "digital_signatures")
public class DigitalSignature {
  @Id
  @GeneratedValue
  private UUID id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @NotNull
  @Column(name = "signature_data", nullable = false, columnDefinition = "TEXT")
  private String signatureData; // Base64 encoded SVG or PNG

  @NotNull
  @Enumerated(EnumType.STRING)
  @Column(name = "signature_type", nullable = false)
  private SignatureType signatureType = SignatureType.GENERAL;

  @Size(max = 100)
  @Column(name = "signature_name")
  private String signatureName;

  // Signature metadata
  @Column(name = "signature_format")
  private String signatureFormat = "SVG"; // SVG, PNG, or JSON (for path data)

  @Column(name = "signature_width")
  private Integer signatureWidth;

  @Column(name = "signature_height")
  private Integer signatureHeight;

  @Column(name = "stroke_color")
  private String strokeColor = "#000000";

  @Column(name = "background_color")
  private String backgroundColor = "transparent";

  // Usage tracking
  @Column(name = "usage_count")
  private Integer usageCount = 0;

  @Column(name = "last_used_at")
  private Instant lastUsedAt;

  // Security and validation
  @Column(name = "signature_hash")
  private String signatureHash; // SHA-256 hash for integrity verification

  @Column(name = "is_verified")
  private Boolean isVerified = false;

  @Column(name = "verification_date")
  private Instant verificationDate;

  @Column(name = "verification_method")
  private String verificationMethod;

  // Legal and compliance
  @Column(name = "legal_name")
  private String legalName; // Full legal name for the signature

  @Column(name = "intent_statement", columnDefinition = "TEXT")
  private String intentStatement; // Statement of intent to sign

  @Column(name = "ip_address", columnDefinition = "INET")
  private String ipAddress; // IP address when signature was created

  @Column(name = "user_agent", columnDefinition = "TEXT")
  private String userAgent; // Browser/device info when created

  // Audit fields
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt = Instant.now();

  @Column(name = "updated_at")
  private Instant updatedAt = Instant.now();

  @Column(name = "active", nullable = false)
  private Boolean active = true;

  // Constructors
  public DigitalSignature() {}

  public DigitalSignature(User user, String signatureData, SignatureType type) {
    this.user = user;
    this.signatureData = signatureData;
    this.signatureType = type;
    this.legalName = user.getName();
  }

  // Lifecycle callbacks
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = Instant.now();
  }

  // Helper methods
  public void incrementUsage() {
    this.usageCount++;
    this.lastUsedAt = Instant.now();
  }

  public boolean isRecentlyUsed() {
    return lastUsedAt != null && 
           lastUsedAt.isAfter(Instant.now().minusSeconds(86400)); // 24 hours
  }

  public String getDisplayName() {
    if (signatureName != null && !signatureName.isEmpty()) {
      return signatureName;
    }
    return signatureType.getDisplayName() + " Signature";
  }

  // Signature type enum
  public enum SignatureType {
    GENERAL("General Purpose"),
    EQUIPMENT_CHECKOUT("Equipment Checkout"),
    EQUIPMENT_RETURN("Equipment Return"), 
    PERFORMANCE_CONSENT("Performance Consent"),
    MEDICAL_WAIVER("Medical Waiver"),
    PHOTO_RELEASE("Photo Release");

    private final String displayName;

    SignatureType(String displayName) {
      this.displayName = displayName;
    }

    public String getDisplayName() {
      return displayName;
    }
  }

  // Getters and Setters
  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }

  public User getUser() { return user; }
  public void setUser(User user) { this.user = user; }

  public String getSignatureData() { return signatureData; }
  public void setSignatureData(String signatureData) { this.signatureData = signatureData; }

  public SignatureType getSignatureType() { return signatureType; }
  public void setSignatureType(SignatureType signatureType) { this.signatureType = signatureType; }

  public String getSignatureName() { return signatureName; }
  public void setSignatureName(String signatureName) { this.signatureName = signatureName; }

  public String getSignatureFormat() { return signatureFormat; }
  public void setSignatureFormat(String signatureFormat) { this.signatureFormat = signatureFormat; }

  public Integer getSignatureWidth() { return signatureWidth; }
  public void setSignatureWidth(Integer signatureWidth) { this.signatureWidth = signatureWidth; }

  public Integer getSignatureHeight() { return signatureHeight; }
  public void setSignatureHeight(Integer signatureHeight) { this.signatureHeight = signatureHeight; }

  public String getStrokeColor() { return strokeColor; }
  public void setStrokeColor(String strokeColor) { this.strokeColor = strokeColor; }

  public String getBackgroundColor() { return backgroundColor; }
  public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

  public Integer getUsageCount() { return usageCount; }
  public void setUsageCount(Integer usageCount) { this.usageCount = usageCount; }

  public Instant getLastUsedAt() { return lastUsedAt; }
  public void setLastUsedAt(Instant lastUsedAt) { this.lastUsedAt = lastUsedAt; }

  public String getSignatureHash() { return signatureHash; }
  public void setSignatureHash(String signatureHash) { this.signatureHash = signatureHash; }

  public Boolean getIsVerified() { return isVerified; }
  public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

  public Instant getVerificationDate() { return verificationDate; }
  public void setVerificationDate(Instant verificationDate) { this.verificationDate = verificationDate; }

  public String getVerificationMethod() { return verificationMethod; }
  public void setVerificationMethod(String verificationMethod) { this.verificationMethod = verificationMethod; }

  public String getLegalName() { return legalName; }
  public void setLegalName(String legalName) { this.legalName = legalName; }

  public String getIntentStatement() { return intentStatement; }
  public void setIntentStatement(String intentStatement) { this.intentStatement = intentStatement; }

  public String getIpAddress() { return ipAddress; }
  public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

  public String getUserAgent() { return userAgent; }
  public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

  public Boolean getActive() { return active; }
  public void setActive(Boolean active) { this.active = active; }
}