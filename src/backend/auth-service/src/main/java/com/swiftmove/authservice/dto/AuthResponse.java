package com.swiftmove.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AuthResponse {
    private String token;
    private String role;
    private Long userId;
    private String name;
    private String email;
}
