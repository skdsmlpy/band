package com.band.web;

import com.band.domain.Task;
import com.band.repo.TaskRepository;
import com.band.repo.QueueRepository;
import com.band.security.JwtService;
import com.band.web.dto.AuthDtos;
import com.band.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class Controllers {
  private final AuthenticationManager authManager;
  private final UserRepository userRepository;
  private final PasswordEncoder encoder;
  private final JwtService jwtService;
  private final TaskRepository taskRepository;
  private final QueueRepository queueRepository;

  public Controllers(AuthenticationManager am, UserRepository ur, PasswordEncoder pe, JwtService js, TaskRepository tr, QueueRepository qr) {
    this.authManager = am; this.userRepository = ur; this.encoder = pe; this.jwtService = js; this.taskRepository = tr; this.queueRepository = qr;
  }

  @PostMapping("/auth/login")
  public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest req) {
    Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email, req.password));
    var user = userRepository.findByEmail(auth.getName()).orElseThrow();
    String token = jwtService.generate(user.getEmail(), user.getRole());
    AuthDtos.LoginResponse res = new AuthDtos.LoginResponse();
    res.token = token; res.name = user.getName(); res.role = user.getRole();
    return ResponseEntity.ok(res);
  }

  @GetMapping("/tasks")
  public Iterable<Task> tasks() { return taskRepository.findAll(); }

  @GetMapping("/queues")
  public Map<String, Object> queues() {
    long total = queueRepository.count();
    long tasks = taskRepository.count();
    return Map.of("queues", total, "tasks", tasks);
  }
}
