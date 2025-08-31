package com.band.web.dto;

public class AuthDtos {
  public static class LoginRequest {
    public String email;
    public String password;
  }
  public static class LoginResponse {
    public String token;
    public String name;
    public String role;
  }
}
