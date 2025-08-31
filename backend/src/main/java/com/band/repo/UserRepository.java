package com.band.repo;

import com.band.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);
  long countByRoleAndActiveTrue(String role);
  
  // Additional queries for band system
  List<User> findByRoleAndActiveTrue(String role);
  List<User> findByBandSectionAndActiveTrue(String bandSection);
  List<User> findByGradeLevelAndActiveTrue(Integer gradeLevel);
  
  @Query("SELECT u FROM User u WHERE u.role = :role AND u.academicStanding = :standing AND u.active = true")
  List<User> findByRoleAndAcademicStanding(@Param("role") String role, @Param("standing") String standing);
  
  @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'STUDENT' AND u.active = true")
  long countActiveStudents();
  
  @Query("SELECT u FROM User u WHERE u.primaryInstrument = :instrument AND u.active = true")
  List<User> findByPrimaryInstrument(@Param("instrument") String instrument);
}