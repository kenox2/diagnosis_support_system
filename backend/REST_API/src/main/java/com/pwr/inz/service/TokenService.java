package com.pwr.inz.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenService {
    @Value("${SECRET_KEY}")
    private String secretKey;
    private static final long EXPIRATION_TIME = 3600000L;
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)  // You can include other user data here
                .setIssuedAt(new Date()) // Timestamp of token creation
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Set expiration time
                .signWith(SignatureAlgorithm.HS256, secretKey) // Sign with HS256 algorithm and the secret key
                .compact();
    }



    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            throw new RuntimeException("Invalid token", e);  // Handle invalid token scenario
        }
    }
}
