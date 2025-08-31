package com.band.bootstrap;

import com.band.domain.User;
import com.band.repo.UserRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.annotation.PostConstruct;

@Component
public class DevDataLoader {
  private final UserRepository users;
  private final PasswordEncoder encoder;

  public DevDataLoader(UserRepository users, PasswordEncoder encoder) {
    this.users = users; this.encoder = encoder;
  }

  @PostConstruct
  @Transactional
  public void init() {
    users.findByEmail("admin@band.app").orElseGet(() -> {
      User u = new User();
      u.setEmail("admin@band.app");
      u.setName("Admin User");
      u.setRole("Admin");
      u.setPassword(encoder.encode("password"));
      return users.save(u);
    });

    users.findByEmail("operator@band.app").orElseGet(() -> {
      User u = new User();
      u.setEmail("operator@band.app");
      u.setName("Operator One");
      u.setRole("Operator");
      u.setPassword(encoder.encode("password"));
      return users.save(u);
    });
  }
}
