package com.swiftmove.authservice.service;

import com.swiftmove.authservice.dto.AuthResponse;
import com.swiftmove.authservice.dto.LoginRequest;
import com.swiftmove.authservice.dto.RegisterRequest;
import com.swiftmove.authservice.dto.UserInfoResponse;
import com.swiftmove.authservice.model.AuthUser;
import com.swiftmove.authservice.repo.AuthUserRepository;
import com.swiftmove.authservice.util.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthUserRepository authUserRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if user already exists
        if (authUserRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        AuthUser authUser = AuthUser.builder()
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .role(registerRequest.getRole() != null ? registerRequest.getRole() : "Client")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        AuthUser savedUser = authUserRepository.save(authUser);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        // Return response
        return AuthResponse.builder()
                .token(token)
                .role(savedUser.getRole())
                .userId(savedUser.getId())
                .name(savedUser.getFirstName() + " " + savedUser.getLastName())
                .email(savedUser.getEmail())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by email
        Optional<AuthUser> authUserOptional = authUserRepository.findByEmail(loginRequest.getEmail());

        if (authUserOptional.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        AuthUser authUser = authUserOptional.get();

        // Check password
        if (!passwordEncoder.matches(loginRequest.getPassword(), authUser.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is active
        if (!authUser.getIsActive()) {
            throw new RuntimeException("User account is inactive");
        }

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(authUser.getId(), authUser.getEmail(), authUser.getRole());

        // Return response
        return AuthResponse.builder()
                .token(token)
                .role(authUser.getRole())
                .userId(authUser.getId())
                .name(authUser.getFirstName() + " " + authUser.getLastName())
                .email(authUser.getEmail())
                .build();
    }

    public UserInfoResponse getUserInfo(Long userId) {
        Optional<AuthUser> authUserOptional = authUserRepository.findById(userId);

        if (authUserOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        AuthUser authUser = authUserOptional.get();

        return UserInfoResponse.builder()
                .id(authUser.getId())
                .email(authUser.getEmail())
                .name(authUser.getFirstName() + " " + authUser.getLastName())
                .role(authUser.getRole())
                .build();
    }
}
