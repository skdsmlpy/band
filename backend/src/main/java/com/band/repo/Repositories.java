package com.band.repo;

import com.band.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
  Optional<User> findByEmail(String email);
}

public interface TaskRepository extends JpaRepository<Task, UUID> {}

public interface QueueRepository extends JpaRepository<QueueEntity, UUID> {}
