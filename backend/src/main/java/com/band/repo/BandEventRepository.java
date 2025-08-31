package com.band.repo;

import com.band.domain.BandEvent;
import com.band.domain.BandEvent.EventType;
import com.band.domain.BandEvent.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BandEventRepository extends JpaRepository<BandEvent, UUID> {
  
  // Event type and status queries
  List<BandEvent> findByEventType(EventType eventType);
  List<BandEvent> findByStatus(EventStatus status);
  List<BandEvent> findByEventTypeAndStatus(EventType eventType, EventStatus status);
  
  // Date-based queries
  List<BandEvent> findByEventDateBetween(LocalDateTime startDate, LocalDateTime endDate);
  List<BandEvent> findByEventDateAfter(LocalDateTime date);
  List<BandEvent> findByEventDateBefore(LocalDateTime date);
  List<BandEvent> findByEventDate(LocalDateTime date);
  
  // Venue queries
  List<BandEvent> findByVenue(String venue);
  List<BandEvent> findByVenueContainingIgnoreCase(String venueKeyword);
  
  // Name and description search
  @Query("SELECT be FROM BandEvent be WHERE " +
         "LOWER(be.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
         "LOWER(be.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
         "LOWER(be.venue) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
         "LOWER(be.venueAddress) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
  List<BandEvent> searchEvents(@Param("searchTerm") String searchTerm);
  
  // Upcoming events
  @Query("SELECT be FROM BandEvent be WHERE be.eventDate >= CURRENT_TIMESTAMP AND be.status != 'CANCELLED' ORDER BY be.eventDate ASC")
  List<BandEvent> findUpcomingEvents();
  
  @Query("SELECT be FROM BandEvent be WHERE be.eventDate >= CURRENT_TIMESTAMP AND be.eventDate <= :endDate AND be.status != 'CANCELLED' ORDER BY be.eventDate ASC")
  List<BandEvent> findUpcomingEventsUntil(@Param("endDate") LocalDateTime endDate);
  
  // Recent events
  @Query("SELECT be FROM BandEvent be WHERE be.eventDate <= CURRENT_TIMESTAMP ORDER BY be.eventDate DESC")
  List<BandEvent> findPastEvents();
  
  @Query("SELECT be FROM BandEvent be WHERE be.eventDate >= :startDate AND be.eventDate <= CURRENT_TIMESTAMP ORDER BY be.eventDate DESC")
  List<BandEvent> findRecentEventsSince(@Param("startDate") LocalDateTime startDate);
  
  // Events by month/year
  @Query("SELECT be FROM BandEvent be WHERE month(be.eventDate) = :month AND year(be.eventDate) = :year")
  List<BandEvent> findEventsByMonthAndYear(@Param("month") int month, @Param("year") int year);
  
  @Query("SELECT be FROM BandEvent be WHERE year(be.eventDate) = :year ORDER BY be.eventDate ASC")
  List<BandEvent> findEventsByYear(@Param("year") int year);
  
  // Equipment assignment related
  @Query("SELECT DISTINCT be FROM BandEvent be JOIN be.equipmentAssignments ea WHERE ea.id = :assignmentId")
  List<BandEvent> findEventsByEquipmentAssignment(@Param("assignmentId") UUID assignmentId);
  
  @Query("SELECT be FROM BandEvent be WHERE be.id IN (SELECT DISTINCT ea.event.id FROM EquipmentAssignment ea WHERE ea.equipment.id = :equipmentId)")
  List<BandEvent> findEventsByEquipmentUsage(@Param("equipmentId") UUID equipmentId);
  
  // Active events (current or soon)
  @Query(value = "SELECT * FROM band_events be WHERE be.status = 'ACTIVE' AND DATE(be.event_date) = CURRENT_DATE", nativeQuery = true)
  List<BandEvent> findCurrentEvents();
  
  @Query("SELECT be FROM BandEvent be WHERE be.status IN ('SCHEDULED', 'ACTIVE') AND be.eventDate BETWEEN CURRENT_TIMESTAMP AND :date")
  List<BandEvent> findActiveEventsUntil(@Param("date") LocalDateTime date);
  
  // Event statistics
  @Query("SELECT be.eventType, COUNT(be) FROM BandEvent be GROUP BY be.eventType")
  List<Object[]> countEventsByType();
  
  @Query("SELECT be.status, COUNT(be) FROM BandEvent be GROUP BY be.status")
  List<Object[]> countEventsByStatus();
  
  @Query("SELECT month(be.eventDate), COUNT(be) FROM BandEvent be " +
         "WHERE year(be.eventDate) = :year GROUP BY month(be.eventDate) ORDER BY month(be.eventDate)")
  List<Object[]> getEventCountByMonth(@Param("year") int year);
  
  // Equipment usage statistics for events
  @Query("SELECT COUNT(DISTINCT ea.equipment.id) FROM BandEvent be JOIN be.equipmentAssignments ea WHERE be.id = :eventId")
  long countEquipmentUsedInEvent(@Param("eventId") UUID eventId);
  
  @Query("SELECT be, COUNT(ea) FROM BandEvent be LEFT JOIN be.equipmentAssignments ea GROUP BY be ORDER BY COUNT(ea) DESC")
  List<Object[]> findEventsWithEquipmentUsageCount();
  
  // High equipment usage events
  @Query("SELECT be FROM BandEvent be JOIN be.equipmentAssignments ea GROUP BY be HAVING COUNT(ea) > :threshold ORDER BY COUNT(ea) DESC")
  List<BandEvent> findEventsWithHighEquipmentUsage(@Param("threshold") long threshold);
  
  // Event capacity and attendance - removed due to missing expectedAttendance field
  // TODO: Add attendance tracking fields to BandEvent entity if needed
  
  // Events requiring special equipment setup
  @Query("SELECT be FROM BandEvent be WHERE be.specialRequirements IS NOT NULL AND be.specialRequirements != ''")
  List<BandEvent> findEventsWithSpecialRequirements();
  
  // Additional methods for dashboard service
  List<BandEvent> findByEventDateAfterAndActiveTrueOrderByEventDate(Instant date);
  long countByEventDateAfterAndActiveTrue(Instant date);
}