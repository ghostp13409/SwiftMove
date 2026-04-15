package com.swiftmove.authservice.service;

import com.swiftmove.authservice.client.UserCreateRequest;
import com.swiftmove.authservice.client.UserDTO;
import com.swiftmove.authservice.client.UserServiceClient;
import com.swiftmove.authservice.dto.AuthResponse;
import com.swiftmove.authservice.dto.LoginRequest;
import com.swiftmove.authservice.dto.RegisterRequest;
import com.swiftmove.authservice.dto.UserInfoResponse;
import com.swiftmove.authservice.util.JwtTokenProvider;
import feign.FeignException;
import java.util.concurrent.CompletableFuture;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserServiceClient userServiceClient;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest registerRequest) {
        // Build the request to send to user-service
        UserCreateRequest createRequest = UserCreateRequest.builder()
            .userName(registerRequest.getUsername())
            .email(registerRequest.getEmail())
            .password(registerRequest.getPassword())
            .firstName(registerRequest.getFirstName())
            .lastName(registerRequest.getLastName())
            .dob(registerRequest.getDob())
            .role(
                registerRequest.getRole() != null
                    ? registerRequest.getRole()
                    : "CLIENT"
            )
            .build();

        UserDTO createdUser;
        try {
            createdUser = userServiceClient.createUser(createRequest);
        } catch (FeignException.Conflict e) {
            throw new RuntimeException("Email already registered");
        } catch (FeignException e) {
            throw new RuntimeException(
                "Failed to create user: " + e.getMessage()
            );
        }

        String token = jwtTokenProvider.generateToken(
            createdUser.getId(),
            createdUser.getEmail(),
            createdUser.getRole()
        );

        return AuthResponse.builder()
            .token(token)
            .role(createdUser.getRole())
            .userId(createdUser.getId())
            .name(createdUser.getFirstName() + " " + createdUser.getLastName())
            .email(createdUser.getEmail())
            .build();
    }

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            UserDTO user = userServiceClient.getUserByEmail(
                loginRequest.getEmail()
            );

            // Validate password against the stored hash returned by user-service
            if (
                !passwordEncoder.matches(
                    loginRequest.getPassword(),
                    user.getPasswordHash()
                )
            ) {
                throw new RuntimeException("Invalid email or password");
            }

            String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
            );

            return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .userId(user.getId())
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .build();
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("Invalid email or password", e);
        } catch (FeignException e) {
            throw new RuntimeException(
                "Failed to reach user-service: " + e.getMessage(),
                e
            );
        }
    }

    public UserDTO getUserInfo(Long userId) {
        UserDTO user;
        try {
            user = userServiceClient.getUserById(userId);
        } catch (FeignException.NotFound e) {
            throw new RuntimeException("User not found");
        } catch (FeignException e) {
            throw new RuntimeException(
                "Failed to reach user-service: " + e.getMessage()
            );
        }

        return user;
    }
}
