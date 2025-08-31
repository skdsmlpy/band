package com.band.repo;

import com.band.domain.DigitalSignature;
import com.band.domain.DigitalSignature.SignatureType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DigitalSignatureRepository extends JpaRepository<DigitalSignature, UUID> {
  
  // User-related queries
  List<DigitalSignature> findByUser_Id(UUID userId);
  List<DigitalSignature> findByUser_Email(String email);
  
  // Removed - DigitalSignature does not have equipmentAssignment relationship
  // TODO: Implement proper relationship between DigitalSignature and EquipmentAssignment if needed
  // Assignment-related queries
  // List<DigitalSignature> findByEquipmentAssignment_Id(UUID assignmentId);
  // Optional<DigitalSignature> findByEquipmentAssignment_IdAndSignatureType(UUID assignmentId, SignatureType type);
  
  // Signature type queries
  List<DigitalSignature> findBySignatureType(SignatureType type);
  List<DigitalSignature> findByUser_IdAndSignatureType(UUID userId, SignatureType type);
  
  // Date-based queries  
  List<DigitalSignature> findByCreatedAtBetween(Instant startDate, Instant endDate);
  List<DigitalSignature> findByCreatedAtAfter(Instant date);
  
  // Removed - DigitalSignature does not have equipmentAssignment relationship
  // TODO: Implement proper relationship between DigitalSignature and EquipmentAssignment if needed
  // Assignment checkout/return signatures
  // @Query("SELECT ds FROM DigitalSignature ds WHERE ds.equipmentAssignment.id = :assignmentId AND ds.signatureType = 'CHECKOUT'")
  // Optional<DigitalSignature> findCheckoutSignature(@Param("assignmentId") UUID assignmentId);
  
  // @Query("SELECT ds FROM DigitalSignature ds WHERE ds.equipmentAssignment.id = :assignmentId AND ds.signatureType = 'RETURN'")
  // Optional<DigitalSignature> findReturnSignature(@Param("assignmentId") UUID assignmentId);
  
  // @Query("SELECT ds FROM DigitalSignature ds WHERE ds.equipmentAssignment.id = :assignmentId AND ds.signatureType = 'DAMAGE_REPORT'")
  // List<DigitalSignature> findDamageReportSignatures(@Param("assignmentId") UUID assignmentId);
  
  // User signature history
  @Query("SELECT ds FROM DigitalSignature ds WHERE ds.user.id = :userId ORDER BY ds.createdAt DESC")
  List<DigitalSignature> findUserSignatureHistory(@Param("userId") UUID userId);
  
  // Recent signatures
  @Query("SELECT ds FROM DigitalSignature ds WHERE ds.createdAt >= :since ORDER BY ds.createdAt DESC")
  List<DigitalSignature> findRecentSignatures(@Param("since") Instant since);
  
  // Statistical queries
  @Query("SELECT ds.signatureType, COUNT(ds) FROM DigitalSignature ds GROUP BY ds.signatureType")
  List<Object[]> countSignaturesByType();
  
  @Query("SELECT date(ds.createdAt), COUNT(ds) FROM DigitalSignature ds " +
         "WHERE ds.createdAt >= :startDate GROUP BY date(ds.createdAt) ORDER BY date(ds.createdAt)")
  List<Object[]> getSignatureStatsByDate(@Param("startDate") Instant startDate);
  
  // Removed - DigitalSignature does not have equipmentAssignment relationship
  // TODO: Implement proper relationship between DigitalSignature and EquipmentAssignment if needed
  
  // Removed - DigitalSignature does not have equipmentAssignment relationship
  // TODO: Implement proper relationship between DigitalSignature and EquipmentAssignment if needed
  
  // Removed - DigitalSignature does not have equipmentAssignment relationship
  // TODO: Implement proper relationship between DigitalSignature and EquipmentAssignment if needed
  
  // IP address and device tracking for audit
  List<DigitalSignature> findByIpAddress(String ipAddress);
  List<DigitalSignature> findByUserAgent(String userAgent);
  
  // Signature validation queries
  @Query("SELECT ds FROM DigitalSignature ds WHERE ds.signatureData IS NOT NULL AND LENGTH(ds.signatureData) > 0")
  List<DigitalSignature> findValidSignatures();
  
  @Query("SELECT ds FROM DigitalSignature ds WHERE ds.signatureData IS NULL OR LENGTH(ds.signatureData) = 0")
  List<DigitalSignature> findInvalidSignatures();
  
  // Additional method for dashboard service
  List<DigitalSignature> findByUserIdAndActiveTrue(UUID userId);
}