package com.swiftMove.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private LocalDate dob;

    private Float rating;

    private String role;

    private Long addressId;

    private LocalDate createdAt;

    private LocalDate updatedAt;
}
