package com.band.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;

@Service
public class JwtService {
  @Value("${app.jwt.secret}")
  private String secret;

  @Value("${app.jwt.issuer}")
  private String issuer;

  @Value("${app.jwt.expirationMinutes}")
  private long expirationMinutes;

  public String generate(String subject, String role) {
    try {
      JWSSigner signer = new MACSigner(secret.getBytes());
      Instant now = Instant.now();
      JWTClaimsSet claims = new JWTClaimsSet.Builder()
          .subject(subject)
          .issuer(issuer)
          .issueTime(Date.from(now))
          .expirationTime(Date.from(now.plusSeconds(expirationMinutes * 60)))
          .claim("role", role)
          .build();
      SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
      jwt.sign(signer);
      return jwt.serialize();
    } catch (JOSEException e) {
      throw new RuntimeException("JWT signing failed", e);
    }
  }

  public Optional<JWTClaimsSet> validate(String token) {
    try {
      SignedJWT jwt = SignedJWT.parse(token);
      JWSVerifier verifier = new MACVerifier(secret.getBytes());
      if (!jwt.verify(verifier)) return Optional.empty();
      if (jwt.getJWTClaimsSet().getExpirationTime().before(new Date())) return Optional.empty();
      return Optional.of(jwt.getJWTClaimsSet());
    } catch (ParseException | JOSEException e) {
      return Optional.empty();
    }
  }
}
