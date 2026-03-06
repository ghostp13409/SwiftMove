package com.swiftmove.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private LocalDate dob;
    private String role;
}
