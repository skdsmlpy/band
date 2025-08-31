package com.band.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "queues")
public class QueueEntity {
  @Id
  @GeneratedValue
  private UUID id;

  @Column(nullable = false)
  private String name;

  public UUID getId() { return id; }
  public void setId(UUID id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
}
