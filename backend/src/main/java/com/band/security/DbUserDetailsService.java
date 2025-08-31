package com.band.security;

import com.band.repo.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DbUserDetailsService implements UserDetailsService {
  private final UserRepository repo;
  public DbUserDetailsService(UserRepository repo) { this.repo = repo; }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return repo.findByEmail(username)
        .map(u -> User.withUsername(u.getEmail()).password(u.getPassword()).roles(u.getRole()).build())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }
}
