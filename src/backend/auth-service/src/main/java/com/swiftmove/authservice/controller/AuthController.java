package com.swiftmove.authservice.controller;

import com.swiftmove.authservice.dto.AuthResponse;
import com.swiftmove.authservice.dto.LoginRequest;
import com.swiftmove.authservice.dto.RegisterRequest;
import com.swiftmove.authservice.dto.UserInfoResponse;
import com.swiftmove.authservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.login(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        try {
            AuthResponse authResponse = authService.register(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // JWT is stateless, logout is handled on client side by removing token
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkAuth(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();

        if (authHeader == null || authHeader.isEmpty()) {
            response.put("isAuthenticated", false);
            return ResponseEntity.ok(response);
        }

        // In a real implementation, we would validate the JWT here
        // For now, we just check if it exists
        try {
            // Extract user info from token (simplified - in production use JwtUtil to
            // parse)
            response.put("isAuthenticated", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("isAuthenticated", false);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // In a real implementation, we would parse the JWT and extract user info
            // This is a simplified version
            Map<String, Object> response = new HashMap<>();
            response.put("id", "1");
            response.put("email", "user@example.com");
            response.put("name", "User Name");
            response.put("role", "Client");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
